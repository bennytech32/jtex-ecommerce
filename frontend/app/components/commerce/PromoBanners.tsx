import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Promo 1 */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-center h-[200px] hover:shadow-md transition group cursor-pointer">
        <div className="relative z-10 w-2/3">
          <span className="bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">New Arrival</span>
          <h3 className="text-2xl font-black mb-2 leading-tight">iPhone 15 Pro Max</h3>
          <p className="text-xs text-blue-200 mb-4">Pata ofa ya kava na screen protector bure.</p>
          <button className="text-sm font-bold flex items-center gap-1 hover:text-[#F2A900] transition">Shop Now <FiArrowRight /></button>
        </div>
        <div className="absolute -right-4 -bottom-4 text-[120px] opacity-80 group-hover:scale-110 transition duration-500">📱</div>
      </div>

      {/* Promo 2 */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-center h-[200px] hover:shadow-md transition group cursor-pointer">
        <div className="relative z-10 w-2/3">
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">Clearance Sale</span>
          <h3 className="text-2xl font-black mb-2 leading-tight">Home Appliances</h3>
          <p className="text-xs text-slate-300 mb-4">Punguzo la hadi 30% kwa vifaa vya jikoni.</p>
          <button className="text-sm font-bold flex items-center gap-1 hover:text-[#F2A900] transition">View Deals <FiArrowRight /></button>
        </div>
        <div className="absolute right-0 -bottom-8 text-[120px] opacity-80 group-hover:scale-110 transition duration-500">📺</div>
      </div>
    </div>
  );
}