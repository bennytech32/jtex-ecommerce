'use client';

import React, { useState } from 'react';
import { FiLock, FiMail, FiArrowRight, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Trim invisible spaces (Autofill prevention)
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Logic for JWT Token Simulation
    if (cleanEmail === 'admin@jtex.co.tz' && cleanPassword === 'admin@123') {
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jtex-admin-access-token";
        localStorage.setItem('jtex_admin_token', mockToken);
        
        setTimeout(() => {
            // Force reload to bypass Next.js cache
            window.location.href = '/admin/dashboard';
        }, 800);
    } else {
        setTimeout(() => {
            setIsLoading(false);
            setError('Invalid email or password. Please try again.');
        }, 800);
    }
  };

  return (
    // Single page, no scrolling, dark background for the entire view
    <div className="h-screen w-full bg-[#0F172A] font-sans overflow-hidden flex flex-col lg:flex-row relative">
      
      {/* Background Decorations (Applied to the whole screen) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 -right-10 w-72 h-72 bg-[#F2A900]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* ========================================= */}
      {/* LEFT PANEL - BRANDING & TEXT */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-between p-8 sm:p-12 lg:p-16 h-auto lg:h-full">
        
        {/* LOGO */}
        <div className="flex flex-col items-start mt-2">
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-10 sm:h-14 lg:h-16 object-contain brightness-0 invert" 
            />
            <div className="mt-4 inline-flex items-center">
              <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] sm:text-xs">Enterprise Admin Portal</span>
              <span className="ml-3 bg-[#F2A900] text-black text-[9px] font-black px-2 py-0.5 rounded-sm">SECURE</span>
            </div>
        </div>

        {/* HERO TEXT */}
        <div className="flex-grow flex flex-col justify-center max-w-lg mt-12 lg:mt-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Manage your store <br/> <span className="text-[#F2A900]">efficiently & securely.</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Gain full control to manage products, monitor orders, handle customers, and configure system settings with ease from anywhere.
            </p>
        </div>

        {/* FOOTER TEXT (Hidden on mobile to save space, shown below form instead) */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500 font-medium mb-2">
            <span>&copy; {new Date().getFullYear()} Jtex E-Commerce</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
            <span>All rights reserved</span>
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT PANEL - LOGIN FORM */}
      {/* ========================================= */}
      <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-center lg:items-start justify-center p-8 sm:p-12 lg:p-16 h-full mt-[-20px] lg:mt-0">
        
        <div className="w-full max-w-md my-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl">
            
            {/* Form Header */}
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Welcome Back 👋</h2>
                <p className="text-gray-400 text-sm font-medium">Please enter your secure credentials to continue.</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 flex items-start gap-3 border border-red-500/20 shadow-sm animate-fade-in">
                    <FiShield className="text-xl flex-shrink-0 mt-0.5"/> 
                    <span className="leading-relaxed">{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative group">
                        <FiMail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#F2A900] transition-colors" size={20}/>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0A101D]/50 border border-gray-700 rounded-xl outline-none focus:ring-1 focus:ring-[#F2A900] focus:border-[#F2A900] transition-all text-sm font-medium text-white shadow-inner placeholder-gray-600"
                            placeholder="admin@jtex.co.tz"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Password</label>
                        <button type="button" className="text-xs font-bold text-[#F2A900] hover:text-white transition-colors">Forgot?</button>
                    </div>
                    <div className="relative group">
                        <FiLock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#F2A900] transition-colors" size={20}/>
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-[#0A101D]/50 border border-gray-700 rounded-xl outline-none focus:ring-1 focus:ring-[#F2A900] focus:border-[#F2A900] transition-all text-sm font-medium text-white shadow-inner placeholder-gray-600"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                        </button>
                    </div>
                </div>

                <button 
                    disabled={isLoading}
                    className="w-full bg-[#F2A900] hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(242,169,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed mt-4 group"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                           <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                           Authenticating...
                        </span>
                    ) : (
                        <>Access Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16}/></>
                    )}
                </button>
            </form>
        </div>

        {/* MOBILE FOOTER TEXT */}
        <div className="mt-8 lg:hidden text-center w-full">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                &copy; {new Date().getFullYear()} Jtex. All rights reserved.
            </p>
        </div>

      </div>

    </div>
  );
}