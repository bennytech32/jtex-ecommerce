import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jtex E-Commerce | Best Quality, Best Prices',
  description: 'Shop the latest gadgets, electronics, fashion and more at unbeatable prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Unaweza kuweka suppressHydrationWarning hapa pia kwa usalama zaidi
    <html lang="en" suppressHydrationWarning={true}>
      {/* TUMEONGEZA: suppressHydrationWarning={true} ILI KUZUIA BROWSER EXTENSIONS (Grammarly, etc) KUSABABISHA ERRORS */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}