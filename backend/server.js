const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Washa matumizi ya .env (Kama unatumia)
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ==========================================
// MIDDLEWARES
// ==========================================
// Ruhusu Frontend iwasiliane na Backend (Next.js kwenye port 3000 au Vercel)
app.use(cors({
  origin: '*', // Kwa usalama zaidi baadaye weka URL ya frontend yako
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CLOUDINARY & MULTER UPLOAD SETUP
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zy7bva4b',
  api_key: process.env.CLOUDINARY_API_KEY || '454715668631514',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1oGzbaFEkFOBUAwicng9S08bibs'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jtex_products', // Folder litakalotengenezwa kule Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({ storage: storage });

// ==========================================
// HEALTH CHECK ROUTE
// ==========================================
app.get('/', (req, res) => {
  res.send('Jtex E-Commerce Backend is Running Perfectly! 🚀');
});

// ==========================================
// KATEGORIA (CATEGORIES) API ROUTES
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Imeshindwa kusoma kategoria' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Jina linahitajika' });

    const newCategory = await prisma.category.create({ data: { name } });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Kategoria hii ipo tayari' });
    res.status(500).json({ error: 'Imeshindwa kuhifadhi kategoria' });
  }
});

// ==========================================
// SPECIFICATIONS TEMPLATES API ROUTES
// ==========================================
app.get('/api/spec-templates', async (req, res) => {
  try {
    const templates = await prisma.specTemplate.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Imeshindwa kusoma templates' });
  }
});

app.post('/api/spec-templates', async (req, res) => {
  try {
    const { title, fields } = req.body;
    if (!title || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Taarifa hazijakamilika' });
    }
    const newTemplate = await prisma.specTemplate.create({
      data: { title, fields }
    });
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Imeshindwa kuhifadhi template' });
  }
});

// ==========================================
// PRODUCTS API ROUTES
// ==========================================

// 1. Kusoma bidhaa zote
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kosa la mtandao wakati wa kuvuta bidhaa.' });
  }
});

// 2. Kusoma bidhaa moja
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Bidhaa haijapatikana' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Kosa la mtandao.' });
  }
});

// 3. Kuweka bidhaa mpya (Pamoja na Picha Cloudinary)
app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      sku, name, category, brand, model, badge, condition, 
      buyingPrice, price, stockQuantity, specifications, preOrderInfo 
    } = req.body;

    // Kusanya Link za picha zilizorudi kutoka Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path); // Hapa file.path ni URL ya Cloudinary
    }

    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        brand,
        model,
        badge,
        condition,
        buyingPrice: buyingPrice ? Number(buyingPrice) : null,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        specifications,
        preOrderInfo,
        imageUrl: JSON.stringify(imageUrls)
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Kosa la kuongeza bidhaa:', error);
    if (error.code === 'P2002') return res.status(400).json({ error: 'SKU hii tayari inatumika.' });
    res.status(500).json({ error: 'Imeshindwa kuhifadhi bidhaa. Jaribu tena.' });
  }
});

// 4. Kuedit bidhaa
app.put('/api/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      sku, name, category, brand, model, badge, condition, 
      buyingPrice, price, stockQuantity, specifications, preOrderInfo 
    } = req.body;

    // Tafuta bidhaa ya zamani kwanza
    const existingProduct = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existingProduct) return res.status(404).json({ error: 'Bidhaa haipatikani' });

    let finalImageUrls = existingProduct.imageUrl ? JSON.parse(existingProduct.imageUrl) : [];

    // Kama kuna picha mpya zimeingia, zifunike zile za zamani
    if (req.files && req.files.length > 0) {
      finalImageUrls = req.files.map(file => file.path);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        sku,
        name,
        category,
        brand,
        model,
        badge,
        condition,
        buyingPrice: buyingPrice ? Number(buyingPrice) : null,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        specifications,
        preOrderInfo,
        imageUrl: JSON.stringify(finalImageUrls)
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Kosa la kuedit bidhaa:', error);
    res.status(500).json({ error: 'Imeshindwa kusasisha bidhaa.' });
  }
});

// 5. Kufuta bidhaa
app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Bidhaa imefutwa kikamilifu.' });
  } catch (error) {
    res.status(500).json({ error: 'Imeshindwa kufuta bidhaa.' });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server imewaka na inafanya kazi kwenye port ${PORT}`);
});