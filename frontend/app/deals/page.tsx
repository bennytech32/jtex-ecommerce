'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiSearch, FiMapPin, FiUser, FiChevronDown, 
  FiArrowLeft, FiGlobe, FiMic, FiCamera, FiHome, FiGrid, 
  FiZap, FiPackage, FiHeart, FiClock, FiTrendingUp, FiFilter, FiList
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

export default function DealsPage() {
  const router = useRouter();
  const { cart, addToCart } = useCart();

  // === STATES ===
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Timer State
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  // Mfumo wa kupata discount kulingana na ID
  const getDeterministicDiscount = (id: string) => {
    if (!id) return 15; 
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) {
      hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
    }
    // Kwenye Deals Page, tunaongeza punguzo liwe kubwa zaidi (kuanzia 15% mpaka 45%)
    return (Math.abs(hash) % 30) + 15; 
  };

  // Timer Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      return {
        h: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }

    // Fetch Location
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
        const prodRes = await fetch(`${getApiUrl()}/api/products`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          // Filter out products out of stock and randomize sort for deals
          const availableProducts = data.filter((p: any) => p.stockQuantity > 0).sort(() => 0.5 - Math.random());
          setProducts(availableProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const cartCount = cart?.length || 0;

  // Filter deals based on search
  const displayedDeals = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // === PRODUCT CARD COMPONENT ===
  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const visualDiscount = getDeterministicDiscount(product.id); 
    const oldPrice = Math.round(product.price / (1 - (visualDiscount/100)));

    if (viewMode === 'list') {
      return (
        <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 group hover:border-[#F2A900] transition cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl z-10 shadow-sm flex items-center gap-1">
             <FiTrendingUp /> HOT DEAL
          </div>
          <div className="relative w-32 h-32 bg-gray-50/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 overflow-hidden border border-gray-50">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-800 mb-1 leading-snug line-clamp-2 pr-12">{product.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                 <div className="bg-[#F2A900] h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}></div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-[#F2A900] hover:text-black font-bold text-xs flex items-center gap-2 transition"><FiShoppingCart/> Add</button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#F2A900] transition cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
           <FiTrendingUp /> HOT
        </div>
        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[11px] font-black px-2 py-0.5 rounded z-20 shadow-sm">-{visualDiscount}%</span>
            <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20"><FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""}/></button>
            {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>}
        </div>
        <div className="flex flex-col flex-grow">
            <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">{product.name}</h4>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-3 mt-auto">
                <span className="font-black text-sm lg:text-lg text-[#0A101D] leading-none">TZS {product.price.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            
            {/* Stock Progress Bar for Deals */}
            <div className="mt-1 mb-3">
               <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-1">
                  <span>Sold: {Math.floor(Math.random() * 80) + 10}%</span>
                  <span>Available</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#FF7A00] h-full rounded-full" style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}></div>
               </div>
            </div>

            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700 font-bold text-xs hover:bg-[#F2A900] hover:text-black hover:border-[#F2A900] transition">
              <FiShoppingCart size={14}/> Add To Cart
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* 1. DESKTOP HEADER */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img src="/logo.png" alt="Jtex Logo" className="h-20 lg:h-28 cursor-pointer object-contain" onClick={() => router.push('/')} />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">All <FiChevronDown/></button>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search deals, products..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <div className="flex items-center gap-3 px-3 text-gray-400">
              <FiCamera className="cursor-pointer hover:text-gray-600"/>
              <FiMic className="cursor-pointer hover:text-gray-600"/>
            </div>
            <button className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition"><FiSearch size={20} /></button>
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
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2.5 rounded-full transition">
              <FiUser size={20}/>
              <span className="text-xs font-bold">{user ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 w-1/2">
             <button onClick={() => router.back()} className="p-1"><FiArrowLeft className="text-xl text-gray-300"/></button>
             <div className="h-8 w-24 relative flex items-center">
                 <img src="/logo.png" alt="Jtex Logo" className="max-h-full max-w-full object-contain brightness-0 invert cursor-pointer" onClick={() => router.push('/')} />
             </div>
          </div>
          <div className="flex items-center gap-4 justify-end w-1/2">
             <button className="flex items-center gap-1 text-sm font-bold text-gray-300 hover:text-white transition">
                <FiGlobe size={18}/> EN <FiChevronDown size={14}/>
             </button>
             {user ? (
                <div className="w-8 h-8 bg-[#F2A900] text-black rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm" onClick={() => router.push('/profile')}>{user?.name?.charAt(0) || 'U'}</div>
             ) : (
                <FiUser className="text-xl text-gray-300" onClick={() => router.push('/login')} />
             )}
          </div>
        </div>
        <div className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search flash sales..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
          <div className="flex items-center gap-3 px-3 text-gray-400">
            <FiMic size={18} className="cursor-pointer"/>
          </div>
          <button className="h-full px-5 bg-[#F2A900] text-black"><FiSearch size={18} /></button>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto lg:px-6 lg:py-6 flex gap-6 pb-20 md:pb-6 mt-4 lg:mt-0">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm flex flex-col sticky top-28">
             <button onClick={() => router.push('/')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiHome size={18}/> Home</button>
             <button onClick={() => router.push('/categories/all')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiGrid size={18}/> Categories</button>
             <button className="flex items-center gap-3 px-6 py-2.5 bg-yellow-50 text-[#F2A900] border-r-4 border-[#F2A900] font-bold transition">
                <FiZap size={18} className="fill-current"/> Flash Deals
             </button>
             <button onClick={() => router.push('/checkout')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiShoppingCart size={18}/> Cart <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span></button>
             <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiUser size={18}/> Account</button>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
           
           {/* Flash Sales Banner */}
           <div className="px-4 lg:px-0 mb-6 lg:mb-8">
              <div className="w-full bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 lg:p-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                 
                 {/* Decorative background elements */}
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>
                 
                 <div className="relative z-10 text-center sm:text-left text-white">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                       <FiZap size={24} className="fill-current text-yellow-300"/>
                       <h2 className="text-xl font-bold text-yellow-300 tracking-widest uppercase">Flash Sales</h2>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black mb-2 leading-tight">Grab The Best <br/>Deals Today!</h1>
                    <p className="text-red-100 font-medium">Up to 45% OFF on selected premium products.</p>
                 </div>

                 <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 p-4 lg:p-6 rounded-2xl flex flex-col items-center">
                    <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2"><FiClock/> Offer Ends In</p>
                    <div className="flex gap-3">
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white text-red-600 rounded-xl flex items-center justify-center text-xl lg:text-3xl font-black shadow-inner">{timeLeft.h}</div>
                          <span className="text-[10px] text-white mt-1 font-bold">Hours</span>
                       </div>
                       <span className="text-2xl font-black text-white self-start mt-2">:</span>
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white text-red-600 rounded-xl flex items-center justify-center text-xl lg:text-3xl font-black shadow-inner">{timeLeft.m}</div>
                          <span className="text-[10px] text-white mt-1 font-bold">Mins</span>
                       </div>
                       <span className="text-2xl font-black text-white self-start mt-2">:</span>
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white text-red-600 rounded-xl flex items-center justify-center text-xl lg:text-3xl font-black shadow-inner">{timeLeft.s}</div>
                          <span className="text-[10px] text-white mt-1 font-bold">Secs</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Toolbar */}
           <div className="px-4 lg:px-0 mb-6 flex items-center justify-between">
              <div>
                 <h2 className="text-xl lg:text-2xl font-black text-gray-900">Today's Deals</h2>
                 <p className="text-xs text-gray-500 font-medium">{displayedDeals.length} deals available</p>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-orange-50 text-[#F2A900]' : 'bg-white border border-gray-200 text-gray-400 hover:text-gray-700'}`}><FiGrid size={16}/></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-orange-50 text-[#F2A900]' : 'bg-white border border-gray-200 text-gray-400 hover:text-gray-700'}`}><FiList size={16}/></button>
              </div>
           </div>

           {/* Deals Grid */}
           <div className="px-4 lg:px-0">
              {isLoading ? (
                 <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
              ) : displayedDeals.length > 0 ? (
                 <div className={`grid gap-3 sm:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {displayedDeals.map((product: any) => <ProductCard key={product.id} product={product} />)}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
                    <FiPackage size={48} className="text-gray-300 mb-4"/>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Deals Found</h3>
                    <p className="text-gray-500 text-sm">We couldn't find any deals matching your search.</p>
                 </div>
              )}
           </div>
        </div>
      </main>

      <div className="hidden md:block"><Footer /></div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[60px] px-2 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiHome size={20}/><span className="text-[9px] font-bold">Home</span></button>
        <button onClick={() => router.push('/categories/all')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiGrid size={20}/><span className="text-[9px] font-medium">Categories</span></button>
        <div className="relative -top-5 cursor-pointer">
           <div className="w-14 h-14 bg-[#0A101D] text-[#F2A900] rounded-full flex items-center justify-center shadow-lg border-4 border-white"><FiZap size={24} className="fill-current"/></div>
           <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#F2A900] whitespace-nowrap">Deals</span>
        </div>
        <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 relative">
           <FiShoppingCart size={20}/>
           {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
           <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiUser size={20}/><span className="text-[9px] font-bold">Account</span></button>
      </div>

    </div>
  );
}