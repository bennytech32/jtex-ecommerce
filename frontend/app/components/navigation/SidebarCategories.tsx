import React from 'react';
import Link from 'next/link'; // Tume-import Link ya Next.js
import { FiMenu, FiChevronRight, FiMonitor, FiSmartphone, FiBriefcase, FiHome, FiHeart, FiActivity, FiSmile, FiSettings, FiGrid } from 'react-icons/fi';

export default function SidebarCategories() {
  const categories = [
    { name: 'Electronics', icon: <FiMonitor /> },
    { name: 'Computers', icon: <FiMonitor /> },
    { name: 'Phones & Tablets', icon: <FiSmartphone /> },
    { name: 'Fashion', icon: <FiBriefcase /> },
    { name: 'Home & Kitchen', icon: <FiHome /> },
    { name: 'Beauty & Health', icon: <FiHeart /> },
    { name: 'Sports & Outdoors', icon: <FiActivity /> },
    { name: 'Toys & Games', icon: <FiSmile /> },
    { name: 'Automotive', icon: <FiSettings /> },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Browse Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#0F172A] text-white px-4 py-3.5 flex items-center gap-3 font-bold text-sm">
          <FiMenu size={18} />
          <span>Browse Menu</span>
        </div>
        <div className="py-0.5 flex flex-col">
          {categories.map((cat, idx) => (
            <Link href="/shop" key={idx} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-gray-700 text-xs font-semibold group border-b border-gray-50 last:border-0 w-full transition">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 group-hover:text-[#F2A900] transition text-sm">{cat.icon}</span>
                <span className="group-hover:text-[#F2A900] transition font-medium">{cat.name}</span>
              </div>
              <FiChevronRight className="text-gray-300 group-hover:text-[#F2A900] transition" size={14} />
            </Link>
          ))}
          <Link href="/shop" className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 text-xs font-bold border-t border-gray-100 w-full transition">
            <FiGrid className="text-gray-400" size={14} />
            <span className="text-gray-800">View All Categories</span>
          </Link>
        </div>
      </div>

      {/* Special Offer Box */}
      <div className="bg-gradient-to-b from-[#0F172A] via-[#111C30] to-[#1A2E4C] rounded-xl p-6 text-white text-center relative overflow-hidden shadow-md flex flex-col items-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2A900] mb-1">Special Offer</p>
        <h3 className="text-2xl font-black text-white leading-tight">Up to <span className="text-[#F2A900]">40% Off</span></h3>
        <p className="text-[11px] text-gray-400 mt-0.5 mb-5">On selected items</p>
        
        <div className="w-24 h-24 bg-gradient-to-tr from-[#F2A900]/10 to-transparent rounded-full flex items-center justify-center mb-5 border border-dashed border-gray-700">
          <span className="text-4xl animate-bounce">🎁</span>
        </div>

        <Link href="/shop" className="bg-[#F2A900] text-[#0F172A] text-xs font-bold px-6 py-2.5 rounded-full hover:bg-yellow-500 transition flex items-center gap-1.5 shadow-md w-full justify-center">
          Shop Now <FiChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}