'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiBox, FiUsers, FiDollarSign, FiAlertCircle, FiGlobe, 
  FiPlusCircle, FiMonitor, FiTruck, FiTrendingUp, FiCreditCard
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
    totalRevenue: "Total Revenue",
    pendingOrders: "Pending Orders",
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
    switchLang: "SWAHILI",
    quickActions: "Quick Actions",
    openPos: "Open POS System",
    addProduct: "Add New Product",
    manageOrders: "Manage Orders"
  },
  sw: {
    overview: "Muhtasari",
    overviewDesc: "Karibu kwenye jopo la usimamizi la Jtex.",
    inventoryValue: "Thamani ya Ghalani",
    totalProducts: "Jumla ya Bidhaa",
    lowStock: "Zinazoisha / Kwisha",
    totalUsers: "Jumla ya Wateja",
    totalRevenue: "Jumla ya Mapato",
    pendingOrders: "Oda Mpya (Pending)",
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
    switchLang: "ENGLISH",
    quickActions: "Vitendo vya Haraka",
    openPos: "Fungua POS (Uza)",
    addProduct: "Weka Bidhaa Mpya",
    manageOrders: "Shughulikia Oda"
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [stats, setStats] = useState({
    totalProducts: 0, lowStock: 0, outOfStock: 0, inventoryValue: 0, totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [calculatedStats, setCalculatedStats] = useState({ revenue: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  // Hardcoded chart data (In future, backend can provide real monthly data)
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
        
        const statsRes = await fetch(`${apiUrl}/api/dashboard`, { cache: 'no-store' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const ordersRes = await fetch(`${apiUrl}/api/orders`, { cache: 'no-store' });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          
          // Calculate Real Revenue & Pending Orders from all orders
          let rev = 0;
          let pend = 0;
          ordersData.forEach((o: any) => {
            if(o.status !== 'CANCELLED') rev += o.totalAmount;
            if(o.status === 'PENDING') pend += 1;
          });
          
          setCalculatedStats({ revenue: rev, pending: pend });
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
    <div className="w-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F8FAFC]">
      
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{t.overview}</h2>
          <p className="text-sm text-gray-500">{t.overviewDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-[#0F172A] shadow-sm hover:bg-gray-50 transition"
          >
            <FiGlobe /> {t.switchLang}
          </button>
        </div>
      </header>

      {/* QUICK ACTIONS (VITENDO VYA HARAKA) */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => alert('Mfumo wa POS unakuja hivi punde!')} className="flex items-center gap-4 bg-gradient-to-r from-[#0F172A] to-gray-800 p-4 rounded-2xl text-white hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl"><FiMonitor /></div>
            <div className="text-left"><p className="font-black text-lg">{t.openPos}</p><p className="text-[10px] text-gray-300">Point of Sale System</p></div>
          </button>
          <button onClick={() => router.push('/admin/products')} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-2xl text-[#0F172A] hover:border-[#F2A900] hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-50 text-[#F2A900] rounded-full flex items-center justify-center text-2xl"><FiPlusCircle /></div>
            <div className="text-left"><p className="font-bold text-sm">{t.addProduct}</p><p className="text-[10px] text-gray-500">Update Inventory</p></div>
          </button>
          <button onClick={() => router.push('/admin/orders')} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-2xl text-[#0F172A] hover:border-blue-500 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl"><FiTruck /></div>
            <div className="text-left"><p className="font-bold text-sm">{t.manageOrders}</p><p className="text-[10px] text-gray-500">Ship & Deliver</p></div>
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl"><FiTrendingUp /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{t.totalRevenue}</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">TZS {calculatedStats.revenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl"><FiAlertCircle /></div>
          <div className="z-10">
            <p className="text-xs font-bold text-red-400 uppercase">{t.pendingOrders}</p>
            <p className="text-xl sm:text-2xl font-black text-red-600">{calculatedStats.pending}</p>
          </div>
          {calculatedStats.pending > 0 && <div className="absolute right-0 top-0 w-2 h-full bg-red-500 animate-pulse"></div>}
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><FiDollarSign /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{t.inventoryValue}</p>
            <p className="text-lg font-black text-gray-900">TZS {stats.inventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl"><FiUsers /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{t.totalUsers}</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">{t.salesTrend}</h3>
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
           <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">{t.revenueCompare}</h3>
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
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{t.recentOrders}</h3>
          <button onClick={() => router.push('/admin/orders')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">{t.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
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
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">{t.noOrders}</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => router.push('/admin/orders')}>
                    <td className="px-6 py-4 font-mono font-bold text-gray-600">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.user?.name || 'Mteja'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-black text-[#0F172A]">TZS {order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'
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