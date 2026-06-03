'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';
import AuthModal from '../auth/AuthModal';

export default function MainHeader() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="text-2xl font-black text-[#0F172A] cursor-pointer">
              J<span className="text-[#F2A900]">tex</span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl mx-8 items-center border-2 border-[#F2A900] rounded-lg overflow-hidden hidden md:flex">
          <button className="bg-gray-50 text-xs font-semibold px-4 py-3 border-r border-gray-200 flex items-center gap-1 text-gray-700">
            ✨ AI <FiChevronDown />
          </button>
          <button className="bg-gray-50 text-xs font-semibold px-4 py-3 border-r border-gray-200 flex items-center gap-1 text-gray-700">
            All <FiChevronDown />
          </button>
          <input 
            type="text" 
            placeholder="Search for products, brands and more..." 
            className="flex-1 px-4 py-2.5 text-sm outline-none text-gray-800"
          />
          <button className="bg-[#F2A900] text-white px-6 py-3.5 hover:bg-yellow-600 transition flex items-center justify-center">
            <FiSearch size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Icons za Kulia */}
        <div className="flex items-center space-x-6 text-gray-800">
          <div className="items-center space-x-3 border border-gray-200 rounded-md px-2 py-1.5 text-xs font-semibold bg-gray-50 cursor-pointer hidden sm:flex">
            <span className="flex items-center gap-1">🇹🇿 TZS <FiChevronDown /></span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">EN <FiChevronDown /></span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:text-[#F2A900] transition relative">
            <FiHeart size={22} />
            <span className="text-[11px] font-medium mt-0.5">Wishlist</span>
          </div>
          
          <Link href="/cart" className="flex flex-col items-center cursor-pointer hover:text-[#F2A900] transition relative group">
            <div className="relative">
              <FiShoppingCart size={22} />
              <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <span className="text-[11px] font-medium mt-0.5 group-hover:text-[#F2A900]">Cart</span>
          </Link>

          {/* User Icon Inafungua Modal */}
          <button 
            onClick={() => setIsAuthOpen(true)} 
            className="flex flex-col items-center cursor-pointer hover:text-[#F2A900] transition group outline-none"
          >
            <span className="flex items-center gap-0.5">
              <FiUser size={22} className={isLoggedIn ? "text-[#F2A900]" : ""} />
            </span>
            <span className="text-[11px] font-medium mt-0.5 flex items-center gap-0.5 group-hover:text-[#F2A900]">
              {isLoggedIn ? "Akaunti Yangu" : "Ingia/Sajili"} <FiChevronDown size={10} />
            </span>
          </button>
        </div>
      </div>

      {/* Auth Modal Component */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => {
          setIsAuthOpen(false);
          setIsLoggedIn(true);
        }} 
      />
    </>
  );
}