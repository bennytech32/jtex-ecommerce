'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext';
import { 
  FiSearch, FiMapPin, FiShoppingCart, FiUser, FiPackage, 
  FiHeart, FiHeadphones, FiChevronDown, FiGrid, FiList, 
  FiMonitor, FiSmartphone, FiShoppingBag, FiCoffee, FiSmile,
  FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMic, FiCamera, FiHome, FiZap
} from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Timer State for Flash Sales
  const [timeLeft, setTimeLeft] = useState({ hrs: 12, mins: 56, secs: 32 });

  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  useEffect(() => {
    // Fetch Real Products
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    // Flash Sale Countdown Logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hrs, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hrs > 0) hrs--;
          }
        }
        return { hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Extract unique categories from real products, or use defaults if empty
  const defaultCategories = [
    { name: 'Electronics', icon: <FiHeadphones size={24} /> },
    { name: 'Computers', icon: <FiMonitor size={24} /> },
    { name: 'Phones', icon: <FiSmartphone size={24} /> },
    { name: 'Fashion', icon: <FiShoppingBag size={24} /> },
    { name: 'Home & Kitchen', icon: <FiCoffee size={24} /> },
    { name: 'More', icon: <FiGrid size={24} /> }
  ];

  const cartCount = cart?.length || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 lg:pb-0 font-sans text-gray-900">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER[cite: 7] */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <div className="cursor-pointer flex text-3xl font-black italic tracking-tighter" onClick={() => router.push('/')}>
              <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">Tanzania, United Republic <FiChevronDown/></span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src="https://flagcdn.com/w20/tz.png" alt="TZ" className="w-5 rounded-sm"/>
              <span className="text-xs font-bold">TZ <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push('/profile')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push('/profile')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-full transition">
              <FiUser size={18}/>
              <span className="text-xs font-bold">My Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER[cite: 8] */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiMapPin size={20} className="text-[#F2A900]"/>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-gray-400">Deliver to</span>
              <span className="text-sm font-bold flex items-center gap-1">Tanzania <FiChevronDown size={14}/></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative" onClick={() => router.push('/checkout')}>
                <FiShoppingCart size={22}/>
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
             </div>
          </div>
        </div>
        <div className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm">
          <input type="text" placeholder="Search Jtex" className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
          <div className="flex items-center gap-3 px-3 text-gray-400">
            <FiMic size={18} className="cursor-pointer"/>
            <FiCamera size={18} className="cursor-pointer"/>
          </div>
          <button className="h-full px-5 bg-[#F2A900] text-black">
            <FiSearch size={18} />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN LAYOUT (DESKTOP: SIDEBAR + CONTENT | MOBILE: FULL) */}
      {/* ========================================================= */}
      <div className="max-w-[1500px] mx-auto lg:px-6 lg:py-6 flex gap-6">
        
        {/* DESKTOP SIDEBAR[cite: 7] */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm mb-6 flex flex-col gap-1">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-900 font-bold transition"><FiHome size={18}/> Home</button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium"><FiGrid size={18}/> Categories</button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium"><FiZap size={18}/> Deals <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span></button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium" onClick={() => router.push('/profile')}><FiPackage size={18}/> Orders</button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium"><FiHeart size={18}/> Wishlist</button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium"><FiHeadphones size={18}/> Support</button>
          </nav>

          <div className="bg-[#0A101D] text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A900]/20 rounded-full blur-3xl"></div>
            <p className="text-xs text-gray-400 font-bold mb-1">Special Offer</p>
            <h3 className="text-3xl font-black text-[#F2A900] mb-2 leading-tight">Up to 40% Off</h3>
            <p className="text-sm text-gray-300 font-medium mb-6">On selected items</p>
            <button className="bg-white text-black text-xs font-black px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition shadow-md w-max">Shop Now <FiArrowRight/></button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          
          {/* Desktop Categories Header[cite: 7] */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-6 py-4 shadow-sm mb-6">
            <div className="flex items-center gap-8">
              {['Electronics', 'Computers', 'Phones', 'Fashion', 'Home & Kitchen', 'Beauty'].map(cat => (
                 <span key={cat} className="text-sm font-bold text-gray-600 hover:text-black cursor-pointer transition">{cat}</span>
              ))}
            </div>
          </div>

          {/* Mobile Categories Row[cite: 8] */}
          <div className="lg:hidden flex overflow-x-auto hide-scrollbar gap-4 px-4 py-5 bg-white border-b border-gray-100">
            {defaultCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${idx === 0 ? 'bg-yellow-50 text-[#F2A900] border border-yellow-200' : 'bg-gray-50 text-gray-600 border border-gray-100 group-hover:bg-gray-100'}`}>
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-bold ${idx === 0 ? 'text-[#F2A900]' : 'text-gray-700'}`}>{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Mobile Pre-Hero Feature Cards[cite: 8] */}
          <div className="lg:hidden flex gap-3 px-4 py-4">
             <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-yellow-50 text-[#F2A900] rounded-lg flex items-center justify-center"><FiTruck size={20}/></div>
                <div><p className="text-[10px] font-black text-gray-900 leading-tight">FREE shipping</p><p className="text-[9px] text-gray-500">on your first order</p></div>
             </div>
             <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-yellow-50 text-[#F2A900] rounded-lg flex items-center justify-center"><FiShield size={20}/></div>
                <div><p className="text-[10px] font-black text-gray-900 leading-tight">Money-back protection</p><p className="text-[9px] text-gray-500">for up to 60 days</p></div>
             </div>
          </div>

          {/* Hero Banner */}
          <div className="px-4 lg:px-0 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-[#071626] to-[#0A1B30] rounded-3xl p-6 lg:p-12 relative overflow-hidden shadow-lg min-h-[220px] lg:min-h-[380px] flex items-center">
              {/* Graphic Elements */}
              <div className="absolute right-0 top-0 w-full h-full opacity-20 pointer-events-none">
                 <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-[#F2A900]" strokeWidth="0.5" fill="none">
                    <circle cx="90" cy="50" r="40" />
                    <circle cx="90" cy="50" r="60" />
                    <circle cx="90" cy="50" r="80" />
                 </svg>
              </div>
              <div className="absolute -right-10 -bottom-10 lg:right-10 lg:bottom-0 w-40 lg:w-96 opacity-30 lg:opacity-100 pointer-events-none mix-blend-screen">
                 {/* Fake Laptop/Phone presentation image representation */}
                 <span className="text-[150px] lg:text-[300px]">💻</span>
              </div>

              <div className="relative z-10 max-w-sm lg:max-w-xl">
                 <h1 className="text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-6 leading-tight">
                    Best Quality,<br/>Best Prices,<br/><span className="text-[#F2A900]">Only on Jtex</span>
                 </h1>
                 <p className="text-gray-300 text-xs lg:text-base font-medium mb-6 lg:mb-10 leading-relaxed max-w-[280px] lg:max-w-md">
                    Shop the latest gadgets, electronics, fashion and more at unbeatable prices.
                 </p>
                 <button className="bg-[#F2A900] text-black font-black px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-xl flex items-center gap-2 hover:bg-yellow-500 transition shadow-[0_0_20px_rgba(242,169,0,0.3)] text-sm lg:text-base">
                    {/* Responsive text matching mockups */}
                    <span className="hidden lg:inline">Shop Now</span>
                    <span className="lg:hidden">Buy Now</span> 
                    <FiArrowRight/>
                 </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                 <div className="w-6 h-2 bg-[#F2A900] rounded-full"></div>
                 <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                 <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                 <div className="w-2 h-2 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Desktop Features Row[cite: 7] & Mobile Features Row[cite: 8] */}
          <div className="px-4 lg:px-0 mb-8 lg:mb-10">
             <div className="flex overflow-x-auto hide-scrollbar gap-4 lg:gap-6 bg-white lg:bg-transparent lg:border-t lg:border-b lg:border-gray-200 lg:py-6 rounded-2xl lg:rounded-none p-4 lg:p-0 shadow-sm lg:shadow-none border border-gray-100 lg:border-none">
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px]">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center border border-gray-100"><FiTruck size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">FREE Delivery</h4><p className="text-[10px] lg:text-xs text-gray-500">on orders over TZS 50,000</p></div>
                </div>
                <div className="hidden lg:flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px] border-l border-gray-200 pl-6">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-50 text-[#F2A900] rounded-full flex items-center justify-center border border-yellow-100"><FiShield size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">Money-back Guarantee</h4><p className="text-[10px] lg:text-xs text-gray-500">for up to 60 days</p></div>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px] lg:border-l border-gray-200 lg:pl-6">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center border border-gray-100"><FiShield size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">Secure Payment</h4><p className="text-[10px] lg:text-xs text-gray-500">100% secure payments</p></div>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px] lg:border-l border-gray-200 lg:pl-6">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center border border-gray-100"><FiRefreshCw size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">Easy Returns</h4><p className="text-[10px] lg:text-xs text-gray-500">7 days return policy</p></div>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px] lg:border-l border-gray-200 lg:pl-6">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center border border-gray-100"><FiHeadphones size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">24/7 Support</h4><p className="text-[10px] lg:text-xs text-gray-500">We are here to help</p></div>
                </div>
             </div>
          </div>

          {/* Flash Sales Section */}
          <div className="px-4 lg:px-0 mb-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                   <FiZap size={24} className="text-[#F2A900] fill-[#F2A900]"/>
                   <h2 className="text-xl lg:text-2xl font-black text-gray-900">Flash Sales</h2>
                   <span className="hidden lg:inline-block ml-4 text-xs font-bold text-gray-500">Limited time offers - Don't miss out!</span>
                </div>
                
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Ends in:</span>
                      <div className="flex items-center gap-1.5">
                         <div className="flex flex-col items-center"><div className="bg-[#0A101D] text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-md">{String(timeLeft.hrs).padStart(2, '0')}</div><span className="text-[8px] font-bold text-gray-500 mt-0.5 uppercase">Hrs</span></div>
                         <span className="text-xl font-bold text-gray-800 pb-3">:</span>
                         <div className="flex flex-col items-center"><div className="bg-[#0A101D] text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-md">{String(timeLeft.mins).padStart(2, '0')}</div><span className="text-[8px] font-bold text-gray-500 mt-0.5 uppercase">Mins</span></div>
                         <span className="text-xl font-bold text-gray-800 pb-3">:</span>
                         <div className="flex flex-col items-center"><div className="bg-[#0A101D] text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-md">{String(timeLeft.secs).padStart(2, '0')}</div><span className="text-[8px] font-bold text-gray-500 mt-0.5 uppercase">Secs</span></div>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">View All <FiChevronRight/></button>
                </div>
             </div>

             {/* Real Products Grid/Scroll */}
             {isLoading ? (
               <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
             ) : (
               <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
                  {products.slice(0, 6).map((product: any) => {
                    // Logic ndogo ya kutengeneza punguzo (Discount) kuendana na UI
                    const visualDiscount = Math.floor(Math.random() * 20) + 5; 
                    const oldPrice = Math.round(product.price * (1 + (visualDiscount/100)));

                    return (
                      <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col flex-shrink-0 w-[160px] lg:w-[220px] group hover:border-[#F2A900] transition cursor-pointer">
                         <div className="relative w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-4 p-2">
                            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-{visualDiscount}%</span>
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden"><FiHeart/></button>
                            
                            {product.imageUrl ? (
                               <img src={getImageUrl(product.imageUrl)} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                               <span className="text-5xl">📦</span>
                            )}
                         </div>
                         <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-1 line-clamp-2 leading-tight">{product.name}</h4>
                         <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 mb-2 mt-auto">
                            <span className="font-black text-sm lg:text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center text-[#F2A900] text-[10px] font-bold">
                               <span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium">({Math.floor(Math.random() * 100) + 10})</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black hover:border-[#F2A900] transition">
                               <FiShoppingCart size={14}/>
                            </button>
                         </div>
                      </div>
                    )
                  })}
               </div>
             )}
          </div>

          {/* Top Brands Banner[cite: 7, 8] */}
          <div className="px-4 lg:px-0 mb-6">
             <div className="bg-[#0A101D] rounded-2xl flex flex-col lg:flex-row items-center justify-between p-6 lg:p-8 gap-6 shadow-md">
                <div className="text-center lg:text-left">
                   <h3 className="text-xl font-black text-white mb-1">Top Brands, Top Quality</h3>
                   <p className="text-sm text-gray-400 font-medium lg:mb-0 mb-4">Shop your favorite brands</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10 opacity-70 grayscale hover:grayscale-0 transition duration-500">
                   {/* Fake Brands using emojis/text for display matching the mockup visually */}
                   <span className="text-white font-black text-2xl tracking-tighter">MI</span>
                   <span className="text-white font-black text-2xl tracking-widest uppercase">Samsung</span>
                   <span className="text-white font-black text-2xl">🍎</span>
                   <span className="text-white font-black text-2xl italic">hp</span>
                   <span className="text-white font-black text-2xl tracking-widest">SONY</span>
                   <span className="text-white font-black text-2xl">Lenovo</span>
                </div>
                <button className="hidden lg:flex bg-[#F2A900] text-black text-xs font-black px-6 py-2.5 rounded-lg items-center gap-2 hover:bg-yellow-500 transition shadow-md">
                   View All Brands <FiArrowRight/>
                </button>
             </div>
          </div>

        </main>
      </div>

      {/* ========================================================= */}
      {/* 4. MOBILE BOTTOM NAVIGATION[cite: 8] */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
         <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-[#F2A900]">
            <FiHome size={22} className="fill-current"/>
            <span className="text-[10px] font-black">Home</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiGrid size={22}/>
            <span className="text-[10px] font-bold">Categories</span>
         </button>
         
         {/* Floating Center Button for Flash Sales */}
         <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform">
               <FiZap size={24} className="fill-current text-[#F2A900]"/>
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-800 whitespace-nowrap">Flash Sales</span>
         </div>

         <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition relative">
            <FiShoppingCart size={22}/>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
         </button>
         <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiUser size={22}/>
            <span className="text-[10px] font-bold">My Jtex</span>
         </button>
      </div>

    </div>
  );
}