'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft, FiHeart, FiShare, FiShoppingCart, FiStar,
  FiChevronRight, FiChevronLeft, FiSearch, FiCheckCircle, FiMapPin,
  FiChevronDown, FiPackage, FiTruck, FiCheck, FiHome, FiAward,
  FiGlobe, FiMic, FiCamera, FiZap, FiGrid, FiShield, FiRefreshCw,
  FiHeadphones, FiArrowRight, FiMinus, FiPlus, FiShare2, FiFacebook,
  FiTwitter, FiInstagram, FiLinkedin, FiSend, FiMail, FiPhone,
  FiMessageCircle, FiBell, FiSettings, FiUser, FiMonitor, FiSmartphone,
  FiShoppingBag, FiCoffee, FiSmile, FiList
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/common/Footer';

// Helper Function: Convert color names to CSS hex codes
const getColorCode = (colorName: string) => {
  const c = colorName.toLowerCase().trim();
  const colorsMap: any = {
    'black': '#000000', 'white': '#FFFFFF', 'silver': '#C0C0C0', 'gray': '#808080', 'grey': '#808080',
    'titanium': '#878681', 'natural titanium': '#878681', 'blue titanium': '#2F3C4D',
    'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000', 'yellow': '#FFFF00',
    'gold': '#FFD700', 'rose gold': '#B76E79', 'purple': '#800080', 'pink': '#FFC0CB',
    'midnight': '#191970', 'starlight': '#F8F9FA'
  };
  return colorsMap[c] || c;
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Slider States
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Product Data States
  const [specs, setSpecs] = useState<any>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Search Suggestions States
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  // User Selection States (Color Only)
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);

  const [userLocation, setUserLocation] = useState('Dar es Salaam, Tanzania');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const cartCount = cart?.length || 0;

  // Filter bidhaa kwa ajili ya Live Search
  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6); // Zinaonekana top 6

  // Function ya ku-extract picha mbele ya list search dropdown
  const getDisplayImage = (imgData: string) => {
    if (!imgData) return '';
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgData;
    } catch (e) {
      return imgData;
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  const getDeterministicDiscount = (id: string) => {
    if (!id) return 15;
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) {
      hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 20) + 5;
  };

  // --- ACTIONS ---
  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const businessPhone = "255767949581";
    const colorText = selectedColor ? `%0A*Color:* ${selectedColor}` : '';
    const message = `Hello Jtex,%0AI am inquiring about this product:%0A*${product.name}*${colorText}%0A*Price:* TZS ${product.price.toLocaleString()}%0A%0A*Link:* ${window.location.href}`;
    window.open(`https://wa.me/${businessPhone}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) { }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') router.push(`/categories?search=${encodeURIComponent(searchQuery)}`);
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
  };

  // --- SLIDER CONTROLS ---
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const width = sliderRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / width);
      if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (index < 0 || index >= images.length) return;
    setCurrentImageIndex(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * index, behavior: 'smooth' });
    }
  };

  const slideNext = () => {
    if (currentImageIndex < images.length - 1) scrollToImage(currentImageIndex + 1);
  };

  const slidePrev = () => {
    if (currentImageIndex > 0) scrollToImage(currentImageIndex - 1);
  };

  // --- CART ADDING ---
  const handleAddToCart = (redirect: boolean = false) => {
    const productToAdd = {
      ...product,
      cartId: `${product.id}-${selectedColor}`,
      selectedColor: selectedColor,
      quantityToAdd: 1
    };

    addToCart(productToAdd);

    if (redirect) {
      router.push('/checkout');
    } else {
      alert(`1 item of ${selectedColor || product.name} added to cart!`);
    }
  };

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) setUserLocation(`${data.city}, ${data.country_name}`);
      }).catch(() => { });

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data);

        const foundProduct = data.find((p: any) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);

          let parsedImages = [];
          try {
            const imgs = JSON.parse(foundProduct.imageUrl);
            parsedImages = Array.isArray(imgs) ? imgs : [imgs];
          } catch (e) { parsedImages = [foundProduct.imageUrl]; }

          setImages(parsedImages.filter(Boolean).map((img: string) => img.startsWith('http') ? img : `${API_URL}${img}`));

          if (foundProduct.specifications) {
            try {
              const parsedSpecs = JSON.parse(foundProduct.specifications);
              setSpecs(parsedSpecs);

              const rawColor = parsedSpecs.Color || parsedSpecs.color || parsedSpecs.Colors || parsedSpecs.colors;
              if (rawColor) {
                const colorsArr = rawColor.split(/[\/,]/).map((c: string) => c.trim()).filter(Boolean);
                if (colorsArr.length > 0) {
                  setColorOptions(colorsArr);
                  setSelectedColor(colorsArr[0]);
                }
              }
            } catch (e) { }
          }
        }
      } catch (err) { } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">Loading product details...</p>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Product not found!</div>;

  const basePrice = product.price;
  const isMainProductWishlisted = wishlist.includes(product.id);

  const {
    Model, Color, color, Colors, colors,
    isWholesale, wholesaleTier2Price, wholesaleTier3Price,
    ...otherSpecs
  } = specs;

  const displayModel = Model || product.model || 'N/A';
  const displayCondition = product.condition || 'Brand New'; // Condition Display
  const hasWholesale = isWholesale === 'Yes';

  const tier2Price = wholesaleTier2Price ? Number(wholesaleTier2Price) : basePrice * 0.95;
  const tier3Price = wholesaleTier3Price ? Number(wholesaleTier3Price) : basePrice * 0.90;

  let preInfo: any = null;
  if (product.preOrderInfo) {
    try { preInfo = JSON.parse(product.preOrderInfo); } catch (e) { }
  }

  const otherSpecsKeys = Object.keys(otherSpecs);
  const visibleSpecsKeys = showAllSpecs ? otherSpecsKeys : otherSpecsKeys.slice(0, 5);

  // === TAFUTA SIMILAR PRODUCTS KWA KATEGORIA ===
  const similarProducts = allProducts.filter((p: any) => p.id !== product.id && p.category === product.category).slice(0, 5);
  const displaySimilar = similarProducts.length > 0 ? similarProducts : allProducts.filter((p: any) => p.id !== product.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900 font-sans pb-24 lg:pb-0 overflow-x-hidden">

      {/* ========================================================= */}
      {/* HEADERS (DESKTOP & MOBILE) */}
      {/* ========================================================= */}
      <header className="hidden lg:block bg-[#0A101D] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-shrink-0">
            <img src="/logo.png" alt="Jtex Logo" className="h-20 cursor-pointer object-contain" onClick={() => router.push('/')} />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiMapPin className="text-gray-400" size={20} />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Deliver to</span>
                <span className="text-xs font-semibold flex items-center gap-1">{userLocation.split(',')[0]} <FiChevronDown /></span>
              </div>
            </div>
          </div>

          {/* ACTIVE SEARCH DESKTOP */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="flex items-center h-12 bg-white rounded-lg overflow-hidden shadow-sm w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDesktopSuggestions(true); }}
                onFocus={() => setShowDesktopSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDesktopSuggestions(false), 200)}
                placeholder="Search products..."
                className="flex-1 h-full px-4 text-base text-gray-900 outline-none" // IOS Zoom Fix: text-base
              />
              <button type="submit" className="h-full px-8 bg-[#F2A900] text-black hover:bg-yellow-500 transition">
                <FiSearch size={20} />
              </button>
            </form>

            {/* LIVE SEARCH SUGGESTIONS DROPDOWN (DESKTOP) */}
            {showDesktopSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                {filteredSuggestions.length > 0 ? (
                  <ul className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                    {filteredSuggestions.map((prod) => (
                      <li
                        key={prod.id}
                        onClick={() => router.push(`/product/${prod.id}`)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0 transition"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                          {getDisplayImage(prod.imageUrl) ? (
                            <img src={getImageUrl(getDisplayImage(prod.imageUrl))} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                          ) : <FiPackage className="text-gray-400" />}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-bold text-gray-800 truncate">{prod.name}</span>
                          <span className="text-xs font-black text-[#F2A900]">TZS {prod.price.toLocaleString()}</span>
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
            <button onClick={() => router.push('/checkout')} className="relative flex flex-col items-center hover:bg-gray-800/50 p-2 rounded-lg transition">
              <FiShoppingCart size={24} className="text-gray-300" />
              <span className="text-[10px] font-medium mt-1">Cart</span>
              {cartCount > 0 && <span className="absolute top-0 right-1 bg-[#F2A900] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <header className="lg:hidden bg-[#0A101D] text-white pt-4 pb-3 sticky top-0 z-50">
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => router.back()}>
            <FiArrowLeft size={20} className="text-gray-300" />
            <span className="text-sm font-medium text-gray-300">Back</span>
          </div>
          <div className="flex items-center gap-4">
            <FiShare onClick={handleShare} size={20} className="text-gray-300 cursor-pointer" />
            <div className="relative" onClick={() => router.push('/checkout')}>
              <FiShoppingCart size={20} className="text-gray-300" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH BAR W/ SUGGESTIONS */}
        <div className="px-4 relative">
          <form onSubmit={handleSearch} className="flex items-center h-11 bg-white rounded-xl overflow-hidden shadow-sm w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowMobileSuggestions(true); }}
              onFocus={() => setShowMobileSuggestions(true)}
              onBlur={() => setTimeout(() => setShowMobileSuggestions(false), 200)}
              placeholder="Search products..."
              className="flex-1 h-full px-4 text-base text-gray-900 outline-none bg-transparent placeholder-gray-400" // IOS Zoom Fix: text-base
            />
            <button type="submit" className="h-full px-5 bg-[#F2A900] text-black"><FiSearch size={18} /></button>
          </form>

          {/* LIVE SEARCH SUGGESTIONS DROPDOWN (MOBILE) */}
          {showMobileSuggestions && searchQuery.trim() !== '' && (
            <div className="absolute top-full mt-2 left-4 right-4 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
              {filteredSuggestions.length > 0 ? (
                <ul className="max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {filteredSuggestions.map((prod) => (
                    <li
                      key={prod.id}
                      onClick={() => router.push(`/product/${prod.id}`)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                        {getDisplayImage(prod.imageUrl) ? (
                          <img src={getImageUrl(getDisplayImage(prod.imageUrl))} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                        ) : <FiPackage className="text-gray-400" />}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-800 truncate">{prod.name}</span>
                        <span className="text-[10px] font-black text-[#F2A900]">TZS {prod.price.toLocaleString()}</span>
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

      <main className="max-w-[1400px] mx-auto lg:px-6 lg:py-8 mt-2 lg:mt-0">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 mb-8 lg:mb-12 bg-white lg:rounded-3xl lg:border border-gray-100 lg:p-6 lg:shadow-sm">

          {/* ========================================================= */}
          {/* IMAGE SECTION */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[55%] flex flex-col-reverse lg:flex-row gap-4 relative px-4 lg:px-0">
            <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0 max-h-[500px] overflow-y-auto hide-scrollbar">
              {images.map((imgStr, idx) => (
                <div key={idx} onClick={() => scrollToImage(idx)} className={`w-20 h-20 bg-white rounded-xl border-2 p-2 cursor-pointer transition-all flex items-center justify-center ${currentImageIndex === idx ? 'border-[#F2A900]' : 'border-gray-100 hover:border-gray-300'}`}>
                  <img src={imgStr} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>

            <div className="flex-1 w-full bg-gray-50/50 rounded-2xl border border-gray-100 relative h-[350px] lg:h-[500px] overflow-hidden group">
              <button onClick={(e) => toggleWishlist(e, product.id)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md transition">
                <FiHeart className={`text-lg ${isMainProductWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={slidePrev}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-md transition-all opacity-0 group-hover:opacity-100 ${currentImageIndex === 0 ? 'hidden' : 'flex'}`}
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={slideNext}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-md transition-all opacity-0 group-hover:opacity-100 ${currentImageIndex === images.length - 1 ? 'hidden' : 'flex'}`}
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}

              <div ref={sliderRef} onScroll={handleScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar smooth-scroll scroll-smooth">
                {images.length > 0 ? (
                  images.map((imgStr, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-6 lg:p-12 relative">
                      <img src={imgStr} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50"><span className="text-9xl">📦</span></div>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/50 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                  {images.map((_, idx) => (
                    <div key={idx} onClick={() => scrollToImage(idx)} className={`h-1.5 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'w-4 bg-[#F2A900]' : 'w-1.5 bg-gray-400'}`}></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* PRODUCT DETAILS & BUYING OPTIONS */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[45%] flex flex-col px-4 lg:px-0 py-6 lg:py-0">

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{product.brand || 'Generic'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0A101D] leading-tight mb-4">{product.name}</h1>

            <div className="flex flex-col mb-4 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
              <span className="text-3xl lg:text-4xl font-bold text-[#0A101D] leading-none tracking-tight">TSH {basePrice.toLocaleString()}</span>

              {/* WHOLESALE BADGES */}
              <div className="flex items-center gap-2 mt-3">
                {hasWholesale && <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Discounts available for bulk orders</span>}
              </div>
            </div>

            {/* COLOR OPTIONS */}
            {colorOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">Available Colors: <span className="text-blue-600 font-medium capitalize">{selectedColor || colorOptions[0]}</span></h4>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((c, i) => {
                    const isSelected = selectedColor === c || (!selectedColor && i === 0);
                    const cssColor = getColorCode(c);
                    const isWhite = cssColor === '#FFFFFF' || cssColor.toLowerCase() === 'white';

                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={() => setSelectedColor(c)}>
                        {/* FIX YA COLOUR: ICONS NDOGO (w-6 h-6 badala ya w-10 h-10) */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-2 ring-offset-2 ring-[#F2A900] scale-110' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`} style={{ backgroundColor: cssColor }}>
                          {isSelected && <FiCheck className={isWhite ? 'text-black' : 'text-white'} size={12} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WHOLESALE */}
            {hasWholesale && (
              <div className="bg-gradient-to-br from-[#0A101D] to-gray-900 rounded-2xl p-4 border border-gray-800 mb-6 shadow-md text-white">
                <p className="text-[11px] font-medium text-[#F2A900] uppercase tracking-widest mb-3 flex items-center gap-2"><FiPackage size={14} /> Wholesale Pricing</p>
                <div className="grid grid-cols-3 divide-x divide-gray-700">
                  <div className="text-center px-2">
                    <p className="text-[10px] font-medium text-gray-400 mb-0.5">1 Piece</p>
                    <p className="font-semibold text-xs text-white">TZS {basePrice.toLocaleString()}</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[10px] font-medium text-gray-400 mb-0.5">2-5 Pcs</p>
                    <p className="font-semibold text-xs text-green-400">TZS {tier2Price.toLocaleString()}</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[10px] font-medium text-gray-400 mb-0.5">5+ Pcs</p>
                    <p className="font-semibold text-xs text-[#F2A900]">TZS {tier3Price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* RATINGS (NYOTA) NA BRAND NEW/USED VIMEKAWA PAMOJA */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-gray-50 w-max px-3 py-1.5 rounded-lg border border-gray-100">
                <div className="flex text-[#F2A900]">
                  <FiStar className="fill-[#F2A900]" size={14} />
                  <FiStar className="fill-[#F2A900]" size={14} />
                  <FiStar className="fill-[#F2A900]" size={14} />
                  <FiStar className="fill-[#F2A900]" size={14} />
                  <FiStar className="fill-gray-300 text-gray-300" size={14} />
                </div>
                <span className="text-[11px] font-bold text-gray-600 ml-1">4.0 (24 Reviews)</span>
              </div>

              <span className="text-gray-300">|</span>

              <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1.5 ${displayCondition.includes('New') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                <FiAward size={14} /> {displayCondition}
              </span>
            </div>

            {/* DELIVERY STATUS */}
            {preInfo && preInfo.isPreOrder ? (
              <div className="mb-6 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <FiTruck className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-sm text-blue-800 mb-1">Available for Pre-Order</p>
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">Shipping from <span className="font-semibold">{preInfo.origin}</span>. Est Delivery: <span className="font-semibold">{preInfo.estDays}</span>.</p>
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-green-50/50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
                <FiTruck className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-sm text-green-700 mb-1">In Stock</p>
                  <p className="text-[11px] font-medium text-green-800 leading-relaxed">
                    Delivery within 24 hours in Dar es Salaam. For other regions, shipping takes 2-3 business days. Free pickup available at our store.
                  </p>
                </div>
              </div>
            )}

            <div className="hidden lg:flex gap-3 mt-auto pt-4 border-t border-gray-100">
              <button onClick={() => handleAddToCart(false)} className="flex-1 bg-[#F2A900] hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(242,169,0,0.3)] hover:scale-[1.02]">
                <FiShoppingCart size={18} /> Add To Cart
              </button>
              <button onClick={() => handleAddToCart(true)} className="flex-1 bg-[#0A101D] hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-md hover:scale-[1.02]">
                Buy It Now <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION BELOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-12 px-4 lg:px-0">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-max">
            <h3 className="text-lg font-semibold text-[#0A101D] mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#F2A900] rounded-full"></span> Product Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-normal">
              {product.description || `Elevate your experience with the ${product.name}. Designed to withstand daily use while providing optimal performance. Shop now and enjoy true quality from Jtex.`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A101D] mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-[#F2A900] rounded-full"></span> Specifications</h3>

            <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 bg-gray-50/50 text-sm">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">Brand</span>
                <span className="font-semibold text-gray-900 w-2/3">{product.brand || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 text-sm">
                <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">Model</span>
                <span className="font-medium text-blue-600 w-2/3">{displayModel}</span>
              </div>

              {otherSpecsKeys.length > 0 ? (
                <>
                  {visibleSpecsKeys.map((key, index) => (
                    <div key={key} className={`flex items-center justify-between py-3 px-4 text-sm ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100`}>
                      <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">{key}</span>
                      <span className="font-medium text-gray-900 w-2/3">{otherSpecs[key]}</span>
                    </div>
                  ))}

                  {otherSpecsKeys.length > 5 && (
                    <button
                      onClick={() => setShowAllSpecs(!showAllSpecs)}
                      className="w-full py-4 text-xs font-semibold text-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 mt-auto border-t border-blue-100"
                    >
                      {showAllSpecs ? 'View Less' : `See All Specifications (${otherSpecsKeys.length - 5} More)`}
                      <FiChevronDown className={`transition-transform ${showAllSpecs ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </>
              ) : (
                <div className="py-4 text-xs font-medium text-gray-400 px-4 text-center bg-gray-50">No additional specifications.</div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SIMILAR PRODUCTS SECTION (MPYA) */}
        {/* ========================================================= */}
        <div className="mb-12 px-4 lg:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-black text-gray-900">Similar Products</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {displaySimilar.map((item: any) => {
              const visualDiscount = getDeterministicDiscount(item.id);
              const oldPrice = Math.round(item.price / (1 - (visualDiscount / 100)));
              const isWishlisted = wishlist.includes(item.id);

              return (
                <div
                  key={`sim-${item.id}`}
                  onClick={() => router.push(`/product/${item.id}`)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col h-full group hover:border-[#F2A900] transition cursor-pointer"
                >
                  <div className="relative w-full pt-[100%] bg-gray-50/50 rounded-xl mb-4 overflow-hidden border border-gray-50 flex-shrink-0">
                    <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[10px] font-black px-1.5 py-0.5 rounded z-20">-{visualDiscount}%</span>
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 lg:hidden z-20" onClick={(e) => toggleWishlist(e, item.id)}>
                      <FiHeart className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                    </button>

                    {getDisplayImage(item.imageUrl) ? (
                      <img src={getImageUrl(getDisplayImage(item.imageUrl))} alt={item.name} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h4 className="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">{item.name}</h4>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mb-2 mt-auto">
                      <span className="font-black text-sm lg:text-base text-gray-900">TZS {item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 line-through">TZS {oldPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-3">
                      <div className="flex items-center text-[#F2A900] text-[10px] font-bold">
                        <span className="flex items-center tracking-tighter">★★★★★</span> <span className="text-gray-400 ml-1 font-medium hidden sm:inline-block">({Math.floor(Math.random() * 100) + 10})</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(item); alert(`1 item added to cart!`); }} className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-[#F2A900] hover:text-black hover:border-[#F2A900] transition">
                        <FiShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </main>

      <div className="hidden lg:block"><Footer /></div>

      {/* MOBILE BOTTOM NAV */}
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
          <button onClick={() => handleAddToCart(false)} className="flex-1 bg-[#F2A900] text-[#0A101D] font-semibold py-3.5 rounded-xl text-xs shadow-[0_4px_10px_rgba(242,169,0,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <FiShoppingCart size={14} /> Add to Cart
          </button>
          <button onClick={() => handleAddToCart(true)} className="flex-1 bg-[#0A101D] text-white font-semibold py-3.5 rounded-xl text-xs shadow-md active:scale-95 transition-transform">
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