'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 1. Kama tuko kwenye login page, usifanye redirect. Acha ipite.
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    // 2. Kama tuko kwenye page nyingine yoyote, kagua token
    const token = localStorage.getItem('jtex_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router, pathname]);

  // Links za Sidebar
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Bidhaa & Inventory', path: '/admin/products', icon: <FiBox /> },
    { name: 'Oda (Orders)', path: '/admin/orders', icon: <FiShoppingCart /> },
    { name: 'Wateja', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Mipangilio', path: '/admin/settings', icon: <FiSettings /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('jtex_admin_token');
    router.push('/admin/login');
  };

  // Hii inazuia flicker wakati inakagua token
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <FiLoader className="animate-spin text-[#F2A900]" size={32} />
      </div>
    );
  }

  // Sidebar Content Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-white shadow-2xl">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">
          J<span className="text-[#F2A900]">tex</span> Admin
        </h2>
        {/* Kitufe cha kufunga menu kwenye simu */}
        <button 
          className="md:hidden text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg transition" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>
      
      {/* Links zilizokuwa zimepotea */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2A900] text-[#0F172A] font-black shadow-lg shadow-[#F2A900]/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white font-bold'}`}>
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Kitufe cha Logout kilichokuwa kimepotea */}
      <div className="p-6 border-t border-gray-800">
        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-sm"
        >
          <FiLogOut className="text-lg" />
          Ondoka (Logout)
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      
      {/* SIDEBAR YA DESKTOP (Inaonekana kwenye PC tu) */}
      <aside className="hidden md:flex w-[260px] flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* OVERLAY & SIDEBAR YA SIMU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 w-[260px] z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* ENEO LA MAUDHUI (Main Content) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-[260px]">
        
        {/* HEADER YA JUU KWENYE SIMU (Iliyokuwa imepotea) */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#0F172A] p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200 shadow-sm">
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-black text-[#0F172A] tracking-tight">Dashboard</h1>
          </div>
        </header>

        {/* Kurasa za Ndani (Watoto) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}