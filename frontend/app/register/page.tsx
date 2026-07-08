'use client';

import React, { useState } from 'react';
// TUMEONGEZA FiStar na FiGlobe HAPA JUU
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
        // Baada ya kufanikiwa kujiandikisha, mpeleke kwenye login
        window.location.href = '/login'; 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#060B19] font-sans selection:bg-[#FF9900] selection:text-black overflow-x-hidden">
      
      {/* ==========================================
          UPANDE WA KUSHOTO (DESKTOP PEKEE)
      ========================================== */}
      <div className="hidden lg:flex w-[55%] xl:w-[50%] relative flex-col justify-between p-12 overflow-hidden text-white">
        
        {/* Background Image na Fade Effect */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80&w=2000" 
                alt="Logistics Background" 
                className="w-full h-full object-cover opacity-30 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060B19]/40 via-[#060B19]/80 to-[#060B19]"></div>
        </div>

        {/* Top Navbar ya Desktop */}
        <div className="relative z-10 flex justify-between items-center">
            <div className="text-4xl font-black tracking-tighter flex items-center">
                <span className="text-[#FF9900]">X</span><span className="text-white ml-0.5">Jtex</span>
                <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded ml-1 self-start mt-1">®</span>
            </div>
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-full transition backdrop-blur-md">
                    🌐 EN <FiChevronDown />
                </button>
                <div className="text-sm font-medium text-gray-300">
                    Already have an account? <Link href="/login" className="text-[#FF9900] font-bold hover:underline ml-1">Login</Link>
                </div>
            </div>
        </div>

        {/* Maelezo Makuu (Hero Texts) */}
        <div className="relative z-10 mt-12 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] mb-4">
                Create Your <br/> Jtex Account
            </h1>
            <p className="text-lg text-gray-400 mb-12">
                Join thousands of smart customers enjoying a seamless shopping and delivery experience.
            </p>

            {/* Features (Faida 4) */}
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0"><FiShield size={24}/></div>
                    <div>
                        <h3 className="font-bold text-base text-white">Secure & Trusted</h3>
                        <p className="text-sm text-gray-400 mt-1">Your data is protected with enterprise level security.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0"><FiBox size={24}/></div>
                    <div>
                        <h3 className="font-bold text-base text-white">Fast & Reliable</h3>
                        <p className="text-sm text-gray-400 mt-1">Track orders in real-time and get fast delivery updates.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0"><FiCreditCard size={24}/></div>
                    <div>
                        <h3 className="font-bold text-base text-white">Easy Payments</h3>
                        <p className="text-sm text-gray-400 mt-1">Multiple secure payment methods for your convenience.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0"><FiAward size={24}/></div>
                    <div>
                        <h3 className="font-bold text-base text-white">Exclusive Benefits</h3>
                        <p className="text-sm text-gray-400 mt-1">Enjoy member-only deals, discounts and rewards.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Trust Badges Widget (Chini Kushoto) */}
        <div className="relative z-10 mt-auto">
            <div className="bg-[#0F172A]/80 backdrop-blur-md border border-gray-800/80 p-4 rounded-2xl inline-flex items-center gap-6 shadow-xl mb-6">
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
                    <p className="text-xs text-gray-400 font-medium">Trusted by 50,000+ customers worldwide</p>
                </div>
            </div>
            
            <div className="flex items-center gap-8 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-2"><FiShield size={14}/> SSL Encrypted</span>
                <span className="flex items-center gap-2"><FiLock size={14}/> Privacy Protected</span>
                <span className="flex items-center gap-2"><FiCheckCircle size={14}/> Trusted by 50K+ Customers</span>
            </div>
        </div>
      </div>

      {/* ==========================================
          UPANDE WA KULIA (MOBILE FULL / DESKTOP NUSU)
      ========================================== */}
      <div className="w-full lg:w-[45%] xl:w-[50%] flex items-center justify-center p-4 sm:p-8 lg:p-10 xl:p-12 z-20">
          
          <div className="w-full max-w-2xl bg-transparent lg:bg-white rounded-none lg:rounded-[2rem] p-0 lg:p-10 shadow-none lg:shadow-2xl">
              
              {/* === MOBILE ONLY NAV & HEADER === */}
              <div className="lg:hidden mb-6">
                  {/* Top Nav Mobile */}
                  <div className="flex justify-between items-center mb-8">
                      <Link href="/login" className="p-2.5 bg-[#0F172A] hover:bg-gray-800 rounded-xl transition border border-gray-800 text-white">
                          <FiChevronLeft size={20} />
                      </Link>
                      <div className="text-3xl font-black tracking-tighter flex items-center">
                          <span className="text-[#FF9900]">X</span><span className="text-white ml-0.5">Jtex</span><span className="text-[8px] bg-white/10 text-gray-300 px-1 py-0.5 rounded ml-1 self-start mt-1">®</span>
                      </div>
                      <button className="flex items-center gap-1.5 text-xs font-bold bg-[#0F172A] border border-gray-800 px-3 py-2 rounded-full text-white">
                          🌐 EN <FiChevronDown />
                      </button>
                  </div>
                  
                  {/* Titles Mobile */}
                  <div className="text-center mb-8">
                      <h1 className="text-2xl font-black text-white mb-2">Create Your Account</h1>
                      <p className="text-sm text-gray-400">Join thousands of smart customers enjoying the Jtex experience.</p>
                  </div>

                  {/* Visual Stepper Mobile */}
                  <div className="flex items-center justify-center max-w-md mx-auto mb-8">
                      <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full border-2 border-[#FF9900] flex items-center justify-center text-[#FF9900] bg-[#FF9900]/10 shadow-[0_0_15px_rgba(255,153,0,0.2)]">
                              <FiUser size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-[#FF9900] mt-2">Account</span>
                      </div>
                      <div className="w-12 h-px bg-gray-700 mx-2 -mt-5"></div>
                      <div className="flex flex-col items-center opacity-40">
                          <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400"><FiMail size={16} /></div>
                          <span className="text-[10px] text-gray-400 mt-2">Verify Email</span>
                      </div>
                      <div className="w-12 h-px bg-gray-700 mx-2 -mt-5"></div>
                      <div className="flex flex-col items-center opacity-40">
                          <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400"><FiShield size={16} /></div>
                          <span className="text-[10px] text-gray-400 mt-2">Security</span>
                      </div>
                      <div className="w-12 h-px bg-gray-700 mx-2 -mt-5"></div>
                      <div className="flex flex-col items-center opacity-40">
                          <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400"><FiCheckCircle size={16} /></div>
                          <span className="text-[10px] text-gray-400 mt-2">Complete</span>
                      </div>
                  </div>
              </div>

              {/* === DESKTOP ONLY HEADER === */}
              <div className="hidden lg:flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FiUser size={28} />
                  </div>
                  <div>
                      <h2 className="text-3xl font-black text-gray-900">Sign Up</h2>
                      <p className="text-sm text-gray-500 font-medium">Fill in your details to create your account</p>
                  </div>
              </div>

              {/* === FOMU YENYEWE === */}
              {error && (
                  <div className="bg-red-500/10 lg:bg-red-50 text-red-400 lg:text-red-600 border border-red-500/20 lg:border-red-100 p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-3">
                      <FiShield className="text-lg flex-shrink-0 mt-0.5"/> 
                      <span>{error}</span>
                  </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4 lg:space-y-5">
                  
                  {/* Majina */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">First Name</label>
                          <div className="relative">
                              <FiUser className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} 
                                  className="w-full pl-11 pr-4 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 focus:ring-1 focus:ring-[#FF9900] lg:focus:ring-blue-500 transition-all text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="Enter your first name" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
                          <div className="relative">
                              <FiUser className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} 
                                  className="w-full pl-11 pr-4 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 focus:ring-1 focus:ring-[#FF9900] lg:focus:ring-blue-500 transition-all text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="Enter your last name" />
                          </div>
                      </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                          <div className="relative">
                              <FiMail className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type="email" name="email" required value={formData.email} onChange={handleChange} 
                                  className="w-full pl-11 pr-4 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 focus:ring-1 focus:ring-[#FF9900] lg:focus:ring-blue-500 transition-all text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="Enter your email address" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                          <div className="flex bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl overflow-hidden focus-within:border-[#FF9900] lg:focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-[#FF9900] lg:focus-within:ring-blue-500 transition-all">
                              <div className="flex items-center justify-center px-3 border-r border-gray-800 lg:border-gray-200 bg-[#151F32] lg:bg-gray-50 cursor-pointer">
                                  <span className="text-lg mr-1">🇹🇿</span>
                                  <span className="text-sm font-bold text-white lg:text-gray-900">+255</span>
                                  <FiChevronDown className="ml-1 text-gray-400"/>
                              </div>
                              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} 
                                  className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="712 345 678" />
                          </div>
                      </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Password</label>
                          <div className="relative">
                              <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} 
                                  className="w-full pl-11 pr-10 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="Create a strong password" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white lg:hover:text-gray-900">
                                  {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                              </button>
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Confirm Password</label>
                          <div className="relative">
                              <FiLock className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} 
                                  className="w-full pl-11 pr-10 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-white lg:text-gray-900 placeholder-gray-500 lg:placeholder-gray-400" 
                                  placeholder="Confirm your password" />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white lg:hover:text-gray-900">
                                  {showConfirmPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Date of Birth</label>
                          <div className="relative">
                              <FiCalendar className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <input type="date" name="dob" value={formData.dob} onChange={handleChange} 
                                  className="w-full pl-11 pr-4 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-gray-400 lg:text-gray-600 appearance-none" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Gender</label>
                          <div className="relative">
                              <select name="gender" value={formData.gender} onChange={handleChange} 
                                  className="w-full pl-4 pr-10 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-gray-400 lg:text-gray-600 appearance-none">
                                  <option value="">Select your gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                              </select>
                              <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={18}/>
                          </div>
                      </div>
                  </div>

                  {/* Country & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">Country</label>
                          <div className="relative">
                              <FiGlobe className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <select name="country" value={formData.country} onChange={handleChange} 
                                  className="w-full pl-11 pr-10 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-white lg:text-gray-900 appearance-none">
                                  <option value="Tanzania">Tanzania</option>
                                  <option value="Kenya">Kenya</option>
                                  <option value="Uganda">Uganda</option>
                              </select>
                              <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={18}/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-gray-300 lg:text-gray-700 uppercase tracking-wider mb-2">City</label>
                          <div className="relative">
                              <FiMapPin className="absolute left-4 top-3.5 text-gray-500" size={18}/>
                              <select name="city" value={formData.city} onChange={handleChange} 
                                  className="w-full pl-11 pr-10 py-3.5 bg-[#0F172A] lg:bg-white border border-gray-800 lg:border-gray-200 rounded-xl outline-none focus:border-[#FF9900] lg:focus:border-blue-500 transition-all text-sm text-gray-400 lg:text-gray-600 appearance-none">
                                  <option value="">Select your city</option>
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
                              className="w-4.5 h-4.5 rounded border-gray-600 lg:border-gray-300 bg-[#0F172A] lg:bg-white text-[#FF9900] focus:ring-[#FF9900] cursor-pointer accent-[#FF9900]" />
                          <span className="text-sm text-gray-300 lg:text-gray-600">
                              I agree to the <a href="#" className="text-[#FF9900] lg:text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#FF9900] lg:text-blue-600 hover:underline">Privacy Policy</a>
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
                  <div className="h-px bg-gray-800 lg:bg-gray-200 flex-1"></div>
                  <span className="text-xs text-gray-500 font-medium">Or sign up with</span>
                  <div className="h-px bg-gray-800 lg:bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-[#0F172A] lg:bg-gray-50 hover:bg-gray-800 lg:hover:bg-gray-100 border border-gray-800 lg:border-gray-200 text-white lg:text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                      <span className="hidden sm:block">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-[#0F172A] lg:bg-gray-50 hover:bg-gray-800 lg:hover:bg-gray-100 border border-gray-800 lg:border-gray-200 text-white lg:text-gray-900 py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.405c.895-1.09 1.5-2.485 1.33-3.905-1.19.05-2.67.8-3.6 1.905-.82.985-1.53 2.4-1.34 3.8 1.33.105 2.715-.71 3.61-1.8zM17.155 13.56c-.02-2.52 2.06-3.74 2.155-3.8-.16-1.685-1.135-3.08-2.655-3.29-1.535-.21-3.005.85-3.79.85-.78 0-1.99-.835-3.265-.815-1.665.02-3.195.965-4.055 2.47-1.745 3.035-.445 7.515 1.255 9.975.835 1.205 1.815 2.545 3.1 2.5 1.24-.045 1.715-.8 3.205-.8 1.485 0 1.925.8 3.225.78 1.32-.02 2.17-1.22 2.99-2.42.95-1.39 1.345-2.735 1.365-2.805-.03-.015-2.63-1.01-2.64-3.64z" transform="translate(0, 4)"/></svg>
                      <span className="hidden sm:block">Apple</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-[#0F172A] lg:bg-gray-50 hover:bg-gray-800 lg:hover:bg-gray-100 border border-gray-800 lg:border-gray-200 text-[#1877F2] py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      <span className="hidden sm:block">Facebook</span>
                  </button>
              </div>

              {/* Security Banner (Responsive colors as per images) */}
              <div className="mt-8 bg-[#0F172A]/80 lg:bg-green-50 border border-blue-900/30 lg:border-green-100 p-4 rounded-xl flex items-center justify-center gap-3 lg:gap-2 shadow-inner">
                  <FiShield className="text-blue-500 lg:text-green-500 text-xl lg:text-base flex-shrink-0" />
                  <p className="text-white lg:text-green-800 text-[11px] lg:text-xs font-medium">
                      <span className="lg:hidden block font-bold text-sm mb-0.5">Your information is 100% secure</span>
                      <span className="lg:hidden text-gray-400">We use advanced encryption to keep your data safe.</span>
                      <span className="hidden lg:inline">Your information is 100% secure and will never be shared.</span>
                  </p>
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
  );
}