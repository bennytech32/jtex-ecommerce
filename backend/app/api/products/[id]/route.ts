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

// Kushughulikia Preflight Requests (Kuzuia NetworkError)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// ==========================================
// 1. KUFUTA BIDHAA (DELETE)
// ==========================================
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await prisma.product.delete({
      where: { id: id } 
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

// ==========================================
// 2. KUHARIRI/KUSASISHA BIDHAA (PUT) PAMOJA NA PICHA
// ==========================================
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    // Logic ya kubadili picha (Kama ameweka picha mpya)
    const imageFile = formData.get('images') as File | null;
    let finalImageUrl = undefined;

    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      finalImageUrl = `/uploads/${fileName}`;
    }

    // Kuandaa data za kusasisha
    const dataToUpdate: any = {
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
    };

    // Kama picha mpya imewekwa, iunganishe. Kama hakuna, itabaki na picha ya zamani
    if (finalImageUrl) {
      dataToUpdate.imageUrl = finalImageUrl;
    }

    // Kusasisha kwenye Database
    const updatedProduct = await prisma.product.update({
      where: { id: id }, 
      data: dataToUpdate
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