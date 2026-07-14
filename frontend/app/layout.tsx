import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext"; // Hii inarudisha mfumo wako wa kikapu

const inter = Inter({ subsets: ["latin"] });

// 1. MAELEZO YA SEO NA LOGO YAKO MPYA
export const metadata: Metadata = {
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

// 2. MUUNDO MKUU WA WEBSITE (RootLayout iliyokuwa imefutika)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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