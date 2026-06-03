'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiDownload, FiCalendar, 
  FiTrendingUp, FiDollarSign, FiShoppingBag 
} from 'react-icons/fi';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', mapato: 1500000, oda: 45 },
    { month: 'Feb', mapato: 2300000, oda: 60 },
    { month: 'Mac', mapato: 3400000, oda: 85 },
    { month: 'Apr', mapato: 2800000, oda: 70 },
    { month: 'Mei', mapato: 4500000, oda: 110 },
    { month: 'Jun', mapato: 5200000, oda: 130 },
  ]);

  useEffect(() => {
    // ULINZI UMEZIMWA KWA AJILI YA TESTING
    /*
    const token = localStorage.getItem('jtex_token');
    if (!token) {
      router.push('/');
      return;
    }
    */
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.mapato, 0);
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.oda, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin')} 
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">Ripoti & Takwimu</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Tathmini mwenendo wa biashara yako</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-700 shadow-sm">
            <FiCalendar className="text-[#F2A900]" />
            Miezi 6 Iliyopita
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-[#0F172A] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-800 transition shadow-sm"
          >
            <FiDownload /> Pakua PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Jumla ya Mapato</p>
              <h3 className="text-2xl font-black text-[#0F172A]">TZS {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">
              <FiShoppingBag />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Jumla ya Oda</p>
              <h3 className="text-2xl font-black text-[#0F172A]">{totalOrders.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Wastani kwa Oda</p>
              <h3 className="text-2xl font-black text-[#0F172A]">TZS {Math.round(totalRevenue / totalOrders).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Mwenendo wa Mapato (Revenue Trend)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip 
                    cursor={{stroke: '#F3F4F6', strokeWidth: 2}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`TZS ${value.toLocaleString()}`, 'Mapato']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" dataKey="mapato" name="Mapato (TZS)" stroke="#10B981" strokeWidth={4} dot={{r: 4, fill: '#10B981', strokeWidth: 2}} activeDot={{r: 6, fill: '#047857'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Mwenendo wa Oda (Orders Trend)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#F9FAFB'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`${value} Oda`, 'Idadi']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="oda" name="Idadi ya Oda" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}