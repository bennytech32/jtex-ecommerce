import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
const SITE_URL = 'https://jtex.co.tz';

const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
        const products = await res.json();

        const decodedId = decodeURIComponent(params.id);
        const product = products.find((p: any) =>
            p.id === decodedId || generateSlug(p.name) === decodedId
        );

        if (!product) return { title: 'Product Not Found | Jtex' };

        let displayImage = '';
        try {
            const parsed = JSON.parse(product.imageUrl);
            displayImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
        } catch (e) {
            displayImage = product.imageUrl;
        }

        const cleanApiUrl = API_URL.replace(/\/$/, '');
        const cleanImg = displayImage.startsWith('/') ? displayImage : `/${displayImage}`;
        const finalImageUrl = displayImage.startsWith('http') ? displayImage : `${cleanApiUrl}${cleanImg}`;

        const shortDesc = product.description
            ? product.description.slice(0, 150) + "..."
            : `Nunua ${product.name} kwa TZS ${product.price.toLocaleString()} pekee. Original na ubora wa uhakika kutoka Jtex.`;

        return {
            metadataBase: new URL(SITE_URL),
            title: `${product.name} | Jtex`,
            description: shortDesc,
            openGraph: {
                title: product.name,
                description: shortDesc,
                url: `/product/${params.id}`,
                siteName: 'Jtex E-Commerce',
                images: [
                    {
                        url: finalImageUrl,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: shortDesc,
                images: [finalImageUrl],
            },
        };
    } catch (error) {
        return {
            title: 'Jtex Product',
            description: 'Shop the best quality products on Jtex Africa.'
        };
    }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}