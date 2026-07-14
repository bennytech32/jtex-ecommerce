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
    
    // --- HIZI NDIO FIELDS MPYA TULIZOONGEZA ---
    const badge = formData.get('badge') as string;
    const condition = formData.get('condition') as string;

    // Hapa tuna-save kwenye database
    const newProduct = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        brand,
        buyingPrice: parseFloat(buyingPrice) || 0,
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
        specifications,
        
        // --- HAPA TUNAZIINGIZA KWENYE DATABASE ---
        badge: badge || "", 
        condition: condition || "Brand New",
        
        // Kumbuka: imageUrl inabidi uwe umeifanyia handling kule juu kabla ya hapa
        // Kama huna logic ya ku-upload picha bado, unaweza kuweka ""
        imageUrl: "" 
      },
    });

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("Backend Error:", error);
    // Hapa ndio tunarudisha ujumbe halisi wa kosa (Kuna tatizo kuweka bidhaa)
    return NextResponse.json(
      { error: "Kuna tatizo kuweka bidhaa: " + error.message }, 
      { status: 500 }
    );
  }
}

// Handler ya GET (Kusoma bidhaa)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Imeshindwa kupata bidhaa" }, { status: 500 });
  }
}