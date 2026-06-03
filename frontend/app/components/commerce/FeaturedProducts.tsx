import React from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const products = [
  { id: 1, name: "Sony 65\" 4K Smart TV", price: "TZS 1,850,000", rating: 5, emoji: "📺" },
  { id: 2, name: "PlayStation 5 Console", price: "TZS 1,500,000", rating: 5, emoji: "🎮" },
  { id: 3, name: "Nikon DSLR Camera", price: "TZS 950,000", rating: 4, emoji: "📸" },
  { id: 4, name: "Apple AirPods Pro", price: "TZS 450,000", rating: 5, emoji: "🎧" },
  { id: 5, name: "Microwave Oven 20L", price: "TZS 180,000", rating: 4, emoji: "🍲" },
  { id: 6, name: "Office Ergonomic Chair", price: "TZS 250,000", rating: 5, emoji: "🪑" },
];

// HAKIKISHA NENO 'export default' LIPO HAPA
export default function FeaturedProducts() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-900">✨ Featured Products</h2>
        <a href="/shop" className="text-sm text-blue-600 font-bold hover:underline">View All</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md transition relative group flex flex-col justify-between">
            <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10">
              <FiHeart size={14} />
            </button>
            
            <div className="h-28 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-5xl relative overflow-hidden group-hover:scale-105 transition duration-200 cursor-pointer">
              {prod.emoji}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition min-h-[32px] cursor-pointer">
                {prod.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A]">{prod.price}</span>
                <button className="bg-gray-50 hover:bg-[#F2A900] text-gray-600 hover:text-white p-1.5 rounded-full transition border border-gray-100">
                  <FiShoppingCart size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}