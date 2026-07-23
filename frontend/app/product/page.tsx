'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { 
  FiHeart, FiShoppingCart, FiShare2, FiShield, 
  FiTruck, FiCheck, FiMinus, FiPlus, FiStar, FiPackage 
} from 'react-icons/fi';

// Components zako za Layout (Hakikisha njia/paths ziko sawa)
import TopTicker from '../../components/navigation/TopTicker';
import MainHeader from '../../components/navigation/MainHeader';
import NavbarLinks from '../../components/navigation/NavbarLinks';
import Footer from '../../components/common/Footer';

// === HELPER FUNCTION: KUBADILI JINA LA RANGI KUWA RANGI HALISI ===
const getColorCode = (colorName: string) => {
  if (!colorName) return '';
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

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>('');
  
  // Specs & Options States
  const [specs, setSpecs] = useState<any>({});
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        
        const foundProduct = data.find((p: any) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Image Parsing
          let parsedImages = [];
          try {
            const imgs = JSON.parse(foundProduct.imageUrl);
            parsedImages = Array.isArray(imgs) ? imgs : [imgs];
          } catch(e) { parsedImages = [foundProduct.imageUrl]; }

          const finalImages = parsedImages.filter(Boolean).map((img: string) => img.startsWith('http') ? img : `${API_URL}${img}`);
          setImages(finalImages);
          if (finalImages.length > 0) setMainImage(finalImages[0]);
          
          // Specs & Colors Parsing (Deep Parse)
          if (foundProduct.specifications) {
            try { 
              let parsedSpecs = foundProduct.specifications;
              if (typeof parsedSpecs === 'string') parsedSpecs = JSON.parse(parsedSpecs);
              if (typeof parsedSpecs === 'string') parsedSpecs = JSON.parse(parsedSpecs);
              
              setSpecs(parsedSpecs);

              const colorKey = Object.keys(parsedSpecs).find(k => ['color', 'colors', 'colour', 'colours', 'rangi'].includes(k.toLowerCase().trim()));
              
              if (colorKey && parsedSpecs[colorKey]) {
                 const colorsArr = String(parsedSpecs[colorKey]).split(/[\/,|]/).map(c => c.trim()).filter(Boolean);
                 if (colorsArr.length > 0) {
                    setColorOptions(colorsArr);
                    setSelectedColor(colorsArr[0]); // Auto-select first color
                 }
              }
            } catch (e) { console.error(e); }
          }
        }
      } catch (err) {
         console.error(err);
      } finally { 
         setLoading(false); 
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd = {
      ...product,
      cartId: `${product.id}-${selectedColor || 'default'}`,
      selectedColor: selectedColor,
      quantityToAdd: qty
    };
    addToCart(productToAdd);
    alert(`${qty} x ${product.name} imeongezwa kwenye kikapu!`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link imekopiwa!');
      }
    } catch (err) {}
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] gap-4">
      <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">Inatafuta bidhaa...</p>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
       <MainHeader />
       <div className="flex-1 flex items-center justify-center font-bold text-red-500">Bidhaa Haikupatikana!</div>
    </div>
  );

  const basePrice = Number(product.price);
  const oldPrice = product.buyingPrice ? Number(product.buyingPrice) : basePrice * 1.15; // Fake original price if missing
  const hasWholesale = specs?.isWholesale === 'Yes';
  
  // Kuondoa baadhi ya keys kwenye specs ambazo hazihitaji kuonekana kwenye table
  const { isWholesale, wholesaleTier2Price, wholesaleTier3Price, Color, color, Colors, colors, Colour, colour, ...displaySpecs } = specs;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased flex flex-col">
      {/* Global Headers */}
      <TopTicker />
      <MainHeader />
      <NavbarLinks />

      {/* Breadcrumb (Dynamic) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 text-xs text-gray-500 font-medium flex flex-wrap gap-2 items-center">
          <Link href="/" className="hover:text-[#F2A900] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/categories?search=${product.category}`} className="hover:text-[#F2A900] transition">{product.category || 'Shop'}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 my-4">
        
        {/* SEHEMU YA JUU: Picha na Maelezo ya Bei */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-10">
          
          {/* Upande wa Picha */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl h-[350px] md:h-[450px] flex items-center justify-center border border-gray-100 relative overflow-hidden group">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg z-10 shadow-sm">
                  {product.badge}
                </span>
              )}
              {mainImage ? (
                 <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-500 group-hover:scale-105" />
              ) : (
                 <span className="text-9xl">📦</span>
              )}
            </div>
            
            {/* Picha Ndogo (Thumbnails - Dynamic) */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl border-2 flex items-center justify-center cursor-pointer transition p-2 ${mainImage === img ? 'border-[#F2A900] shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="thumbnail" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upande wa Maelezo na Bei */}
          <div className="w-full lg:w-7/12 flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{product.brand || 'Generic'}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${product.condition?.includes('New') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {product.condition || 'Brand New'}
              </span>
              <span className="flex items-center text-[#F2A900] text-sm ml-2">
                <FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="fill-current" /> <FiStar className="text-gray-300" />
              </span>
              <span className="text-xs text-gray-400 font-medium">(In Stock)</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-end gap-3 mb-6 bg-gray-50 w-max p-4 rounded-2xl border border-gray-100">
              <span className="text-3xl md:text-4xl font-black text-[#0A101D] tracking-tight">TZS {basePrice.toLocaleString()}</span>
              {oldPrice > basePrice && <span className="text-lg text-gray-400 line-through mb-1 font-semibold">TZS {oldPrice.toLocaleString()}</span>}
            </div>

            {/* COLOR OPTIONS */}
            {colorOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Available Colors: <span className="text-gray-900 ml-1">{selectedColor}</span></h4>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((c, i) => {
                    const isSelected = selectedColor === c;
                    const cssColor = getColorCode(c);
                    const isWhite = cssColor === '#FFFFFF' || cssColor.toLowerCase() === 'white';
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={() => setSelectedColor(c)}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-2 ring-offset-2 ring-[#F2A900] scale-110' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`} style={{ backgroundColor: cssColor }}>
                          {isSelected && <FiCheck className={isWhite ? 'text-black' : 'text-white'} size={18} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WHOLESALE BANNER */}
            {hasWholesale && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-6 flex items-center gap-3">
                 <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><FiPackage size={18}/></div>
                 <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Wholesale Discount Available</h4>
                    <p className="text-[10px] text-emerald-600 font-medium">Buy more than 2 pieces to automatically apply bulk pricing in your cart.</p>
                 </div>
              </div>
            )}

            {/* Vitufe vya Manunuzi */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-6 mt-2 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 w-full sm:w-32 bg-gray-50 flex-shrink-0">
                <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-4 h-full text-gray-600 hover:bg-gray-200 transition"><FiMinus /></button>
                <span className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 bg-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 h-full text-gray-600 hover:bg-gray-200 transition"><FiPlus /></button>
              </div>

              <button onClick={handleAddToCart} className="flex-1 w-full h-14 bg-gradient-to-r from-[#F2A900] to-yellow-500 text-[#0A101D] font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <FiShoppingCart size={20} /> Add to Cart
              </button>

              <button onClick={handleShare} className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#F2A900] hover:border-[#F2A900] transition">
                <FiShare2 size={20} />
              </button>
            </div>

            {/* Badges za Uaminifu */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-600 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5"><div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><FiTruck size={16} /></div> Delivery in Dar es Salaam</div>
              <div className="flex items-center gap-2.5"><div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><FiShield size={16} /></div> Quality Assured</div>
              <div className="flex items-center gap-2.5"><div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><FiCheck size={16} /></div> 100% Genuine Product</div>
              <div className="flex items-center gap-2.5"><div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><FiPackage size={16} /></div> Secure Packaging</div>
            </div>
          </div>
        </div>

        {/* SEHEMU YA CHINI: Maelezo Zaidi (Tabs) */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-2 pt-2">
            <button 
              onClick={() => setActiveTab('description')} 
              className={`px-6 py-4 text-sm font-black transition rounded-t-xl ${activeTab === 'description' ? 'bg-white border-b-2 border-[#F2A900] text-[#0A101D]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('specs')} 
              className={`px-6 py-4 text-sm font-black transition rounded-t-xl ${activeTab === 'specs' ? 'bg-white border-b-2 border-[#F2A900] text-[#0A101D]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Specifications
            </button>
          </div>
          
          <div className="p-6 md:p-8 text-sm text-gray-700 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4 whitespace-pre-line text-base">
                {product.description || `Elevate your lifestyle with the highly anticipated ${product.name}. Designed to meet the demands of modern users, this product perfectly balances aesthetics, performance, and durability.\n\nEnjoy a seamless experience backed by Jtex's quality guarantee. Order now to get fast shipping directly to your doorstep.`}
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-bold text-gray-500 uppercase text-[11px] tracking-wider">Brand</span>
                  <span className="font-bold text-gray-900">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-bold text-gray-500 uppercase text-[11px] tracking-wider">Model</span>
                  <span className="font-bold text-[#F2A900]">{product.model || 'Standard'}</span>
                </div>
                {Object.keys(displaySpecs).length > 0 ? Object.keys(displaySpecs).map((key) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-bold text-gray-500 uppercase text-[11px] tracking-wider">{key}</span>
                    <span className="font-bold text-gray-900 text-right w-1/2 line-clamp-1">{displaySpecs[key]}</span>
                  </div>
                )) : (
                  <div className="col-span-1 md:col-span-2 py-4 text-gray-400 italic">No additional specifications available for this product.</div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>
      
      {/* Global Footer */}
      <Footer />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}