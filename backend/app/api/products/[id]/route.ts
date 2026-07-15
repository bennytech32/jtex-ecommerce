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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: id } });
    return NextResponse.json({ message: "Bidhaa imefutwa kikamilifu" }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: "Kosa la kufuta: " + error.message }, { status: 500, headers: corsHeaders });
  }
}

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

    const imageFiles = formData.getAll('images');
    let uploadedUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (typeof file === 'object' && file !== null && 'arrayBuffer' in file) {
          const bytes = await (file as any).arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const originalName = (file as any).name || `jtex-img-${Math.floor(Math.random() * 10000)}.jpg`;
          const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
          
          const uploadDir = path.join(process.cwd(), 'public/uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          
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

    if (uploadedUrls.length > 0) {
      dataToUpdate.imageUrl = JSON.stringify(uploadedUrls);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id }, 
      data: dataToUpdate
    });

    return NextResponse.json(updatedProduct, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: "Kosa la kusasisha: " + error.message }, { status: 500, headers: corsHeaders });
  }
}