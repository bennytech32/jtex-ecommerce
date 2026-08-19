import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext"; // Tumesahihisha njia hapa (Nukta moja)
import Script from "next/script"; // Import ya Next.js Script kwa ajili ya Meta Pixel

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Jtex E-Commerce | Best Quality, Best Prices',
  description: 'Shop the latest gadgets, electronics, fashion and more at Jtex Africa.',
  openGraph: {
    title: 'Jtex E-Commerce | Best Quality, Best Prices',
    description: 'Shop the latest gadgets, electronics, fashion and more at Jtex Africa.',
    url: 'https://www.jtexafrica.com',
    siteName: 'Jtex Africa',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Jtex Africa Logo',
      },
    ],
    locale: 'sw_TZ',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '28095040700185542');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=28095040700185542&ev=PageView&noscript=1"
            alt="Meta Pixel"
          />
        </noscript>
        {/* End Meta Pixel Code */}

        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}