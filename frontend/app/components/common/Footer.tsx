'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiPhone, FiMail, FiMapPin, FiFacebook, 
  FiInstagram, FiTwitter, FiLinkedin, FiChevronRight 
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-gray-400 pt-16 pb-8 font-sans border-t-[6px] border-[#F2A900]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 border-b border-gray-800 pb-12">
          
          {/* COLUMN 1: BRAND INFO */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black text-white tracking-tight flex items-center">
              J<span className="text-[#F2A900]">tex</span>
            </Link>
            <p className="text-sm leading-relaxed pr-4">
              Your ultimate online marketplace for electronics, fashion, and home essentials. Fast delivery, secure payments, and top-notch customer service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#F2A900] hover:text-[#0F172A] transition shadow-md">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#F2A900] hover:text-[#0F172A] transition shadow-md">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#F2A900] hover:text-[#0F172A] transition shadow-md">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#F2A900] hover:text-[#0F172A] transition shadow-md">
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4 className="text-white font-black text-lg mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Home
                </Link>
              </li>
              <li>
                <Link href="/?cart=open" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> View Cart
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> My Account
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CUSTOMER SERVICE (Linked to Help Center Tabs) */}
          <div>
            <h4 className="text-white font-black text-lg mb-6 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help?tab=faq" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Help Center
                </Link>
              </li>
              <li>
                <Link href="/help?tab=track" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/help?tab=returns" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/help?tab=shipping" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/help?tab=faq" className="flex items-center gap-2 text-sm hover:text-[#F2A900] transition group">
                  <FiChevronRight className="text-gray-600 group-hover:text-[#F2A900] transition" /> FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div>
            <h4 className="text-white font-black text-lg mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#F2A900] text-xl shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">Makumbusho, Uhuru Street<br />Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-[#F2A900] text-xl shrink-0" />
                <span className="text-sm">+255 700 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#F2A900] text-xl shrink-0" />
                <span className="text-sm">support@jtex.co.tz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: COPYRIGHT & PAYMENTS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>&copy; {currentYear} Jtex Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Secure Payments via:</span>
            <div className="flex gap-2">
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">M-Pesa</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Tigo Pesa</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Visa</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}