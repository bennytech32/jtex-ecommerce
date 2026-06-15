'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, 
  FiLock, FiUser, FiPhone, FiMail, FiTrash2, FiChevronRight, FiSearch, FiHeart, 
  FiBox, FiAlertCircle, FiCreditCard, FiSmartphone, FiGrid, FiArrowRight, FiArrowLeft,
  FiCpu, FiMic, FiMaximize, FiCamera, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiMenu
} from 'react-icons/fi';

import Footer from './components/common/Footer';

const translations = {
  en: {
    searchPlaceholder: "Search Jtex",
    deliverTo: "Deliver to Tanzania, United Republic...",
    freeShipping: "FREE shipping",
    firstOrder: "on your first order",
    moneyBack: "Money-back protection",
    upTo60Days: "for up to 60 days",
    bannerTitle: "Best Quality, Best Prices, Only on Jtex",
    bannerSub: "Shop the latest gadgets, electronics, fashion and more at unbeatable prices.",
    shopNow: "Shop Now",
    flashSales: "Flash Sales",
    limitedOffers: "Limited time offers - Don't miss out!",
    endsIn: "Ends in:",
    viewAll: "View All >",
    topBrandsTitle: "Top Brands, Top Quality",
    topBrandsSub: "Shop your favorite brands",
    viewAllBrands: "View All Brands",
    bigDealsTitle: "Big Deals on Top Brands",
    bigDealsSub: "Up to 40% Off",
    catElectronics: "Electronics",
    catComputers: "Computers",
    catPhones: "Phones",
    catFashion: "Fashion",
    catHome: "Home & Kitchen",
    catSports: "Sports",
    catBeauty: "Beauty",
    navHome: "Home",
    navCategories: "Categories",
    navDeals: "Deals",
    navOrders: "Orders",
    navWishlist: "Wishlist",
    navSupport: "Support",
    trackOrder: "Track Order",
    myAccount: "My Account",
    emptyCart: "Your cart is empty.",
    voiceListening: "Listening... Speak now",
    voiceError: "Voice search not supported or microphone denied.",
    imageSearchTitle: "AI Image Search",
    barcodeSearchTitle: "Smart Barcode Scanner",
    uploadPrompt: "Drag & drop or click to upload product image",
    barcodePrompt: "Align product barcode inside the scanner frame",
    simulatingAi: "AI is analyzing the data..."
  },
  sw: {
    searchPlaceholder: "Tafuta Jtex",
    deliverTo: "Fikisha Tanzania, Jamhuri ya Muungano...",
    freeShipping: "Usafiri BURE",
    firstOrder: "kwa oda yako ya kwanza",
    moneyBack: "Ulinzi wa Pesa Zako",
    upTo60Days: "hadi siku 60",
    bannerTitle: "Ubora Bora, Bei Bora, Jtex Pekee",
    bannerSub: "Nunua vifaa vya kisasa, elektroniki, nguo na mengine mengi kwa bei zisizoshindana.",
    shopNow: "Nunua Sasa",
    flashSales: "Mauzo ya Haraka",
    limitedOffers: "Muda maalumu - Usikose!",
    endsIn: "Inaisha:",
    viewAll: "Tazama Zote >",
    topBrandsTitle: "Bidhaa Bora, Ubora wa Juu",
    topBrandsSub: "Nunua chapa unazozipenda",
    viewAllBrands: "Tazama Chapa Zote",
    bigDealsTitle: "Punguzo Kubwa Chapa Bora",
    bigDealsSub: "Hadi 40% Punguzo",
    catElectronics: "Elektroniki",
    catComputers: "Kompyuta",
    catPhones: "Simu",
    catFashion: "Nguo",
    catHome: "Vyombo vya Ndani",
    catSports: "Michezo",
    catBeauty: "Urembo",
    navHome: "Mwanzo",
    navCategories: "Kategoria",
    navDeals: "Punguzo",
    navOrders: "Oda Zangu",
    navWishlist: "Ninazopenda",
    navSupport: "Msaada",
    trackOrder: "Fuatilia Oda",
    myAccount: "Akaunti Yangu",
    emptyCart: "Kikapu chako kipo wazi.",
    voiceListening: "Inasikiliza... Ongea sasa",
    voiceError: "Mfumo wa sauti haukubaliwi kwenye kivinjari hiki.",
    imageSearchTitle: "Tafuta kwa Picha (AI)",
    barcodeSearchTitle: "Skana Barcode ya Bidhaa",
    uploadPrompt: "Kokota picha au bonyeza hapa kupakia picha ya bidhaa",
    barcodePrompt: "Weka barcode ya bidhaa katikati ya fremu ya skana",
    simulatingAi: "AI inachuja na kuchambua picha..."
  }
};

