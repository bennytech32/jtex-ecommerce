import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Kama picha haipo (imefutwa)
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Picha haipatikani', { status: 404 });
    }

    // Soma picha na kuionyesha
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.gif') contentType = 'image/gif';

    return new NextResponse(fileBuffer, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}