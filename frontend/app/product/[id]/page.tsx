'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiHeart, FiShare, FiShoppingCart, FiStar, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import TopTicker from '../../components/navigation/TopTicker';
import Footer from '../../components/common/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  
  // States za muonekano (UI States)
  const [selectedQty, setSelectedQty] = useState(1);
  const [specs, setSpecs] = useState<any>({});

  const API_URL = 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Tunavuta bidhaa zote kisha tunachuja ile yenye ID hii
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        const foundProduct = data.find((p: any) => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.imageUrl ? `${API_URL}${foundProduct.imageUrl}` : '');
          
          // Jaribu kusoma JSON ya specifications
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

  // Kutengeneza bei za makundi (Tiers) kama ilivyo kwenye picha ya mteja
  const basePrice = product.price;
  const tier2Price = basePrice * 0.95; // Punguzo la 5% kwa 2-5 pieces
  const tier3Price = basePrice * 0.90; // Punguzo la 10% kwa >5 pieces

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      <TopTicker />
      
      {/* HEADER NDOGO YA KURUDI NYUMA */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition">
            <FiArrowLeft className="text-lg" /> Back to Store
          </button>
          <div className="flex gap-4 text-xl text-gray-600">
            <FiShare className="cursor-pointer hover:text-[#F2A900] transition" />
            <FiHeart className="cursor-pointer hover:text-red-500 transition" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* SEHEMU YA JUU: PICHA NA MAELEZO MAFUPI */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          
          {/* UPANDE WA KUSHOTO: GALLERY */}
          <div className="w-full lg:w-1/2 flex gap-4">
            {/* Thumbnails (Tunaweka picha ileile mara nyingi kwa ajili ya muonekano) */}
            <div className="flex flex-col gap-3 w-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 p-2 cursor-pointer hover:border-[#F2A900] transition">
                  {mainImage ? <img src={mainImage} className="w-full h-full object-contain mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-2xl">{product.imageEmoji || '📦'}</div>}
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-8 relative">
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded tracking-wider">
                {product.brand}
              </span>
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full max-h-[400px] object-contain mix-blend-multiply" />
              ) : (
                <span className="text-9xl">{product.imageEmoji || '📦'}</span>
              )}
            </div>
          </div>

          {/* UPANDE WA KULIA: TAARIFA ZA KUNUNUA */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 text-[#F2A900] text-sm mb-3">
              <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current text-gray-300" />
              <span className="text-gray-500 font-medium ml-2">4.0 Star Rated, 30 Reviews</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-6">{product.name}</h1>

            {/* Pricing Tiers */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Minimum Order 1 Piece</p>
              <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200">
                <div className="px-2">
                  <p className="text-[10px] text-gray-500 mb-1">1 Piece</p>
                  <p className="font-black text-lg text-gray-900">TSH {basePrice.toLocaleString()}</p>
                </div>
                <div className="px-4">
                  <p className="text-[10px] text-gray-500 mb-1">2-5 Pieces</p>
                  <p className="font-black text-lg text-gray-900">TSH {tier2Price.toLocaleString()}</p>
                </div>
                <div className="px-4">
                  <p className="text-[10px] text-gray-500 mb-1">&gt;5 Pieces</p>
                  <p className="font-black text-lg text-gray-900">TSH {tier3Price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-6">
              <p className="font-bold text-sm text-green-600 mb-1">In Stock - Ready to Ship</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Additional Info: This product is available in our local warehouse.<br/>
                Delivery within 24 hours in Dar es Salaam.
              </p>
            </div>

            {/* Variants (Mockup kulingana na picha) */}
            <div className="mb-8 space-y-4">
              {specs.Processor && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Processor</p>
                  <div className="flex gap-2">
                    <span className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">{specs.Processor}</span>
                  </div>
                </div>
              )}
              {specs.RAM && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Memory (RAM)</p>
                  <div className="flex gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">{specs.RAM}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button onClick={() => { addToCart(product); alert('Imewekwa kwenye kikapu!'); }} className="flex-1 bg-[#F2A900] hover:bg-yellow-500 text-[#0F172A] font-black py-4 rounded-xl text-sm transition shadow-sm flex justify-center items-center gap-2">
                <FiShoppingCart /> Add To Cart
              </button>
              <button onClick={() => { addToCart(product); router.push('/?checkout=true'); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black py-4 rounded-xl text-sm transition flex justify-center items-center gap-2">
                Check-Out <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* SEHEMU YA CHINI: MAELEZO NA SPECIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12 mb-16">
          <div>
            <h3 className="text-xl font-black mb-4">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || `Elevate your productivity with the ${product.name}. Featuring a premium display, powerful processor, and lightning-fast storage. Sleek, portable, and designed for high performance.`}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-black mb-4">Specifications</h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="w-1/3 font-bold text-gray-500">Brand</span>
                <span className="w-2/3 font-bold text-gray-900">{product.brand || 'N/A'}</span>
              </div>
              <div className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                <span className="w-1/3 font-bold text-gray-500">Category</span>
                <span className="w-2/3 font-bold text-gray-900">{product.category}</span>
              </div>
              {Object.keys(specs).map((key) => (
                <div key={key} className="flex py-2 border-b border-gray-200 last:border-0 text-sm">
                  <span className="w-1/3 font-bold text-gray-500">{key}</span>
                  <span className="w-2/3 font-bold text-gray-900">{specs[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}