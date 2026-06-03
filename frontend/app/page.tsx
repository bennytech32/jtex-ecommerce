'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext'; 
import { 
  FiShoppingCart, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, 
  FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, FiChevronLeft, 
  FiSmartphone, FiZap, FiSearch, FiHeart 
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
    liveDeals: "Flash Deals",
    liveDealsDesc: "Limited time offers - Don't miss out!",
    newArrivals: "New Arrivals",
    newArrivalsDesc: "Latest items just landed.",
    justForYou: "Just For You",
    loading: "Loading store...",
    noProducts: "No products available currently.",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    searchPlaceholder: "Search products, brands...",
    cart: "Cart Review",
    location: "Location",
    payment: "Payment",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Location",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! SMS/Email sent.",
    deliveryFee: "Shipping Fee",
    grandTotal: "Grand Total",
    upfront: "Required Upfront",
    signIn: "Sign In",
    register: "Register"
  },
  sw: {
    liveDeals: "Ofa Kabambe",
    liveDealsDesc: "Muda maalum - Usipitwe!",
    newArrivals: "Bidhaa Mpya",
    newArrivalsDesc: "Mizigo mipya iliyoingia.",
    justForYou: "Zilizopendekezwa",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa iliyopo kwa sasa.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    searchPlaceholder: "Tafuta bidhaa, aina...",
    cart: "Kikapu Chako",
    location: "Mahali",
    payment: "Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Mahali",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! SMS/Email imetumwa.",
    deliveryFee: "Gharama ya Usafiri",
    grandTotal: "Jumla Kuu",
    upfront: "Kianzio",
    signIn: "Ingia",
    register: "Jisajili"
  }
};

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const flashDealsRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const filteredSuggestions = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
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

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchRealProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();
        setProducts(data.filter((p: any) => p.stockQuantity > 0));
      } catch (error) {
        console.error("Kosa kuvuta bidhaa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealProducts();
  }, []);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: loginEmail, password: loginPassword }) });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error);
    } catch (err) { setLoginError('Kosa la kimtandao.'); }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: registerName, phone: registerPhone, email: loginEmail, password: loginPassword }) });
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
    e.preventDefault(); setCheckoutLoading(true);
    const checkoutItems = cart.map(item => ({ productId: item.id, quantity: item.quantity, unitPrice: item.price, subTotal: item.price * item.quantity }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, deliveryRegion: region, address, paymentMethod: 'COD', shippingFee, upfrontPayment, items: checkoutItems }) });
      if (res.ok) { setWorkflowStep(4); clearCart(); }
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  const handleBuyNow = (product: any) => { setSelectedProduct(null); addToCart(product); setWorkflowStep(1); setIsWorkflowOpen(true); };

  // ==========================================
  // MOBILE RESPONSIVE COMPONENTS
  // ==========================================
  const SkeletonCard = () => (
    <div className="min-w-[140px] sm:min-w-[200px] bg-white rounded-xl p-3 border border-gray-100 shadow-sm animate-pulse snap-start flex flex-col h-full">
      <div className="aspect-square bg-gray-200 rounded-lg mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    return (
      <div className="min-w-[145px] sm:min-w-[200px] max-w-[160px] sm:max-w-[220px] bg-white rounded-xl p-2.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col snap-start cursor-pointer" onClick={() => setSelectedProduct(product)}>
        
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
            <img src={`${apiUrl}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-500" />
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
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#F2A900] transition-all shadow-sm"
            >
              <FiShoppingCart className="text-xs sm:text-sm" />
            </button>
        </div>
      </div>
    );
  };

  // LOGIC YA KUTENGENEZA FLASH DEALS IKIWA HAZIPO
  const flashDeals = products.filter(p => p.oldPrice).length > 0 
    ? products.filter(p => p.oldPrice) 
    : products.slice(0, 6).map(p => ({ ...p, oldPrice: Math.floor(p.price * 1.3) })); // Inatengeneza punguzo la uongo (30%) kuweka duka hai

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] text-gray-900 font-sans antialiased pb-20 md:pb-0">
      <TopTicker />
      
      {/* HEADER YA SIMU NA DESKTOP */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-14 sm:h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full flex border-2 ${showSuggestions ? 'border-[#F2A900] rounded-t-xl' : 'border-[#F2A900] rounded-full'} overflow-hidden transition-all bg-white`}>
              <select className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs outline-none hidden lg:block font-medium"><option>All Categories</option></select>
              <input 
                type="text" placeholder={t.searchPlaceholder} value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => { if(searchQuery) setShowSuggestions(true); }}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent" 
              />
              <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0F172A] hover:bg-yellow-500 transition"><FiSearch className="text-lg" /></button>
            </div>
            
            {/* SUGGESTIONS DESKTOP */}
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {filteredSuggestions.map(item => (
                  <div key={item.id} onClick={() => { setSelectedProduct(item); setShowSuggestions(false); setSearchQuery(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center p-1">
                      {item.imageUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${item.imageUrl}`} className="w-full h-full object-contain" /> : item.imageEmoji}
                    </div>
                    <div className="flex-1"><h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4></div>
                    <span className="text-sm font-black text-[#0F172A]">TZS {item.price.toLocaleString()}</span>
                  </div>
                ))}
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
                {cart.length > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cart.length}</span>}
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
        
        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full flex border border-gray-300 rounded-full overflow-hidden bg-gray-50">
             <input type="text" placeholder={t.searchPlaceholder} className="flex-1 px-4 py-2 text-xs outline-none bg-transparent" />
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
          
          <HeroSlider />
          <TrustBadges />

          {/* FLASH DEALS SECTION */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-gray-50 pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-red-50 p-1.5 sm:p-2 rounded-lg"><FiZap className="text-lg sm:text-xl text-red-500 fill-current" /></div>
                <div>
                  <h2 className="text-base sm:text-xl font-black text-gray-900 leading-tight">{t.liveDeals}</h2>
                  <span className="hidden sm:block text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.liveDealsDesc}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-red-100">
                  <span className="text-[10px] sm:text-xs font-bold text-red-500 uppercase">Ends in:</span>
                  <div className="flex gap-1 text-center items-center">
                    <span className="bg-white text-red-600 font-black rounded px-1 py-0.5 text-xs shadow-sm">03</span><span className="font-bold text-red-300">:</span>
                    <span className="bg-white text-red-600 font-black rounded px-1 py-0.5 text-xs shadow-sm">45</span>
                  </div>
                </div>
              </div>
            </div>

            <div ref={flashDealsRef} className="flex overflow-x-auto gap-3 pb-3 snap-x hide-scrollbar scroll-smooth">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                flashDeals.map(product => <ProductCard key={`flash-${product.id}`} product={product} />)
              )}
            </div>
          </div>

          {/* NEW ARRIVALS */}
          <div className="mt-1 sm:mt-2">
            <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
              <div>
                <h2 className="text-base sm:text-xl font-black text-gray-900">{t.newArrivals}</h2>
              </div>
            </div>
            <div ref={newArrivalsRef} className="flex overflow-x-auto gap-3 pb-3 snap-x hide-scrollbar scroll-smooth">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                [...products].reverse().slice(0, 8).map(product => <ProductCard key={`new-${product.id}`} product={product} />)
              )}
            </div>
          </div>

          {/* JUST FOR YOU (GRID) */}
          <div className="mt-2 border-t border-gray-200 pt-6 px-1">
            <h2 className="text-lg sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">{t.justForYou}</h2>
            {isLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                 {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map(product => <ProductCard key={`foryou-${product.id}`} product={product} />)}
              </div>
            )}
            
            <div className="text-center mt-8 sm:mt-10 mb-6">
              <button onClick={() => router.push('/shop')} className="bg-white border-2 border-[#0F172A] text-[#0F172A] text-sm sm:text-base font-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-[#0F172A] hover:text-white transition duration-300">
                View More Products
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <div className="hidden sm:block"><BrandList /></div>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />

      {/* POPUPS ZA PRODUCT, LOGIN NA CART ZIMEBAKI KAMA ZILIVYO */}
      {selectedProduct && !isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-fade-in pb-20 sm:pb-0">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-10 transition"><FiX size={20} /></button>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 p-4 sm:p-8">
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-50 aspect-square rounded-xl border border-gray-200 flex items-center justify-center p-4">
                  {selectedProduct.imageUrl ? ( <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${selectedProduct.imageUrl}`} alt={selectedProduct.name} className="object-contain w-full h-full" /> ) : ( <span className="text-6xl sm:text-8xl">{selectedProduct.imageEmoji}</span> )}
                </div>
              </div>
              <div className="w-full lg:w-1/3 flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mt-2 border-b border-gray-100 pb-3">
                   <span className="text-[#F2A900] text-xs sm:text-sm">⭐⭐⭐⭐⭐</span>
                   <span className="text-blue-600 text-[10px] sm:text-xs">In Stock: {selectedProduct.stockQuantity}</span>
                </div>
                <div className="mt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                   <p><strong>Category:</strong> {selectedProduct.category}</p>
                   {selectedProduct.specifications && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100 font-mono text-[10px] sm:text-xs">{selectedProduct.specifications}</div>
                   )}
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm bg-white">
                   <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">TZS {selectedProduct.price.toLocaleString()}</p>
                   {selectedProduct.oldPrice && <p className="text-xs sm:text-sm text-gray-400 line-through mb-4">Was: TZS {selectedProduct.oldPrice.toLocaleString()}</p>}
                   <div className="space-y-2 sm:space-y-3">
                     <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); openCartWorkflow(); }} className="w-full bg-[#FFD814] text-black font-bold py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-sm">Add to Cart</button>
                     <button onClick={() => handleBuyNow(selectedProduct)} className="w-full bg-[#FFA41C] text-black font-bold py-2.5 sm:py-3 rounded-full text-xs sm:text-sm shadow-sm">Buy Now</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN & WORKFLOW POPUPS... */}
      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm pb-16">
          {/* ... (Workflow inabaki kama ilivyo, tayari iko responsive) */}
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-fade-in">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"><FiX size={20} /></button>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
               {workflowStep === 1 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4">{t.cart}</h3>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center mb-3 sm:mb-4 border-b pb-3 sm:pb-4">
                        <span className="font-bold text-xs sm:text-sm">{item.name} <span className="text-[#F2A900]">(x{item.quantity})</span></span>
                        <span className="font-black text-[#0F172A] text-sm sm:text-base">TZS {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <button onClick={handleProceedToLocation} className="w-full bg-[#0F172A] text-white font-bold py-3 sm:py-4 rounded-xl mt-2 text-sm sm:text-base">Proceed Checkout</button>
                  </div>
               )}
               {workflowStep === 2 && (
                  <div>
                     <h3 className="text-lg sm:text-xl font-black mb-4">Location</h3>
                     <select value={region} onChange={e => setRegion(e.target.value)} className="w-full mb-3 sm:mb-4 border rounded-xl p-3 text-sm"><option>Dar es Salaam</option><option>Mwanza</option></select>
                     <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded-xl p-3 mb-4 text-sm" placeholder="Full Address" />
                     <button onClick={() => setWorkflowStep(3)} className="w-full bg-[#0F172A] text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base">Proceed to Payment</button>
                  </div>
               )}
               {workflowStep === 3 && (
                 <form onSubmit={handlePlaceOrder}>
                   <h3 className="text-lg sm:text-xl font-black mb-4">Confirm Order</h3>
                   <div className="text-lg sm:text-xl font-black mb-4 border-t pt-4">Total: TZS {grandTotal.toLocaleString()}</div>
                   <button type="submit" disabled={checkoutLoading} className="w-full bg-green-600 text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base">{checkoutLoading ? 'Processing...' : 'Place Order Now'}</button>
                 </form>
               )}
               {workflowStep === 4 && (
                 <div className="text-center py-8 sm:py-10">
                   <h3 className="text-xl sm:text-2xl font-black text-green-600 mb-4">Order Successful!</h3>
                   <button onClick={() => { setIsWorkflowOpen(false); router.push('/profile'); }} className="w-full bg-[#0F172A] text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base">View Invoice</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}