import React from "react"; 
import { FiTruck, FiShield, FiCreditCard, FiHeadphones } from "react-icons/fi";

export default function TrustBadges() { 
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 py-5 px-6 gap-4 items-center">
      
      <div className="flex items-center space-x-3 justify-center md:justify-start">
        <FiTruck className="text-gray-700 text-2xl stroke-[1.5]" />
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase">FREE Shipping</h4>
          <p className="text-[10px] text-gray-400">On orders over TZS 50,000</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 justify-center md:justify-start md:border-l md:border-gray-100 md:pl-4">
        <FiShield className="text-gray-700 text-2xl stroke-[1.5]" />
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase">Money-back Guarantee</h4>
          <p className="text-[10px] text-gray-400">For up to 60 days</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 justify-center md:justify-start md:border-l md:border-gray-100 md:pl-4">
        <FiCreditCard className="text-gray-700 text-2xl stroke-[1.5]" />
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase">Secure Payments</h4>
          <p className="text-[10px] text-gray-400">100% secure payments</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 justify-center md:justify-start md:border-l md:border-gray-100 md:pl-4">
        <FiHeadphones className="text-gray-700 text-2xl stroke-[1.5]" />
        <div>
          <h4 className="text-[11px] font-bold text-gray-900 uppercase">24/7 Support</h4>
          <p className="text-[10px] text-gray-400">We are here to help</p>
        </div>
      </div>

    </div>
  ); 
}