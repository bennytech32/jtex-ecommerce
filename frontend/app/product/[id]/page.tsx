'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiHeart, FiShare, FiShoppingCart, FiStar, 
  FiChevronRight, FiSearch, FiMic, FiCamera, FiHome, 
  FiCheckCircle, FiMapPin, FiChevronDown, FiPackage,
  FiGlobe, FiTruck
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/common/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Slider & Images States
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const [specs, setSpecs] = useState<any>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [userLocation, setUserLocation] = useState('Dar es Salaam, Tanzania'); 
  const [countryCode, setCountryCode] = useState('tz');
  const [user, setUser] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const cartCount = cart?.length || 0;

  // --- ACTIONS ---
  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const businessPhone = "255767949581"; 
    const message = `Habari Jtex,%0ANinaulizia kuhusu hii bidhaa:%0A*${product.name}*%0A*Bei:* TZS ${product.price.toLocaleString()}%0A%0A*Link:* ${window.location.href}`;
    window.open(`https://wa.me/${businessPhone}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Angalia hii bidhaa bomba kutoka Jtex: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link imekopiwa (Copied to clipboard!)');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/categories?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Slider Scroll Logic (Inafanya kazi Simu na Desktop sasa)
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const width = sliderRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / width);
      if (newIndex !== currentImageIndex) {
        setCurrentImageIndex(newIndex);
      }
    }
  };

  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * index,
        behavior: 'smooth'
      });
    }
  };

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
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch (e) {} }

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
          setCountryCode(data.country_code.toLowerCase());
        }
      }).catch(() => {});

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data);
        
        const foundProduct = data.find((p: any) => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          const parsedImages = getImagesArray(foundProduct.imageUrl).map((img: string) => 
              img.startsWith('http') ? img : `${API_URL}${img}`
          );
          setImages(parsedImages);
          
          if (foundProduct.specifications) {
            try { setSpecs(JSON.parse(foundProduct.specifications)); } catch (e) {}
          }
        }
      } catch (err) {
        console.error("Kosa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">Loading Product Details...</p>
    </div>
  );
  
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Bidhaa haijapatikana!</div>;

  const basePrice = product.price;
  const tier2Price = basePrice * 0.95; 
  const tier3Price = basePrice * 0.90; 
  const isMainProductWishlisted = wishlist.includes(product.id);

  const { Model, ...otherSpecs } = specs;
  const displayModel = Model || product.model || 'N/A';

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  const RelatedProductCard = ({ item }: { item: any }) => {
    const isWishlisted = wishlist.includes(item.id);
    const itemFirstImage = getImagesArray(item.imageUrl)[0];
    const imgUrl = itemFirstImage ? (itemFirstImage.startsWith('http') ? itemFirstImage : `${API_URL}${itemFirstImage}`) : '';
    
    return (
      <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative group flex flex-col cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
        <button onClick={(e) => toggleWishlist(e, item.id)} className="absolute top-2 right-2 z-20"><FiHeart className={`text-sm ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`} /></button>
        <div className="aspect-square bg-gray-50/50 border border-gray-50 rounded-lg mb-3 p-2 relative overflow-hidden mix-blend-multiply">
          {imgUrl ? <img src={imgUrl} alt={item.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-300" /> : <span className="text-4xl m-auto">📦</span>}
        </div>
        <h3 className="text-xs font-semibold text-gray-800 leading-tight mb-2 line-clamp-2">{item.name}</h3>
        <div className="mt-auto">
          <span className="text-sm font-bold text-[#0A101D]">TZS {item.price.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  const getConditionStyles = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'refurbished': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'used': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900 font-sans pb-24 lg:pb-0 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. PROFESSIONAL DESKTOP HEADER */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img src="/logo.png" alt="Jtex Logo" className="h-20 lg:h-28 cursor-pointer object-contain" onClick={() => router.push('/')} />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20}/>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-semibold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown/></span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm">
            <button type="button" className="h-full px-4 text-gray-600 text-sm font-medium bg-gray-100 border-r border-gray-200 flex items-center gap-1">All <FiChevronDown/></button>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <button type="submit" className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition"><FiSearch size={20} /></button>
          </form>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300"/>
              <span className="text-[10px] font-semibold mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE HEADER WITH SEARCH BAR */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white pt-4 pb-3 sticky top-0 z-50">
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => router.back()}>
             <FiArrowLeft size={20} className="text-gray-300"/>
             <span className="text-sm font-semibold text-gray-300">Back</span>
          </div>
          <div className="flex items-center gap-4">
             <FiShare onClick={handleShare} size={20} className="text-gray-300 cursor-pointer" />
             <div className="relative" onClick={() => router.push('/checkout')}>
                 <FiShoppingCart size={20} className="text-gray-300"/>
                 {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">{cartCount}</span>}
             </div>
          </div>
        </div>
        <div className="px-4">
          <form onSubmit={handleSearch} className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 h-full px-4 text-sm text-gray-900 outline-none" />
            <button type="submit" className="h-full px-5 bg-[#F2A900] text-black"><FiSearch size={18} /></button>
          </form>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto lg:px-6 lg:py-8 mt-2 lg:mt-0">
        
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 mb-8 lg:mb-12 bg-white lg:rounded-3xl lg:border border-gray-100 lg:p-6 lg:shadow-sm">
          
          {/* ========================================================= */}
          {/* IMAGE SECTION - SLIDER IMERUHUSIWA KUFANYA KAZI KOTE */}
          {/* ========================================================= */}
          <div className="w-full lg:w-1/2 lg:max-w-[50%] flex flex-col-reverse lg:flex-row gap-4 relative overflow-hidden">
            
            {/* Desktop Side Thumbnails (Optonal sasa, ila zinasaidia kwa fast jump) */}
            <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
              {images.map((imgStr, idx) => (
                <div 
                   key={idx} 
                   onClick={() => scrollToImage(idx)} 
                   className={`w-20 h-20 bg-gray-50 rounded-lg border p-2 cursor-pointer transition ${currentImageIndex === idx ? 'border-[#F2A900]' : 'border-gray-200 hover:border-[#F2A900]/50'}`}
                >
                  <img src={imgStr} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
            
            {/* Main Image Slider View */}
            <div className="flex-1 w-full bg-white lg:bg-gray-50 lg:rounded-2xl lg:border border-gray-100 relative min-h-[350px] lg:min-h-[500px] overflow-hidden group">
              
              <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md transition">
                  <FiHeart className={`text-lg ${isMainProductWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>

              {/* Slider Container - Active For Desktop & Mobile */}
              <div 
                ref={sliderRef}
                onScroll={handleScroll}
                className="w-full h-[350px] lg:h-[500px] flex overflow-x-auto snap-x snap-mandatory hide-scrollbar smooth-scroll scroll-smooth"
              >
                 {images.length > 0 ? (
                    images.map((imgStr, idx) => (
                      <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8 bg-white lg:bg-transparent mix-blend-multiply relative">
                          <img src={imgStr} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                    ))
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50"><span className="text-9xl">📦</span></div>
                 )}
              </div>

              {/* Slider Arrow Buttons (Desktop Hover) */}
              {images.length > 1 && (
                 <>
                   <button 
                     onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
                     className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden lg:flex`}
                     disabled={currentImageIndex === 0}
                   >
                     <FiChevronRight className="rotate-180" size={20}/>
                   </button>
                   <button 
                     onClick={() => scrollToImage(Math.min(images.length - 1, currentImageIndex + 1))}
                     className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden lg:flex`}
                     disabled={currentImageIndex === images.length - 1}
                   >
                     <FiChevronRight size={20}/>
                   </button>
                 </>
              )}

              {/* Custom Dots Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/50 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                   {images.map((_, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => scrollToImage(idx)}
                        className={`h-1.5 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'w-4 bg-[#F2A900]' : 'w-1.5 bg-gray-400'}`}
                     ></div>
                   ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* PRODUCT DETAILS SECTION */}
          {/* ========================================================= */}
          <div className="w-full lg:w-1/2 lg:flex-1 flex flex-col px-4 lg:px-0 py-6 lg:py-4">
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0A101D] leading-tight mb-4">{product.name}</h1>

            <div className="flex flex-col mb-2 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
               <div className="flex items-center gap-3">
                  <span className="text-3xl lg:text-4xl font-bold text-[#0A101D] leading-none">TSH {basePrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-1 rounded">-15%</span>
               </div>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
               <div className="flex text-[#F2A900] text-sm"><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current text-gray-300" /></div>
               <span className="text-blue-600 font-medium text-xs hover:underline cursor-pointer">30 Reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
               <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition:</span>
               <span className={`${getConditionStyles(product.condition)} border text-[11px] font-semibold uppercase px-3 py-1 rounded-md flex items-center gap-1.5 shadow-sm`}>
                 <FiCheckCircle size={12}/> {product.condition || 'Brand New'}
               </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2"><FiPackage className="text-[#F2A900]"/> Wholesale Pricing</p>
              <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-3 text-center bg-white">
                  <p className="text-[10px] font-medium text-gray-500 mb-1 uppercase">1 Piece</p>
                  <p className="font-semibold text-sm text-[#0A101D]">TSH {basePrice.toLocaleString()}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] font-medium text-gray-500 mb-1 uppercase">2-5 Pcs</p>
                  <p className="font-semibold text-sm text-[#0A101D]">TSH {tier2Price.toLocaleString()}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[10px] font-medium text-gray-500 mb-1 uppercase">&gt;5 Pcs</p>
                  <p className="font-semibold text-sm text-red-600">TSH {tier3Price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-green-50/50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
              <FiTruck className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-sm text-green-700 mb-1">In Stock - Ready to Ship</p>
                <p className="text-xs text-green-800 leading-relaxed font-normal">
                  Delivery within 24 hours in Dar es Salaam. For other regions, shipping takes 2-3 business days. Free pickup available at our store.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex gap-3 mt-auto pt-4 border-t border-gray-100">
              <button onClick={() => { addToCart(product); alert('Imewekwa kwenye kikapu!'); }} className="flex-1 bg-[#F2A900] hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(242,169,0,0.3)]">
                <FiShoppingCart size={18}/> Add To Cart
              </button>
              <button onClick={() => { addToCart(product); router.push('/checkout'); }} className="flex-1 bg-[#0A101D] hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-lg">
                Buy It Now <FiChevronRight size={18}/>
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION BELOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-12 px-4 lg:px-0">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A101D] mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#F2A900] rounded-full"></span> Product Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-normal">
              {product.description || `Elevate your productivity with the ${product.name}. Featuring a premium display, powerful processor, and lightning-fast storage. Sleek, portable, and designed for high performance and durability in any environment.`}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A101D] mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#F2A900] rounded-full"></span> Specifications</h3>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 bg-gray-50/50 text-sm">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">Brand</span>
                <span className="font-semibold text-gray-900 w-2/3">{product.brand || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 text-sm">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">Model</span>
                <span className="font-semibold text-blue-600 w-2/3">{displayModel}</span>
              </div>

              {Object.keys(otherSpecs).length > 0 ? (
                Object.keys(otherSpecs).map((key, index, arr) => (
                  <div key={key} className={`flex items-center justify-between py-3 px-4 text-sm ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50/50'} ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">{key}</span>
                    <span className="font-semibold text-gray-900 w-2/3">{otherSpecs[key]}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-xs font-semibold text-gray-400 px-4 text-center bg-gray-50">No additional specifications provided.</div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-10 px-4 lg:px-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-[#0A101D] flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F2A900] rounded-full"></span> Recommended</h3>
              <button onClick={() => router.push('/')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map(item => <RelatedProductCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </main>

      <div className="hidden lg:block"><Footer /></div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-3 py-3 flex items-center gap-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-safe">
         <div onClick={() => router.push('/')} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#0A101D] w-12 cursor-pointer">
            <FiHome size={22} className="mb-0.5" />
            <span className="text-[9px] font-semibold">Store</span>
         </div>
         
         <div onClick={handleWhatsAppInquiry} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#25D366] w-12 cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="text-[9px] font-semibold">Chat</span>
         </div>
         
         <div className="flex-1 flex gap-2 ml-1">
            <button onClick={() => addToCart(product)} className="flex-1 bg-[#F2A900] text-[#0A101D] font-semibold py-3 rounded-xl text-xs shadow-[0_4px_10px_rgba(242,169,0,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-1.5">
               <FiShoppingCart size={14}/> Add
            </button>
            <button onClick={() => { addToCart(product); router.push('/checkout'); }} className="flex-1 bg-[#0A101D] text-white font-semibold py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-transform">
               Buy Now
            </button>
         </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}