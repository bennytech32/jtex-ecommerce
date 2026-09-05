'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import {
  FiShoppingCart, FiSearch, FiFilter, FiGlobe, FiX, FiCheckCircle, FiMapPin,
  FiTruck, FiShield, FiLock, FiMail, FiUser, FiPhone, FiTrash2, FiChevronRight,
  FiSmartphone, FiArrowLeft, FiMoreHorizontal, FiSliders, FiList, FiGrid,
  FiCamera, FiMic, FiMaximize, FiUploadCloud, FiChevronDown, FiZap, FiMessageCircle,
  FiHome, FiTag, FiPackage, FiHeadphones, FiHeart, FiBox, FiMonitor,
  FiCoffee, FiSmile, FiTool, FiShoppingBag, FiBriefcase
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

const generateSlug = (name: string) => {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const TANZANIA_REGIONS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi",
  "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro",
  "Mtwara", "Mwanza", "Njombe", "Pwani", "Rukwa", "Ruvuma", "Shinyanga",
  "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Zanzibar"
];

const STATIC_CATEGORIES = [
  { name: 'Food', slug: 'food', img: '/food.PNG', icon: <FiCoffee size={24} className="text-orange-500" />, bg: 'from-orange-400 to-red-400' },
  { name: 'Sports', slug: 'sports', img: '/sports.PNG', icon: <FiSmile size={24} className="text-green-500" />, bg: 'from-green-400 to-emerald-500' },
  { name: 'Health', slug: 'health', img: '/health.PNG', icon: <FiHeart size={24} className="text-red-400" />, bg: 'from-pink-400 to-rose-500' },
  { name: 'Industrial', slug: 'industrial', img: '/industrial.PNG', icon: <FiTool size={24} className="text-gray-700" />, bg: 'from-gray-500 to-gray-700' },
  { name: 'Agriculture', slug: 'agriculture', img: '/agriculture.PNG', icon: <FiGlobe size={24} className="text-green-600" />, bg: 'from-green-500 to-lime-600' },
  { name: 'Construction', slug: 'construction', img: '/construction.PNG', icon: <FiTool size={24} className="text-yellow-600" />, bg: 'from-yellow-400 to-amber-500' },
  { name: 'Baby', slug: 'baby', img: '/baby.PNG', icon: <FiSmile size={24} className="text-pink-400" />, bg: 'from-pink-300 to-purple-400' },
  { name: 'Education', slug: 'education', img: '/education.PNG', icon: <FiMonitor size={24} className="text-indigo-600" />, bg: 'from-indigo-400 to-blue-500' },
  { name: 'Jobs', slug: 'jobs', img: '/jobs.PNG', icon: <FiBriefcase size={24} className="text-cyan-500" />, bg: 'from-cyan-400 to-sky-500' },
  { name: 'Real Estate', slug: 'realestate', img: '/realestate.PNG', icon: <FiHome size={24} className="text-teal-500" />, bg: 'from-teal-400 to-cyan-600' },
  { name: 'Vehicle', slug: 'vehicle', img: '/vehicle.PNG', icon: <FiTruck size={24} className="text-gray-600" />, bg: 'from-slate-400 to-gray-600' },
  { name: 'Home', slug: 'home', img: '/home.PNG', icon: <FiHome size={24} className="text-yellow-500" />, bg: 'from-yellow-300 to-orange-400' },
  { name: 'Fashion', slug: 'fashion', img: '/fashion.PNG', icon: <FiShoppingBag size={24} className="text-pink-500" />, bg: 'from-pink-500 to-rose-400' },
  { name: 'Digital', slug: 'digital', img: '/digital.PNG', icon: <FiMonitor size={24} className="text-blue-500" />, bg: 'from-blue-400 to-indigo-500' },
  { name: 'Mobile', slug: 'mobile', img: '/mobile.PNG', icon: <FiSmartphone size={24} className="text-indigo-500" />, bg: 'from-violet-400 to-indigo-600' },
  { name: 'Electronics', slug: 'electronics', img: '/electronics.PNG', icon: <FiHeadphones size={24} className="text-purple-500" />, bg: 'from-purple-400 to-violet-600' },
];

