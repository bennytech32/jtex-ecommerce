import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// 1. Unganisha akaunti yako ya Cloudinary
cloudinary.config({
  cloud_name: 'zy7bva4b',
  api_key: '454715668631514',
  api_secret: '1oGzbaFEkFOBUAwicng9S08bibs'
});

export async function POST(req: Request) {
  try {
    // Tunapokea data zote kutoka kwenye form (Frontend)
    const formData = await req.formData();
    
    // Chukua taarifa za kawaida za bidhaa
    const name = formData.get('name');
    const sku = formData.get('sku');
    const category = formData.get('category');
    const price = formData.get('price');
    const specifications = formData.get('specifications');
    // (Endelea kuchukua fields zako zote hapa...)

    // Chukua picha zote zilizotumwa
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    // 2. Loop na Upload picha moja moja kwenda Cloudinary
    for (const image of imageFiles) {
      // Badilisha faili kuwa Buffer (Lugha inayoeleweka na Cloudinary Stream)
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Fanya upload kwa kutumia Promise
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'jtex_products' }, // Folder kule Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // Hifadhi Link ya mtandaoni (Secure URL)
      imageUrls.push((uploadResult as any).secure_url);
    }

    // 3. Save kwenye Database yako (Mfano kwa kutumia Prisma)
    /* 
    const newProduct = await prisma.product.create({
      data: {
        name: name as string,
        sku: sku as string,
        category: category as string,
        price: Number(price),
        specifications: specifications as string,
        imageUrl: JSON.stringify(imageUrls), // Tunahifadhi Array ya link za Cloudinary
        // ...
      }
    }); 
    */

    return NextResponse.json({ 
      message: 'Bidhaa imehifadhiwa kikamilifu!', 
      imageUrls: imageUrls 
    }, { status: 201 });

  } catch (error) {
    console.error("Kosa la ku-upload:", error);
    return NextResponse.json({ error: 'Imeshindwa kuhifadhi bidhaa. Jaribu tena.' }, { status: 500 });
  }
}