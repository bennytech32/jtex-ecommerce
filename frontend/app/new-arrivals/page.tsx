'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiSearch, FiMapPin, FiUser, FiChevronDown, 
  FiArrowLeft, FiGlobe, FiMic, FiCamera, FiHome, FiGrid, 
  FiZap, FiPackage, FiHeart, FiFilter, FiList
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

export default function NewArrivalsPage() {
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [userLocation, setUserLocation] = useState('Fetching...'); 
  const [userCountry, setUserCountry] = useState('...');
  const [countryCode, setCountryCode] = useState('tz');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  // ==========================================
  // HELPER MPYA YA KUSOMA ARRAY YA PICHA
  // ==========================================
  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch(e) {
      return [imgData];
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
          setUserCountry(data.country_name);
          setCountryCode(data.country_code.toLowerCase());
        }
      })
      .catch(() => {});

    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${getApiUrl()}/api/products`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          // HAPA NDIPO TUNACHUJA NEW ARRIVALS TU KUTOKA DATABASE YOTE
          const newProducts = data.filter((p: any) => 
            p.badge === 'New' || p.badge === 'New Arrival' || p.badge === 'Sale'
          ).reverse(); // Tunageuza ili mpya zianze juu
          
          // Kama hamna zenye badge, tunachukua 10 za mwisho kuingizwa kama mfano
          setProducts(newProducts.length > 0 ? newProducts : data.slice(-10).reverse());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const cartCount = cart?.length || 0;

  const displayedProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const ProductCard = ({ product }: { product: any }) => {
    const isWishlisted = wishlist.includes(product.id);
    
    // TUNATUMIA HELPER FUNCTION HAPA
    const displayImage = getImagesArray(product.imageUrl)[0];

    return (
      <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-green-500 transition cursor-pointer relative overflow-hidden">
        {/* New Badge */}
        <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl z-20 shadow-sm uppercase tracking-wider">
           NEW
        </div>

        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
            <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-2 left-2 text-gray-400 hover:text-red-500 lg:hidden z-20"><FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""}/></button>
            {/* TUNAPITisha PICHA ILIYOSOMWA HAPA */}
            {displayImage ? <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>}
        </div>
        <div className="flex flex-col flex-grow">
            <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-green-600 transition">{product.name}</h4>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-3 mt-auto">
                <span className="font-black text-sm lg:text-lg text-[#0A101D] leading-none">TZS {product.price.toLocaleString()}</span>
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center justify-center gap-2 font-bold text-xs hover:bg-green-600 hover:text-white transition">
              <FiShoppingCart size={14}/> Add To Cart
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      
      {/* DESKTOP HEADER */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img src="/logo.png" alt="Jtex Logo" className="h-20 lg:h-28 cursor-pointer object-contain" onClick={() => router.push('/')} />
          </div>

          <div className="flex-1 max-w-2xl flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <button className="h-full px-4 text-gray-600 text-sm font-bold bg-gray-100 border-r border-gray-200">All <FiChevronDown/></button>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search new arrivals..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <button className="h-full px-8 bg-[#F2A900] text-black"><FiSearch size={20} /></button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300"/>
              <span className="text-[10px] font-bold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
             <button onClick={() => router.back()} className="p-1"><FiArrowLeft className="text-xl text-gray-300"/></button>
             <h1 className="font-bold text-lg">New Arrivals</h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto lg:px-6 lg:py-8 pb-24 mt-4">
         <div className="px-4 lg:px-0 mb-8">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center"><FiPackage size={24} /></div>
               <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900">New Arrivals</h1>
                  <p className="text-sm text-gray-500 font-medium">Freshly added products just for you.</p>
               </div>
            </div>
         </div>

         <div className="px-4 lg:px-0">
            {isLoading ? (
               <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : displayedProducts.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {displayedProducts.map((product: any) => <ProductCard key={product.id} product={product} />)}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                  <FiPackage size={48} className="text-gray-300 mb-4"/>
                  <h3 className="text-xl font-black text-gray-900 mb-2">No New Arrivals Yet</h3>
                  <p className="text-gray-500 text-sm">Check back later for fresh products.</p>
               </div>
            )}
         </div>
      </main>

      <div className="hidden lg:block"><Footer /></div>
    </div>
  );
}