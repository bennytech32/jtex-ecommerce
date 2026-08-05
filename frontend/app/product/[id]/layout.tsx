import { Metadata } from 'next';

// Tunatumia URL ya production moja kwa moja kuhakikisha WhatsApp inasoma picha
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
const SITE_URL = 'https://jtex.co.tz';

// Helper: Kubadilisha jina kuwa URL safi kama inavyotumika kwenye browser
const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const id = params.id;

    try {
        // Tunavuta data zote za bidhaa
        const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');

        const products = await res.json();
        const decodedId = decodeURIComponent(id);

        // Tunatafuta bidhaa inayoendana na link
        const product = products.find((p: any) =>
            p.id === decodedId || generateSlug(p.name) === decodedId
        );

        if (product) {
            // Tunatengeneza link kamili ya picha (Absolute URL) ambayo WhatsApp inahitaji
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

            // Maelezo mafupi
            const shortDesc = product.description
                ? product.description.slice(0, 150) + "..."
                : `Nunua ${product.name} kwa TZS ${product.price.toLocaleString()} pekee. Original na ubora wa uhakika kutoka Jtex.`;

            // Tunairudishia WhatsApp / Social Media hizi tags!
            return {
                title: `${product.name} | Jtex`,
                description: shortDesc,
                openGraph: {
                    title: product.name,
                    description: shortDesc,
                    url: `${SITE_URL}/product/${id}`,
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
        }
    } catch (error) {
        console.error("Metadata generation error:", error);
    }

    // Kama ikitokea error yoyote, ionyeshe hivi:
    return {
        title: 'Jtex Product',
        description: 'Shop the best quality products on Jtex Africa.',
    };
}

// Layout inapitisha ukurasa wako wa page.tsx kama ulivyo
export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}