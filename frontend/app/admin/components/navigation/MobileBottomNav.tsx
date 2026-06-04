'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();

  const isHome = pathname === '/';

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <button onClick={() => router.push('/')} className={`flex flex-col items-center transition ${isHome ? 'text-[#F2A900]' : 'text-gray-400 hover:text-[#0F172A]'}`}>
        <FiHome className="text-xl mb-1" />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      
      <button onClick={() => window.dispatchEvent(new Event('openCategories'))} className="flex flex-col items-center text-gray-400 hover:text-[#0F172A] transition">
        <FiGrid className="text-xl mb-1" />
        <span className="text-[10px] font-bold">Kategoria</span>
      </button>
      
      {/* KITUFE CHA KIKAPU KILICHOUNGANISHWA NA MFUMO MPYA */}
      <button onClick={() => {
          if (isHome) {
              window.dispatchEvent(new Event('openCart'));
          } else {
              router.push('/?cart=open');
          }
      }} className="flex flex-col items-center text-gray-400 hover:text-[#0F172A] transition relative">
        <div className="relative">
          <FiShoppingCart className="text-xl mb-1" />
          {cart && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
              {cart.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">Kikapu</span>
      </button>
      
      <button onClick={() => router.push('/profile')} className="flex flex-col items-center text-gray-400 hover:text-[#0F172A] transition">
        <FiUser className="text-xl mb-1" />
        <span className="text-[10px] font-bold">Akaunti</span>
      </button>
    </div>
  );
}