'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Hapa utaweka logic yako halisi ya kuunganisha na API ya login ya Admin
    // Kwa sasa tunaweka mfano (Mock logic)
    setTimeout(() => {
      if (email === 'admin@jtex.co.tz' && password === 'admin123') {
        // Hifadhi token ya admin
        localStorage.setItem('admin_token', 'super_secret_admin_token');
        router.push('/admin'); // Mpeleke kwenye dashboard ya admin
      } else {
        setError('Barua pepe au nenosiri si sahihi. Tafadhali jaribu tena.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-gray-900">
      
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden min-h-[600px] animate-fade-in">
        
        {/* UPANDE WA KUSHOTO: BRANDING (Inaonekana kwenye Desktop tu) */}
        <div className="hidden lg:flex w-1/2 bg-[#0A101D] p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-[#F2A900]" strokeWidth="0.5" fill="none">
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="50" />
              <circle cx="50" cy="50" r="70" />
            </svg>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F2A900]/20 rounded-full blur-3xl"></div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="flex text-4xl font-black italic tracking-tighter">
              <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
            </div>
            <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-md backdrop-blur-sm">
              Workspace
            </span>
          </div>

          {/* Welcome Text */}
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#F2A900] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#F2A900]/20">
              <FiShield className="text-3xl text-[#0A101D]" />
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Admin <br/> Control Panel
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              Karibu kwenye mfumo wa usimamizi wa Jtex. Dhibiti bidhaa, oda, na mauzo yako katika sehemu moja salama.
            </p>
          </div>

          {/* Footer Text */}
          <div className="relative z-10 text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Jtex E-Commerce. All rights reserved.
          </div>
        </div>

        {/* UPANDE WA KULIA: LOGIN FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Back to Home (Mobile only) */}
          <button onClick={() => router.push('/')} className="lg:hidden absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition flex items-center gap-2 text-xs font-bold">
            <FiArrowLeft size={16} /> Rudi mwanzo
          </button>

          <div className="max-w-sm w-full mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="flex text-4xl font-black italic tracking-tighter">
                <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-[#0A101D]">ex</span>
              </div>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-md">
                Admin
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center lg:text-left">Karibu Tena</h2>
            <p className="text-sm text-gray-500 mb-8 text-center lg:text-left font-medium">
              Tafadhali ingiza taarifa zako ili kuendelea.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Barua Pepe</label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 text-gray-400 text-lg" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#F2A900] focus:bg-white transition-all font-medium"
                    placeholder="admin@jtex.co.tz"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nenosiri (Password)</label>
                  <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Umesahau Nenosiri?</a>
                </div>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-gray-400 text-lg" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-12 text-sm outline-none focus:border-[#F2A900] focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#F2A900] focus:ring-[#F2A900] cursor-pointer" />
                <label htmlFor="remember" className="text-xs text-gray-600 font-medium cursor-pointer">Nikumbuke (Remember me)</label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0A101D] hover:bg-gray-900 text-white font-black py-4 rounded-xl text-sm transition-all mt-4 shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Inathibitisha...
                  </>
                ) : (
                  'Ingia kwenye Mfumo'
                )}
              </button>

            </form>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-medium">Huu ni mfumo wa usimamizi (Admin). Tafadhali rudi <a href="/" className="text-[#F2A900] font-bold hover:underline">Dukani</a> ikiwa wewe ni mteja.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}