'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiBox, FiUsers, FiDollarSign, FiShoppingCart, 
  FiAlertCircle, FiTrendingUp, FiLogOut 
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    inventoryValue: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data za Mfano kwa ajili ya Chati
  const salesData = [
    { name: 'Jan', mauzo: 4000000 },
    { name: 'Feb', mauzo: 3000000 },
    { name: 'Mar', mauzo: 5000000 },
    { name: 'Apr', mauzo: 4500000 },
    { name: 'Mei', mauzo: 6000000 },
    { name: 'Jun', mauzo: 8000000 },
  ];

  useEffect(() => {
    // ULINZI UMEZIMWA KWA AJILI YA TESTING
    /*
    const token = localStorage.getItem('jtex_token');
    if (!token) {
      router.push('/');
      return;
    }
    */

    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        
        const statsRes = await fetch(`${apiUrl}/api/dashboard`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const ordersRes = await fetch(`${apiUrl}/api/orders`);
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

  const handleLogout = () => {
    localStorage.removeItem('jtex_token');
    localStorage.removeItem('jtex_user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-black tracking-tight cursor-pointer" onClick={() => router.push('/')}>
            J<span className="text-[#F2A900]">tex</span> Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 bg-[#F2A900] text-[#0F172A] px-4 py-3 rounded-xl font-bold transition">
            <FiTrendingUp /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-3 rounded-xl font-medium transition">
            <FiBox /> Products
          </button>
          <button className="w-full flex items-center gap-3 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-3 rounded-xl font-medium transition">
            <FiShoppingCart /> Orders
          </button>
          <button className="w-full flex items-center gap-3 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-3 rounded-xl font-medium transition">
            <FiUsers /> Customers
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl font-bold transition">
            <FiLogOut /> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Overview</h2>
            <p className="text-sm text-gray-500">Karibu kwenye jopo la usimamizi la Jtex.</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
            AD
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Inventory Value</p>
              <p className="text-2xl font-black text-gray-900">TZS {stats.inventoryValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">
              <FiBox />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Total Products</p>
              <p className="text-2xl font-black text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl">
              <FiAlertCircle />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Low/Out of Stock</p>
              <p className="text-2xl font-black text-red-600">{stats.lowStock + stats.outOfStock}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
              <FiUsers />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Total Users</p>
              <p className="text-2xl font-black text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Mauzo ya Miezi 6 (Sales Trend)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip 
                    cursor={{stroke: '#F3F4F6', strokeWidth: 2}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`TZS ${value.toLocaleString()}`, 'Mauzo']}
                  />
                  <Line type="monotone" dataKey="mauzo" stroke="#F2A900" strokeWidth={4} dot={{r: 4, fill: '#0F172A', strokeWidth: 2}} activeDot={{r: 6, fill: '#F2A900'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="text-lg font-black text-gray-900 mb-6">Ulinganisho wa Mapato (Bar Chart)</h3>
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={salesData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                   <Tooltip 
                     cursor={{fill: '#F9FAFB'}}
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: any) => [`TZS ${value.toLocaleString()}`, 'Mapato']}
                   />
                   <Bar dataKey="mauzo" fill="#0F172A" radius={[6, 6, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Recent Orders</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Hakuna oda mpya kwa sasa.</td>
                  </tr>
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

      </main>
    </div>
  );
}