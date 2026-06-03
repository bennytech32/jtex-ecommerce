import React from 'react';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShield } from 'react-icons/fi';
import TopTicker from '../components/navigation/TopTicker';
import MainHeader from '../components/navigation/MainHeader';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased">
      <TopTicker />
      <MainHeader />
      <NavbarLinks />

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 my-4">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Kikapu Chako (Shopping Cart)</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* UPANDE WA KUSHOTO: Orodha ya Bidhaa Kwenye Kikapu */}
          <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Kichwa cha Jedwali */}
            <div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:grid">
              <div className="col-span-6">Bidhaa (Product)</div>
              <div className="col-span-3 text-center">Idadi (Qty)</div>
              <div className="col-span-3 text-right">Jumla (Total)</div>
            </div>

            {/* Bidhaa ya Kwanza */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 md:p-6 border-b border-gray-100 items-center">
              <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl border border-gray-100">⌚</div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Smart Watch X3 Pro</h3>
                  <p className="text-xs text-gray-500 mt-1">Bei: TZS 90,000</p>
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-3 flex items-center sm:justify-center mt-2 sm:mt-0">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"><FiMinus size={14} /></button>
                  <span className="px-4 py-1.5 text-sm font-bold border-x border-gray-200 text-center min-w-[40px]">1</span>
                  <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"><FiPlus size={14} /></button>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                <span className="font-black text-gray-900">TZS 90,000</span>
                <button className="ml-4 text-gray-400 hover:text-red-500 transition"><FiTrash2 size={18} /></button>
              </div>
            </div>

            {/* Bidhaa ya Pili */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 md:p-6 border-b border-gray-100 items-center">
              <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl border border-gray-100">🎧</div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Wireless Noise Cancelling Headphones</h3>
                  <p className="text-xs text-gray-500 mt-1">Bei: TZS 150,000</p>
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-3 flex items-center sm:justify-center mt-2 sm:mt-0">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"><FiMinus size={14} /></button>
                  <span className="px-4 py-1.5 text-sm font-bold border-x border-gray-200 text-center min-w-[40px]">2</span>
                  <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"><FiPlus size={14} /></button>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                <span className="font-black text-gray-900">TZS 300,000</span>
                <button className="ml-4 text-gray-400 hover:text-red-500 transition"><FiTrash2 size={18} /></button>
              </div>
            </div>

            <div className="p-4 md:p-6 flex justify-between items-center bg-gray-50">
              <Link href="/shop" className="text-sm font-bold text-blue-600 hover:underline">
                &larr; Endelea Kushop
              </Link>
            </div>
          </div>

          {/* UPANDE WA KULIA: Malipo na Checkout Summary */}
          <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-6">Muhtasari (Order Summary)</h3>
            
            <div className="space-y-4 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Gharama ya Bidhaa:</span>
                <span className="font-semibold text-gray-900">TZS 390,000</span>
              </div>
              <div className="flex justify-between">
                <span>Punguzo (Discount):</span>
                <span className="font-semibold text-green-500">- TZS 0</span>
              </div>
              <div className="flex justify-between">
                <span>Usafiri (Shipping):</span>
                <span className="font-semibold text-[#F2A900]">BURE</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-900">Jumla Kuu:</span>
              <span className="text-2xl font-black text-[#0F172A]">TZS 390,000</span>
            </div>

            <Link href="/checkout" className="w-full bg-[#F2A900] text-[#0F172A] text-sm font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:bg-yellow-500">
              Fanya Malipo (Checkout) <FiArrowRight size={18} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <FiShield size={14} />
              <span>Malipo Yako Yanalindwa (100% Secure)</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}