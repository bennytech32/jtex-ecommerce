'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiCheck, FiCopy, FiMapPin, FiPackage, FiTruck, 
  FiCalendar, FiShield, FiStar, FiShoppingCart, FiArrowLeft
} from 'react-icons/fi';

export default function OrderSuccessPage() {
  const router = useRouter();

  // Mock Products for "Explore Popular Products"
  const popProducts = [
    { id: 1, name: "iPhone 16 Pro Max", price: 1000000, oldPrice: 1100000, discount: 10, img: "📱", rating: 4.8, rev: 126 },
    { id: 2, name: "MacBook Air M2", price: 2000000, oldPrice: 2180000, discount: 8, img: "💻", rating: 4.9, rev: 98 },
    { id: 3, name: "AirPods Pro 2", price: 550000, oldPrice: 650000, discount: 0, img: "🎧", rating: 4.7, rev: 76 },
    { id: 4, name: "Smart Watch Series 9", price: 400000, oldPrice: 470000, discount: 15, img: "⌚", rating: 4.6, rev: 64 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm md:hidden">
        <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} className="text-gray-800" />
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><span className="text-sm">🎧</span></div>
          <span className="text-[9px] font-bold mt-1">Support</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto md:pt-10 px-4 pt-6">
        
        {/* Top Section: Success Message & Tracker */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          
          {/* Success Banner */}
          <div className="bg-green-50/50 border border-green-100 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-6 z-10 border-8 border-green-100">
              <FiCheck size={48} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 z-10">Order Success!</h1>
            <p className="text-gray-600 font-medium mb-6 z-10 max-w-xs">Thank you for shopping with JTex.<br/>Your order has been placed successfully.</p>
            
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm z-10">
              <span className="text-sm font-bold text-gray-800">Order ID: JTX25051234</span>
              <button className="text-gray-400 hover:text-gray-800"><FiCopy/></button>
            </div>
          </div>

          {/* Tracker Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><FiClock size={20}/></div>
                <div>
                  <h3 className="font-bold text-sm text-green-700">Order Received</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">We've received your order and it is being processed.</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-gray-500 justify-end mb-1"><FiCalendar size={14}/><span className="text-[10px] sm:text-xs font-bold uppercase">Estimated Delivery</span></div>
                <p className="font-black text-sm sm:text-base text-green-700">16 May, 2025</p>
                <p className="text-[10px] text-gray-500">08:00 AM - 06:00 PM</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between relative mb-10 px-2 sm:px-6">
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>
              <div className="absolute top-5 left-[10%] w-[10%] h-0.5 bg-green-500 border-b-2 border-dashed border-green-500 -z-10"></div>
              
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md border-4 border-white"><FiCheck size={20}/></div>
                <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Order Received<br/><span className="text-[8px] text-gray-500 font-normal">12 May, 2025<br/>09:41 AM</span></span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shadow-sm"><FiPackage size={18}/></div>
                <span className="text-[10px] font-bold text-gray-400">Processing</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shadow-sm"><FiTruck size={18}/></div>
                <span className="text-[10px] font-bold text-gray-400">Shipped</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shadow-sm"><FiMapPin size={18}/></div>
                <span className="text-[10px] font-bold text-gray-400">Delivered</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => router.push('/profile')} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"><FiPackage/> View Order Details</button>
              <button onClick={() => router.push('/profile')} className="flex-1 bg-[#F2A900] text-black font-black py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-md text-sm flex items-center justify-center gap-2"><FiMapPin/> Track Order</button>
            </div>
          </div>
        </div>

        {/* Protection Banner */}
        <div className="bg-[#FFFDF5] border border-yellow-200/60 rounded-2xl p-6 flex items-center gap-6 mb-10 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 flex-shrink-0 z-10"><FiShield size={32}/></div>
          <div className="z-10">
            <h3 className="font-black text-lg text-gray-900 mb-1">You're Covered!</h3>
            <p className="text-sm text-gray-600 font-medium">Quality products. Secure payments.<br/>Hassle-free delivery.</p>
          </div>
          <div className="absolute right-10 -bottom-6 opacity-80 md:opacity-100 text-8xl z-0 pointer-events-none">📦<span className="absolute -bottom-2 -right-4 text-4xl bg-white rounded-full"><FiCheckCircle className="text-[#F2A900] bg-white rounded-full border-4 border-white"/></span></div>
        </div>

        {/* Explore Popular Products */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-black text-gray-900">Explore Popular Products</h2>
            <button className="text-sm font-bold text-[#F2A900] flex items-center gap-1 hover:underline">View All Products <FiChevronRight/></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popProducts.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col cursor-pointer hover:border-[#F2A900] transition">
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                  {p.discount > 0 && <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">-{p.discount}%</span>}
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><FiStar/></button>
                  <span className="text-6xl">{p.img}</span>
                </div>
                <h4 className="font-bold text-xs text-gray-800 mb-1">{p.name}</h4>
                <p className="text-[9px] text-gray-500 mb-2">Color/Specs</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-black text-sm">TZS {p.price.toLocaleString()}</span>
                  {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">TZS {p.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="flex items-center text-[#F2A900] text-[10px] mb-3">★ {p.rating} <span className="text-gray-400 ml-1 font-medium">({p.rev})</span></div>
                <button className="w-full border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 mt-auto hover:border-[#F2A900] hover:text-[#F2A900] transition"><FiShoppingCart/> Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}