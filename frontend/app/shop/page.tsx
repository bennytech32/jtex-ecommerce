'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin, 
  FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, 
  FiSmartphone, FiArrowLeft, FiMoreHorizontal, FiSliders, FiList, FiGrid,
  FiCamera, FiMic, FiMaximize, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiHeart
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

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
    imageSearchTitle: "AI Image Search",
    barcodeSearchTitle: "Smart Barcode Scanner",
    uploadPrompt: "Drag & drop or click to upload product image",
    barcodePrompt: "Align product barcode inside the scanner frame",
    simulatingAi: "AI is analyzing the data...",
    catElectronics: "Electronics",
    catComputers: "Computers",
    catPhones: "Phones",
    catFashion: "Fashion",
    catHome: "Home & Kitchen",
    catSports: "Sports & Outdoors",
    catBeauty: "Beauty & Health"
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
    imageSearchTitle: "Tafuta kwa Picha (AI)",
    barcodeSearchTitle: "Skana Barcode ya Bidhaa",
    uploadPrompt: "Kokota picha au bonyeza hapa kupakia picha ya bidhaa",
    barcodePrompt: "Weka barcode ya bidhaa katikati ya fremu ya skana",
    simulatingAi: "AI inachuja na kuchambua picha...",
    catElectronics: "Elektroniki",
    catComputers: "Kompyuta",
    catPhones: "Simu",
    catFashion: "Nguo na Fesheni",
    catHome: "Vyombo vya Ndani",
    catSports: "Michezo na Nje",
    catBeauty: "Urembo na Afya"
  }
};

