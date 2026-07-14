import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- HEADERS ZA CORS ILI MAWASILIANO YASIBLO KIWE NA BROWSER ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Inaruhusu domain zote pamoja na jtexafrica.com
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Kushughulikia Preflight Requests (OPTIONS) - Hii ni lazima kwa sababu ya CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Kuchukua data kutoka kwenye FormData
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
        imageUrl: "" 
      },
    });

    // Tunarudisha majibu yakiwa na CORS headers
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