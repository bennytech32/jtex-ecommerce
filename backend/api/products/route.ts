import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    
    // Fields Mpya
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
        
        // Hapa tunaziingiza kwenye database
        badge: badge || "", 
        condition: condition || "Brand New",
        imageUrl: "" 
      },
    });

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("Backend Error Detail:", error);
    // TUNAWEKA UJUMBE TOFAUTI ILI TUJUE KAMA CODE MPYA INASOMA
    return NextResponse.json(
      { error: "KOSA JIPYA LA BACKEND: " + error.message }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: "Imeshindwa kupata bidhaa: " + error.message }, { status: 500 });
  }
}