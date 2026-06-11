'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, 
  FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, FiSearch, FiHeart, 
  FiBox, FiAlertCircle, FiCreditCard, FiSmartphone, FiGrid, FiArrowRight, FiArrowLeft
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
    searchPlaceholder: "Search products, brands...",
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
    // Banner Texts EN
    banner1Title: "Huge Discount Season!",
    banner1Sub: "Get up to 40% off on Electronics",
    banner1Btn: "Shop Now",
    banner2Title: "New Phones in Town",
    banner2Sub: "Order today and get it delivered within 24 hours",
    banner2Btn: "View Phones",
    banner3Title: "Modern Fashion",
    banner3Sub: "Look good with trendy clothes at affordable prices",
    banner3Btn: "View Fashion",
    // Kategoria za juu
    catAll: "All Categories",
    catElectronics: "Electronics",
    catFashion: "Fashion",
    catShoes: "Shoes",
    catPhones: "Phones",
    catComputers: "Computers",
    catBeauty: "Beauty"
  },
  sw: {
    allProducts: "Bidhaa Zote",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa iliyopo kwa sasa.",
    noCategoryProducts: "Hakuna bidhaa zilizopatikana kwenye kategoria hii.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    searchPlaceholder: "Tafuta bidhaa, aina...",
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
    // Banner Texts SW
    banner1Title: "Msimu wa Punguzo Kubwa!",
    banner1Sub: "Pata hadi 40% punguzo kwenye Elektroniki",
    banner1Btn: "Nunua Sasa",
    banner2Title: "Simu Mpya Mjini",
    banner2Sub: "Agiza leo uletewe mlangoni ndani ya saa 24",
    banner2Btn: "Tazama Simu",
    banner3Title: "Fesheni ya Kisasa",
    banner3Sub: "Pendeza na nguo za kijanja kwa bei nafuu",
    banner3Btn: "Tazama Nguo",
    // Kategoria za juu
    catAll: "Kategoria Zote",
    catElectronics: "Elektroniki",
    catFashion: "Nguo",
    catShoes: "Viatu",
    catPhones: "Simu",
    catComputers: "Kompyuta",
    catBeauty: "Urembo"
  }
};

// Tumia "Keys" kwa kategoria badala ya maneno halisi ili iwe rahisi kutafsiri
const CATEGORY_KEYS = ['All', 'Electronics', 'Fashion', 'Shoes', 'Phones', 'Computers', 'Beauty'];

