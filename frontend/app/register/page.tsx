'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Kwa ajili ya kuhamisha page baada ya usajili
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // States za fomu
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // States za kuonyesha loading na errors
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function ya kutuma data Backend
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Tunatuma request kwenda kwenye server yetu ya Express (Port 5001)
      const res = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Kama kuna kosa (mfano email imetumika), onyesha error
        setErrorMessage(data.error || 'Kuna tatizo limetokea.');
        setIsLoading(false);
        return;
      }

      // Kama usajili umefanikiwa
      setSuccessMessage('Umefanikiwa kujisajili! Tunakupeleka kwenye ukurasa wa kuingia...');
      
      // Hifadhi token kwenye localStorage ili mfumo umtambue (hiari)
      localStorage.setItem('jtex_token', data.token);
      localStorage.setItem('jtex_user', JSON.stringify(data.user));

      // Mpeleke mteja kwenye Login baada ya sekunde 2
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage('Imeshindwa kuwasiliana na server. Hakikisha Backend ipo hewani.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <div className="bg-white w-full max-w-[1000px] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        
        {/* UPANDE WA KUSHOTO (Branding) */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#15233D] to-[#1A2E4C] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F2A900]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Link href="/" className="text-3xl font-black text-white tracking-wide">
              J<span className="text-[#F2A900]">tex</span>
            </Link>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Best Quality, Best Prices</p>
          </div>

          <div className="relative z-10 my-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Fungua Akaunti Yako <br />Ufurahie Ofa Kabambe!
            </h2>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <FiCheckCircle className="text-[#F2A900] text-lg flex-shrink-0" />
                <span>Pata punguzo la hadi 40% kwenye ofa za Flash Sales.</span>
              </li>
              <li className="flex items-center gap-3">
                <FiCheckCircle className="text-[#F2A900] text-lg flex-shrink-0" />
                <span>Fuatilia oda zako (Order Tracking) kwa urahisi zaidi.</span>
              </li>
            </ul>
          </div>
          <div className="relative z-10 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Jtex Platform. All Rights Reserved.
          </div>
        </div>

        {/* UPANDE WA KULIA (Fomu) */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900">Anza Sasa</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tayari una akaunti?{' '}
              <Link href="/login" className="text-[#F2A900] font-bold hover:underline">
                Ingia Hapa (Login)
              </Link>
            </p>
          </div>

          {/* Sehemu ya Kuonyesha Ujumbe (Errors au Success) */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg font-medium flex items-center gap-2">
              <FiCheckCircle /> {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* 1. Jina Kamili */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Jina Kamili</label>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiUser className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mfano: John Doe" 
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  required
                />
              </div>
            </div>

            {/* 2. Barua Pepe */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Barua Pepe</label>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiMail className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@gmail.com" 
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  required
                />
              </div>
            </div>

            {/* 3. Namba ya Simu */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Namba ya Simu</label>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiPhone className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0767659586" 
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  required
                />
              </div>
            </div>

            {/* 4. Nywila */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nywila</label>
              <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#F2A900] focus-within:bg-white transition px-4 py-3">
                <FiLock className="text-gray-400 text-lg flex-shrink-0 mr-3" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Makubaliano */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="rounded text-[#F2A900] focus:ring-[#F2A900] mt-0.5 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer select-none leading-relaxed">
                Ninakubaliana na Vigezo na Masharti.
              </label>
            </div>

            {/* Kitufe cha Kujisajili */}
            <button 
              type="submit"
              disabled={!agreeTerms || isLoading ? true : undefined}
              suppressHydrationWarning={true}
              className={`w-full mt-6 text-sm font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-md ${
                agreeTerms && !isLoading
                  ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? 'Inasajili...' : 'Tengeneza Akaunti'} 
              {!isLoading && <FiArrowRight className="stroke-[2.5]" />}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}