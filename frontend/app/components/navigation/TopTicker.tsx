import React from "react"; 
import { FiTruck, FiLock, FiPhoneCall } from "react-icons/fi"; 

export default function TopTicker() { 
  return (
    <div className="bg-[#0F172A] text-white text-xs py-2.5 px-6 flex justify-between items-center hidden md:flex border-b border-slate-800">
      <div>
        Welcome to <span className="font-bold text-[#F2A900]">Jtex</span> – Best Quality, Best Prices!
      </div>
      <div className="flex space-x-6 items-center">
        <span className="flex items-center gap-1.5">
          <FiTruck className="text-[#F2A900]" /> FREE Delivery on orders over TZS 50,000
        </span>
        <span className="flex items-center gap-1.5">
          <FiLock className="text-[#F2A900]" /> Money-back Guarantee 60 Days
        </span>
        <span className="flex items-center gap-1.5">
          <FiPhoneCall className="text-[#F2A900]" /> 24/7 Customer Support
        </span>
      </div>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-[#F2A900]">Track Order</a>
        <span className="text-slate-700">|</span>
        <a href="#" className="hover:text-[#F2A900]">Help Center</a>
      </div>
    </div>
  ); 
}