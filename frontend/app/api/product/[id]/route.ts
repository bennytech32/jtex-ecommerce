import { NextResponse } from 'next/server';

const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const formData = await req.formData();
    const res = await fetch(`${API_URL}/products/${id}`, { 
      method: 'PUT', 
      body: formData 
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // 1. Tunatuma request ya DELETE kwenda backend ya Railway
    const res = await fetch(`${API_URL}/api/products/${id}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 2. Tunasoma response kutoka backend
    const data = await res.text();
    
    let parsedData = {};
    try {
        parsedData = JSON.parse(data);
    } catch (e) {
        parsedData = { raw: data };
    }

    if (!res.ok) {
        // Kama backend imekataa, tunarudisha ujumbe huo
        console.error("Backend Proxy Delete Error:", parsedData);
        return NextResponse.json(
            { error: (parsedData as any).error || "Backend imekataa kufuta" }, 
            { status: res.status }
        );
    }

    return NextResponse.json({ message: "Imefutwa kikamilifu" }, { status: 200 });

  } catch (error: any) {
    console.error("Proxy Network Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}