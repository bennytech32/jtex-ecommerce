import React from "react";
import { FiClock, FiShoppingCart, FiChevronRight } from "react-icons/fi";

const products = [
  { id: 1, name: "Smart Watch X3", price: "TZS 90,000", oldPrice: "TZS 105,000", discount: "-15%", rating: 5, reviews: 32, emoji: "⌚" },
  { id: 2, name: "Wireless Headphones", price: "TZS 50,000", oldPrice: "TZS 62,000", discount: "-20%", rating: 5, reviews: 64, emoji: "🎧" },
  { id: 3, name: "Bluetooth Speaker", price: "TZS 45,000", oldPrice: "TZS 50,000", discount: "-10%", rating: 4, reviews: 18, emoji: "🔊" },
  { id: 4, name: "Laptop Air 14\"", price: "TZS 850,000", oldPrice: "TZS 1,060,000", discount: "-20%", rating: 5, reviews: 27, emoji: "💻" },
  { id: 5, name: "Smartphone S24", price: "TZS 620,000", oldPrice: "TZS 730,000", discount: "-15%", rating: 5, reviews: 39, emoji: "📱" },
];

export default function FlashDeals() {
  return (
    <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {/* Header ya Flash Deals yenye Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-1.5">
            ⚡ Flash Deals
          </h2>
          <span className="text-xs text-gray-400 hidden md:inline">Limited time offers – Don't miss out!</span>
        </div>
        
        {/* Countdown Timer (Kama kwenye picha ya mteja) */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-gray-500 uppercase tracking-wider text-[11px]">Ends in:</span>
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-center"><span className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-sm">03</span><span className="text-[9px] text-gray-400 mt-0.5">Hrs</span></div>
            <span className="font-bold text-gray-400">:</span>
            <div className="flex flex-col items-center"><span className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-sm">45</span><span className="text-[9px] text-gray-400 mt-0.5">Mins</span></div>
            <span className="font-bold text-gray-400">:</span>
            <div className="flex flex-col items-center"><span className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-sm">59</span><span className="text-[9px] text-gray-400 mt-0.5">Secs</span></div>
          </div>
          <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 text-xs font-bold pl-4 border-l">
            View All Deals <FiChevronRight />
          </a>
        </div>
      </div>

      {/* Grid ya Bidhaa Tano (5 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition relative group flex flex-col justify-between">
            {/* Tag ya Punguzo */}
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md z-10">
              {prod.discount}
            </span>
            
            {/* Box la Picha */}
            <div className="h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-5xl relative overflow-hidden group-hover:scale-[1.02] transition duration-200">
              {prod.emoji}
            </div>

            {/* Maelezo */}
            <div>
              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition min-h-[32px]">
                {prod.name}
              </h3>
              
              {/* Bei */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-black text-gray-900">{prod.price}</span>
                <span className="text-[10px] text-gray-400 line-through">{prod.oldPrice}</span>
              </div>

              {/* Nyota na Kikapu */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex text-amber-400 text-xs">
                    {"★".repeat(prod.rating)}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5">({prod.reviews})</span>
                </div>
                
                <button className="bg-gray-50 hover:bg-[#F2A900] text-gray-600 hover:text-white p-2 rounded-full transition shadow-sm border border-gray-100 flex items-center justify-center">
                  <FiShoppingCart size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}