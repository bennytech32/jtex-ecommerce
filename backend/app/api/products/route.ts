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
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
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

    // LOGIC IMARA YA KUPOKEA PICHA HATA KAMA JINA LIMEFICHWA
    const imageFiles = formData.getAll('images'); 
    let uploadedUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        // Kuhakikisha file lina arrayBuffer (Ni faili kamili)
        if (typeof file === 'object' && file !== null && 'arrayBuffer' in file) {
          const bytes = await (file as any).arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Jina la dharura endapo Next.js itaficha jina halisi la picha
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

    const finalImageUrl = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : "";

    let finalSpecs = {};
    try { finalSpecs = JSON.parse(specifications || '{}'); } catch(e) {}
    if (model) { (finalSpecs as any).Model = model; }

    const newProduct = await prisma.product.create({
      data: {
        sku: sku || `SKU-${Date.now()}`,
        name: name || "Bidhaa Mpya",
        category: category || "Other",
        brand: brand || "",
        buyingPrice: parseFloat(buyingPrice) || 0,
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
        specifications: JSON.stringify(finalSpecs), 
        badge: badge || "", 
        condition: condition || "Brand New",
        imageUrl: finalImageUrl 
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
    
    const formattedProducts = products.map(p => {
       let specs: any = {};
       try { specs = JSON.parse(p.specifications || '{}'); } catch(e){}
       return { ...p, model: specs.Model || '' };
    });

    return NextResponse.json(formattedProducts, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Imeshindwa kupata bidhaa: " + error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}