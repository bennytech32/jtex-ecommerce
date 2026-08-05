import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

// Helper: Kubadilisha jina kuwa URL safi
const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Next.js Server Function kwa ajili ya kutengeneza Meta Tags za WhatsApp/Social Media
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const decodedId = decodeURIComponent(params.id);

        // Vuta data za bidhaa upande wa Server
        const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
        const products = await res.json();

        // Tafuta bidhaa husika
        const product = products.find((p: any) =>
            p.id === decodedId || generateSlug(p.name) === decodedId
        );

        if (!product) {
            return { title: 'Product Not Found | Jtex' };
        }

        // Pata picha sahihi ya kuonyesha
        let displayImage = '';
        try {
            const parsed = JSON.parse(product.imageUrl);
            displayImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
        } catch (e) {
            displayImage = product.imageUrl;
        }

        // Hakikisha link ya picha ipo kamili
        const imageUrl = displayImage.startsWith('http') ? displayImage : `${API_URL}${displayImage}`;

        // Tengeneza maelezo mafupi ya kuonyesha kwenye link
        const shortDesc = product.description
            ? product.description.slice(0, 150) + "..."
            : `Nunua ${product.name} kwa TZS ${product.price.toLocaleString()} pekee. Original na ubora wa uhakika kutoka Jtex.`;

        return {
            title: `${product.name} | Jtex`,
            description: shortDesc,
            openGraph: {
                title: product.name,
                description: shortDesc,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
                type: 'website',
                siteName: 'Jtex Technologies',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: shortDesc,
                images: [imageUrl],
            },
        };
    } catch (error) {
        return { title: 'Jtex Store' };
    }
}

// Layout inapitisha ukurasa wako wa page.tsx kama ulivyo
export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}