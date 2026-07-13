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
  FiBell, FiCalendar, FiClock, FiActivity, FiArrowUpRight, FiArrowDownRight, FiMoreHorizontal,
  FiHome, FiGrid, FiShare2, FiArrowLeft, FiHeadphones, FiCheck, FiMenu, FiZap, FiCamera, FiLock
} from 'react-icons/fi';

export default function ProfileTrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullUserInfo, setFullUserInfo] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tabs State
  const [activeMenu, setActiveMenu] = useState('profile');
  const [activeTab, setActiveTab] = useState('personal_info');
  const [isClient, setIsClient] = useState(false);
  
  const { cart } = useCart();
  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    setIsClient(true);
    
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
          myOrders.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(myOrders);
        }
        
        const usersRes = await fetch(`${url}/api/users`, { cache: 'no-store' });
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          const myFullInfo = allUsers.find((u: any) => u.id === parsedUser.id);
          setFullUserInfo(myFullInfo || { ...parsedUser, loyaltyPoints: 2450, debtAmount: 820000 });
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

  const totalPaid = orders.reduce((acc, order) => acc + (order.upfrontPayment || order.totalAmount), 0) || 4800000;
  const currentDebt = fullUserInfo?.debtAmount || 820000;
  const totalOrders = orders.length > 0 ? orders.length : 128;

  const sidebarMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'orders', label: 'My Orders', icon: FiPackage, badge: '12' },
    { id: 'payments', label: 'Payments', icon: FiCreditCard, badge: '4' },
    { id: 'debts', label: 'Debts', icon: FiFileText, badge: '2' },
    { id: 'tracking', label: 'Tracking', icon: FiMapPin },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'profile', label: 'Profile', icon: FiUser, hasSubMenu: true },
    { id: 'notifications', label: 'Notifications', icon: FiBell, badge: '12' },
    { id: 'support', label: 'Support', icon: FiHelpCircle },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR (DARK THEME) */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#0A101D] text-gray-400 h-full overflow-y-auto custom-scrollbar border-r border-gray-800 relative z-20">
        <div className="p-6 cursor-pointer flex items-center gap-2" onClick={() => router.push('/')}>
          <img src="/logo.png" alt="Jtex" className="h-8 object-contain brightness-0 invert" />
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {sidebarMenu.map(item => {
            const isActive = activeMenu === item.id;
            return (
              <div key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#1E293B] text-white font-bold' : 'hover:text-white hover:bg-[#1E293B]/50 font-medium'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`text-xl ${isActive ? 'text-[#F2A900]' : ''}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && <span className="bg-gray-700 text-gray-300 text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  {item.hasSubMenu && <FiChevronDown className={isActive ? 'text-white' : ''}/>}
                </button>

                {/* Sub Menu for Profile */}
                {item.id === 'profile' && isActive && (
                  <div className="ml-11 mt-1 space-y-1 border-l-2 border-gray-800 pl-4 py-2">
                    <button onClick={() => setActiveTab('personal_info')} className={`w-full text-left py-2 text-sm flex items-center gap-2 ${activeTab === 'personal_info' ? 'text-white font-bold' : 'hover:text-white'}`}>
                      {activeTab === 'personal_info' && <div className="w-1.5 h-1.5 rounded-full bg-[#F2A900]"></div>}
                      Personal Info
                    </button>
                    <button onClick={() => setActiveTab('address_book')} className={`w-full text-left py-2 text-sm flex items-center gap-2 ${activeTab === 'address_book' ? 'text-white font-bold' : 'hover:text-white'}`}>
                      {activeTab === 'address_book' && <div className="w-1.5 h-1.5 rounded-full bg-[#F2A900]"></div>}
                      Address Book
                    </button>
                    <button onClick={() => setActiveTab('preferences')} className={`w-full text-left py-2 text-sm flex items-center gap-2 ${activeTab === 'preferences' ? 'text-white font-bold' : 'hover:text-white'}`}>
                      {activeTab === 'preferences' && <div className="w-1.5 h-1.5 rounded-full bg-[#F2A900]"></div>}
                      Preferences
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Loyalty Box inside Sidebar */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F2A900]/10 rounded-full blur-2xl"></div>
            <span className="text-[#F2A900] text-[10px] font-black uppercase tracking-wider mb-1 block">Exclusive Offer</span>
            <p className="text-white text-sm font-bold leading-tight mb-4">Get up to 15% OFF <br/><span className="text-gray-400 font-medium text-xs">on your next order.</span></p>
            <button className="bg-transparent border border-[#F2A900] text-[#F2A900] hover:bg-[#F2A900] hover:text-[#0A101D] text-xs font-bold px-4 py-2 rounded-lg transition">Shop Now</button>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="flex items-center gap-3 bg-[#1E293B]/50 p-3 rounded-xl border border-gray-800">
             <div className="w-10 h-10 bg-gradient-to-b from-[#F2A900] to-yellow-600 rounded-full flex items-center justify-center text-white"><FiStar size={20}/></div>
             <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Loyalty Points</p>
                <p className="text-white font-black leading-tight text-lg">2,450 <span className="text-xs font-medium text-gray-400">Points</span></p>
             </div>
          </div>
        </div>

        <div className="px-4 pb-6 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-xl transition font-medium text-sm">
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex h-20 bg-white border-b border-gray-200 items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button className="text-gray-400 hover:text-gray-900 mr-6"><FiMenu size={24} className="hidden" /></button>
            <div className="relative flex items-center">
              <FiSearch className="absolute left-4 text-gray-400" size={18} />
              <input type="text" placeholder="Search for products, brands and categories..." className="pl-12 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-full w-[400px] text-sm outline-none focus:border-[#F2A900]" />
              <div className="absolute right-4 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">Ctrl + K</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-[#0A101D] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition">
              <FiZap className="text-[#F2A900] fill-current" /> AI Assistant
            </button>
            
            <div className="flex items-center gap-4 text-gray-600">
              <button className="relative hover:text-[#F2A900] transition">
                <FiBell size={22} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">12</span>
              </button>
              <button onClick={() => router.push('/checkout')} className="relative hover:text-[#F2A900] transition">
                <FiShoppingCart size={22} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cart?.length || 4}</span>
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200"></div>

            <button className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-black">
               <FiGlobe className="text-gray-400"/> EN <FiChevronDown className="text-gray-400"/>
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-[#0A101D] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'John Mwangi'}</span>
                <span className="text-[10px] text-gray-500 font-medium">Customer</span>
              </div>
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* MOBILE HEADER */}
        <header className="lg:hidden bg-[#0A101D] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={() => router.back()}><FiArrowLeft size={24} className="text-gray-300"/></button>
             <h1 className="text-lg font-black tracking-tight text-white">Profile</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <FiBell size={22} className="text-gray-300"/>
                <span className="absolute -top-1.5 -right-1.5 bg-[#F2A900] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">12</span>
             </div>
             <div className="w-8 h-8 bg-[#F2A900] rounded-full flex items-center justify-center text-black font-black text-sm">
                {user?.name?.charAt(0) || 'U'}
             </div>
          </div>
        </header>

        {/* SCROLLABLE PROFILE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          <div className="max-w-[1200px] mx-auto pb-20 lg:pb-0">
            
            {/* Page Header (Desktop) */}
            <div className="hidden lg:flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 mb-1">
                  Customer Profile <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm shadow-sm"><FiCheck strokeWidth={4}/></div>
                </h1>
                <p className="text-gray-500 text-sm font-medium">Manage your personal information, addresses and preferences.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm"><FiShield size={20}/></div>
                 <div>
                   <h4 className="font-bold text-green-800 text-sm">Your account is 100% Secure</h4>
                   <p className="text-[10px] text-green-600 font-medium">Last login: May 27, 2024 • 08:45 PM</p>
                 </div>
              </div>
            </div>

            {/* TABS ROW */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-1.5 lg:p-2 flex overflow-x-auto hide-scrollbar mb-6 lg:mb-8 shadow-sm">
              <button onClick={() => setActiveTab('personal_info')} className={`flex-1 min-w-[120px] py-2.5 lg:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${activeTab === 'personal_info' ? 'bg-[#FFF9EB] text-[#F2A900] font-black border border-yellow-200' : 'text-gray-500 font-bold hover:bg-gray-50'}`}>
                <FiUser className={activeTab === 'personal_info' ? 'stroke-current' : ''} /> <span className="whitespace-nowrap">Personal Info</span>
              </button>
              <button onClick={() => setActiveTab('address_book')} className={`flex-1 min-w-[120px] py-2.5 lg:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${activeTab === 'address_book' ? 'bg-[#FFF9EB] text-[#F2A900] font-black border border-yellow-200' : 'text-gray-500 font-bold hover:bg-gray-50'}`}>
                <FiMapPin className={activeTab === 'address_book' ? 'stroke-current' : ''} /> <span className="whitespace-nowrap">Address Book</span>
              </button>
              <button onClick={() => setActiveTab('preferences')} className={`flex-1 min-w-[120px] py-2.5 lg:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${activeTab === 'preferences' ? 'bg-[#FFF9EB] text-[#F2A900] font-black border border-yellow-200' : 'text-gray-500 font-bold hover:bg-gray-50'}`}>
                <FiSettings className={activeTab === 'preferences' ? 'stroke-current' : ''} /> <span className="whitespace-nowrap">Preferences</span>
              </button>
            </div>

            {/* CONTENT GRID */}
            {activeTab === 'personal_info' && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                
                {/* LEFT COLUMN */}
                <div className="flex-1 space-y-6 lg:space-y-8">
                  
                  {/* Personal Information Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-lg lg:text-xl font-black text-gray-900 mb-1">Personal Information</h2>
                        <p className="text-xs text-gray-500 font-medium">View and update your personal details.</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                        <FiEdit2 /> Edit Profile
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 relative overflow-hidden flex items-center justify-center">
                           <FiUser className="text-4xl lg:text-6xl text-gray-300" />
                           <div className="absolute bottom-0 left-0 w-full h-8 bg-black/40 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/60 transition">
                             <FiCamera className="text-white text-sm" />
                           </div>
                        </div>
                        <button className="text-xs font-bold text-blue-600 hover:underline">Change Photo</button>
                        <div className="text-center mt-2">
                           <p className="text-[10px] text-gray-400 font-bold uppercase">Jtex Member Since</p>
                           <p className="text-xs font-black text-gray-800">April 12, 2023</p>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiUser className="text-gray-300"/> Full Name</p>
                          <p className="text-sm font-black text-gray-900">{user?.name || 'John Mwangi'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiMail className="text-gray-300"/> Email Address</p>
                          <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                            {user?.email || 'john.mwangi@email.com'}
                            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1"><FiCheckCircle/> Verified</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiPhone className="text-gray-300"/> Phone Number</p>
                          <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                            {user?.phone || '+255 712 345 678'}
                            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1"><FiCheckCircle/> Verified</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiCalendar className="text-gray-300"/> Date of Birth</p>
                          <p className="text-sm font-black text-gray-900">May 15, 1992</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiUser className="text-gray-300"/> Gender</p>
                          <p className="text-sm font-black text-gray-900">Male</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiGlobe className="text-gray-300"/> Nationality</p>
                          <p className="text-sm font-black text-gray-900">Tanzania</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiMessageCircle className="text-gray-300"/> Preferred Language</p>
                          <p className="text-sm font-black text-gray-900">English</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1.5"><FiShield className="text-gray-300"/> Account Type</p>
                          <p className="text-sm font-black text-gray-900">Individual</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Security Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                     <h2 className="text-lg lg:text-xl font-black text-gray-900 mb-1">Account Security</h2>
                     <p className="text-xs text-gray-500 font-medium mb-8">Manage your password and account security settings.</p>
                     
                     <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                       <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center">
                          {/* Illustrated Shield from mockup */}
                          <div className="relative w-24 h-28 bg-gradient-to-b from-blue-400 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg]">
                            <FiLock className="text-white text-4xl transform rotate-[5deg]" />
                            <div className="absolute -left-4 top-4 w-2 h-2 bg-blue-300 rounded-full"></div>
                            <div className="absolute right-4 -bottom-4 w-3 h-3 bg-blue-200 rounded-full"></div>
                          </div>
                       </div>
                       
                       <div className="flex-1 w-full space-y-2">
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                           <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Password</p><p className="text-sm font-black text-gray-900 tracking-widest">********</p></div>
                           <button className="px-4 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">Change</button>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                           <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Two-Factor Authentication</p><p className="text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded w-max">Enabled</p></div>
                           <button className="px-4 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">Manage</button>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                           <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Active Sessions</p><p className="text-sm font-black text-blue-600">3 Sessions</p></div>
                           <button className="px-4 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">View</button>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                           <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Login Devices</p><p className="text-sm font-black text-blue-600">4 Devices</p></div>
                           <button className="px-4 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50">Manage</button>
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* Address Book Preview Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg lg:text-xl font-black text-gray-900 mb-1">Address Book (3)</h2>
                        <p className="text-xs text-gray-500 font-medium">View and manage your saved addresses.</p>
                      </div>
                      <button onClick={() => setActiveTab('address_book')} className="text-xs font-bold text-blue-600 hover:underline">View All Addresses</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Default Address */}
                      <div className="bg-gray-50 border-2 border-[#F2A900]/50 rounded-xl p-5 relative cursor-pointer hover:border-[#F2A900] transition">
                        <span className="absolute top-3 left-3 bg-[#F2A900] text-black text-[9px] font-black px-2 py-0.5 rounded">Default</span>
                        <FiMoreHorizontal className="absolute top-4 right-4 text-gray-400" />
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm mt-4 mb-3 border border-gray-100"><FiHome size={18}/></div>
                        <h4 className="font-black text-sm text-gray-900 mb-1">Home Address</h4>
                        <p className="text-xs font-bold text-gray-700 mb-1">Mikocheni, DSM</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">Dar es Salaam, Tanzania<br/>P.O Box 12345<br/>+255 712 345 678</p>
                      </div>

                      {/* Office Address */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 relative cursor-pointer hover:border-[#F2A900] transition shadow-sm">
                        <FiMoreHorizontal className="absolute top-4 right-4 text-gray-400" />
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700 border border-gray-100 mt-4 mb-3"><FiBox size={18}/></div>
                        <h4 className="font-black text-sm text-gray-900 mb-1">Office Address</h4>
                        <p className="text-xs font-bold text-gray-700 mb-1">Kariakoo, Ilala</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">Dar es Salaam, Tanzania<br/>P.O Box 54321<br/>+255 713 987 654</p>
                      </div>

                      {/* Add New */}
                      <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-[#F2A900] hover:text-[#F2A900] transition cursor-pointer bg-gray-50 hover:bg-yellow-50/30 min-h-[220px]">
                         <FiPlus className="text-3xl mb-2" />
                         <span className="text-sm font-bold">Add New Address</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6 lg:space-y-8">
                   
                   {/* Profile Completion Card */}
                   <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                      <h2 className="text-lg font-black text-gray-900 mb-1">Profile Completion</h2>
                      <p className="text-xs text-gray-500 font-medium mb-6">Complete your profile to get the best experience.</p>
                      
                      <div className="flex items-center gap-6 mb-8">
                         {/* Simple SVG Circular Progress Bar */}
                         <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                               <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                               <circle cx="50" cy="50" r="40" stroke="#1D4ED8" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-2xl font-black text-gray-900 leading-none">85%</span>
                               <span className="text-[8px] font-bold text-gray-500 uppercase mt-1">Complete</span>
                            </div>
                         </div>
                         
                         <div className="flex-1 space-y-3">
                           <div className="flex justify-between items-center text-xs"><span className="font-bold text-gray-700">Personal Information</span><FiCheckCircle className="text-green-500 text-base"/></div>
                           <div className="flex justify-between items-center text-xs"><span className="font-bold text-gray-700">Email Verified</span><FiCheckCircle className="text-green-500 text-base"/></div>
                           <div className="flex justify-between items-center text-xs"><span className="font-bold text-gray-700">Phone Verified</span><FiCheckCircle className="text-green-500 text-base"/></div>
                           <div className="flex justify-between items-center text-xs"><span className="font-bold text-gray-700">Add Address</span><FiCheckCircle className="text-green-500 text-base"/></div>
                           <div className="flex justify-between items-center text-xs"><span className="font-medium text-gray-500">Set Preferences</span><div className="w-4 h-4 rounded-full border-2 border-gray-200"></div></div>
                           <div className="flex justify-between items-center text-xs"><span className="font-medium text-gray-500">Payment Method</span><div className="w-4 h-4 rounded-full border-2 border-gray-200"></div></div>
                         </div>
                      </div>
                   </div>

                   {/* Preferences Preview Card */}
                   <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-lg font-black text-gray-900 mb-1">Preferences</h2>
                      <p className="text-xs text-gray-500 font-medium mb-6">Manage how your account works for you.</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-orange-50 text-[#F2A900] flex items-center justify-center"><FiBell/></div>
                             <div><p className="text-xs font-bold text-gray-900">Notification Preferences</p><p className="text-[10px] text-gray-500">Email, SMS, Push</p></div>
                           </div>
                           <FiChevronRight className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiShield/></div>
                             <div><p className="text-xs font-bold text-gray-900">Privacy Settings</p><p className="text-[10px] text-gray-500">Manage your data & privacy</p></div>
                           </div>
                           <FiChevronRight className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiGlobe/></div>
                             <div><p className="text-xs font-bold text-gray-900">Currency & Language</p><p className="text-[10px] text-gray-500">TZS • English</p></div>
                           </div>
                           <FiChevronRight className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiUser/></div>
                             <div><p className="text-xs font-bold text-gray-900">Theme Preference</p><p className="text-[10px] text-gray-500">Light Mode</p></div>
                           </div>
                           <FiChevronRight className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FiMail/></div>
                             <div><p className="text-xs font-bold text-gray-900">Email Preferences</p><p className="text-[10px] text-gray-500">Promotions, updates</p></div>
                           </div>
                           <FiChevronRight className="text-gray-400" />
                        </div>
                      </div>
                   </div>

                   {/* Need Help CTA */}
                   <div className="bg-[#0A101D] rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
                     <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F2A900]/10 rounded-full blur-2xl pointer-events-none"></div>
                     <FiHeadphones className="absolute bottom-4 right-4 text-[#1E293B] opacity-50" size={100} />
                     
                     <div className="relative z-10">
                       <h3 className="text-lg font-black text-white mb-2">Need Help?</h3>
                       <p className="text-xs text-gray-400 font-medium mb-6 max-w-[200px] leading-relaxed">Our support team is here to help you 24/7 with any issues.</p>
                       <button onClick={() => router.push('/help')} className="bg-transparent border border-white/20 text-white hover:bg-white hover:text-[#0A101D] text-sm font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2">
                         Contact Support <FiChevronRight/>
                       </button>
                     </div>
                   </div>

                </div>
              </div>
            )}

            {/* Other Tabs Empty States */}
            {activeTab !== 'personal_info' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><FiSettings size={32}/></div>
                 <h2 className="text-xl font-black text-gray-900 mb-2 capitalize">{activeTab.replace('_', ' ')} Details</h2>
                 <p className="text-gray-500 text-sm max-w-md">This section is currently under development. Please check back later to manage your {activeTab.replace('_', ' ')}.</p>
              </div>
            )}

            {/* BOTTOM STATS ROW (Desktop & Mobile) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
               <div className="bg-[#0A101D] rounded-2xl p-5 border border-gray-800 relative overflow-hidden flex items-center gap-4 shadow-lg group hover:-translate-y-1 transition duration-300 cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center flex-shrink-0 border border-gray-700"><FiCalendar className="text-[#F2A900] text-xl"/></div>
                 <div className="flex-1">
                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Total Orders</p>
                   <h3 className="text-xl font-black text-white">{totalOrders}</h3>
                   <p className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-0.5"><FiArrowUpRight/> +18% this month</p>
                 </div>
               </div>
               
               <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4 shadow-sm group hover:-translate-y-1 transition duration-300 cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100"><FiCreditCard className="text-green-600 text-xl"/></div>
                 <div className="flex-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Total Spent</p>
                   <h3 className="text-xl font-black text-gray-900">TZS {(totalPaid/1000000).toFixed(1)}M</h3>
                   <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-0.5"><FiArrowUpRight/> +22% this month</p>
                 </div>
               </div>

               <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4 shadow-sm group hover:-translate-y-1 transition duration-300 cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100"><FiFileText className="text-red-600 text-xl"/></div>
                 <div className="flex-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Outstanding Debt</p>
                   <h3 className="text-xl font-black text-gray-900">TZS {(currentDebt/1000).toFixed(0)}K</h3>
                   <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-0.5"><FiArrowDownRight/> -8% vs last month</p>
                 </div>
               </div>

               <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4 shadow-sm group hover:-translate-y-1 transition duration-300 cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100"><FiStar className="text-purple-600 text-xl"/></div>
                 <div className="flex-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Loyalty Points</p>
                   <h3 className="text-xl font-black text-gray-900">2,450</h3>
                   <p className="text-[10px] text-[#F2A900] font-black mt-1 uppercase tracking-wider">Gold Member</p>
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION (DARK THEME KAMA PICHA) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0A101D] border-t border-gray-800 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-2xl">
         <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
            <FiHome size={22}/>
            <span className="text-[9px] font-bold">Dashboard</span>
         </button>
         <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
            <FiPackage size={22}/>
            <span className="text-[9px] font-bold">Orders</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
            <FiCreditCard size={22}/>
            <span className="text-[9px] font-bold">Payments</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-[#F2A900]">
            <FiUser size={22} className="stroke-current"/>
            <span className="text-[9px] font-black">Profile</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
            <FiMoreHorizontal size={22}/>
            <span className="text-[9px] font-bold">More</span>
         </button>
      </div>

    </div>
  );
}