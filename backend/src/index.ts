console.log("⏳ Najaribu kuwasha server...");

import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const app = express();
const PORT = 5001; 
const JWT_SECRET = process.env.JWT_SECRET || 'siri_nzito_ya_jtex_2026';

// ==========================================
// MFUMO WA KUHIFADHI PICHA (MULTER)
// ==========================================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// 0. HEALTH CHECK
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'success', message: 'Jtex Backend Server inafanya kazi vizuri 🚀' });
});

// ==========================================
// 1. USAJILI (REGISTER)
// ==========================================
app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: 'Tafadhali jaza taarifa zote muhimu.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Barua pepe hii imeshatumika na mteja mwingine!' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Akaunti imetengenezwa kikamilifu!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kwenye server.' });
  }
});

// ==========================================
// 2. KUINGIA (LOGIN)
// ==========================================
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Tafadhali jaza barua pepe na nywila.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Barua pepe au nywila sio sahihi.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Barua pepe au nywila sio sahihi.' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Umefanikiwa kuingia!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kwenye server.' });
  }
});

// ==========================================
// 3. BIDHAA & INVENTORY (PRODUCTS)
// ==========================================
app.post('/api/products', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { sku, name, description, category, brand, buyingPrice, price, oldPrice, stockQuantity, lowStockAlert, specifications } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { sku } });
    if (existingProduct) {
      res.status(400).json({ error: 'Namba ya SKU imeshatumika. Tafadhali weka nyingine.' });
      return;
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        description: description || '',
        category,
        brand: brand || '',
        buyingPrice: Number(buyingPrice) || 0,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stockQuantity: Number(stockQuantity) || 0,
        lowStockAlert: Number(lowStockAlert) || 5,
        inStock: Number(stockQuantity) > 0,
        specifications: specifications || '',
        imageUrl: imageUrl,
      },
    });

    res.status(201).json({ message: 'Bidhaa imewekwa kikamilifu!', product: newProduct });
  } catch (error) {
    console.error('Product Add Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuweka bidhaa.' });
  }
});

app.get('/api/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuvuta bidhaa.' });
  }
});

// ==========================================
// 4. DASHBOARD (CEO OVERVIEW)
// ==========================================
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const lowStock = await prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } });
    const outOfStock = await prisma.product.count({ where: { stockQuantity: 0 } });
    
    const products = await prisma.product.findMany({ select: { buyingPrice: true, stockQuantity: true } });
    const inventoryValue = products.reduce((jumla, bidhaa) => jumla + (bidhaa.buyingPrice * bidhaa.stockQuantity), 0);
    
    const totalUsers = await prisma.user.count();

    res.json({ totalProducts, lowStock, outOfStock, inventoryValue, totalUsers });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuvuta takwimu.' });
  }
});

// ==========================================
// 5. ODA NA USAFIRISHAJI (ORDERS)
// ==========================================
app.get('/api/orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, phone: true } },
        items: { include: { product: { select: { name: true, imageEmoji: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuvuta orodha ya oda.' });
  }
});

app.post('/api/orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, items, deliveryRegion, address, paymentMethod, shippingFee, upfrontPayment } = req.body;

    let totalAmount = Number(shippingFee);
    items.forEach((item: any) => { totalAmount += Number(item.subTotal); });

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingFee: Number(shippingFee),
        upfrontPayment: Number(upfrontPayment),
        deliveryRegion,
        address,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            subTotal: Number(item.subTotal)
          }))
        }
      }
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: Number(item.quantity) } }
      });
    }

    res.status(201).json({ message: 'Oda yako imepokelewa kikamilifu!', order: newOrder });
  } catch (error) {
    console.error('Order Create Error:', error);
    res.status(500).json({ error: 'Kuna tatizo wakati wa kutuma oda.' });
  }
});

app.put('/api/orders/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await prisma.order.update({ where: { id }, data: { status } });
    res.status(200).json({ message: 'Hali ya oda imebadilishwa kikamilifu!', order: updatedOrder });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kubadili hali ya oda.' });
  }
});

// ==========================================
// 6. WATEJA NA WAUZAJI (USERS & VENDORS)
// ==========================================
app.get('/api/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: { vendorProfile: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuvuta wateja.' });
  }
});

// ==========================================
// 7. FEDHA (FINANCE & TRANSACTIONS)
// ==========================================
app.get('/api/finance', async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.financeTransaction.findMany({ orderBy: { date: 'desc' } });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Fetch Finance Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuvuta miamala.' });
  }
});

app.post('/api/finance', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, category, amount, description } = req.body;
    const newTransaction = await prisma.financeTransaction.create({
      data: {
        type, 
        category,
        amount: Number(amount),
        description: description || ''
      }
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Add Finance Error:', error);
    res.status(500).json({ error: 'Kuna tatizo kuweka muamala.' });
  }
});

// ==========================================
// WASHA SERVER YETU
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Jtex Backend inakimbia kwenye http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error("❌ Kosa limetokea wakati wa kuwasha:", err);
});