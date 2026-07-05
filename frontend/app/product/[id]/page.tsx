'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiHeart, FiShare, FiShoppingCart, FiStar, 
  FiChevronRight, FiSearch, FiMoreVertical, FiMessageCircle, FiHome 
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import TopTicker from '../../components/navigation/TopTicker';
import Footer from '../../components/common/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  
  const [specs, setSpecs] = useState<any>({});
  const [wishlist, setWishlist] = useState<string[]>([]);

  const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data);
        
        const foundProduct = data.find((p: any) => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.imageUrl ? `${API_URL}${foundProduct.imageUrl}` : '');
          
          if (foundProduct.specifications) {
            try {
              setSpecs(JSON.parse(foundProduct.specifications));
            } catch (e) {
              setSpecs({});
            }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Inatafuta bidhaa...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Bidhaa haijapatikana!</div>;

  const basePrice = product.price;
  const tier2Price = basePrice * 0.95; 
  const tier3Price = basePrice * 0.90; 
  
  // Kutengeneza bei ya zamani (Visual Mockup based on your image)
  const discountPercentage = 20;
  const oldPrice = Math.round(basePrice / (1 - (discountPercentage / 100)));

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const RelatedProductCard = ({ item }: { item: any }) => {
    const isWishlisted = wishlist.includes(item.id);
    return (
      <div className="w-full bg-white rounded-xl p-2.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group flex flex-col cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
        <button onClick={(e) => toggleWishlist(e, item.id)} className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition">
          <FiHeart className={`text-sm ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {item.oldPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            -{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
          </span>
        )}
        <div className="aspect-square bg-white border border-gray-50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center p-1 sm:p-2 relative overflow-hidden group-hover:bg-gray-50 transition">
          {item.imageUrl ? (
            <img src={`${API_URL}${item.imageUrl}`} alt={item.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition duration-500" />
          ) : (
            <span className="text-4xl group-hover:scale-105 transition duration-500">{item.imageEmoji}</span>
          )}
        </div>
        <h3 className="text-[11px] sm:text-sm font-medium text-gray-800 leading-tight mb-1 line-clamp-2 group-hover:text-[#F2A900] transition h-8">{item.name}</h3>
        <div className="flex flex-col mb-2 mt-auto">
          <span className="text-sm sm:text-lg font-bold text-[#0F172A] leading-none">TZS {item.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <div className="flex items-center text-[#F2A900] text-[8px] sm:text-[10px]">
              ★★★★★
            </div>
            <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0F172A] hover:bg-[#F2A900] transition-all shadow-sm">
              <FiShoppingCart className="text-xs sm:text-sm" />
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24 lg:pb-0">
      <div className="hidden lg:block">
         <TopTicker />
      </div>
      
      {/* ========================================================= */}
      {/* 1. MOBILE HEADER (Kama kwenye picha) */}
      {/* ========================================================= */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-40 shadow-sm">
         <button onClick={() => router.back()} className="text-gray-800 p-1">
            <FiArrowLeft size={24} />
         </button>
         <div className="flex items-center gap-5 text-gray-800">
            <FiSearch size={22} className="cursor-pointer" />
            <FiShare size={22} className="cursor-pointer" />
            <FiShoppingCart size={22} className="cursor-pointer" onClick={() => router.push('/checkout')} />
            <FiMoreVertical size={22} className="cursor-pointer" />
         </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP HEADER (Iliyokuwepo awali) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex border-b border-gray-100 bg-white sticky top-0 z-40 max-w-7xl mx-auto px-6 py-4 items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition">
          <FiArrowLeft className="text-lg" /> Back to Store
        </button>
        <div className="flex gap-4 text-xl text-gray-600">
          <FiShare className="cursor-pointer hover:text-[#F2A900] transition" />
          <FiHeart className="cursor-pointer hover:text-red-500 transition" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto lg:px-6 lg:py-8">
        
        {/* ========================================================= */}
        {/* SEHEMU YA JUU: PICHA NA MAELEZO MAFUPI */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 mb-8 lg:mb-12">
          
          {/* IMAGE SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
            
            {/* Desktop Side Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 w-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 p-2 cursor-pointer hover:border-[#F2A900] transition">
                  {mainImage ? <img src={mainImage} className="w-full h-full object-contain mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-2xl">{product.imageEmoji || '📦'}</div>}
                </div>
              ))}
            </div>
            
            {/* Main Image View */}
            <div className="flex-1 bg-gray-50 lg:rounded-2xl border-b lg:border border-gray-100 flex flex-col items-center justify-center p-8 relative min-h-[350px]">
              <span className="hidden lg:inline-block absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded tracking-wider">
                {product.brand}
              </span>
              
              {/* Mobile 1/4 Badge */}
              <span className="lg:hidden absolute bottom-8 left-4 bg-gray-200/80 text-gray-800 text-xs font-bold px-3 py-1 rounded-full z-10">
                1/4
              </span>

              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full max-h-[350px] object-contain mix-blend-multiply" />
              ) : (
                <span className="text-9xl">{product.imageEmoji || '📦'}</span>
              )}

              {/* Mobile Dots */}
              <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                 <div className="w-4 h-1.5 bg-[#F2A900] rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col px-4 lg:px-0 mt-4 lg:mt-0">
            
            {/* Price Area (Kama picha) */}
            <div className="flex items-end gap-2 mb-1">
               <span className="text-2xl lg:text-3xl font-bold text-gray-900 leading-none">TSH {basePrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-sm text-gray-400 line-through">TSH {oldPrice.toLocaleString()}</span>
               <span className="bg-[#FF7A00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">-{discountPercentage}%</span>
            </div>
            
            {/* Title (Maneno yamepunguzwa uzito - font-medium) */}
            <h1 className="text-base lg:text-xl font-medium text-gray-800 leading-snug mb-2">{product.name}</h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <div className="flex text-[#F2A900] text-sm">
                 <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current text-gray-300" />
              </div>
              <span className="text-gray-500 text-xs">4.0 Star Rated, 30 Reviews</span>
            </div>

            {/* Tier Pricing (Imekaa vizuri kuendana na picha) */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-5">
              <p className="text-[11px] font-semibold text-gray-600 mb-2">Minimum Order 1 Piece</p>
              <div className="grid grid-cols-3 divide-x divide-gray-200">
                <div className="px-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">1 Piece</p>
                  <p className="font-bold text-sm lg:text-base text-gray-900">TSH {(basePrice / 1000).toFixed(0)}K</p>
                </div>
                <div className="px-3">
                  <p className="text-[10px] text-gray-500 mb-0.5">2-5 Pieces</p>
                  <p className="font-bold text-sm lg:text-base text-gray-900">TSH {(tier2Price / 1000).toFixed(0)}K</p>
                </div>
                <div className="px-3">
                  <p className="text-[10px] text-gray-500 mb-0.5">&gt;5 Pieces</p>
                  <p className="font-bold text-sm lg:text-base text-gray-900">TSH {(tier3Price / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>

            {/* Stock Info */}
            <div className="mb-5">
              <p className="font-semibold text-sm text-green-600 mb-1">In Stock - Ready to Ship</p>
              <p className="text-[11px] lg:text-xs text-gray-500 leading-relaxed">
                Additional Info: This product is available in our local warehouse.<br className="hidden lg:block"/>
                Delivery within 24 hours in Dar es Salaam.
              </p>
            </div>

            {/* Variations/Specs */}
            <div className="mb-6 space-y-4">
              {specs.RAM && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase mb-2">Memory (RAM)</p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 border border-gray-300 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">{specs.RAM}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Action Buttons (Mobile iko chini kabisa) */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-3 mt-auto">
              <button onClick={() => { addToCart(product); alert('Imewekwa kwenye kikapu!'); }} className="flex-1 bg-[#F2A900] hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl text-sm transition shadow-sm flex justify-center items-center gap-2">
                <FiShoppingCart /> Add To Cart
              </button>
              <button onClick={() => { addToCart(product); router.push('/?cart=open'); }} className="flex-1 bg-[#0A101D] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition flex justify-center items-center gap-2">
                Buy Now <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SEHEMU YA KATI: MAELEZO NA SPECIFICATIONS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 border-t border-gray-100 pt-8 lg:pt-12 mb-12 px-4 lg:px-0">
          <div>
            <h3 className="text-lg font-bold mb-3">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || `Elevate your productivity with the ${product.name}. Featuring a premium display, powerful processor, and lightning-fast storage. Sleek, portable, and designed for high performance.`}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Specifications</h3>
            <div className="bg-gray-50 rounded-xl p-4 lg:p-6 border border-gray-100">
              <div className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="w-1/3 font-semibold text-gray-500">Brand</span>
                <span className="w-2/3 font-medium text-gray-900">{product.brand || 'N/A'}</span>
              </div>
              <div className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="w-1/3 font-semibold text-gray-500">Category</span>
                <span className="w-2/3 font-medium text-gray-900">{product.category}</span>
              </div>
              {Object.keys(specs).map((key) => (
                <div key={key} className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                  <span className="w-1/3 font-semibold text-gray-500">{key}</span>
                  <span className="w-2/3 font-medium text-gray-900">{specs[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SEHEMU YA CHINI: RELATED PRODUCTS */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-8 lg:pt-12 mb-10 px-4 lg:px-0">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Recommended Products</h3>
              <button onClick={() => router.push('/')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map(item => (
                <RelatedProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="hidden lg:block">
         <Footer />
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM ACTION BAR (Sticky Bottom) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-3 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
         <div onClick={() => router.push('/')} className="flex flex-col items-center justify-center text-gray-500 hover:text-[#F2A900] min-w-[50px] cursor-pointer">
            <FiHome size={22} className="mb-0.5" />
            <span className="text-[9px] font-medium">Store</span>
         </div>
         <div className="flex flex-col items-center justify-center text-gray-500 hover:text-[#F2A900] min-w-[50px] cursor-pointer">
            <FiMessageCircle size={22} className="mb-0.5" />
            <span className="text-[9px] font-medium">Message</span>
         </div>
         
         <button onClick={() => addToCart(product)} className="flex-1 bg-[#F2A900] text-black font-bold py-3 rounded-full text-[13px] shadow-sm">
            Add To Cart
         </button>
         <button onClick={() => { addToCart(product); router.push('/checkout'); }} className="flex-1 bg-[#0A101D] text-white font-bold py-3 rounded-full text-[13px] shadow-sm">
            Buy Now
         </button>
      </div>

    </div>
  );
}