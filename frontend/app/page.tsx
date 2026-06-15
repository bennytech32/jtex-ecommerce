'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, 
  FiLock, FiUser, FiPhone, FiTrash2, FiChevronRight, FiSearch, FiHeart, 
  FiBox, FiAlertCircle, FiCreditCard, FiSmartphone, FiGrid, FiArrowRight, FiArrowLeft,
  FiCpu, FiMic, FiMaximize, FiCamera, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones
} from 'react-icons/fi';

import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';

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
    catAll: "All Categories",
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
    simulatingAi: "AI is analyzing the data...",
    cart: "Cart Review",
    location: "Shipping Address",
    payment: "Payment Method",
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
    noProducts: "No products available currently.",
    noCategoryProducts: "No products found in this category.",
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
    catAll: "Kategoria Zote",
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
    simulatingAi: "AI inachuja na kuchambua picha...",
    cart: "Kikapu Chako",
    location: "Anwani ya Usafirishaji",
    payment: "Njia ya Malipo",
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
    noProducts: "Hakuna bidhaa iliyopo kwa sasa.",
    noCategoryProducts: "Hakuna bidhaa zilizopatikana kwenye kategoria hii.",
  }
};

const CATEGORY_KEYS = ['All', 'Electronics', 'Computers', 'Phones', 'Fashion', 'Home', 'Sports', 'Beauty'];

