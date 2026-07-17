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
    // 'h-screen' and 'overflow-hidden' ensure the page does not scroll
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* LEFT PANEL - BRANDING (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden h-full">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 -right-10 w-72 h-72 bg-[#F2A900]/20 rounded-full blur-3xl"></div>
        </div>

        {/* LOGO - DESKTOP */}
        <div className="relative z-10 flex flex-col items-start mt-4">
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-14 lg:h-16 object-contain brightness-0 invert" 
            />
            <div className="mt-3 inline-flex items-center">
              <span className="text-gray-400 font-bold tracking-widest uppercase text-xs">Enterprise Admin Portal</span>
              <span className="ml-3 bg-[#F2A900] text-black text-[9px] font-black px-2 py-0.5 rounded-sm">SECURE</span>
            </div>
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center max-w-md">
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
                Manage your store <br/> <span className="text-[#F2A900]">efficiently & securely.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
                Gain full control to manage products, monitor orders, handle customers, and configure system settings with ease from anywhere.
            </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
            <span>&copy; {new Date().getFullYear()} Jtex E-Commerce</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
            <span>All rights reserved</span>
        </div>
      </div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50/50 relative overflow-y-auto">
        
        {/* LOGO - MOBILE ONLY */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-8 object-contain" 
            />
            <span className="bg-[#0F172A] text-white text-[9px] font-black px-2 py-0.5 rounded-sm mt-1">ADMIN</span>
        </div>

        <div className="w-full max-w-md my-auto">
            
            {/* Form Header */}
            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back 👋</h2>
                <p className="text-gray-500 text-sm font-medium">Please enter your secure credentials to continue.</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 flex items-start gap-3 border border-red-100 shadow-sm animate-fade-in">
                    <FiShield className="text-xl flex-shrink-0 mt-0.5"/> 
                    <span className="leading-relaxed">{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative group">
                        <FiMail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F2A900] transition-colors" size={20}/>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#F2A900]/10 focus:border-[#F2A900] transition-all text-sm font-medium text-gray-900 shadow-sm placeholder-gray-400"
                            placeholder="admin@jtex.co.tz"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Password</label>
                        <button type="button" className="text-xs font-bold text-blue-600 hover:text-[#F2A900] transition-colors">Forgot?</button>
                    </div>
                    <div className="relative group">
                        <FiLock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F2A900] transition-colors" size={20}/>
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#F2A900]/10 focus:border-[#F2A900] transition-all text-sm font-medium text-gray-900 shadow-sm placeholder-gray-400"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                        </button>
                    </div>
                </div>

                <button 
                    disabled={isLoading}
                    className="w-full bg-[#0F172A] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                           <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                           Authenticating...
                        </span>
                    ) : (
                        <>Access Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16}/></>
                    )}
                </button>
            </form>

            <div className="mt-12 lg:hidden text-center">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    &copy; {new Date().getFullYear()} Jtex. All rights reserved.
                </p>
            </div>

        </div>
      </div>

    </div>
  );
}