const getCategoryVisual = (catName: string) => {
  const lower = catName.toLowerCase();

  // MERGE 'home living' na 'furniture' zipewe muonekano wa 'home'
  if (lower.includes('home living') || lower.includes('furniture')) {
    const homeCat = STATIC_CATEGORIES.find(sc => sc.slug === 'home');
    if (homeCat) return { img: homeCat.img, icon: homeCat.icon, bg: `bg-gradient-to-br ${homeCat.bg}` };
  }

  const found = STATIC_CATEGORIES.find(sc => lower.includes(sc.slug) || sc.name.toLowerCase().includes(lower) || lower.includes(sc.name.toLowerCase()));
  if (found) return { img: found.img, icon: found.icon, bg: `bg-gradient-to-br ${found.bg}` };

  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('printer')) return { img: '/digital.PNG', icon: <FiMonitor size={24} className="text-blue-500" />, bg: 'bg-blue-50' };
  if (lower.includes('audio') || lower.includes('speaker') || lower.includes('gaming')) return { img: '/electronics.PNG', icon: <FiHeadphones size={24} className="text-purple-500" />, bg: 'bg-purple-50' };
  if (lower.includes('tablet') || lower.includes('phone')) return { img: '/mobile.PNG', icon: <FiSmartphone size={24} className="text-indigo-500" />, bg: 'bg-indigo-50' };
  if (lower.includes('cloth') || lower.includes('shoe') || lower.includes('beaut')) return { img: '/fashion.PNG', icon: <FiShoppingBag size={24} className="text-pink-500" />, bg: 'bg-pink-50' };
  if (lower.includes('living') || lower.includes('kitchen')) return { img: '/home.PNG', icon: <FiHome size={24} className="text-yellow-500" />, bg: 'bg-yellow-50' };
  if (lower.includes('property')) return { img: '/realestate.PNG', icon: <FiHome size={24} className="text-teal-500" />, bg: 'bg-teal-50' };
  if (lower.includes('book')) return { img: '/education.PNG', icon: <FiMonitor size={24} className="text-indigo-600" />, bg: 'bg-indigo-50' };
  if (lower.includes('service')) return { img: '/jobs.PNG', icon: <FiBriefcase size={24} className="text-cyan-500" />, bg: 'bg-cyan-50' };

  return { img: null, icon: <FiGrid size={24} className="text-gray-400" />, bg: 'bg-gray-50' };
};