const CATEGORY_KEYS = ['Electronics', 'Computers', 'Phones', 'Fashion', 'Home', 'Sports', 'Beauty'];

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  
  const [activeCategory, setActiveCategory] = useState('Electronics');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Advanced Search Feature States
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [aiActionLoading, setAiActionLoading] = useState(false);
  
  const t = translations[lang];
  const { cart, addToCart } = useCart();

  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchRealProducts = async () => {
      try {
        const url = `${getApiUrl()}/api/products`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Kosa la Server (Code ${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (error: any) {
        setFetchError(error.message); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealProducts();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  // Smart Actions
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(t.voiceError); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'sw-TZ';
    recognition.start();
    setIsVoiceListening(true);
    recognition.onresult = (event: any) => { setSearchQuery(event.results[0][0].transcript); setIsVoiceListening(false); };
    recognition.onerror = () => setIsVoiceListening(false);
    recognition.onend = () => setIsVoiceListening(false);
  };

  const handleAiSimulation = (closeFunc: any) => {
    setAiActionLoading(true);
    setTimeout(() => { setAiActionLoading(false); closeFunc(false); setSearchQuery('Smartphone'); }, 2000);
  };

  const getTranslatedCategoryName = (catKey: string) => {
      switch(catKey) {
          case 'Electronics': return t.catElectronics;
          case 'Computers': return t.catComputers;
          case 'Phones': return t.catPhones;
          case 'Fashion': return t.catFashion;
          case 'Home': return t.catHome;
          case 'Sports': return t.catSports;
          case 'Beauty': return t.catBeauty;
          default: return catKey;
      }
  };

  // REAL DATA FILTERING
  const displayedProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    const tCat = activeCategory.toLowerCase();
    const matchCategory = activeCategory === 'All' || pCat.includes(tCat) || (tCat === 'home' && pCat.includes('kitchen'));
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const SkeletonCard = () => (
    <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
      <div className="aspect-square bg-gray-100 rounded-lg mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    </div>
  );

  const ProductCard = ({ product, badge }: { product: any, badge?: string }) => {
    const isWishlisted = wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return (
      <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
        <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition">
          <FiHeart className={`text-lg ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#0F8A99] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
            -{discount}%
          </span>
        )}
        <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center p-2 relative overflow-hidden transition">
          {product.imageUrl ? (
            <img src={`${getApiUrl()}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-500" />
          ) : (
            <span className="text-4xl group-hover:scale-105 transition duration-500">{product.imageEmoji || '📦'}</span>
          )}
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-snug mb-1 line-clamp-2 h-8">{product.name}</h3>
        <div className="flex flex-col mb-3 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-gray-900 leading-none">TZS {product.price.toLocaleString()}</span>
            {product.oldPrice && <span className="text-[10px] sm:text-xs text-gray-400 line-through">TZS {product.oldPrice.toLocaleString()}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center text-[#F2A900] text-[10px]">
              ★★★★★ <span className="text-gray-400 ml-1 font-medium">(24)</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-[#0F172A] hover:border-[#F2A900] transition-all">
              <FiShoppingCart className="text-sm" />
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans pb-20 md:pb-0">
      
      {/* --- DESKTOP HEADER (DARK NAV) --- */}
      <header className="hidden md:block bg-[#0B1120] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <span onClick={() => router.push('/')} className="text-3xl font-black tracking-tight cursor-pointer">
              J<span className="text-[#F2A900]">tex</span>
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
              <FiMapPin className="text-[#F2A900] text-lg"/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="font-bold flex items-center gap-1">Tanzania, United Republic <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-3xl mx-8 relative">
            <div className="w-full flex border-2 border-transparent rounded-full overflow-hidden bg-white focus-within:border-[#F2A900] transition-all">
              <div className="bg-gray-100 border-r border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition">
                All <FiChevronDown/>
              </div>
              <input 
                type="text" placeholder="Search products, brands..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400" 
              />
              <div className="flex items-center gap-3 px-3 text-gray-400">
                <button onClick={startVoiceSearch} className="hover:text-blue-500 transition"><FiMic size={18} /></button>
                <button onClick={() => setIsBarcodeOpen(true)} className="hover:text-amber-500 transition"><FiMaximize size={18} /></button>
                <button onClick={() => setIsImageSearchOpen(true)} className="hover:text-green-500 transition"><FiCamera size={18} /></button>
              </div>
              <button className="bg-[#F2A900] px-8 flex items-center justify-center text-[#0F172A] hover:bg-yellow-500 transition">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition text-sm font-bold">
               <FiGlobe className="text-lg text-gray-400"/>
               <span>TZ <FiChevronDown className="inline"/></span>
            </div>
            <div className="relative cursor-pointer hover:text-[#F2A900] transition flex flex-col items-center">
               <div className="relative border border-gray-700 p-2 rounded-lg bg-gray-800/50">
                 <FiShoppingCart className="text-xl" />
                 {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F2A900] text-[#0F172A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1120]">{cart.length}</span>}
               </div>
               <span className="text-[10px] mt-1 font-medium">Cart</span>
            </div>
            <div className="cursor-pointer hover:text-[#F2A900] transition flex flex-col items-center">
               <div className="border border-gray-700 p-2 rounded-lg bg-gray-800/50"><FiPackage className="text-xl" /></div>
               <span className="text-[10px] mt-1 font-medium">{t.trackOrder}</span>
            </div>
            <div onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition">
               <FiUser className="text-lg text-gray-400"/>
               <span className="text-sm font-bold">{t.myAccount}</span>
            </div>
          </div>

        </div>
      </header>

      {/* --- MOBILE HEADER (WHITE NAV) EXACTLY LIKE MOCKUP --- */}
      <header className="md:hidden bg-white sticky top-0 z-40 shadow-sm pt-3">
        {/* Mobile Search */}
        <div className="px-4 mb-3">
          <div className="w-full flex border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm p-1">
             <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 text-sm outline-none bg-transparent text-gray-900" />
             <div className="flex items-center gap-2 text-gray-400 mr-2">
                <button onClick={startVoiceSearch} className={`p-1.5 ${isVoiceListening ? 'text-red-500 animate-pulse' : ''}`}><FiMic size={18} /></button>
                <button onClick={() => setIsImageSearchOpen(true)} className="p-1.5"><FiCamera size={18} /></button>
             </div>
             <button className="bg-[#F2A900] w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"><FiSearch className="text-lg" /></button>
          </div>
        </div>

        {/* Mobile Categories Strip */}
        <div className="flex overflow-x-auto px-4 pb-0 gap-6 hide-scrollbar border-b border-gray-100">
           {CATEGORY_KEYS.map(cat => (
             <button 
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-sm font-bold pb-2 border-b-2 transition-all ${activeCategory === cat ? 'border-[#0F8A99] text-[#0F8A99]' : 'border-transparent text-gray-500'}`}
             >
                {getTranslatedCategoryName(cat)}
             </button>
           ))}
        </div>

        {/* Mobile Delivery & Badges Row */}
        <div className="bg-[#F5F8FA] px-4 py-2">
           <div className="flex items-center justify-between text-xs text-gray-600 bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 mb-2">
              <div className="flex items-center gap-2"><FiMapPin className="text-gray-400 text-lg"/> <span className="font-medium truncate">{t.deliverTo}</span></div>
              <FiChevronDown className="text-gray-400"/>
           </div>
           <div className="flex gap-2">
              <div className="flex-1 bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm flex items-center gap-2">
                 <div className="bg-[#0F8A99] text-white p-1.5 rounded-md"><FiTruck size={14}/></div>
                 <div className="flex flex-col leading-tight"><span className="text-[10px] font-black text-gray-900">{t.freeShipping}</span><span className="text-[9px] text-gray-500">{t.firstOrder}</span></div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm flex items-center gap-2">
                 <div className="bg-[#F2A900] text-white p-1.5 rounded-md"><FiShield size={14}/></div>
                 <div className="flex flex-col leading-tight"><span className="text-[10px] font-black text-gray-900">{t.moneyBack}</span><span className="text-[9px] text-gray-500">{t.upTo60Days}</span></div>
              </div>
           </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT SHELL --- */}
      <main className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row gap-0 md:gap-6 px-0 md:px-6 lg:px-8 py-0 md:py-6">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-[260px] flex-shrink-0 flex-col gap-4">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-900 font-bold transition"><FiHome className="text-lg text-gray-500"/> {t.navHome}</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition"><FiGrid className="text-lg text-gray-400"/> {t.navCategories}</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition justify-between">
                <div className="flex items-center gap-3"><FiTag className="text-lg text-gray-400"/> {t.navDeals}</div>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black">Hot</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition"><FiPackage className="text-lg text-gray-400"/> {t.navOrders}</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition"><FiHeart className="text-lg text-gray-400"/> {t.navWishlist}</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition"><FiHeadphones className="text-lg text-gray-400"/> {t.navSupport}</button>
           </div>
           <div className="bg-[#0B1120] rounded-2xl p-6 text-center text-white relative overflow-hidden shadow-lg mt-auto">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F2A900] to-yellow-600"></div>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Special Offer</p>
              <h4 className="text-2xl font-black mb-1">Up to <span className="text-[#F2A900]">40% Off</span></h4>
              <p className="text-xs text-gray-400 mb-4">On selected items</p>
              <button className="bg-white text-[#0B1120] text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition">Shop Now &rarr;</button>
           </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Desktop Only Categories Strip */}
          <div className="hidden md:flex overflow-x-auto gap-8 px-4 pb-4 mb-4 border-b border-gray-200 hide-scrollbar">
              {CATEGORY_KEYS.map(cat => (
              <button 
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap text-sm font-bold transition-all ${activeCategory === cat ? 'text-[#0F172A]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                  {getTranslatedCategoryName(cat)}
              </button>
              ))}
          </div>

          {/* MAIN HERO BANNER (Matches both mobile and desktop) */}
          <div className="relative w-full h-[200px] sm:h-[300px] md:rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D384D] to-[#165673] text-white flex flex-col justify-center px-6 sm:px-12 shadow-sm mb-4 md:mb-6">
             <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-2 sm:mb-4 tracking-tight leading-tight max-w-[70%] lg:max-w-[50%]">{t.bannerTitle}</h1>
             <p className="text-xs sm:text-base lg:text-lg font-medium mb-4 sm:mb-8 opacity-90 max-w-[80%] lg:max-w-[50%] leading-relaxed">{t.bannerSub}</p>
             <button className="bg-[#F2A900] text-[#0F172A] font-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg w-max hover:bg-yellow-500 transition shadow-lg flex items-center gap-2 text-xs sm:text-sm">
                {t.shopNow} <FiChevronRight />
             </button>
             {/* Pagination Dots Simulation */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-6 h-2 rounded-full bg-[#F2A900]"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
             </div>
          </div>

          {/* TRUST BADGES (Desktop Row, Mobile handles this differently but let's place standard desktop here) */}
          <div className="hidden md:flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-3"><FiTruck className="text-3xl text-gray-700"/><div className="flex flex-col"><span className="text-sm font-black text-gray-900">FREE Delivery</span><span className="text-xs text-gray-500">on orders over TZS 50,000</span></div></div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div className="flex items-center gap-3"><FiShield className="text-3xl text-[#F2A900]"/><div className="flex flex-col"><span className="text-sm font-black text-gray-900">Money-back Guarantee</span><span className="text-xs text-gray-500">for up to 60 days</span></div></div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div className="flex items-center gap-3"><FiCreditCard className="text-3xl text-gray-700"/><div className="flex flex-col"><span className="text-sm font-black text-gray-900">Secure Payment</span><span className="text-xs text-gray-500">100% secure payments</span></div></div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div className="flex items-center gap-3"><FiHeadphones className="text-3xl text-gray-700"/><div className="flex flex-col"><span className="text-sm font-black text-gray-900">24/7 Support</span><span className="text-xs text-gray-500">We are here to help</span></div></div>
          </div>

          {/* FLASH SALES SECTION (Exact mockup layout) */}
          <div className="bg-white md:rounded-2xl md:shadow-sm md:border border-gray-100 p-0 md:p-6 mb-6 pt-4 md:pt-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-4 md:px-0">
                <div className="flex items-center gap-3">
                   <FiZap className="text-[#F2A900] text-2xl fill-[#F2A900]" />
                   <h2 className="text-lg sm:text-xl font-black text-gray-900">{t.flashSales}</h2>
                   <span className="text-xs text-gray-500 hidden sm:block font-medium ml-2">{t.limitedOffers}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                   <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-gray-500">{t.endsIn}</span>
                      <div className="flex gap-1">
                         <span className="bg-[#0F172A] text-white px-2 py-1 rounded">03</span><span className="text-gray-400">:</span>
                         <span className="bg-[#0F172A] text-white px-2 py-1 rounded">45</span><span className="text-gray-400">:</span>
                         <span className="bg-[#0F172A] text-white px-2 py-1 rounded">59</span>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-gray-500 hover:text-[#0F172A] hidden sm:block">{t.viewAll}</button>
                </div>
             </div>

             {/* Products Grid / Horizontal Scroll */}
             {fetchError ? (
               <div className="p-6 bg-red-50 text-red-600 rounded-xl text-center"><FiAlertCircle className="mx-auto text-2xl mb-2"/>{fetchError}</div>
             ) : isLoading ? (
               <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-4"><SkeletonCard/><SkeletonCard/><SkeletonCard/></div>
             ) : displayedProducts.length === 0 ? (
               <div className="p-12 text-center text-gray-400 font-bold border border-dashed rounded-xl m-4 md:m-0">No items available.</div>
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 md:px-0">
                  {displayedProducts.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
               </div>
             )}
          </div>

          {/* SECONDARY BANNER & TOP BRANDS */}
          <div className="bg-[#0F3B4E] rounded-none md:rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between text-white relative overflow-hidden mb-6">
             <div className="z-10 text-center sm:text-left">
                <h3 className="text-xl sm:text-3xl font-black mb-1">{t.bigDealsTitle}</h3>
                <p className="text-sm sm:text-lg text-[#F2A900] font-bold mb-4">{t.bigDealsSub}</p>
                <button className="bg-[#F2A900] text-[#0F172A] font-black px-6 py-2 rounded-lg text-xs hover:bg-yellow-500 transition shadow-md">Shop Now <FiChevronRight className="inline"/></button>
             </div>
             <div className="mt-4 sm:mt-0 z-10 opacity-80 text-6xl">
                🎁 📱
             </div>
          </div>

          {/* BRANDS BAR */}
          <div className="bg-[#0B1120] text-white p-4 md:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div>
                   <h4 className="font-bold text-sm">{t.topBrandsTitle}</h4>
                   <p className="text-[10px] text-gray-400">{t.topBrandsSub}</p>
                </div>
                <button className="bg-[#1E293B] text-xs font-bold px-4 py-1.5 rounded text-gray-300 hover:bg-gray-700 transition">{t.viewAllBrands}</button>
             </div>
             <div className="flex items-center gap-6 opacity-70 flex-wrap justify-center">
                <span className="font-black text-xl tracking-tighter">MI</span>
                <span className="font-black text-lg tracking-widest">SAMSUNG</span>
                <span className="font-black text-xl"></span>
                <span className="font-black text-xl italic">hp</span>
                <span className="font-black text-lg tracking-widest">SONY</span>
                <span className="font-black text-lg tracking-widest">Lenovo</span>
                <span className="font-black text-lg border-2 rounded-full px-1">DELL</span>
             </div>
          </div>

        </div>
      </main>
      
      <Footer />
      
      {/* MOBILE BOTTOM NAVIGATION (Matches Mockup) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 px-2 pb-1 z-50">
        <button className="flex flex-col items-center gap-1 w-16 text-[#F2A900]">
          <FiHome className="text-xl" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900">
          <FiGrid className="text-xl" />
          <span className="text-[9px] font-bold">Categories</span>
        </button>
        
        {/* CENTER BIG BUTTON */}
        <div className="relative -top-5">
           <div className="w-14 h-14 bg-[#0F3B4E] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white cursor-pointer hover:bg-[#0D3040] transition">
              <FiMessageCircle className="text-2xl" />
           </div>
           <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600">Message</span>
        </div>

        <button onClick={() => router.push('/cart')} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900 relative">
          <div className="relative">
             <FiShoppingCart className="text-xl" />
             {cart.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#F2A900] text-[#0F172A] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </div>
          <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900">
          <FiUser className="text-xl" />
          <span className="text-[9px] font-bold">My Jtex</span>
        </button>
      </div>

      {/* --- MODALS (Voice, Barcode, Image) Remain Unchanged from Previous Version --- */}
      {isVoiceListening && (
        <div className="fixed inset-0 bg-black/80 text-white z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
           <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl animate-ping opacity-75 mb-8 shadow-[0_0_40px_rgba(220,38,38,0.6)]">
              <FiMic />
           </div>
           <p className="font-black text-xl tracking-wider uppercase text-center animate-pulse text-white">{t.voiceListening}</p>
        </div>
      )}

      {isBarcodeOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-white w-full max-w-lg rounded-2xl p-6 border text-center relative overflow-hidden flex flex-col items-center shadow-2xl">
              <button onClick={() => setIsBarcodeOpen(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"><FiX size={18} /></button>
              <h3 className="text-lg font-black tracking-wide mb-2 flex items-center gap-2 text-[#F2A900]"><FiMaximize /> {t.barcodeSearchTitle}</h3>
              <p className="text-xs text-gray-500 mb-6">{t.barcodePrompt}</p>
              <div className="w-full aspect-[4/3] bg-gray-100 border-gray-300 border-2 border-dashed rounded-xl relative overflow-hidden flex items-center justify-center mb-6">
                 <div className="w-4/5 h-0.5 bg-red-500 absolute animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                 <span className="text-5xl opacity-20 select-none text-black">📷 Camera</span>
              </div>
              {aiActionLoading ? (
                 <p className="text-xs font-bold text-[#F2A900] animate-pulse">{t.simulatingAi}</p>
              ) : (
                 <button type="button" onClick={() => handleAiSimulation(setIsBarcodeOpen)} className="bg-[#F2A900] text-[#0F172A] font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-yellow-500 transition shadow-md">
                    Simulate Scan
                 </button>
              )}
           </div>
        </div>
      )}

      {isImageSearchOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-white w-full max-w-lg rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center border shadow-2xl">
              <button onClick={() => setIsImageSearchOpen(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"><FiX size={18} /></button>
              <h3 className="text-lg font-black tracking-wide mb-1 flex items-center gap-2 text-[#0F8A99]"><FiCamera /> {t.imageSearchTitle}</h3>
              <p className="text-xs text-gray-500 mb-6">{t.uploadPrompt}</p>
              <div onClick={() => handleAiSimulation(setIsImageSearchOpen)} className="w-full border-4 border-dashed transition rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer group mb-4 border-gray-200 bg-gray-50 hover:border-[#0F8A99]">
                 <FiUploadCloud size={48} className="text-gray-400 group-hover:text-[#0F8A99] transition mb-3" />
                 <span className="text-xs font-bold text-gray-400 group-hover:text-[#0F8A99] transition">Click to upload</span>
              </div>
              {aiActionLoading && (
                 <div className="flex items-center gap-2 text-xs font-bold text-[#0F8A99] animate-pulse bg-[#0F8A99]/10 border border-[#0F8A99]/20 px-4 py-2 rounded-lg">
                    <div className="w-4 h-4 border-2 border-[#0F8A99] border-t-transparent rounded-full animate-spin"></div>
                    {t.simulatingAi}
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}