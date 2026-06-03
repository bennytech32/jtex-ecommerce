'use client';

import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiDownload, FiArrowRight, FiPrinter } from 'react-icons/fi';
import TopTicker from '../components/navigation/TopTicker';
import MainHeader from '../components/navigation/MainHeader';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

export default function OrderSuccessPage() {
  // Hizi data kawaida zinatoka kwenye database baada ya malipo
  const orderDetails = {
    orderId: "#JTEX-98452",
    trackingNumber: "TRK-TZ-2026-0589",
    date: "26 Mei 2026, 14:15",
    paymentMethod: "Mobile Money (M-PESA)",
    totalAmount: "TZS 390,000",
    customerName: "John Doe",
    deliveryAddress: "Posta Mtaa wa Samora, Dar es Salaam",
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased">
      <TopTicker />
      <MainHeader />
      <NavbarLinks />

      <main className="max-w-[800px] mx-auto p-4 md:p-6 my-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Sehemu ya Juu (Success Message) */}
          <div className="bg-gradient-to-b from-green-50 to-white p-8 md:p-12 text-center border-b border-gray-100">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Asante Kwa Manunuzi Yako!</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Oda yako imepokelewa kikamilifu na inashughulikiwa. Tumekutumia risiti na taarifa za oda kwenye barua pepe yako.
            </p>
          </div>

          {/* Taarifa za Oda (Order Details & Tracking) */}
          <div className="p-8 md:p-12">
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Namba ya Oda</p>
                  <p className="text-lg font-black text-gray-900">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Namba ya Kufuatilia (Tracking)</p>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-lg">
                    <FiPackage /> {orderDetails.trackingNumber}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tarehe</p>
                  <p className="font-semibold text-gray-800">{orderDetails.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Jumla ya Malipo</p>
                  <p className="font-black text-green-600 text-lg">{orderDetails.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Taarifa za Mteja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-100 pb-10">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Njia ya Malipo</h3>
                <p className="text-sm text-gray-600">{orderDetails.paymentMethod}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Anwani ya Kufikisha (Shipping)</h3>
                <p className="text-sm text-gray-600 font-medium">{orderDetails.customerName}</p>
                <p className="text-sm text-gray-500 mt-1">{orderDetails.deliveryAddress}</p>
              </div>
            </div>

            {/* Vitufe vya Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition text-sm">
                <FiDownload size={18} /> Pakua Risiti (PDF)
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition text-sm">
                <FiPrinter size={18} /> Printa
              </button>
              <Link href="/shop" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F2A900] hover:bg-yellow-500 text-[#0F172A] font-bold rounded-xl transition text-sm shadow-md">
                Endelea Kushop <FiArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}