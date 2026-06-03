'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiBox, FiUsers, FiDollarSign, FiAlertTriangle, FiTrendingUp 
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Data za mfano (Mock Data) kwa ajili ya Chati ya Mauzo ya Wiki
const salesData = [
  { name: 'J3', mauzo: 400000 },
  { name: 'J4', mauzo: 300000 },
  { name: 'J5', mauzo: 550000 },
  { name: 'Alh', mauzo: 200000 },
  { name: 'Ijumaa', mauzo: 700000 },
  { name: 'Jmosi', mauzo: 900000 },
  { name: 'Jpili', mauzo: 850000 },
];

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    inventoryValue: 0,
    totalUsers: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/dashboard');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Kosa kuvuta stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 font-bold text-gray-500 animate-pulse">Inavuta Takwimu (Loading Statistics)...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Muhtasari wa Biashara (CEO Overview)</h1>
        <p className="text-sm text-gray-500 mt-1">Hapa kuna mtazamo wa haraka wa jinsi biashara inavyoendelea leo.</p>
      </div>

      {/* KPI CARDS (Vadi vya Takwimu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Kadi 1: Thamani ya Mzigo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Thamani ya Ghalani</p>
            <h3 className="text-2xl font-black text-gray-900">
              TZS {stats.inventoryValue.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl">
            <FiDollarSign />
          </div>
        </div>

        {/* Kadi 2: Bidhaa Zilizopo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jumla ya Bidhaa</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalProducts} Aina</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl">
            <FiBox />
          </div>
        </div>

        {/* Kadi 3: Wateja / Watumiaji */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Wateja Waliosajiliwa</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalUsers}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-xl">
            <FiUsers />
          </div>
        </div>

        {/* Kadi 4: Hali ya Hatari (Stock Alert) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Alerts za Stock</p>
            <div className="flex gap-4">
              <div>
                <span className="text-xl font-black text-gray-900">{stats.lowStock}</span>
                <span className="text-[10px] text-gray-500 block">Zinakaribia Kuisha</span>
              </div>
              <div>
                <span className="text-xl font-black text-red-600">{stats.outOfStock}</span>
                <span className="text-[10px] text-gray-500 block">Zimeisha Kabisa</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl">
            <FiAlertTriangle />
          </div>
        </div>

      </div>

      {/* CHATI ZA BIASHARA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chati ya Mauzo (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-[#F2A900]" /> Mwenendo wa Mauzo (Siku 7)
            </h2>
            <select className="text-xs border rounded px-2 py-1 outline-none">
              <option>Wiki Hii</option>
              <option>Mwezi Huu</option>
            </select>
          </div>
          <div className="h-[300px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Tsh ${value/1000}k`} />
                <Tooltip cursor={{fill: '#f9fafb'}} formatter={(value: number) => `TZS ${value.toLocaleString()}`} />
                <Bar dataKey="mauzo" fill="#0F172A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chati ya Ukuaji wa Wateja (Line Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FiUsers className="text-blue-500" /> Ukuaji wa Usajili Wateja
            </h2>
          </div>
          <div className="h-[300px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="mauzo" stroke="#F2A900" strokeWidth={3} dot={{r: 4, fill: '#0F172A', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}