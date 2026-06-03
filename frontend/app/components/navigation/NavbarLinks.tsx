import React from 'react';
import Link from 'next/link'; // Tume-import Link ya Next.js

export default function NavbarLinks() {
  const menus = [
    { name: 'Home', path: '/', active: true },
    { name: 'Deals', path: '/shop', badge: 'Hot' },
    { name: 'New Arrivals', path: '/shop' },
    { name: 'Top Brands', path: '/shop' },
    { name: 'Electronics', path: '/shop' },
    { name: 'Phones', path: '/shop' },
    { name: 'Computers', path: '/shop' },
    { name: 'Fashion', path: '/shop' },
    { name: 'Home & Kitchen', path: '/shop' },
    { name: 'Sports', path: '/shop' },
    { name: 'Beauty', path: '/shop' }
  ];

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center space-x-6 overflow-x-auto">
      {menus.map((menu, i) => (
        <Link
          key={i}
          href={menu.path}
          className={`text-xs font-semibold relative pb-1 whitespace-nowrap transition ${
            menu.active 
              ? 'text-[#F2A900] border-b-2 border-[#F2A900]' 
              : 'text-gray-600 hover:text-[#F2A900]'
          }`}
        >
          {menu.name}
          {menu.badge && (
            <span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {menu.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}