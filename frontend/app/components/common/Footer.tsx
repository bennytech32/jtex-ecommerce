import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhoneCall, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-16 pb-8 border-t-4 border-[#F2A900] mt-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Gridi kuu ya Footer (Sehemu 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* 1. Taarifa za Jtex na Mawasiliano */}
          <div>
            <div className="text-3xl font-black text-white mb-6">J<span className="text-[#F2A900]">tex</span></div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed pr-4">
              Best Quality, Best Prices. Shop the latest gadgets, electronics, fashion and more at unbeatable prices directly from Kariakoo.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#F2A900] text-lg flex-shrink-0 mt-0.5" /> 
                <span>Kariakoo, Dar es Salaam,<br/>Tanzania</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhoneCall className="text-[#F2A900] text-lg flex-shrink-0" /> 
                <span>+255 767 659 586</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#F2A900] text-lg flex-shrink-0" /> 
                <span>support@jtex.co.tz</span>
              </li>
            </ul>
          </div>

          {/* 2. Huduma kwa Wateja (Customer Service) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Help Center</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Shipping Information</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> FAQs</a></li>
            </ul>
          </div>

          {/* 3. Viungo vya Haraka (Quick Links) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> About Us</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Flash Deals</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Top Brands</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#F2A900] transition flex items-center gap-2"><span className="text-[#F2A900] text-xs">▸</span> Terms & Conditions</a></li>
            </ul>
          </div>

          {/* 4. Usajili wa Barua Pepe (Newsletter) & Socials */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="flex items-center bg-[#15233D] rounded-md overflow-hidden border border-slate-700 focus-within:border-[#F2A900] transition">
              <input type="email" placeholder="Your email address" className="bg-transparent w-full px-4 py-3 text-sm text-white outline-none" />
              <button className="bg-[#F2A900] text-[#0F172A] px-5 py-3 font-bold hover:bg-yellow-500 transition text-sm">
                Subscribe
              </button>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-[#15233D] border border-slate-700 flex items-center justify-center hover:bg-[#F2A900] hover:text-[#0F172A] transition text-white"><FiFacebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#15233D] border border-slate-700 flex items-center justify-center hover:bg-[#F2A900] hover:text-[#0F172A] transition text-white"><FiTwitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#15233D] border border-slate-700 flex items-center justify-center hover:bg-[#F2A900] hover:text-[#0F172A] transition text-white"><FiInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#15233D] border border-slate-700 flex items-center justify-center hover:bg-[#F2A900] hover:text-[#0F172A] transition text-white"><FiLinkedin size={18} /></a>
            </div>
          </div>
        </div>

        {/* Mstari wa Chini Kabisa (Copyright & Payment Methods) */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Jtex E-commerce. All Rights Reserved.
          </p>
          
          <div className="flex gap-2 items-center opacity-80 hover:opacity-100 transition">
            {/* Badges za malipo (Mockups) */}
            <div className="px-3 py-1.5 bg-white rounded-md text-[#0F172A] text-[10px] font-black italic tracking-tighter">VISA</div>
            <div className="px-3 py-1.5 bg-white rounded-md text-[#0F172A] text-[10px] font-black italic">MasterCard</div>
            <div className="px-3 py-1.5 bg-blue-600 rounded-md text-white text-[10px] font-bold">Selcom Pay</div>
            <div className="px-3 py-1.5 bg-[#F2A900] rounded-md text-[#0F172A] text-[10px] font-bold">Mobile Money</div>
          </div>
        </div>
      </div>
    </footer>
  );
}