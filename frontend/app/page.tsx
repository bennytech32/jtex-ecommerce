'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, 
  FiLock, FiUser, FiPhone, FiMail, FiTrash2, FiChevronRight, FiSearch, FiHeart, 
  FiBox, FiAlertCircle, FiCreditCard, FiSmartphone, FiGrid, FiArrowRight, FiArrowLeft,
  FiCpu, FiMic, FiMaximize, FiCamera, FiUploadCloud, FiMoon, FiSun, FiChevronDown
} from 'react-icons/fi';

import TopTicker from './components/navigation/TopTicker';
import NavbarLinks from './components/navigation/NavbarLinks';
import SidebarCategories from './components/navigation/SidebarCategories';
import HeroSlider from './components/commerce/HeroSlider';
import TrustBadges from './components/common/TrustBadges';
import BrandList from './components/common/BrandList';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import MobileBottomNav from './components/navigation/MobileBottomNav';

const translations = {
  en: {
    allProducts: "All Products",
    loading: "Loading store...",
    noProducts: "No products available currently.",
    noCategoryProducts: "No products found in this category.",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    searchPlaceholder: "Search Jtex...",
    aiSearchPlaceholder: "Ask Jtex AI...",
    cart: "Cart Review",
    location: "Shipping Address",
    payment: "Payment Method",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Shipping",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! SMS/Email sent.",
    deliveryFee: "Shipping Fee",
    grandTotal: "Grand Total",
    upfront: "Required Upfront",
    signIn: "Sign In",
    register: "Register",
    country: "Country",
    city: "City / State",
    street: "Street Address",
    zip: "ZIP / Postal Code",
    banner1Title: "Best Quality, Best Prices, Only on Jtex",
    banner1Sub: "Shop the latest gadgets, electronics, fashion and more at unbeatable prices.",
    banner1Btn: "Shop Now",
    banner2Title: "New Phones in Town",
    banner2Sub: "Order today and get it delivered within 24 hours",
    banner2Btn: "View Phones",
    banner3Title: "Modern Fashion",
    banner3Sub: "Look good with trendy clothes at affordable prices",
    banner3Btn: "View Fashion",
    catAll: "All Categories",
    catElectronics: "Electronics",
    catFashion: "Fashion",
    catShoes: "Shoes",
    catPhones: "Phones",
    catComputers: "Computers",
    catBeauty: "Beauty",
    voiceListening: "Listening... Speak now",
    voiceError: "Voice search not supported or microphone denied.",
    imageSearchTitle: "AI Image Search",
    barcodeSearchTitle: "Smart Barcode Scanner",
    uploadPrompt: "Drag & drop or click to upload product image",
    barcodePrompt: "Align product barcode inside the scanner frame",
    simulatingAi: "AI is analyzing the data...",
    deliverTo: "Deliver to Tanzania, United Republic...",
    flashSales: "Flash Sales",
    limitedOffers: "Limited time offers - Don't miss out!",
    endsIn: "Ends in:"
  },
  sw: {
    allProducts: "Bidhaa Zote",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa iliyopo kwa sasa.",
    noCategoryProducts: "Hakuna bidhaa zilizopatikana kwenye kategoria hii.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    searchPlaceholder: "Tafuta Jtex...",
    aiSearchPlaceholder: "Uliza Jtex AI...",
    cart: "Kikapu Chako",
    location: "Anwani ya Usafirishaji",
    payment: "Njia ya Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Anwani",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! Tumekutumia SMS na Barua Pepe (Email) yenye Risiti na Invoice.",
    deliveryFee: "Gharama ya Usafiri",
    grandTotal: "Jumla Kuu",
    upfront: "Kianzio",
    signIn: "Ingia",
    register: "Jisajili",
    country: "Nchi",
    city: "Mkoa / Mji",
    street: "Mtaa / Anwani Kamili",
    zip: "Postikodi (Zip Code)",
    banner1Title: "Ubora Bora, Bei Bora, Jtex Pekee",
    banner1Sub: "Nunua vifaa vya kisasa, elektroniki, nguo na mengine mengi kwa bei zisizoshindana.",
    banner1Btn: "Nunua Sasa",
    banner2Title: "Simu Mpya Mjini",
    banner2Sub: "Agiza leo uletewe mlangoni ndani ya saa 24",
    banner2Btn: "Tazama Simu",
    banner3Title: "Fesheni ya Kisasa",
    banner3Sub: "Pendeza na nguo za kijanja kwa bei nafuu",
    banner3Btn: "Tazama Nguo",
    catAll: "Kategoria Zote",
    catElectronics: "Elektroniki",
    catFashion: "Nguo",
    catShoes: "Viatu",
    catPhones: "Simu",
    catComputers: "Kompyuta",
    catBeauty: "Urembo",
    voiceListening: "Inasikiliza... Ongea sasa",
    voiceError: "Mfumo wa sauti haukubaliwi kwenye kivinjari hiki.",
    imageSearchTitle: "Tafuta kwa Picha (AI)",
    barcodeSearchTitle: "Skana Barcode ya Bidhaa",
    uploadPrompt: "Kokota picha au bonyeza hapa kupakia picha ya bidhaa",
    barcodePrompt: "Weka barcode ya bidhaa katikati ya fremu ya skana",
    simulatingAi: "AI inachuja na kuchambua picha...",
    deliverTo: "Fikisha Tanzania, Jamhuri ya Muungano...",
    flashSales: "Mauzo ya Haraka",
    limitedOffers: "Muda maalumu - Usikose!",
    endsIn: "Inaisha baada ya:"
  }
};

