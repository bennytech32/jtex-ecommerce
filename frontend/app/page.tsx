'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin, 
  FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, 
  FiSmartphone, FiArrowLeft, FiMoreHorizontal, FiSliders, FiList, FiGrid,
  FiCamera, FiMic, FiMaximize, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiHeart, FiArrowRight, FiClock,
  FiEyeOff, FiEye, FiCalendar, FiStar
} from 'react-icons/fi';

import Footer from './components/common/Footer';

const translations = {
  en: {
    shop: "All Products",
    search: "Search products, categories or brands...",
    filter: "Filters",
    all: "All Categories",
    loading: "Loading store...",
    noProducts: "No products match your search.",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    switchLang: "Badili Kiswahili",
    sort: "Sort by:",
    popular: "Popular",
    lowToHigh: "Low to High",
    highToLow: "High to Low",
    cart: "Cart Review",
    location: "Location",
    payment: "Payment",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Location",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! We've sent an SMS and Email.",
    viewProfile: "View Invoice in My Profile",
    remove: "Remove",
    deliveryFee: "Shipping Fee",
    grandTotal: "Grand Total",
    upfront: "Required Upfront (20%)",
    signIn: "Sign In",
    register: "Create Account",
    clearAll: "Clear All",
    priceRange: "Price Range",
    brand: "Brand",
    itemsFound: "items found",
    browseAll: "Browse all product categories",
    shopByBrand: "Shop by Brand",
    shopByPrice: "Shop by Price",
    topPicks: "Top Picks",
    viewAll: "View All",
    deliverTo: "Deliver to",
    flashSales: "Flash Sales",
    limitedOffers: "Limited time offers - Don't miss out!",
    endsIn: "Ends in:",
    voiceListening: "Listening... Speak now",
    voiceError: "Voice search not supported or microphone denied.",
  },
  sw: {
    shop: "Bidhaa Zote",
    search: "Tafuta bidhaa, kategoria au chapa...",
    filter: "Chujio",
    all: "Kategoria Zote",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa inayofanana na utafutaji wako.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    switchLang: "Switch to English",
    sort: "Panga kwa:",
    popular: "Maarufu",
    lowToHigh: "Kuanzia Chini",
    highToLow: "Kuanzia Juu",
    cart: "Kikapu Chako",
    location: "Mahali",
    payment: "Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Mahali",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! Tumekutumia SMS na Barua Pepe.",
    viewProfile: "Tazama Risiti Kwenye Profaili",
    remove: "Ondoa",
    deliveryFee: "Gharama ya Usafiri",
    grandTotal: "Jumla Kuu",
    upfront: "Kianzio cha Kulipia (20%)",
    signIn: "Ingia Akauntini",
    register: "Jisajili Sasa",
    clearAll: "Futa Zote",
    priceRange: "Kiwango cha Bei",
    brand: "Chapa (Brand)",
    itemsFound: "zimepatikana",
    browseAll: "Vinjari kategoria zote za bidhaa",
    shopByBrand: "Nunua kwa Chapa",
    shopByPrice: "Nunua kwa Bei",
    topPicks: "Chaguo Bora",
    viewAll: "Tazama Zote",
    deliverTo: "Fikisha",
    flashSales: "Mauzo ya Haraka",
    limitedOffers: "Muda maalumu - Usikose!",
    endsIn: "Inaisha:",
    voiceListening: "Inasikiliza... Ongea sasa",
    voiceError: "Mfumo wa sauti haukubaliwi kwenye kivinjari hiki.",
  }
};

