'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiTag, FiTrendingUp, FiZap, FiSend, FiPercent, 
  FiPackage, FiCheckCircle, FiStar, FiShoppingBag, 
  FiExternalLink, FiCopy, FiBox, FiMessageCircle, FiLayers 
} from 'react-icons/fi';

export default function AdminMarketing() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // WhatsApp Campaign Generator State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customPromoText, setCustomPromoText] = useState('');
  const [copied, setCopied] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (data.length > 0) {
            setSelectedProductId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching products for marketing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketingData();
  }, [API_URL]);

  // --- REAL DATA METRICS ---
  const totalCatalog = products.length;
  
  // Bidhaa zenye mabegi ya promosheni (Hot, Sale, New, Pre-Order)
  const featuredProducts = products.filter(p => p.badge && p.badge.trim() !== '');
  
  // Bidhaa zenye mfumo wa Wholesale
  const wholesaleProducts = products.filter(p => {
    try {
      const specs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      return specs?.isWholesale === 'Yes';
    } catch(e) {
      return false;
    }
  });

  // Bidhaa za Pre-Order
  const preOrderProducts = products.filter(p => p.preOrderInfo?.includes('isPreOrder":true') || p.badge === 'Pre-Order');

  // Selected Product for WhatsApp Campaign
  const activePromoProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Generate WhatsApp Message Template
  const generatedMessage = activePromoProduct ? 
    `🔥 *JTEX EXCLUSIVE OFFER!* 🔥%0A%0AHello valued customer, check out our featured item:%0A📦 *${activePromoProduct.name}*%0A💰 *Price:* TZS ${Number(activePromoProduct.price || 0).toLocaleString()}%0A${activePromoProduct.condition ? `✨ *Condition:* ${activePromoProduct.condition}%0A` : ''}%0A🛒 Order now via our store or reply directly to grab yours today! Free delivery in Dar es Salaam.` : '';

  const handleCopyMessage = () => {
    const decodedMessage = decodeURIComponent(generatedMessage.replace(/%0A/g, '\n').replace(/%20/g, ' '));
    navigator.clipboard.writeText(decodedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsAppBroadcast = () => {
    const decodedMessage = decodeURIComponent(generatedMessage);
    window.open(`https://wa.me/?text=${decodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 tracking-wider">Loading marketing & campaigns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900]"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">Campaign Hub & Promotions</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Marketing & Growth Tools</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage promotional badges, wholesale tiers, and WhatsApp broadcast messages using live stock.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm">
            <FiZap className="text-[#F2A900]" /> {totalCatalog} Total Active Items
          </div>
        </div>
      </div>

      {/* TOP METRICS CARDS (REAL DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Featured / Badged</p>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{featuredProducts.length} Items</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">Hot, Sale, New tags</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FiTag size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Wholesale Enabled</p>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{wholesaleProducts.length} Items</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">Bulk discount active</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FiPackage size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Pre-Order Catalog</p>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{preOrderProducts.length} Items</h3>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded mt-2 inline-block">Global shipping sync</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <FiLayers size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Standard Stock</p>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{totalCatalog - preOrderProducts.length} Items</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-2 inline-block">Ready for delivery</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FiShoppingBag size={22} />
          </div>
        </div>
      </div>

      {/* WHATSAPP MARKETING BROADCAST GENERATOR (POWERED BY REAL DATA) */}
      <div className="bg-gradient-to-br from-[#0A101D] to-gray-900 rounded-3xl p-8 text-white shadow-xl border border-gray-800">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-[#F2A900] text-xs font-black uppercase tracking-wider">
              <FiMessageCircle size={18} /> WhatsApp Marketing Generator
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Instant Social & WhatsApp Broadcast</h2>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Select any live product from your database to automatically generate a professionally formatted promotional message ready to share with customer groups.
            </p>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Select Product to Promote</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#F2A900] cursor-pointer"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — TZS {Number(p.price || 0).toLocaleString()} ({p.category || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="w-full lg:w-1/2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Live Message Preview</span>
              <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FiCheckCircle size={12}/> Ready to Broadcast
              </span>
            </div>

            <div className="bg-[#060911] p-4 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 whitespace-pre-line leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar">
              {decodeURIComponent(generatedMessage.replace(/%0A/g, '\n').replace(/%20/g, ' '))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleCopyMessage}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 border border-gray-700"
              >
                <FiCopy /> {copied ? 'Copied to Clipboard!' : 'Copy Message'}
              </button>
              <button 
                onClick={handleOpenWhatsAppBroadcast}
                className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                <FiSend /> Broadcast via WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* LOWER SECTION: ACTIVE PROMOTIONAL & BADGED PRODUCTS TABLE */}
      <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-black text-base text-gray-900">Active Badged & Promoted Catalog</h3>
            <p className="text-xs text-gray-400">Products currently highlighted with marketing tags on customer store.</p>
          </div>
          <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-xl w-max">
            {featuredProducts.length} Badged Items Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (TZS)</th>
                <th className="py-3 px-4">Marketing Badge</th>
                <th className="py-3 px-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                        {p.imageUrl ? (
                          <img 
                            src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_URL}${JSON.parse(p.imageUrl)[0]}`} 
                            alt="" 
                            className="w-full h-full object-contain mix-blend-multiply" 
                          />
                        ) : <FiBox className="text-gray-400"/>}
                      </div>
                      <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-semibold">{p.category || 'General'}</td>
                    <td className="py-4 px-4 font-black text-gray-900">TZS {Number(p.price || 0).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        p.badge === 'Hot' ? 'bg-red-50 text-red-600 border border-red-100' :
                        p.badge === 'Sale' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        p.badge === 'New' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-purple-50 text-purple-600 border border-purple-100'
                      }`}>
                        {p.badge}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900">{p.stockQuantity} units</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-gray-400 italic">
                    No active marketing badges found on products yet. You can assign badges (Hot, Sale, New, Pre-Order) when adding or editing products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}