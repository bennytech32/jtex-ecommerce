'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiUser, FiPackage, FiFileText, FiStar, FiCreditCard, FiX, 
  FiDownload, FiLogOut, FiCheckCircle, FiPhone, FiMail,
  FiShoppingCart, FiSearch, FiGlobe, FiTrash2, FiChevronRight, 
  FiMapPin, FiShield, FiTruck, FiSmartphone, FiSettings, FiHeart, 
  FiHelpCircle, FiEdit2, FiPlus, FiMessageCircle, FiBox, FiMoon, FiSun, FiChevronDown,
  FiBell, FiCalendar, FiClock, FiActivity, FiArrowUpRight, FiArrowDownRight, FiMoreHorizontal
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
  // Kulazimisha Dark Mode ionekane sawa na picha kwa default, lakini inabadilika
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); 
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

  // CALCULATED STATS FOR DASHBOARD
  const totalPaid = orders.reduce((acc, order) => {
    let paid = order.upfrontPayment || 0;
    if (order.status === 'DELIVERED') paid = order.totalAmount;
    return acc + paid;
  }, 0);

  const activeDeliveries = orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length;
  const currentDebt = fullUserInfo?.debtAmount || 0;
  
  // Greeting Logic
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Dynamic Theme Classes based on Mockup
  const isDark = theme === 'dark';
  const bgMain = isDark ? "bg-[#050B14]" : "bg-[#F8FAFC]";
  const textMain = isDark ? "text-gray-200" : "text-gray-900";
  const headerBg = isDark ? "bg-[#0A101D] border-gray-800" : "bg-white border-gray-200";
  const cardBg = isDark ? "bg-[#0A101D] border-gray-800/50" : "bg-white border-gray-100";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const sidebarBg = isDark ? "bg-[#0A101D] border-r border-gray-800/50" : "bg-white border-r border-gray-100";

  if (isLoading || !user) {
    return (
      <div className={`min-h-screen ${bgMain} flex flex-col items-center justify-center font-sans transition-colors duration-300`}>
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className={`font-bold ${textMuted} animate-pulse`}>Loading Profile...</div>
      </div>
    );
  }

  // Menus za Upande wa Kushoto (Mockup Accurate)
  const menuItems = [
    { id: 'overview', icon: <FiGlobe />, label: 'Dashboard' },
    { id: 'orders', icon: <FiPackage />, label: 'My Orders', badge: orders.length },
    { id: 'payments', icon: <FiCreditCard />, label: 'Payments', badge: 4 },
    { id: 'debts', icon: <FiFileText />, label: 'Debts', badge: currentDebt > 0 ? 2 : 0 },
    { id: 'wishlist', icon: <FiHeart />, label: 'Wishlist' },
    { id: 'tracking', icon: <FiTruck />, label: 'Tracking' },
    { id: 'address', icon: <FiMapPin />, label: 'Addresses' },
    { id: 'notifications', icon: <FiBell />, label: 'Notifications', badge: 12 },
    { id: 'support', icon: <FiHelpCircle />, label: 'Support' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' },
  ];

  // Simple SVG Sparklines
  const SparklineUp = () => (
    <svg className="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
      <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points="0,15 20,10 40,12 60,5 80,8 100,2" />
      <circle cx="100" cy="2" r="3" fill="#3B82F6" />
    </svg>
  );
  const SparklineDown = () => (
    <svg className="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
      <polyline fill="none" stroke="#F59E0B" strokeWidth="2" points="0,5 20,12 40,8 60,15 80,10 100,18" />
      <circle cx="100" cy="18" r="3" fill="#F59E0B" />
    </svg>
  );

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} font-sans antialiased flex flex-col md:flex-row transition-colors duration-300`}>
      
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR (KUSHOTO) */}
      {/* ========================================================= */}
      <aside className={`hidden md:flex flex-col w-[260px] h-screen sticky top-0 flex-shrink-0 ${sidebarBg}`}>
        {/* LOGO */}
        <div className="h-[72px] flex items-center px-6 border-b border-gray-800/50 cursor-pointer" onClick={() => router.push('/')}>
           <div className="flex text-3xl font-black italic tracking-tighter">
             <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
           </div>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? (isDark ? 'bg-gradient-to-r from-[#F2A900]/20 to-transparent border-l-4 border-[#F2A900] text-[#F2A900]' : 'bg-[#F2A900]/10 border-l-4 border-[#F2A900] text-[#F2A900]') 
                  : (isDark ? 'text-gray-400 hover:text-white border-l-4 border-transparent' : 'text-gray-600 hover:text-gray-900 border-l-4 border-transparent')
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${activeTab === item.id ? 'text-[#F2A900]' : ''}`}>{item.icon}</span>
                {item.label}
              </div>
              {item.badge ? (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isDark ? 'bg-[#1E293B] text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* EXCLUSIVE OFFER & LOYALTY CARD (Kama kwenye picha) */}
        <div className="p-4 mt-auto">
           <div className={`rounded-2xl p-5 relative overflow-hidden shadow-lg border ${isDark ? 'bg-[#0A101D] border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F2A900] to-yellow-600"></div>
              <p className="text-[10px] text-[#F2A900] font-black mb-1 uppercase tracking-wider">Exclusive Offer</p>
              <h4 className={`text-sm font-black mb-2 leading-tight ${textTitle}`}>Get up to 15% OFF</h4>
              <p className={`text-[10px] mb-4 ${textMuted}`}>on your next order.</p>
              <button className="bg-gradient-to-r from-[#F2A900] to-yellow-600 text-[#0F172A] text-[10px] font-black px-4 py-2 rounded-lg transition shadow-md w-full">Shop Now</button>
           </div>
           
           <div className={`mt-4 rounded-2xl p-4 border flex items-center justify-between cursor-pointer ${isDark ? 'bg-[#0A101D] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-yellow-900/20 text-[#F2A900] flex items-center justify-center text-xl shadow-inner border border-yellow-700/30">
                    <FiStar />
                 </div>
                 <div>
                    <p className={`text-[10px] font-bold ${textMuted}`}>Loyalty Points</p>
                    <p className={`text-base font-black ${textTitle}`}>{fullUserInfo?.loyaltyPoints || 0}</p>
                 </div>
              </div>
              <FiChevronRight className="text-gray-500" />
           </div>

           <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-4 mt-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-all`}>
              <FiLogOut className="text-lg" /> Logout
           </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
         
         {/* TOP HEADER (Search, Ai, Profile) */}
         <header className={`h-[72px] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-md ${isDark ? 'bg-[#050B14]/90 border-b border-gray-800/50' : 'bg-[#F8FAFC]/90 border-b border-gray-200'}`}>
            
            {/* Mobile Sidebar Trigger / Logo */}
            <div className="flex md:hidden items-center gap-3">
               <span onClick={() => router.push('/')} className="text-2xl font-black italic tracking-tighter">
                 <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-white">ex</span>
               </span>
            </div>

            {/* Global Search Bar (Desktop) */}
            <div className={`hidden md:flex w-full max-w-xl items-center rounded-xl px-4 py-2 border transition-all focus-within:ring-2 focus-within:ring-[#F2A900]/30 ${isDark ? 'bg-[#0A101D] border-gray-800' : 'bg-white border-gray-200'}`}>
               <FiSearch className="text-gray-500 text-lg mr-2" />
               <input type="text" placeholder="Search for products, orders and more..." className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500" />
               <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>Ctrl + K</span>
               </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-5">
               <button className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${isDark ? 'bg-yellow-900/10 border-yellow-700/30 text-[#F2A900]' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                  ✨ AI Assistant
               </button>
               
               <div className="relative cursor-pointer group">
                  <FiBell className={`text-xl transition ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-transparent">12</span>
               </div>

               <div onClick={() => router.push('/?cart=open')} className="relative cursor-pointer group">
                  <FiShoppingCart className={`text-xl transition ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
                  {isClient && cart && cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-[#0A101D] text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-transparent">{cart.length}</span>}
               </div>

               <div className="w-px h-6 bg-gray-700 mx-1 hidden md:block"></div>

               {/* User Profile Mini */}
               <div className="flex items-center gap-2 cursor-pointer pl-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-[#F2A900] text-[#0A101D]' : 'bg-[#0F172A] text-white'}`}>
                     {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col leading-tight">
                     <span className={`text-sm font-bold ${textTitle}`}>{user.name.split(' ')[0]}</span>
                     <span className={`text-[10px] ${textMuted}`}>Customer</span>
                  </div>
                  <FiChevronDown className="hidden md:block text-gray-500 ml-1" />
               </div>
            </div>
         </header>

         {/* MAIN CONTENT PADDING */}
         <div className="p-4 md:p-8 pb-24 md:pb-8">

            {/* TAB 1: DASHBOARD OVERVIEW (ACCURATE MOCKUP REPLICA) */}
            {activeTab === 'overview' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in">
                 
                 {/* Greeting & Date Row */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                       <h1 className={`text-2xl md:text-3xl font-black ${textTitle} mb-1 flex items-center gap-2`}>
                          {greeting}, {user.name.split(' ')[0]} 👋
                       </h1>
                       <p className={`text-sm ${textMuted}`}>Here's what's happening with your account today.</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold shadow-sm ${isDark ? 'bg-[#0A101D] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                       {currentDate} <FiCalendar className="text-gray-500"/>
                    </div>
                 </div>

                 {/* TOP 4 STAT CARDS */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {/* Card 1: Total Orders */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-1`}>
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                             <p className={`text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Orders</p>
                             <h3 className={`text-3xl font-black ${textTitle}`}>{orders.length}</h3>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${isDark ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}><FiPackage /></div>
                       </div>
                       <div className="relative z-10 flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-green-500 flex items-center gap-0.5"><FiArrowUpRight/> +12% <span className="text-gray-500 font-normal">this month</span></span>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30"><SparklineUp /></div>
                    </div>

                    {/* Card 2: Total Payments */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-1`}>
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                             <p className={`text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Payments</p>
                             <h3 className={`text-3xl font-black ${textTitle}`}>TZS {(totalPaid / 1000000).toFixed(1)}M</h3>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${isDark ? 'bg-green-900/20 text-green-400 border border-green-800/30' : 'bg-green-50 text-green-600 border border-green-100'}`}><FiCreditCard /></div>
                       </div>
                       <div className="relative z-10 flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-green-500 flex items-center gap-0.5"><FiArrowUpRight/> +22% <span className="text-gray-500 font-normal">this month</span></span>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30"><SparklineUp /></div>
                    </div>

                    {/* Card 3: Outstanding Debt */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-1`}>
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                             <p className={`text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Outstanding Debt</p>
                             <h3 className={`text-3xl font-black ${textTitle}`}>TZS {currentDebt.toLocaleString()}</h3>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${isDark ? 'bg-yellow-900/20 text-[#F2A900] border border-yellow-800/30' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}><FiFileText /></div>
                       </div>
                       <div className="relative z-10 flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-red-500 flex items-center gap-0.5"><FiArrowDownRight/> -8% <span className="text-gray-500 font-normal">vs last month</span></span>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30"><SparklineDown /></div>
                    </div>

                    {/* Card 4: Active Deliveries */}
                    <div className={`${cardBg} p-5 md:p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-1`}>
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                             <p className={`text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Deliveries</p>
                             <h3 className={`text-3xl font-black ${textTitle}`}>{activeDeliveries}</h3>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${isDark ? 'bg-purple-900/20 text-purple-400 border border-purple-800/30' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}><FiTruck /></div>
                       </div>
                       <div className="relative z-10 flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-[#F2A900]">In Transit</span>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30"><SparklineUp /></div>
                    </div>
                 </div>

                 {/* MIDDLE SECTION: MAIN GRID */}
                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* LEFT COLUMN: 2/3 Width */}
                    <div className="xl:col-span-2 space-y-6 md:space-y-8">
                       
                       {/* Recent Orders List */}
                       <div className={`${cardBg} rounded-2xl border shadow-sm overflow-hidden`}>
                          <div className={`flex justify-between items-center p-5 md:p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                             <h3 className={`text-lg font-black ${textTitle}`}>Recent Orders</h3>
                             <button onClick={() => setActiveTab('orders')} className={`text-sm font-bold hover:underline ${isDark ? 'text-[#F2A900]' : 'text-blue-600'}`}>View All Orders</button>
                          </div>
                          <div className="overflow-x-auto">
                             <table className="w-full text-left text-sm whitespace-nowrap">
                               <thead className={`text-xs font-bold uppercase ${isDark ? 'bg-[#0A101D] text-gray-500 border-b border-gray-800' : 'bg-gray-50 text-gray-500 border-b border-gray-200'}`}>
                                 <tr>
                                   <th className="px-6 py-4">Order ID</th>
                                   <th className="px-6 py-4">Product</th>
                                   <th className="px-6 py-4">Status</th>
                                   <th className="px-6 py-4">Payment</th>
                                   <th className="px-6 py-4">Amount</th>
                                   <th className="px-6 py-4 text-center">Action</th>
                                 </tr>
                               </thead>
                               <tbody className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-gray-100'}`}>
                                 {orders.slice(0, 4).map((order) => (
                                   <tr key={order.id} className={`transition cursor-pointer ${isDark ? 'hover:bg-[#1E293B]/50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedOrder(order)}>
                                     <td className={`px-6 py-4 font-mono text-xs font-bold ${textMuted}`}>#JTX-{order.id.slice(-6).toUpperCase()}</td>
                                     <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                           <div className={`w-10 h-10 rounded border flex items-center justify-center p-1 ${isDark ? 'bg-white border-gray-700' : 'bg-white border-gray-200'}`}>
                                              {order.items[0]?.product?.imageUrl ? <img src={`${getApiUrl()}${order.items[0].product.imageUrl}`} className="object-contain w-full h-full mix-blend-multiply" /> : <FiBox className="text-gray-400 text-xl" />}
                                           </div>
                                           <div className="flex flex-col">
                                              <span className={`font-bold text-sm ${textTitle}`}>{order.items[0]?.product?.name.substring(0,20) || 'Product'}...</span>
                                              <span className={`text-[10px] ${textMuted}`}>{order.items.length > 1 ? `+${order.items.length - 1} more items` : '1 Item'}</span>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-6 py-4">
                                       <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-max ${
                                         order.status === 'DELIVERED' ? (isDark ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-50 text-green-700') : 
                                         order.status === 'SHIPPED' ? (isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-blue-50 text-blue-700') :
                                         order.status === 'CANCELLED' ? (isDark ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-red-50 text-red-700') :
                                         (isDark ? 'bg-yellow-900/30 text-[#F2A900] border border-yellow-800/50' : 'bg-yellow-50 text-yellow-700')
                                       }`}>
                                         {order.status === 'DELIVERED' ? <FiCheckCircle/> : order.status === 'SHIPPED' ? <FiTruck/> : order.status === 'CANCELLED' ? <FiX/> : <FiClock/>} {order.status}
                                       </span>
                                     </td>
                                     <td className="px-6 py-4">
                                       <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-max ${
                                         order.totalAmount <= (order.upfrontPayment || 0) || order.status === 'DELIVERED' ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700') : 
                                         order.status === 'CANCELLED' ? (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500') :
                                         (isDark ? 'bg-yellow-900/30 text-[#F2A900]' : 'bg-yellow-50 text-yellow-700')
                                       }`}>
                                         {order.totalAmount <= (order.upfrontPayment || 0) || order.status === 'DELIVERED' ? <FiCheckCircle/> : order.status === 'CANCELLED' ? <FiX/> : <FiClock/>} 
                                         {order.totalAmount <= (order.upfrontPayment || 0) || order.status === 'DELIVERED' ? 'Paid' : order.status === 'CANCELLED' ? 'Refunded' : 'Pending'}
                                       </span>
                                     </td>
                                     <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                           <span className={`font-black ${textTitle}`}>TZS {order.totalAmount.toLocaleString()}</span>
                                           <span className={`text-[10px] ${textMuted}`}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                     </td>
                                     <td className="px-6 py-4 text-center">
                                       <button className={`p-2 rounded-lg transition ${isDark ? 'bg-gray-800 text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}><FiMoreHorizontal /></button>
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                          </div>
                       </div>

                       {/* Charts Row: Payments Overview & Debt Summary */}
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                          {/* Payments Overview Donut Chart */}
                          <div className={`${cardBg} rounded-2xl border shadow-sm p-6 flex flex-col`}>
                             <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-base font-black ${textTitle}`}>Payments Overview</h3>
                                <FiMoreHorizontal className="text-gray-500 cursor-pointer" />
                             </div>
                             <div className="flex-1 flex items-center justify-center gap-6">
                                {/* CSS Donut Chart */}
                                <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-inner" style={{ background: `conic-gradient(#3B82F6 43%, #F59E0B 43% 76%, #EF4444 76% 92%, #8B5CF6 92% 100%)` }}>
                                   <div className={`absolute w-24 h-24 rounded-full flex items-center justify-center flex-col shadow-lg ${isDark ? 'bg-[#0A101D]' : 'bg-white'}`}>
                                      <span className={`text-[10px] font-bold ${textMuted}`}>Total Paid</span>
                                      <span className={`text-sm font-black ${textTitle}`}>TZS {(totalPaid/1000000).toFixed(1)}M</span>
                                   </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                   <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className={textMuted}>Mobile Money</span></div><span className={`font-bold ${textTitle}`}>43%</span></div>
                                   <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span><span className={textMuted}>Card Payment</span></div><span className={`font-bold ${textTitle}`}>33%</span></div>
                                   <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className={textMuted}>Bank Transfer</span></div><span className={`font-bold ${textTitle}`}>16%</span></div>
                                   <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span className={textMuted}>Other</span></div><span className={`font-bold ${textTitle}`}>8%</span></div>
                                </div>
                             </div>
                          </div>

                          {/* Debt Summary */}
                          <div className={`${cardBg} rounded-2xl border shadow-sm p-6 flex flex-col relative overflow-hidden`}>
                             <div className="flex justify-between items-center mb-6 z-10">
                                <h3 className={`text-base font-black ${textTitle}`}>Debt Summary</h3>
                                <button className={`text-xs font-bold hover:underline ${isDark ? 'text-[#F2A900]' : 'text-blue-600'}`}>View Details</button>
                             </div>
                             <div className={`p-4 rounded-xl border flex justify-between items-center mb-4 z-10 ${isDark ? 'bg-[#1E293B]/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                                <div>
                                   <p className={`text-[10px] font-bold uppercase mb-1 ${textMuted}`}>Outstanding Balance</p>
                                   <h4 className={`text-2xl font-black ${isDark ? 'text-[#F2A900]' : 'text-[#0F172A]'}`}>TZS {currentDebt.toLocaleString()}</h4>
                                </div>
                                {/* Small Circle Progress */}
                                <div className="relative w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#F2A900 78%, ${isDark ? '#334155' : '#E2E8F0'} 78% 100%)` }}>
                                   <div className={`absolute w-11 h-11 rounded-full flex items-center justify-center flex-col ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
                                      <span className={`text-xs font-black ${textTitle}`}>78%</span>
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-2 z-10">
                                <div className="flex justify-between text-xs"><span className={textMuted}>Next Payment</span><span className={`font-bold ${textTitle}`}>TZS 120,000</span></div>
                                <div className="flex justify-between text-xs"><span className={textMuted}>Due Date</span><span className="font-bold text-red-500 flex items-center gap-1"><FiCalendar/> Due in 4 days</span></div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* RIGHT COLUMN: 1/3 Width */}
                    <div className="space-y-6 md:space-y-8">
                       
                       {/* Payment Summary Box */}
                       <div className={`${cardBg} rounded-2xl border shadow-sm p-6`}>
                          <h3 className={`text-base font-black mb-5 ${textTitle}`}>Payment Summary</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-sm border-b pb-3 border-gray-800/50"><span className={textMuted}>Total Paid</span><span className={`font-bold ${textTitle}`}>TZS {totalPaid.toLocaleString()}</span></div>
                             <div className="flex justify-between items-center text-sm border-b pb-3 border-gray-800/50"><span className={textMuted}>Pending Payments</span><span className={`font-bold ${textTitle}`}>TZS 120,000</span></div>
                             <div className="flex justify-between items-center text-sm border-b pb-3 border-gray-800/50"><span className={textMuted}>Total Refunds</span><span className={`font-bold ${textTitle}`}>TZS 180,000</span></div>
                             <div className="flex justify-between items-center text-sm"><span className={textMuted}>Discounts Used</span><span className={`font-bold text-green-500`}>- TZS 320,000</span></div>
                          </div>
                       </div>

                       {/* Recent Activity Timeline */}
                       <div className={`${cardBg} rounded-2xl border shadow-sm p-6`}>
                          <div className="flex justify-between items-center mb-6">
                             <h3 className={`text-base font-black ${textTitle}`}>Recent Activity</h3>
                             <span className={`text-xs font-bold hover:underline cursor-pointer ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>View All</span>
                          </div>
                          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
                             
                             {/* Activity Item */}
                             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 z-10 ${isDark ? 'bg-[#0A101D] border-[#0A101D]' : 'bg-white border-white'}`}>
                                   <div className="w-8 h-8 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center"><FiCheckCircle/></div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex flex-col pl-4 md:pl-0 md:pr-4">
                                   <h4 className={`text-sm font-bold ${textTitle}`}>Payment Confirmed</h4>
                                   <p className={`text-[10px] ${textMuted} mt-0.5`}>TZS 550,000 paid via M-Pesa</p>
                                   <span className={`text-[9px] font-bold mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Today • 11:20 AM</span>
                                </div>
                             </div>

                             {/* Activity Item */}
                             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 z-10 ${isDark ? 'bg-[#0A101D] border-[#0A101D]' : 'bg-white border-white'}`}>
                                   <div className="w-8 h-8 bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center"><FiTruck/></div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex flex-col pl-4 md:pl-0 md:pr-4">
                                   <h4 className={`text-sm font-bold ${textTitle}`}>Order Shipped</h4>
                                   <p className={`text-[10px] ${textMuted} mt-0.5`}>#JTX-784511 is on the way</p>
                                   <span className={`text-[9px] font-bold mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Yesterday • 02:45 PM</span>
                                </div>
                             </div>

                             {/* Activity Item */}
                             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 z-10 ${isDark ? 'bg-[#0A101D] border-[#0A101D]' : 'bg-white border-white'}`}>
                                   <div className="w-8 h-8 bg-purple-900/30 text-purple-500 rounded-full flex items-center justify-center"><FiFileText/></div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex flex-col pl-4 md:pl-0 md:pr-4">
                                   <h4 className={`text-sm font-bold ${textTitle}`}>Invoice Generated</h4>
                                   <p className={`text-[10px] ${textMuted} mt-0.5`}>INV-784512 downloaded</p>
                                   <span className={`text-[9px] font-bold mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>May 24 • 09:30 AM</span>
                                </div>
                             </div>

                          </div>
                       </div>

                       {/* Quick Actions Grid */}
                       <div className={`${cardBg} rounded-2xl border shadow-sm p-6`}>
                          <h3 className={`text-base font-black mb-4 ${textTitle}`}>Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-3">
                             <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]/50 border-gray-700/50 hover:bg-[#1E293B]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <FiTruck className={`text-xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`}/>
                                <span className={`text-[10px] font-bold ${textTitle}`}>Track Order</span>
                             </button>
                             <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]/50 border-gray-700/50 hover:bg-[#1E293B]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <FiDownload className={`text-xl ${isDark ? 'text-green-400' : 'text-green-600'}`}/>
                                <span className={`text-[10px] font-bold ${textTitle}`}>Download</span>
                             </button>
                             <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]/50 border-gray-700/50 hover:bg-[#1E293B]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <FiCreditCard className={`text-xl ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}/>
                                <span className={`text-[10px] font-bold ${textTitle}`}>Make Pay</span>
                             </button>
                             <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition hover:-translate-y-1 ${isDark ? 'bg-[#1E293B]/50 border-gray-700/50 hover:bg-[#1E293B]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <FiShield className={`text-xl ${isDark ? 'text-red-400' : 'text-red-600'}`}/>
                                <span className={`text-[10px] font-bold ${textTitle}`}>Support</span>
                             </button>
                          </div>
                       </div>

                    </div>
                 </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY (Kama zamani lakini Styled Dark) */}
            {activeTab === 'orders' && (
              <div className={`${cardBg} rounded-2xl shadow-sm border overflow-hidden animate-fade-in flex flex-col min-h-[500px] transition-colors`}>
                <div className={`p-6 border-b flex items-center gap-3 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><FiPackage className="text-xl" /></div>
                  <h2 className={`text-xl font-black ${textTitle}`}>{t.myOrders}</h2>
                </div>
                <div className={`flex-1 overflow-x-auto ${isDark ? 'bg-[#0A101D]/50' : 'bg-gray-50/30'}`}>
                  {orders.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-full p-16 text-center ${textMuted}`}>
                      <FiShoppingCart className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-200'}`} />
                      <p className={`text-lg font-bold ${textTitle}`}>{t.noOrders}</p>
                      <p className="text-sm mt-2">{t.noOrdersDesc}</p>
                      <button onClick={() => router.push('/')} className={`mt-6 font-bold py-3 px-8 rounded-xl text-sm transition ${isDark ? 'bg-[#F2A900] text-[#0A101D] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>Shop Now</button>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className={`${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'} border-b text-xs uppercase ${textMuted} font-black tracking-wider`}>
                        <tr><th className="px-6 py-4">{t.orderId}</th><th className="px-6 py-4">{t.date}</th><th className="px-6 py-4">{t.status}</th><th className="px-6 py-4">{t.total}</th><th className="px-6 py-4 text-right">{t.action}</th></tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                        {orders.map((order: any) => (
                          <tr key={order.id} className={`transition cursor-pointer ${isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-50'}`} onClick={() => setSelectedOrder(order)}>
                            <td className={`px-6 py-4 font-mono text-xs font-bold ${textMuted}`}>#{order.id.slice(-6).toUpperCase()}</td>
                            <td className={`px-6 py-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                order.status === 'DELIVERED' 
                                  ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') 
                                  : (isDark ? 'bg-yellow-900/30 text-[#F2A900]' : 'bg-yellow-100 text-yellow-700')
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

            {/* TAB 3: ADDRESS BOOK (Styled Dark) */}
            {activeTab === 'address' && (
              <div className={`${cardBg} rounded-2xl shadow-sm border p-6 sm:p-8 animate-fade-in transition-colors`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl font-black ${textTitle}`}>{t.addressBook}</h2>
                  <button className={`${isDark ? 'bg-[#F2A900] hover:bg-yellow-500 text-[#0A101D]' : 'bg-gray-100 hover:bg-gray-200 text-[#0F172A]'} font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition`}><FiPlus /> Add New</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`border-2 border-[#F2A900] rounded-xl p-5 relative ${isDark ? 'bg-yellow-900/10' : 'bg-yellow-50/30'}`}>
                    <span className="absolute top-4 right-4 bg-[#F2A900] text-[#0A101D] text-[10px] font-black px-2 py-1 rounded uppercase">Default</span>
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

            {/* TABS ZINGINE ZIKO HIVI HIVI LAKINI ZIMEZIMWA ILI KODI ISIWE NDEFU MNO */}
            {activeTab !== 'overview' && activeTab !== 'orders' && activeTab !== 'address' && (
              <div className={`${cardBg} rounded-2xl shadow-sm border p-10 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px] transition-colors`}>
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'}`}>
                    <FiSettings className={`text-3xl ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                 </div>
                 <h2 className={`text-xl font-black mb-2 ${textTitle}`}>Section Under Construction</h2>
                 <p className={`text-sm mb-6 ${textMuted}`}>This section is currently being updated to match the new design.</p>
                 <button onClick={() => setActiveTab('overview')} className={`font-black py-3 px-8 rounded-xl text-sm transition ${isDark ? 'bg-[#F2A900] text-[#0A101D] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>Back to Dashboard</button>
              </div>
            )}

         </div>
      </main>

      {/* MODAL YA RISITI (RECEIPT) */}
      {selectedOrder && (
        <div className={`fixed inset-0 ${isDark ? 'bg-[#050B14]/90' : 'bg-black/80'} z-50 flex items-center justify-center p-4 backdrop-blur-md`}>
          <div className={`${isDark ? 'bg-[#0A101D] border border-gray-800' : 'bg-white border-[#0F172A]'} w-full max-w-3xl rounded-2xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-fade-in`}>
            
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-800 bg-[#0F172A]' : 'border-gray-100 bg-gray-50'}`}>
               <h3 className={`font-black text-lg ${textTitle}`}>Order Receipt</h3>
               <button onClick={() => setSelectedOrder(null)} className={`p-2 rounded-full transition ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-200 text-gray-600 hover:text-black'}`}><FiX/></button>
            </div>

            <div className={`p-6 md:p-10 overflow-y-auto print-section flex-1 ${isDark ? 'bg-[#0A101D]' : 'bg-white'}`}>
              
              <div className={`flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 pb-6 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <div>
                  <h2 className={`text-3xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}><span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span>ex</h2>
                  <p className={`text-xs font-bold uppercase mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Marketplace & Delivery</p>
                  <div className={`mt-4 text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>TIN: 123-456-789</p>
                    <p>Dar es Salaam, Tanzania</p>
                    <p>support@jtex.co.tz | +255 700 000 000</p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:text-right">
                  <h1 className={`text-2xl font-black uppercase tracking-widest mb-2 ${isDark ? 'text-gray-700' : 'text-gray-200'}`}>INVOICE</h1>
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
                    <tr className={`text-xs uppercase tracking-wider ${isDark ? 'bg-[#0F172A] text-gray-400 border-y border-gray-800' : 'bg-gray-100 text-gray-600 border-y border-gray-200'}`}>
                      <th className="py-3 px-4 font-bold">Description</th>
                      <th className="py-3 px-4 font-bold text-center">Qty</th>
                      <th className="py-3 px-4 font-bold text-right">Amount (TZS)</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={item.id} className={idx % 2 === 0 ? (isDark ? 'bg-transparent' : 'bg-white') : (isDark ? 'bg-[#0F172A]/30' : 'bg-gray-50/50')}>
                        <td className={`py-4 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{item.product?.name || 'Item'}</td>
                        <td className={`py-4 px-4 text-center font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.quantity}</td>
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

              <div className={`border-t pt-8 flex flex-col md:flex-row justify-between gap-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
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
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t flex justify-end print:hidden ${isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
               <button onClick={() => window.print()} className={`font-black py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition ${isDark ? 'bg-[#F2A900] text-[#0A101D] hover:bg-yellow-500' : 'bg-[#0F172A] text-white hover:bg-gray-800'}`}>
                 <FiDownload /> {t.download}
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}