import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
// 2. KUHARIRI/KUSASISHA BIDHAA (PUT) 
// ==========================================
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
    const model = formData.get('model') as string;

    // TUNAIPOKEA PICHA MPYA ZOTE (KAMA ZIPO)
    const imageFiles = formData.getAll('images') as File[];
    let uploadedUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        if (imageFile.name) {
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
          const uploadDir = path.join(process.cwd(), 'public/uploads');
          
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          
          // MABADILIKO YA API YAMEFANYIKA HAPA CHINI PIS
          uploadedUrls.push(`/api/uploads/${fileName}`);
        }
      }
    }

    let finalSpecs = {};
    try { finalSpecs = JSON.parse(specifications || '{}'); } catch(e) {}
    if (model) { (finalSpecs as any).Model = model; }

    const dataToUpdate: any = {
      sku,
      name,
      category,
      brand,
      buyingPrice: parseFloat(buyingPrice) || 0,
      price: parseFloat(price) || 0,
      stockQuantity: parseInt(stockQuantity) || 0,
      specifications: JSON.stringify(finalSpecs),
      badge: badge || "", 
      condition: condition || "Brand New"
    };

    // Kama kuna picha mpya zimewekwa, tunabadilisha zilizopo
    if (uploadedUrls.length > 0) {
      dataToUpdate.imageUrl = JSON.stringify(uploadedUrls);
    }

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