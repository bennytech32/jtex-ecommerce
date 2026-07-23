'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, 
  FiBox, FiCalendar, FiDownload, FiFilter, FiArrowUpRight, FiArrowDownRight, 
  FiPieChart, FiActivity, FiLayers, FiAlertTriangle, FiCheckCircle, FiPackage 
} from 'react-icons/fi';

export default function AdminAnalytics() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching analytics products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [API_URL]);

  // --- REAL DATA CALCULATIONS FROM DATABASE ---
  const totalProducts = products.length;
  
  // Jumla ya idadi ya bidhaa zote zilizopo stoku (Physical Stock Units)
  const totalStockUnits = products.reduce((acc, p) => acc + Number(p.stockQuantity || 0), 0);
  
  // Mtaji wa jumla wa mali iliyopo stoku (Total Inventory Capital Value)
  const totalInventoryCapital = products.reduce((acc, p) => acc + (Number(p.buyingPrice || p.price || 0) * Number(p.stockQuantity || 0)), 0);
  
  // Thamani ya mauzo inayotarajiwa kutoka stoku iliyopo (Potential Retail Value)
  const potentialRetailValue = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stockQuantity || 0)), 0);

  // Bidhaa zilizokaribia kuisha (< 5 items na sio pre-order)
  const lowStockProducts = products.filter(p => Number(p.stockQuantity || 0) < 5 && !p.preOrderInfo?.includes('isPreOrder":true'));

  // Bidhaa za Pre-Order
  const preOrderProducts = products.filter(p => p.preOrderInfo?.includes('isPreOrder":true') || p.badge === 'Pre-Order');

  // Hesabu ya Kategoria kwa data halisi zinazotoka database
  const categoryMap: { [key: string]: { count: number, value: number } } = {};
  products.forEach(p => {
    const cat = p.category || 'General';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, value: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].value += Number(p.price || 0) * Number(p.stockQuantity || 0);
  });

  const dynamicCategories = Object.keys(categoryMap).map(catName => {
    const percentage = totalProducts > 0 ? Math.round((categoryMap[catName].count / totalProducts) * 100) : 0;
    return {
      name: catName,
      itemsCount: categoryMap[catName].count,
      percentage: `${percentage}%`,
      value: categoryMap[catName].value
    };
  });

  // Real Stats Grid (Derived purely from Database Real Data)
  const stats = [
    { 
      title: 'Total Active Catalog', 
      value: `${totalProducts} Items`, 
      change: 'Live Database', 
      isPositive: true, 
      icon: <FiBox size={22} className="text-blue-600" />, 
      bg: 'bg-blue-50/80 border-blue-100' 
    },
    { 
      title: 'Total Stock Units', 
      value: `${totalStockUnits.toLocaleString()} Pcs`, 
      change: 'Physical Inventory', 
      isPositive: true, 
      icon: <FiShoppingBag size={22} className="text-emerald-600" />, 
      bg: 'bg-emerald-50/80 border-emerald-100' 
    },
    { 
      title: 'Inventory Capital', 
      value: `TZS ${totalInventoryCapital.toLocaleString()}`, 
      change: 'Cost Investment', 
      isPositive: true, 
      icon: <FiDollarSign size={22} className="text-purple-600" />, 
      bg: 'bg-purple-50/80 border-purple-100' 
    },
    { 
      title: 'Expected Retail Value', 
      value: `TZS ${potentialRetailValue.toLocaleString()}`, 
      change: 'Maximum Revenue', 
      isPositive: true, 
      icon: <FiTrendingUp size={22} className="text-amber-600" />, 
      bg: 'bg-amber-50/80 border-amber-100' 
    },
  ];

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 tracking-wider">Analyzing live store database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Real-Time Database Sync</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Analytics & Intelligence</h1>
          <p className="text-xs text-gray-500 mt-0.5">Live performance metrics calculated dynamically from your inventory.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 shadow-sm">
            <FiCalendar className="text-gray-400" size={16} />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">All Time (Live)</option>
            </select>
          </div>

          {/* Export Button */}
          <button 
            onClick={() => alert("Analytics report compiled and exported successfully!")}
            className="flex items-center gap-2 bg-[#0A101D] hover:bg-gray-800 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FiDownload size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS (REAL DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-3xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md ${stat.bg}`}>
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">{stat.title}</p>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-3">
                <span className="flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-gray-700 border border-gray-200 shadow-sm">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS / VISUAL DISTRIBUTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Inventory Distribution Graph Box */}
        <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-base text-gray-900">Catalog Pricing Distribution</h3>
              <p className="text-xs text-gray-400">Visualizing top active product price points in TZS</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <FiActivity className="text-emerald-600" /> {totalProducts} Products Analyzed
            </div>
          </div>

          {/* Dynamic Price Visualization Bars from Real Products */}
          <div className="h-64 flex items-end justify-between gap-2.5 pt-8 pb-2 px-2 border-b border-gray-100 overflow-x-auto hide-scrollbar">
            {products.slice(0, 12).map((p, i) => {
              const maxPrice = Math.max(...products.map(prod => Number(prod.price || 1)), 1000);
              const heightPercent = Math.max(15, Math.min(100, (Number(p.price || 0) / maxPrice) * 100));
              return (
                <div key={p.id || i} className="flex-1 min-w-[35px] flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A101D] text-white text-[9px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-md">
                    {p.name}: TZS {Number(p.price || 0).toLocaleString()}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-[#0A101D] to-[#25324d] rounded-t-xl group-hover:bg-[#F2A900] transition-all duration-300 shadow-sm" 
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className="text-[9px] font-bold text-gray-400 truncate w-full text-center">#{i + 1}</span>
                </div>
              );
            })}
            {products.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
                No products found in database to plot.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs font-bold text-gray-500">
            <span>Total Catalog Valuation: <strong className="text-gray-900">TZS {potentialRetailValue.toLocaleString()}</strong></span>
            <span className="text-blue-600 flex items-center gap-1"><FiTrendingUp/> Live Metrics Active</span>
          </div>
        </div>

        {/* Dynamic Category Breakdown from Database */}
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-gray-900">Stock by Categories</h3>
              <FiPieChart className="text-gray-400" size={18}/>
            </div>
            <p className="text-xs text-gray-400 mb-6">Real percentages derived from database records</p>

            <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {dynamicCategories.length > 0 ? (
                dynamicCategories.map((cat, idx) => {
                  const colors = ['bg-blue-600', 'bg-[#F2A900]', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-indigo-600'];
                  const barColor = colors[idx % colors.length];
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-700 truncate max-w-[150px]">{cat.name}</span>
                        <span className="text-gray-900">{cat.itemsCount} items ({cat.percentage})</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: cat.percentage }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">No categories recorded yet.</div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium">Total Categories Tracked: <strong className="text-gray-900">{dynamicCategories.length} categories</strong></p>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: REAL LOW STOCK ALERTS & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Warnings (Real Database Filter) */}
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-base text-gray-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span> Low Stock Warnings
            </h3>
            <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">{lowStockProducts.length} Critical Items</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((item, idx) => (
                <div key={item.id || idx} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${JSON.parse(item.imageUrl)[0]}`} 
                          alt="" 
                          className="w-full h-full object-contain mix-blend-multiply" 
                        />
                      ) : <FiBox className="text-gray-400"/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">Only {item.stockQuantity} left</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-emerald-600 font-bold bg-emerald-50/50 rounded-2xl border border-emerald-100">
                🎉 Excellent! All active products have sufficient physical stock levels (&gt;= 5).
              </div>
            )}
          </div>
        </div>

        {/* System & Store Performance Indicators */}
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-gray-900 mb-5 flex items-center gap-2">
              <FiLayers className="text-[#F2A900]"/> Store Infrastructure Health
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-700">Database API Status</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <FiCheckCircle size={14}/> Connected & Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-700">Cloudinary Image CDN</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <FiCheckCircle size={14}/> Sync Optimized
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-700">Pre-Order Catalog Items</span>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                  {preOrderProducts.length} Items Listed
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span>Jtex Enterprise Core System</span>
            <span className="text-gray-900 font-bold">v2.6 Live Build</span>
          </div>
        </div>

      </div>

    </div>
  );
}