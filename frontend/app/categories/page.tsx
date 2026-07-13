'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin, 
  FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight, 
  FiSmartphone, FiArrowLeft, FiMoreHorizontal, FiSliders, FiList, FiGrid,
  FiCamera, FiMic, FiMaximize, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiHeart, FiBox, FiMonitor
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

// === CONSTANTS ===
const TANZANIA_REGIONS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", 
  "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", 
  "Mtwara", "Mwanza", "Njombe", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", 
  "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar"
];

export default function CategoryPage({ params }: { params?: { slug?: string } }) {
  const router = useRouter();
  const { cart, addToCart, cartTotal } = useCart();
  
  // FIX: Ulinzi (Fallback) kuzuia Error ya "params.slug is undefined"
  const resolvedSlug = params?.slug || '';
  const categoryNameStr = resolvedSlug 
    ? resolvedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) 
    : 'All Categories';

  // === STATES ===
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz');
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // NEW STATES KWA AJILI YA FILTERS ZINAZOFANYA KAZI
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Modal States (Sasa Inafanana na Home Page)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  const getDeterministicDiscount = (id: string) => {
    if (!id) return 15; 
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) {
      hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 20) + 5; 
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }

    // Fetch Location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
          setUserCountry(data.country_name);
          setCountryCode(data.country_code.toLowerCase());
        } else {
          setUserLocation('Dar es Salaam, Tanzania');
          setUserCountry('Tanzania');
          setCountryCode('tz');
        }
      })
      .catch(() => {
        setUserLocation('Dar es Salaam, Tanzania');
        setUserCountry('Tanzania');
        setCountryCode('tz');
      });

    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${getApiUrl()}/api/products`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          let filtered = data;
          
          if (resolvedSlug && resolvedSlug !== 'all') {
             filtered = data.filter((p: any) => 
               p.category?.toLowerCase() === resolvedSlug.toLowerCase().replace(/-/g, ' ') ||
               p.category?.toLowerCase().replace(/ & /g, '-') === resolvedSlug.toLowerCase()
             );
          }
          
          const finalData = filtered.length > 0 ? filtered : data;
          setProducts(finalData);
          setFilteredProducts(finalData);
          
          const uniqueBrands = Array.from(new Set(finalData.map((p: any) => p.brand))).filter(Boolean);
          setAvailableBrands(['All', ...uniqueBrands] as string[]);
          
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
  }, [resolvedSlug]);

  useEffect(() => {
    let result = products;
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    result = result.filter(p => p.price <= maxPrice);
    if (selectedBrand !== 'All') result = result.filter(p => p.brand === selectedBrand);

    if (sortOrder === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortOrder === 'newest') result = [...result].reverse();

    setFilteredProducts(result);
  }, [searchQuery, maxPrice, selectedBrand, sortOrder, products]);

  const resetFilters = () => {
    setMaxPrice(10000000);
    setSelectedBrand('All');
    setSortOrder('popular');
    setSearchQuery('');
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const cartCount = cart?.length || 0;

  // === PRODUCT CARD COMPONENT (Kama Home Page - Zisizokatika & Same Aspect Ratio) ===
  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const visualDiscount = getDeterministicDiscount(product.id); 
    const oldPrice = Math.round(product.price / (1 - (visualDiscount/100)));

    if (viewMode === 'list') {
      return (
        <div onClick={() => setSelectedProduct(product)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 group hover:border-[#F2A900] transition cursor-pointer">
          <div className="relative w-32 h-32 bg-gray-50/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2 overflow-hidden border border-gray-50">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-800 mb-1 leading-snug line-clamp-2">{product.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-[#F2A900] text-[10px] font-bold"><span className="tracking-tighter">★★★★★</span></div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-[#F2A900] hover:text-black font-bold text-xs flex items-center gap-2 transition"><FiShoppingCart/> Add</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div onClick={() => setSelectedProduct(product)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#F2A900] transition cursor-pointer">
        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
            <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20"><FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""}/></button>
            {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>}
        </div>
        <div className="flex flex-col flex-grow">
            <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">{product.name}</h4>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-2 mt-auto">
                <span className="font-black text-sm lg:text-base text-gray-900">TZS {product.price.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-3">
                <div className="flex items-center text-[#F2A900] text-[10px] font-bold"><span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium hidden sm:inline-block">({Math.floor(Math.random() * 100) + 10})</span></div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black transition">
                  <FiShoppingCart size={14}/>
                </button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* 1. DESKTOP HEADER (REAL LOGO KAMA HOME PAGE) */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img src="/logo.png" alt="Jtex Logo" className="h-16 lg:h-24 cursor-pointer object-contain" onClick={() => router.push('/')} />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">All <FiChevronDown/></button>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, brands..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <div className="flex items-center gap-3 px-3 text-gray-400">
              <FiCamera className="cursor-pointer hover:text-gray-600"/>
              <FiMic className="cursor-pointer hover:text-gray-600"/>
            </div>
            <button className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition"><FiSearch size={20} /></button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-800/50 p-2 rounded-lg transition">
              <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={userCountry} className="w-5 rounded-sm"/>
              <span className="text-xs font-bold uppercase">{countryCode} <FiChevronDown className="inline"/></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiPackage size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Track Order</span>
            </button>
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-2 border border-gray-700 bg-gray-800/50 hover:bg-gray-700 px-4 py-2.5 rounded-full transition">
              <FiUser size={20}/>
              <span className="text-xs font-bold">{user ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE HEADER */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
             <button onClick={() => router.back()} className="p-1"><FiArrowLeft className="text-xl text-gray-300"/></button>
             <img src="/logo.png" alt="Jtex Logo" className="h-8 cursor-pointer object-contain" onClick={() => router.push('/')} />
          </div>
          <div className="flex items-center gap-4">
             <div className="relative" onClick={() => router.push('/checkout')}>
                <FiShoppingCart size={22} className="text-gray-300"/>
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
             </div>
             {user ? (
                <div className="w-7 h-7 bg-[#F2A900] text-black rounded-full flex items-center justify-center font-bold text-[10px]" onClick={() => router.push('/profile')}>{user?.name?.charAt(0) || 'U'}</div>
             ) : (
                <FiUser className="text-xl text-gray-300" onClick={() => router.push('/login')} />
             )}
          </div>
        </div>
        <div className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
          <div className="flex items-center gap-3 px-3 text-gray-400">
            <FiMic size={18} className="cursor-pointer"/>
            <FiCamera size={18} className="cursor-pointer"/>
          </div>
          <button className="h-full px-5 bg-[#F2A900] text-black"><FiSearch size={18} /></button>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto lg:px-6 lg:py-6 flex gap-6 pb-20 md:pb-6 mt-4">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 py-3 shadow-sm flex flex-col sticky top-28">
             <button onClick={() => router.push('/')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiHome size={18}/> Home</button>
             <button className="flex items-center gap-3 px-6 py-2.5 bg-yellow-50 text-[#F2A900] border-r-4 border-[#F2A900] font-bold transition"><FiGrid size={18}/> Categories</button>
             <button onClick={() => router.push('/checkout')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiShoppingCart size={18}/> Cart <span className="ml-auto bg-[#F2A900] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span></button>
             <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-3 px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-[#F2A900] transition font-medium"><FiUser size={18}/> Account</button>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
           
           {/* Breadcrumbs & Title */}
           <div className="px-4 lg:px-0">
              <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                 <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> <FiChevronRight/>
                 <span className="text-gray-900">{categoryNameStr}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                 <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 capitalize">{categoryNameStr}</h1>
                    <p className="text-sm text-gray-500 font-medium">Find the best products and deals available right now.</p>
                 </div>
                 <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 flex flex-col items-center justify-center shadow-sm w-max hidden lg:flex">
                    <span className="text-2xl font-black text-gray-900">{filteredProducts.length}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Items found</span>
                 </div>
              </div>
           </div>

           {/* Horizontal Sub-categories */}
           <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 lg:px-0 mb-8 pb-2">
              <div className="bg-yellow-50 border-2 border-[#F2A900] rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px] cursor-pointer">
                 <FiMonitor size={24} className="text-[#F2A900] mb-2"/>
                 <span className="text-[11px] font-black text-gray-900 text-center leading-tight">All Categories</span>
              </div>
              {allCategories.filter(c => c.name !== categoryNameStr).map((cat, idx) => (
                 <div key={idx} onClick={() => router.push(`/categories/${cat.slug}`)} className="bg-white border border-gray-200 hover:border-[#F2A900] rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px] cursor-pointer transition">
                    <FiBox size={24} className="text-gray-400 mb-2"/>
                    <span className="text-[11px] font-black text-gray-800 text-center leading-tight">{cat.name}</span>
                 </div>
              ))}
           </div>

           {/* Layout Split: Filters & Grid */}
           <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-0">
              
              {/* FILTERS SIDEBAR */}
              <div className="hidden lg:block w-[240px] flex-shrink-0">
                 <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-28">
                    <h3 className="font-black text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-4"><FiFilter/> Filters</h3>
                    
                    {/* PRICE FILTER */}
                    <div className="mb-6">
                       <h4 className="text-sm font-bold text-gray-800 mb-2">Max Price</h4>
                       <p className="text-xs text-[#F2A900] font-black mb-2">TZS {maxPrice.toLocaleString()}</p>
                       <input 
                         type="range" min="10000" max="10000000" step="50000"
                         value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                         className="w-full accent-[#F2A900] cursor-pointer"
                       />
                    </div>

                    {/* BRAND FILTER */}
                    {availableBrands.length > 1 && (
                      <div className="mb-6">
                         <h4 className="text-sm font-bold text-gray-800 mb-2">Brand</h4>
                         <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#F2A900] cursor-pointer">
                            {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                         </select>
                      </div>
                    )}

                    <button onClick={resetFilters} className="w-full mt-4 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition">Reset Filters</button>
                 </div>
              </div>

              <div className="flex-1">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5">
                       <span className="text-[10px] font-bold text-gray-500">Sort by:</span>
                       <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="text-xs font-bold text-gray-900 bg-transparent outline-none cursor-pointer">
                          <option value="popular">Popular</option>
                          <option value="newest">Newest</option>
                          <option value="low">Price: Low to High</option>
                          <option value="high">Price: High to Low</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setViewMode('grid')} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${viewMode === 'grid' ? 'border-[#F2A900] text-[#F2A900] bg-yellow-50' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiGrid size={14}/></button>
                       <button onClick={() => setViewMode('list')} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${viewMode === 'list' ? 'border-[#F2A900] text-[#F2A900] bg-yellow-50' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiList size={14}/></button>
                    </div>
                 </div>

                 {isLoading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
                 ) : filteredProducts.length > 0 ? (
                    <div className={`grid gap-3 sm:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                       {filteredProducts.map((product: any) => <ProductCard key={product.id} product={product} />)}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                       <FiPackage size={48} className="text-gray-300 mb-4"/>
                       <h3 className="text-xl font-black text-gray-900 mb-2">No Products Found</h3>
                       <p className="text-gray-500 text-sm">We couldn't find any items matching your filters.</p>
                       <button onClick={resetFilters} className="mt-4 bg-[#0F3B4E] text-white px-6 py-2 rounded-lg text-sm font-bold">Clear Filters</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>

      <div className="hidden md:block"><Footer /></div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[60px] px-2 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiHome size={20}/><span className="text-[9px] font-bold">Home</span></button>
        <button className="flex flex-col items-center gap-1 text-[#F2A900]"><FiGrid size={20} className="fill-current"/><span className="text-[9px] font-black">Categories</span></button>
        <div className="relative -top-5" onClick={() => router.push('/')}>
           <div className="w-14 h-14 bg-[#0A101D] text-[#F2A900] rounded-full flex items-center justify-center shadow-lg border-4 border-white"><FiZap size={24} className="fill-current"/></div>
        </div>
        <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 relative">
           <FiShoppingCart size={20}/>
           {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
           <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiUser size={20}/><span className="text-[9px] font-bold">Account</span></button>
      </div>

      {/* ========================================================= */}
      {/* 4. PRODUCT VIEW MODAL (KAMA YA LANDING PAGE) */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative animate-fade-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full z-10 transition"><FiX size={24} /></button>
            <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
              
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="bg-gray-50 aspect-square rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-8 relative">
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-2 py-1 rounded shadow-sm z-10">-{getDeterministicDiscount(selectedProduct.id)}%</span>
                  {selectedProduct.imageUrl ? ( 
                    <img src={getImageUrl(selectedProduct.imageUrl)} alt={selectedProduct.name} className="object-contain w-full h-full mix-blend-multiply" /> 
                  ) : ( <span className="text-8xl">📦</span> )}
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 flex flex-col">
                <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">{selectedProduct.brand || 'Jtex Authentic'}</span>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mt-1 leading-snug">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mt-2 border-b border-gray-100 pb-3">
                   <span className="text-[#F2A900] text-sm tracking-tighter">★★★★★</span>
                   <span className="text-gray-500 text-xs font-medium">({Math.floor(Math.random() * 100) + 10} Reviews)</span>
                </div>
                <div className="mt-4 space-y-3">
                   <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                     {selectedProduct.description || `High-quality ${selectedProduct.category} product designed for durability and optimal performance. Perfect for everyday use.`}
                   </p>
                </div>
              </div>
              
              <div className="w-full lg:w-1/3">
                <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50">
                   <p className="text-3xl font-black text-gray-900 mb-1">TZS {selectedProduct.price?.toLocaleString()}</p>
                   <p className="text-sm text-gray-400 line-through mb-5">
                      TZS {Math.round(selectedProduct.price / (1 - (getDeterministicDiscount(selectedProduct.id)/100))).toLocaleString()}
                   </p>
                   <div className="mb-5">
                     <p className="font-semibold text-sm text-green-600 mb-1">In Stock - Ready to Ship</p>
                     <p className="text-[11px] text-gray-500 leading-relaxed">Delivery within 24 hours in Dar es Salaam.</p>
                   </div>
                   <div className="space-y-3 mt-auto">
                     <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); router.push('/checkout'); }} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-bold py-3.5 rounded-full text-sm transition shadow-sm border border-[#FCD200] flex justify-center items-center gap-2">
                       <FiShoppingCart /> Add to Cart
                     </button>
                     <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); router.push('/checkout'); }} className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold py-3.5 rounded-full text-sm transition shadow-sm border border-[#FF8F00]">
                       Buy Now <FiChevronRight className="inline" />
                     </button>
                   </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}