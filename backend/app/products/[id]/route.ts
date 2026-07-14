import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// --- HEADERS ZA CORS ILI MAWASILIANO YASIBLOKIWE ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Kuchukua data za kawaida
    const sku = formData.get('sku') as string;
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const buyingPrice = formData.get('buyingPrice') as string;
    const price = formData.get('price') as string;
    const stockQuantity = formData.get('stockQuantity') as string;
    const specifications = formData.get('specifications') as string;
    const badge = formData.get('badge') as string;
    const condition = formData.get('condition') as string;

    // ==========================================
    // LOGIC YA KUPOKEA NA KUSAVE PICHA
    // ==========================================
    const imageFile = formData.get('images') as File | null;
    let finalImageUrl = "";

    if (imageFile && imageFile.name) {
      // Badili file liwe buffer ili kompyuta iweze kulisave
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Tengeneza jina la picha lisijirudie (Mfano: 1689...-picha.jpg)
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      
      // Njia ya kuhifadhi picha kwenye folder la 'public/uploads'
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      // Kama folder la 'uploads' halipo, litengenezwe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Hifadhi picha rasmi kwenye mfumo
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Link itakayoenda kwenye Database
      finalImageUrl = `/uploads/${fileName}`;
    }

    // Hapa tuna-save kwenye database
    const newProduct = await prisma.product.create({
      data: {
        sku: sku || `SKU-${Date.now()}`,
        name: name || "Bidhaa Mpya",
        category: category || "Other",
        brand: brand || "",
        buyingPrice: parseFloat(buyingPrice) || 0,
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
        specifications: specifications || "{}",
        badge: badge || "", 
        condition: condition || "Brand New",
        imageUrl: finalImageUrl // PICHA INAINGIA RASMI HAPA
      },
    });

    return NextResponse.json(newProduct, { status: 201, headers: corsHeaders });

  } catch (error: any) {
    console.error("Backend Error Detail:", error);
    return NextResponse.json(
      { error: "KOSA LA BACKEND: " + error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Imeshindwa kupata bidhaa: " + error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}