export default function CategoryPage({ params }: { params?: { slug?: string } }) {
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [activeSlug, setActiveSlug] = useState(params?.slug || '');

  const categoryNameStr = activeSlug
    ? activeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    : 'All Categories';

  const [products, setProducts] = useState<any[]>([]);
  const [allProductsData, setAllProductsData] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [userLocation, setUserLocation] = useState('Fetching...');
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz');

  const [searchQuery, setSearchQuery] = useState('');
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  const [sortOrder, setSortOrder] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : allProductsData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);

  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch (e) {
      return [imgData];
    }
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
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat) setActiveSlug(cat);
    }

    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { }
    }

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
          setAllProductsData(data);

          const uniqueBrands = Array.from(new Set(data.map((p: any) => p.brand))).filter(Boolean);
          setAvailableBrands(['All', ...uniqueBrands] as string[]);

          const catMap = new Map();
          data.forEach((p: any) => {
            if (p.category) {
              const slug = generateSlug(p.category);

              // TUNAONDOA 'home living' NA 'furniture' ZISITENGENEZE CATEGORY MPYA, ZITAHESABIWA KAMA 'home'
              if (slug === 'home-living' || slug === 'furniture') {
                return;
              }

              let display = p.category;
              if (display.toLowerCase().includes('computer')) display = 'Computers';
              if (display.toLowerCase().includes('phone')) display = 'Phones';
              if (display.toLowerCase().includes('fashion')) display = 'Fashion';

              if (!catMap.has(slug)) {
                catMap.set(slug, { name: display, slug: slug, original: p.category });
              }
            }
          });
          setAllCategories(Array.from(catMap.values()));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- SEHEMU ILIYOREKEBISHWA KWA AJILI YA HOME MERGING ---
  useEffect(() => {
    let filtered = allProductsData;
    if (activeSlug && activeSlug !== 'all') {
      filtered = allProductsData.filter((p: any) => {
        const prodSlug = generateSlug(p.category);

        // Kama activeSlug ni 'home', leta bidhaa zote za 'home', 'home-living', na 'furniture'
        if (activeSlug === 'home') {
          return prodSlug === 'home' || prodSlug === 'home-living' || prodSlug === 'furniture';
        }

        return prodSlug === activeSlug;
      });
    }
    setProducts(filtered);
  }, [activeSlug, allProductsData]);
  // ---------------------------------------------------------

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const cartCount = cart?.length || 0;

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    const visualDiscount = getDeterministicDiscount(product.id);
    const oldPrice = Math.round(product.price / (1 - (visualDiscount / 100)));
    const displayImage = getImagesArray(product.imageUrl)[0];

    if (viewMode === 'list') {
      return (
        <div onClick={() => router.push(`/product/${generateSlug(product.name)}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 group hover:border-[#E8A922] transition cursor-pointer">
          <div className="relative w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-50">
            <span className="absolute top-2 left-2 bg-[#E8A922] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
            {displayImage ? <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <span className="text-4xl">📦</span>}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-gray-800 mb-1 leading-snug line-clamp-2 group-hover:text-[#1B6B80] transition">{product.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-base text-[#1B6B80]">TZS {product.price.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-[#E8A922] text-[10px] font-bold"><span className="tracking-tighter">★★★★★</span></div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-[#E8A922] hover:text-white font-bold text-xs flex items-center gap-2 transition"><FiShoppingCart /> Add</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div onClick={() => router.push(`/product/${generateSlug(product.name)}`)} className="bg-white border border-gray-200 rounded-2xl p-3 lg:p-4 flex flex-col h-full group hover:border-[#E8A922]/50 hover:shadow-xl transition-all duration-300 cursor-pointer relative">
        <div className="relative w-full pt-[100%] bg-gray-50 mb-3 rounded-xl overflow-hidden flex-shrink-0">
          <span className="absolute top-2 left-2 bg-[#E8A922] text-white text-[10px] font-black px-2 py-1 rounded z-20">-{visualDiscount}%</span>
          <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20"><FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""} /></button>

          {displayImage ? (
            <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-[#1B6B80] transition">{product.name}</h4>
          <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-2 mt-auto">
            <span className="font-black text-sm lg:text-base text-[#1B6B80]">TZS {product.price.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-[#E8A922] text-[10px] font-bold">
              <span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium hidden sm:inline-block">({Math.floor(Math.random() * 100) + 10})</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#E8A922] hover:text-white transition">
              <FiShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">

      <header className="hidden lg:block bg-[#1B6B80] text-white border-b border-[#145363] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.png" alt="Jtex Logo" className="h-10 lg:h-12 object-contain" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-[#145363] p-2 rounded-lg transition">
              <FiMapPin className="text-gray-300" size={20} />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-300">Deliver to</span>
                <span className="text-xs font-bold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown /></span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm w-full">
              <button type="button" className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-200 transition">
                All <FiChevronDown />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDesktopSuggestions(true); }}
                onFocus={() => setShowDesktopSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDesktopSuggestions(false), 200)}
                placeholder="Search products, brands..."
                className="flex-1 h-full px-4 text-[16px] text-gray-900 outline-none w-full"
              />
              <div className="flex items-center gap-3 px-3 text-gray-400">
                <FiCamera className="cursor-pointer hover:text-gray-600" />
                <FiMic className="cursor-pointer hover:text-gray-600" />
              </div>
              <button type="submit" className="h-full px-8 bg-[#E8A922] text-white hover:bg-[#D4981C] transition">
                <FiSearch size={20} />
              </button>
            </form>

            {showDesktopSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                {filteredSuggestions.length > 0 ? (
                  <ul className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                    {filteredSuggestions.map((prod) => (
                      <li
                        key={prod.id}
                        onClick={() => router.push(`/product/${generateSlug(prod.name)}`)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0 transition"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                          {getImagesArray(prod.imageUrl)[0] ? (
                            <img src={getImageUrl(getImagesArray(prod.imageUrl)[0])} className="w-full h-full object-cover mix-blend-multiply" alt="" />
                          ) : <FiPackage className="text-gray-400" />}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-bold text-gray-800 truncate">{prod.name}</span>
                          <span className="text-xs font-black text-[#E8A922]">TZS {prod.price.toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-sm font-medium text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="flex items-center gap-2 hover:bg-[#145363] p-2 rounded-lg transition">
              <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={userCountry} className="w-5 rounded-sm" />
              <span className="text-xs font-bold uppercase">{countryCode} <FiChevronDown className="inline" /></span>
            </button>
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-[#145363] p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-200" />
              <span className="text-[10px] font-bold mt-1 text-gray-200">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#E8A922] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center hover:bg-[#145363] p-2 rounded-lg transition">
              <FiPackage size={24} className="text-gray-200" />
              <span className="text-[10px] font-bold mt-1 text-gray-200">Track Order</span>
            </button>
            <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex items-center gap-2 border border-white/20 bg-[#145363]/50 hover:bg-[#10404d] px-4 py-2.5 rounded-full transition">
              <FiUser size={20} />
              <span className="text-xs font-bold">{user ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      <header className="lg:hidden bg-[#1B6B80] text-white pt-4 pb-3 sticky top-0 z-50 border-b border-[#145363]">
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center bg-[#145363]/50">
              <FiMapPin className="text-[#E8A922]" size={12} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-300 leading-tight">Deliver to</span>
              <span className="text-xs font-bold flex items-center gap-1 leading-tight">{userLocation.split(',')[0]} <FiChevronDown size={14} /></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-2 py-1 rounded-lg shadow-sm cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.png" alt="Jtex Logo" className="h-5 object-contain" />
            </div>
          </div>
        </div>

        <div className="px-4 relative w-full">
          <form onSubmit={handleSearch} className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 w-full">
            <div className="hidden xs:flex pl-4 pr-3 items-center border-r border-gray-200 h-full bg-gray-50">
              <span className="text-xs text-gray-600 font-bold">Search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowMobileSuggestions(true); }}
              onFocus={() => setShowMobileSuggestions(true)}
              onBlur={() => setTimeout(() => setShowMobileSuggestions(false), 200)}
              placeholder="Search products..."
              className="flex-1 h-full px-3 text-[16px] text-gray-900 outline-none bg-transparent placeholder-gray-400 w-full min-w-0"
            />
            <div className="flex items-center gap-1.5 px-2 text-gray-400 bg-white">
              <FiMic size={16} className="cursor-pointer hover:text-gray-600 hidden xs:block" />
              <FiCamera size={16} className="cursor-pointer hover:text-gray-600" />
            </div>
            <button type="submit" className="h-full px-4 bg-[#E8A922] text-white flex items-center justify-center hover:bg-[#D4981C] transition border-l border-[#E8A922] flex-shrink-0">
              <FiSearch size={18} />
            </button>
          </form>

          {showMobileSuggestions && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 left-4 right-4 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
              {filteredSuggestions.length > 0 ? (
                <ul className="max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {filteredSuggestions.map((prod) => (
                    <li
                      key={prod.id}
                      onClick={() => router.push(`/product/${generateSlug(prod.name)}`)}
                      className="px-4 py-3 hover:bg-[#E8A922]/10 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                        {getImagesArray(prod.imageUrl)[0] ? (
                          <img src={getImageUrl(getImagesArray(prod.imageUrl)[0])} className="w-full h-full object-cover mix-blend-multiply" alt="" />
                        ) : <FiPackage className="text-gray-400" />}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-800 truncate">{prod.name}</span>
                        <span className="text-[10px] font-black text-[#E8A922]">TZS {prod.price.toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-xs font-medium text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 flex gap-6 pb-20 md:pb-6">

        <div className="flex-1 min-w-0">

          <div className="mb-6">
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
              <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> <FiChevronRight />
              <span className="text-[#1B6B80]">{categoryNameStr}</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 capitalize">{categoryNameStr}</h1>
                <p className="text-sm text-gray-500 font-medium">Find the best products and deals available right now.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 flex flex-col items-center justify-center shadow-sm w-max hidden lg:flex">
                <span className="text-2xl font-black text-[#1B6B80]">{filteredProducts.length}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Items found</span>
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-4 sm:gap-6 bg-white rounded-2xl border border-gray-100 px-6 py-4 shadow-sm mb-8">
            <button
              onClick={() => {
                setActiveSlug('');
                window.history.pushState({}, '', '/categories');
              }}
              className="flex flex-col items-center gap-2 hover:opacity-90 transition cursor-pointer whitespace-nowrap group min-w-[76px] sm:min-w-[84px] flex-shrink-0"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center transition-all transform group-hover:scale-105 group-hover:shadow-md ${activeSlug === '' || activeSlug === 'all'
                ? 'border-2 border-[#1B6B80] ring-2 ring-[#1B6B80]/20 shadow-md scale-105'
                : 'border-2 border-gray-100 shadow-sm'
                } bg-gradient-to-br from-[#1B6B80] to-[#145363]`}>
                <FiGrid size={28} className="text-white" />
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight ${activeSlug === '' || activeSlug === 'all' ? 'text-[#1B6B80]' : 'text-gray-700'
                }`}>All Categories</span>
            </button>

            {STATIC_CATEGORIES.map((cat, idx) => {
              const isActive = activeSlug === cat.slug;
              return (
                <button
                  key={`static-${idx}`}
                  onClick={() => {
                    setActiveSlug(cat.slug);
                    window.history.pushState({}, '', `/categories?category=${cat.slug}`);
                  }}
                  className="flex flex-col items-center gap-2 hover:opacity-90 transition cursor-pointer whitespace-nowrap group min-w-[76px] sm:min-w-[84px] flex-shrink-0"
                >
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white overflow-hidden flex items-center justify-center p-1.5 transition-all transform group-hover:scale-105 group-hover:shadow-md ${isActive
                    ? 'border-2 border-[#1B6B80] ring-2 ring-[#1B6B80]/20 shadow-md scale-105'
                    : 'border-2 border-gray-100 shadow-sm group-hover:border-[#1B6B80]'
                    }`}>
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-contain transition-transform group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight truncate w-full px-1 ${isActive ? 'text-[#1B6B80] font-bold' : 'text-gray-700 group-hover:text-[#1B6B80]'
                    }`}>{cat.name}</span>
                </button>
              );
            })}

            {allCategories
              .filter(cat => !STATIC_CATEGORIES.some(sc => sc.slug === cat.slug || cat.slug.includes(sc.slug)))
              .map((cat, idx) => {
                const visual = getCategoryVisual(cat.name);
                const isActive = activeSlug === cat.slug;
                return (
                  <button
                    key={`db-${idx}`}
                    onClick={() => {
                      setActiveSlug(cat.slug);
                      window.history.pushState({}, '', `/categories?category=${cat.slug}`);
                    }}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition cursor-pointer whitespace-nowrap group min-w-[76px] sm:min-w-[84px] flex-shrink-0"
                  >
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white overflow-hidden flex items-center justify-center p-1.5 transition-all transform group-hover:scale-105 group-hover:shadow-md ${isActive
                      ? 'border-2 border-[#1B6B80] ring-2 ring-[#1B6B80]/20 shadow-md scale-105'
                      : 'border-2 border-gray-100 shadow-sm group-hover:border-[#1B6B80]'
                      }`}>
                      {visual.img ? (
                        <img src={visual.img} alt={cat.name} className="w-full h-full object-contain transition-transform group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : null}
                      <div className="flex items-center justify-center">{visual.icon}</div>
                    </div>
                    <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight truncate w-full px-1 ${isActive ? 'text-[#1B6B80] font-bold' : 'text-gray-700 group-hover:text-[#1B6B80]'
                      }`}>{cat.name}</span>
                  </button>
                );
              })
            }
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            <div className="hidden lg:block w-[260px] flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-32">
                <h3 className="font-black text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-4"><FiFilter /> Filters</h3>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Max Price</h4>
                  <p className="text-xs text-[#E8A922] font-black mb-2">TZS {maxPrice.toLocaleString()}</p>
                  <input
                    type="range" min="10000" max="10000000" step="50000"
                    value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#E8A922] cursor-pointer"
                  />
                </div>

                {availableBrands.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Brand</h4>
                    <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#E8A922] cursor-pointer">
                      {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                )}

                <button onClick={resetFilters} className="w-full mt-4 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs hover:bg-[#E8A922] hover:text-white transition">Reset Filters</button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5">
                  <span className="text-[10px] font-bold text-gray-500">Sort by:</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="text-xs font-bold text-[#1B6B80] bg-transparent outline-none cursor-pointer">
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewMode('grid')} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${viewMode === 'grid' ? 'border-[#E8A922] text-[#E8A922] bg-[#E8A922]/10' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiGrid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${viewMode === 'list' ? 'border-[#E8A922] text-[#E8A922] bg-[#E8A922]/10' : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'}`}><FiList size={14} /></button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#E8A922] border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredProducts.length > 0 ? (
                <div className={`grid gap-3 sm:gap-4 w-full ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1 lg:grid-cols-2'}`}>
                  {filteredProducts.map((product: any) => <ProductCard key={product.id} product={product} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center w-full">
                  <FiPackage size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-black text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500 text-sm">We couldn't find any items matching your filters.</p>
                  <button onClick={resetFilters} className="mt-4 bg-[#1B6B80] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#E8A922] transition">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[60px] px-2 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiHome size={20} /><span className="text-[9px] font-bold">Home</span></button>
        <button onClick={() => router.push('/categories')} className="flex flex-col items-center gap-1 text-[#E8A922]"><FiGrid size={20} className="fill-current" /><span className="text-[9px] font-black">Categories</span></button>
        <div className="relative -top-5" onClick={() => router.push('/deals')}>
          <div className="w-14 h-14 bg-[#1B6B80] text-[#E8A922] rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition-transform"><FiZap size={24} className="fill-current" /></div>
        </div>
        <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 relative">
          <FiShoppingCart size={20} />
          {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#E8A922] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
          <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiUser size={20} /><span className="text-[9px] font-bold">Account</span></button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}