'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiSearch, FiMapPin, FiShoppingCart, FiUser, FiPackage, 
  FiHeart, FiHeadphones, FiChevronDown, FiGrid, FiList, 
  FiMonitor, FiSmartphone, FiShoppingBag, FiCoffee, FiSmile,
  FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMic, FiCamera, 
  FiHome, FiZap, FiChevronRight, FiMail, FiPhone, FiFacebook, 
  FiTwitter, FiInstagram, FiLinkedin, FiSend, FiMessageCircle, 
  FiBell, FiSettings, FiArrowLeft, FiGlobe, FiMoreHorizontal, FiTag, FiStar
} from 'react-icons/fi';

const translations = {
  en: {
    shop: "All Products",
    search: "Search products, categories or brands...",
    filter: "Filters",
    all: "All Categories",
    loading: "Loading store...",
    noProducts: "No products match your search.",
    sort: "Sort by:",
    popular: "Popular",
    lowToHigh: "Low to High",
    highToLow: "High to Low",
    clearAll: "Clear All",
    priceRange: "Price Range",
    itemsFound: "items found",
    topPicks: "Top Picks"
  },
  sw: {
    shop: "Bidhaa Zote",
    search: "Tafuta bidhaa, kategoria au chapa...",
    filter: "Chujio",
    all: "Kategoria Zote",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa inayofanana na utafutaji wako.",
    sort: "Panga kwa:",
    popular: "Maarufu",
    lowToHigh: "Kuanzia Chini",
    highToLow: "Kuanzia Juu",
    clearAll: "Futa Zote",
    priceRange: "Kiwango cha Bei",
    itemsFound: "zimepatikana",
    topPicks: "Chaguo Bora"
  }
};