const CATEGORY_KEYS = ['All', 'Electronics', 'Computers', 'Phones', 'Fashion', 'Beauty'];

const getBanners = (t: any) => [
  {
    id: 1,
    title: t.banner1Title,
    subtitle: t.banner1Sub,
    bgColor: "from-[#0F3B4E] to-[#1A5C7A]", // Teal dark gradient resembling the reference
    buttonText: t.banner1Btn,
    categoryTarget: "Electronics",
    image: "/images/laptop-banner.png" // We would normally place an image here
  },
  {
    id: 2,
    title: t.banner2Title,
    subtitle: t.banner2Sub,
    bgColor: "from-[#F2A900] to-yellow-600",
    buttonText: t.banner2Btn,
    categoryTarget: "Phones"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); 
  const [isClient, setIsClient] = useState(false); 
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [isAiSearch, setIsAiSearch] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [aiActionLoading, setAiActionLoading] = useState(false);
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const categoriesRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const activeBanners = getBanners(t);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.voiceError);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'sw-TZ';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsVoiceListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      setIsVoiceListening(false);
      if (categoriesRef.current) categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    recognition.onerror = () => setIsVoiceListening(false);
    recognition.onend = () => setIsVoiceListening(false);
  };

  const handleImageUploadSimulation = () => {
    setAiActionLoading(true);
    setTimeout(() => {
      setAiActionLoading(false);
      setIsImageSearchOpen(false);
      setSearchQuery(lang === 'en' ? 'Smartphone' : 'Simu'); 
      if (categoriesRef.current) categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 2500);
  };

  const handleBarcodeScanSimulation = () => {
    setAiActionLoading(true);
    setTimeout(() => {
      setAiActionLoading(false);
      setIsBarcodeOpen(false);
      setSearchQuery('Pro'); 
      if (categoriesRef.current) categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };

  const isCategoryMatch = (productCategory: string, targetCategory: string) => {
    if (targetCategory === 'All') return true;
    if (!productCategory) return false;
    
    const pCat = productCategory.toLowerCase();
    const tCat = targetCategory.toLowerCase();

    const mappings: any = {
      'electronics': ['electronics', 'elektroniki'],
      'fashion': ['fashion', 'nguo', 'clothing', 'apparel'],
      'shoes': ['shoes', 'viatu', 'footwear'],
      'phones': ['phones', 'simu', 'mobile', 'smartphones'],
      'computers': ['computers', 'kompyuta', 'laptops', 'desktops'],
      'beauty': ['beauty', 'urembo', 'cosmetics', 'health']
    };

    if (mappings[tCat]) {
       return mappings[tCat].some((cat: string) => pCat.includes(cat));
    }
    
    return pCat.includes(tCat);
  };

  const displayedProducts = products.filter(p => {
    const matchCategory = isCategoryMatch(p.category, activeCategory);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const filteredSuggestions = displayedProducts.slice(0, 5);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [country, setCountry] = useState('Tanzania');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();

  const getApiUrl = () => {
    return 'https://jtex-ecommerce-production.up.railway.app';
  };

  useEffect(() => {
    setIsClient(true);
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedTheme = localStorage.getItem('jtex_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }

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

    const handleOpenCart = () => { setWorkflowStep(1); setIsWorkflowOpen(true); };
    const handleOpenCategories = () => {
      if (categoriesRef.current) {
        categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    if (window.location.search.includes('cart=open')) handleOpenCart();

    window.addEventListener('openCart', handleOpenCart);
    window.addEventListener('openCategories', handleOpenCategories);
    
    const handleCategorySelect = (e: any) => {
        if(e.detail && e.detail.category) {
            setActiveCategory(e.detail.category);
            handleOpenCategories();
        }
    };
    window.addEventListener('selectCategory', handleCategorySelect);

    return () => {
      window.removeEventListener('openCart', handleOpenCart);
      window.removeEventListener('openCategories', handleOpenCategories);
      window.removeEventListener('selectCategory', handleCategorySelect);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const nextBanner = () => setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  const prevBanner = () => setCurrentBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  const handleBannerClick = (categoryTarget: string) => {
    setActiveCategory(categoryTarget);
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'sw' : 'en');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('jtex_theme', newTheme);
  };

  const handleAuthSuccess = (data: any) => {
    localStorage.setItem('jtex_token', data.token);
    localStorage.setItem('jtex_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsLoginOpen(false);
    if (isWorkflowOpen) setWorkflowStep(2);
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch(`${getApiUrl()}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: loginEmail, password: loginPassword }) });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error || 'Kosa la kuingia.');
    } catch (err: any) { setLoginError(`Tatizo la mtandao au server.`); }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch(`${getApiUrl()}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: registerName, phone: registerPhone, email: loginEmail, password: loginPassword }) });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error || 'Kosa la kusajili.');
    } catch (err: any) { setLoginError(`Tatizo la mtandao au server.`); }
  };

  const openCartWorkflow = () => { setWorkflowStep(1); setIsWorkflowOpen(true); };
  const handleProceedToLocation = () => { if (!user) setIsLoginOpen(true); else setWorkflowStep(2); };

  const shippingFee = (city.toLowerCase() === 'dar es salaam' || city.toLowerCase() === 'dar') ? 0 : 10000;
  const grandTotal = cartTotal + shippingFee;
  const upfrontPayment = (city.toLowerCase() === 'dar es salaam' || city.toLowerCase() === 'dar') ? 0 : grandTotal * 0.2;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); setCheckoutLoading(true);
    const checkoutItems = cart.map((item: any) => ({ productId: item.id, quantity: item.quantity, unitPrice: item.price, subTotal: item.price * item.quantity }));
    const fullAddress = `${streetAddress}, ${city}, ${zipCode}, ${country}`;

    try {
      const res = await fetch(`${getApiUrl()}/api/orders`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ userId: user.id, deliveryRegion: city, address: fullAddress, paymentMethod: paymentMethod, shippingFee, upfrontPayment, items: checkoutItems }) 
      });
      if (res.ok) { setWorkflowStep(4); clearCart(); }
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  // Dynamic Theme Classes
  const isDark = theme === 'dark';
  const bgMain = isDark ? "bg-[#0B1120]" : "bg-[#F5F5F5]"; // Light gray background like the app
  const textMain = isDark ? "text-gray-200" : "text-gray-900";
  const headerBg = isDark ? "bg-[#0B1120] border-gray-800" : "bg-white border-gray-100";
  const logoText = isDark ? "text-white" : "text-[#0F172A]";
  const searchBg = isDark ? "bg-[#1E293B] border-gray-700" : "bg-white border-[#F2A900]";
  const searchInputClass = isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400";
  const cardBg = isDark ? "bg-[#1E293B] border-gray-800" : "bg-white border-gray-100";
  const cardInnerBg = isDark ? "bg-[#0B1120]" : "bg-white"; 
  const textCardTitle = isDark ? "text-gray-200" : "text-gray-800";
  const textPrice = isDark ? "text-white" : "text-[#0F172A]";
  const modalBg = isDark ? "bg-[#1E293B] border-gray-800 text-white" : "bg-white border-gray-100 text-gray-900";

  const SkeletonCard = () => (
    <div className={`w-full ${cardBg} rounded-xl p-3 border shadow-sm animate-pulse flex flex-col h-full`}>
      <div className={`aspect-square ${cardInnerBg} rounded-lg mb-2 w-full`}></div>
      <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
      <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-3`}></div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    return (
      <div className={`w-full ${cardBg} rounded-xl p-3 border shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col cursor-pointer`} onClick={() => router.push(`/product/${product.id}`)}>
        <button onClick={(e) => toggleWishlist(e, product.id)} className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition`}>
          <FiHeart className={`text-lg ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm z-10">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        <div className={`aspect-square ${cardInnerBg} rounded-lg mb-3 flex items-center justify-center p-2 relative overflow-hidden transition`}>
          {product.imageUrl ? (
            <img src={`${getApiUrl()}${product.imageUrl}`} alt={product.name} className={`object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-500`} />
          ) : (
            <span className="text-4xl group-hover:scale-105 transition duration-500">{product.imageEmoji}</span>
          )}
        </div>
        <h3 className={`text-xs sm:text-sm font-medium ${textCardTitle} leading-snug mb-1 line-clamp-2 h-8`}>{product.name}</h3>
        <div className="flex flex-col mb-3 mt-auto">
          <div className="flex items-center gap-2">
            <span className={`text-sm sm:text-base font-black ${textPrice} leading-none`}>TZS {product.price.toLocaleString()}</span>
            {product.oldPrice && <span className="text-[10px] sm:text-xs text-gray-400 line-through">TZS {product.oldPrice.toLocaleString()}</span>}
          </div>
        </div>
        <div className={`flex items-center justify-between`}>
            <div className="flex items-center text-[#F2A900] text-[10px]">
              ★★★★★ <span className="text-gray-400 ml-1 font-medium">(24)</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className={`w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-[#0F172A] hover:border-[#F2A900] transition-all`}>
              <FiShoppingCart className="text-sm" />
            </button>
        </div>
      </div>
    );
  };

  const getTranslatedCategoryName = (catKey: string) => {
      switch(catKey) {
          case 'Electronics': return t.catElectronics;
          case 'Fashion': return t.catFashion;
          case 'Shoes': return t.catShoes;
          case 'Phones': return t.catPhones;
          case 'Computers': return t.catComputers;
          case 'Beauty': return t.catBeauty;
          default: return catKey === 'All' ? t.catAll : catKey;
      }
  };

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} font-sans antialiased pb-20 md:pb-0 transition-colors duration-300`}>
      <div className="hidden md:block">
        <TopTicker />
      </div>
      
      {/* MOBILE APP-LIKE HEADER */}
      <header className={`${headerBg} border-b sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
        <div className="w-full max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between md:hidden">
            <div className={`relative w-full flex border-2 rounded-full overflow-hidden ${isDark ? 'border-gray-700 bg-[#1E293B]' : 'border-transparent bg-gray-100'} p-1 flex-1 mr-4`}>
                <button className="pl-3 text-gray-400"><FiSearch size={18}/></button>
                <input 
                    type="text" 
                    placeholder={t.searchPlaceholder} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className={`flex-1 px-3 py-1.5 text-sm outline-none bg-transparent ${searchInputClass}`} 
                />
                <div className="flex items-center gap-2 pr-2 text-gray-400">
                    <button onClick={startVoiceSearch} className={`p-1 ${isVoiceListening ? 'text-red-500 animate-pulse' : ''}`}><FiMic size={18} /></button>
                    <button onClick={() => setIsImageSearchOpen(true)} className="p-1"><FiCamera size={18} /></button>
                </div>
                <button className="bg-[#F2A900] w-10 h-10 rounded-full flex items-center justify-center text-white ml-1 shadow-md">
                    <FiSearch size={18} />
                </button>
            </div>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden md:flex w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 items-center justify-between">
          <span onClick={() => router.push('/')} className={`text-xl sm:text-2xl font-black ${logoText} tracking-tight cursor-pointer`}>
            J<span className="text-[#F2A900]">tex</span>
          </span>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full flex border-2 ${showSuggestions ? 'border-[#F2A900] rounded-t-xl' : 'border-[#F2A900] rounded-full'} overflow-hidden transition-all ${searchBg} shadow-sm`}>
              <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className={`bg-transparent border-r border-gray-200 px-3 py-2 text-xs outline-none hidden lg:block font-bold cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {CATEGORY_KEYS.map(cat => <option key={cat} value={cat}>{getTranslatedCategoryName(cat)}</option>)}
              </select>
              <input 
                type="text" placeholder={isAiSearch ? t.aiSearchPlaceholder : t.searchPlaceholder} value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => { if(searchQuery) setShowSuggestions(true); }}
                className={`flex-1 px-4 py-2.5 text-sm outline-none bg-transparent font-medium ${isAiSearch ? 'text-purple-500 placeholder-purple-500 font-bold' : searchInputClass}`} 
              />
              
              <div className="flex items-center gap-2 px-2 text-gray-400">
                <button title="Toggle AI Search" onClick={() => setIsAiSearch(!isAiSearch)} className={`p-1.5 rounded-full transition ${isAiSearch ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}><FiCpu size={16} /></button>
                <button title="Voice Search" onClick={startVoiceSearch} className={`p-1.5 rounded-full transition ${isVoiceListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-gray-100'}`}><FiMic size={16} /></button>
                <button title="Barcode Search" onClick={() => setIsBarcodeOpen(true)} className="p-1.5 rounded-full hover:bg-gray-100 transition"><FiMaximize size={16} /></button>
                <button title="Image Search" onClick={() => setIsImageSearchOpen(true)} className="p-1.5 rounded-full hover:bg-gray-100 transition"><FiCamera size={16} /></button>
              </div>

              <button className={`px-6 flex items-center justify-center text-[#0F172A] transition ${isAiSearch ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-[#F2A900] hover:bg-yellow-500'}`}><FiSearch className="text-lg" /></button>
            </div>
            
            {showSuggestions && searchQuery && (
              <div className={`absolute top-full left-0 w-full ${isDark ? 'bg-[#1E293B] border-gray-800' : 'bg-white border-gray-200'} border rounded-b-xl shadow-2xl z-50 max-h-80 overflow-y-auto`}>
                {filteredSuggestions.length > 0 ? filteredSuggestions.map(item => (
                  <div key={item.id} onClick={() => { router.push(`/product/${item.id}`); setShowSuggestions(false); setSearchQuery(''); }} className={`flex items-center gap-3 p-3 cursor-pointer border-b transition hover:bg-gray-50`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center p-1 border bg-gray-100 border-transparent">
                      {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="w-full h-full object-contain" /> : item.imageEmoji}
                    </div>
                    <div className="flex-1"><h4 className={`text-sm font-bold line-clamp-1`}>{item.name}</h4></div>
                    <span className={`text-sm font-black`}>TZS {item.price.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-sm text-gray-500 font-medium">No records match "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={toggleLanguage} className="hidden lg:flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition">
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition">
              {isDark ? <FiSun className="text-yellow-400" size={16} /> : <FiMoon className="text-indigo-600" size={16} />}
            </button>
            <button onClick={openCartWorkflow} className="relative text-gray-700 hover:text-[#F2A900] transition flex flex-col items-center group">
              <div className="relative">
                <FiShoppingCart className="text-xl sm:text-2xl group-hover:scale-110 transition" />
                {isClient && cart && cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </div>
            </button>
            {user ? (
              <div className="flex items-center gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full cursor-pointer shadow-sm transition bg-gray-50 border-gray-200 hover:bg-gray-100" onClick={() => router.push('/profile')}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-[#0F172A] text-white">{user.name.charAt(0)}</div>
                <span className="text-xs font-bold hidden md:block text-gray-900">{user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-1 border px-3 py-1.5 rounded-full text-xs font-bold transition bg-[#0F172A] border-transparent text-[#F2A900] hover:bg-gray-800">
                <FiUser /> <span className="hidden sm:block">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE CATEGORY TABS (Like in Reference) */}
        <div className={`md:hidden flex overflow-x-auto gap-4 px-4 py-2 border-b hide-scrollbar ${isDark ? 'bg-[#1E293B] border-gray-800' : 'bg-white border-gray-200'}`}>
            {CATEGORY_KEYS.map(cat => (
            <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-sm font-semibold pb-2 border-b-2 transition-all ${
                activeCategory === cat 
                    ? 'border-[#0F172A] text-[#0F172A]' 
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-500'}`
                }`}
            >
                {getTranslatedCategoryName(cat)}
            </button>
            ))}
        </div>
      </header>

      {/* MOBILE DELIVERY BAR */}
      <div className={`md:hidden px-4 py-2 flex items-center gap-2 text-xs font-medium border-b ${isDark ? 'bg-[#0B1120] border-gray-800 text-gray-400' : 'bg-[#F5F5F5] border-gray-200 text-gray-600'}`}>
          <FiMapPin className="text-gray-400"/>
          <span className="truncate">{t.deliverTo}</span>
          <FiChevronDown className="ml-auto text-gray-400"/>
      </div>

      <NavbarLinks />

      {/* VOICE FLOATING OVERLAY RADAR SCREEN */}
      {isVoiceListening && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/90 text-white' : 'bg-black/80 text-white'} z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md`}>
           <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl animate-ping opacity-75 mb-8 shadow-[0_0_40px_rgba(220,38,38,0.6)]">
              <FiMic />
           </div>
           <p className="font-black text-xl tracking-wider uppercase text-center animate-pulse">{t.voiceListening}</p>
        </div>
      )}

      {/* SMART BARCODE SCANNER MODAL SCREEN */}
      {isBarcodeOpen && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/90' : 'bg-black/80'} z-50 flex items-center justify-center p-4 backdrop-blur-md`}>
           <div className={`${isDark ? 'bg-[#1E293B] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} w-full max-w-lg rounded-2xl p-6 border text-center relative overflow-hidden flex flex-col items-center shadow-2xl`}>
              <button onClick={() => setIsBarcodeOpen(false)} className={`absolute top-4 right-4 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} p-2 rounded-full transition`}><FiX size={18} /></button>
              <h3 className="text-lg font-black tracking-wide mb-2 flex items-center gap-2 text-[#F2A900]"><FiMaximize /> {t.barcodeSearchTitle}</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>{t.barcodePrompt}</p>
              
              <div className={`w-full aspect-[4/3] ${isDark ? 'bg-[#0F172A] border-gray-600' : 'bg-gray-100 border-gray-300'} border-2 border-dashed rounded-xl relative overflow-hidden flex items-center justify-center mb-6`}>
                 <div className="w-4/5 h-0.5 bg-red-500 absolute animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                 <span className={`text-5xl opacity-20 select-none ${isDark ? 'text-white' : 'text-black'}`}>📷 Camera</span>
              </div>

              {aiActionLoading ? (
                 <p className="text-xs font-bold text-[#F2A900] animate-pulse">{t.simulatingAi}</p>
              ) : (
                 <button type="button" onClick={handleBarcodeScanSimulation} className="bg-[#F2A900] text-[#0F172A] font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-yellow-500 transition shadow-md">
                    Simulate Barcode Scan
                 </button>
              )}
           </div>
        </div>
      )}

      {/* IMAGE VISUAL SEARCH MODAL SCREEN */}
      {isImageSearchOpen && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/90' : 'bg-black/80'} z-50 flex items-center justify-center p-4 backdrop-blur-md`}>
           <div className={`${isDark ? 'bg-[#1E293B] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} w-full max-w-lg rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center border shadow-2xl`}>
              <button onClick={() => setIsImageSearchOpen(false)} className={`absolute top-4 right-4 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} p-2 rounded-full transition`}><FiX size={18} /></button>
              <h3 className="text-lg font-black tracking-wide mb-1 flex items-center gap-2 text-green-500"><FiCamera /> {t.imageSearchTitle}</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>{t.uploadPrompt}</p>
              
              <div onClick={handleImageUploadSimulation} className={`w-full border-4 border-dashed transition rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer group mb-4 ${isDark ? 'border-gray-700 bg-[#0F172A] hover:border-green-500' : 'border-gray-200 bg-gray-50 hover:border-green-500'}`}>
                 <FiUploadCloud size={48} className="text-gray-400 group-hover:text-green-500 transition mb-3" />
                 <span className="text-xs font-bold text-gray-400 group-hover:text-green-500 transition">Click to upload</span>
              </div>

              {aiActionLoading && (
                 <div className="flex items-center gap-2 text-xs font-bold text-green-500 animate-pulse bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    {t.simulatingAi}
                 </div>
              )}
           </div>
        </div>
      )}

      <main className="w-full max-w-[1920px] mx-auto px-0 md:px-6 lg:px-8 xl:px-12 py-0 md:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        
        <div className="hidden lg:flex w-[260px] xl:w-[280px] flex-shrink-0 flex-col gap-6">
          <SidebarCategories />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Trust Badges - Hidden on Mobile */}
          <div className="hidden md:block mb-4">
             <TrustBadges />
          </div>

          {/* MATANGAZO YANAYOTELEZA (BANNERS) - Full width on mobile */}
          <div className={`relative w-full h-[220px] sm:h-[250px] md:h-[300px] md:rounded-2xl overflow-hidden group mb-2 md:mb-6`}>
            {activeBanners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white
                ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 tracking-tight leading-tight max-w-[70%]">{banner.title}</h1>
                <p className="text-xs sm:text-lg md:text-xl font-medium mb-4 sm:mb-8 opacity-90 max-w-[60%]">{banner.subtitle}</p>
                <button 
                  onClick={() => handleBannerClick(banner.categoryTarget)}
                  className="bg-[#F2A900] text-[#0F172A] font-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full w-max hover:bg-yellow-500 transition shadow-lg flex items-center gap-2 text-xs sm:text-base"
                >
                  {banner.buttonText} <FiChevronRight />
                </button>
              </div>
            ))}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {activeBanners.map((_, index) => (
                <div key={index} onClick={() => setCurrentBannerIndex(index)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${index === currentBannerIndex ? 'bg-[#F2A900] w-6' : 'bg-white/50'}`}></div>
              ))}
            </div>
          </div>

          {/* Mobile Trust Badges - Below Banner */}
          <div className="md:hidden grid grid-cols-4 gap-2 px-4 py-4 bg-white border-b border-gray-100 mb-2">
              <div className="flex flex-col items-center text-center gap-1"><FiTruck className="text-gray-600 text-lg"/><span className="text-[9px] text-gray-500 font-medium">Free Delivery</span></div>
              <div className="flex flex-col items-center text-center gap-1"><FiShield className="text-gray-600 text-lg"/><span className="text-[9px] text-gray-500 font-medium">Secure Pay</span></div>
              <div className="flex flex-col items-center text-center gap-1"><FiCheckCircle className="text-gray-600 text-lg"/><span className="text-[9px] text-gray-500 font-medium">Easy Returns</span></div>
              <div className="flex flex-col items-center text-center gap-1"><FiPhone className="text-gray-600 text-lg"/><span className="text-[9px] text-gray-500 font-medium">24/7 Support</span></div>
          </div>

          <div ref={categoriesRef} className={`bg-transparent md:${cardBg} md:rounded-2xl md:p-6 md:shadow-sm mt-2 scroll-mt-24 transition-colors duration-300`}>
            
            {/* FLASH SALES SECTION (MOBILE ONLY) */}
            <div className="md:hidden px-4 mb-4">
               <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-black flex items-center gap-2"><span className="text-[#F2A900]">⚡</span> {t.flashSales}</h2>
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                     <span className="text-gray-500">{t.endsIn}</span>
                     <span className="bg-[#0F172A] text-white px-1.5 py-0.5 rounded">03</span>:
                     <span className="bg-[#0F172A] text-white px-1.5 py-0.5 rounded">45</span>:
                     <span className="bg-[#0F172A] text-white px-1.5 py-0.5 rounded">59</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col mb-4 md:mb-6 px-4 md:px-0">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg sm:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {getTranslatedCategoryName(activeCategory)}
                </h2>
                <span className={`text-xs font-medium text-gray-500`}>{displayedProducts.length} Items</span>
              </div>
            </div>
            
            {fetchError ? (
               <div className={`border p-6 mx-4 md:mx-0 rounded-xl flex flex-col items-center justify-center text-center ${isDark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                 <FiAlertCircle className="text-4xl mb-3" />
                 <p className="font-bold mb-1">Imeshindwa kuwasiliana na Server</p>
                 <p className="text-xs">{fetchError}</p>
                 <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Refresh Page</button>
               </div>
            ) : isLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-4 md:px-0">
                 {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : displayedProducts.length === 0 ? (
               <div className={`text-center py-16 mx-4 md:mx-0 flex flex-col items-center justify-center rounded-xl border border-dashed ${isDark ? 'bg-[#0F172A] border-gray-700' : 'bg-white border-gray-200'}`}>
                 <FiBox className={`text-6xl mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                 <p className={`font-bold text-lg mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{activeCategory === 'All' ? t.noProducts : t.noCategoryProducts}</p>
                 <button onClick={() => setActiveCategory('All')} className="text-sm font-bold text-[#F2A900] hover:underline">Rudi kwenye Bidhaa Zote / Back to All</button>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-4 md:px-0 animate-fade-in">
                {displayedProducts.map(product => <ProductCard key={`all-${product.id}`} product={product} />)}
              </div>
            )}
          </div>

        </div>
      </main>
      
      <div className="hidden sm:block"><BrandList /></div>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />

      {/* LOGIN POPUP WORKFLOW */}
      {isLoginOpen && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/80' : 'bg-black/60'} z-50 flex items-center justify-center p-4 backdrop-blur-md`}>
          <div className={`${modalBg} w-full max-w-4xl rounded-2xl shadow-2xl relative flex overflow-hidden min-h-[500px] animate-fade-in`}>
            <button onClick={() => setIsLoginOpen(false)} className={`absolute top-4 right-4 p-2 rounded-full z-20 transition ${isDark ? 'text-gray-500 hover:text-white bg-[#0F172A] border border-gray-700' : 'text-gray-400 hover:text-gray-900 bg-gray-100'}`}><FiX size={20} /></button>
            <div className="hidden md:flex md:w-1/2 bg-[#0F172A] text-white flex-col justify-center p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F2A900] to-yellow-600"></div>
               <h2 className="text-5xl font-black mb-4">J<span className="text-[#F2A900]">tex</span></h2>
               <p className="text-lg font-medium text-gray-400 mb-8">{t.signIn} and Checkout seamlessly.</p>
            </div>
            <div className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <div className={`flex p-1 rounded-xl mb-6 ${isDark ? 'bg-[#0F172A] border border-gray-800' : 'bg-gray-100'}`}>
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'login' ? (isDark ? 'bg-[#1E293B] shadow text-white' : 'bg-white shadow text-gray-900') : 'text-gray-500 hover:text-gray-400'}`}>{t.signIn}</button>
                <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'register' ? (isDark ? 'bg-[#1E293B] shadow text-white' : 'bg-white shadow text-gray-900') : 'text-gray-500 hover:text-gray-400'}`}>{t.register}</button>
              </div>
              {loginError && <div className={`p-3 text-xs rounded-lg font-bold mb-4 ${isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-50 text-red-600 border border-red-200'}`}>{loginError}</div>}
              <form onSubmit={authMode === 'login' ? handleInlineLogin : handleInlineRegister} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <input type="text" required value={registerName} onChange={e => setRegisterName(e.target.value)} className={`w-full border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] ${isDark ? 'bg-[#0F172A] border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="Full Name" />
                    <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} className={`w-full border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] ${isDark ? 'bg-[#0F172A] border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="Phone Number" />
                  </>
                )}
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={`w-full border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] ${isDark ? 'bg-[#0F172A] border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="Email Address" />
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={`w-full border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] ${isDark ? 'bg-[#0F172A] border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="Password" />
                <button type="submit" className="w-full bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500 font-black py-3.5 rounded-xl text-sm mt-2 transition">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT WORKFLOW MODAL */}
      {isWorkflowOpen && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/80' : 'bg-black/60'} z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md pb-16`}>
          <div className={`${modalBg} w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in`}>
            <button onClick={() => setIsWorkflowOpen(false)} className={`absolute top-4 right-4 z-20 p-2 rounded-full transition ${isDark ? 'text-gray-500 hover:text-white bg-[#0F172A] border border-gray-700' : 'text-gray-400 hover:text-gray-900 bg-gray-100'}`}><FiX size={20} /></button>
            <div className={`${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-100'} p-6 border-b flex items-center justify-between sm:justify-center sm:gap-12 relative`}>
              {['Cart', 'Shipping', 'Payment', 'Done'].map((step, idx) => (
                <div key={step} className={`flex flex-col items-center z-10 ${workflowStep >= idx + 1 ? (isDark ? 'text-white' : 'text-[#0F172A]') : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mb-2 transition-all ${workflowStep >= idx + 1 ? 'bg-[#F2A900] text-[#0F172A] shadow-md ring-4 ring-yellow-900/50' : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                    {workflowStep > idx + 1 ? <FiCheckCircle /> : idx + 1}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{step}</span>
                </div>
              ))}
            </div>

            <div className={`p-4 sm:p-8 overflow-y-auto flex-1 ${modalBg}`}>
               {workflowStep === 1 && (
                  <div className="max-w-xl mx-auto">
                    <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                      <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.cart}</h3>
                      {cart.length > 0 && (
                        <button onClick={clearCart} className={`text-xs font-bold text-red-500 px-3 py-2 rounded-lg transition flex items-center gap-2 ${isDark ? 'bg-red-900/20 border border-red-900/50 hover:bg-red-900/40' : 'bg-red-50 hover:bg-red-100'}`}>
                          <FiTrash2 /> Clear Cart
                        </button>
                      )}
                    </div>
                    {cart.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <FiShoppingCart className="text-6xl mx-auto mb-4 opacity-50" />
                        <p className="font-bold text-lg">{t.emptyCart}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-8">
                          {cart.map((item: any) => (
                            <div key={item.id} className={`flex justify-between items-center p-4 rounded-xl border ${cardBg}`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-xl shadow-sm ${isDark ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-200'}`}>
                                  {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="object-contain w-full h-full" /> : item.imageEmoji || '📦'}
                                </div>
                                <div>
                                  <p className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: <span className="font-black text-[#F2A900]">{item.quantity}</span></p>
                                </div>
                              </div>
                              <span className={`font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>TZS {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className={`flex justify-between items-center p-4 rounded-xl border mb-6 ${cardBg}`}>
                          <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
                          <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>TZS {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={handleProceedToLocation} className={`w-full font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2 ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>
                          {t.proceedLocation} <FiChevronRight />
                        </button>
                      </>
                    )}
                  </div>
               )}

               {workflowStep === 2 && (
                  <div className="max-w-xl mx-auto animate-fade-in">
                     <h3 className={`text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 border-b pb-4 ${isDark ? 'text-white border-gray-800' : 'text-gray-900 border-gray-100'}`}>
                       <FiMapPin className="text-[#F2A900]"/> {t.location}
                     </h3>
                     <div className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.country}</label>
                         <select value={country} onChange={e => setCountry(e.target.value)} className={`w-full rounded-xl px-4 py-3 outline-none text-sm font-medium focus:ring-2 focus:ring-[#F2A900]/50 transition border ${isDark ? 'bg-[#0F172A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                           <option value="Tanzania">Tanzania</option><option value="Kenya">Kenya</option><option value="Uganda">Uganda</option><option value="Rwanda">Rwanda</option>
                         </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.city}</label>
                           <input type="text" value={city} onChange={e => setCity(e.target.value)} className={`w-full rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition border ${isDark ? 'bg-[#0F172A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g. Dar es Salaam" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.zip}</label>
                           <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className={`w-full rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition border ${isDark ? 'bg-[#0F172A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g. 11000" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.street}</label>
                         <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className={`w-full rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition border ${isDark ? 'bg-[#0F172A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="e.g. Makumbusho, Uhuru Street, House 42" />
                       </div>
                     </div>
                     <div className="mt-8 flex gap-3">
                       <button onClick={() => setWorkflowStep(1)} className={`px-6 py-4 font-bold rounded-xl text-sm transition ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Back</button>
                       <button onClick={() => { if(city && streetAddress) setWorkflowStep(3); else alert('Please fill in City and Street Address'); }} className={`flex-1 font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2 ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>
                         {t.proceedPayment} <FiChevronRight />
                       </button>
                     </div>
                  </div>
               )}

               {workflowStep === 3 && (
                 <form onSubmit={handlePlaceOrder} className="max-w-xl mx-auto animate-fade-in">
                   <h3 className={`text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 border-b pb-4 ${isDark ? 'text-white border-gray-800' : 'text-gray-900 border-gray-100'}`}>
                     <FiShield className="text-green-500"/> {t.payment}
                   </h3>
                   <div className="grid grid-cols-3 gap-3 mb-8">
                     <div onClick={() => setPaymentMethod('Card')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Card' ? (isDark ? 'border-[#F2A900] bg-[#F2A900] text-[#0F172A] shadow-md' : 'border-[#0F172A] bg-[#0F172A] text-white shadow-md') : (isDark ? 'border-gray-800 bg-[#0F172A] hover:border-gray-600 text-gray-400' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600')}`}>
                       <FiCreditCard className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Card</span>
                     </div>
                     <div onClick={() => setPaymentMethod('M-Pesa')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'M-Pesa' ? 'border-red-500 bg-red-600 text-white shadow-md' : (isDark ? 'border-gray-800 bg-[#0F172A] hover:border-gray-600 text-gray-400' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600')}`}>
                       <FiSmartphone className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">M-Pesa</span>
                     </div>
                     <div onClick={() => setPaymentMethod('Raha')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Raha' ? 'border-blue-500 bg-blue-600 text-white shadow-md' : (isDark ? 'border-gray-800 bg-[#0F172A] hover:border-gray-600 text-gray-400' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600')}`}>
                       <FiGlobe className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Raha</span>
                     </div>
                   </div>
                   <div className={`p-6 rounded-2xl border mb-8 space-y-3 ${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                     <div className={`flex justify-between text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><span>Subtotal</span><span className={isDark ? 'text-gray-200' : 'text-gray-800'}>TZS {cartTotal.toLocaleString()}</span></div>
                     <div className={`flex justify-between text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><span>{t.deliveryFee}</span><span className={isDark ? 'text-gray-200' : 'text-gray-800'}>TZS {shippingFee.toLocaleString()}</span></div>
                     {upfrontPayment > 0 && (
                       <div className={`flex justify-between text-xs font-bold p-2 rounded-lg mt-2 ${isDark ? 'text-red-400 bg-red-900/20 border border-red-900/50' : 'text-red-500 bg-red-50 border border-red-100'}`}>
                         <span>{t.upfront} (20%)</span><span>TZS {upfrontPayment.toLocaleString()}</span>
                       </div>
                     )}
                     <div className={`border-t pt-3 mt-3 flex justify-between items-center ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                       <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.grandTotal}</span>
                       <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>TZS {grandTotal.toLocaleString()}</span>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     <button type="button" onClick={() => setWorkflowStep(2)} className={`px-6 py-4 font-bold rounded-xl text-sm transition ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Back</button>
                     <button type="submit" disabled={checkoutLoading} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
                       {checkoutLoading ? 'Processing...' : <><FiLock /> {t.confirmOrder}</>}
                     </button>
                   </div>
                 </form>
               )}

               {workflowStep === 4 && (
                 <div className="text-center py-12 px-4 animate-fade-in max-w-md mx-auto">
                   <div className={`w-24 h-24 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner ring-8 ${isDark ? 'bg-green-900/30 ring-green-900/20' : 'bg-green-100 ring-green-50'}`}><FiCheckCircle /></div>
                   <h3 className={`text-2xl sm:text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Successful!</h3>
                   <p className={`mb-8 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.successMsg}</p>
                   <button onClick={() => { setIsWorkflowOpen(false); router.push('/profile'); }} className={`w-full font-black py-4 rounded-xl text-sm transition shadow-lg ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>
                     View Invoice in Profile
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}