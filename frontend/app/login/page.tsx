'use client';

import React, { useState } from 'react';
import { FiLock, FiMail, FiArrowRight, FiEye, FiEyeOff, FiShield, FiChevronLeft, FiBox, FiCreditCard, FiStar, FiHeadphones, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (cleanEmail && cleanPassword) {
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jtex-customer-token";
        
        localStorage.setItem('jtex_token', mockToken); 
        localStorage.setItem('jtex_user', JSON.stringify({
            id: "123",
            name: cleanEmail.split('@')[0], 
            email: cleanEmail
        }));
        
        setTimeout(() => {
            window.location.href = '/shop'; 
        }, 1200);
    } else {
        setIsLoading(false);
        setError('Tafadhali jaza barua pepe na nenosiri lako.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060B19] text-white relative font-sans selection:bg-[#F2A900] selection:text-black overflow-x-hidden flex justify-center">
      
      {/* BACKGROUND IMAGE - IMEONGEZEWA OPACITY ILI IONEKANE ZAIDI */}
      <div className="absolute top-0 left-0 w-full lg:w-[65%] h-[50vh] lg:h-full z-0 overflow-hidden pointer-events-none">
        <img 
            src="/login.png" 
            alt="Jtex Login Background" 
            className="w-full h-full object-cover opacity-70 mix-blend-screen" 
        />
        {/* Gradient imepunguzwa giza kidogo ili kuruhusu picha kuonekana safi */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B19]/10 via-[#060B19]/60 to-[#060B19] lg:bg-gradient-to-r lg:from-[#060B19]/10 lg:via-[#060B19]/70 lg:to-[#060B19]"></div>
      </div>

      {/* MUUNDO MKUU WA KIOO */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* UPANDE WA KUSHOTO (Branding & Features) */}
        <div className="w-full lg:w-[55%] xl:w-[60%] px-6 pt-8 pb-4 lg:p-12 xl:p-16 flex flex-col justify-between">
            
            {/* Header / Top Navigation (Mobile & Desktop) */}
            <div className="flex justify-between items-center w-full">
                <Link href="/" className="p-2.5 bg-[#060B19]/40 hover:bg-[#060B19]/60 rounded-xl transition backdrop-blur-md border border-white/10">
                    <FiChevronLeft size={20} />
                </Link>
                
                {/* Logo */}
                <div className="text-3xl sm:text-4xl font-black tracking-tighter flex items-center drop-shadow-lg">
                    <span className="text-[#FF9900]">X</span><span className="text-white ml-0.5">Jtex</span>
                    <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded ml-1 self-start mt-1">®</span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-bold bg-[#060B19]/40 hover:bg-[#060B19]/60 border border-white/10 px-4 py-2.5 rounded-full transition backdrop-blur-md">
                        🌐 EN <span className="text-gray-400">⌄</span>
                    </button>
                    <span className="hidden lg:block text-sm font-medium text-gray-200 cursor-pointer hover:text-white transition drop-shadow-md">Need Help?</span>
                </div>
            </div>

            {/* Maneno ya Kukaribisha (Welcome Texts) */}
            <div className="mt-12 lg:mt-0 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-3 drop-shadow-xl">
                    Welcome Back!
                </h1>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-200 mb-4 drop-shadow-md">
                    Log in to your Jtex account
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed hidden lg:block max-w-md drop-shadow-md bg-[#060B19]/30 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                    Access your orders, track shipments, make payments and enjoy exclusive member benefits.
                </p>
            </div>

            {/* Features (Desktop Only) - Backgrounds zimefanywa zionekane kwenye picha */}
            <div className="hidden lg:grid grid-cols-4 gap-6 max-w-3xl mt-12">
                <div className="space-y-3 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400"><FiShield size={24}/></div>
                    <h3 className="font-bold text-sm text-white drop-shadow-md">Secure & Safe</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Your data is protected with top security</p>
                </div>
                <div className="space-y-3 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400"><FiBox size={24}/></div>
                    <h3 className="font-bold text-sm text-white drop-shadow-md">Track Orders</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Real-time updates on every shipment</p>
                </div>
                <div className="space-y-3 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400"><FiCreditCard size={24}/></div>
                    <h3 className="font-bold text-sm text-white drop-shadow-md">Easy Payments</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Multiple payment options available</p>
                </div>
                <div className="space-y-3 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400"><FiStar size={24}/></div>
                    <h3 className="font-bold text-sm text-white drop-shadow-md">Exclusive Deals</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Special offers for our members</p>
                </div>
            </div>

            {/* Footer ya Kushoto (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-8 mt-auto pt-10 text-xs font-bold text-gray-300 drop-shadow-md">
                <span className="flex items-center gap-2"><FiShield className="text-gray-400"/> SSL Encrypted</span>
                <span className="flex items-center gap-2"><FiLock className="text-gray-400"/> Privacy Protected</span>
                <span className="flex items-center gap-2"><FiCheckCircle className="text-gray-400"/> Trusted by 50K+ Customers</span>
            </div>
        </div>

        {/* UPANDE WA KULIA (Login Form & Cards) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] px-4 pb-8 lg:p-12 flex flex-col justify-center mt-6 lg:mt-0 relative z-20">
            
            {/* Kadi Kuu ya Login */}
            <div className="bg-[#0F172A]/95 border border-gray-800/80 rounded-[2rem] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                
                <div className="hidden lg:block mb-8">
                    <h2 className="text-2xl font-black text-white mb-2">Login to Your Account</h2>
                    <p className="text-sm text-gray-400">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-3">
                        <FiShield className="text-lg flex-shrink-0 mt-0.5"/> 
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <FiMail className="text-[#FF9900]"/> Email Address
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-4 text-gray-500" size={18}/>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all text-sm text-white placeholder-gray-600"
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <FiLock className="text-[#FF9900]"/> Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-gray-500" size={18}/>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all text-sm text-white placeholder-gray-600"
                                placeholder="Enter your password"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mt-2 mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#060B19] text-[#FF9900] focus:ring-[#FF9900] focus:ring-offset-0 cursor-pointer accent-[#FF9900]" />
                            <span className="group-hover:text-white transition">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm font-bold text-[#4DA8DA] hover:text-white transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#FF9900] to-[#FFB800] hover:from-[#e68a00] hover:to-[#e6a600] text-[#0F172A] py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF9900]/20 disabled:opacity-70 mt-4 group"
                    >
                        {isLoading ? "Authenticating..." : <>Login <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/></>}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-gray-800 flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium">Or continue with</span>
                    <div className="h-px bg-gray-800 flex-1"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-3 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition">
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                        <span className="hidden sm:block">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.405c.895-1.09 1.5-2.485 1.33-3.905-1.19.05-2.67.8-3.6 1.905-.82.985-1.53 2.4-1.34 3.8 1.33.105 2.715-.71 3.61-1.8zM17.155 13.56c-.02-2.52 2.06-3.74 2.155-3.8-.16-1.685-1.135-3.08-2.655-3.29-1.535-.21-3.005.85-3.79.85-.78 0-1.99-.835-3.265-.815-1.665.02-3.195.965-4.055 2.47-1.745 3.035-.445 7.515 1.255 9.975.835 1.205 1.815 2.545 3.1 2.5 1.24-.045 1.715-.8 3.205-.8 1.485 0 1.925.8 3.225.78 1.32-.02 2.17-1.22 2.99-2.42.95-1.39 1.345-2.735 1.365-2.805-.03-.015-2.63-1.01-2.64-3.64z" transform="translate(0, 4)"/></svg>
                        <span className="hidden sm:block">Apple</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1877F2] py-3 rounded-xl text-xs sm:text-sm font-bold transition">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="hidden sm:block">Facebook</span>
                    </button>
                </div>

                <div className="mt-8 lg:hidden text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account? <Link href="/register" className="text-[#FF9900] font-bold hover:underline">Sign up now</Link>
                    </p>
                </div>
            </div>

            {/* Mobile Banner: Security */}
            <div className="lg:hidden mt-6 bg-[#0F172A]/90 border border-gray-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-full bg-[#FF9900]/10 flex items-center justify-center text-[#FF9900] flex-shrink-0">
                    <FiShield size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Your security is our priority</h3>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">We use top-level encryption to keep your data safe.</p>
                </div>
            </div>

            {/* Desktop Banner: Create Account */}
            <div className="hidden lg:flex mt-6 bg-[#0F172A]/90 border border-gray-800/80 p-6 rounded-2xl items-center justify-between shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FiHeadphones size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">New to Jtex?</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Create an account and start your journey with us.</p>
                    </div>
                </div>
                <Link href="/register" className="flex items-center gap-2 border border-gray-600 hover:border-white text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                    Create Account <FiArrowRight />
                </Link>
            </div>

        </div>
      </div>
    </div>
  );
}