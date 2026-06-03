'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Mfumo wa mfano wa ku-login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Umefanikiwa kuingia kwenye akaunti yako!");
    window.location.href = '/shop'; // Inamrudisha mteja dukani
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <div className="bg-white w-full max-w-[1000px] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        
        {/* UPANDE WA KUSHOTO: Branding ya Jtex */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#15233D] to-[#1A2E4C] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F2A900]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Link href="/" className="text-3xl font-black text-white tracking-wide">
              J<span className="text-[#F2A900]">tex</span>
            </Link>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Karibu Tena</p>
          </div>

          <div className="relative z-10 my-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Ingia Kwenye <br />Akaunti Yako!
            </h2>
            <p className="text-sm text-gray-300">
              Endelea ulipoishia. Kagua oda zako, angalia bidhaa ulizohifadhi kwenye Wishlist, na upate ofa maalum.
            </p>
          </div>

          <div className="relative z-10 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Jtex Platform.
          </div>
        </div>

        {/* UPANDE WA KULIA: Fomu ya Login */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900">Ingia (Login)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Hauna akaunti?{' '}
              <Link href="/register" className="text-[#F2A900] font-bold hover:underline">
                Jisajili Hapa
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Barua Pepe (Email)</label>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiMail className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type="email" 
                  placeholder="johndoe@gmail.com" 
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Nywila (Password)</label>
                <a href="#" className="text-xs text-[#F2A900] font-bold hover:underline">Umesahau Nywila?</a>
              </div>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiLock className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition pl-2"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-2 text-sm font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md bg-[#0F172A] text-white hover:bg-gray-800"
            >
              Ingia <FiArrowRight className="stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}