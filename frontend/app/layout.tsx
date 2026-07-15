import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext"; // Tumesahihisha njia hapa (Nukta moja)

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
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}