const CATEGORY_UI_MOCKS = [
  { name: 'Electronics', count: '1,248 items', icon: '🎧' },
  { name: 'Computers', count: '856 items', icon: '💻' },
  { name: 'Phones', count: '1,562 items', icon: '📱' },
  { name: 'Fashion', count: '945 items', icon: '👕' },
  { name: 'Home & Kitchen', count: '1,120 items', icon: '🍳' },
  { name: 'Beauty & Health', count: '632 items', icon: '🧴' },
  { name: 'Sports & Outdoors', count: '412 items', icon: '⚽' },
  { name: 'Toys & Games', count: '385 items', icon: '🧸' },
  { name: 'Automotive', count: '678 items', icon: '🚗' },
];

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('popular');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  const [deliverLocation, setDeliverLocation] = useState('Tanzania, United Republic');
  
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);

  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 

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

  // FIX: Connection Variables kwa API na Picha (Dynamic URLs)
  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${getApiUrl()}${url}`;
  };

  const activeBanners = [
    { id: 1, title: lang === 'en' ? "Best Quality, Best Prices" : "Ubora Bora, Bei Bora", subtitle: "Shop the latest gadgets and electronics.", bgColor: "from-[#0F3B4E] to-[#1A5C7A]", buttonText: t.buyNow, categoryTarget: "Electronics" },
    { id: 2, title: "New Phones in Town", subtitle: "Order today and get it delivered fast.", bgColor: "from-[#F2A900] to-yellow-600", buttonText: "View Phones", categoryTarget: "Phones" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
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

  // API FIX: Kuchukua data kutoka kwenye server ya Live badala ya Localhost
  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) {
            console.error("User Parse Error", e);
        }
    }

    const fetchRealProducts = async () => {
      try {
        // Imetumia getApiUrl() kuzuia Network Error
        const res = await fetch(`${getApiUrl()}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch");
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

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'sw' : 'en');
  
  const getTranslatedCategoryName = (catKey: string) => {
      switch(catKey) {
          case 'All': return t.all;
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

  const handleAuthSuccess = (data: any) => {
    localStorage.setItem('jtex_token', data.token);
    localStorage.setItem('jtex_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsLoginOpen(false);
    if (isWorkflowOpen) setWorkflowStep(2);
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoginError('');
    
    const cleanEmail = loginEmail.trim();
    const cleanPassword = loginPassword.trim();

    if (cleanEmail && cleanPassword) {
      // Logic ya Simulation kuruhusu malipo bila kukwama
      const mockData = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jtex-customer-token",
        user: { id: "123", name: cleanEmail.split('@')[0], email: cleanEmail }
      };
      handleAuthSuccess(mockData);
    } else {
      setLoginError('Tafadhali jaza barua pepe na nenosiri.');
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoginError('');
    
    const cleanName = registerName.trim();
    const cleanEmail = loginEmail.trim();
    const cleanPassword = loginPassword.trim();
    const cleanPhone = registerPhone.trim();

    if (cleanName && cleanEmail && cleanPassword && cleanPhone) {
      const mockData = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jtex-customer-token",
        user: { id: "123", name: cleanName, email: cleanEmail, phone: cleanPhone }
      };
      handleAuthSuccess(mockData);
    } else {
      setLoginError('Tafadhali jaza taarifa zote.');
    }
  };

  const openCartWorkflow = () => { setSelectedProduct(null); setWorkflowStep(1); setIsWorkflowOpen(true); };
  
  const handleProceedToLocation = () => { 
      if (!user) {
          setIsLoginOpen(true); 
      } else {
          setWorkflowStep(2); 
      }
  };

  const shippingFee = region === 'Dar es Salaam' ? 0 : 10000;
  const grandTotal = cartTotal + shippingFee;
  const upfrontPayment = region === 'Dar es Salaam' ? 0 : grandTotal * 0.2;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setTimeout(() => {
        setWorkflowStep(4);
        clearCart();
        setCheckoutLoading(false);
    }, 1500);
  };

  const handleBuyNow = (product: any) => {
    setSelectedProduct(null);
    addToCart(product); 
    setWorkflowStep(1);
    setIsWorkflowOpen(true);
  };

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    return (
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col h-full group cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <div className="relative aspect-square w-full bg-white rounded-lg mb-3 overflow-hidden flex items-center justify-center p-2">
          <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 bg-white shadow-sm transition border border-gray-100">
            <FiHeart className={`text-sm ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          {discount > 0 && <span className="absolute top-0 left-0 bg-[#F2A900] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">-{discount}%</span>}
          {product.imageUrl ? (
            <img src={getImageUrl(product.imageUrl)} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-300" />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition duration-300">{product.imageEmoji || '📦'}</span>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-normal mb-2 line-clamp-2 min-h-[36px] group-hover:text-blue-600 transition">{product.name}</h3>
          <div className="mt-auto pt-2 flex flex-col">
            <span className="text-sm sm:text-base font-black text-[#0F172A]">TZS {product.price?.toLocaleString()}</span>
            {product.oldPrice && <div className="flex items-center gap-1 mt-0.5"><span className="text-[10px] text-gray-400 line-through">TZS {product.oldPrice.toLocaleString()}</span></div>}
            <div className="flex items-center text-[#F2A900] text-[10px] mt-1">
              ★★★★★ <span className="text-gray-400 ml-1 font-medium">(24)</span>
            </div>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="flex-1 border border-gray-200 hover:border-[#F2A900] text-gray-600 hover:text-[#F2A900] text-xs font-bold py-1.5 rounded flex items-center justify-center transition"><FiShoppingCart/></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased">
      
      {/* DESKTOP HEADER */}
      <header className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 w-[240px]">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
        </div>
        <div className="flex-1 flex justify-center px-8">
          <div className="w-full max-w-3xl flex border-2 border-[#0F3B4E] rounded-full overflow-hidden bg-white h-11 transition-all shadow-sm">
            <div className="bg-[#0F3B4E] text-white px-4 py-2 text-xs font-bold flex items-center gap-2">
                ✨ AI Search <span className="font-normal opacity-80 text-[10px] hidden lg:inline">Search smarter</span>
            </div>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder={t.search} className="flex-1 px-4 text-sm outline-none text-gray-900 placeholder-gray-400" 
            />
            <div className="flex items-center px-2 text-gray-400 gap-2">
               <FiCamera onClick={() => setIsImageSearchOpen(true)} className="hover:text-blue-500 cursor-pointer"/>
               <FiMic onClick={startVoiceSearch} className="hover:text-blue-500 cursor-pointer"/>
               <FiMaximize onClick={() => setIsBarcodeOpen(true)} className="hover:text-blue-500 cursor-pointer"/>
            </div>
            <button className="bg-[#F2A900] px-6 flex items-center justify-center text-white hover:bg-yellow-500 transition">
              <FiSearch className="text-lg" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <button onClick={toggleLanguage} className="flex items-center gap-1 text-xs font-bold border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50">
            <img src="https://flagcdn.com/w20/tz.png" className="w-4 rounded-sm" /> TZS <FiChevronDown/>
          </button>
          <button onClick={openCartWorkflow} className="relative text-gray-700 hover:text-[#F2A900] transition">
            <FiShoppingCart className="text-xl" />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F2A900] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
          {user ? (
            <div className="w-8 h-8 bg-[#0F3B4E] text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm" onClick={() => router.push('/profile')}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          ) : (
            <button onClick={() => setIsLoginOpen(true)} className="text-xs font-bold bg-[#0F3B4E] text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
              {t.signIn}
            </button>
          )}
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <span onClick={() => router.push('/')} className="text-xl font-black text-[#0F172A] tracking-tight">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          <div className="flex items-center gap-3">
             <button onClick={toggleLanguage} className="flex items-center gap-1 text-[10px] font-bold border border-gray-200 px-2 py-1 rounded-full">
                <img src="https://flagcdn.com/w20/tz.png" className="w-3 rounded-sm" /> TZS
             </button>
             <div className="relative">
                <FiSearch className="text-xl text-gray-700" />
             </div>
             {user ? (
                <div className="w-6 h-6 bg-[#0F3B4E] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.charAt(0) || 'U'}
                </div>
             ) : (
                <FiUser className="text-xl text-gray-700" onClick={() => setIsLoginOpen(true)} />
             )}
          </div>
        </div>
        
        {activeCategory !== 'All' && (
          <div className="px-4 pb-3">
            <div className="w-full flex border-2 border-[#0F3B4E] rounded-full overflow-hidden bg-white transition-all shadow-sm">
              <div className="bg-[#0F3B4E] text-white px-2 py-1.5 text-[10px] font-bold flex items-center gap-1">
                 ✨ AI Search
              </div>
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder={`Search in ${activeCategory}...`} className="flex-1 px-3 text-xs outline-none text-gray-900" 
              />
              <div className="flex items-center px-2 text-gray-400 gap-2">
                 <button onClick={startVoiceSearch}><FiMic size={14}/></button>
                 <button onClick={() => setIsImageSearchOpen(true)}><FiCamera size={14}/></button>
              </div>
              <button className="bg-[#F2A900] px-3 flex items-center justify-center text-white"><FiSearch size={14}/></button>
            </div>
          </div>
        )}
      </header>

      {/* DYNAMIC DELIVERY BAR */}
      <div className="px-4 py-2 flex items-center gap-2 text-xs font-medium border-b bg-[#F5F8FA] border-gray-200 text-gray-600">
          <FiMapPin className="text-gray-400"/>
          <span className="truncate">{t.deliverTo} {deliverLocation}</span>
          <FiChevronDown className="ml-auto text-gray-400"/>
      </div>

      <main className="max-w-[1920px] mx-auto flex flex-col md:flex-row pb-20 md:pb-6 md:pt-6">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex w-[240px] flex-shrink-0 flex-col pl-4 sm:pl-6 lg:pl-8">
           <nav className="flex flex-col gap-1 text-sm font-medium text-gray-600 pr-6">
              <button onClick={() => router.push('/')} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiHome className="text-lg"/> Home</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F2A900] text-white font-bold shadow-sm transition"><FiGrid className="text-lg"/> Categories</button>
              <button className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition">
                 <div className="flex items-center gap-3"><FiTag className="text-lg"/> Deals</div>
                 <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">Hot</span>
              </button>
              <button onClick={() => router.push('/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiShoppingCart className="text-lg"/> Orders</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiHeart className="text-lg"/> Wishlist</button>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <button onClick={openCartWorkflow} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition">
                 <div className="flex items-center gap-3"><FiShoppingCart className="text-lg"/> Cart</div>
                 {cart.length > 0 && <span className="bg-[#F2A900] text-white text-[10px] px-2 py-0.5 rounded-full font-black">{cart.length}</span>}
              </button>
              <button onClick={() => router.push('/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiUser className="text-lg"/> Account</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiSliders className="text-lg"/> Settings</button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"><FiPhone className="text-lg"/> Help & Support</button>
           </nav>

           <div className="mt-auto pr-6 pt-6">
              <div className="bg-[#0F3B4E] rounded-xl p-5 text-white relative overflow-hidden shadow-lg">
                <p className="text-[10px] text-gray-300 font-bold mb-1">Special Offers</p>
                <h4 className="text-xl font-black mb-1">Up to <span className="text-[#F2A900]">40% Off</span></h4>
                <p className="text-[10px] text-gray-300 mb-4">On selected items</p>
                <button className="bg-[#F2A900] text-[#0F172A] text-[10px] font-bold px-3 py-1.5 rounded hover:bg-yellow-500 transition w-max flex items-center gap-1">Shop Now <FiChevronRight/></button>
                <div className="absolute -bottom-4 -right-4 text-6xl opacity-50">🎁</div>
              </div>
           </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-white md:bg-transparent md:pr-4 lg:pr-8">
           
           {/* MOBILE VIEW: "ALL CATEGORIES" GRID */}
           <div className={`md:hidden ${activeCategory !== 'All' ? 'hidden' : 'block'}`}>
              <div className="px-4 py-3">
                 <div className="w-full flex border-2 border-[#0F3B4E] rounded-full overflow-hidden bg-white shadow-sm mb-6">
                    <div className="bg-[#0F3B4E] text-white px-3 py-2 text-xs font-bold flex items-center gap-1">✨ AI Search</div>
                    <input type="text" placeholder="Search products, categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-3 text-xs outline-none" />
                    <button className="bg-[#F2A900] px-4 flex items-center justify-center text-white"><FiSearch/></button>
                 </div>
                 
                 <h2 className="text-xl font-black text-gray-900 mb-1">Categories</h2>
                 <p className="text-xs text-gray-500 mb-4">{t.browseAll}</p>

                 <div className="grid grid-cols-3 gap-3 mb-6">
                    {CATEGORY_UI_MOCKS.map(cat => (
                       <div key={cat.name} onClick={() => setActiveCategory(cat.name)} className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-xl shadow-sm hover:border-[#F2A900] transition cursor-pointer">
                          <span className="text-3xl mb-2">{cat.icon}</span>
                          <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">{getTranslatedCategoryName(cat.name)}</span>
                          <span className="text-[8px] text-gray-400 mt-1">{cat.count}</span>
                       </div>
                    ))}
                    <div className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-xl shadow-sm bg-[#0F3B4E] text-white cursor-pointer">
                        <FiMoreHorizontal className="text-2xl mb-2" />
                        <span className="text-[10px] font-bold text-center leading-tight">More Categories</span>
                    </div>
                 </div>

                 {/* SLIDING BANNERS INSIDE MOBILE VIEW */}
                 <div className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-sm mb-6">
                   {activeBanners.map((banner, index) => (
                     <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-500 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-6 text-white ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                        <h4 className="font-bold text-sm mb-1">{banner.title}</h4>
                        <h3 className="text-lg font-black text-[#F2A900] mb-3">{banner.subtitle}</h3>
                        <button onClick={() => setActiveCategory(banner.categoryTarget)} className="bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-4 py-1.5 rounded-full shadow-md w-max">Shop Now <FiChevronRight className="inline"/></button>
                     </div>
                   ))}
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                      {activeBanners.map((_, idx) => (
                        <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-1.5 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-4 bg-[#F2A900]' : 'w-1.5 bg-white/50'}`}></div>
                      ))}
                   </div>
                 </div>
              </div>
           </div>

           {/* DESKTOP & MOBILE VIEW: SPECIFIC CATEGORY DETAILED VIEW */}
           <div className={`w-full ${activeCategory === 'All' ? 'hidden md:block' : 'block'}`}>
              
              <div className="hidden md:block mb-6">
                 <div className="text-xs text-gray-500 flex items-center gap-2 mb-3">
                    <span className="cursor-pointer hover:underline" onClick={() => setActiveCategory('All')}>Home</span> <FiChevronRight size={10}/> 
                    <span className="cursor-pointer hover:underline" onClick={() => setActiveCategory('All')}>Categories</span> <FiChevronRight size={10}/> 
                    <span className="text-gray-900 font-bold">{activeCategory}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <h1 className="text-3xl font-black text-gray-900 mb-1">{activeCategory === 'All' ? t.all : activeCategory}</h1>
                       <p className="text-sm text-gray-500">Discover high performance items for work, study, and lifestyle.</p>
                    </div>
                    <div className="text-right">
                       <span className="text-2xl font-black text-gray-900">{filteredProducts.length}</span>
                       <p className="text-xs text-gray-500 uppercase font-bold">{t.itemsFound}</p>
                    </div>
                 </div>

                 {activeCategory === 'All' && (
                   <div className="relative w-full h-[200px] mt-6 rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
                     {activeBanners.map((banner, index) => (
                       <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-500 bg-gradient-to-r ${banner.bgColor} flex flex-col justify-center px-12 text-white ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                          <h1 className="text-4xl font-black mb-2 tracking-tight">{banner.title}</h1>
                          <p className="text-lg font-medium mb-6 opacity-90">{banner.subtitle}</p>
                          <button onClick={() => setActiveCategory(banner.categoryTarget)} className="bg-[#F2A900] text-[#0F172A] font-black px-6 py-3 rounded-lg w-max hover:bg-yellow-500 transition shadow-lg flex items-center gap-2 text-sm">
                              {banner.buttonText} <FiChevronRight />
                          </button>
                       </div>
                     ))}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {activeBanners.map((_, idx) => (
                          <div key={idx} onClick={() => setCurrentBannerIndex(idx)} className={`h-2 rounded-full cursor-pointer transition-all ${idx === currentBannerIndex ? 'w-6 bg-[#F2A900]' : 'w-2 bg-white/50'}`}></div>
                        ))}
                     </div>
                   </div>
                 )}
              </div>

              {/* Mobile Specific Category Header (Back button) */}
              <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-[104px] z-30">
                 <button onClick={() => setActiveCategory('All')} className="p-1"><FiArrowLeft className="text-xl text-gray-800"/></button>
                 <h1 className="text-lg font-black text-gray-900 flex-1">{activeCategory}</h1>
                 <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{filteredProducts.length} items</span>
              </div>

              {/* Flash Sales Section */}
              <div className="px-4 md:px-0 mt-4 md:mt-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div className="flex items-center gap-3">
                    <FiZap className="text-[#F2A900] text-2xl fill-[#F2A900]" />
                    <h2 className="text-lg sm:text-xl font-black text-gray-900">{t.flashSales}</h2>
                    <span className="text-xs text-gray-500 hidden sm:block font-medium ml-2">{t.limitedOffers}</span>
                 </div>
                 <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold">
                       <span className="text-gray-500">{t.endsIn}</span>
                       <div className="flex gap-1">
                          <span className="bg-[#0F172A] text-white px-2 py-1 rounded">{timeLeft.h}</span><span className="text-gray-400">:</span>
                          <span className="bg-[#0F172A] text-white px-2 py-1 rounded">{timeLeft.m}</span><span className="text-gray-400">:</span>
                          <span className="bg-[#0F172A] text-white px-2 py-1 rounded">{timeLeft.s}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Layout Split for Desktop (Filters Left, Products Right) */}
              <div className="flex flex-col lg:flex-row mt-2 md:mt-4 px-4 md:px-0 gap-6">
                 
                 {/* Desktop Filters Sidebar */}
                 <div className="hidden lg:block w-[220px] flex-shrink-0">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="font-black text-gray-900">{t.filter}</h3>
                          <button onClick={() => {}} className="text-xs text-blue-600 hover:underline">{t.clearAll}</button>
                       </div>
                       
                       <div className="space-y-6">
                          <div>
                             <div className="flex justify-between items-center mb-3 cursor-pointer text-sm font-bold text-gray-800">
                                {t.priceRange} <FiChevronDown/>
                             </div>
                             <div className="px-2">
                               <div className="w-full h-1 bg-gray-200 rounded-full relative mb-4 mt-2">
                                  <div className="absolute left-[20%] right-[30%] h-full bg-[#F2A900] rounded-full"></div>
                                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#F2A900] rounded-full shadow"></div>
                                  <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#F2A900] rounded-full shadow"></div>
                               </div>
                               <div className="flex justify-between text-[10px] font-medium text-gray-500">
                                  <span>TZS 100,000</span>
                                  <span>TZS 5,000,000+</span>
                               </div>
                             </div>
                          </div>
                          {['Brand', 'Processor', 'RAM', 'Storage', 'Condition'].map(filter => (
                             <div key={filter} className="flex justify-between items-center pb-3 border-b border-gray-100 cursor-pointer text-sm font-bold text-gray-800 hover:text-[#F2A900] transition">
                                {filter} <FiChevronDown/>
                             </div>
                          ))}
                          <button className="w-full py-2.5 mt-4 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                             🔄 Reset Filters
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Products Grid Area */}
                 <div className="flex-1 w-full">
                    {/* Toolbar (Desktop) */}
                    <div className="hidden md:flex justify-between items-center mb-4 md:mb-6">
                       <h3 className="font-black text-lg text-gray-900">{t.topPicks}</h3>
                       <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 font-bold">{t.sort}</span>
                          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs font-bold text-gray-800 outline-none cursor-pointer">
                             <option value="popular">{t.popular}</option>
                             <option value="low">{t.lowToHigh}</option>
                             <option value="high">{t.highToLow}</option>
                          </select>
                          <div className="flex bg-white border border-gray-200 rounded-md p-0.5">
                             <button className="p-1.5 bg-orange-50 text-[#F2A900] rounded shadow-sm"><FiGrid size={14}/></button>
                             <button className="p-1.5 text-gray-400 hover:text-gray-700"><FiList size={14}/></button>
                          </div>
                       </div>
                    </div>

                    {isLoading ? (
                       <div className="text-center py-20 font-bold text-gray-500 animate-pulse text-lg">{t.loading}</div>
                    ) : filteredProducts.length === 0 ? (
                       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center text-gray-500 font-medium">{t.noProducts}</div>
                    ) : (
                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-10">
                          {filteredProducts.map((product) => (
                             <ProductCard key={product.id} product={product} />
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </main>
      
      <div className="hidden md:block">
         <Footer />
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[60px] px-2 z-50">
        <button onClick={() => router.push('/')} className={`flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900`}>
          <FiHome className="text-xl" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => { setActiveCategory('All'); window.scrollTo(0,0); }} className={`flex flex-col items-center gap-1 w-16 text-[#F2A900]`}>
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

        <button onClick={openCartWorkflow} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900 relative">
          <div className="relative">
             <FiShoppingCart className="text-xl" />
             {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-[#F2A900] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </div>
          <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => { if(user) router.push('/profile'); else setIsLoginOpen(true); }} className="flex flex-col items-center gap-1 w-16 text-gray-400 hover:text-gray-900">
          <FiUser className="text-xl" />
          <span className="text-[9px] font-bold">Account</span>
        </button>
      </div>

      {/* 1. PRODUCT VIEW MODAL */}
      {selectedProduct && !isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-fade-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-10 transition"><FiX size={24} /></button>
            <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 aspect-square rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-8 relative">
                  {selectedProduct.oldPrice && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-2 py-1 rounded shadow-sm z-10">-{Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100)}%</span>}
                  {selectedProduct.imageUrl ? ( <img src={getImageUrl(selectedProduct.imageUrl)} alt={selectedProduct.name} className="object-contain w-full h-full mix-blend-multiply" /> ) : ( <span className="text-8xl">{selectedProduct.imageEmoji}</span> )}
                </div>
              </div>
              <div className="w-full lg:w-1/3 flex flex-col">
                <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">{selectedProduct.brand || 'Jtex Authentic'}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mt-2 border-b border-gray-100 pb-3">
                   <span className="text-[#F2A900] text-sm">★★★★★</span>
                   <span className="text-blue-600 text-xs">Customer Reviews</span>
                </div>
                <div className="mt-4 space-y-3">
                   <p className="text-sm text-gray-700"><strong>Category:</strong> {selectedProduct.category}</p>
                   <p className="text-sm text-gray-700"><strong>SKU:</strong> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{selectedProduct.sku}</span></p>
                   {selectedProduct.specifications && (
                      <div className="mt-4 text-sm text-gray-800 border-t pt-4 border-gray-100">
                        <strong className="text-gray-900 block mb-2">Specifications</strong>
                        <div className="font-mono bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">{selectedProduct.specifications}</div>
                      </div>
                   )}
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
                   <p className="text-3xl font-black text-gray-900 mb-1">TZS {selectedProduct.price?.toLocaleString()}</p>
                   {selectedProduct.oldPrice && <p className="text-sm text-gray-400 line-through mb-2">Was: TZS {selectedProduct.oldPrice.toLocaleString()}</p>}
                   <h3 className="text-lg font-bold text-green-600 mb-5">{selectedProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</h3>
                   <div className="space-y-3">
                     <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); openCartWorkflow(); }} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-bold py-3 rounded-full text-sm transition shadow-sm border border-[#FCD200]">Add to Cart</button>
                     <button onClick={() => handleBuyNow(selectedProduct)} className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold py-3 rounded-full text-sm transition shadow-sm border border-[#FF8F00]">Buy Now</button>
                   </div>
                   <div className="mt-5 text-xs text-gray-500 space-y-2 border-t pt-4 border-gray-100">
                      <div className="flex justify-between"><span>Ships From</span> <span className="font-bold text-gray-700">Jtex Warehouse</span></div>
                      <div className="flex justify-between"><span>Sold By</span> <span className="font-bold text-gray-700">Jtex</span></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INLINE LOGIN & REGISTER MODAL (IMEREKEBISHWA KUFANYA KAZI BILA ERROR) */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex overflow-hidden min-h-[500px] animate-fade-in">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            <div className="hidden md:flex md:w-1/2 bg-[#0F3B4E] text-white flex-col justify-center p-12">
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
                <button type="submit" className="w-full bg-[#0F3B4E] text-white font-bold py-3.5 rounded-xl text-sm mt-2 hover:bg-[#0A2633] transition">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-STEP WORKFLOW MODAL (Cart -> Location -> Pay) */}
      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm pb-20 md:pb-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in border border-gray-200">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-20 transition"><FiX size={20} /></button>
            
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between sm:justify-center sm:gap-12 relative">
               {['Cart', 'Shipping', 'Payment', 'Done'].map((step, idx) => (
                 <div key={step} className={`flex flex-col items-center flex-1 sm:flex-none z-10 ${workflowStep >= idx + 1 ? 'text-[#0F172A]' : 'text-gray-400'}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 transition-all ${workflowStep >= idx + 1 ? 'bg-[#F2A900] text-black shadow-md ring-4 ring-yellow-50' : 'bg-gray-200'}`}>
                     {workflowStep > idx + 1 ? <FiCheckCircle /> : idx + 1}
                   </div>
                   <span className="text-[10px] sm:text-xs font-bold uppercase">{step}</span>
                 </div>
               ))}
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white">
              
              {workflowStep === 1 && (
                <div className="max-w-xl mx-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h3 className="text-xl sm:text-2xl font-black text-gray-900">{t.cart}</h3>
                     {cart.length > 0 && (
                        <button onClick={clearCart} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition flex items-center gap-2">
                          <FiTrash2 /> Clear Cart
                        </button>
                     )}
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 font-bold">
                       <FiShoppingCart className="text-6xl mx-auto mb-4 opacity-50" />
                       <p>{t.emptyCart}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 border border-gray-100 rounded-xl bg-gray-50 hover:border-gray-200 transition">
                          <div className="w-14 h-14 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                            {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-2xl">{item.imageEmoji}</span>}
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
                      <div className="border border-gray-100 bg-gray-50 p-4 rounded-xl mt-6 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subtotal:</span>
                        <span className="text-xl sm:text-2xl font-black text-gray-900">TZS {cartTotal.toLocaleString()}</span>
                      </div>
                      <button onClick={handleProceedToLocation} className="w-full bg-[#0F3B4E] hover:bg-[#0A2633] text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition shadow-lg">
                         {t.proceedLocation} <FiChevronRight />
                      </button>
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
                        <option value="Dar es Salaam">Dar es Salaam (Free Delivery)</option>
                        <option value="Mwanza">Mwanza (+ TZS 10,000)</option>
                        <option value="Arusha">Arusha (+ TZS 10,000)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Address</label>
                      <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F2A900]" placeholder="Example: Kinondoni, Mkwajuni" />
                    </div>
                    <div className="flex gap-3 pt-4">
                       <button onClick={() => setWorkflowStep(1)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                       <button onClick={() => { if(region && address) setWorkflowStep(3); else alert('Please fill in Region and Full Address'); }} disabled={!address} className="flex-1 bg-[#0F3B4E] disabled:bg-gray-300 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg">
                          {t.proceedPayment} <FiChevronRight />
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {workflowStep === 3 && (
                <form onSubmit={handlePlaceOrder} className="max-w-xl mx-auto animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><FiShield className="text-green-500"/> {t.payment}</h3>
                  <div className="bg-[#F2A900]/10 border border-[#F2A900] rounded-xl p-4 mb-6">
                     <p className="font-bold text-gray-900 text-sm">Pay On Delivery (COD)</p>
                     <p className="text-xs text-gray-600 mt-1">Pay when you receive the product.</p>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 font-medium"><span>{t.deliveryFee}</span><span>TZS {shippingFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg sm:text-xl font-black text-gray-900 border-t border-gray-200 pt-3"><span>{t.grandTotal}</span><span>TZS {grandTotal.toLocaleString()}</span></div>
                    {upfrontPayment > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center mt-4">
                        <span className="block text-xs font-black text-red-600 uppercase">{t.upfront}</span>
                        <span className="font-black text-red-600 text-base">TZS {upfrontPayment.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                     <button type="button" onClick={() => setWorkflowStep(2)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                     <button type="submit" disabled={checkoutLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
                       {checkoutLoading ? 'Processing...' : <><FiLock /> {t.confirmOrder}</>}
                     </button>
                  </div>
                </form>
              )}

              {workflowStep === 4 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><FiCheckCircle className="text-6xl text-green-500 animate-bounce" /></div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Order Successful!</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">{t.successMsg}</p>
                  <button onClick={() => router.push('/profile')} className="w-full max-w-sm mx-auto bg-[#0F3B4E] hover:bg-[#0A2633] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg">
                    <FiUser /> {t.viewProfile}
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