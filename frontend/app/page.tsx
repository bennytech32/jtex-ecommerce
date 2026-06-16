'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin, 
  FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, 
  FiSmartphone, FiArrowLeft, FiMoreHorizontal, FiSliders, FiList, FiGrid,
  FiCamera, FiMic, FiMaximize, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiHeart, FiArrowRight
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Electronics');
  const [sortOrder, setSortOrder] = useState('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  const [deliverLocation, setDeliverLocation] = useState('Tanzania, United Republic');
  
  // LIVE COUNTDOWN TIMER STATE
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  // BANNERS STATE
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // MODAL STATES 
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);

  // WORKFLOW STATES
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 

  // FORM STATES
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
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
    { id: 1, title: "Best Quality,\nBest Prices,\nOnly on Jtex", subtitle: "Shop the latest gadgets, electronics,\nfashion and more at unbeatable prices.", bgColor: "from-[#0F3B4E] to-[#1E5673]", buttonText: t.buyNow, categoryTarget: "Electronics" },
    { id: 2, title: "New Phones\nIn Town", subtitle: "Order today and get it delivered fast.", bgColor: "from-[#F2A900] to-[#C98A00]", buttonText: "View Phones", categoryTarget: "Phones" }
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

    const handleCategorySelect = (e: any) => {
        if(e.detail && e.detail.category) {
            setActiveCategory(e.detail.category);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    window.addEventListener('selectCategory', handleCategorySelect);
    return () => window.removeEventListener('selectCategory', handleCategorySelect);
  }, []);

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
    try {
      const res = await fetch(`${getApiUrl()}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, phone: registerPhone, email: loginEmail, password: loginPassword })
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

  // REUSABLE PRODUCT CARD
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

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      
      {/* ========================================================= */}
      {/* MOBILE SPECIFIC LAYOUT (MOCKUP REPLICA)                     */}
      {/* ========================================================= */}
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white sticky top-0 z-40 px-4 py-3 shadow-sm pb-0">
        
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
           {CATEGORY_KEYS.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} 
              className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeCategory === cat ? 'border-[#0F3B4E] text-[#0F3B4E]' : 'border-transparent hover:text-gray-900'}`}>
                 {cat}
              </button>
           ))}
        </div>
      </header>

      {/* Mobile Main Content */}
      <div className="md:hidden px-4 pb-24 flex flex-col mt-3">
         
         {/* Delivery Pill */}
         <div className="flex items-center gap-2 text-[10px] font-bold bg-[#F8FAFC] border border-gray-100 p-2.5 rounded-xl text-gray-600 mb-4">
             <FiMapPin className="text-gray-400 text-sm"/>
             <span className="truncate flex-1">Deliver to {deliverLocation}...</span>
             <FiChevronDown className="text-gray-400"/>
         </div>

         {/* Top Trust Badges (Pre-Banner) */}
         <div className="flex gap-2 mb-4">
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
         <div className="relative w-full h-[170px] rounded-xl overflow-hidden shadow-sm mb-4">
           {activeBanners.map((banner, index) => (
             <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-500 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-5 text-white ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                <h2 className="text-[22px] font-black mb-1 leading-tight whitespace-pre-line max-w-[70%] tracking-tight">{banner.title}</h2>
                <div className="text-3xl font-black italic tracking-tighter mb-2">
                   <span className="text-blue-400">J</span><span className="text-white">tex</span>
                </div>
                <p className="text-[8px] font-medium mb-3 opacity-90 whitespace-pre-line max-w-[60%]">{banner.subtitle}</p>
                <button onClick={() => setActiveCategory(banner.categoryTarget)} className="bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-4 py-1.5 rounded-full shadow-md w-max flex items-center gap-1">Shop Now <FiChevronRight size={10}/></button>
             </div>
           ))}
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {activeBanners.map((_, idx) => (
                <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-1.5 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-4 bg-[#F2A900]' : 'w-1.5 bg-white/50'}`}></div>
              ))}
           </div>
         </div>

         {/* Trust Features (Post Banner Grid) */}
         <div className="flex justify-between items-start pt-2 pb-4 mb-2 border-b border-gray-50">
            <div className="flex flex-col items-center text-center w-1/4">
               <FiTruck className="text-gray-600 text-lg mb-1.5"/>
               <span className="text-[8px] font-black text-gray-800 leading-tight">Free Delivery<br/><span className="text-[7px] text-gray-500 font-normal">On orders over TZS 50,000</span></span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
               <FiShield className="text-gray-600 text-lg mb-1.5"/>
               <span className="text-[8px] font-black text-gray-800 leading-tight">Secure Payment<br/><span className="text-[7px] text-gray-500 font-normal">100% secure payments</span></span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
               <FiCheckCircle className="text-gray-600 text-lg mb-1.5"/>
               <span className="text-[8px] font-black text-gray-800 leading-tight">Easy Returns<br/><span className="text-[7px] text-gray-500 font-normal">7 days return policy</span></span>
            </div>
            <div className="flex flex-col items-center text-center w-1/4">
               <FiHeadphones className="text-gray-600 text-lg mb-1.5"/>
               <span className="text-[8px] font-black text-gray-800 leading-tight">24/7 Support<br/><span className="text-[7px] text-gray-500 font-normal">We are here to help</span></span>
            </div>
         </div>

         {/* Flash Sales Header */}
         <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
               <FiZap className="text-[#F2A900] text-lg fill-[#F2A900]" />
               <h2 className="text-sm font-black text-gray-900">Flash Sales</h2>
               <span className="text-[8px] text-gray-500 font-medium ml-1 w-16 leading-tight">Limited time offers - Don't miss out!</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] text-gray-600 font-bold">Ends in:</span>
               <div className="flex gap-1 items-center">
                  <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white text-[10px] font-bold px-1.5 py-1 rounded">{timeLeft.h}</span><span className="text-[6px] text-gray-500 mt-0.5">Hrs</span></div>
                  <span className="text-xs font-bold pb-2 text-gray-400">:</span>
                  <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white text-[10px] font-bold px-1.5 py-1 rounded">{timeLeft.m}</span><span className="text-[6px] text-gray-500 mt-0.5">Mins</span></div>
                  <span className="text-xs font-bold pb-2 text-gray-400">:</span>
                  <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white text-[10px] font-bold px-1.5 py-1 rounded">{timeLeft.s}</span><span className="text-[6px] text-gray-500 mt-0.5">Secs</span></div>
               </div>
               <span className="text-[10px] font-bold text-blue-600 flex items-center ml-1">View All <FiChevronRight size={10}/></span>
            </div>
         </div>

         {/* Horizontal Products Scroll */}
         <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             {filteredProducts.length === 0 && <div className="text-xs text-gray-500">No products found.</div>}
             {filteredProducts.slice(0,6).map((product) => (
               <div key={product.id} className="min-w-[140px] max-w-[140px]">
                 <ProductCard product={product} />
               </div>
             ))}
         </div>

         {/* Secondary Banner: Big Deals */}
         <div className="bg-[#0F3B4E] rounded-xl p-5 text-white relative overflow-hidden shadow-sm mt-2 mb-6 flex items-center">
            <div className="z-10 relative">
               <h3 className="text-sm font-black mb-1">Big Deals on Top Brands</h3>
               <p className="text-lg font-black text-[#F2A900] mb-3">Up to 40% Off</p>
               <button className="bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-4 py-2 rounded-lg shadow-md w-max flex items-center gap-1">Shop Now <FiChevronRight size={10}/></button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-7xl opacity-50 transform -rotate-12">🎁</div>
         </div>

         {/* Top Brands Section */}
         <div className="mb-2">
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

      {/* MOBILE BOTTOM NAVIGATION (MOCKUP EXACT REPLICA) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[65px] px-2 z-50 pb-safe">
        <button onClick={() => { setActiveCategory('Electronics'); window.scrollTo(0,0); }} className={`flex flex-col items-center gap-1 w-[20%] text-gray-400 hover:text-gray-900`}>
          <FiHome className="text-xl fill-current" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => router.push('/shop')} className={`flex flex-col items-center gap-1 w-[20%] text-gray-400 hover:text-gray-900`}>
          <FiGrid className="text-xl" />
          <span className="text-[9px] font-bold">Categories</span>
        </button>
        
        {/* CENTER MESSAGE BUTTON */}
        <div className="relative -top-5 w-[20%] flex justify-center">
           <div className="w-[52px] h-[52px] bg-[#0F3B4E] rounded-full flex items-center justify-center text-white shadow-lg border-[3px] border-white cursor-pointer transition">
              <FiMessageCircle className="text-[22px]" />
           </div>
           <span className="absolute -bottom-4 text-[9px] font-bold text-gray-500 w-full text-center">Message</span>
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


      {/* ========================================================= */}
      {/* DESKTOP CONTENT (HIDDEN ON MOBILE)                        */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-col min-h-screen">
         <header className="bg-[#0A101D] text-white h-[72px] items-center px-8 sticky top-0 z-50 shadow-md flex">
           <div className="flex items-center gap-2 cursor-pointer w-[200px]" onClick={() => router.push('/')}>
              <div className="flex text-2xl font-black italic tracking-tighter">
                <span className="text-blue-500">J</span><span className="text-orange-500">t</span><span className="text-white">ex</span>
              </div>
           </div>
           <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition pl-4 border-l border-gray-800">
              <FiMapPin className="text-xl text-gray-400" />
              <div className="flex flex-col leading-none">
                 <span className="text-[10px] text-gray-400">Deliver to</span>
                 <span className="text-xs font-bold flex items-center gap-1 mt-0.5">{deliverLocation} <FiChevronDown className="text-gray-500"/></span>
              </div>
           </div>
           <div className="flex-1 flex justify-center px-8">
              <div className="w-full max-w-2xl flex bg-white rounded-md overflow-hidden h-10 shadow-sm focus-within:ring-2 focus-within:ring-[#F2A900]/50 transition-all">
                 <div className="bg-gray-100 border-r border-gray-200 text-gray-700 px-3 py-2 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-200 transition">All <FiChevronDown/></div>
                 <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, brands..." className="flex-1 px-4 text-sm outline-none text-gray-900 placeholder-gray-400" />
                 <div className="flex items-center gap-3 px-3 text-gray-400">
                    <FiMaximize onClick={() => setIsBarcodeOpen(true)} className="hover:text-blue-500 cursor-pointer text-lg"/>
                    <FiMic onClick={startVoiceSearch} className="hover:text-blue-500 cursor-pointer text-lg"/>
                    <FiCamera onClick={() => setIsImageSearchOpen(true)} className="hover:text-blue-500 cursor-pointer text-lg"/>
                 </div>
                 <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0A101D] hover:bg-yellow-500 transition"><FiSearch className="text-xl font-bold" /></button>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div onClick={toggleLanguage} className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition">
                 <img src="https://flagcdn.com/w20/tz.png" className="w-5 h-3.5 rounded-sm object-cover" /><span className="text-xs font-bold">TZS <FiChevronDown className="inline text-gray-500"/></span>
              </div>
              <div onClick={openCartWorkflow} className="flex flex-col items-center cursor-pointer hover:text-[#F2A900] transition relative group">
                 <div className="relative border border-gray-700 p-2 rounded-lg bg-gray-800/50 group-hover:border-gray-500 transition">
                    <FiShoppingCart className="text-xl" />
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F2A900] text-[#0A101D] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A101D]">{cart.length}</span>}
                 </div>
                 <span className="text-[10px] mt-1 font-bold">Cart</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:text-gray-300 transition group">
                 <div className="border border-gray-700 p-2 rounded-lg bg-gray-800/50 group-hover:border-gray-500 transition"><FiPackage className="text-xl" /></div>
                 <span className="text-[10px] mt-1 font-bold">Track Order</span>
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
         <main className="max-w-[1920px] mx-auto flex gap-6 px-8 py-6 w-full">
            <div className="w-[240px] flex-shrink-0 flex-col">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
                  <nav className="flex flex-col gap-1 text-sm font-bold text-gray-600">
                     <button onClick={() => router.push('/')} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-[#0F172A] transition"><FiHome className="text-lg text-gray-900"/> Home</button>
                     <button onClick={() => router.push('/shop')} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition"><FiGrid className="text-lg text-gray-400"/> Categories</button>
                     <button className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition"><div className="flex items-center gap-3"><FiTag className="text-lg text-gray-400"/> Deals</div><span className="bg-[#F2A900] text-white text-[9px] px-1.5 py-0.5 rounded font-black">Hot</span></button>
                     <button onClick={() => router.push('/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition"><FiPackage className="text-lg text-gray-400"/> Orders</button>
                     <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition"><FiHeart className="text-lg text-gray-400"/> Wishlist</button>
                     <div className="border-t border-gray-100 my-2 mx-2"></div>
                     <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition"><FiHeadphones className="text-lg text-gray-400"/> Support</button>
                  </nav>
               </div>
               <div className="bg-[#0A101D] rounded-xl p-6 text-white relative overflow-hidden shadow-lg mt-auto">
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Special Offer</p>
                  <h4 className="text-3xl font-black mb-2 leading-tight">Up to <span className="text-[#F2A900]">40% Off</span></h4>
                  <p className="text-xs text-gray-300 mb-6">On selected items</p>
                  <button className="bg-white text-[#0A101D] text-xs font-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition shadow-md w-max flex items-center gap-2">Shop Now <FiArrowRight className="text-[#F2A900]"/></button>
                  <div className="absolute -bottom-6 -right-6 text-7xl opacity-50 transform rotate-12">🎁</div>
               </div>
            </div>
            <div className="flex-1 w-full flex flex-col min-w-0">
               <div className="flex items-center gap-8 px-2 mb-6 text-sm font-bold text-gray-500 overflow-x-auto hide-scrollbar border-b border-transparent">
                  {CATEGORY_KEYS.map((cat) => (
                     <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? 'All' : cat)} className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeCategory === cat ? 'border-[#0F172A] text-[#0F172A]' : 'border-transparent hover:text-gray-900'}`}>{cat}</button>
                  ))}
               </div>
               <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-sm group bg-[#0A101D] mb-6">
                 {activeBanners.map((banner, index) => (
                   <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-16 text-white ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                      <h1 className="text-6xl font-black mb-5 tracking-tight leading-[1.1] whitespace-pre-line max-w-[60%]">{banner.title}</h1>
                      <p className="text-base font-medium mb-8 opacity-90 whitespace-pre-line max-w-[50%]">{banner.subtitle}</p>
                      <button onClick={() => setActiveCategory(banner.categoryTarget)} className="bg-[#F2A900] text-[#0F172A] font-black px-8 py-3.5 rounded-full w-max hover:bg-yellow-500 transition shadow-lg flex items-center gap-2 text-sm">{banner.buttonText} <FiArrowRight className="text-lg" /></button>
                   </div>
                 ))}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {activeBanners.map((_, idx) => (
                      <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-2 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-6 bg-[#F2A900]' : 'w-2 bg-white/50'}`}></div>
                    ))}
                 </div>
               </div>
               <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 mb-8">
                   <div className="flex items-center gap-4"><FiTruck className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">FREE Delivery</span><span className="text-xs text-gray-500 mt-1">on orders over TZS 50,000</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiShield className="text-4xl text-[#F2A900]"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">Money-back Guarantee</span><span className="text-xs text-gray-500 mt-1">for up to 60 days</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiLock className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">Secure Payment</span><span className="text-xs text-gray-500 mt-1">100% secure payments</span></div></div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex items-center gap-4"><FiHeadphones className="text-4xl text-gray-700"/><div className="flex flex-col leading-tight"><span className="text-sm font-black text-gray-900">24/7 Support</span><span className="text-xs text-gray-500 mt-1">We are here to help</span></div></div>
               </div>
               <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <FiZap className="text-3xl text-[#0F172A] fill-[#0F172A]" />
                     <h2 className="text-2xl font-black text-gray-900">{t.flashSales}</h2>
                     <span className="text-sm text-gray-500 font-bold ml-2 hidden sm:block">{t.limitedOffers}</span>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                        <span>{t.endsIn}</span>
                        <div className="flex gap-1.5 items-center">
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white px-2.5 py-1.5 rounded-lg text-sm">{timeLeft.h}</span><span className="text-[8px] mt-1 uppercase">Hrs</span></div><span className="text-xl font-bold pb-4">:</span>
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white px-2.5 py-1.5 rounded-lg text-sm">{timeLeft.m}</span><span className="text-[8px] mt-1 uppercase">Mins</span></div><span className="text-xl font-bold pb-4">:</span>
                           <div className="flex flex-col items-center"><span className="bg-[#0F3B4E] text-white px-2.5 py-1.5 rounded-lg text-sm">{timeLeft.s}</span><span className="text-[8px] mt-1 uppercase">Secs</span></div>
                        </div>
                     </div>
                     <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">View All <FiChevronRight/></button>
                  </div>
               </div>
               <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
                  {filteredProducts.slice(0, 10).map((product) => (<ProductCard key={product.id} product={product} />))}
               </div>
            </div>
         </main>
         <Footer />
      </div>

      {/* MODALS YAKO ZIPO HAPA (Login, Checkout, etc) - Code Imebaki asili */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex overflow-hidden min-h-[500px] animate-fade-in">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            <div className="hidden md:flex md:w-1/2 bg-[#0A101D] text-white flex-col justify-center p-12">
               <h2 className="text-5xl font-black mb-4">J<span className="text-[#F2A900]">tex</span></h2>
               <p className="text-lg font-medium text-blue-100 mb-8">{t.signIn} and Checkout seamlessly.</p>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>{t.signIn}</button>
                <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>{t.register}</button>
              </div>
              {loginError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-bold mb-4">{loginError}</div>}
              <form onSubmit={authMode === 'login' ? handleInlineLogin : handleInlineRegister} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <input type="text" required value={registerName} onChange={e => setRegisterName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Full Name" />
                    <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Phone Number" />
                  </>
                )}
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Email Address" />
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Password" />
                <button type="submit" className="w-full bg-[#0A101D] text-white font-bold py-3.5 rounded-xl text-sm mt-2 hover:bg-gray-800 transition">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

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