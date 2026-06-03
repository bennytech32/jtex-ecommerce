'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBell, FiSearch, FiUser, FiLogOut, FiSettings, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Taarifa za mfano za Alerts
  const notifications = [
    { id: 1, type: 'alert', message: 'Stock ya "iPhone 15" imebaki 2 tu!', time: 'Dakika 5 zilizopita' },
    { id: 2, type: 'success', message: 'Oda mpya #ORD-990 imelipwa kianzio.', time: 'Saa 1 iliyopita' },
    { id: 3, type: 'alert', message: 'Mteja "John" ana deni la TZS 50,000.', time: 'Masaa 3 yaliyopita' }
  ];

  const handleLogout = () => {
    // Futa taarifa za mtumiaji kwenye browser
    localStorage.removeItem('jtex_token');
    localStorage.removeItem('jtex_user');
    // Mpeleke kwenye ukurasa wa Login
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-50">
      
      {/* Sehemu ya Kutafuta */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tafuta oda, bidhaa, au mteja..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#F2A900] transition"
          />
        </div>
      </div>

      {/* Taarifa za Admin na Menyu */}
      <div className="flex items-center gap-4 ml-4 relative">
        
        {/* Kengele ya Alerts */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative text-gray-500 hover:text-gray-700 transition p-2 rounded-full hover:bg-gray-100"
          >
            <FiBell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
          </button>

          {/* Dropdown ya Alerts */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm flex justify-between items-center">
                <span>Taarifa Mpya (Alerts)</span>
                <span className="bg-[#F2A900] text-white text-[10px] px-2 py-0.5 rounded-full">3 Mpya</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition flex gap-3 items-start cursor-pointer">
                    {n.type === 'alert' ? <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" /> : <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-xs text-gray-800 font-medium">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center text-xs text-[#F2A900] font-bold cursor-pointer hover:underline bg-gray-50">
                Tazama Zote
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* Profile na Log Out */}
        <div className="relative">
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-[#F2A900] rounded-full flex items-center justify-center text-[#0F172A] font-bold shadow-sm">
              <FiUser />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-800 leading-tight">Super Admin</p>
              <p className="text-[10px] text-gray-500 leading-tight">Mkurugenzi</p>
            </div>
          </div>

          {/* Dropdown ya Profile */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">Admin Jtex</p>
                <p className="text-xs text-gray-500">admin@jtex.co.tz</p>
              </div>
              <ul className="py-2">
                <li 
                  onClick={() => router.push('/admin/settings')}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <FiSettings className="text-gray-400" /> Mipangilio
                </li>
                <li 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-bold border-t border-gray-50 mt-1 pt-3"
                >
                  <FiLogOut /> Ondoka (Log Out)
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}