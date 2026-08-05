import { Metadata } from 'next';

const SITE_URL = 'https://jtex.co.tz';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

export async function generateMetadata(props: any): Promise<Metadata> {
    // FIX KUBWA: Tuna-await params ili kuzuia error ya "undefined" kwenye Next.js
    const params = await Promise.resolve(props.params);
    const id = params?.id || '';

    const fallbackImage = `${SITE_URL}/logo.png`;
    const fallbackTitle = 'Jtex E-Commerce | Best Quality, Best Prices';
    const fallbackDesc = 'Shop the latest gadgets, electronics, fashion and more at Jtex Africa.';

    try {
        // Tunavuta bidhaa moja kwa moja, bila cache ili Next.js isilale
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

                // HAPA NDIPO TUNALAZIMISHA PICHA IWE NA HTTPS KAMILI
                const finalImageUrl = imgPath.startsWith('http')
                    ? imgPath
                    : `${API_URL.replace(/\/$/, '')}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;

                const title = `${product.name} | Jtex`;
                const desc = product.description ? product.description.slice(0, 150) + '...' : fallbackDesc;

                return {
                    title: title,
                    description: desc,
                    metadataBase: new URL(SITE_URL),
                    openGraph: {
                        title: title,
                        description: desc,
                        url: `${SITE_URL}/product/${id}`,
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

    // KAMA API IMELALA AU KUNA ERROR, LAZIMISHA KUTUMIA DOMAIN YAKO BILA LOCALHOST
    return {
        title: fallbackTitle,
        description: fallbackDesc,
        metadataBase: new URL(SITE_URL),
        openGraph: {
            title: fallbackTitle,
            description: fallbackDesc,
            url: `${SITE_URL}/product/${id}`,
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