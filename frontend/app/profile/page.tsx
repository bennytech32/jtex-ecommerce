'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiUser, FiPackage, FiFileText, FiStar, FiCreditCard, FiX, 
  FiDownload, FiLogOut, FiCheckCircle, FiPhone, FiMail,
  FiShoppingCart, FiSearch, FiGlobe, FiTrash2, FiChevronRight, 
  FiMapPin, FiShield, FiTruck, FiSmartphone, FiSettings, FiHeart, 
  FiHelpCircle, FiEdit2, FiPlus, FiMessageCircle, FiBox, FiMoon, FiSun, FiChevronDown
} from 'react-icons/fi';

import TopTicker from '../components/navigation/TopTicker';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

const translations = {
  en: {
    profile: "My Profile",
    overview: "Dashboard",
    myOrders: "Order History",
    addressBook: "Address Book",
    savedItems: "Wishlist",
    settings: "Account Settings",
    support: "Help & Support",
    userInfo: "User Information",
    crmStats: "Account Stats",
    loyalty: "Loyalty Points",
    debt: "Current Debt",
    totalOrders: "Total Orders",
    logout: "Log Out",
    noOrders: "You haven't placed any orders yet.",
    noOrdersDesc: "Your orders will appear here once you start shopping.",
    orderId: "Order ID",
    date: "Date",
    status: "Status",
    total: "Total",
    action: "Action",
    receipt: "Receipt",
    download: "Download PDF",
    subtotal: "Subtotal",
    shipping: "Shipping",
    grandTotal: "Grand Total",
    upfrontPaid: "Upfront Paid",
    cart: "Cart",
  },
  sw: {
    profile: "Profaili Yangu",
    overview: "Dashibodi",
    myOrders: "Oda Zangu",
    addressBook: "Anwani Zangu",
    savedItems: "Zilizopendwa",
    settings: "Mipangilio",
    support: "Msaada",
    userInfo: "Taarifa Zako",
    crmStats: "Hali ya Akaunti",
    loyalty: "Pointi za Uaminifu",
    debt: "Deni Lako",
    totalOrders: "Jumla ya Oda",
    logout: "Ondoka",
    noOrders: "Hujafanya manunuzi yoyote bado.",
    noOrdersDesc: "Oda zako zitaonekana hapa ukishanunua bidhaa.",
    orderId: "Oda ID",
    date: "Tarehe",
    status: "Hali",
    total: "Jumla",
    action: "Kitendo",
    receipt: "Risiti",
    download: "Pakua PDF",
    subtotal: "Jumla Ndogo",
    shipping: "Usafiri",
    grandTotal: "Jumla Kuu",
    upfrontPaid: "Kianzio Kimelipwa",
    cart: "Kikapu",
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullUserInfo, setFullUserInfo] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); 
  const [isClient, setIsClient] = useState(false);
  
  const { cart } = useCart();
  const t = translations[lang];

  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  useEffect(() => {
    setIsClient(true);
    
    // Check saved theme
    const savedTheme = localStorage.getItem('jtex_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }

    const savedUser = localStorage.getItem('jtex_user');
    if (!savedUser) {
      router.push('/'); 
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    const fetchProfileData = async () => {
      try {
        const url = getApiUrl();
        const ordersRes = await fetch(`${url}/api/orders`, { cache: 'no-store' });
        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          const myOrders = allOrders.filter((o: any) => o.userId === parsedUser.id);
          setOrders(myOrders);
        }
        const usersRes = await fetch(`${url}/api/users`, { cache: 'no-store' });
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          const myFullInfo = allUsers.find((u: any) => u.id === parsedUser.id);
          setFullUserInfo(myFullInfo);
        }
      } catch (error) {
        console.error("Kosa kuvuta data za profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jtex_token');
    localStorage.removeItem('jtex_user');
    router.push('/');
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'sw' : 'en');
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('jtex_theme', newTheme);
  };

  // Dynamic Theme Classes
  const isDark = theme === 'dark';
  const bgMain = isDark ? "bg-[#0B1120]" : "bg-[#F8FAFC]";
  const textMain = isDark ? "text-gray-200" : "text-gray-900";
  const headerBg = isDark ? "bg-[#0B1120] border-gray-800" : "bg-white border-gray-200";
  const logoText = isDark ? "text-white" : "text-[#0F172A]";
  const cardBg = isDark ? "bg-[#1E293B] border-gray-800" : "bg-white border-gray-100";
  const cardInnerBg = isDark ? "bg-[#0F172A]" : "bg-gray-50";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-[#0F172A] border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900";
  const btnHover = isDark ? "hover:bg-[#1E293B] text-gray-300 border-gray-700" : "hover:bg-gray-50 text-gray-700 border-gray-200";

  if (isLoading || !user) {
    return (
      <div className={`min-h-screen ${bgMain} flex flex-col items-center justify-center font-sans transition-colors duration-300`}>
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className={`font-bold ${textMuted} animate-pulse`}>Loading Profile...</div>
      </div>
    );
  }

  // Menus za Upande wa Kushoto
  const menuItems = [
    { id: 'overview', icon: <FiGlobe />, label: t.overview },
    { id: 'orders', icon: <FiPackage />, label: t.myOrders },
    { id: 'address', icon: <FiMapPin />, label: t.addressBook },
    { id: 'wishlist', icon: <FiHeart />, label: t.savedItems },
    { id: 'settings', icon: <FiSettings />, label: t.settings },
    { id: 'support', icon: <FiHelpCircle />, label: t.support },
  ];

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} font-sans antialiased flex flex-col transition-colors duration-300`}>
      <div className="hidden md:block">
         <TopTicker />
      </div>
      
      {/* HEADER YA KAWAIDA (Inaendana na Home Page) */}
      <header className={`${headerBg} sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className={`text-xl sm:text-2xl font-black ${logoText} tracking-tight cursor-pointer`}>
            J<span className="text-[#F2A900]">tex</span>
          </span>
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={toggleLanguage} className={`hidden lg:flex items-center gap-1 text-xs font-bold border px-2 py-1 rounded transition ${btnHover}`}>
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
            </button>
            <button onClick={toggleTheme} className={`flex items-center gap-1 text-xs font-bold border px-2 py-1 rounded transition ${btnHover}`}>
              {isDark ? <FiSun className="text-yellow-400" size={16} /> : <FiMoon className="text-indigo-600" size={16} />}
            </button>
            <div onClick={() => router.push('/?cart=open')} className={`relative cursor-pointer transition flex flex-col items-center group ${isDark ? 'text-gray-300 hover:text-[#F2A900]' : 'text-gray-700 hover:text-[#F2A900]'}`}>
              <div className="relative">
                <FiShoppingCart className="text-xl sm:text-2xl group-hover:scale-110 transition" />
                {isClient && cart && cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm transition ${isDark ? 'bg-[#1E293B] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-[#F2A900] text-[#0F172A]' : 'bg-[#0F172A] text-white'}`}>{user.name.charAt(0)}</div>
              <span className={`text-xs font-bold hidden md:block ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* SIDEBAR YA MTEJA */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <div className={`${cardBg} rounded-2xl shadow-sm border overflow-hidden sticky top-24 transition-colors duration-300`}>
            <div className={`p-6 text-center border-b relative ${isDark ? 'border-gray-800' : 'border-gray-50'}`}>
              <div className={`absolute top-0 left-0 w-full h-16 bg-gradient-to-r ${isDark ? 'from-[#0F3B4E] to-[#1A5C7A]' : 'from-[#0F172A] to-gray-800'}`}></div>
              <div className={`relative w-20 h-20 border-4 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-3 shadow-md z-10 mt-4 ${isDark ? 'bg-[#1E293B] border-[#1E293B] text-white' : 'bg-white border-white text-[#0F172A]'}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className={`text-lg font-black ${textTitle}`}>{user.name}</h2>
              <p className={`text-xs ${textMuted}`}>{user.email}</p>
            </div>
            
            <nav className="p-3 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id 
                      ? (isDark ? 'bg-[#F2A900]/20 text-[#F2A900]' : 'bg-[#F2A900]/10 text-[#F2A900]') 
                      : (isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                  }`}
                >
                  <span className={`text-lg ${activeTab === item.id ? 'text-[#F2A900]' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className={`border-t my-2 pt-2 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 transition-all ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}>
                  <FiLogOut className="text-lg" /> {t.logout}
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* ENEO LA MAUDHUI (MAIN CONTENT AREA) */}
        <section className="flex-1 min-w-0">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className={`text-2xl font-black ${textTitle} mb-6`}>Welcome back, {user.name.split(' ')[0]}! 👋</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className={`${cardBg} p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-500'}`}><FiPackage /></div>
                  <div><p className={`text-xs ${textMuted} font-bold uppercase`}>{t.totalOrders}</p><p className={`text-2xl font-black ${textTitle}`}>{orders.length}</p></div>
                </div>
                <div className={`${cardBg} p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-colors`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isDark ? 'bg-yellow-900/30 text-[#F2A900]' : 'bg-yellow-50 text-[#F2A900]'}`}><FiStar /></div>
                  <div><p className={`text-xs ${textMuted} font-bold uppercase`}>{t.loyalty}</p><p className={`text-2xl font-black ${textTitle}`}>{fullUserInfo?.loyaltyPoints || 0}</p></div>
                </div>
                <div className={`${cardBg} p-6 rounded-2xl shadow-sm border flex items-center gap-4 relative overflow-hidden transition-colors`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isDark ? 'bg-red-900/30 text-red-500' : 'bg-red-50 text-red-500'}`}><FiCreditCard /></div>
                  <div className="z-10"><p className="text-xs text-red-400 font-bold uppercase">{t.debt}</p><p className="text-xl font-black text-red-500">TZS {(fullUserInfo?.debtAmount || 0).toLocaleString()}</p></div>
                  {fullUserInfo?.debtAmount > 0 && <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-700 transition">PAY</button>}
                </div>
              </div>

              <div className={`${cardBg} rounded-2xl shadow-sm border p-6 mt-6 transition-colors`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`font-black text-lg ${textTitle}`}>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>View All</button>
                </div>
                {orders.length === 0 ? (
                  <p className={`text-sm ${textMuted}`}>No recent orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className={`flex justify-between items-center p-4 rounded-xl border transition cursor-pointer ${isDark ? 'bg-[#0F172A] border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`} onClick={() => setSelectedOrder(order)}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded shadow-sm flex items-center justify-center ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}><FiBox className="text-gray-400" /></div>
                          <div><p className={`font-bold text-sm ${textTitle}`}>Order #{order.id.slice(-6).toUpperCase()}</p><p className={`text-xs ${textMuted}`}>{new Date(order.createdAt).toLocaleDateString()}</p></div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-sm ${textTitle}`}>TZS {order.totalAmount.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className={`${cardBg} rounded-2xl shadow-sm border overflow-hidden animate-fade-in flex flex-col min-h-[500px] transition-colors`}>
              <div className={`p-6 border-b flex items-center gap-3 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><FiPackage className="text-xl" /></div>
                <h2 className={`text-xl font-black ${textTitle}`}>{t.myOrders}</h2>
              </div>
              <div className={`flex-1 overflow-x-auto ${isDark ? 'bg-[#0F172A]/50' : 'bg-gray-50/30'}`}>
                {orders.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center h-full p-16 text-center ${textMuted}`}>
                    <FiShoppingCart className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-200'}`} />
                    <p className={`text-lg font-bold ${textTitle}`}>{t.noOrders}</p>
                    <p className="text-sm mt-2">{t.noOrdersDesc}</p>
                    <button onClick={() => router.push('/')} className={`mt-6 font-bold py-3 px-8 rounded-xl text-sm transition ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>Shop Now</button>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className={`${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'} border-b text-xs uppercase ${textMuted} font-black tracking-wider`}>
                      <tr><th className="px-6 py-4">{t.orderId}</th><th className="px-6 py-4">{t.date}</th><th className="px-6 py-4">{t.status}</th><th className="px-6 py-4">{t.total}</th><th className="px-6 py-4 text-right">{t.action}</th></tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                      {orders.map((order: any) => (
                        <tr key={order.id} className={`transition cursor-pointer ${isDark ? 'hover:bg-[#334155]' : 'hover:bg-gray-50'}`} onClick={() => setSelectedOrder(order)}>
                          <td className={`px-6 py-4 font-mono text-xs font-bold ${textMuted}`}>#{order.id.slice(-6).toUpperCase()}</td>
                          <td className={`px-6 py-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'DELIVERED' 
                                ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') 
                                : (isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                            }`}>{order.status}</span>
                          </td>
                          <td className={`px-6 py-4 font-black ${textTitle}`}>TZS {order.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button className={`font-bold text-xs px-3 py-1.5 rounded-lg flex items-center justify-end gap-1 ml-auto transition ${isDark ? 'text-blue-400 bg-blue-900/20 hover:bg-blue-900/40' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}><FiFileText /> View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK */}
          {activeTab === 'address' && (
            <div className={`${cardBg} rounded-2xl shadow-sm border p-6 sm:p-8 animate-fade-in transition-colors`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-black ${textTitle}`}>{t.addressBook}</h2>
                <button className={`${isDark ? 'bg-[#0F172A] hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#0F172A]'} font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition`}><FiPlus /> Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border-2 border-[#F2A900] rounded-xl p-5 relative ${isDark ? 'bg-yellow-900/10' : 'bg-yellow-50/30'}`}>
                  <span className="absolute top-4 right-4 bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-2 py-1 rounded uppercase">Default</span>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-xl text-gray-400 mt-1" />
                    <div>
                      <h4 className={`font-black text-sm mb-1 ${textTitle}`}>Home Address</h4>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Makumbusho, Uhuru Street<br/>House No. 42<br/>Dar es Salaam, Tanzania</p>
                      <div className="mt-4 flex gap-3">
                        <button className={`text-xs font-bold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Edit</button>
                        <button className={`text-xs font-bold hover:underline ${isDark ? 'text-red-400' : 'text-red-500'}`}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className={`${cardBg} rounded-2xl shadow-sm border p-6 sm:p-8 animate-fade-in max-w-2xl transition-colors`}>
              <h2 className={`text-xl font-black mb-6 border-b pb-4 ${textTitle} ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>{t.settings}</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div><label className={`block text-xs font-bold uppercase mb-2 ${textMuted}`}>Full Name</label><input type="text" defaultValue={user.name} className={`w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50 ${inputBg}`} /></div>
                <div><label className={`block text-xs font-bold uppercase mb-2 ${textMuted}`}>Email Address</label><input type="email" disabled defaultValue={user.email} className={`w-full rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed ${isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`} /></div>
                <div><label className={`block text-xs font-bold uppercase mb-2 ${textMuted}`}>Phone Number</label><input type="tel" defaultValue={fullUserInfo?.phone || ''} className={`w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50 ${inputBg}`} /></div>
                <div className={`pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}><h3 className={`font-bold text-sm mb-4 ${textTitle}`}>Security</h3></div>
                <div><label className={`block text-xs font-bold uppercase mb-2 ${textMuted}`}>New Password</label><input type="password" placeholder="••••••••" className={`w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50 ${inputBg}`} /></div>
                <button className={`w-full font-black py-3.5 rounded-xl text-sm transition mt-6 ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>Save Changes</button>
              </form>
            </div>
          )}

          {/* TAB 5: SUPPORT */}
          {activeTab === 'support' && (
            <div className={`${cardBg} rounded-2xl shadow-sm border p-6 sm:p-8 animate-fade-in transition-colors`}>
              <h2 className={`text-xl font-black mb-6 ${textTitle}`}>{t.support}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a href="https://wa.me/255700000000" target="_blank" className={`flex items-center gap-4 p-5 rounded-xl border hover:shadow-md transition ${isDark ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100'}`}>
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl"><FiMessageCircle /></div>
                  <div><h4 className={`font-black ${isDark ? 'text-green-400' : 'text-green-900'}`}>WhatsApp Support</h4><p className={`text-xs ${isDark ? 'text-green-600' : 'text-green-700'}`}>Chat with us live</p></div>
                </a>
                <a href="mailto:support@jtex.co.tz" className={`flex items-center gap-4 p-5 rounded-xl border hover:shadow-md transition ${isDark ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl"><FiMail /></div>
                  <div><h4 className={`font-black ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Email Us</h4><p className={`text-xs ${isDark ? 'text-blue-600' : 'text-blue-700'}`}>support@jtex.co.tz</p></div>
                </a>
              </div>
              <div className={`rounded-xl p-6 border text-center ${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <FiHelpCircle className={`text-4xl mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                <h4 className={`font-black mb-2 ${textTitle}`}>Visit our Help Center</h4>
                <p className={`text-sm mb-4 ${textMuted}`}>Find answers to common questions about delivery, returns, and payments.</p>
                <button className={`border font-bold px-6 py-2 rounded-lg shadow-sm text-sm transition ${isDark ? 'bg-[#1E293B] border-gray-700 hover:bg-gray-800 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>Read FAQs</button>
              </div>
            </div>
          )}

          {/* TAB 6: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className={`${cardBg} rounded-2xl shadow-sm border p-10 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px] transition-colors`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}><FiHeart className={`text-3xl ${isDark ? 'text-red-400' : 'text-red-500'}`} /></div>
              <h2 className={`text-xl font-black mb-2 ${textTitle}`}>No Saved Items</h2>
              <p className={`text-sm mb-6 ${textMuted}`}>Items you save by clicking the heart icon will appear here.</p>
              <button onClick={() => router.push('/')} className={`font-black py-3 px-8 rounded-xl text-sm transition ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>Explore Products</button>
            </div>
          )}

        </section>
      </main>

      <Footer />

      {/* MODAL YA RISITI (RECEIPT) */}
      {selectedOrder && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#0B1120]/80' : 'bg-black/80'} z-50 flex items-center justify-center p-4 backdrop-blur-md`}>
          <div className={`${isDark ? 'bg-[#1E293B] border-[#F2A900]' : 'bg-white border-[#0F172A]'} w-full max-w-3xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-fade-in border-t-8`}>
            <button onClick={() => setSelectedOrder(null)} className={`absolute top-4 right-4 p-2 rounded-full transition z-10 ${isDark ? 'text-gray-400 hover:text-white bg-gray-800' : 'text-gray-400 hover:text-gray-900 bg-gray-100'}`}><FiX size={20} /></button>
            
            <div className={`p-8 md:p-12 overflow-y-auto print-section ${isDark ? 'bg-[#1E293B] text-gray-200' : 'bg-white text-gray-900'}`}>
              
              <div className={`flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 pb-6 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <div>
                  <h2 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>J<span className="text-[#F2A900]">tex</span></h2>
                  <p className={`text-xs font-bold uppercase mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Marketplace & Delivery</p>
                  <div className={`mt-4 text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>TIN: 123-456-789</p>
                    <p>Dar es Salaam, Tanzania</p>
                    <p>support@jtex.co.tz | +255 700 000 000</p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:text-right">
                  <h1 className={`text-3xl font-black uppercase tracking-widest mb-2 ${isDark ? 'text-gray-800' : 'text-gray-200'}`}>INVOICE</h1>
                  <p className={`mb-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Invoice No: <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>INV-{selectedOrder.id.slice(-6).toUpperCase()}</span></p>
                  <p className={`mb-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date Issued: <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${
                      selectedOrder.status === 'DELIVERED' 
                        ? (isDark ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-50 text-green-700 border-green-200') 
                        : (isDark ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200')
                    }`}>
                      STATUS: {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8 text-sm">
                <div className="flex-1">
                  <p className={`text-[10px] uppercase font-bold mb-2 border-b pb-1 ${isDark ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-100'}`}>Billed To (Mteja)</p>
                  <p className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                  <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                  {fullUserInfo?.phone && <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{fullUserInfo.phone}</p>}
                </div>
                <div className="flex-1">
                  <p className={`text-[10px] uppercase font-bold mb-2 border-b pb-1 ${isDark ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-100'}`}>Shipped To (Mahali)</p>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.deliveryRegion}</p>
                  <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedOrder.address}</p>
                  <p className={`text-xs mt-2 font-bold inline-block px-2 py-1 rounded ${isDark ? 'text-[#F2A900] bg-yellow-900/20' : 'text-[#F2A900] bg-yellow-50'}`}>Payment Method: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="mb-8">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className={`text-xs uppercase tracking-wider ${isDark ? 'bg-[#0F172A] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      <th className="py-3 px-4 font-bold rounded-tl-lg">Description</th>
                      <th className="py-3 px-4 font-bold text-center">Qty</th>
                      <th className="py-3 px-4 font-bold text-right rounded-tr-lg">Amount (TZS)</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={item.id} className={idx % 2 === 0 ? (isDark ? 'bg-[#1E293B]' : 'bg-white') : (isDark ? 'bg-[#0F172A]/50' : 'bg-gray-50/50')}>
                        <td className={`py-4 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{item.product?.name || 'Item'}</td>
                        <td className={`py-4 px-4 text-center font-bold ${isDark ? 'text-gray-400 bg-[#0F172A]' : 'text-gray-600 bg-gray-50'}`}>{item.quantity}</td>
                        <td className={`py-4 px-4 text-right font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.subTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-10">
                <div className={`w-full md:w-1/2 space-y-3 text-sm p-6 rounded-xl border ${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><span>{t.subtotal}</span><span className={`font-bold ${isDark ? 'text-gray-200' : ''}`}>TZS {(selectedOrder.totalAmount - selectedOrder.shippingFee).toLocaleString()}</span></div>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><span>{t.shipping}</span><span className={`font-bold ${isDark ? 'text-gray-200' : ''}`}>TZS {selectedOrder.shippingFee.toLocaleString()}</span></div>
                  <div className={`flex justify-between text-xl font-black border-t pt-3 mt-3 ${isDark ? 'text-white border-gray-700' : 'text-[#0F172A] border-gray-300'}`}>
                    <span>{t.grandTotal}</span><span>TZS {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  {selectedOrder.upfrontPayment > 0 && (
                    <div className={`p-3 rounded-lg border flex items-center justify-between mt-4 ${isDark ? 'bg-green-900/20 border-green-900/50 text-green-400' : 'bg-green-100 border-green-200 text-green-800'}`}>
                      <div className="flex items-center gap-2">
                        <FiCheckCircle />
                        <span className="text-[10px] font-black uppercase">{t.upfrontPaid}</span>
                      </div>
                      <span className="font-black">TZS {selectedOrder.upfrontPayment.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedOrder.upfrontPayment > 0 && selectedOrder.totalAmount > selectedOrder.upfrontPayment && (
                     <div className={`p-3 rounded-lg border flex items-center justify-between mt-2 ${isDark ? 'bg-red-900/20 border-red-900/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                       <span className="text-[10px] font-black uppercase">Remaining Balance</span>
                       <span className="font-black">TZS {(selectedOrder.totalAmount - selectedOrder.upfrontPayment).toLocaleString()}</span>
                     </div>
                  )}
                </div>
              </div>

              <div className={`border-t-2 border-dashed pt-8 flex flex-col md:flex-row justify-between gap-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex-1">
                  <h5 className={`font-black text-xs uppercase mb-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Terms & Conditions (Vigezo & Masharti)</h5>
                  <ul className={`text-[10px] list-disc pl-4 space-y-1.5 font-medium leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <li>Bidhaa zilizofunguliwa, kutumika, au kuharibiwa kimakosa haziwezi kurudishwa.</li>
                    <li>Mteja ana siku 7 za kurudisha bidhaa endapo ina matatizo ya kiwandani.</li>
                    <li>Kianzio (Upfront payment) hakirudishwi iwapo mteja atakataa kupokea mzigo.</li>
                  </ul>
                </div>
                <div className="w-48 text-center flex flex-col items-center justify-end">
                  <div className="w-32 h-32 border-4 border-red-500/20 rounded-full flex items-center justify-center transform -rotate-12 mb-2">
                    <span className="text-red-500/40 font-black text-xl tracking-widest uppercase">Approved</span>
                  </div>
                  <div className={`w-full h-px mt-2 ${isDark ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                  <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>Authorized Signature</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end print:hidden">
                <button onClick={() => window.print()} className={`font-black py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition ${isDark ? 'bg-[#F2A900] text-[#0F172A] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>
                  <FiDownload /> {t.download}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}