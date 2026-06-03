import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar ya Kushoto */}
      <AdminSidebar />
      
      {/* Sehemu ya Kulia (Header na Content) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        
        {/* Hapa ndipo kurasa zote zinapofungukia (Products, Orders, n.k) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F4F6] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}