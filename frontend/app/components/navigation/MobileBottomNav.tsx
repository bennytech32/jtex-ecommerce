import React from 'react';
import Link from 'next/link';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] pb-safe">
      <div className="flex justify-between items-center px-6 py-3">
        
        <Link href="/" className="flex flex-col items-center text-[#F2A900]">
          <FiHome size={20} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>

        <Link href="/shop" className="flex flex-col items-center text-gray-500 hover:text-[#F2A900] transition">
          <FiGrid size={20} />
          <span className="text-[10px] font-medium mt-1">Kategoria</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center text-gray-500 hover:text-[#F2A900] transition relative">
          <div className="relative">
            <FiShoppingCart size={20} />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black h-3.5 w-3.5 flex items-center justify-center rounded-full">2</span>
          </div>
          <span className="text-[10px] font-medium mt-1">Kikapu</span>
        </Link>

        <Link href="/register" className="flex flex-col items-center text-gray-500 hover:text-[#F2A900] transition">
          <FiUser size={20} />
          <span className="text-[10px] font-medium mt-1">Akaunti</span>
        </Link>
        
      </div>
    </div>
  );
}