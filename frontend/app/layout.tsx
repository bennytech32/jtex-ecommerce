import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jtex Marketplace",
  description: "Best Quality, Best Prices in Tanzania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Tumeweka CartProvider ili kikapu kisomeke mfumo mzima */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}