'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, 
  FiDollarSign, FiSettings, FiBarChart2 
} from 'react-icons/fi';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { name: 'Bidhaa & Inventory', icon: <FiBox />, path: '/admin/products' },
    { name: 'Oda & Usafirishaji', icon: <FiShoppingCart />, path: '/admin/orders' },
    { name: 'Wateja & Wauzaji', icon: <FiUsers />, path: '/admin/users' },
    { name: 'Fedha (Finance)', icon: <FiDollarSign />, path: '/admin/finance' },
    { name: 'Ripoti (Reports)', icon: <FiBarChart2 />, path: '/admin/reports' },
    { name: 'Mipangilio', icon: <FiSettings />, path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-[#0F172A] text-white h-screen flex flex-col hidden md:flex flex-shrink-0">
      {/* Kichwa cha Mfumo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-black tracking-wide text-white">
          J<span className="text-[#F2A900]">tex</span> <span className="text-sm text-gray-400 font-normal">ERP</span>
        </Link>
      </div>

      {/* Menyu */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#F2A900] text-[#0F172A]' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Maelezo ya Chini */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        &copy; 2026 Jtex Super Admin
      </div>
    </div>
  );
}