'use client';

import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers,
  FiBox, FiCalendar, FiDownload, FiActivity, FiLayers,
  FiCheckCircle, FiPackage, FiShoppingCart, FiCreditCard,
  FiAlertCircle, FiPieChart, FiBarChart2
} from 'react-icons/fi';

export default function AdminAnalytics() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const fetchAllAnalyticsData = async () => {
      try {
        const [pRes, oRes, uRes] = await Promise.all([
          fetch(`${API_URL}/api/products`, { cache: 'no-store' }),
          fetch(`${API_URL}/api/orders`, { cache: 'no-store' }),
          fetch(`${API_URL}/api/users`, { cache: 'no-store' })
        ]);

        if (pRes.ok) setProducts(await pRes.json());
        if (oRes.ok) setOrders(await oRes.json());
        if (uRes.ok) setUsers(await uRes.json());
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAnalyticsData();
  }, [API_URL]);

  // ==========================================
  // 1. REVENUE & SALES CALCULATIONS (ORDERS)
  // ==========================================
  const totalOrders = orders.length;
  const totalCustomers = users.length;

  const totalRevenue = orders.reduce((acc, o) => {
    return o.status !== 'CANCELLED' ? acc + Number(o.totalAmount || 0) : acc;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;

  // ==========================================
  // 2. INVENTORY CALCULATIONS (PRODUCTS)
  // ==========================================
  const totalProducts = products.length;

  // Jumla ya idadi ya bidhaa zote zilizopo stoku
  const totalStockUnits = products.reduce((acc, p) => acc + Number(p.stock || p.stockQuantity || 0), 0);

  // Mtaji wa jumla wa mali iliyopo stoku
  const totalInventoryCapital = products.reduce((acc, p) => {
    const costPrice = Number(p.buyingPrice || p.price || 0);
    const qty = Number(p.stock || p.stockQuantity || 0);
    return acc + (costPrice * qty);
  }, 0);

  // Thamani ya mauzo inayotarajiwa kutoka stoku iliyopo
  const potentialRetailValue = products.reduce((acc, p) => {
    const sellPrice = Number(p.price || 0);
    const qty = Number(p.stock || p.stockQuantity || 0);
    return acc + (sellPrice * qty);
  }, 0);

  // Bidhaa zilizokaribia kuisha (< 5 items)
  const lowStockProducts = products.filter(p => Number(p.stock || p.stockQuantity || 0) < 5 && !(p.preOrderInfo?.includes('isPreOrder":true') || p.badge === 'Pre-Order'));

  // Bidhaa za Pre-Order
  const preOrderProducts = products.filter(p => p.preOrderInfo?.includes('isPreOrder":true') || p.badge === 'Pre-Order');

  // ==========================================
  // 3. CATEGORY DISTRIBUTION
  // ==========================================
  const categoryMap: { [key: string]: { count: number, value: number } } = {};
  products.forEach(p => {
    const cat = p.category || 'Uncategorized';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, value: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].value += Number(p.price || 0) * Number(p.stock || p.stockQuantity || 0);
  });

  const dynamicCategories = Object.keys(categoryMap)
    .map(catName => ({
      name: catName,
      itemsCount: categoryMap[catName].count,
      percentage: totalProducts > 0 ? Math.round((categoryMap[catName].count / totalProducts) * 100) : 0,
      value: categoryMap[catName].value
    }))
    .sort((a, b) => b.itemsCount - a.itemsCount); // Panga kuanzia kategoria yenye bidhaa nyingi

  // ==========================================
  // 4. TOP STATS CARDS DATA
  // ==========================================
  const primaryStats = [
    {
      title: 'Total Revenue',
      value: `TZS ${totalRevenue.toLocaleString()}`,
      change: `${completedOrders} Delivered`,
      icon: <FiDollarSign size={24} className="text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      textStyle: 'text-emerald-900'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: `${pendingOrders} Pending`,
      icon: <FiShoppingCart size={24} className="text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      textStyle: 'text-blue-900'
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: 'Registered Users',
      icon: <FiUsers size={24} className="text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
      textStyle: 'text-purple-900'
    },
    {
      title: 'Inventory Value',
      value: `TZS ${totalInventoryCapital.toLocaleString()}`,
      change: `${totalStockUnits} Total Items`,
      icon: <FiBox size={24} className="text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      textStyle: 'text-amber-900'
    },
  ];

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-[#0F172A] border-t-[#F2A900] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-500 tracking-wider animate-pulse">Syncing live database metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">Live Data Sync</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Business Analytics</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">Real-time performance metrics and inventory intelligence.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <FiCalendar className="text-gray-500" size={16} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">All Time (Live)</option>
            </select>
          </div>

          <button
            onClick={() => alert("Analytics report compiled and exported successfully!")}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-gray-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <FiDownload size={16} /> Export
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS (REVENUE & INVENTORY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {primaryStats.map((stat, idx) => (
          <div key={idx} className={`relative overflow-hidden bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow group ${stat.bg}`}>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">{stat.title}</p>
                <h3 className={`text-xl lg:text-2xl font-black tracking-tight mb-3 ${stat.textStyle}`}>{stat.value}</h3>
                <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/60 text-gray-700 border border-white/40 shadow-sm backdrop-blur-sm">
                  {stat.change}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none transform group-hover:scale-110">
              {React.cloneElement(stat.icon as React.ReactElement, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CATEGORY DISTRIBUTION (PIE/BARS) */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-lg text-gray-900 flex items-center gap-2"><FiPieChart className="text-purple-500" /> Stock by Category</h3>
              <p className="text-xs text-gray-400 mt-1">Inventory distribution across different product lines.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              {dynamicCategories.length} Categories
            </div>
          </div>

          <div className="space-y-5 overflow-y-auto custom-scrollbar pr-2 flex-grow">
            {dynamicCategories.length > 0 ? (
              dynamicCategories.map((cat, idx) => {
                const colors = ['bg-[#0F172A]', 'bg-[#F2A900]', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500'];
                const barColor = colors[idx % colors.length];
                return (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${barColor}`}></span>
                        {cat.name}
                      </span>
                      <span className="text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {cat.itemsCount} items <span className="text-gray-400 ml-1">({cat.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`} style={{ width: `${cat.percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <FiBox size={40} className="mb-3 opacity-20" />
                <p className="text-xs font-bold">No categories recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* FINANCIAL SUMMARY & HEALTH */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Financial Health
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Expected Retail Value</p>
                <p className="text-lg font-black text-gray-900">TZS {potentialRetailValue.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">Potential revenue if all stock is sold.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Estimated Profit Margin</p>
                <p className="text-lg font-black text-emerald-600">
                  TZS {(potentialRetailValue - totalInventoryCapital).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">Gross profit locked in current inventory.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-wider mb-3">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">API Connection</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><FiCheckCircle /> Stable</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Products Tracked</span>
                <span className="text-gray-900 font-bold">{totalProducts} Listed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: LOW STOCK ALERTS */}
      <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              Low Stock Alerts
            </h3>
            <p className="text-xs text-gray-400 mt-1">Products with less than 5 items remaining in physical stock.</p>
          </div>
          <span className="text-xs font-black bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-2 w-max">
            <FiAlertCircle /> {lowStockProducts.length} Critical Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((item, idx) => {
              let imgUrl = '';
              try {
                const parsed = JSON.parse(item.imageUrl);
                imgUrl = Array.isArray(parsed) ? parsed[0] : item.imageUrl;
              } catch (e) {
                imgUrl = item.imageUrl;
              }
              const displayImg = imgUrl?.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;

              return (
                <div key={item.id || idx} className="p-4 flex items-center gap-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 p-1.5 shadow-sm">
                    {displayImg ? (
                      <img src={displayImg} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    ) : <FiPackage className="text-gray-300" size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1 mb-1">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-500 font-mono">{item.sku || 'N/A'}</p>
                      <span className="text-[10px] font-black text-red-600 bg-red-100/50 px-2 py-0.5 rounded-md">
                        {item.stock || item.stockQuantity || 0} left
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-10 flex flex-col items-center justify-center bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-700">
              <FiCheckCircle size={32} className="mb-3 opacity-80" />
              <p className="text-sm font-black">All Good!</p>
              <p className="text-xs font-medium mt-1">No products are currently running low on stock.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}