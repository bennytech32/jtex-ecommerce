'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin, FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, FiSmartphone } from 'react-icons/fi';

// ==========================================
// IMPORTS SAHIHI KWA AJILI YA SHOP PAGE (Zinatumia ../)
// ==========================================
import TopTicker from '../components/navigation/TopTicker';
import NavbarLinks from '../components/navigation/NavbarLinks';
import SidebarCategories from '../components/navigation/SidebarCategories';
import Footer from '../components/common/Footer';

const translations = {
  en: {
    shop: "All Products",
    search: "Search products...",
    filter: "Filter by Category",
    all: "All Categories",
    loading: "Loading store...",
    noProducts: "No products match your search.",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    switchLang: "Badili Kiswahili",
    sort: "Sort by Price",
    lowToHigh: "Low to High",
    highToLow: "High to Low",
    // Workflow Translations
    cart: "Cart Review",
    location: "Location",
    payment: "Payment",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Location",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! We've sent an SMS and Email to your phone with the Invoice and Receipt.",
    viewProfile: "View Invoice in My Profile",
    remove: "Remove",
    deliveryFee: "Shipping Fee",
    grandTotal: "Grand Total",
    upfront: "Required Upfront (20%)",
    signIn: "Sign In",
    register: "Create Account"
  },
  sw: {
    shop: "Bidhaa Zote",
    search: "Tafuta bidhaa...",
    filter: "Chuja kwa Kategoria",
    all: "Kategoria Zote",
    loading: "Inafungua duka...",
    noProducts: "Hakuna bidhaa inayofanana na utafutaji wako.",
    addToCart: "Weka Kikapuni",
    buyNow: "Nunua Sasa",
    switchLang: "Switch to English",
    sort: "Panga kwa Bei",
    lowToHigh: "Kuanzia Chini",
    highToLow: "Kuanzia Juu",
    // Workflow Translations
    cart: "Kikapu Chako",
    location: "Mahali",
    payment: "Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Mahali",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! Tumekutumia SMS na Barua Pepe (Email) yenye Risiti na Invoice.",
    viewProfile: "Tazama Risiti Kwenye Profaili",
    remove: "Ondoa",
    deliveryFee: "Gharama ya Usafiri",
    grandTotal: "Jumla Kuu",
    upfront: "Kianzio cha Kulipia (20%)",
    signIn: "Ingia Akauntini",
    register: "Jisajili Sasa"
  }
};

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<'en' | 'sw'>('en'); // Default ni English
  
  // MODAL STATES 
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // WORKFLOW STATES (Cart -> Location -> Payment -> Success)
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 

  // FORM STATES (Login & Checkout)
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
        const res = await fetch('http://localhost:5001/api/products');
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
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortOrder === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high') result = [...result].sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, sortOrder, products]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'sw' : 'en');

  // =====================================
  // INLINE AUTH LOGIC
  // =====================================
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
      const res = await fetch('http://localhost:5001/api/login', {
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
      const res = await fetch('http://localhost:5001/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, phone: registerPhone, email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) handleAuthSuccess(data); else setLoginError(data.error);
    } catch (err) { setLoginError('Kosa la kimtandao.'); }
  };

  // =====================================
  // WORKFLOW ACTIONS
  // =====================================
  const openCartWorkflow = () => {
    setSelectedProduct(null);
    setWorkflowStep(1);
    setIsWorkflowOpen(true);
  };

  const handleProceedToLocation = () => {
    if (!user) setIsLoginOpen(true); 
    else setWorkflowStep(2); 
  };

  const shippingFee = region === 'Dar es Salaam' ? 0 : 10000;
  const grandTotal = cartTotal + shippingFee;
  const upfrontPayment = region === 'Dar es Salaam' ? 0 : grandTotal * 0.2;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    
    const checkoutItems = cart.map(item => ({ 
      productId: item.id, quantity: item.quantity, unitPrice: item.price, subTotal: item.price * item.quantity 
    }));

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, deliveryRegion: region, address, paymentMethod: 'COD', shippingFee, upfrontPayment, items: checkoutItems })
      });
      if (res.ok) {
        setWorkflowStep(4); 
        clearCart(); 
      }
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  const handleBuyNow = (product: any) => {
    setSelectedProduct(null);
    addToCart(product); 
    setWorkflowStep(1);
    setIsWorkflowOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased">
      <TopTicker />
      
      {/* HEADER YENYE CART POPUP */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-gray-900 tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          <div className="flex items-center gap-6">
            <button onClick={openCartWorkflow} className="relative text-gray-700 hover:text-[#F2A900] transition p-2">
              <FiShoppingCart className="text-2xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200" onClick={() => router.push('/profile')}>
                <div className="w-6 h-6 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                <span className="text-xs font-bold">{user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="text-xs font-bold bg-[#0F172A] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8 mt-4">
        
        {/* ========================================================== */}
        {/* SIDEBAR YA KUCHUJA (FILTERING) NA ORIGINAL CATEGORIES      */}
        {/* ========================================================== */}
        <div className="w-full lg:w-[280px] lg:min-w-[280px] flex-shrink-0 flex flex-col gap-6">
          
          {/* ORIGINAL SIDEBAR YAKO YA CATEGORIES */}
          <SidebarCategories />

          {/* FILTER YA REAL DATA INAKAA CHINI YAKE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 border-b pb-2"><FiFilter className="text-[#F2A900]" /> {t.filter}</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActiveCategory('All')} className={`w-full text-left px-3 py-2 rounded-lg font-bold transition ${activeCategory === 'All' ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t.all}</button></li>
              {categories.map(category => (
                <li key={category}><button onClick={() => setActiveCategory(category)} className={`w-full text-left px-3 py-2 rounded-lg font-bold transition ${activeCategory === category ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{category}</button></li>
              ))}
            </ul>
            <div className="mt-8">
               <h3 className="font-black text-gray-900 mb-3 text-sm">{t.sort}</h3>
               <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none font-medium">
                 <option value="default">Default</option>
                 <option value="low">{t.lowToHigh}</option>
                 <option value="high">{t.highToLow}</option>
               </select>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* ENEO LA BIDHAA LINALO BADILIKA (MAIN SHOP AREA)            */}
        {/* ========================================================== */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900">{activeCategory === 'All' ? t.shop : activeCategory}</h1>
            <div className="flex w-full md:w-auto items-center gap-4">
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.search} className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-[#F2A900] transition" />
              </div>
              <button onClick={toggleLanguage} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <FiGlobe className="text-[#0F172A]" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 font-bold text-gray-500 animate-pulse text-lg">{t.loading}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center text-gray-500 font-medium">{t.noProducts}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col h-full group">
                  <div onClick={() => setSelectedProduct(product)} className="relative aspect-square w-full bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center cursor-pointer">
                    {product.imageUrl ? (
                      <img src={`http://localhost:5001${product.imageUrl}`} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition duration-300">{product.imageEmoji}</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{product.category}</span>
                    <h3 onClick={() => setSelectedProduct(product)} className="text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-[#F2A900]">{product.name}</h3>
                    <div className="mt-auto space-y-2">
                      <span className="text-base font-black text-[#0F172A]">TZS {product.price.toLocaleString()}</span>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={() => addToCart(product)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold py-2 rounded-lg transition">{t.addToCart}</button>
                        <button onClick={() => handleBuyNow(product)} className="bg-[#F2A900] hover:bg-yellow-500 text-[#0F172A] text-[11px] font-bold py-2 rounded-lg transition">{t.buyNow}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* ======================================================== */}
      {/* 1. AMAZON-STYLE PRODUCT VIEW MODAL (INLINE VIEW)         */}
      {/* ======================================================== */}
      {selectedProduct && !isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-fade-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-10 transition"><FiX size={24} /></button>
            <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 aspect-square rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-8">
                  {selectedProduct.imageUrl ? ( <img src={`http://localhost:5001${selectedProduct.imageUrl}`} alt={selectedProduct.name} className="object-contain w-full h-full" /> ) : ( <span className="text-8xl">{selectedProduct.imageEmoji}</span> )}
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

      {/* ======================================================== */}
      {/* 2. INLINE LOGIN & REGISTER MODAL                         */}
      {/* ======================================================== */}
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
                    <input type="text" required value={registerName} onChange={e => setRegisterName(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Full Name" />
                    <input type="tel" required value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Phone Number" />
                  </>
                )}
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Email Address" />
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm focus:border-[#F2A900]" placeholder="Password" />
                <button type="submit" className="w-full bg-[#0F172A] text-white font-bold py-3.5 rounded-xl text-sm mt-2 hover:bg-gray-800">{authMode === 'login' ? 'Login to Continue' : 'Register to Continue'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MULTI-STEP WORKFLOW MODAL (Cart -> Location -> Pay)   */}
      {/* ======================================================== */}
      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col animate-fade-in">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"><FiX size={24} /></button>
            
            <div className="bg-gray-50 border-b border-gray-200 p-6 pt-8 flex items-center justify-between">
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 1 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 1 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>1</div>
                 <span className="text-[10px] font-bold uppercase">{t.cart}</span>
               </div>
               <FiChevronRight className="text-gray-300" />
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 2 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 2 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>2</div>
                 <span className="text-[10px] font-bold uppercase">{t.location}</span>
               </div>
               <FiChevronRight className="text-gray-300" />
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 3 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 3 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>3</div>
                 <span className="text-[10px] font-bold uppercase">{t.payment}</span>
               </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              
              {workflowStep === 1 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{t.cart}</h3>
                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-bold">{t.emptyCart}</div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                            {item.imageUrl ? <img src={`http://localhost:5001${item.imageUrl}`} className="object-contain w-full h-full p-1" /> : <span className="text-2xl">{item.imageEmoji}</span>}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-black text-[#0F172A] mt-1">TZS {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><FiTrash2 /></button>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Subtotal:</span>
                        <span className="text-2xl font-black text-gray-900">TZS {cartTotal.toLocaleString()}</span>
                      </div>
                      <button onClick={handleProceedToLocation} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                         {t.proceedLocation} <FiChevronRight />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {workflowStep === 2 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiMapPin className="text-[#F2A900]"/> {t.location}</h3>
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
                    <button onClick={() => setWorkflowStep(3)} disabled={!address} className="w-full bg-[#0F172A] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition">
                       {t.proceedPayment} <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {workflowStep === 3 && (
                <form onSubmit={handlePlaceOrder}>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiShield className="text-green-500"/> {t.payment}</h3>
                  <div className="bg-[#F2A900]/10 border border-[#F2A900] rounded-xl p-4 mb-6">
                     <p className="font-bold text-gray-900 text-sm">Pay On Delivery (COD)</p>
                     <p className="text-xs text-gray-600 mt-1">Pay when you receive the product.</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold">TZS {cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600"><span>{t.deliveryFee}</span><span className="font-bold">TZS {shippingFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3"><span>{t.grandTotal}</span><span>TZS {grandTotal.toLocaleString()}</span></div>
                    {upfrontPayment > 0 && (
                      <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex justify-between items-center mt-4">
                        <span className="block text-xs font-black text-red-600 uppercase">{t.upfront}</span>
                        <span className="font-black text-red-600 text-lg">TZS {upfrontPayment.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={checkoutLoading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-6 transition hover:bg-green-700 shadow-lg">
                    {checkoutLoading ? 'Processing...' : t.confirmOrder}
                  </button>
                </form>
              )}

              {workflowStep === 4 && (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-7xl text-green-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Order Successful!</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 mb-6 flex items-start gap-3 text-left">
                    <FiSmartphone className="text-blue-600 text-3xl flex-shrink-0" />
                    <p className="text-sm text-blue-800 font-medium">{t.successMsg}</p>
                  </div>
                  <button onClick={() => router.push('/profile')} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
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