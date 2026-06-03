'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiBox, FiUsers, FiDollarSign, FiAlertCircle, FiGlobe 
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const translations = {
  en: {
    overview: "Overview",
    overviewDesc: "Welcome to the Jtex management dashboard.",
    inventoryValue: "Inventory Value",
    totalProducts: "Total Products",
    lowStock: "Low/Out of Stock",
    totalUsers: "Total Users",
    salesTrend: "6-Month Sales Trend",
    revenueCompare: "Revenue Comparison",
    recentOrders: "Recent Orders",
    viewAll: "View All",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    amount: "Amount",
    status: "Status",
    noOrders: "No new orders at the moment.",
    sales: "Sales",
    revenue: "Revenue",
    switchLang: "SWAHILI"
  },
  sw: {
    overview: "Muhtasari",
    overviewDesc: "Karibu kwenye jopo la usimamizi la Jtex.",
    inventoryValue: "Thamani ya Ghalani",
    totalProducts: "Jumla ya Bidhaa",
    lowStock: "Zinazoisha / Kwisha",
    totalUsers: "Jumla ya Wateja",
    salesTrend: "Mauzo ya Miezi 6",
    revenueCompare: "Ulinganisho wa Mapato",
    recentOrders: "Oda za Hivi Karibuni",
    viewAll: "Tazama Zote",
    orderId: "Namba ya Oda",
    customer: "Mteja",
    date: "Tarehe",
    amount: "Kiasi",
    status: "Hali",
    noOrders: "Hakuna oda mpya kwa sasa.",
    sales: "Mauzo",
    revenue: "Mapato",
    switchLang: "ENGLISH"
  }
};

export default function AdminDashboard() {
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [stats, setStats] = useState({
    totalProducts: 0, lowStock: 0, outOfStock: 0, inventoryValue: 0, totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  const salesData = [
    { name: 'Jan', mauzo: 4000000 },
    { name: 'Feb', mauzo: 3000000 },
    { name: 'Mar', mauzo: 5000000 },
    { name: 'Apr', mauzo: 4500000 },
    { name: 'Mei', mauzo: 6000000 },
    { name: 'Jun', mauzo: 8000000 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        
        const statsRes = await fetch(`${apiUrl}/api/dashboard`, { cache: 'no-store' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const ordersRes = await fetch(`${apiUrl}/api/orders`, { cache: 'no-store' });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.slice(0, 5)); 
        }
      } catch (error) {
        console.error("Kosa kuvuta data za admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 lg:p-8 overflow-y-auto bg-gray-50">
      
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{t.overview}</h2>
          <p className="text-sm text-gray-500">{t.overviewDesc}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-[#0F172A] shadow-sm hover:bg-gray-50 transition"
          >
            <FiGlobe /> {t.switchLang}
          </button>
          <div className="w-10 h-10 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold">
            AD
          </div>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><FiDollarSign /></div>
          <div>
            <p className="text-sm font-bold text-gray-500">{t.inventoryValue}</p>
            <p className="text-2xl font-black text-gray-900">TZS {stats.inventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl"><FiBox /></div>
          <div>
            <p className="text-sm font-bold text-gray-500">{t.totalProducts}</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl"><FiAlertCircle /></div>
          <div>
            <p className="text-sm font-bold text-gray-500">{t.lowStock}</p>
            <p className="text-2xl font-black text-red-600">{stats.lowStock + stats.outOfStock}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl"><FiUsers /></div>
          <div>
            <p className="text-sm font-bold text-gray-500">{t.totalUsers}</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">{t.salesTrend}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip cursor={{stroke: '#F3F4F6', strokeWidth: 2}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`TZS ${value.toLocaleString()}`, t.sales]} />
                <Line type="monotone" dataKey="mauzo" stroke="#F2A900" strokeWidth={4} dot={{r: 4, fill: '#0F172A', strokeWidth: 2}} activeDot={{r: 6, fill: '#F2A900'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="text-lg font-black text-gray-900 mb-6">{t.revenueCompare}</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={salesData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                 <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`TZS ${value.toLocaleString()}`, t.revenue]} />
                 <Bar dataKey="mauzo" fill="#0F172A" radius={[6, 6, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-900">{t.recentOrders}</h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">{t.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.orderId}</th>
                <th className="px-6 py-4">{t.customer}</th>
                <th className="px-6 py-4">{t.date}</th>
                <th className="px-6 py-4">{t.amount}</th>
                <th className="px-6 py-4">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t.noOrders}</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-600">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.user?.name || 'Mteja'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-black text-[#0F172A]">TZS {order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}