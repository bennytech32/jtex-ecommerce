import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HeroSlider() {
  return (
    <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#15233D] to-[#F2A900] min-h-[460px] flex items-center shadow-md">
      {/* Mapambo ya nukta (Dots pattern) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Maandishi ya Kushoto */}
      <div className="relative z-10 pl-12 pr-6 max-w-lg text-white">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 text-white">
          Best Quality, <br />
          Best Prices, <br />
          Only on <span className="text-[#F2A900]">Jtex</span>
        </h1>
        <p className="text-gray-300 mb-8 text-xs md:text-sm max-w-sm font-light">
          Shop the latest gadgets, electronics, fashion and more at unbeatable prices.
        </p>
        <button className="bg-[#F2A900] text-[#0F172A] font-bold px-6 py-3 rounded-full hover:bg-yellow-500 transition flex items-center gap-2 text-xs shadow-lg uppercase tracking-wider">
          Shop Now
          <span className="bg-[#0F172A] text-white rounded-full p-1 text-[10px]">
            <FiChevronRight className="stroke-[3]" />
          </span>
        </button>
      </div>

      {/* Vitufe vya Slider (Kushoto na Kulia) */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-gray-500/50 text-white flex items-center justify-center hover:bg-white/10 transition backdrop-blur-sm">
        <FiChevronLeft size={20} />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-gray-500/50 text-white flex items-center justify-center hover:bg-white/10 transition backdrop-blur-sm">
        <FiChevronRight size={20} />
      </button>

      {/* Dots za Chini */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#F2A900]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white transition cursor-pointer"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white transition cursor-pointer"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white transition cursor-pointer"></div>
      </div>
    </div>
  );
}