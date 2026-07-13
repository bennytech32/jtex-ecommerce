'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiSearch, FiMapPin, FiShoppingCart, FiUser, FiPackage, 
  FiHeart, FiChevronDown, FiGrid, FiMic, FiCamera, 
  FiHome, FiZap, FiArrowLeft, FiShield, FiTruck, FiStar, 
  FiTarget, FiGlobe, FiUsers, FiShoppingBag, FiCheckCircle
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

export default function AboutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz');

  const cartCount = cart?.length || 0;

  useEffect(() => {
    const token = localStorage.getItem('jtex_token');
    setIsLoggedIn(!!token);

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
          setUserCountry(data.country_name);
          setCountryCode(data.country_code.toLowerCase());
        } else {
          setUserLocation('Dar es Salaam, Tanzania');
          setUserCountry('Tanzania');
          setCountryCode('tz');
        }
      })
      .catch(() => {
        setUserLocation('Dar es Salaam, Tanzania');
        setUserCountry('Tanzania');
        setCountryCode('tz');
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-12 lg:h-16 cursor-pointer object-contain" 
              onClick={() => router.push('/')} 
            />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-11 bg-white rounded-lg overflow-hidden">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">
              All <FiChevronDown/>
            </button>
            <input type="text" placeholder="Search products, brands..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <div className="flex items-center gap-3 px-3 text-gray-400">
              <FiCamera className="cursor-pointer hover:text-gray-600"/>
              <FiMic className="cursor-pointer hover:text-gray-600"/>
            </div>
            <button className="h-full px-6 bg-[#F2A900] text-black hover:bg-yellow-500 transition">
              <FiSearch size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={userCountry} className="w-5 rounded-sm"/>
              <span className="text-xs font-bold uppercase">{countryCode} <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-full transition">
              <FiUser size={18}/>
              <span className="text-xs font-bold">{isLoggedIn ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="mr-2"><FiArrowLeft size={22}/></button>
            <img src="/logo.png" alt="Jtex" className="h-8 object-contain" onClick={() => router.push('/')} />
          </div>
          <div className="flex items-center gap-3">
             <div className="relative" onClick={() => router.push('/checkout')}>
                <FiShoppingCart size={22}/>
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
             </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. ABOUT US CONTENT */}
      {/* ========================================================= */}
      <main className="w-full pb-20 lg:pb-0">
        
        {/* HERO SECTION */}
        <div className="bg-[#0A101D] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A900]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="text-[#F2A900] font-bold tracking-widest uppercase text-sm mb-4 block">About Jtex</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Transforming the Way <br/> Tanzania Shops.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              We are a premier digital marketplace dedicated to bridging the gap between top global brands and consumers, delivering quality products right to your doorstep.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          
          {/* OUR STORY SECTION */}
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square bg-gray-100 flex items-center justify-center border border-gray-200">
                {/* Place a nice abstract layout or image here */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>
                <div className="relative z-10 text-center">
                  <FiShoppingBag size={80} className="text-gray-300 mx-auto mb-4" />
                  <span className="text-2xl font-black text-gray-400">Jtex Marketplace</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Born in the bustling commercial hub of Kariakoo, Dar es Salaam, Jtex was created with a singular vision: to make high-quality, authentic products accessible to everyone across the nation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                As a tech-driven enterprise, we realized the need for a trusted platform where customers could find premium electronics, reliable home appliances, and the latest fashion without the hassle of navigating crowded markets or worrying about counterfeit goods.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-[#F2A900] pl-4">
                  <h4 className="text-3xl font-black text-gray-900 mb-1">10k+</h4>
                  <p className="text-sm font-bold text-gray-500 uppercase">Happy Customers</p>
                </div>
                <div className="border-l-4 border-[#F2A900] pl-4">
                  <h4 className="text-3xl font-black text-gray-900 mb-1">100%</h4>
                  <p className="text-sm font-bold text-gray-500 uppercase">Authentic Brands</p>
                </div>
              </div>
            </div>
          </div>

          {/* OUR VALUES / WHY CHOOSE US */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why Choose Jtex?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">We prioritize your convenience, security, and satisfaction above all else. Here is what makes us different.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-[#F2A900] text-[#0A101D] rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FiStar size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Authentic Products</h3>
              <p className="text-gray-600 leading-relaxed">We source directly from official distributors and trusted manufacturers to guarantee that every item you purchase is 100% genuine.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FiTruck size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Reliable Logistics</h3>
              <p className="text-gray-600 leading-relaxed">Acting as efficient freight brokers, we utilize a robust transit network including reliable air, bus, and truck partners to ensure your package arrives safely, anywhere in East Africa.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <FiShield size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Secure Ecosystem</h3>
              <p className="text-gray-600 leading-relaxed">Your data and money are safe. We employ enterprise-grade security for all transactions, accepting Mobile Money, Bank Transfers, and Cards.</p>
            </div>
          </div>

          {/* MISSION & VISION */}
          <div className="bg-[#0A101D] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-800 relative">
              <FiTarget className="absolute top-10 right-10 text-gray-800 opacity-20" size={100} />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-[#F2A900] rounded-full"></div>
                <h3 className="text-3xl font-black text-white">Our Mission</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed relative z-10">
                To simplify the shopping experience by providing a highly optimized, user-friendly digital platform where consumers can seamlessly discover, order, and receive quality products with complete peace of mind.
              </p>
            </div>
            <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative">
              <FiGlobe className="absolute top-10 right-10 text-gray-800 opacity-20" size={100} />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h3 className="text-3xl font-black text-white">Our Vision</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed relative z-10">
                To become the most customer-centric and technologically advanced e-commerce marketplace in Tanzania, setting the gold standard for online retail and logistics integration across East Africa.
              </p>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="mt-24 text-center">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to experience the best?</h2>
             <button onClick={() => router.push('/shop')} className="bg-[#F2A900] hover:bg-yellow-500 text-[#0A101D] font-black px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-3">
               Start Shopping Now <FiShoppingBag />
             </button>
          </div>

        </div>
      </main>

      <div className="hidden lg:block">
         <Footer />
      </div>

      {/* ========================================================= */}
      {/* 4. MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
         <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiHome size={22} className="fill-current"/>
            <span className="text-[10px] font-bold">Home</span>
         </button>
         <button onClick={() => router.push('/categories')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiGrid size={22}/>
            <span className="text-[10px] font-bold">Categories</span>
         </button>
         
         <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform" onClick={() => router.push('/deals')}>
               <FiZap size={24} className="fill-current text-[#F2A900]"/>
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-800 whitespace-nowrap">Flash Sales</span>
         </div>

         <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition relative">
            <FiShoppingCart size={22}/>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
         </button>
         <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-[#F2A900]">
            <FiUser size={22}/>
            <span className="text-[10px] font-bold">Account</span>
         </button>
      </div>

    </div>
  );
}