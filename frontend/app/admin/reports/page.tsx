'use client';

import React from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminReports() {
  // Mock Data za Ripoti
  const categorySales = [
    { name: 'Nguo', value: 4500000 },
    { name: 'Elektroniki', value: 8500000 },
    { name: 'Viatu', value: 3200000 },
    { name: 'Urembo', value: 1500000 },
  ];
  const COLORS = ['#F2A900', '#0F172A', '#3B82F6', '#10B981'];

  const monthlyRevenue = [
    { month: 'Jan', mauzo: 4000, faida: 2400 },
    { month: 'Feb', mauzo: 3000, faida: 1398 },
    { month: 'Mac', mauzo: 9800, faida: 5800 },
    { month: 'Apr', mauzo: 3908, faida: 2908 },
    { month: 'Mei', mauzo: 4800, faida: 3800 },
    { month: 'Jun', mauzo: 3800, faida: 2500 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ripoti & Uchambuzi</h1>
          <p className="text-sm text-gray-500">Changanua mwenendo wa biashara na upakue ripoti.</p>
        </div>
        <button className="bg-[#0F172A] hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">
          <FiDownload /> Pakua PDF (Export)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mauzo kwa Kategoria */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
            <FiPieChart className="text-[#F2A900]" /> Mauzo Kulingana na Kategoria
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `TZS ${Number(value).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mauzo vs Faida (Mwezi) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
            <FiBarChart2 className="text-blue-500" /> Mwenendo wa Mauzo na Faida
          </h2>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mauzo" name="Mauzo Ghafi" fill="#F2A900" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faida" name="Faida Halisi" fill="#0F172A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bidhaa Zinazofanya Vizuri Zaidi */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><FiTrendingUp className="text-green-500" /> Bidhaa Zinazouza Sana (Top Sellers)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Jina la Bidhaa</th>
                  <th className="px-6 py-3">Kategoria</th>
                  <th className="px-6 py-3">Idadi Iliyouzwa</th>
                  <th className="px-6 py-3">Pato Liloingia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">iPhone 15 Pro Max</td>
                  <td className="px-6 py-4 text-gray-500">Elektroniki</td>
                  <td className="px-6 py-4 font-bold text-blue-600">142 Pcs</td>
                  <td className="px-6 py-4 font-black text-green-600">TZS 355,000,000</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">T-Shirt za Nike</td>
                  <td className="px-6 py-4 text-gray-500">Nguo</td>
                  <td className="px-6 py-4 font-bold text-blue-600">89 Pcs</td>
                  <td className="px-6 py-4 font-black text-green-600">TZS 1,335,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}