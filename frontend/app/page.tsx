'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext';
import { 
  FiSearch, FiMapPin, FiShoppingCart, FiUser, FiPackage, 
  FiHeart, FiHeadphones, FiChevronDown, FiGrid, FiList, 
  FiMonitor, FiSmartphone, FiShoppingBag, FiCoffee, FiSmile,
  FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMic, FiCamera, 
  FiHome, FiZap, FiChevronRight, FiMail, FiPhone, FiFacebook, 
  FiTwitter, FiInstagram, FiLinkedin, FiSend, FiMessageCircle, 
  FiBell, FiSettings
} from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Updated State variables to handle City and Country dynamically
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz'); // Default for flag

  // Timer State for Flash Sales
  const [timeLeft, setTimeLeft] = useState({ hrs: 12, mins: 56, secs: 32 });
  
  // Slider State for Hero Banner
  const [currentSlide, setCurrentSlide] = useState(0);

  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  const getDeterministicDiscount = (id: string) => {
    if (!id) return 15; 
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) {
      hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 20) + 5; 
  };

  useEffect(() => {
    const token = localStorage.getItem('jtex_token');
    setIsLoggedIn(!!token);

    // Dynamic Location Fetching
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

    const fetchData = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);

          const uniqueCats = Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean);
          const formattedCats = uniqueCats.map((c: any) => ({
              name: c, 
              slug: c.toLowerCase().replace(/ & /g, '-')
          }));
          setDbCategories(formattedCats);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

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

    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, []);

  const slides = [
    {
      title: <>Best Quality,<br/>Best Prices,<br/><span className="text-[#F2A900]">Only on Jtex</span></>,
      subtitle: "Shop the latest gadgets, electronics, fashion and more at unbeatable prices.",
      bg: "from-[#071626] to-[#0A1B30]",
      icon: "💻"
    },
    {
      title: <>Mega Deals<br/>On Top Brands,<br/><span className="text-[#F2A900]">Save Up to 50%</span></>,
      subtitle: "Upgrade your lifestyle with our premium selection of smartphones and accessories.",
      bg: "from-[#1A0B1C] to-[#2D0F21]",
      icon: "📱"
    },
    {
      title: <>Fast & Secure<br/>Delivery to,<br/><span className="text-[#F2A900]">{userLocation.split(',')[0]}</span></>,
      subtitle: `Order today and get your items delivered right to your doorstep anywhere in ${userCountry}.`,
      bg: "from-[#051C1A] to-[#0A2D28]",
      icon: "🚚"
    },
    {
      title: <>Discover The<br/>New Fashion,<br/><span className="text-[#F2A900]">Trending Now</span></>,
      subtitle: "Step out in style with our latest clothing and footwear collections for you.",
      bg: "from-[#2A1605] to-[#3D1E08]",
      icon: "🎒"
    }
  ];

  const cartCount = cart?.length || 0;

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if(lower.includes('electronic') || lower.includes('elektroniki')) return <FiHeadphones size={20} />;
    if(lower.includes('computer') || lower.includes('laptop')) return <FiMonitor size={20} />;
    if(lower.includes('phone') || lower.includes('mobile') || lower.includes('simu')) return <FiSmartphone size={20} />;
    if(lower.includes('fashion') || lower.includes('cloth') || lower.includes('nguo')) return <FiShoppingBag size={20} />;
    if(lower.includes('home') || lower.includes('kitchen')) return <FiCoffee size={20} />;
    if(lower.includes('beaut') || lower.includes('urembo')) return <FiSmile size={20} />;
    return <FiGrid size={20} />;
  };

  const handleCategoryClick = () => {
    router.push('/categories');
  };

  const renderSidebarMenu = () => {
    if (isLoggedIn) {
      return (
        <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm mb-6 flex flex-col">
          <button className="flex items-center gap-3 px-6 py-2.5 bg-gray-50 text-gray-900 font-bold transition" onClick={() => router.push('/')}><FiHome size={18}/> Home</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/categories')}><FiGrid size={18}/> Categories</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/deals')}>
            <FiZap size={18}/> Flash Sales <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/messages')}>
            <FiMessageCircle size={18}/> Messages <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/notifications')}>
            <FiBell size={18}/> Notifications <span className="ml-auto bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">12</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/checkout')}>
            <FiShoppingCart size={18}/> Cart <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount > 0 ? cartCount : 3}</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/profile')}><FiUser size={18}/> Account</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/settings')}><FiSettings size={18}/> Settings</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/help')}><FiHeadphones size={18}/> Help & Support</button>
        </nav>
      );
    } else {
      return (
        <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm mb-6 flex flex-col">
          <button className="flex items-center gap-3 px-6 py-2.5 bg-gray-50 text-gray-900 font-bold transition" onClick={() => router.push('/')}><FiHome size={18}/> Home</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/categories')}><FiGrid size={18}/> Categories</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/deals')}>
            <FiZap size={18}/> Flash Sales <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/help')}><FiHeadphones size={18}/> Support</button>
          
          <div className="px-6 mt-4 pt-4 border-t border-gray-100">
             <button onClick={() => router.push('/login')} className="w-full bg-[#0A101D] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-sm text-xs">Sign In / Register</button>
          </div>
        </nav>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            {/* REAL LOGO IMPLEMENTATION WITH INCREASED SIZE (h-16 lg:h-24) */}
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-16 lg:h-24 cursor-pointer object-contain" 
              onClick={() => router.push('/')} 
            />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">{userLocation} <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">
              All <FiChevronDown/>
            </button>
            <input type="text" placeholder="Search products, brands..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <div className="flex items-center gap-3 px-3 text-gray-400">
              <FiCamera className="cursor-pointer hover:text-gray-600"/>
              <FiMic className="cursor-pointer hover:text-gray-600"/>
            </div>
            <button className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition">
              <FiSearch size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={userCountry} className="w-5 rounded-sm"/>
              <span className="text-xs font-bold uppercase">{countryCode} <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2.5 rounded-full transition">
              <FiUser size={20}/>
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
            <FiMapPin size={20} className="text-[#F2A900]"/>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-gray-400">Deliver to</span>
              <span className="text-sm font-bold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown size={14}/></span>
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
      {/* 3. MAIN LAYOUT */}
      {/* ========================================================= */}
      <div className="max-w-[1600px] mx-auto lg:px-6 lg:py-6 flex gap-6">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          
          {renderSidebarMenu()}

          <div className="bg-[#0A101D] text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A900]/20 rounded-full blur-3xl"></div>
            <p className="text-xs text-gray-400 font-bold mb-1">Special Offers</p>
            <h3 className="text-3xl font-black text-[#F2A900] mb-2 leading-tight">Up to 40% Off</h3>
            <p className="text-sm text-gray-300 font-medium mb-6">On selected items</p>
            <button onClick={() => router.push('/categories')} className="bg-[#F2A900] text-black text-xs font-black px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition shadow-md w-max">Shop Now <FiArrowRight/></button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 pb-10">
          
          {/* DESKTOP CATEGORIES HEADER ZIKAE ICONS */}
          <div className="hidden lg:flex items-center bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm mb-6 overflow-hidden">
            <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar">
              {dbCategories.map((cat, idx) => (
                 <button key={idx} onClick={handleCategoryClick} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-[#F2A900] border border-gray-100 hover:border-[#F2A900]/30 rounded-xl transition cursor-pointer whitespace-nowrap">
                    <span className="text-[#F2A900]">{getCategoryIcon(cat.name)}</span>
                    <span className="text-xs font-bold">{cat.name}</span>
                 </button>
              ))}
            </div>
          </div>

          {/* Mobile Categories Row */}
          <div className="lg:hidden flex overflow-x-auto hide-scrollbar gap-4 px-4 py-5 bg-white border-b border-gray-100 mb-4">
            {dbCategories.map((cat, idx) => (
              <div key={idx} onClick={handleCategoryClick} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${idx === 0 ? 'bg-yellow-50 text-[#F2A900] border border-yellow-200' : 'bg-gray-50 text-gray-600 border border-gray-100 group-hover:bg-gray-100'}`}>
                  {getCategoryIcon(cat.name)}
                </div>
                <span className={`text-[10px] font-bold ${idx === 0 ? 'text-[#F2A900]' : 'text-gray-700'} truncate w-16 text-center`}>{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Slider Hero Banner */}
          <div className="px-4 lg:px-0 mb-6 lg:mb-8">
            <div className="relative w-full max-w-[1600px] h-[300px] md:h-[400px] mx-auto rounded-3xl overflow-hidden shadow-lg">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'} bg-gradient-to-br ${slide.bg} p-6 lg:p-12 flex items-center`}
                >
                  <div className="absolute right-0 top-0 w-full h-full opacity-20 pointer-events-none">
                     <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-[#F2A900]" strokeWidth="0.5" fill="none">
                        <circle cx="90" cy="50" r="40" />
                        <circle cx="90" cy="50" r="60" />
                        <circle cx="90" cy="50" r="80" />
                     </svg>
                  </div>
                  <div className="absolute -right-10 -bottom-10 lg:right-10 lg:bottom-0 w-40 lg:w-96 opacity-30 lg:opacity-100 pointer-events-none mix-blend-screen flex items-center justify-center h-full">
                     <span className="text-[120px] lg:text-[250px]">{slide.icon}</span>
                  </div>

                  <div className="relative z-10 max-w-sm lg:max-w-xl">
                     <h1 className="text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-6 leading-tight">
                        {slide.title}
                     </h1>
                     <p className="text-gray-300 text-xs lg:text-base font-medium mb-6 lg:mb-10 leading-relaxed max-w-[280px] lg:max-w-md">
                        {slide.subtitle}
                     </p>
                     <button onClick={() => router.push('/categories')} className="bg-[#F2A900] text-black font-black px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-xl flex items-center gap-2 hover:bg-yellow-500 transition shadow-[0_0_20px_rgba(242,169,0,0.3)] text-sm lg:text-base">
                        <span className="hidden lg:inline">Shop Now</span>
                        <span className="lg:hidden">Buy Now</span> 
                        <FiArrowRight/>
                     </button>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                 {slides.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-[#F2A900]' : 'w-2 bg-white/50 hover:bg-white'}`}
                    ></button>
                 ))}
              </div>
            </div>
          </div>

          {/* Desktop Features Row & Mobile Features Row */}
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
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 flex-1 min-w-[200px] lg:border-l border-gray-200 lg:pl-6 cursor-pointer" onClick={() => router.push('/help')}>
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center border border-gray-100"><FiHeadphones size={20}/></div>
                   <div><h4 className="font-black text-xs lg:text-sm text-gray-900">24/7 Support</h4><p className="text-[10px] lg:text-xs text-gray-500">We are here to help</p></div>
                </div>
             </div>
          </div>

          {/* Flash Sales Section */}
          <div className="px-4 lg:px-0 mb-6">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-2">
                   <FiZap size={24} className="text-[#F2A900] fill-[#F2A900]"/>
                   <h2 className="text-xl lg:text-2xl font-black text-gray-900">Flash Sales</h2>
                   <span className="hidden lg:inline-block ml-4 text-xs font-bold text-gray-500">Limited time offers - Don&apos;t miss out!</span>
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
                   <button onClick={() => router.push('/categories')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">View All <FiChevronRight/></button>
                </div>
             </div>
          </div>

          {/* 5 ITEMS PER ROW NA MANENO YASIYOKATIKA */}
          <div className="px-4 lg:px-0 mb-10">
             {isLoading ? (
               <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                 {products.slice(0, 10).map((product: any) => {
                   const visualDiscount = getDeterministicDiscount(product.id); 
                   const oldPrice = Math.round(product.price / (1 - (visualDiscount/100)));

                   return (
                     <div 
                       key={product.id} 
                       onClick={() => router.push(`/product/${product.id}`)} 
                       className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#F2A900] transition cursor-pointer"
                     >
                        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
                           <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
                           <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20" onClick={(e) => { e.stopPropagation(); }}><FiHeart/></button>
                           
                           {product.imageUrl ? (
                              <img src={getImageUrl(product.imageUrl)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" />
                           ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>
                           )}
                        </div>

                        <div className="flex flex-col flex-grow">
                           {/* FIX: Title inashuka mstari vizuri bila kukatwa katikati ya neno */}
                           <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">{product.name}</h4>
                           
                           <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-2 mt-auto">
                              <span className="font-black text-sm lg:text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                              <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
                           </div>
                           <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-3">
                              <div className="flex items-center text-[#F2A900] text-[10px] font-bold">
                                 <span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium hidden sm:inline-block">({Math.floor(Math.random() * 100) + 10})</span>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black hover:border-[#F2A900] transition">
                                 <FiShoppingCart size={14}/>
                              </button>
                           </div>
                        </div>
                     </div>
                   )
                 })}
               </div>
             )}
          </div>

          {/* Top Brands Banner WITH REAL LOGOS (1.png to 6.png) */}
          <div className="px-4 lg:px-0 mb-10 lg:mb-16">
             <div className="bg-[#0A101D] rounded-2xl flex flex-col md:flex-row items-center justify-between px-6 py-6 lg:py-8 overflow-hidden gap-8 shadow-md border border-gray-800 w-full">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left z-10 w-full md:w-auto">
                   <div>
                     <h3 className="text-xl lg:text-2xl font-black text-white leading-tight">Top Brands, <span className="text-[#F2A900]">Top Quality</span></h3>
                     <p className="text-[10px] lg:text-xs text-gray-400 font-medium mt-1">Shop your favorite premium brands today.</p>
                   </div>
                   <button onClick={() => router.push('/categories')} className="bg-[#F2A900] text-black text-xs font-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-yellow-500 transition shadow-sm w-max mt-2 md:mt-0">
                      View All <FiArrowRight/>
                   </button>
                </div>
                
                {/* REAL BRAND LOGOS SECTION */}
                <div className="flex flex-1 flex-wrap md:flex-nowrap justify-center md:justify-end items-center gap-8 lg:gap-12 opacity-80 hover:opacity-100 transition duration-500">
                   {[1, 2, 3, 4, 5, 6].map((num) => (
                      <img 
                        key={num}
                        src={`/${num}.png`} 
                        alt={`Brand ${num}`} 
                        className="h-8 lg:h-12 object-contain grayscale hover:grayscale-0 brightness-200 hover:brightness-100 transition-all duration-300"
                        onError={(e) => {
                           // Kama picha haipo, itaficha icon (Fallback ya usalama)
                           (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                   ))}
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* 4. PROFESSIONAL FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-[#0A101D] text-gray-300 py-12 lg:py-16 pb-28 lg:pb-16 mt-8">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-800 pb-10 mb-10 gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-black text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-400">Get the latest updates on new products and upcoming sales.</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input type="email" placeholder="Enter your email address" className="px-4 py-3 rounded-l-xl w-full lg:w-80 text-gray-900 outline-none text-sm" />
              <button className="bg-[#F2A900] text-black px-6 py-3 rounded-r-xl font-bold flex items-center gap-2 hover:bg-yellow-500 transition text-sm">Subscribe <FiSend /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
            <div>
              {/* REAL LOGO IMPLEMENTATION WITH INCREASED SIZE (h-20 lg:h-28) */}
              <img src="/logo.png" alt="Jtex Logo" className="h-20 lg:h-28 object-contain mb-6 mx-auto lg:mx-0" />
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Your one-stop destination for the best quality electronics, fashion, and home appliances in {userCountry}. Shop smart, live better.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiFacebook size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiTwitter size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiInstagram size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiLinkedin size={18}/></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => router.push('/about')} className="hover:text-[#F2A900] transition">About Us</button></li>
                <li><button onClick={() => router.push('/categories')} className="hover:text-[#F2A900] transition">Shop Categories</button></li>
                <li><button onClick={() => router.push('/')} className="hover:text-[#F2A900] transition">Flash Sales</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Contact Us</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Customer Service</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => router.push('/profile')} className="hover:text-[#F2A900] transition">My Account</button></li>
                <li><button onClick={() => router.push('/profile')} className="hover:text-[#F2A900] transition">Order Tracking</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Returns & Exchanges</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Shipping Information</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">FAQs</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-start gap-3"><FiMapPin className="text-[#F2A900] text-lg flex-shrink-0 mt-0.5" /><span>Dar es Salaam, Kariakoo</span></li>
                <li className="flex items-center gap-3"><FiPhone className="text-[#F2A900] text-lg flex-shrink-0" /><span>WhatsApp: +255 767 949 581</span></li>
                <li className="flex items-center gap-3"><FiMail className="text-[#F2A900] text-lg flex-shrink-0" /><span>support@jtex.co.tz</span></li>
              </ul>
              <div className="mt-6">
                 <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">We Accept</p>
                 <div className="flex gap-2">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-black text-blue-800">VISA</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-black text-red-600">MASTER</div>
                    <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-[8px] font-black text-white">M-PESA</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
            <p>&copy; {new Date().getFullYear()} Jtex Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 5. MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
         <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-[#F2A900]">
            <FiHome size={22} className="fill-current"/>
            <span className="text-[10px] font-black">Home</span>
         </button>
         <button onClick={() => router.push('/categories')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiGrid size={22}/>
            <span className="text-[10px] font-bold">Categories</span>
         </button>
         
         <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform" onClick={() => router.push('/categories')}>
               <FiZap size={24} className="fill-current text-[#F2A900]"/>
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-800 whitespace-nowrap">Flash Sales</span>
         </div>

         <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition relative">
            <FiShoppingCart size={22}/>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
         </button>
         <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiUser size={22}/>
            <span className="text-[10px] font-bold">Account</span>
         </button>
      </div>

    </div>
  );
}