const CATEGORY_KEYS = ['Electronics', 'Computers', 'Phones', 'Fashion', 'Home & Kitchen', 'Sports'];

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<'home' | 'deals'>('home');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  const [deliverLocation, setDeliverLocation] = useState('Tanzania, United Republic');
  
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // ================= MODAL STATES =================
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 

  // ================= AUTH FORM STATES =================
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [region, setRegion] = useState('Dar es Salaam');
  const [address, setAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();
  const t = translations[lang];
  const [isClient, setIsClient] = useState(false);

  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';

  const activeBanners = [
    { id: 1, title: "Best Quality,\nBest Prices,\nOnly on Jtex", subtitle: "Shop the latest gadgets, electronics,\nfashion and more at unbeatable prices.", bgColor: "from-[#0A101D] via-[#0F3B4E] to-[#1E5673]", buttonText: t.buyNow, action: () => { setViewMode('home'); setActiveCategory('All'); } },
    { id: 2, title: "New Phones\nIn Town", subtitle: "Order today and get it delivered fast.", bgColor: "from-[#F2A900] to-[#C98A00]", buttonText: "View Phones", action: () => { setViewMode('home'); setActiveCategory('Phones'); } },
    { id: 3, title: "Mega Flash Sale\nUp to 75% OFF", subtitle: "Limited time offer. Don't miss out on amazing deals.", bgColor: "from-purple-900 to-indigo-900", buttonText: "View Deals", action: () => { setViewMode('deals'); } }
  ];

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => { if(data.country_name) setDeliverLocation(data.country_name); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(23, 59, 59, 999);

    const calculateTimeLeft = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if(diff <= 0) return { d: '00', h: '00', m: '00', s: '00' };
      return {
        d: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
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
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchRealProducts = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/products`);
        const data = await res.json();
        const availableProducts = data.filter((p: any) => p.stockQuantity > 0);
        
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
        
        const uniqueCategories = Array.from(new Set(availableProducts.map((p: any) => p.category)));
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Kosa kuvuta bidhaa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      const catFiltered = result.filter(p => {
        const pCat = p.category ? p.category.toLowerCase() : '';
        const tCat = activeCategory.toLowerCase();
        return pCat.includes(tCat) || tCat.includes(pCat);
      });
      if (catFiltered.length > 0) result = catFiltered;
      else result = products;
    }
    
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortOrder === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high') result = [...result].sort((a, b) => b.price - a.price);
    
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, sortOrder, products]);

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
      const res = await fetch(`${getApiUrl()}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error);
    } catch (err) { setLoginError('Kosa la kimtandao.'); }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      const res = await fetch(`${getApiUrl()}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, phone: registerPhone, email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error);
    } catch (err) { setLoginError('Kosa la kimtandao.'); }
  };

  const openCartWorkflow = () => { setSelectedProduct(null); setWorkflowStep(1); setIsWorkflowOpen(true); };
  const handleProceedToLocation = () => { if (!user) setIsLoginOpen(true); else setWorkflowStep(2); };

  const shippingFee = region === 'Dar es Salaam' ? 0 : 10000;
  const grandTotal = cartTotal + shippingFee;
  const upfrontPayment = region === 'Dar es Salaam' ? 0 : grandTotal * 0.2;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    const checkoutItems = cart.map(item => ({ productId: item.id, quantity: item.quantity, unitPrice: item.price, subTotal: item.price * item.quantity }));
    try {
      const res = await fetch(`${getApiUrl()}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, deliveryRegion: region, address, paymentMethod: 'COD', shippingFee, upfrontPayment, items: checkoutItems })
      });
      if (res.ok) { setWorkflowStep(4); clearCart(); }
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  const handleBuyNow = (product: any) => {
    setSelectedProduct(null);
    addToCart(product); 
    setWorkflowStep(1);
    setIsWorkflowOpen(true);
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

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

  // REUSABLE PRODUCT CARD (Kawaida - Home)
  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer relative" onClick={() => setSelectedProduct(product)}>
        <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100">
          <FiHeart className={`text-xs ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {discount > 0 && <span className="absolute top-3 left-3 bg-[#0F3B4E] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">-{discount}%</span>}
        
        <div className="w-full aspect-square bg-[#F8FAFC] rounded-lg mb-2 overflow-hidden flex items-center justify-center p-2">
          {product.imageUrl ? (
            <img src={`${getApiUrl()}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full mix-blend-multiply" />
          ) : (
            <span className="text-4xl">{product.imageEmoji || '📦'}</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2 min-h-[30px]">{product.name}</h3>
          <div className="mt-auto flex flex-col">
            <span className="text-xs font-black text-[#0F172A]">TZS {product.price.toLocaleString()}</span>
            {product.oldPrice && <span className="text-[9px] text-gray-400 line-through mt-0.5">TZS {product.oldPrice.toLocaleString()}</span>}
            <div className="flex items-center justify-between mt-2">
               <div className="flex items-center text-[#F2A900] text-[8px]">
                 ★★★★★ <span className="text-gray-400 ml-1 font-medium">(32)</span>
               </div>
               <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-6 h-6 border border-gray-200 text-gray-600 rounded flex items-center justify-center hover:border-[#0F172A]"><FiShoppingCart size={12}/></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // REUSABLE DEALS PRODUCT CARD (Kama kwenye picha ya Flash Sales)
  const DealsProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 25;
    const soldAmount = Math.max(15, 100 - (product.stockQuantity || 0) * 2);
    const soldPercentage = Math.min(95, soldAmount);

    return (
      <div className="bg-[#0A101D] rounded-xl p-3 border border-gray-800 flex flex-col h-full cursor-pointer relative" onClick={() => setSelectedProduct(product)}>
        <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-3 right-3 z-20 text-gray-500 hover:text-red-500">
          <FiHeart className={`text-sm ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        <div className="flex items-center gap-2 absolute top-3 left-3 z-10">
           <span className="bg-[#F2A900] text-[#0A101D] text-[9px] font-black px-1.5 py-0.5 rounded">-{discount}%</span>
           {soldPercentage > 80 && <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Best Seller</span>}
        </div>
        
        <div className="w-full aspect-square bg-[#0F172A] rounded-lg mb-3 overflow-hidden flex items-center justify-center p-4 mt-6">
          {product.imageUrl ? (
            <img src={`${getApiUrl()}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full" />
          ) : (
            <span className="text-4xl">{product.imageEmoji || '📦'}</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="text-xs font-bold text-gray-200 leading-tight mb-1 line-clamp-2 min-h-[34px]">{product.name}</h3>
          <p className="text-[10px] text-gray-500 mb-1">{product.brand || 'Jtex Authentic'}</p>
          <div className="flex items-center text-[#F2A900] text-[10px] mb-2">
            ★★★★★ <span className="text-gray-500 ml-1 font-medium">(2,456)</span>
          </div>
          
          <div className="mt-auto flex flex-col">
            <span className="text-sm font-black text-white">TZS {product.price.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 line-through mt-0.5">TZS {product.oldPrice ? product.oldPrice.toLocaleString() : (product.price * 1.3).toLocaleString()}</span>
            
            <div className="mt-3 mb-3">
               <div className="flex justify-between text-[9px] mb-1 text-gray-400">
                  <span>{soldAmount} sold</span>
               </div>
               <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-600 to-[#F2A900] rounded-full" style={{ width: `${soldPercentage}%` }}></div>
               </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-3">
               <div className="text-[10px] font-mono text-gray-400 tracking-wider">
                 {timeLeft.d} : {timeLeft.h} : {timeLeft.m} : {timeLeft.s}
               </div>
               <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-7 h-7 bg-[#1E293B] hover:bg-[#F2A900] hover:text-[#0A101D] text-gray-300 rounded flex items-center justify-center transition"><FiShoppingCart size={12}/></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${viewMode === 'deals' ? 'bg-[#050B14]' : 'bg-white'} font-sans antialiased transition-colors duration-300`}>
      
      {/* ========================================================= */}
      {/* MOBILE TOP HEADER (KWA VIEW ZOTE) */}
      {/* ========================================================= */}
      <header className={`md:hidden sticky top-0 z-40 px-4 py-3 shadow-sm pb-0 ${viewMode === 'deals' ? 'bg-[#0A101D] border-b border-gray-800' : 'bg-white'}`}>
        
        {viewMode === 'deals' ? (
           <div className="flex items-center gap-3 pb-3 pt-1">
             <button onClick={() => setViewMode('home')} className="text-gray-400 hover:text-white p-1"><FiArrowLeft size={22}/></button>
             <h1 className="text-xl font-black text-white tracking-wide">Flash Sales</h1>
           </div>
        ) : (
           <>
             {/* Search Bar Row */}
             <div className="flex items-center gap-3">
               <div className="flex-1 flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-11 focus-within:border-[#F2A900] transition-colors">
                 <div className="pl-3 flex items-center text-gray-400"><FiSearch size={16}/></div>
                 <input 
                   type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                   placeholder="Search Jtex" className="flex-1 px-2 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400" 
                 />
                 <div className="flex items-center pr-2 gap-2 text-gray-400">
                    <button onClick={startVoiceSearch}><FiMic size={16}/></button>
                    <button onClick={() => setIsImageSearchOpen(true)}><FiCamera size={16}/></button>
                 </div>
                 <button className="bg-[#F2A900] px-4 flex items-center justify-center text-white font-bold"><FiSearch size={18}/></button>
               </div>
             </div>

             {/* Categories Horizontal Scroll */}
             <div className="flex items-center gap-6 mt-3 text-xs font-bold text-gray-500 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button onClick={() => setActiveCategory('All')} className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeCategory === 'All' ? 'border-[#0F3B4E] text-[#0F3B4E]' : 'border-transparent hover:text-gray-900'}`}>All</button>
                {CATEGORY_KEYS.map((cat) => (
                   <button key={cat} onClick={() => setActiveCategory(cat)} 
                   className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeCategory === cat ? 'border-[#0F3B4E] text-[#0F3B4E]' : 'border-transparent hover:text-gray-900'}`}>
                      {cat}
                   </button>
                ))}
             </div>
           </>
        )}
      </header>

      {/* ========================================================= */}
      {/* DESKTOP HEADER (KWA VIEW ZOTE) */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-col">
         <header className="bg-[#0A101D] text-white h-[72px] items-center px-8 sticky top-0 z-50 shadow-md flex">
           <div className="flex items-center gap-2 cursor-pointer w-[200px]" onClick={() => { setViewMode('home'); router.push('/'); }}>
              <div className="flex text-2xl font-black italic tracking-tighter">
                <span className="text-blue-500">J</span><span className="text-orange-500">t</span><span className="text-white">ex</span>
              </div>
           </div>
           
           <div className="flex-1 flex justify-center px-8">
              <div className="w-full max-w-2xl flex bg-white rounded-md overflow-hidden h-10 shadow-sm focus-within:ring-2 focus-within:ring-[#F2A900]/50 transition-all">
                 <div className="bg-gray-100 border-r border-gray-200 text-gray-700 px-3 py-2 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-200 transition">All <FiChevronDown/></div>
                 <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, brands..." className="flex-1 px-4 text-sm outline-none text-gray-900 placeholder-gray-400" />
                 <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0A101D] hover:bg-yellow-500 transition"><FiSearch className="text-xl font-bold" /></button>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div onClick={openCartWorkflow} className="flex flex-col items-center cursor-pointer hover:text-[#F2A900] transition relative group">
                 <div className="relative border border-gray-700 p-2 rounded-lg bg-gray-800/50 group-hover:border-gray-500 transition">
                    <FiShoppingCart className="text-xl" />
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F2A900] text-[#0A101D] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A101D]">{cart.length}</span>}
                 </div>
                 <span className="text-[10px] mt-1 font-bold">Cart</span>
              </div>
              <div onClick={() => { if(user) router.push('/profile'); else setIsLoginOpen(true); }} className="flex items-center gap-2 cursor-pointer border border-gray-700 py-1.5 px-3 rounded-full hover:bg-gray-800 transition">
                 <FiUser className="text-xl text-gray-400" />
                 <div className="flex flex-col leading-none">
                    <span className="text-[9px] text-gray-400">{user ? 'Welcome back' : 'Hello, Sign In'}</span>
                    <span className="text-xs font-bold flex items-center gap-1 mt-0.5">{user ? user.name.split(' ')[0] : 'My Account'} <FiChevronDown className="text-gray-500"/></span>
                 </div>
              </div>
           </div>
         </header>
      </div>

      <main className="max-w-[1920px] mx-auto flex flex-col md:flex-row pb-20 md:pb-8 md:pt-6 gap-6 px-0 md:px-6 lg:px-8">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-[240px] flex-shrink-0 flex-col">
           <div className={`rounded-xl shadow-sm border p-3 mb-6 ${viewMode === 'deals' ? 'bg-[#0A101D] border-gray-800' : 'bg-white border-gray-100'}`}>
              <nav className={`flex flex-col gap-1 text-sm font-bold ${viewMode === 'deals' ? 'text-gray-400' : 'text-gray-600'}`}>
                 <button onClick={() => { setViewMode('home'); setActiveCategory('All'); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'home' ? 'bg-gray-50 text-[#0F172A]' : 'hover:bg-gray-800 hover:text-white'}`}>
                    <FiHome className={`text-lg ${viewMode === 'home' ? 'text-gray-900' : ''}`}/> Home
                 </button>
                 <button onClick={() => setViewMode('deals')} className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${viewMode === 'deals' ? 'bg-gradient-to-r from-purple-900/40 to-transparent text-purple-400 border-l-4 border-purple-500' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3"><FiZap className={`text-lg ${viewMode === 'deals' ? 'fill-current' : 'text-gray-400'}`}/> Flash Sales</div>
                    <span className="bg-[#F2A900] text-[#0A101D] text-[9px] px-1.5 py-0.5 rounded font-black">HOT</span>
                 </button>
                 <button onClick={() => { setViewMode('home'); setActiveCategory('All'); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'deals' ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-50'}`}><FiGrid className="text-lg text-gray-400"/> Categories</button>
                 <button onClick={() => router.push('/profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'deals' ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-50'}`}><FiPackage className="text-lg text-gray-400"/> Orders</button>
                 <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'deals' ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-50'}`}><FiHeart className="text-lg text-gray-400"/> Wishlist</button>
                 <div className={`border-t my-2 mx-2 ${viewMode === 'deals' ? 'border-gray-800' : 'border-gray-100'}`}></div>
                 <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'deals' ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-50'}`}><FiHeadphones className="text-lg text-gray-400"/> Support</button>
              </nav>
           </div>
        </div>

        {/* MAIN CONTENT DIVIDER */}
        <div className="flex-1 w-full flex flex-col min-w-0">
           
           {/* ======================================================= */}
           {/* CONTENT: HOME VIEW                                      */}
           {/* ======================================================= */}
           {viewMode === 'home' && (
             <div className="animate-fade-in px-4 md:px-0">
               {/* Delivery Pill (Mobile Only) */}
               <div className="md:hidden flex items-center gap-2 text-[10px] font-bold bg-[#F8FAFC] border border-gray-100 p-2.5 rounded-xl text-gray-600 mb-4 mt-2">
                   <FiMapPin className="text-gray-400 text-sm"/>
                   <span className="truncate flex-1">Deliver to {deliverLocation}...</span>
                   <FiChevronDown className="text-gray-400"/>
               </div>

               {/* Top Trust Badges (Pre-Banner - Mobile Only) */}
               <div className="md:hidden flex gap-2 mb-4">
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                     <div className="bg-[#0F3B4E] text-white p-1.5 rounded-md"><FiTruck size={14}/></div>
                     <p className="text-[8px] font-black leading-tight text-gray-800">FREE shipping<br/><span className="text-gray-500 font-normal">on your first order</span></p>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                     <div className="bg-[#F2A900] text-white p-1.5 rounded-md"><FiShield size={14}/></div>
                     <p className="text-[8px] font-black leading-tight text-gray-800">Money-back protection<br/><span className="text-gray-500 font-normal">for up to 60 days</span></p>
                  </div>
               </div>

               {/* Mobile Hero Banner */}
               <div className="relative w-full h-[170px] md:h-[340px] rounded-xl overflow-hidden shadow-sm mb-4 bg-[#0A101D]">
                 {activeBanners.map((banner, index) => (
                   <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-5 md:px-16 text-white ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                      <h2 className="text-[22px] md:text-5xl font-black mb-1 md:mb-4 leading-tight whitespace-pre-line max-w-[70%] tracking-tight">{banner.title}</h2>
                      <div className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2 hidden md:block">
                         <span className="text-blue-400">J</span><span className="text-white">tex</span>
                      </div>
                      <p className="text-[8px] md:text-base font-medium mb-3 md:mb-6 opacity-90 whitespace-pre-line max-w-[60%]">{banner.subtitle}</p>
                      <button onClick={banner.action} className="bg-[#F2A900] text-[#0F172A] text-[10px] md:text-sm font-black px-4 md:px-8 py-1.5 md:py-3.5 rounded-full shadow-md w-max flex items-center gap-1 hover:bg-yellow-500 transition">{banner.buttonText} <FiArrowRight size={14} className="hidden md:inline"/><FiChevronRight size={10} className="md:hidden"/></button>
                   </div>
                 ))}
                 <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
                    {activeBanners.map((_, idx) => (
                      <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-1.5 md:h-2 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-4 md:w-6 bg-[#F2A900]' : 'w-1.5 md:w-2 bg-white/50'}`}></div>
                    ))}
                 </div>
               </div>

               {/* Trust Features (Post Banner Grid - Mobile) */}
               <div className="md:hidden flex justify-between items-start pt-2 pb-4 mb-2 border-b border-gray-50">
                  <div className="flex flex-col items-center text-center w-1/4"><FiTruck className="text-gray-600 text-lg mb-1.5"/><span className="text-[8px] font-black text-gray-800 leading-tight">Free Delivery<br/><span className="text-[7px] text-gray-500 font-normal">On orders over TZS 50,000</span></span></div>
                  <div className="flex flex-col items-center text-center w-1/4"><FiShield className="text-gray-600 text-lg mb-1.5"/><span className="text-[8px] font-black text-gray-800 leading-tight">Secure Payment<br/><span className="text-[7px] text-gray-500 font-normal">100% secure payments</span></span></div>
                  <div className="flex flex-col items-center text-center w-1/4"><FiCheckCircle className="text-gray-600 text-lg mb-1.5"/><span className="text-[8px] font-black text-gray-800 leading-tight">Easy Returns<br/><span className="text-[7px] text-gray-500 font-normal">7 days return policy</span></span></div>
                  <div className="flex flex-col items-center text-center w-1/4"><FiHeadphones className="text-gray-600 text-lg mb-1.5"/><span className="text-[8px] font-black text-gray-800 leading-tight">24/7 Support<br/><span className="text-[7px] text-gray-500 font-normal">We are here to help</span></span></div>
               </div>

               {/* Trust Badges Desktop */}
               <div className="hidden md:flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 mb-8">
                   <div className="flex items-center gap-4"><FiTruck className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">FREE Delivery</span><span className="text-xs text-gray-500 mt-1">on orders over TZS 50,000</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiShield className="text-4xl text-[#F2A900]"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">Money-back Guarantee</span><span className="text-xs text-gray-500 mt-1">for up to 60 days</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiLock className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">Secure Payment</span><span className="text-xs text-gray-500 mt-1">100% secure payments</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiHeadphones className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">24/7 Support</span><span className="text-xs text-gray-500 mt-1">We are here to help</span></div></div>
               </div>

               {/* Flash Sales Header */}
               <div className="flex items-center justify-between mb-3 md:mb-6">
                  <div className="flex items-center gap-1.5 md:gap-3">
                     <FiZap className="text-[#F2A900] text-lg md:text-3xl fill-[#F2A900]" />
                     <h2 className="text-sm md:text-2xl font-black text-gray-900">{t.flashSales}</h2>
                     <span className="text-[8px] md:text-sm text-gray-500 font-medium ml-1 md:ml-2 leading-tight">Limited time offers - Don't miss out!</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-6">
                     <div className="flex items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-bold text-gray-600">
                        <span>{t.endsIn}</span>
                        <div className="flex gap-1 md:gap-1.5 items-center">
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] md:bg-[#0F172A] text-white text-[10px] md:text-sm font-bold px-1.5 md:px-2.5 py-1 md:py-1.5 rounded">{timeLeft.h}</span><span className="text-[6px] md:text-[8px] text-gray-500 mt-0.5 uppercase">Hrs</span></div>
                           <span className="text-xs md:text-xl font-bold pb-2 text-gray-400 md:text-gray-900">:</span>
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] md:bg-[#0F172A] text-white text-[10px] md:text-sm font-bold px-1.5 md:px-2.5 py-1 md:py-1.5 rounded">{timeLeft.m}</span><span className="text-[6px] md:text-[8px] text-gray-500 mt-0.5 uppercase">Mins</span></div>
                           <span className="text-xs md:text-xl font-bold pb-2 text-gray-400 md:text-gray-900">:</span>
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] md:bg-[#0F172A] text-white text-[10px] md:text-sm font-bold px-1.5 md:px-2.5 py-1 md:py-1.5 rounded">{timeLeft.s}</span><span className="text-[6px] md:text-[8px] text-gray-500 mt-0.5 uppercase">Secs</span></div>
                        </div>
                     </div>
                     <button onClick={() => setViewMode('deals')} className="text-blue-600 font-bold text-[10px] md:text-sm hover:underline flex items-center gap-1">View All <FiChevronRight size={12}/></button>
                  </div>
               </div>

               {/* Products (Horizontal on Mobile, Grid on PC) */}
               <div className="md:hidden flex overflow-x-auto hide-scrollbar gap-3 pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                   {filteredProducts.length === 0 && <div className="text-xs text-gray-500">No products found.</div>}
                   {filteredProducts.slice(0,6).map((product) => (
                     <div key={product.id} className="min-w-[140px] max-w-[140px]">
                       <ProductCard product={product} />
                     </div>
                   ))}
               </div>
               <div className="hidden md:grid grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
                  {filteredProducts.length === 0 && <div className="text-sm text-gray-500 col-span-full">No products found.</div>}
                  {filteredProducts.slice(0,10).map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>

               {/* Secondary Banner: Big Deals */}
               <div className="bg-[#0F3B4E] md:bg-[#0A101D] rounded-xl md:rounded-2xl p-5 md:p-8 text-white relative overflow-hidden shadow-sm mt-2 mb-6 flex flex-col md:flex-row items-center justify-between">
                  <div className="z-10 relative text-center md:text-left w-full md:w-auto">
                     <h3 className="text-sm md:text-xl font-black mb-1">Big Deals on Top Brands</h3>
                     <p className="text-lg md:text-xl font-black text-[#F2A900] mb-3 md:mb-0">Up to 40% Off</p>
                     <button className="bg-[#F2A900] text-[#0F172A] text-[10px] md:text-sm font-black px-4 md:px-5 py-2 md:py-2.5 rounded-lg shadow-md w-max flex items-center gap-1 mx-auto md:mx-0 hover:bg-yellow-500 transition">Shop Now <FiChevronRight className="md:hidden" size={10}/><FiArrowRight className="hidden md:inline"/></button>
                  </div>
                  <div className="hidden md:flex items-center gap-6 md:gap-10 flex-wrap justify-center opacity-80 border-l border-gray-800 pl-10 z-10">
                     <span className="font-black text-2xl bg-white text-black px-2 rounded">MI</span>
                     <span className="font-black text-xl tracking-widest">SAMSUNG</span>
                     <span className="font-black text-3xl"></span>
                     <span className="font-black text-3xl italic bg-white text-blue-900 rounded-full w-10 h-10 flex items-center justify-center">hp</span>
                     <span className="font-black text-xl tracking-widest">SONY</span>
                  </div>
                  <div className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 text-7xl md:text-9xl opacity-30 md:opacity-10 transform -rotate-12">🎁</div>
               </div>

               {/* Top Brands Mobile */}
               <div className="md:hidden mb-2">
                  <div className="flex justify-between items-end mb-4">
                     <div>
                       <h3 className="font-black text-gray-900 text-sm">Top Brands, Top Quality</h3>
                       <p className="text-[9px] text-gray-500">Shop your favorite brands</p>
                     </div>
                     <button className="bg-[#0F3B4E] text-white text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">View All Brands <FiChevronRight size={10}/></button>
                  </div>
                  <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar pb-2 pt-1 opacity-90 text-gray-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                     <span className="font-black text-2xl tracking-tighter bg-gray-900 text-white px-2 rounded-sm leading-none">MI</span>
                     <span className="font-black text-xl tracking-widest leading-none">SAMSUNG</span>
                     <span className="font-black text-3xl leading-none"></span>
                     <span className="font-black text-2xl italic bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center leading-none flex-shrink-0">hp</span>
                     <span className="font-black text-xl tracking-widest leading-none">SONY</span>
                     <span className="font-black text-xl font-sans leading-none">Lenovo</span>
                     <span className="font-black text-xs border-2 border-gray-900 rounded-full px-2 py-1 leading-none">DELL</span>
                  </div>
               </div>
             </div>
           )}


           {/* ======================================================= */}
           {/* CONTENT: DEALS / FLASH SALES VIEW (DARK MODE)           */}
           {/* ======================================================= */}
           {viewMode === 'deals' && (
             <div className="animate-fade-in bg-[#050B14] min-h-screen text-white px-4 md:px-0 rounded-2xl md:p-6 overflow-hidden">
                
                {/* Deals Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2 md:mt-0">
                   <div>
                      <h2 className="text-2xl md:text-3xl font-black flex items-center gap-2 mb-1">
                         Mega Flash Sale <span className="bg-[#F2A900] text-[#0A101D] text-xs px-2 py-0.5 rounded-full font-black uppercase shadow-md">Limited</span>
                      </h2>
                      <p className="text-gray-400 text-sm">Limited time. Unbeatable deals!</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-white transition"><FiSearch size={20}/></button>
                      <button className="text-gray-400 hover:text-white transition"><FiFilter size={20}/></button>
                   </div>
                </div>

                {/* Big Timer Banner */}
                <div className="bg-[#0A101D] border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mb-8 relative overflow-hidden shadow-2xl">
                   {/* Background Glow */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                   
                   <div className="z-10 text-center md:text-left mb-6 md:mb-0 w-full md:w-auto">
                      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Flash Sale Ends In</h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 md:gap-6">
                         <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-black text-white bg-gray-900 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-700 shadow-inner">{timeLeft.d}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase font-bold">Days</span>
                         </div>
                         <span className="text-2xl md:text-4xl font-black text-gray-600 pb-5">:</span>
                         <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-black text-white bg-gray-900 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-700 shadow-inner">{timeLeft.h}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase font-bold">Hrs</span>
                         </div>
                         <span className="text-2xl md:text-4xl font-black text-gray-600 pb-5">:</span>
                         <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-black text-[#F2A900] bg-gray-900 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-700 shadow-inner">{timeLeft.m}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase font-bold">Mins</span>
                         </div>
                         <span className="text-2xl md:text-4xl font-black text-gray-600 pb-5">:</span>
                         <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-5xl font-black text-red-500 bg-gray-900 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-700 shadow-inner animate-pulse">{timeLeft.s}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase font-bold">Secs</span>
                         </div>
                      </div>
                      <div className="mt-6">
                         <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                            <div className="bg-gradient-to-r from-[#F2A900] to-red-500 w-[85%] h-full rounded-full"></div>
                         </div>
                         <p className="text-xs text-[#F2A900] font-bold">Hurry up! Limited time offer. Don't miss out!</p>
                      </div>
                   </div>

                   <div className="z-10 flex flex-col items-center justify-center relative">
                      <div className="absolute inset-0 bg-yellow-500/20 blur-[50px] rounded-full"></div>
                      <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#F2A900] to-yellow-700 leading-none">75%</h2>
                      <p className="text-2xl md:text-3xl font-black tracking-widest text-white mt-[-5px]">OFF</p>
                   </div>
                </div>

                {/* Badges Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
                   <div className="bg-[#0A101D] border border-gray-800 rounded-xl p-3 md:p-4 flex items-center gap-3"><FiTruck className="text-[#F2A900] text-xl md:text-2xl" /><div><p className="text-[10px] md:text-xs font-bold text-gray-200">Fast Delivery</p><p className="text-[8px] md:text-[10px] text-gray-500">TZS 100,000+</p></div></div>
                   <div className="bg-[#0A101D] border border-gray-800 rounded-xl p-3 md:p-4 flex items-center gap-3"><FiCheckCircle className="text-[#F2A900] text-xl md:text-2xl" /><div><p className="text-[10px] md:text-xs font-bold text-gray-200">Easy Returns</p><p className="text-[8px] md:text-[10px] text-gray-500">7 Days Return</p></div></div>
                   <div className="bg-[#0A101D] border border-gray-800 rounded-xl p-3 md:p-4 flex items-center gap-3"><FiShield className="text-[#F2A900] text-xl md:text-2xl" /><div><p className="text-[10px] md:text-xs font-bold text-gray-200">Secure Payment</p><p className="text-[8px] md:text-[10px] text-gray-500">100% Safe</p></div></div>
                   <div className="bg-[#0A101D] border border-gray-800 rounded-xl p-3 md:p-4 flex items-center gap-3"><FiStar className="text-[#F2A900] text-xl md:text-2xl" /><div><p className="text-[10px] md:text-xs font-bold text-gray-200">100% Authentic</p><p className="text-[8px] md:text-[10px] text-gray-500">Genuine Products</p></div></div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-800 pb-3 mb-6 overflow-x-auto hide-scrollbar">
                   <button className="text-[#F2A900] border-b-2 border-[#F2A900] pb-3 font-bold text-sm whitespace-nowrap">Promo Products</button>
                   <button className="text-gray-500 hover:text-gray-300 pb-3 font-bold text-sm whitespace-nowrap transition">All Deals</button>
                   <button className="text-gray-500 hover:text-gray-300 pb-3 font-bold text-sm whitespace-nowrap transition">Top Deals</button>
                   <button className="text-gray-500 hover:text-gray-300 pb-3 font-bold text-sm whitespace-nowrap transition">Upcoming</button>
                </div>

                {/* Filter and Sort */}
                <div className="flex justify-between items-center mb-6">
                   <button className="text-gray-400 text-xs font-bold flex items-center gap-2 bg-[#0A101D] px-3 py-1.5 rounded-lg border border-gray-800"><FiFilter/> Filter</button>
                   <div className="text-gray-400 text-xs font-bold flex items-center gap-2">
                      Sort: <span className="text-white">Best Match</span> <FiChevronDown/>
                   </div>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-12">
                   {filteredProducts.length === 0 && <div className="text-gray-500 text-sm col-span-full py-10 text-center">No deals available at the moment.</div>}
                   {filteredProducts.map((product) => (
                      <DealsProductCard key={product.id} product={product} />
                   ))}
                </div>

             </div>
           )}

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (MOCKUP EXACT REPLICA) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[65px] px-2 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button onClick={() => { setViewMode('home'); setActiveCategory('All'); window.scrollTo(0,0); }} className={`flex flex-col items-center gap-1 w-[20%] transition ${viewMode === 'home' ? 'text-[#F2A900]' : 'text-gray-400 hover:text-gray-900'}`}>
          <FiHome className={`text-xl ${viewMode === 'home' ? 'fill-current' : ''}`} />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => { setViewMode('home'); setActiveCategory('All'); }} className={`flex flex-col items-center gap-1 w-[20%] text-gray-400 hover:text-gray-900`}>
          <FiGrid className="text-xl" />
          <span className="text-[9px] font-bold">Categories</span>
        </button>
        
        {/* CENTER FLASH SALES / DEALS BUTTON */}
        <div className="relative -top-5 w-[20%] flex justify-center" onClick={() => { setViewMode('deals'); window.scrollTo(0,0); }}>
           <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white shadow-lg border-[3px] border-white cursor-pointer transition ${viewMode === 'deals' ? 'bg-[#F2A900]' : 'bg-[#0F3B4E] hover:bg-[#0D3040]'}`}>
              <FiZap className={`text-[22px] ${viewMode === 'deals' ? 'fill-white' : ''}`} />
           </div>
           <span className={`absolute -bottom-4 text-[9px] font-bold w-full text-center ${viewMode === 'deals' ? 'text-[#F2A900]' : 'text-gray-500'}`}>Flash Sales</span>
        </div>

        <button onClick={openCartWorkflow} className="flex flex-col items-center gap-1 w-[20%] text-gray-400 hover:text-gray-900 relative">
          <div className="relative">
             <FiShoppingCart className="text-xl" />
             {isClient && cart && cart.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#F2A900] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">{cart.length}</span>}
          </div>
          <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => { if(user) router.push('/profile'); else setIsLoginOpen(true); }} className="flex flex-col items-center gap-1 w-[20%] text-gray-400 hover:text-gray-900">
          <FiUser className="text-xl" />
          <span className="text-[9px] font-bold">My Jtex</span>
        </button>
      </div>


      {/* ======================================================== */}
      {/* INLINE LOGIN & REGISTER MODALS (100% MOCKUP MATCH)         */}
      {/* ======================================================== */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-[#050B14]/90 z-50 flex items-center justify-center p-0 md:p-6 backdrop-blur-sm">
          <div className="bg-[#0A101D] w-full max-w-[1000px] h-full md:h-auto md:max-h-[95vh] md:rounded-3xl shadow-2xl relative flex overflow-hidden flex-col md:flex-row border border-gray-800">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 left-4 md:left-auto md:right-4 z-50 p-2 md:bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-full transition">
               <FiArrowLeft className="md:hidden" size={20} />
               <FiX className="hidden md:block" size={20} />
            </button>

            {/* Left Side Graphic (Desktop Only) */}
            <div className="hidden md:flex w-[45%] bg-[#050B14] relative flex-col justify-center p-10 overflow-hidden border-r border-gray-800">
               {/* Faux Background Elements */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#0F3B4E]/30 to-transparent z-0"></div>
               <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] border-b border-gray-700/30 rounded-[100%] opacity-20 z-0"></div>
               <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-[#F2A900] rounded-full shadow-[0_0_10px_#F2A900] z-0 animate-ping"></div>
               <div className="absolute top-[30%] left-[70%] w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_blue] z-0"></div>
               
               <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-3 text-white">
                     {authMode === 'login' ? 'Welcome Back!' : 'Create Your\nJtex Account'}
                  </h2>
                  <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed max-w-sm">
                     {authMode === 'login' 
                        ? 'Access your orders, track shipments, make payments and enjoy exclusive member benefits.' 
                        : 'Join thousands of smart customers enjoying a seamless shopping and delivery experience.'}
                  </p>

                  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                     <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-900/30 text-blue-500 flex items-center justify-center border border-blue-800/30 shadow-inner"><FiShield size={18}/></div>
                        <div><h4 className="text-xs font-bold text-gray-200 mb-1">{authMode === 'login' ? 'Secure & Safe' : 'Secure & Trusted'}</h4><p className="text-[10px] text-gray-500 leading-tight">Your data is protected with top security</p></div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-900/30 text-green-500 flex items-center justify-center border border-green-800/30 shadow-inner"><FiTruck size={18}/></div>
                        <div><h4 className="text-xs font-bold text-gray-200 mb-1">{authMode === 'login' ? 'Track Orders' : 'Fast & Reliable'}</h4><p className="text-[10px] text-gray-500 leading-tight">Real-time updates on every shipment</p></div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-900/30 text-[#F2A900] flex items-center justify-center border border-yellow-800/30 shadow-inner"><FiCreditCard size={18}/></div>
                        <div><h4 className="text-xs font-bold text-gray-200 mb-1">Easy Payments</h4><p className="text-[10px] text-gray-500 leading-tight">Multiple payment options available</p></div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-900/30 text-purple-500 flex items-center justify-center border border-purple-800/30 shadow-inner"><FiStar size={18}/></div>
                        <div><h4 className="text-xs font-bold text-gray-200 mb-1">{authMode === 'login' ? 'Exclusive Deals' : 'Exclusive Benefits'}</h4><p className="text-[10px] text-gray-500 leading-tight">Special offers for our members</p></div>
                     </div>
                  </div>
               </div>
               
               <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center text-[10px] font-bold text-gray-500 border-t border-gray-800 pt-4 z-10">
                  <span className="flex items-center gap-1"><FiLock/> SSL Encrypted</span>
                  <span className="flex items-center gap-1"><FiShield/> Privacy Protected</span>
                  <span className="flex items-center gap-1"><FiCheckCircle/> Trusted by 50K+</span>
               </div>
            </div>

            {/* Right Side Form */}
            <div className="w-full md:w-[55%] p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar mt-10 md:mt-0">
               
               {/* Mobile Header Logos & Stepper */}
               <div className="md:hidden flex justify-center mb-8 relative">
                  <div className="flex text-3xl font-black italic tracking-tighter">
                    <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
                  </div>
                  <div className="absolute right-0 flex items-center gap-1 border border-gray-700 rounded-lg px-2 py-1 text-[10px] text-gray-400">
                     <FiGlobe/> EN <FiChevronDown/>
                  </div>
               </div>

               {authMode === 'register' && (
                  <div className="md:hidden flex items-center justify-between mb-8 relative px-2">
                     <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-800 -z-10 -translate-y-1/2"></div>
                     <div className="absolute top-1/2 left-0 w-[15%] h-[2px] bg-[#F2A900] -z-10 -translate-y-1/2"></div>
                     <div className="flex flex-col items-center gap-2 bg-[#0A101D] px-2">
                        <div className="w-10 h-10 rounded-full border border-[#F2A900] bg-yellow-900/20 text-[#F2A900] flex items-center justify-center shadow-[0_0_15px_rgba(242,169,0,0.3)]"><FiUser size={18}/></div>
                        <span className="text-[9px] font-bold text-[#F2A900]">Account</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 bg-[#0A101D] px-2">
                        <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800/50 text-gray-500 flex items-center justify-center"><FiMail size={18}/></div>
                        <span className="text-[9px] font-bold text-gray-500">Verify Email</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 bg-[#0A101D] px-2">
                        <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800/50 text-gray-500 flex items-center justify-center"><FiShield size={18}/></div>
                        <span className="text-[9px] font-bold text-gray-500">Security</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 bg-[#0A101D] px-2">
                        <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800/50 text-gray-500 flex items-center justify-center"><FiCheckCircle size={18}/></div>
                        <span className="text-[9px] font-bold text-gray-500">Complete</span>
                     </div>
                  </div>
               )}

               {/* Form Header (Mobile) or Desktop */}
               <div className="mb-6 md:mb-8 text-center md:text-left">
                  <h2 className={`text-2xl md:text-3xl font-black text-white mb-2`}>
                     {authMode === 'login' ? 'Login to Your Account' : (typeof window !== 'undefined' && window.innerWidth < 768 ? 'Create Your Account' : 'Sign Up')}
                  </h2>
                  <p className="text-sm text-gray-400">
                     {authMode === 'login' ? 'Enter your credentials to continue' : 'Fill in your details to create your account'}
                  </p>
               </div>

               {loginError && <div className="p-3 bg-red-900/30 border border-red-800/50 text-red-400 text-xs rounded-xl font-bold mb-6 text-center">{loginError}</div>}

               {/* FORMS */}
               <form onSubmit={authMode === 'login' ? handleInlineLogin : handleInlineRegister} className="space-y-4 md:space-y-5">
                 
                 {/* REGISTER ONLY FIELDS */}
                 {authMode === 'register' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">First Name</label>
                         <div className="relative flex items-center">
                            <FiUser className="absolute left-4 text-gray-500" />
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter your first name" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                         </div>
                      </div>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Last Name</label>
                         <div className="relative flex items-center">
                            <FiUser className="absolute left-4 text-gray-500" />
                            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter your last name" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                         </div>
                      </div>
                      
                      <div className="relative md:col-span-1">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Email Address</label>
                         <div className="relative flex items-center">
                            <FiMail className="absolute left-4 text-gray-500" />
                            <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Enter your email address" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                         </div>
                      </div>
                      <div className="relative md:col-span-1">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Phone Number</label>
                         <div className="relative flex items-center border border-[#1E293B] rounded-xl overflow-hidden focus-within:border-[#F2A900] transition">
                            <div className="flex items-center gap-1.5 bg-[#050B14] pl-3 pr-2 py-3 border-r border-[#1E293B]">
                               <img src="https://flagcdn.com/w20/tz.png" className="w-4 rounded-sm" />
                               <span className="text-white text-sm font-bold">+255</span>
                               <FiChevronDown className="text-gray-500 text-xs"/>
                            </div>
                            <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} placeholder="712 345 678" className="w-full bg-transparent pl-3 pr-4 py-3 text-sm text-white outline-none" />
                         </div>
                      </div>

                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Password</label>
                         <div className="relative flex items-center">
                            <FiLock className="absolute left-4 text-gray-500" />
                            <input type={showPassword ? "text" : "password"} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Create a strong password" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-10 py-3 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500 hover:text-gray-300">
                               {showPassword ? <FiEye/> : <FiEyeOff/>}
                            </button>
                         </div>
                      </div>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Confirm Password</label>
                         <div className="relative flex items-center">
                            <FiLock className="absolute left-4 text-gray-500" />
                            <input type={showPassword ? "text" : "password"} required placeholder="Confirm your password" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-10 py-3 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500 hover:text-gray-300">
                               {showPassword ? <FiEye/> : <FiEyeOff/>}
                            </button>
                         </div>
                      </div>

                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Date of Birth</label>
                         <div className="relative flex items-center border border-[#1E293B] rounded-xl px-4 py-3 focus-within:border-[#F2A900] transition">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <select className="w-full bg-transparent text-sm text-gray-400 outline-none appearance-none cursor-pointer">
                               <option value="">Select your date of birth</option>
                               <option value="1990">1990</option><option value="1995">1995</option>
                            </select>
                            <FiChevronDown className="absolute right-4 text-gray-500 pointer-events-none"/>
                         </div>
                      </div>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Gender</label>
                         <div className="relative flex items-center border border-[#1E293B] rounded-xl px-4 py-3 focus-within:border-[#F2A900] transition">
                            <FiUser className="text-gray-500 mr-2" />
                            <select className="w-full bg-transparent text-sm text-gray-400 outline-none appearance-none cursor-pointer">
                               <option value="">Select your gender</option>
                               <option value="Male">Male</option><option value="Female">Female</option>
                            </select>
                            <FiChevronDown className="absolute right-4 text-gray-500 pointer-events-none"/>
                         </div>
                      </div>

                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Country</label>
                         <div className="relative flex items-center border border-[#1E293B] rounded-xl px-4 py-3 focus-within:border-[#F2A900] transition">
                            <FiGlobe className="text-gray-500 mr-2" />
                            <select className="w-full bg-transparent text-sm text-white outline-none appearance-none cursor-pointer">
                               <option value="Tanzania">Tanzania</option>
                            </select>
                            <FiChevronDown className="absolute right-4 text-gray-500 pointer-events-none"/>
                         </div>
                      </div>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">City</label>
                         <div className="relative flex items-center border border-[#1E293B] rounded-xl px-4 py-3 focus-within:border-[#F2A900] transition">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <select className="w-full bg-transparent text-sm text-gray-400 outline-none appearance-none cursor-pointer">
                               <option value="">Select your city</option>
                               <option value="Dar">Dar es Salaam</option>
                            </select>
                            <FiChevronDown className="absolute right-4 text-gray-500 pointer-events-none"/>
                         </div>
                      </div>
                   </div>
                 )}

                 {/* LOGIN ONLY FIELDS */}
                 {authMode === 'login' && (
                    <>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Email Address</label>
                         <div className="relative flex items-center">
                            <FiMail className="absolute left-4 text-gray-500" />
                            <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Enter your email address" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                         </div>
                      </div>
                      <div className="relative">
                         <label className="block text-xs font-bold mb-1.5 text-gray-400">Password</label>
                         <div className="relative flex items-center">
                            <FiLock className="absolute left-4 text-gray-500" />
                            <input type={showPassword ? "text" : "password"} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-transparent border border-[#1E293B] rounded-xl pl-11 pr-10 py-3 sm:py-3.5 text-sm text-white outline-none focus:border-[#F2A900] transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500 hover:text-gray-300">
                               {showPassword ? <FiEye/> : <FiEyeOff/>}
                            </button>
                         </div>
                      </div>
                    </>
                 )}

                 {/* Checkboxes & Extra Actions */}
                 <div className="flex items-center justify-between text-xs md:text-sm mt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <div className="w-4 h-4 md:w-5 md:h-5 rounded border border-gray-600 group-hover:border-[#F2A900] bg-[#F2A900] flex items-center justify-center transition">
                          <FiCheckCircle className="text-[#0A101D] text-[10px] md:text-xs" />
                       </div>
                       <span className="text-gray-300 font-medium">
                          {authMode === 'login' ? 'Remember me' : <>I agree to the <span className="text-blue-500 font-bold hover:underline">Terms & Conditions</span> and <span className="text-blue-500 font-bold hover:underline">Privacy Policy</span></>}
                       </span>
                    </label>
                    {authMode === 'login' && <button type="button" className="text-blue-500 font-bold hover:underline">Forgot Password?</button>}
                 </div>

                 {/* Submit Button */}
                 <button type="submit" className="w-full bg-gradient-to-r from-[#F2A900] to-yellow-600 text-[#0A101D] font-black py-3.5 sm:py-4 rounded-xl text-sm sm:text-base mt-6 shadow-[0_0_20px_rgba(242,169,0,0.3)] hover:shadow-[0_0_30px_rgba(242,169,0,0.5)] transition flex items-center justify-center gap-2 group">
                    {authMode === 'login' ? 'Login' : 'Create Account'} 
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </button>

              </form>

              {/* Social Login Separator */}
              <div className="flex items-center gap-4 my-6 opacity-60">
                 <div className="flex-1 h-px bg-gray-700"></div>
                 <span className="text-xs text-gray-400 font-medium">{authMode === 'login' ? 'Or continue with' : 'Or sign up with'}</span>
                 <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* Social Buttons */}
              <div className="flex gap-3 mb-8">
                 <button className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl border border-[#1E293B] hover:bg-gray-800 text-xs md:text-sm font-bold text-white transition"><span className="text-red-500 font-black text-lg">G</span> <span className="hidden md:inline">Google</span></button>
                 <button className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl border border-[#1E293B] hover:bg-gray-800 text-xs md:text-sm font-bold text-white transition"><span className="text-2xl leading-none -mt-1.5"></span> <span className="hidden md:inline">Apple</span></button>
                 <button className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl border border-[#1E293B] hover:bg-gray-800 text-xs md:text-sm font-bold text-white transition"><span className="text-blue-500 font-black text-lg">f</span> <span className="hidden md:inline">Facebook</span></button>
              </div>

              {/* Footer Trust Info */}
              <div className="mt-auto">
                 <div className="bg-[#050B14] rounded-xl p-4 md:p-5 flex items-center gap-4 border border-gray-800/50 shadow-inner mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 border border-blue-900/30 flex-shrink-0">
                       <FiShield className="text-xl md:text-2xl" />
                    </div>
                    <div>
                       <h4 className="text-xs md:text-sm font-black text-white mb-0.5">Your {authMode === 'login' ? 'security is our priority' : 'information is 100% secure'}</h4>
                       <p className="text-[10px] md:text-xs text-gray-500 leading-snug">We use {authMode === 'login' ? 'top-level' : 'advanced'} encryption to keep your data safe{authMode === 'register' && ' and will never be shared'}.</p>
                    </div>
                 </div>

                 {/* Toggle Mode */}
                 <div className="text-center">
                    <span className="text-sm font-medium text-gray-400">
                       {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                       <button onClick={() => {setAuthMode(authMode === 'login' ? 'register' : 'login'); setLoginError('');}} className="text-[#F2A900] font-black hover:underline transition">
                          {authMode === 'login' ? 'Sign up now' : 'Login'}
                       </button>
                    </span>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MULTI-STEP WORKFLOW MODAL (Cart -> Location -> Pay)   */}
      {/* ======================================================== */}
      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm pb-20 md:pb-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in border border-gray-200">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between sm:justify-center sm:gap-12 relative">
               {['Cart', 'Shipping', 'Payment', 'Done'].map((step, idx) => (
                 <div key={step} className={`flex flex-col items-center flex-1 sm:flex-none z-10 ${workflowStep >= idx + 1 ? 'text-[#0F172A]' : 'text-gray-400'}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 transition-all ${workflowStep >= idx + 1 ? 'bg-[#F2A900] text-black shadow-md ring-4 ring-yellow-50' : 'bg-gray-200'}`}>{workflowStep > idx + 1 ? <FiCheckCircle /> : idx + 1}</div>
                   <span className="text-[10px] sm:text-xs font-bold uppercase">{step}</span>
                 </div>
               ))}
            </div>
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white">
              {workflowStep === 1 && (
                <div className="max-w-xl mx-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black text-gray-900">{t.cart}</h3>
                     {cart.length > 0 && (<button onClick={clearCart} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition flex items-center gap-2"><FiTrash2 /> Clear Cart</button>)}
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 font-bold"><FiShoppingCart className="text-6xl mx-auto mb-4 opacity-50" /><p>{t.emptyCart}</p></div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 border border-gray-100 rounded-xl bg-gray-50 hover:border-gray-200 transition">
                          <div className="w-14 h-14 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                            {item.imageUrl ? <img src={`${getApiUrl()}${item.imageUrl}`} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-2xl">{item.imageEmoji}</span>}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Qty: <span className="font-black text-[#F2A900]">{item.quantity}</span></p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-[#0F172A]">TZS {(item.price * item.quantity).toLocaleString()}</p>
                             <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-500 mt-1 uppercase hover:underline">{t.remove}</button>
                          </div>
                        </div>
                      ))}
                      <div className="border border-gray-100 bg-gray-50 p-4 rounded-xl mt-6 flex justify-between items-center"><span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subtotal:</span><span className="text-xl sm:text-2xl font-black text-gray-900">TZS {cartTotal.toLocaleString()}</span></div>
                      <button onClick={handleProceedToLocation} className="w-full bg-[#0A101D] hover:bg-gray-800 text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition shadow-lg">{t.proceedLocation} <FiChevronRight /></button>
                    </div>
                  )}
                </div>
              )}
              {workflowStep === 2 && (
                <div className="max-w-xl mx-auto animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><FiMapPin className="text-[#F2A900]"/> {t.location}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Region</label>
                      <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#F2A900]">
                        <option value="Dar es Salaam">Dar es Salaam (Free Delivery)</option><option value="Mwanza">Mwanza (+ TZS 10,000)</option><option value="Arusha">Arusha (+ TZS 10,000)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Address</label>
                      <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F2A900]" placeholder="Example: Kinondoni, Mkwajuni" />
                    </div>
                    <div className="flex gap-3 pt-4">
                       <button onClick={() => setWorkflowStep(1)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                       <button onClick={() => { if(region && address) setWorkflowStep(3); else alert('Please fill in Region and Full Address'); }} disabled={!address} className="flex-1 bg-[#0A101D] disabled:bg-gray-300 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg">{t.proceedPayment} <FiChevronRight /></button>
                    </div>
                  </div>
                </div>
              )}
              {workflowStep === 3 && (
                <form onSubmit={handlePlaceOrder} className="max-w-xl mx-auto animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><FiShield className="text-green-500"/> {t.payment}</h3>
                  <div className="bg-[#F2A900]/10 border border-[#F2A900] rounded-xl p-4 mb-6"><p className="font-bold text-gray-900 text-sm">Pay On Delivery (COD)</p><p className="text-xs text-gray-600 mt-1">Pay when you receive the product.</p></div>
                  <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 font-medium"><span>{t.deliveryFee}</span><span>TZS {shippingFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg sm:text-xl font-black text-gray-900 border-t border-gray-200 pt-3"><span>{t.grandTotal}</span><span>TZS {grandTotal.toLocaleString()}</span></div>
                    {upfrontPayment > 0 && (<div className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center mt-4"><span className="block text-xs font-black text-red-600 uppercase">{t.upfront}</span><span className="font-black text-red-600 text-base">TZS {upfrontPayment.toLocaleString()}</span></div>)}
                  </div>
                  <div className="flex gap-3 mt-6">
                     <button type="button" onClick={() => setWorkflowStep(2)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                     <button type="submit" disabled={checkoutLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2">{checkoutLoading ? 'Processing...' : <><FiLock /> {t.confirmOrder}</>}</button>
                  </div>
                </form>
              )}
              {workflowStep === 4 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><FiCheckCircle className="text-6xl text-green-500 animate-bounce" /></div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Order Successful!</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">{t.successMsg}</p>
                  <button onClick={() => router.push('/profile')} className="w-full max-w-sm mx-auto bg-[#0A101D] hover:bg-gray-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg"><FiUser /> {t.viewProfile}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}