// --- BANNERS DATA YENYE TAFSIRI ---
const getBanners = (t: any) => [
  {
    id: 1,
    title: t.banner1Title,
    subtitle: t.banner1Sub,
    bgColor: "from-blue-600 to-blue-800",
    buttonText: t.banner1Btn,
    categoryTarget: "Electronics" // Target ni ile key
  },
  {
    id: 2,
    title: t.banner2Title,
    subtitle: t.banner2Sub,
    bgColor: "from-[#F2A900] to-yellow-600",
    buttonText: t.banner2Btn,
    categoryTarget: "Phones"
  },
  {
    id: 3,
    title: t.banner3Title,
    subtitle: t.banner3Sub,
    bgColor: "from-purple-600 to-purple-800",
    buttonText: t.banner3Btn,
    categoryTarget: "Fashion"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  const [isClient, setIsClient] = useState(false); 
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Banner States
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const categoriesRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const activeBanners = getBanners(t);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  // Mfumo Mzuri wa Kufilter (Anatafsiri Electronics = Elektroniki na Kompyuta = Computers)
  const isCategoryMatch = (productCategory: string, targetCategory: string) => {
    if (targetCategory === 'All') return true;
    if (!productCategory) return false;
    
    const pCat = productCategory.toLowerCase();
    const tCat = targetCategory.toLowerCase();

    // Map za kategoria zinazoshabihiana
    const mappings: any = {
      'electronics': ['electronics', 'elektroniki'],
      'fashion': ['fashion', 'nguo', 'clothing', 'apparel'],
      'shoes': ['shoes', 'viatu', 'footwear'],
      'phones': ['phones', 'simu', 'mobile', 'smartphones'],
      'computers': ['computers', 'kompyuta', 'laptops', 'desktops'],
      'beauty': ['beauty', 'urembo', 'cosmetics', 'health']
    };

    // Kama target ina mapping, angalia kama product ipo kwenye hiyo map
    if (mappings[tCat]) {
       return mappings[tCat].some((cat: string) => pCat.includes(cat));
    }
    
    // Kama haiko kwenye map, fanya string matching ya kawaida
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
    
    // CUSTOM EVENT: Kupokea amri kutoka SidebarCategories (Ikibonyeza kategoria kule iseti hapa)
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

  // Banners Auto-Slide Logic
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

  const SkeletonCard = () => (
    <div className="min-w-[140px] sm:min-w-[200px] bg-white rounded-xl p-3 border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
      <div className="aspect-square bg-gray-200 rounded-lg mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    return (
      <div className="w-full bg-white rounded-xl p-2.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
        <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition">
          <FiHeart className={`text-sm ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        <div className="aspect-square bg-white border border-gray-50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center p-1 sm:p-2 relative overflow-hidden group-hover:bg-gray-50 transition">
          {product.imageUrl ? (
            <img src={`${getApiUrl()}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-500" />
          ) : (
            <span className="text-4xl group-hover:scale-105 transition duration-500">{product.imageEmoji}</span>
          )}
        </div>
        <h3 className="text-[11px] sm:text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2 group-hover:text-[#F2A900] transition h-8">{product.name}</h3>
        <div className="flex flex-col mb-2 mt-auto">
          <span className="text-sm sm:text-lg font-black text-[#0F172A] leading-none">TZS {product.price.toLocaleString()}</span>
          {product.oldPrice && <span className="text-[10px] sm:text-xs text-gray-400 line-through mt-0.5">TZS {product.oldPrice.toLocaleString()}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <div className="flex items-center text-[#F2A900] text-[8px] sm:text-[10px]">
              ★★★★★ <span className="text-gray-400 ml-1 font-medium hidden sm:block">(24)</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#F2A900] transition-all shadow-sm">
              <FiShoppingCart className="text-xs sm:text-sm" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] text-gray-900 font-sans antialiased pb-20 md:pb-0">
      <TopTicker />
      
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-14 sm:h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full flex border-2 ${showSuggestions ? 'border-[#F2A900] rounded-t-xl' : 'border-[#F2A900] rounded-full'} overflow-hidden transition-all bg-white`}>
              <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs outline-none hidden lg:block font-medium cursor-pointer">
                {CATEGORY_KEYS.map(cat => <option key={cat} value={cat}>{getTranslatedCategoryName(cat)}</option>)}
              </select>
              <input 
                type="text" placeholder={t.searchPlaceholder} value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => { if(searchQuery) setShowSuggestions(true); }}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent" 
              />
              <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0F172A] hover:bg-yellow-500 transition"><FiSearch className="text-lg" /></button>
            </div>
            
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {filteredSuggestions.length > 0 ? filteredSuggestions.map(item => (
                  <div key={item.id} onClick={() => { router.push(`/product/${item.id}`); setShowSuggestions(false); setSearchQuery(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center p-1">
                      {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="w-full h-full object-contain" /> : item.imageEmoji}
                    </div>
                    <div className="flex-1"><h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4></div>
                    <span className="text-sm font-black text-[#0F172A]">TZS {item.price.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-sm text-gray-500 font-medium">Hakuna bidhaa inayofanana na "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={toggleLanguage} className="hidden lg:flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition">
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
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
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full cursor-pointer shadow-sm" onClick={() => router.push('/profile')}>
                <div className="w-6 h-6 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                <span className="text-xs font-bold hidden md:block">{user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-1 bg-[#0F172A] text-[#F2A900] px-3 py-1.5 rounded-full text-xs font-bold">
                <FiUser /> <span className="hidden sm:block">Login</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full flex border border-gray-300 rounded-full overflow-hidden bg-gray-50">
             <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 text-xs outline-none bg-transparent" />
             <button className="bg-[#F2A900] px-4 flex items-center justify-center text-[#0F172A]"><FiSearch className="text-sm" /></button>
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="w-full max-w-[1920px] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        
        <div className="hidden lg:flex w-[260px] xl:w-[280px] flex-shrink-0 flex-col gap-6">
          <SidebarCategories />
        </div>

        <div className="flex-1 flex flex-col gap-5 sm:gap-8 min-w-0">
          
          {/* MATANGAZO YANAYOTELEZA (BANNERS) */}
          <div className="relative w-full h-[180px] sm:h-[250px] md:h-[300px] rounded-2xl overflow-hidden shadow-sm group">
            {activeBanners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-8 sm:px-12 md:px-20 text-white
                ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 tracking-tight leading-tight">{banner.title}</h1>
                <p className="text-sm sm:text-lg md:text-xl font-medium mb-6 sm:mb-8 opacity-90 max-w-xl">{banner.subtitle}</p>
                <button 
                  onClick={() => handleBannerClick(banner.categoryTarget)}
                  className="bg-white text-gray-900 font-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl w-max hover:bg-gray-100 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  {banner.buttonText} <FiArrowRight />
                </button>
              </div>
            ))}
            
            <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition"><FiArrowLeft size={24} /></button>
            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition"><FiArrowRight size={24} /></button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {activeBanners.map((_, index) => (
                <div key={index} onClick={() => setCurrentBannerIndex(index)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${index === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50'}`}></div>
              ))}
            </div>
          </div>

          <TrustBadges />

          <div ref={categoriesRef} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mt-2 scroll-mt-24">
            
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar border-b border-gray-100">
              {CATEGORY_KEYS.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat 
                      ? 'bg-[#0F172A] text-[#F2A900] shadow-md' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'All' ? <FiGrid /> : ''}
                  {getTranslatedCategoryName(cat)}
                </button>
              ))}
            </div>

            <div className="flex flex-col mb-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F2A900]/10 text-[#F2A900] rounded-full flex items-center justify-center"><FiBox className="text-xl" /></div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    {getTranslatedCategoryName(activeCategory)}
                  </h2>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{displayedProducts.length} Items</span>
              </div>
            </div>
            
            {fetchError ? (
               <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                 <FiAlertCircle className="text-4xl mb-3" />
                 <p className="font-bold mb-1">Imeshindwa kuwasiliana na Server</p>
                 <p className="text-xs">{fetchError}</p>
                 <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Refresh Page</button>
               </div>
            ) : isLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                 {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : displayedProducts.length === 0 ? (
               <div className="text-center py-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <FiBox className="text-6xl text-gray-300 mb-4" />
                 <p className="text-gray-500 font-bold text-lg mb-2">{activeCategory === 'All' ? t.noProducts : t.noCategoryProducts}</p>
                 <button onClick={() => setActiveCategory('All')} className="text-sm font-bold text-blue-600 hover:underline">Rudi kwenye Bidhaa Zote / Back to All</button>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 animate-fade-in">
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

      {/* LOGIN POPUP & CHECKOUT WORKFLOW */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex overflow-hidden min-h-[500px] animate-fade-in">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            <div className="hidden md:flex md:w-1/2 bg-[#0F172A] text-white flex-col justify-center p-12">
               <h2 className="text-5xl font-black mb-4">J<span className="text-[#F2A900]">tex</span></h2>
               <p className="text-lg font-medium text-gray-300 mb-8">{t.signIn} and Checkout seamlessly.</p>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>{t.signIn}</button>
                <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>{t.register}</button>
              </div>
              {loginError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs rounded-lg font-bold mb-4">{loginError}</div>}
              <form onSubmit={authMode === 'login' ? handleInlineLogin : handleInlineRegister} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <input type="text" required value={registerName} onChange={e => setRegisterName(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm" placeholder="Full Name" />
                    <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm" placeholder="Phone Number" />
                  </>
                )}
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm" placeholder="Email Address" />
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm" placeholder="Password" />
                <button type="submit" className="w-full bg-[#0F172A] text-white font-bold py-3.5 rounded-xl text-sm mt-2">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm pb-16">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-20"><FiX size={20} /></button>
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between sm:justify-center sm:gap-12 relative">
              {['Cart', 'Shipping', 'Payment', 'Done'].map((step, idx) => (
                <div key={step} className={`flex flex-col items-center z-10 ${workflowStep >= idx + 1 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mb-2 transition-all ${workflowStep >= idx + 1 ? 'bg-[#F2A900] text-[#0F172A] shadow-md ring-4 ring-yellow-50' : 'bg-gray-200'}`}>
                    {workflowStep > idx + 1 ? <FiCheckCircle /> : idx + 1}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{step}</span>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white">
               {workflowStep === 1 && (
                  <div className="max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900">{t.cart}</h3>
                      {cart.length > 0 && (
                        <button onClick={clearCart} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                          <FiTrash2 /> Clear Cart
                        </button>
                      )}
                    </div>
                    {cart.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <FiShoppingCart className="text-6xl mx-auto mb-4 text-gray-200" />
                        <p className="font-bold text-lg">{t.emptyCart}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-8">
                          {cart.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl shadow-sm">
                                  {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="object-contain w-full h-full" /> : item.imageEmoji || '📦'}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: <span className="font-black text-[#F2A900]">{item.quantity}</span></p>
                                </div>
                              </div>
                              <span className="font-black text-[#0F172A]">TZS {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                          <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
                          <span className="text-2xl font-black text-gray-900">TZS {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={handleProceedToLocation} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
                          {t.proceedLocation} <FiChevronRight />
                        </button>
                      </>
                    )}
                  </div>
               )}

               {workflowStep === 2 && (
                  <div className="max-w-xl mx-auto animate-fade-in">
                     <h3 className="text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
                       <FiMapPin className="text-[#F2A900]"/> {t.location}
                     </h3>
                     <div className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.country}</label>
                         <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium focus:ring-2 focus:ring-[#F2A900]/50 transition">
                           <option value="Tanzania">Tanzania</option><option value="Kenya">Kenya</option><option value="Uganda">Uganda</option><option value="Rwanda">Rwanda</option>
                         </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.city}</label>
                           <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#F2A900]/50 transition" placeholder="e.g. Dar es Salaam" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.zip}</label>
                           <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#F2A900]/50 transition" placeholder="e.g. 11000" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.street}</label>
                         <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#F2A900]/50 transition" placeholder="e.g. Makumbusho, Uhuru Street, House 42" />
                       </div>
                     </div>
                     <div className="mt-8 flex gap-3">
                       <button onClick={() => setWorkflowStep(1)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                       <button onClick={() => { if(city && streetAddress) setWorkflowStep(3); else alert('Please fill in City and Street Address'); }} className="flex-1 bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
                         {t.proceedPayment} <FiChevronRight />
                       </button>
                     </div>
                  </div>
               )}

               {workflowStep === 3 && (
                 <form onSubmit={handlePlaceOrder} className="max-w-xl mx-auto animate-fade-in">
                   <h3 className="text-xl sm:text-2xl font-black mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
                     <FiShield className="text-green-500"/> {t.payment}
                   </h3>
                   <div className="grid grid-cols-3 gap-3 mb-8">
                     <div onClick={() => setPaymentMethod('Card')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Card' ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiCreditCard className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Card</span>
                     </div>
                     <div onClick={() => setPaymentMethod('M-Pesa')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'M-Pesa' ? 'border-red-600 bg-red-600 text-white shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiSmartphone className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">M-Pesa</span>
                     </div>
                     <div onClick={() => setPaymentMethod('Raha')} className={`border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Raha' ? 'border-[#F2A900] bg-[#F2A900] text-[#0F172A] shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiGlobe className="text-2xl" /><span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Raha</span>
                     </div>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 space-y-3">
                     <div className="flex justify-between text-sm text-gray-600 font-medium"><span>Subtotal</span><span>TZS {cartTotal.toLocaleString()}</span></div>
                     <div className="flex justify-between text-sm text-gray-600 font-medium"><span>{t.deliveryFee}</span><span>TZS {shippingFee.toLocaleString()}</span></div>
                     {upfrontPayment > 0 && (
                       <div className="flex justify-between text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg mt-2">
                         <span>{t.upfront} (20%)</span><span>TZS {upfrontPayment.toLocaleString()}</span>
                       </div>
                     )}
                     <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.grandTotal}</span>
                       <span className="text-2xl font-black text-[#0F172A]">TZS {grandTotal.toLocaleString()}</span>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     <button type="button" onClick={() => setWorkflowStep(2)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                     <button type="submit" disabled={checkoutLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
                       {checkoutLoading ? 'Processing...' : <><FiLock /> {t.confirmOrder}</>}
                     </button>
                   </div>
                 </form>
               )}

               {workflowStep === 4 && (
                 <div className="text-center py-12 px-4 animate-fade-in max-w-md mx-auto">
                   <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner ring-8 ring-green-50"><FiCheckCircle /></div>
                   <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Order Successful!</h3>
                   <p className="text-gray-500 mb-8 text-sm leading-relaxed">{t.successMsg}</p>
                   <button onClick={() => { setIsWorkflowOpen(false); router.push('/profile'); }} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-sm transition shadow-lg">
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