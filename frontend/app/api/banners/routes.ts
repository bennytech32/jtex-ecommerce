import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Hii inazuia Next.js isihifadhi data za zamani (Caching)
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Tunachukua banners zote kutoka kwenye database ambazo zipo active
        const banners = await prisma.banner.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc' // Inapanga kuanzia banner mpya iliyowekwa
            }
        });

        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching banners from DB:", error);
        return NextResponse.json([], { status: 500 });
    }
}