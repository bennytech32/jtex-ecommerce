'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiLoader, FiList } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('jtex_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router, pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Add Product', path: '/admin/products', icon: <FiBox /> },
    { name: 'Inventory List', path: '/admin/inventory', icon: <FiList /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingCart /> },
    { name: 'Customers', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('jtex_admin_token');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <FiLoader className="animate-spin text-[#F2A900]" size={32} />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0A101D] text-gray-300 shadow-2xl border-r border-gray-800/50">
      
      {/* BRAND & LOGO SECTION - LATEST FIX */}
      <div className="p-6 border-b border-gray-800/80 flex items-center justify-center min-h-[100px] relative">
        {/* Neno admin limetolewa, Logo imekuzwa na kuwekwa katikati (centered) */}
        <img 
          src="/logo.png" 
          alt="Jtex Logo" 
          className="h-14 object-contain brightness-0 invert opacity-95 cursor-pointer hover:opacity-100 hover:scale-105 transition-all duration-300 drop-shadow-md" 
          onClick={() => router.push('/admin/dashboard')}
        />
        
        {/* Kitufe cha kufunga menu simu */}
        <button 
          className="md:hidden absolute right-4 text-gray-400 hover:text-white bg-gray-800/50 p-2 rounded-lg transition" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>
      
      {/* NAVIGATION LINKS WITH PREMIUM HOVER EFFECTS */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-500/70 mb-4 mt-2">Main Menu</p>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden ${isActive ? 'bg-gradient-to-r from-[#F2A900] to-yellow-400 text-[#0A101D] font-black shadow-[0_4px_20px_rgba(242,169,0,0.3)]' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white font-bold'}`}>
                
                {/* Active Indicator Line */}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/30 rounded-l-2xl"></div>}
                
                <span className={`text-xl transition-transform duration-300 z-10 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110 group-hover:-rotate-3 group-hover:text-[#F2A900]'}`}>
                   {link.icon}
                </span>
                <span className="text-sm tracking-wide z-10">{link.name}</span>
                
                {/* Subtle hover background effect */}
                {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/10 to-gray-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* USER & LOGOUT SECTION */}
      <div className="p-5 border-t border-gray-800/80 bg-[#060911]">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center font-black text-[#F2A900] shadow-inner">A</div>
              <div>
                 <p className="text-xs font-bold text-white tracking-wide">Administrator</p>
                 <p className="text-[10px] text-green-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]"></span> Online</p>
              </div>
           </div>
           <button 
             onClick={handleLogout} 
             title="Logout"
             className="w-10 h-10 flex items-center justify-center bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] rounded-xl transition-all duration-300"
           >
             <FiLogOut size={18} />
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F4F7F9] overflow-hidden font-sans antialiased">
      
      {/* SIDEBAR YA DESKTOP */}
      <aside className="hidden md:flex w-[280px] flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* OVERLAY & SIDEBAR YA SIMU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0A101D]/70 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 w-[280px] z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* ENEO LA MAUDHUI (Main Content) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-[280px]">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/80 h-16 flex items-center px-5 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#0A101D] p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200 shadow-sm active:scale-95">
              <FiMenu size={20} />
            </button>
          </div>
          {/* Mobile header logo now perfectly centered with no text */}
          <div className="flex-1 flex justify-end">
            <img src="/logo.png" alt="Jtex Logo" className="h-6 object-contain" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar relative">
           {/* Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none -z-10"></div>
           {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}