import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- HEADERS ZA CORS ILI MAWASILIANO YASIBLOKIWE ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Kushughulikia Preflight Requests (Kuzuia NetworkError)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// KUFUTA BIDHAA (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await prisma.product.delete({
      where: { id: id } // Kama ID yako ni namba, badilisha iwe: parseInt(id)
    });

    return NextResponse.json({ message: "Bidhaa imefutwa kikamilifu" }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Kosa la kufuta: " + error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

// KUHARIRI/KUSASISHA BIDHAA (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    
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

    const updatedProduct = await prisma.product.update({
      where: { id: id }, // Kama ID yako ni namba, badilisha iwe: parseInt(id)
      data: {
        sku,
        name,
        category,
        brand,
        buyingPrice: parseFloat(buyingPrice) || 0,
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
        specifications,
        badge: badge || "", 
        condition: condition || "Brand New"
      }
    });

    return NextResponse.json(updatedProduct, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Kosa la kusasisha: " + error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}