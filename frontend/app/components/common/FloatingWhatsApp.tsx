import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';

export default function FloatingWhatsApp() {
  return (
    <a 
      href="https://wa.me/255767659586" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition duration-300 flex items-center justify-center group"
    >
      <FiMessageCircle size={28} className="stroke-[2]" />
      
      {/* Kijisanduku cha Maelezo (Tooltip) */}
      <span className="absolute right-16 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
        Chat na Sisi
      </span>
    </a>
  );
}