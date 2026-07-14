import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Ni vizuri kama unatumia db/prisma.ts yako, lakini hapa tunaita Prisma moja kwa moja.
const prisma = new PrismaClient();

// ==========================================
// 1. KULETA BIDHAA MOJA (GET)
// ==========================================
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id: id }, // BADILISHA iwe Number(id) KAMA ID ZAKO NI NAMBA (Int)
    });

    if (!product) {
      return NextResponse.json({ error: 'Bidhaa haijapatikana' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 2. KUSASISHA/KUEDIT BIDHAA (PUT)
// ==========================================
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    
    // Chukua data zote kutoka kwenye frontend
    const name = formData.get('name') as string;
    const sku = formData.get('sku') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const badge = formData.get('badge') as string;
    const condition = formData.get('condition') as string;
    const price = Number(formData.get('price'));
    const buyingPrice = Number(formData.get('buyingPrice'));
    const stockQuantity = Number(formData.get('stockQuantity'));
    const specifications = formData.get('specifications') as string;

    // Update database (Zingatia: Kama una picha mpya, logic ya ku-upload picha inatakiwa iwe hapa)
    const updatedProduct = await prisma.product.update({
      where: { id: id }, // BADILISHA iwe Number(id) KAMA ID ZAKO NI NAMBA (Int)
      data: {
        name,
        sku,
        category,
        brand,
        badge,
        condition,
        price,
        buyingPrice,
        stockQuantity,
        specifications
      }
    });

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error: any) {
    console.error("== PRISMA EDIT ERROR ==", error.message);
    return NextResponse.json(
      { error: "Imeshindwa kusasisha bidhaa: " + error.message }, 
      { status: 500 }
    );
  }
}

// ==========================================
// 3. KUFUTA BIDHAA (DELETE) - [IMETATULIWA]
// ==========================================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productId = id; // BADILISHA iwe Number(id) KAMA ID ZAKO NI NAMBA (Int)

    // 🔥 SULUHISHO: Kufuta rekodi zilizofungamana na hii bidhaa
    // KAMA DATABASE INAKATAA KUFUTA KWA SABABU BIDHAA IPO KWENYE CART AU ORDERS, 
    // ONDOA COMMENT KWENYE MISTARI MIWILI HAPA CHINI (Itegemee na Prisma Schema yako)
    
    /* await prisma.cartItem.deleteMany({ where: { productId: productId } });
    await prisma.orderItem.deleteMany({ where: { productId: productId } }); 
    */

    // Futa bidhaa yenyewe
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Bidhaa imefutwa kikamilifu!' }, { status: 200 });

  } catch (error: any) {
    // Hii itaprint makosa HALISI kwenye terminal yako (Mfano: Foreign Key Constraint)
    console.error("== PRISMA DELETE ERROR ==", error.message);
    
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}