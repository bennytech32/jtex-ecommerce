'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { 
  FiSearch, FiMapPin, FiShoppingCart, FiUser, FiPackage, 
  FiHeart, FiHeadphones, FiChevronDown, FiGrid, FiList, 
  FiMonitor, FiSmartphone, FiShoppingBag, FiCoffee, FiSmile,
  FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMic, FiCamera, 
  FiHome, FiZap, FiChevronRight, FiMail, FiPhone, FiFacebook, 
  FiTwitter, FiInstagram, FiLinkedin, FiSend, FiMessageCircle, 
  FiBell, FiSettings, FiFilter, FiChevronLeft, FiBox
} from 'react-icons/fi';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Undo URL slug formatting (e.g. 'home-kitchen' -> 'Home & Kitchen')
  const categoryNameStr = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  useEffect(() => {
    // Check Authentication Status
    const token = localStorage.getItem('jtex_token');
    setIsLoggedIn(!!token);

    const fetchData = async () => {
      try {
        // Fetch Real Products
        const prodRes = await fetch(`${getApiUrl()}/api/products`);
        if (prodRes.ok) {
          const data = await prodRes.json(); // <-- Hapa ndipo kosa lilipokuwa (res badala ya prodRes)
          
          // Filter products by the current category slug
          const filtered = data.filter((p: any) => 
             p.category?.toLowerCase() === params.slug.toLowerCase().replace(/-/g, ' ') ||
             p.category?.toLowerCase().replace(/ & /g, '-') === params.slug.toLowerCase()
          );
          setProducts(filtered.length > 0 ? filtered : data); // fallback to all if empty
          
          // Dynamically extract categories from DB
          const uniqueCats = Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean);
          setAllCategories(uniqueCats.map((c: any) => ({ name: c, slug: c.toLowerCase().replace(/ & /g, '-') })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.slug]);

  const cartCount = cart?.length || 0;

  // Sidebar Menu Logic (Auth vs Guest)
  const renderSidebarMenu = () => {
    if (isLoggedIn) {
      return (
        <>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/')}><FiHome size={18}/> Home</button>
          <button className="flex items-center gap-3 px-6 py-2.5 bg-orange-50 text-[#F2A900] border-r-4 border-[#F2A900] font-bold transition"><FiGrid size={18}/> Categories</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiZap size={18}/> Deals <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/profile')}><FiPackage size={18}/> Orders</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiMessageCircle size={18}/> Messages <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">3</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiBell size={18}/> Notifications <span className="ml-auto bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">12</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiHeart size={18}/> Wishlist</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/checkout')}><FiShoppingCart size={18}/> Cart <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount > 0 ? cartCount : 3}</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/profile')}><FiUser size={18}/> Account</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiSettings size={18}/> Settings</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/help')}><FiHeadphones size={18}/> Help & Support</button>
        </>
      );
    } else {
      // Guest Sidebar (Simplified)
      return (
        <>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/')}><FiHome size={18}/> Home</button>
          <button className="flex items-center gap-3 px-6 py-2.5 bg-orange-50 text-[#F2A900] border-r-4 border-[#F2A900] font-bold transition"><FiGrid size={18}/> Categories</button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiZap size={18}/> Deals <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded">Hot</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/checkout')}><FiShoppingCart size={18}/> Cart <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount > 0 ? cartCount : 3}</span></button>
          <button className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium" onClick={() => router.push('/help')}><FiHeadphones size={18}/> Help & Support</button>
          <div className="mt-4 px-6">
             <button className="w-full bg-[#0A101D] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-sm text-xs">Sign In / Register</button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP HEADER */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <div className="cursor-pointer flex text-3xl font-black italic tracking-tighter" onClick={() => router.push('/')}>
              <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">Dar es Salaam, Kariakoo <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-11 bg-white rounded-lg overflow-hidden">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">
              All <FiChevronDown/>
            </button>
            <input type="text" placeholder="Search products, brands..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <div className="flex items-center gap-3 px-3 text-gray-400">
              <FiCamera className="cursor-pointer hover:text-gray-600"/>
              <FiMic className="cursor-pointer hover:text-gray-600"/>
            </div>
            <button className="h-full px-6 bg-[#F2A900] text-black hover:bg-yellow-500 transition">
              <FiSearch size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src="https://flagcdn.com/w20/tz.png" alt="TZ" className="w-5 rounded-sm"/>
              <span className="text-xs font-bold">TZ <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push('/profile')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={22} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push('/profile')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-full transition">
              <FiUser size={18}/>
              <span className="text-xs font-bold">My Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiMapPin size={20} className="text-[#F2A900]"/>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-gray-400">Deliver to</span>
              <span className="text-sm font-bold flex items-center gap-1">Kariakoo <FiChevronDown size={14}/></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative" onClick={() => router.push('/checkout')}>
                <FiShoppingCart size={22}/>
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
             </div>
          </div>
        </div>
        <div className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm">
          <input type="text" placeholder="Search Jtex" className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
          <div className="flex items-center gap-3 px-3 text-gray-400">
            <FiMic size={18} className="cursor-pointer"/>
            <FiCamera size={18} className="cursor-pointer"/>
          </div>
          <button className="h-full px-5 bg-[#F2A900] text-black">
            <FiSearch size={18} />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN LAYOUT */}
      {/* ========================================================= */}
      <div className="max-w-[1500px] mx-auto lg:px-6 lg:py-6 flex gap-6">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm mb-6 flex flex-col">
             {renderSidebarMenu()}
          </nav>

          <div className="bg-[#0A101D] text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A900]/20 rounded-full blur-3xl"></div>
            <p className="text-xs text-gray-400 font-bold mb-1">Special Offers</p>
            <h3 className="text-3xl font-black text-[#F2A900] mb-2 leading-tight">Up to 40% Off</h3>
            <p className="text-sm text-gray-300 font-medium mb-6">On selected items</p>
            <button className="bg-[#F2A900] text-black text-xs font-black px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition shadow-md w-max">Shop Now <FiArrowRight/></button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 pb-10">
           
           {/* Breadcrumbs */}
           <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
              <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> <FiChevronRight/>
              <span className="hover:text-black cursor-pointer">Categories</span> <FiChevronRight/>
              <span className="text-gray-900">{categoryNameStr || 'Products'}</span>
           </div>

           {/* Category Header */}
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 px-4 lg:px-0">
              <div>
                 <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 capitalize">{categoryNameStr || 'Products'}</h1>
                 <p className="text-sm text-gray-500 font-medium max-w-md">Discover high performance products and accessories for work, study and gaming.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 flex flex-col items-center justify-center shadow-sm w-max">
                 <span className="text-2xl font-black text-gray-900">{products.length}</span>
                 <span className="text-[10px] text-gray-500 font-bold uppercase">Items found</span>
              </div>
           </div>

           {/* Horizontal Sub-categories */}
           <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 lg:px-0 mb-8 pb-2">
              <div className="bg-yellow-50 border-2 border-[#F2A900] rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] cursor-pointer">
                 <FiMonitor size={32} className="text-[#F2A900] mb-2"/>
                 <span className="text-xs font-black text-gray-900">All {categoryNameStr}</span>
                 <span className="text-[10px] text-gray-500 font-bold">{products.length} items</span>
              </div>
              {/* Dynamic Categories from DB */}
              {allCategories.filter(c => c.name !== categoryNameStr).slice(0,5).map((cat, idx) => (
                 <div key={idx} onClick={() => router.push(`/categories/${cat.slug}`)} className="bg-white border border-gray-200 hover:border-[#F2A900] rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] cursor-pointer transition">
                    <FiBox size={32} className="text-gray-400 mb-2"/>
                    <span className="text-xs font-black text-gray-800">{cat.name}</span>
                 </div>
              ))}
              <div className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center min-w-[60px] cursor-pointer transition">
                 <FiChevronRight size={24} className="text-gray-400"/>
              </div>
           </div>

           {/* Filters & Products Layout */}
           <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Filters Sidebar */}
              <div className="hidden lg:block w-[240px] flex-shrink-0">
                 <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-28">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                       <h3 className="font-black text-gray-900 flex items-center gap-2"><FiFilter/> Filters</h3>
                       <button className="text-[10px] font-bold text-blue-600 hover:underline">Clear All</button>
                    </div>
                    
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between items-center cursor-pointer mb-2">
                             <span className="text-xs font-bold text-gray-800">Price Range</span>
                             <FiChevronDown className="text-gray-400"/>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full w-full my-4 relative">
                             <div className="absolute left-[10%] right-[30%] bg-[#F2A900] h-full rounded-full"></div>
                             <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#F2A900] rounded-full"></div>
                             <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#F2A900] rounded-full"></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                             <span>TZS 100,000</span><span>TZS 5,000,000+</span>
                          </div>
                       </div>
                       <hr className="border-gray-100"/>
                       {['Brand', 'Processor', 'RAM', 'Storage', 'Graphics', 'Screen Size', 'Condition'].map(item => (
                          <div key={item}>
                             <div className="flex justify-between items-center cursor-pointer py-1">
                                <span className="text-xs font-bold text-gray-800">{item}</span>
                                <FiChevronDown className="text-gray-400"/>
                             </div>
                             <hr className="border-gray-100 mt-3"/>
                          </div>
                       ))}
                    </div>

                    <button className="w-full mt-6 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition"><FiRefreshCw/> Reset Filters</button>
                 </div>
              </div>

              {/* Products Area */}
              <div className="flex-1">
                 {/* Toolbar */}
                 <div className="flex items-center justify-between mb-6 px-4 lg:px-0">
                    <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5">
                       <span className="text-[10px] font-bold text-gray-500">Sort by:</span>
                       <select className="text-xs font-bold text-gray-900 bg-transparent outline-none cursor-pointer">
                          <option>Popular</option>
                          <option>Newest</option>
                          <option>Price: Low to High</option>
                          <option>Price: High to Low</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setViewMode('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center border transition ${viewMode === 'grid' ? 'border-[#F2A900] text-[#F2A900] bg-yellow-50' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiGrid/></button>
                       <button onClick={() => setViewMode('list')} className={`w-9 h-9 rounded-lg flex items-center justify-center border transition ${viewMode === 'list' ? 'border-[#F2A900] text-[#F2A900] bg-yellow-50' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiList/></button>
                    </div>
                 </div>

                 {/* Products Grid */}
                 {isLoading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
                 ) : products.length > 0 ? (
                    <div className={`grid gap-4 px-4 lg:px-0 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                       {products.map((product: any) => {
                          const visualDiscount = Math.floor(Math.random() * 20) + 5; 
                          const oldPrice = Math.round(product.price * (1 + (visualDiscount/100)));

                          if (viewMode === 'list') {
                            return (
                              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 group hover:border-[#F2A900] transition cursor-pointer">
                                <div className="relative w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                                  <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-{visualDiscount}%</span>
                                  {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                  <h4 className="font-bold text-sm text-gray-800 mb-1">{product.name}</h4>
                                  <p className="text-[10px] text-gray-500 mb-2">High performance computing</p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-black text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-[#F2A900] text-[10px] font-bold"><span className="tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1">({Math.floor(Math.random() * 100)})</span></div>
                                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-[#F2A900] hover:text-black font-bold text-xs flex items-center gap-2 transition"><FiShoppingCart/> Add to Cart</button>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col group hover:border-[#F2A900] transition cursor-pointer">
                              <div className="relative w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-4 p-2">
                                  <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-{visualDiscount}%</span>
                                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden"><FiHeart/></button>
                                  {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300" /> : <span className="text-5xl">📦</span>}
                              </div>
                              <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-1 line-clamp-2 leading-tight">{product.name}</h4>
                              <p className="text-[9px] text-gray-500 mb-2">i5 • 8GB RAM • 512GB SSD</p>
                              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 mb-2 mt-auto">
                                  <span className="font-black text-sm lg:text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                                  <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-3">
                                  <div className="flex items-center text-[#F2A900] text-[10px] font-bold">
                                    <span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium">({Math.floor(Math.random() * 100) + 10})</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black hover:border-[#F2A900] transition">
                                    <FiShoppingCart size={14}/>
                                  </button>
                              </div>
                            </div>
                          )
                       })}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <FiPackage size={48} className="text-gray-300 mb-4"/>
                       <h3 className="text-xl font-black text-gray-900 mb-2">No Products Found</h3>
                       <p className="text-gray-500 text-sm">We couldn't find any products in the "{categoryNameStr}" category.</p>
                    </div>
                 )}

                 {/* Pagination Matching UI */}
                 {products.length > 0 && (
                   <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 px-4 lg:px-0">
                      <span className="text-xs font-bold text-gray-500">Showing 1 – {Math.min(12, products.length)} of {products.length} items</span>
                      <div className="flex items-center gap-1">
                         <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50"><FiChevronLeft/></button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-[#F2A900] text-black font-black">1</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">2</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">3</button>
                         <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                         <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">72</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50"><FiChevronRight/></button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* 4. PROFESSIONAL FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-[#0A101D] text-gray-300 py-12 lg:py-16 pb-28 lg:pb-16 mt-8">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-800 pb-10 mb-10 gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-black text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-400">Get the latest updates on new products and upcoming sales.</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input type="email" placeholder="Enter your email address" className="px-4 py-3 rounded-l-xl w-full lg:w-80 text-gray-900 outline-none text-sm" />
              <button className="bg-[#F2A900] text-black px-6 py-3 rounded-r-xl font-bold flex items-center gap-2 hover:bg-yellow-500 transition text-sm">Subscribe <FiSend /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
            <div>
              <div className="flex text-3xl font-black italic tracking-tighter mb-6"><span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span></div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Your one-stop destination for the best quality electronics, fashion, and home appliances in Tanzania. Shop smart, live better.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiFacebook size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiTwitter size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiInstagram size={18}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#F2A900] hover:text-black transition"><FiLinkedin size={18}/></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => router.push('/about')} className="hover:text-[#F2A900] transition">About Us</button></li>
                <li><button onClick={() => router.push('/categories')} className="hover:text-[#F2A900] transition">Shop Categories</button></li>
                <li><button onClick={() => router.push('/')} className="hover:text-[#F2A900] transition">Flash Sales</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Contact Us</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Customer Service</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">My Account</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Order Tracking</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Returns & Exchanges</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">Shipping Information</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-[#F2A900] transition">FAQs</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-start gap-3"><FiMapPin className="text-[#F2A900] text-lg flex-shrink-0 mt-0.5" /><span>Dar es Salaam, Kariakoo</span></li>
                <li className="flex items-center gap-3"><FiPhone className="text-[#F2A900] text-lg flex-shrink-0" /><span>+255767659586</span></li>
                <li className="flex items-center gap-3"><FiMail className="text-[#F2A900] text-lg flex-shrink-0" /><span>support@jtex.co.tz</span></li>
              </ul>
              <div className="mt-6">
                 <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">We Accept</p>
                 <div className="flex gap-2">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-black text-blue-800">VISA</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-black text-red-600">MASTER</div>
                    <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-[8px] font-black text-white">M-PESA</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
            <p>&copy; {new Date().getFullYear()} Jtex Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 5. MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
         <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiHome size={22} />
            <span className="text-[10px] font-bold">Home</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-[#F2A900]">
            <FiGrid size={22} className="fill-current"/>
            <span className="text-[10px] font-black">Categories</span>
         </button>
         
         <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform" onClick={() => router.push('/')}>
               <FiZap size={24} className="fill-current text-[#F2A900]"/>
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-800 whitespace-nowrap">Flash Sales</span>
         </div>

         <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition relative">
            <FiShoppingCart size={22}/>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
         </button>
         <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-800 transition">
            <FiUser size={22}/>
            <span className="text-[10px] font-bold">Account</span>
         </button>
      </div>

    </div>
  );
}