export default function ShopPage() {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // States mpya kwa ajili ya Real Filters
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz'); 

  const t = translations[lang];

  // Filter bidhaa kwa ajili ya Live Search Dropdown
  const filteredSuggestions = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${getApiUrl().replace(/\/$/, '')}${url}`;
  };

  // Helper Mpya Inayohakikisha picha inatoka vizuri kama Array JSON au String ya kawaida
  const getDisplayImage = (imgData: string) => {
    if (!imgData) return '';
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgData;
    } catch(e) {
      return imgData; 
    }
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

    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }

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

    const fetchRealProducts = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract real Brands
        const uniqueBrands = Array.from(new Set(data.map((p: any) => p.brand))).filter(Boolean);
        setAvailableBrands(['All', ...uniqueBrands] as string[]);
        
        const uniqueCats = Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean);
        const formattedCats = uniqueCats.map((c: any) => ({
            name: c, 
            slug: c.toLowerCase().replace(/ & /g, '-')
        }));
        setDbCategories(formattedCats);

      } catch (error) {
        console.error("Kosa kuvuta bidhaa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealProducts();

    const handleCategorySelect = (e: any) => {
        if(e.detail && e.detail.category) {
            setActiveCategory(e.detail.category);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    window.addEventListener('selectCategory', handleCategorySelect);
    return () => window.removeEventListener('selectCategory', handleCategorySelect);
  }, []);

  // REAL FILTERS EFFECT
  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => {
        const pCat = p.category ? p.category.toLowerCase() : '';
        const tCat = activeCategory.toLowerCase();
        return pCat.includes(tCat) || tCat.includes(pCat);
      });
    }
    
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    result = result.filter(p => p.price <= maxPrice);
    if (selectedBrand !== 'All') result = result.filter(p => p.brand === selectedBrand);
    
    // Condition Filter Logic
    if (selectedCondition !== 'All') {
      result = result.filter(p => {
          const cond = p.condition || 'Brand New';
          return cond.toLowerCase().includes(selectedCondition.toLowerCase());
      });
    }
    
    if (sortOrder === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortOrder === 'newest') result = [...result].reverse(); // Simple newest logic
    
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, maxPrice, selectedBrand, selectedCondition, sortOrder, products]);

  const resetFilters = () => {
    setMaxPrice(10000000);
    setSelectedBrand('All');
    setSelectedCondition('All');
    setSortOrder('popular');
    setSearchQuery('');
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
    // Hii hapa inaruhusu kufilter bidhaa hapo hapo kwenye Shop ukibonyeza enter.
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'sw' : 'en');

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

  const renderSidebarMenu = () => {
    return (
      <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm mb-6 flex flex-col">
        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/')}><FiHome size={18}/> Home</button>
        <button className="flex items-center gap-3 px-6 py-2.5 bg-gray-50 text-gray-900 font-bold transition" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}><FiGrid size={18}/> All Products</button>
        
        <div className="border-t border-gray-100 my-2"></div>
        
        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/deals')}>
          <FiZap size={18}/> Flash Sales <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/new-arrivals')}>
          <FiPackage size={18}/> New Arrivals <span className="ml-auto bg-green-100 text-green-600 text-[10px] font-black px-1.5 py-0.5 rounded">New</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/trending')}>
          <FiStar size={18}/> Trending Now
        </button>

        <div className="border-t border-gray-100 my-2"></div>

        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/checkout')}>
          <FiShoppingCart size={18}/> Cart 
          {cartCount > 0 && <span className="ml-auto bg-[#F2A900] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
        </button>
        
        <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/help')}><FiHeadphones size={18}/> Support</button>
        
        <div className="px-6 mt-4 pt-4 border-t border-gray-100">
           <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="w-full bg-[#0A101D] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-sm text-xs">
             {isLoggedIn ? 'My Account' : 'Sign In / Register'}
           </button>
        </div>
      </nav>
    );
  };

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const visualDiscount = getDeterministicDiscount(product.id); 
    const oldPrice = Math.round(product.price / (1 - (visualDiscount/100)));
    const displayImage = getDisplayImage(product.imageUrl);

    if (viewMode === 'list') {
      return (
        <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 group hover:border-[#F2A900] transition cursor-pointer">
          <div className="relative w-32 h-32 bg-gray-50/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 overflow-hidden border border-gray-50">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            {displayImage ? <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-800 mb-1 leading-snug line-clamp-2">{product.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-[#F2A900] text-[10px] font-bold"><span className="tracking-tighter">★★★★★</span></div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-[#F2A900] hover:text-black font-bold text-xs flex items-center gap-2 transition"><FiShoppingCart/> Add</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#F2A900] transition cursor-pointer">
        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20"><FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""}/></button>
            {displayImage ? <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>}
        </div>
        <div className="flex flex-col flex-grow">
            <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">{product.name}</h4>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-2 mt-auto">
                <span className="font-black text-sm lg:text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-3">
                <div className="flex items-center text-[#F2A900] text-[10px] font-bold"><span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium hidden sm:inline-block">({Math.floor(Math.random() * 100) + 10})</span></div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black transition">
                  <FiShoppingCart size={14}/>
                </button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Jtex Logo" 
              className="h-16 lg:h-20 cursor-pointer object-contain" 
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

          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
              <button type="button" className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">
                All <FiChevronDown/>
              </button>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setShowDesktopSuggestions(true); }}
                onFocus={() => setShowDesktopSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDesktopSuggestions(false), 200)}
                placeholder={t.search} 
                className="flex-1 h-full px-4 text-base text-gray-900 outline-none" // IOS Zoom Fix: text-base
              />
              <div className="flex items-center gap-3 px-3 text-gray-400">
                <FiCamera className="cursor-pointer hover:text-gray-600"/>
                <FiMic className="cursor-pointer hover:text-gray-600"/>
              </div>
              <button type="submit" className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition">
                <FiSearch size={20} />
              </button>
            </form>

            {/* LIVE SEARCH SUGGESTIONS DROPDOWN (DESKTOP) */}
            {showDesktopSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                {filteredSuggestions.length > 0 ? (
                  <ul className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                    {filteredSuggestions.map((prod) => (
                      <li 
                        key={prod.id} 
                        onClick={() => router.push(`/product/${prod.id}`)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0 transition"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                          {getDisplayImage(prod.imageUrl) ? (
                            <img src={getImageUrl(getDisplayImage(prod.imageUrl))} className="w-full h-full object-contain mix-blend-multiply" alt=""/>
                          ) : <FiPackage className="text-gray-400"/>}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-bold text-gray-800 truncate">{prod.name}</span>
                          <span className="text-xs font-black text-[#F2A900]">TZS {prod.price.toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-sm font-medium text-gray-500">
                    {t.noProducts}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={toggleLanguage} className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={userCountry} className="w-5 rounded-sm"/>
              <span className="text-xs font-bold uppercase">{lang === 'en' ? 'EN' : 'SW'} <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push(isLoggedIn ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2.5 rounded-full transition">
              <FiUser size={20}/>
              <span className="text-xs font-bold">{isLoggedIn ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER W/ SUGGESTIONS */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white pt-4 pb-3 sticky top-0 z-50 shadow-md">
        <div className="px-4 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <button onClick={() => router.back()} className="p-1 hover:bg-gray-800 rounded-full transition"><FiArrowLeft className="text-xl text-gray-300"/></button>
             <img src="/logo.png" alt="Jtex Logo" className="h-8 object-contain brightness-0 invert cursor-pointer" onClick={() => router.push('/')} />
          </div>
          
          <div className="flex items-center gap-5">
             <button onClick={toggleLanguage} className="flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white transition">
                <FiGlobe size={16}/> {lang.toUpperCase()}
             </button>

             <div className="relative cursor-pointer" onClick={() => router.push('/checkout')}>
                 <FiShoppingCart size={22} className="text-gray-300 hover:text-white transition"/>
                 {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">{cartCount}</span>}
             </div>
          </div>
        </div>
        
        {/* MOBILE SEARCH BAR */}
        <div className="px-4 relative">
          <form onSubmit={handleSearch} className="flex items-center h-12 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <input 
               type="text" 
               value={searchQuery} 
               onChange={(e) => { setSearchQuery(e.target.value); setShowMobileSuggestions(true); }}
               onFocus={() => setShowMobileSuggestions(true)}
               onBlur={() => setTimeout(() => setShowMobileSuggestions(false), 200)}
               placeholder="Search products..." 
               className="flex-1 h-full px-4 text-base text-gray-900 outline-none bg-transparent placeholder-gray-400" // IOS Zoom Fix: text-base
            />
            <div className="flex items-center gap-3 px-2 text-gray-400 bg-white">
              <FiMic size={18} className="cursor-pointer hover:text-[#F2A900] transition"/>
              <FiCamera size={18} className="cursor-pointer hover:text-[#F2A900] transition"/>
            </div>
            <button type="submit" className="h-full px-5 bg-[#F2A900] text-black hover:bg-yellow-500 transition border-l border-[#F2A900]/20">
              <FiSearch size={20} />
            </button>
          </form>

          {/* LIVE SEARCH SUGGESTIONS DROPDOWN (MOBILE) */}
          {showMobileSuggestions && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 left-4 right-4 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
              {filteredSuggestions.length > 0 ? (
                <ul className="max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {filteredSuggestions.map((prod) => (
                    <li 
                      key={prod.id} 
                      onClick={() => router.push(`/product/${prod.id}`)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                        {getDisplayImage(prod.imageUrl) ? (
                          <img src={getImageUrl(getDisplayImage(prod.imageUrl))} className="w-full h-full object-contain mix-blend-multiply" alt=""/>
                        ) : <FiPackage className="text-gray-400"/>}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-800 truncate">{prod.name}</span>
                        <span className="text-[10px] font-black text-[#F2A900]">TZS {prod.price.toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-xs font-medium text-gray-500">
                  {t.noProducts}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN LAYOUT */}
      {/* ========================================================= */}
      <div className="max-w-[1600px] mx-auto lg:px-6 lg:py-6 flex gap-6">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          
          {renderSidebarMenu()}

          {/* REAL FILTERS BOX */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 sticky top-28">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-gray-900">{t.filter}</h3>
                <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">{t.clearAll}</button>
             </div>
             
             <div className="space-y-6">
                {/* PRICE FILTER */}
                <div>
                   <h4 className="text-sm font-bold text-gray-800 mb-2">Max Price</h4>
                   <p className="text-xs text-[#F2A900] font-black mb-2">TZS {maxPrice.toLocaleString()}</p>
                   <input 
                     type="range" min="10000" max="10000000" step="50000"
                     value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                     className="w-full accent-[#F2A900] cursor-pointer"
                   />
                </div>

                {/* BRAND FILTER */}
                {availableBrands.length > 1 && (
                  <div>
                     <h4 className="text-sm font-bold text-gray-800 mb-2">Brand</h4>
                     <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#F2A900] cursor-pointer">
                        {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                  </div>
                )}

                {/* CONDITION FILTER (REAL KABISA) */}
                <div>
                   <h4 className="text-sm font-bold text-gray-800 mb-2">Condition</h4>
                   <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#F2A900] cursor-pointer">
                      <option value="All">All Conditions</option>
                      <option value="New">Brand New</option>
                      <option value="Used">Used</option>
                   </select>
                </div>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 pb-6 relative mt-4 lg:mt-0">
          
          {/* CATEGORIES HEADER ICONS */}
          <div className="flex items-center bg-white lg:rounded-2xl lg:border border-b border-gray-100 px-4 py-4 lg:shadow-sm mb-4 lg:mb-6 overflow-hidden">
            <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar">
              <button onClick={() => setActiveCategory('All')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${activeCategory === 'All' ? 'bg-yellow-50 text-[#F2A900] border border-yellow-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100'}`}>
                 <FiGrid size={16}/>
                 <span className="text-xs font-bold">{t.all}</span>
              </button>
              {dbCategories.map((cat, idx) => (
                 <button key={idx} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${activeCategory === cat.name ? 'bg-yellow-50 text-[#F2A900] border border-yellow-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100'}`}>
                    <span className={activeCategory === cat.name ? "text-[#F2A900]" : "text-gray-500"}>{getCategoryIcon(cat.name)}</span>
                    <span className="text-xs font-bold">{cat.name}</span>
                 </button>
              ))}
            </div>
          </div>

          {/* SHOP TOOLBAR (Desktop & Mobile) */}
          <div className="px-4 lg:px-0 mb-4 md:mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
             <div>
                <h1 className="font-black text-xl lg:text-2xl text-gray-900 mb-1">{activeCategory === 'All' ? t.shop : activeCategory}</h1>
                <p className="text-xs text-gray-500 font-medium">{filteredProducts.length} {t.itemsFound}</p>
             </div>
             
             <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                   <span className="text-xs text-gray-500 font-bold">{t.sort}</span>
                   <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="text-xs font-bold text-gray-900 outline-none bg-transparent cursor-pointer">
                      <option value="popular">{t.popular}</option>
                      <option value="newest">Newest</option>
                      <option value="low">{t.lowToHigh}</option>
                      <option value="high">{t.highToLow}</option>
                   </select>
                </div>
                <div className="hidden lg:flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-orange-50 text-[#F2A900]' : 'text-gray-400 hover:text-gray-700'}`}><FiGrid size={16}/></button>
                   <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-orange-50 text-[#F2A900]' : 'text-gray-400 hover:text-gray-700'}`}><FiList size={16}/></button>
                </div>
             </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="px-4 lg:px-0 mb-10">
             {isLoading ? (
               <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
             ) : filteredProducts.length === 0 ? (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
                  <FiSearch className="text-5xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t.noProducts}</h3>
                  <button onClick={resetFilters} className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition text-sm">Clear Search & Filters</button>
               </div>
             ) : (
               <div className={`grid gap-3 sm:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
                 {filteredProducts.map((product: any) => <ProductCard key={product.id} product={product} />)}
               </div>
             )}
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* PROFESSIONAL FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-[#0A101D] text-gray-300 py-12 lg:py-16 pb-28 lg:pb-16 mt-8">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-800 pb-10 mb-10 gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-black text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-400">Get the latest updates on new products and upcoming sales.</p>
            </div>
            <div className="flex w-full lg:w-auto">
              {/* IOS Zoom Fix: text-base kwenye email input */}
              <input type="email" placeholder="Enter your email address" className="px-4 py-3 rounded-l-xl w-full lg:w-80 text-gray-900 outline-none text-base" />
              <button className="bg-[#F2A900] text-black px-6 py-3 rounded-r-xl font-bold flex items-center gap-2 hover:bg-yellow-500 transition text-sm">Subscribe <FiSend /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
            <div>
              <img src="/logo.png" alt="Jtex Logo" className="h-24 lg:h-32 object-contain mb-6 mx-auto lg:mx-0" />
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
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
            <p>&copy; {new Date().getFullYear()} Jtex Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}