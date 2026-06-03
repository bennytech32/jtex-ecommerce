'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiShare2, FiShield, FiTruck, FiCheck, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import TopTicker from '../components/navigation/TopTicker';
import MainHeader from '../components/navigation/MainHeader';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

export default function ProductDetailsPage() {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const handleAddToCart = () => {
    alert(`Smart Watch X3 Pro (Kiasi: ${qty}) imeongezwa kwenye kikapu!`);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased">
      <TopTicker />
      <MainHeader />
      <NavbarLinks />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 text-xs text-gray-500 font-medium flex gap-2 items-center">
          <Link href="/" className="hover:text-[#F2A900]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#F2A900]">Electronics</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800">Smart Watch X3 Pro</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 my-4">
        
        {/* SEHEMU YA JUU: Picha na Maelezo ya Bei */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-10">
          
          {/* Upande wa Picha */}
          <div className="w-full md:w-5/12">
            <div className="bg-gray-50 rounded-2xl h-[400px] flex items-center justify-center text-9xl border border-gray-100 relative">
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-md">-15%</span>
              ⌚
            </div>
            {/* Picha Ndogo (Thumbnails) */}
            <div className="flex gap-4 mt-4 justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-[#F2A900] flex items-center justify-center text-3xl cursor-pointer">⌚</div>
              <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-3xl cursor-pointer hover:border-[#F2A900]">⏱️</div>
              <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-3xl cursor-pointer hover:border-[#F2A900]">🔋</div>
            </div>
          </div>

          {/* Upande wa Maelezo na Bei */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Top Brand</span>
              <span className="flex items-center text-amber-400 text-sm"><FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="fill-current" /></span>
              <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">(32 Reviews)</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Smart Watch X3 Pro - IP68 Waterproof, Heart Rate Monitor</h1>
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-black text-[#0F172A]">TZS 90,000</span>
              <span className="text-lg text-gray-400 line-through mb-1">TZS 105,000</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Pata saa ya kisasa zaidi ya Smart Watch X3 Pro inakuwezesha kupima mapigo ya moyo, kupokea simu na meseji, na ina uwezo wa kukaa na chaji kwa siku 7. Inastahimili maji (Waterproof).
            </p>

            {/* Vitufe vya Manunuzi */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-b border-gray-100 py-6 mb-6">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden h-12 w-full sm:w-auto">
                <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-4 h-full bg-gray-50 hover:bg-gray-200 text-gray-600 transition"><FiMinus /></button>
                <span className="px-6 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-300 bg-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 h-full bg-gray-50 hover:bg-gray-200 text-gray-600 transition"><FiPlus /></button>
              </div>

              <button onClick={handleAddToCart} className="flex-1 w-full h-12 bg-[#F2A900] text-[#0F172A] font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:bg-yellow-500">
                <FiShoppingCart size={18} /> Ongeza Kwenye Kikapu
              </button>

              <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-500 transition">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Badges za Uaminifu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-2"><FiTruck className="text-[#F2A900] text-lg" /> Usafiri BURE kuanzia TZS 50,000</div>
              <div className="flex items-center gap-2"><FiShield className="text-[#F2A900] text-lg" /> Warranty ya Miezi 12</div>
              <div className="flex items-center gap-2"><FiCheck className="text-[#F2A900] text-lg" /> Ipo Stokini (In Stock)</div>
              <div className="flex items-center gap-2"><FiShare2 className="text-[#F2A900] text-lg" /> Shiriki Bidhaa (Share)</div>
            </div>
          </div>
        </div>

        {/* SEHEMU YA CHINI: Maelezo Zaidi (Tabs) */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('description')} 
              className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'description' ? 'border-b-2 border-[#F2A900] text-[#F2A900]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Maelezo ya Bidhaa (Description)
            </button>
            <button 
              onClick={() => setActiveTab('specs')} 
              className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'specs' ? 'border-b-2 border-[#F2A900] text-[#F2A900]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Sifa (Specifications)
            </button>
          </div>
          
          <div className="p-6 md:p-8 text-sm text-gray-600 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>Smart Watch X3 Pro ni saa bora inayokupa muonekano wa kisasa na kukurahisishia maisha. Ukiwa na saa hii mkononi, unaweza kupokea simu, kusoma meseji za WhatsApp na mitandao mingine bila kutoa simu mfukoni.</p>
                <p>Inafaa sana kwa watu wanaofanya mazoezi kwani inapima hatua unazotembea, kiwango cha mapigo ya moyo, na kiwango cha oxygen kwenye damu.</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <ul className="space-y-2">
                <li className="grid grid-cols-3 border-b border-gray-100 py-2"><span className="font-bold text-gray-800">Brand:</span> <span className="col-span-2">Generic/X-Pro</span></li>
                <li className="grid grid-cols-3 border-b border-gray-100 py-2"><span className="font-bold text-gray-800">Display:</span> <span className="col-span-2">1.43" AMOLED HD</span></li>
                <li className="grid grid-cols-3 border-b border-gray-100 py-2"><span className="font-bold text-gray-800">Battery Life:</span> <span className="col-span-2">7 Days (Typical Usage)</span></li>
                <li className="grid grid-cols-3 border-b border-gray-100 py-2"><span className="font-bold text-gray-800">Water Resistance:</span> <span className="col-span-2">IP68 (Inaingia Majini)</span></li>
              </ul>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}