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
import MainHeader from './components/navigation/MainHeader';
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
    newArrivalsDesc: "Latest items just landed in our warehouse.",
    justForYou: "Just For You",
    loading: "Loading store...",
    noProducts: "No products available currently.",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    switchLang: "Badili Kiswahili",
    searchPlaceholder: "Search for products, brands and more...",
    cart: "Cart Review",
    location: "Location",
    payment: "Payment",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Location",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! We've sent an SMS and Email to your phone with the Invoice and Receipt.",
    viewProfile: "View Invoice in My Profile",
    deliveryFee: "Shipping Fee",
    grandTotal: "Grand Total",
    upfront: "Required Upfront (20%)",
    signIn: "Sign In",
    register: "Create Account"
  },
  sw: {
    liveDeals: "Ofa Kabambe",
    liveDealsDesc: "Ofa za muda maalum - Usipitwe!",
    newArrivals: "Bidhaa Mpya",
    newArrivalsDesc: "Mizigo mipya iliyoingia ghalani hivi karibuni.",
    justForYou: "Zilizopendekezwa",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa iliyopo kwa sasa.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    switchLang: "Switch to English",
    searchPlaceholder: "Tafuta bidhaa, kampuni au aina...",
    cart: "Kikapu Chako",
    location: "Mahali",
    payment: "Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Mahali",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! Tumekutumia SMS na Barua Pepe (Email) yenye Risiti na Invoice.",
    viewProfile: "Tazama Risiti Kwenye Profaili",
    deliveryFee: "Gharama ya Usafiri",
    grandTotal: "Jumla Kuu",
    upfront: "Kianzio cha Kulipia (20%)",
    signIn: "Ingia Akauntini",
    register: "Jisajili Sasa"
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
      const scrollAmount = direction === 'left' ? -300 : 300;
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

  const SkeletonCard = () => (
    <div className="min-w-[200px] sm:min-w-[220px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-pulse snap-start flex flex-col h-full">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="mt-auto flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    return (
      <div className="min-w-[200px] sm:min-w-[220px] max-w-[220px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col snap-start cursor-pointer" onClick={() => setSelectedProduct(product)}>
        
        <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition">
          <FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}

        <div className="aspect-square bg-white border border-gray-50 rounded-lg mb-3 flex items-center justify-center p-2 relative overflow-hidden group-hover:bg-gray-50 transition">
          {product.imageUrl ? (
            <img src={`${apiUrl}${product.imageUrl}`} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition duration-500" />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition duration-500">{product.imageEmoji}</span>
          )}
        </div>
        
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2 group-hover:text-[#F2A900] transition">{product.name}</h3>
        
        <div className="flex flex-col mb-3 mt-1">
          <span className="text-lg font-black text-[#0F172A]">TZS {product.price.toLocaleString()}</span>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">TZS {product.oldPrice.toLocaleString()}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
            <div className="flex items-center text-[#F2A900] text-[10px]">
              ★★★★★ <span className="text-gray-400 ml-1 font-medium">({Math.floor(Math.random() * 200) + 50})</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#F2A900] hover:text-[#0F172A] hover:border-[#F2A900] hover:scale-110 transition-all shadow-sm"
            >
              <FiShoppingCart className="text-sm" />
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] text-gray-900 font-sans antialiased pb-16 md:pb-0">
      <TopTicker />
      
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className={`relative w-full flex border-2 ${showSuggestions ? 'border-[#F2A900] rounded-t-xl' : 'border-[#F2A900] rounded-full'} overflow-hidden transition-all bg-white`}>
              <select className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs outline-none hidden lg:block font-medium"><option>All Categories</option></select>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => { if(searchQuery) setShowSuggestions(true); }}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent" 
              />
              <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0F172A] hover:bg-yellow-500 transition"><FiSearch className="text-lg" /></button>
            </div>
            
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(item => (
                    <div key={item.id} onClick={() => { setSelectedProduct(item); setShowSuggestions(false); setSearchQuery(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center p-1">
                        {item.imageUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${item.imageUrl}`} className="w-full h-full object-contain" /> : item.imageEmoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <span className="text-sm font-black text-[#0F172A]">TZS {item.price.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={toggleLanguage} className="hidden lg:flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition">
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
            </button>
            <button onClick={openCartWorkflow} className="relative text-gray-700 hover:text-[#F2A900] transition flex flex-col items-center group">
              <div className="relative">
                <FiShoppingCart className="text-2xl group-hover:scale-110 transition" />
                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cart.length}</span>}
              </div>
              <span className="text-[10px] mt-0.5 font-bold">Cart</span>
            </button>
            {user ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 shadow-sm" onClick={() => router.push('/profile')}>
                <div className="w-6 h-6 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                <span className="text-xs font-bold hidden md:block">{user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex flex-col items-center text-gray-700 hover:text-[#F2A900] transition group">
                <FiUser className="text-2xl group-hover:scale-110 transition" />
                <span className="text-[10px] mt-0.5 font-bold">Account</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 flex flex-col lg:flex-row gap-6">
        
        <div className="w-full lg:w-[260px] xl:w-[280px] flex-shrink-0 flex flex-col gap-6">
          <SidebarCategories />
          <div className="hidden lg:block bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-gray-800 hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A900]/20 rounded-full blur-2xl"></div>
            <p className="text-[#F2A900] font-bold text-xs mb-1 relative z-10 uppercase tracking-widest">Special Offer</p>
            <h3 className="text-2xl font-black leading-tight mb-2 relative z-10">Up to <span className="text-[#F2A900]">40% Off</span></h3>
            <p className="text-xs text-gray-300 mb-6 relative z-10">On selected items</p>
            <button className="bg-[#F2A900] text-[#0F172A] text-xs font-bold px-5 py-2.5 rounded-full relative z-10 hover:bg-yellow-500 transition shadow-lg shadow-[#F2A900]/20">Shop Now &gt;</button>
            <div className="mt-8 text-center relative z-10 text-6xl drop-shadow-xl animate-bounce">🎁</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 min-w-0">
          
          <HeroSlider />
          <TrustBadges />

          <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-lg"><FiZap className="text-xl text-red-500 fill-current" /></div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{t.liveDeals}</h2>
                  <span className="hidden sm:block text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.liveDealsDesc}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                  <span className="text-xs font-bold text-red-500 uppercase">Ends in:</span>
                  <div className="flex gap-1 text-center items-center">
                    <span className="bg-white text-red-600 font-black rounded px-1.5 py-0.5 shadow-sm">03</span><span className="font-bold text-red-300">:</span>
                    <span className="bg-white text-red-600 font-black rounded px-1.5 py-0.5 shadow-sm">45</span>
                  </div>
                </div>
                <div className="hidden md:flex gap-2">
                  <button onClick={() => scrollCarousel(flashDealsRef, 'left')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-gray-600"><FiChevronLeft /></button>
                  <button onClick={() => scrollCarousel(flashDealsRef, 'right')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-gray-600"><FiChevronRight /></button>
                </div>
              </div>
            </div>

            <div ref={flashDealsRef} className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar scroll-smooth">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : products.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm w-full">{t.noProducts}</div>
              ) : (
                /* HAPA NDIPO MABADILIKO YAMEFANYIKA: TUNAONYESHA BIDHAA ZOTE BILA KUJALI KAMA INA PUNGUZO (oldPrice) */
                products.map(product => <ProductCard key={`flash-${product.id}`} product={product} />)
              )}
            </div>
          </div>

          <div className="relative mt-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">{t.newArrivals}</h2>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{t.newArrivalsDesc}</span>
              </div>
              <div className="hidden md:flex gap-2">
                 <button onClick={() => scrollCarousel(newArrivalsRef, 'left')} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition text-gray-600 border border-gray-200"><FiChevronLeft /></button>
                 <button onClick={() => scrollCarousel(newArrivalsRef, 'right')} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition text-gray-600 border border-gray-200"><FiChevronRight /></button>
              </div>
            </div>

            <div ref={newArrivalsRef} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar scroll-smooth">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                /* HAPA PIA TUNAONYESHA BIDHAA ZOTE */
                products.map(product => <ProductCard key={`new-${product.id}`} product={product} />)
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">{t.justForYou}</h2>
            {isLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                 {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map(product => <ProductCard key={`foryou-${product.id}`} product={product} />)}
              </div>
            )}
            
            <div className="text-center mt-10">
              <button onClick={() => router.push('/shop')} className="bg-white border-2 border-[#0F172A] text-[#0F172A] font-black px-8 py-3 rounded-full hover:bg-[#0F172A] hover:text-white transition duration-300">
                View More Products
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <BrandList />
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />

      {selectedProduct && !isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-fade-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-10 transition"><FiX size={24} /></button>
            <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 aspect-square rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-8">
                  {selectedProduct.imageUrl ? ( <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${selectedProduct.imageUrl}`} alt={selectedProduct.name} className="object-contain w-full h-full" /> ) : ( <span className="text-8xl">{selectedProduct.imageEmoji}</span> )}
                </div>
              </div>
              <div className="w-full lg:w-1/3 flex flex-col">
                <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">{selectedProduct.brand || 'Jtex Authentic'}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mt-2 border-b border-gray-100 pb-3">
                   <span className="text-[#F2A900] text-sm">⭐⭐⭐⭐⭐</span>
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
                   <p className="text-3xl font-black text-gray-900 mb-1">TZS {selectedProduct.price.toLocaleString()}</p>
                   {selectedProduct.oldPrice && <p className="text-sm text-gray-400 line-through mb-2">Was: TZS {selectedProduct.oldPrice.toLocaleString()}</p>}
                   <h3 className="text-lg font-bold text-green-600 mb-5">{selectedProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</h3>
                   <div className="space-y-3">
                     <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); openCartWorkflow(); }} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-bold py-3 rounded-full text-sm transition">Add to Cart</button>
                     <button onClick={() => handleBuyNow(selectedProduct)} className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold py-3 rounded-full text-sm transition">Buy Now</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {loginError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-bold mb-4">{loginError}</div>}
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col animate-fade-in">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"><FiX size={24} /></button>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
               {workflowStep === 1 && (
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-4">{t.cart}</h3>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-4">
                        <span className="font-bold">{item.name} (x{item.quantity})</span>
                        <span className="font-black text-[#0F172A]">TZS {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <button onClick={handleProceedToLocation} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl mt-4">Proceed</button>
                  </div>
               )}
               {workflowStep === 2 && (
                  <div>
                     <h3 className="text-xl font-black mb-4">Location</h3>
                     <select value={region} onChange={e => setRegion(e.target.value)} className="w-full mb-4 border rounded p-3"><option>Dar es Salaam</option><option>Mwanza</option></select>
                     <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-3 mb-4" placeholder="Address" />
                     <button onClick={() => setWorkflowStep(3)} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl">Proceed to Payment</button>
                  </div>
               )}
               {workflowStep === 3 && (
                 <form onSubmit={handlePlaceOrder}>
                   <h3 className="text-xl font-black mb-4">Confirm Payment (COD)</h3>
                   <div className="text-xl font-black mb-4 border-t pt-4">Total: TZS {grandTotal.toLocaleString()}</div>
                   <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl">Place Order</button>
                 </form>
               )}
               {workflowStep === 4 && (
                 <div className="text-center py-10">
                   <h3 className="text-2xl font-black text-green-600">Success!</h3>
                   <button onClick={() => router.push('/profile')} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl mt-6">View Orders</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}