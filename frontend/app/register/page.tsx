'use client';

import React, { useState } from 'react';
import { 
    FiLock, FiMail, FiArrowRight, FiEye, FiEyeOff, FiShield, 
    FiChevronLeft, FiBox, FiCreditCard, FiUser, FiCheckCircle, 
    FiCalendar, FiMapPin, FiChevronDown, FiAward, FiStar, FiGlobe
} from 'react-icons/fi';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [formData, setFormData] = useState({
      firstName: '', lastName: '', email: '', phone: '',
      password: '', confirmPassword: '', dob: '', gender: '',
      country: 'Tanzania', city: '', agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError("Nywila (Passwords) hazifanani!");
        return;
    }

    if (!formData.agreeTerms) {
        setError("Tafadhali kubali vigezo na masharti (Terms & Conditions).");
        return;
    }

    setIsLoading(true);
    
    // HAPA WEKA LOGIC YA KUTUMA DATA KWENYE API YAKO
    setTimeout(() => {
        setIsLoading(false);
        window.location.href = '/login'; 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060B19] text-white relative font-sans selection:bg-[#F2A900] selection:text-black overflow-x-hidden flex justify-center">
      
      {/* BACKGROUND IMAGE - Ipo sawa na ya Login */}
      <div className="absolute top-0 left-0 w-full lg:w-[65%] h-[50vh] lg:h-full z-0 overflow-hidden pointer-events-none">
        <img 
            src="/login.png" 
            alt="Jtex Register Background" 
            className="w-full h-full object-cover opacity-70 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B19]/10 via-[#060B19]/60 to-[#060B19] lg:bg-gradient-to-r lg:from-[#060B19]/10 lg:via-[#060B19]/70 lg:to-[#060B19]"></div>
      </div>

      {/* MUUNDO MKUU WA KIOO */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* UPANDE WA KUSHOTO (Branding & Features) */}
        <div className="hidden lg:flex w-[55%] xl:w-[60%] px-6 pt-8 pb-4 lg:p-12 xl:p-16 flex-col justify-between">
            
            {/* Header / Top Navigation (Desktop) */}
            <div className="flex justify-between items-center w-full">
                <div className="text-3xl sm:text-4xl font-black tracking-tighter flex items-center drop-shadow-lg">
                    <span className="text-[#FF9900]">X</span><span className="text-white ml-0.5">Jtex</span>
                    <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded ml-1 self-start mt-1">®</span>
                </div>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-bold bg-[#060B19]/40 hover:bg-[#060B19]/60 border border-white/10 px-4 py-2.5 rounded-full transition backdrop-blur-md">
                        🌐 EN <span className="text-gray-400">⌄</span>
                    </button>
                    <div className="text-sm font-medium text-gray-300 drop-shadow-md">
                        Already have an account? <Link href="/login" className="text-[#FF9900] font-bold hover:text-yellow-400 ml-1 transition">Login</Link>
                    </div>
                </div>
            </div>

            {/* Maelezo Makuu (Hero Texts) */}
            <div className="mt-12 lg:mt-0 max-w-xl mx-auto lg:mx-0">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4 drop-shadow-xl">
                    Create Your <br/> Jtex Account
                </h1>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md drop-shadow-md bg-[#060B19]/30 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                    Join thousands of smart customers enjoying a seamless shopping and delivery experience.
                </p>
            </div>

            {/* Features (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-2 gap-6 max-w-2xl mt-12">
                <div className="flex items-start gap-4 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0"><FiShield size={24}/></div>
                    <div>
                        <h3 className="font-bold text-sm text-white drop-shadow-md">Secure & Trusted</h3>
                        <p className="text-xs text-gray-300 mt-1">Your data is protected with enterprise level security.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0"><FiBox size={24}/></div>
                    <div>
                        <h3 className="font-bold text-sm text-white drop-shadow-md">Fast & Reliable</h3>
                        <p className="text-xs text-gray-300 mt-1">Track orders in real-time and get fast delivery updates.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0"><FiCreditCard size={24}/></div>
                    <div>
                        <h3 className="font-bold text-sm text-white drop-shadow-md">Easy Payments</h3>
                        <p className="text-xs text-gray-300 mt-1">Multiple secure payment methods for your convenience.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 bg-[#060B19]/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0"><FiAward size={24}/></div>
                    <div>
                        <h3 className="font-bold text-sm text-white drop-shadow-md">Exclusive Benefits</h3>
                        <p className="text-xs text-gray-300 mt-1">Enjoy member-only deals, discounts and rewards.</p>
                    </div>
                </div>
            </div>

            {/* Trust Badges Widget */}
            <div className="mt-auto pt-10">
                <div className="bg-[#060B19]/60 backdrop-blur-md border border-white/5 p-4 rounded-2xl inline-flex items-center gap-6 shadow-xl mb-6">
                    <div className="flex -space-x-3">
                        <img className="w-10 h-10 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=11" alt="User"/>
                        <img className="w-10 h-10 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=12" alt="User"/>
                        <img className="w-10 h-10 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=13" alt="User"/>
                        <div className="w-10 h-10 rounded-full border-2 border-[#0F172A] bg-blue-600 flex items-center justify-center text-xs font-bold">+50K</div>
                    </div>
                    <div>
                        <div className="flex text-[#FF9900] text-sm mb-1">
                            <FiStar className="fill-current"/> <FiStar className="fill-current"/> <FiStar className="fill-current"/> <FiStar className="fill-current"/> <FiStar className="fill-current"/>
                        </div>
                        <p className="text-xs text-gray-300 font-medium">Trusted by 50,000+ customers worldwide</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 text-xs font-bold text-gray-400 drop-shadow-md">
                    <span className="flex items-center gap-2"><FiShield size={14}/> SSL Encrypted</span>
                    <span className="flex items-center gap-2"><FiLock size={14}/> Privacy Protected</span>
                    <span className="flex items-center gap-2"><FiCheckCircle size={14}/> Trusted by 50K+ Customers</span>
                </div>
            </div>
        </div>

        {/* UPANDE WA KULIA (Register Form) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] px-4 pb-8 lg:p-12 flex flex-col justify-center mt-6 lg:mt-0 relative z-20">
            
            <div className="w-full bg-[#0F172A]/95 border border-gray-800/80 rounded-[2rem] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                
                {/* Mobile Navigation */}
                <div className="lg:hidden mb-6 flex justify-between items-center">
                    <Link href="/login" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10 text-white">
                        <FiChevronLeft size={20} />
                    </Link>
                    <div className="text-2xl font-black tracking-tighter flex items-center">
                        <span className="text-[#FF9900]">X</span><span className="text-white ml-0.5">Jtex</span><span className="text-[8px] bg-white/10 text-gray-300 px-1 py-0.5 rounded ml-1 self-start mt-1">®</span>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-full text-white">
                        🌐 EN <FiChevronDown />
                    </button>
                </div>
                
                {/* Titles */}
                <div className="text-center lg:text-left mb-8">
                    <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">Sign Up</h1>
                    <p className="text-sm text-gray-400">Fill in your details to create your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-3">
                        <FiShield className="text-lg flex-shrink-0 mt-0.5"/> 
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 lg:space-y-5">
                    
                    {/* Majina */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">First Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} 
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all text-sm text-white placeholder-gray-600" 
                                    placeholder="First name" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Last Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} 
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all text-sm text-white placeholder-gray-600" 
                                    placeholder="Last name" />
                            </div>
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} 
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all text-sm text-white placeholder-gray-600" 
                                    placeholder="Email address" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Phone Number</label>
                            <div className="flex bg-[#060B19] border border-gray-700/50 rounded-xl overflow-hidden focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900] transition-all">
                                <div className="flex items-center justify-center px-3 border-r border-gray-700/50 bg-[#151F32] cursor-pointer">
                                    <span className="text-lg mr-1">🇹🇿</span>
                                    <span className="text-sm font-bold text-white">+255</span>
                                </div>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} 
                                    className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-white placeholder-gray-600" 
                                    placeholder="712 345 678" />
                            </div>
                        </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} 
                                    className="w-full pl-11 pr-10 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] transition-all text-sm text-white placeholder-gray-600" 
                                    placeholder="Create password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors">
                                    {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} 
                                    className="w-full pl-11 pr-10 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] transition-all text-sm text-white placeholder-gray-600" 
                                    placeholder="Confirm password" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors">
                                    {showConfirmPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Country & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Country</label>
                            <div className="relative">
                                <FiGlobe className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <select name="country" value={formData.country} onChange={handleChange} 
                                    className="w-full pl-11 pr-10 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] transition-all text-sm text-white appearance-none">
                                    <option value="Tanzania">Tanzania</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Uganda">Uganda</option>
                                </select>
                                <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={18}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">City</label>
                            <div className="relative">
                                <FiMapPin className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                                <select name="city" value={formData.city} onChange={handleChange} 
                                    className="w-full pl-11 pr-10 py-3.5 bg-[#060B19] border border-gray-700/50 rounded-xl outline-none focus:border-[#FF9900] transition-all text-sm text-white appearance-none">
                                    <option value="">Select city</option>
                                    <option value="Dar es Salaam">Dar es Salaam</option>
                                    <option value="Arusha">Arusha</option>
                                    <option value="Mwanza">Mwanza</option>
                                    <option value="Dodoma">Dodoma</option>
                                </select>
                                <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={18}/>
                            </div>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                                className="w-4.5 h-4.5 rounded border-gray-600 bg-[#060B19] text-[#FF9900] focus:ring-[#FF9900] cursor-pointer accent-[#FF9900]" />
                            <span className="text-sm text-gray-300">
                                I agree to the <a href="#" className="text-[#FF9900] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#FF9900] hover:underline">Privacy Policy</a>
                            </span>
                        </label>
                    </div>

                    {/* Create Account Button */}
                    <button disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#FF9900] to-[#FFB800] hover:from-[#e68a00] hover:to-[#e6a600] text-[#0F172A] py-4 rounded-xl font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF9900]/20 mt-4 group">
                        {isLoading ? "Creating..." : <>Create Account <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18}/></>}
                    </button>
                </form>

                {/* Social Logins */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-gray-800 flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium">Or sign up with</span>
                    <div className="h-px bg-gray-800 flex-1"></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                        <span className="hidden sm:block">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.405c.895-1.09 1.5-2.485 1.33-3.905-1.19.05-2.67.8-3.6 1.905-.82.985-1.53 2.4-1.34 3.8 1.33.105 2.715-.71 3.61-1.8zM17.155 13.56c-.02-2.52 2.06-3.74 2.155-3.8-.16-1.685-1.135-3.08-2.655-3.29-1.535-.21-3.005.85-3.79.85-.78 0-1.99-.835-3.265-.815-1.665.02-3.195.965-4.055 2.47-1.745 3.035-.445 7.515 1.255 9.975.835 1.205 1.815 2.545 3.1 2.5 1.24-.045 1.715-.8 3.205-.8 1.485 0 1.925.8 3.225.78 1.32-.02 2.17-1.22 2.99-2.42.95-1.39 1.345-2.735 1.365-2.805-.03-.015-2.63-1.01-2.64-3.64z" transform="translate(0, 4)"/></svg>
                        <span className="hidden sm:block">Apple</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1877F2] py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="hidden sm:block">Facebook</span>
                    </button>
                </div>

                {/* Mobile Footer Login Link */}
                <div className="mt-8 lg:hidden text-center pb-6">
                    <p className="text-sm text-gray-400">
                        Already have an account? <Link href="/login" className="text-[#FF9900] font-bold hover:underline">Login</Link>
                    </p>
                </div>

            </div>
        </div>
      </div>
      
    </div>
  );
}