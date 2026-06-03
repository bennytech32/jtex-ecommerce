'use client';

import React, { useState } from 'react';
import { FiSettings, FiSave, FiGlobe, FiLock, FiTruck } from 'react-icons/fi';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Mipangilio ya Mfumo (Settings)</h1>
        <p className="text-sm text-gray-500">Badilisha taarifa za duka, ulinzi, na gharama za usafirishaji.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Menyu ya Pembeni ya Mipangilio */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('general')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition ${activeTab === 'general' ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
                <FiGlobe /> Taarifa za Duka
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('shipping')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition ${activeTab === 'shipping' ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
                <FiTruck /> Usafirishaji & COD
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition ${activeTab === 'security' ? 'bg-[#0F172A] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
                <FiLock /> Ulinzi (Security)
              </button>
            </li>
          </ul>
        </div>

        {/* Eneo la Kujaza Mipangilio */}
        <div className="flex-1 p-6 md:p-10">
          
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Taarifa za Msingi za Jtex</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jina la Jukwaa</label>
                    <input type="text" defaultValue="Jtex Marketplace" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#F2A900] text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barua Pepe ya Mawasiliano</label>
                    <input type="email" defaultValue="support@jtex.co.tz" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#F2A900] text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Maelezo (Meta Description)</label>
                  <textarea rows={3} defaultValue="Pata bidhaa bora kwa bei nafuu Tanzania." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#F2A900] text-sm font-medium"></textarea>
                </div>
                <button type="button" className="bg-[#F2A900] text-[#0F172A] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-500 transition">
                  <FiSave /> Hifadhi Mabadiliko
                </button>
              </form>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Gharama za Mikoani & Kianzio</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Dar es Salaam</p>
                    <p className="text-xs text-gray-500">Mkoa wa makao makuu</p>
                  </div>
                  <input type="number" defaultValue="0" className="w-32 bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-sm font-bold text-green-600 text-right" placeholder="Tsh 0" />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Mwanza / Arusha / Mbeya</p>
                    <p className="text-xs text-gray-500">Mikoa ya mbali</p>
                  </div>
                  <input type="number" defaultValue="10000" className="w-32 bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-sm font-bold text-gray-800 text-right" placeholder="Tsh 10000" />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">Asilimia ya Kianzio (COD Upfront Payment)</h3>
                  <div className="flex items-center gap-4">
                    <input type="number" defaultValue="20" className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm font-bold text-gray-800" />
                    <span className="text-sm font-bold text-gray-500">% ya bei ya bidhaa itakatwa kabla ya kusafirisha.</span>
                  </div>
                </div>
                <button type="button" className="mt-4 bg-[#0F172A] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition">
                  <FiSave /> Hifadhi Mabadiliko
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in text-center py-10">
              <FiLock className="text-4xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-800">Ulinzi wa Akaunti</h2>
              <p className="text-sm text-gray-500 mb-6">Badilisha nywila (password) yako ya Super Admin hapa.</p>
              <button className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-lg text-sm font-bold">
                Tuma Barua Pepe ya Kubadili Nywila
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}