const getBanners = (t: any) => [
  {
    id: 1,
    title: t.bannerTitle,
    subtitle: t.bannerSub,
    bgColor: "from-[#0F3B4E] to-[#1A5C7A]", 
    buttonText: t.shopNow,
    categoryTarget: "Electronics"
  },
  {
    id: 2,
    title: "New Phones in Town",
    subtitle: "Order today and get it delivered within 24 hours",
    bgColor: "from-[#F2A900] to-yellow-600",
    buttonText: "View Phones",
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
  const [isClient, setIsClient] = useState(false); 
  
  // Set to 'All' by default to show all products initially
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Advanced Search Feature States
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [aiActionLoading, setAiActionLoading] = useState(false);
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const categoriesRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const activeBanners = getBanners(t);

  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();

  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';

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
    window.addEventListener('openCart', handleOpenCart);
    if (window.location.search.includes('cart=open')) handleOpenCart();

    return () => {
      window.removeEventListener('openCart', handleOpenCart);
    };
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

  const nextBanner = () => setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  const prevBanner = () => setCurrentBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  const getTranslatedCategoryName = (catKey: string) => {
      switch(catKey) {
          case 'All': return t.catAll;
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

  const ProductCard = ({ product }: { product: any }) => {
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

  // --- CHECKOUT/LOGIN STATES ---
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

  const openCartWorkflow = () => { setWorkflowStep(1); setIsWorkflowOpen(true); };
  const handleProceedToLocation = () => { if (!user) setIsLoginOpen(true); else setWorkflowStep(2); };

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
            <div onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition text-sm font-bold">
               <FiGlobe className="text-lg text-gray-400"/>
               <span>{lang === 'en' ? 'EN' : 'SW'} <FiChevronDown className="inline"/></span>
            </div>
            <div onClick={openCartWorkflow} className="relative cursor-pointer hover:text-[#F2A900] transition flex flex-col items-center">
               <div className="relative border border-gray-700 p-2 rounded-lg bg-gray-800/50">
                 <FiShoppingCart className="text-xl" />
                 {isClient && cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F2A900] text-[#0F172A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B1120]">{cart.length}</span>}
               </div>
               <span className="text-[10px] mt-1 font-medium">Cart</span>
            </div>
            <div className="cursor-pointer hover:text-[#F2A900] transition flex flex-col items-center">
               <div className="border border-gray-700 p-2 rounded-lg bg-gray-800/50"><FiPackage className="text-xl" /></div>
               <span className="text-[10px] mt-1 font-medium">{t.trackOrder}</span>
            </div>
            <div onClick={() => { if(user) router.push('/profile'); else setIsLoginOpen(true); }} className="flex items-center gap-2 border border-gray-700 p-2 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800 transition">
               <FiUser className="text-lg text-gray-400"/>
               <span className="text-sm font-bold">{user ? user.name.split(' ')[0] : t.myAccount}</span>
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

          {/* MAIN HERO BANNER (Static - Does not Auto-Slide) */}
          <div className="relative w-full h-[200px] sm:h-[300px] md:rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D384D] to-[#165673] text-white flex flex-col justify-center px-6 sm:px-12 shadow-sm mb-4 md:mb-6">
             {activeBanners.map((banner, index) => (
                <div 
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-500 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white
                  ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-2 sm:mb-4 tracking-tight leading-tight max-w-[70%] lg:max-w-[50%]">{banner.title}</h1>
                  <p className="text-xs sm:text-base lg:text-lg font-medium mb-4 sm:mb-8 opacity-90 max-w-[80%] lg:max-w-[50%] leading-relaxed">{banner.subtitle}</p>
                  <button onClick={() => { setActiveCategory(banner.categoryTarget); if (categoriesRef.current) categoriesRef.current.scrollIntoView({ behavior: 'smooth' }); }} className="bg-[#F2A900] text-[#0F172A] font-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg w-max hover:bg-yellow-500 transition shadow-lg flex items-center gap-2 text-xs sm:text-sm">
                      {banner.buttonText} <FiChevronRight />
                  </button>
                </div>
             ))}
             
             {/* Manual Nav Arrows */}
             <button onClick={prevBanner} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm z-20 transition"><FiArrowLeft size={20} /></button>
             <button onClick={nextBanner} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm z-20 transition"><FiArrowRight size={20} /></button>
             
             {/* Pagination Dots */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {activeBanners.map((_, idx) => (
                  <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-2 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-6 bg-[#F2A900]' : 'w-2 bg-white/50'}`}></div>
                ))}
             </div>
          </div>

          {/* TRUST BADGES (Desktop Row) */}
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
          <div ref={categoriesRef} className="bg-white md:rounded-2xl md:shadow-sm md:border border-gray-100 p-0 md:p-6 mb-6 pt-4 md:pt-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-4 md:px-0 border-b border-gray-100 md:border-0 pb-3 md:pb-0">
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

             {/* Products Grid */}
             {fetchError ? (
               <div className="p-6 bg-red-50 text-red-600 rounded-xl text-center"><FiAlertCircle className="mx-auto text-2xl mb-2"/>{fetchError}</div>
             ) : isLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 md:px-0">
                  <SkeletonCard/><SkeletonCard/><SkeletonCard/><SkeletonCard/>
               </div>
             ) : displayedProducts.length === 0 ? (
               <div className="p-12 text-center text-gray-400 font-bold border border-dashed rounded-xl m-4 md:m-0">
                  <FiBox className="text-5xl mx-auto mb-3 text-gray-300"/>
                  {activeCategory === 'All' ? t.noProducts : t.noCategoryProducts}
                  {activeCategory !== 'All' && <button onClick={() => setActiveCategory('All')} className="mt-3 text-[#0F8A99] underline">View All Products</button>}
               </div>
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 md:px-0 animate-fade-in">
                  {displayedProducts.map(product => <ProductCard key={product.id} product={product} />)}
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
      <FloatingWhatsApp />
      
      {/* MOBILE BOTTOM NAVIGATION (Matches Mockup without loading old mockups) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 px-2 pb-1 z-50">
        <button className="flex flex-col items-center gap-1 w-16 text-[#F2A900]">
          <FiHome className="text-xl" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => { if(categoriesRef.current) categoriesRef.current.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900">
          <FiGrid className="text-xl" />
          <span className="text-[9px] font-bold">Categories</span>
        </button>
        
        {/* CENTER BIG BUTTON */}
        <div className="relative -top-5">
           <div className="w-14 h-14 bg-[#0F8A99] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white cursor-pointer hover:bg-[#0D707C] transition">
              <FiMessageCircle className="text-2xl" />
           </div>
           <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600">Message</span>
        </div>

        <button onClick={openCartWorkflow} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900 relative">
          <div className="relative">
             <FiShoppingCart className="text-xl" />
             {isClient && cart.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#F2A900] text-[#0F172A] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </div>
          <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => { if(user) router.push('/profile'); else setIsLoginOpen(true); }} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900">
          <FiUser className="text-xl" />
          <span className="text-[9px] font-bold">My Jtex</span>
        </button>
      </div>

      {/* --- MODALS (Voice, Barcode, Image) Remain Unchanged --- */}
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

      {/* LOGIN POPUP WORKFLOW */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex overflow-hidden min-h-[500px] animate-fade-in border border-gray-100">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            <div className="hidden md:flex md:w-1/2 bg-[#0F172A] text-white flex-col justify-center p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F2A900] to-yellow-600"></div>
               <h2 className="text-5xl font-black mb-4">J<span className="text-[#F2A900]">tex</span></h2>
               <p className="text-lg font-medium text-gray-400 mb-8">{t.signIn} and Checkout seamlessly.</p>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl mb-6">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>{t.signIn}</button>
                <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>{t.register}</button>
              </div>
              {loginError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs rounded-lg font-bold mb-4">{loginError}</div>}
              <form onSubmit={authMode === 'login' ? handleInlineLogin : handleInlineRegister} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <input type="text" required value={registerName} onChange={e => setRegisterName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:border-[#F2A900]" placeholder="Full Name" />
                    <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:border-[#F2A900]" placeholder="Phone Number" />
                  </>
                )}
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:border-[#F2A900]" placeholder="Email Address" />
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:border-[#F2A900]" placeholder="Password" />
                <button type="submit" className="w-full bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500 font-black py-3.5 rounded-xl text-sm mt-2 transition">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT WORKFLOW MODAL */}
      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm pb-16">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in border border-gray-200">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 z-20 p-2 rounded-full transition text-gray-500 hover:text-gray-900 bg-gray-100"><FiX size={20} /></button>
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between sm:justify-center sm:gap-12 relative">
              {['Cart', 'Shipping', 'Payment', 'Done'].map((step, idx) => (
                <div key={step} className={`flex flex-col items-center z-10 ${workflowStep >= idx + 1 ? 'text-[#0F172A]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mb-2 transition-all ${workflowStep >= idx + 1 ? 'bg-[#F2A900] text-[#0F172A] shadow-md ring-4 ring-yellow-100' : 'bg-gray-200'}`}>
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
                        <FiShoppingCart className="text-6xl mx-auto mb-4 opacity-50" />
                        <p className="font-bold text-lg">{t.emptyCart}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-8">
                          {cart.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 rounded-lg border bg-white border-gray-200 flex items-center justify-center text-xl shadow-sm">
                                  {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="object-contain w-full h-full mix-blend-multiply" /> : item.imageEmoji || '📦'}
                                </div>
                                <div>
                                  <p className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-black text-[#F2A900]">{item.quantity}</span></p>
                                </div>
                              </div>
                              <span className="font-black text-sm sm:text-base text-[#0F172A]">TZS {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl border border-gray-100 mb-6 bg-gray-50">
                          <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
                          <span className="text-xl sm:text-2xl font-black text-[#0F172A]">TZS {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={handleProceedToLocation} className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
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
                           <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition" placeholder="e.g. Dar es Salaam" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.zip}</label>
                           <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition" placeholder="e.g. 11000" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.street}</label>
                         <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900] transition" placeholder="e.g. Makumbusho, House 42" />
                       </div>
                     </div>
                     <div className="mt-8 flex gap-3">
                       <button onClick={() => setWorkflowStep(1)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                       <button onClick={() => { if(city && streetAddress) setWorkflowStep(3); else alert('Please fill in City and Street Address'); }} className="flex-1 bg-[#0F172A] hover:bg-gray-800 text-white font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
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
                     <div onClick={() => setPaymentMethod('Card')} className={`border-2 p-3 sm:p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Card' ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiCreditCard className="text-xl sm:text-2xl" /><span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">Card</span>
                     </div>
                     <div onClick={() => setPaymentMethod('M-Pesa')} className={`border-2 p-3 sm:p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'M-Pesa' ? 'border-red-600 bg-red-600 text-white shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiSmartphone className="text-xl sm:text-2xl" /><span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">M-Pesa</span>
                     </div>
                     <div onClick={() => setPaymentMethod('Raha')} className={`border-2 p-3 sm:p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all ${paymentMethod === 'Raha' ? 'border-[#F2A900] bg-[#F2A900] text-[#0F172A] shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                       <FiGlobe className="text-xl sm:text-2xl" /><span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">Raha</span>
                     </div>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 space-y-3">
                     <div className="flex justify-between text-sm font-medium text-gray-500"><span>Subtotal</span><span className="text-gray-800">TZS {cartTotal.toLocaleString()}</span></div>
                     <div className="flex justify-between text-sm font-medium text-gray-500"><span>{t.deliveryFee}</span><span className="text-gray-800">TZS {shippingFee.toLocaleString()}</span></div>
                     {upfrontPayment > 0 && (
                       <div className="flex justify-between text-xs font-bold p-2 rounded-lg mt-2 text-red-600 bg-red-50 border border-red-100">
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
                     <button type="submit" disabled={checkoutLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-2">
                       {checkoutLoading ? 'Processing...' : <><FiLock /> {t.confirmOrder}</>}
                     </button>
                   </div>
                 </form>
               )}

               {workflowStep === 4 && (
                 <div className="text-center py-12 px-4 animate-fade-in max-w-md mx-auto">
                   <div className="w-24 h-24 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner ring-8 bg-green-50 ring-green-50/50"><FiCheckCircle /></div>
                   <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Order Successful!</h3>
                   <p className="text-gray-500 mb-8 text-sm leading-relaxed">{t.successMsg}</p>
                   <button onClick={() => { setIsWorkflowOpen(false); router.push('/profile'); }} className="w-full bg-[#0F172A] text-white hover:bg-gray-800 font-black py-4 rounded-xl text-sm transition shadow-lg">
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