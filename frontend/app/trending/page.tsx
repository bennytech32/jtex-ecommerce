'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiSearch, FiMapPin, FiUser, FiChevronDown, 
  FiArrowLeft, FiGlobe, FiMic, FiCamera, FiHome, FiGrid, 
  FiZap, FiPackage, FiHeart, FiStar, FiTrendingUp, FiAward
} from 'react-icons/fi';

import Footer from '../components/common/Footer';

export default function TrendingPage() {
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

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  // HELPER: Kusoma Array ya Picha
  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch(e) {
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
          // HAPA TUNACHUJA BIDHAA ZINAZOTAMBA (Top Rated, Hot, Trending)
          const trendingProducts = data.filter((p: any) => 
            p.badge === 'Hot' || p.badge === 'Top Rated' || p.badge === 'Trending'
          );
          
          // Kama hamna zenye badge hizo, tunachanganya (shuffle) na kuchukua 15 za mwanzo kama mfano
          if (trendingProducts.length > 0) {
              setProducts(trendingProducts);
          } else {
              const shuffled = [...data].sort(() => 0.5 - Math.random());
              setProducts(shuffled.slice(0, 15));
          }
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

  const ProductCard = ({ product, index }: { product: any, index: number }) => {
    const isWishlisted = wishlist.includes(product.id);
    const displayImage = getImagesArray(product.imageUrl)[0];
    const visualDiscount = getDeterministicDiscount(product.id); 
    const oldPrice = Math.round(product.price / (1 - (visualDiscount/100)));

    return (
      <div onClick={() => router.push(`/product/${product.id}`)} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#0A101D] transition cursor-pointer relative overflow-hidden">
        
        {/* Namba ya Cheo (Ranking Badge) - Kwa bidhaa 3 za mwanzo */}
        {index < 3 && (
            <div className={`absolute top-0 left-0 w-8 h-8 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-orange-300'} text-black flex items-center justify-center font-black rounded-br-2xl z-30 shadow-md`}>
                #{index + 1}
            </div>
        )}

        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
            <button onClick={(e) => toggleWishlist(e, product.id)} className="w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm"><FiHeart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : ""}/></button>
        </div>

        <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
            {displayImage ? <img src={getImageUrl(displayImage)} alt={product.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" /> : <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>}
        </div>
        
        <div className="flex flex-col flex-grow text-center">
            <div className="flex items-center justify-center text-[#F2A900] text-[10px] mb-2">
                ★★★★★ <span className="text-gray-400 ml-1">({Math.floor(Math.random() * 500) + 100})</span>
            </div>
            <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition">{product.name}</h4>
            <div className="flex flex-col items-center gap-1 mb-3 mt-auto">
                <span className="font-black text-sm lg:text-lg text-[#0A101D] leading-none">TZS {product.price.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
            </div>
            
            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full py-2.5 bg-[#0A101D] text-white rounded-lg flex items-center justify-center gap-2 font-bold text-xs hover:bg-[#F2A900] hover:text-black transition">
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
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search trending products..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
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
             <h1 className="font-bold text-lg">Trending</h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto lg:px-6 lg:py-8 pb-24 mt-4">
         
         {/* Professional Trending Banner */}
         <div className="px-4 lg:px-0 mb-8">
            <div className="w-full bg-gradient-to-r from-[#0A101D] via-gray-900 to-[#1c2742] rounded-2xl p-6 lg:p-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-800">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2A900]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center sm:text-left text-white">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <FiTrendingUp size={24} className="text-[#F2A900]"/>
                        <h2 className="text-xl font-bold text-[#F2A900] tracking-widest uppercase">Top Charts</h2>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black mb-3 leading-tight text-white drop-shadow-md">Trending Now</h1>
                    <p className="text-gray-400 font-medium max-w-md">Discover the most popular products loved by thousands of customers this week. Don't miss out on what's hot!</p>
                </div>

                <div className="relative z-10 hidden lg:flex gap-4">
                    <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center w-28">
                        <FiStar size={28} className="text-[#F2A900] mb-2"/>
                        <span className="text-white font-black text-lg">5.0</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Top Rated</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center w-28">
                        <FiAward size={28} className="text-[#F2A900] mb-2"/>
                        <span className="text-white font-black text-lg">10K+</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Items Sold</span>
                    </div>
                </div>
            </div>
         </div>

         <div className="px-4 lg:px-0">
            {isLoading ? (
               <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div></div>
            ) : displayedProducts.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {displayedProducts.map((product: any, index: number) => <ProductCard key={product.id} product={product} index={index} />)}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                  <FiTrendingUp size={48} className="text-gray-300 mb-4"/>
                  <h3 className="text-xl font-black text-gray-900 mb-2">No Trending Items</h3>
                  <p className="text-gray-500 text-sm">Check back later for updated top charts.</p>
               </div>
            )}
         </div>
      </main>

      <div className="hidden lg:block"><Footer /></div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[60px] px-2 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-safe">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiHome size={20}/><span className="text-[9px] font-bold">Home</span></button>
        <button onClick={() => router.push('/categories/all')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiGrid size={20}/><span className="text-[9px] font-medium">Categories</span></button>
        <div className="relative -top-5 cursor-pointer" onClick={() => router.push('/trending')}>
           <div className="w-14 h-14 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#0A101D]"><FiTrendingUp size={24} className="text-white"/></div>
        </div>
        <button onClick={() => router.push('/checkout')} className="flex flex-col items-center gap-1 text-gray-400 relative">
           <FiShoppingCart size={20}/>
           {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
           <span className="text-[9px] font-bold">Cart</span>
        </button>
        <button onClick={() => router.push(user ? '/profile' : '/login')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900"><FiUser size={20}/><span className="text-[9px] font-bold">Account</span></button>
      </div>

    </div>
  );
}