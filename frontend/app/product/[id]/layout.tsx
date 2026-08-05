import { Metadata } from 'next';

const SITE_URL = 'https://jtex.co.tz';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

export async function generateMetadata(
    { params }: { params: { id: string } | Promise<{ id: string }> }
): Promise<Metadata> {

    // FIX: Kusoma params kwa usalama kwenye matoleo yote ya Next.js
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id || '';

    const fallbackImage = `${SITE_URL}/logo.png`;
    const fallbackTitle = 'Jtex E-Commerce | Best Quality, Best Prices';
    const fallbackDesc = 'Shop the latest gadgets, electronics, fashion and more at Jtex Africa.';

    try {
        const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });

        if (res.ok) {
            const products = await res.json();
            const decodedId = decodeURIComponent(id);

            const product = products.find((p: any) => {
                const slug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
                return String(p.id) === String(decodedId) || slug === decodedId;
            });

            if (product) {
                let imgPath = '';
                try {
                    const parsed = JSON.parse(product.imageUrl);
                    imgPath = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
                } catch (e) {
                    imgPath = product.imageUrl;
                }

                const cleanApiUrl = API_URL.replace(/\/$/, '');
                const cleanImg = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
                const finalImageUrl = imgPath.startsWith('http') ? imgPath : `${cleanApiUrl}${cleanImg}`;

                const title = `${product.name} | Jtex`;
                const desc = product.description ? product.description.slice(0, 150) + '...' : fallbackDesc;

                return {
                    title: title,
                    description: desc,
                    metadataBase: new URL(SITE_URL),
                    alternates: {
                        canonical: `/product/${id}`, // Hii inaondoa lile tatizo la "undefined"
                    },
                    openGraph: {
                        title: title,
                        description: desc,
                        url: `/product/${id}`,
                        images: [
                            {
                                url: finalImageUrl,
                                width: 800,
                                height: 800,
                                alt: product.name
                            }
                        ],
                        type: 'website',
                        siteName: 'Jtex E-Commerce'
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: title,
                        description: desc,
                        images: [finalImageUrl],
                    }
                };
            }
        }
    } catch (error) {
        console.error("Metadata error:", error);
    }

    return {
        title: fallbackTitle,
        description: fallbackDesc,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: `/product/${id}`,
        },
        openGraph: {
            title: fallbackTitle,
            description: fallbackDesc,
            url: `/product/${id}`,
            images: [
                {
                    url: fallbackImage,
                    width: 1200,
                    height: 630,
                    alt: 'Jtex Logo'
                }
            ],
            type: 'website',
            siteName: 'Jtex E-Commerce'
        },
        twitter: {
            card: 'summary_large_image',
            title: fallbackTitle,
            description: fallbackDesc,
            images: [fallbackImage],
        }
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}