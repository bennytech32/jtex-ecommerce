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
  FiHome, FiGrid, FiShare2, FiArrowLeft, FiHeadphones, FiCopy, FiCheck
} from 'react-icons/fi';

const translations = {
  en: {
    profile: "My Profile",
    overview: "Dashboard",
    myOrders: "Order History",
    tracking: "Order Tracking",
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
  }
};

export default function ProfileTrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullUserInfo, setFullUserInfo] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('tracking'); // 'overview', 'orders', 'tracking', 'address'
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  const { cart } = useCart();
  const t = translations.en;

  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

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
          // Sort to put newest first
          const sortedOrders = myOrders.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(sortedOrders);
          if (sortedOrders.length > 0) setSelectedOrder(sortedOrders[0]); // Auto select first order for tracking
        }
        
        // Simulating getting full user info
        setFullUserInfo({ ...parsedUser, debtAmount: 0, loyaltyPoints: 450 });
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

  // Sidebar Menu Items based on design
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: FiHome },
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'tracking', label: 'Order Tracking', icon: FiMapPin, isSub: true, dot: true },
    { id: 'returns', label: 'My Returns', icon: FiClock },
    { id: 'wishlist', label: 'My Wishlist', icon: FiHeart },
    { id: 'address', label: 'My Addresses', icon: FiMapPin },
    { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
    { id: 'settings', label: 'Account Settings', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell, badge: 2 },
    { id: 'support', label: 'Support Tickets', icon: FiHeadphones },
  ];

  const renderSidebar = () => (
    <div className="hidden lg:flex w-[260px] flex-col flex-shrink-0">
      <div className="mb-8 cursor-pointer" onClick={() => router.push('/')}>
        <div className="flex text-3xl font-black italic tracking-tighter">
          <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-[#0F172A]">ex</span>
        </div>
      </div>

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">My Account</h3>
      <nav className="flex flex-col gap-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id}>
              {item.isSub && <div className="pl-12 text-xs font-bold text-gray-400 mb-1 mt-1 cursor-pointer hover:text-gray-900 transition" onClick={() => setActiveTab('orders')}>All Orders</div>}
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${isActive ? (item.isSub ? 'bg-transparent text-[#F2A900]' : 'bg-gray-100 text-gray-900 font-bold') : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  {item.isSub ? (
                    <div className={`w-1.5 h-1.5 rounded-full ml-1.5 ${isActive ? 'bg-[#F2A900]' : 'bg-transparent'}`}></div>
                  ) : (
                    <Icon className={`text-lg ${isActive ? 'text-[#F2A900]' : 'text-gray-400'}`} />
                  )}
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'} ${item.isSub && isActive ? 'text-[#F2A900]' : ''}`}>{item.label}</span>
                </div>
                {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>}
              </button>
            </div>
          )
        })}
      </nav>
      
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl transition font-bold text-sm">
        <FiLogOut className="text-lg" /> Log Out
      </button>

      <div className="mt-8 bg-[#FFFDF5] border border-yellow-200/60 rounded-2xl p-5 text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-3"><FiHeadphones size={24}/></div>
        <h4 className="font-black text-sm text-gray-900 mb-1">Need Help?</h4>
        <p className="text-[10px] text-gray-500 mb-4 font-medium">Our support team is here<br/>24/7 to help you.</p>
        <button className="w-full bg-[#F2A900] text-black font-bold py-2 rounded-lg text-xs">Contact Support</button>
      </div>
    </div>
  );

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="font-bold text-gray-500 animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  // Calculate Order Summary for Tracking View
  const trackingOrder = selectedOrder || orders[0] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-0">
      
      {/* ======================================================= */}
      {/* MOBILE HEADER (TRACKING OR GENERAL)                     */}
      {/* ======================================================= */}
      <header className="lg:hidden bg-[#0A101D] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => { if(activeTab !== 'overview') setActiveTab('overview'); else router.push('/'); }}><FiArrowLeft size={24} /></button>
          <h1 className="text-lg font-black tracking-wide">{activeTab === 'tracking' ? 'Order Tracking' : 'My Account'}</h1>
        </div>
        <button className="flex items-center gap-1 border border-gray-700 bg-gray-800/50 px-3 py-1.5 rounded-full text-[10px] font-bold">
          <FiHeadphones /> Need Help?
        </button>
      </header>

      {/* ======================================================= */}
      {/* DESKTOP BREADCRUMB HEADER                               */}
      {/* ======================================================= */}
      <div className="hidden lg:block bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
           <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
              <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> <FiChevronRight/>
              <span className="hover:text-black cursor-pointer">My Account</span> <FiChevronRight/>
              <span className="text-gray-900 capitalize">{activeTab.replace('-', ' ')}</span>
              {activeTab === 'tracking' && trackingOrder && (
                 <> <FiChevronRight/> <span className="text-[#F2A900]">JTX{trackingOrder.id.slice(-8).toUpperCase()}</span> </>
              )}
           </div>
           <div className="flex gap-3">
              <button className="border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"><FiHeadphones/> Need Help? Contact Support</button>
              {activeTab === 'tracking' && <button className="border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"><FiShare2/> Share Tracking</button>}
           </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto lg:pt-8 px-4 lg:px-8 flex gap-8 pb-10">
        
        {/* ======================================================= */}
        {/* SIDEBAR                                                 */}
        {/* ======================================================= */}
        {renderSidebar()}

        {/* ======================================================= */}
        {/* MAIN CONTENT AREA                                       */}
        {/* ======================================================= */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-8 pt-4 lg:pt-0 min-w-0">
          
          {/* ---------------------------------------------------- */}
          {/* TAB 1: ORDER TRACKING (NEW DESIGN)                     */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'tracking' && trackingOrder && (
            <>
              {/* Top Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fade-in">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0"><FiFileText size={24}/></div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Order ID</p>
                      <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">JTX{trackingOrder.id.slice(-8).toUpperCase()} <FiCopy className="text-gray-400 cursor-pointer" size={14}/></h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Order Date: {new Date(trackingOrder.createdAt).toLocaleDateString()} • {new Date(trackingOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                 </div>
                 
                 <div className="hidden lg:flex flex-col justify-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Payment Status</p>
                    <div className="flex items-center gap-1 text-green-600 font-black text-sm mb-1 bg-green-50 w-max px-2 py-0.5 rounded">Paid <FiCheckCircle size={12}/></div>
                    <p className="text-[10px] text-gray-500 mt-1">Payment Method: <span className="font-bold text-gray-900">{trackingOrder.paymentMethod}</span></p>
                 </div>
                 <div className="hidden lg:flex flex-col justify-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Paid Amount</p>
                    <h3 className="font-black text-2xl text-green-600">TZS {(trackingOrder.upfrontPayment || trackingOrder.totalAmount).toLocaleString()}</h3>
                 </div>
                 <div className="hidden lg:flex flex-col justify-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Remaining Amount</p>
                    <h3 className="font-black text-2xl text-[#F2A900]">TZS {Math.max(0, trackingOrder.totalAmount - (trackingOrder.upfrontPayment || 0)).toLocaleString()}</h3>
                 </div>
              </div>

              {/* Master Status Card (Stepper) */}
              <div className="bg-white p-5 lg:p-8 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4 lg:gap-6">
                       <div className="w-16 h-16 lg:w-20 lg:h-20 bg-yellow-50 rounded-2xl flex items-center justify-center text-4xl lg:text-5xl">🛵</div>
                       <div>
                         <p className="text-[10px] font-bold text-green-600 uppercase mb-1 flex items-center gap-1">Current Status <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span></p>
                         <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1.5">Out for Delivery</h2>
                         <p className="text-xs text-gray-500 font-medium max-w-xs">Your order is out for delivery and will reach you soon.</p>
                       </div>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl lg:text-right flex lg:block items-center justify-between w-full lg:w-auto">
                       <div className="flex items-center gap-1.5 text-gray-600 lg:justify-end mb-1"><FiCalendar size={14}/><span className="text-[10px] font-bold uppercase">Estimated Delivery</span></div>
                       <div>
                         <p className="font-black text-sm lg:text-base text-green-700">Today</p>
                         <p className="text-[10px] text-gray-500 font-medium">03:00 PM – 06:00 PM</p>
                       </div>
                    </div>
                 </div>

                 {/* Horizontal Stepper */}
                 <div className="relative pt-4 pb-8 lg:pb-4 overflow-x-auto hide-scrollbar px-2 lg:px-6">
                    <div className="min-w-[500px]">
                      <div className="absolute top-8 left-[5%] right-[5%] h-1 bg-gray-100 rounded-full -z-10"></div>
                      <div className="absolute top-8 left-[5%] w-[70%] h-1 bg-green-500 rounded-full -z-10 transition-all duration-1000"></div>
                      
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col items-center w-20">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] mb-2"><FiCheckCircle size={16}/></div>
                          <span className="text-[10px] font-bold text-green-600 text-center leading-tight">Order Received</span>
                        </div>
                        <div className="flex flex-col items-center w-20">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] mb-2"><FiCheckCircle size={16}/></div>
                          <span className="text-[10px] font-bold text-green-600 text-center leading-tight">Processing</span>
                        </div>
                        <div className="flex flex-col items-center w-20">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] mb-2"><FiCheckCircle size={16}/></div>
                          <span className="text-[10px] font-bold text-green-600 text-center leading-tight">Packed</span>
                        </div>
                        <div className="flex flex-col items-center w-20">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] mb-2"><FiCheckCircle size={16}/></div>
                          <span className="text-[10px] font-bold text-green-600 text-center leading-tight">Shipped</span>
                        </div>
                        <div className="flex flex-col items-center w-24">
                          <div className="w-10 h-10 rounded-full bg-white border-4 border-[#F2A900] text-gray-900 flex items-center justify-center shadow-md mb-1 -mt-1"><FiTruck size={18}/></div>
                          <span className="text-[10px] font-black text-[#F2A900] text-center leading-tight">Out for Delivery</span>
                        </div>
                        <div className="flex flex-col items-center w-20">
                          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center mb-2"><FiPackage size={16}/></div>
                          <span className="text-[10px] font-bold text-gray-400 text-center leading-tight">Delivered<br/><span className="text-[8px] text-gray-300 font-normal mt-0.5 block">Pending</span></span>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="hidden lg:flex items-center gap-3 mt-4 px-4">
                    <span className="text-[10px] font-bold text-gray-600">Delivery Progress</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[82%] rounded-full"></div></div>
                    <span className="text-[10px] font-black text-green-600">82%</span>
                 </div>
              </div>

              {/* Grid Layout Bottom */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
                 
                 {/* Left Col: Timeline & Details */}
                 <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                       <div className="flex justify-between items-center mb-5">
                          <h3 className="font-black text-sm text-gray-900">Delivery Timeline</h3>
                          <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">See All <FiChevronRight/></button>
                       </div>
                       <div className="space-y-4">
                          <div className="flex gap-4 relative">
                             <div className="absolute left-2 top-6 bottom-[-20px] w-px bg-green-200"></div>
                             <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 z-10"><FiCheck size={10}/></div>
                             <div className="flex-1 flex justify-between items-start">
                               <span className="text-xs font-bold text-gray-900">Order Received</span>
                             </div>
                          </div>
                          <div className="flex gap-4 relative">
                             <div className="absolute left-2 top-6 bottom-[-20px] w-px bg-green-200"></div>
                             <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 z-10"><FiCheck size={10}/></div>
                             <div className="flex-1 flex justify-between items-start">
                               <span className="text-xs font-bold text-gray-900">Payment Confirmed</span>
                             </div>
                          </div>
                          <div className="flex gap-4 relative">
                             <div className="absolute left-2 top-6 bottom-[-20px] w-px bg-gray-200"></div>
                             <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 z-10"><FiCheck size={10}/></div>
                             <div className="flex-1 flex justify-between items-start">
                               <span className="text-xs font-bold text-gray-900">Shipped</span>
                             </div>
                          </div>
                          <div className="flex gap-4 relative">
                             <div className="absolute left-2 top-6 bottom-[-20px] w-px bg-gray-100"></div>
                             <div className="w-4 h-4 rounded-full bg-white border-2 border-[#F2A900] flex items-center justify-center flex-shrink-0 mt-0.5 z-10"></div>
                             <div className="flex-1 flex justify-between items-start">
                               <span className="text-xs font-black text-gray-900">Out for Delivery</span>
                               <div className="text-right">
                                 <span className="bg-yellow-100 text-yellow-700 text-[8px] px-1.5 rounded font-bold inline-block">Current</span>
                               </div>
                             </div>
                          </div>
                       </div>
                       <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition flex justify-center items-center gap-2">View Full History <FiChevronDown/></button>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                       <h3 className="font-black text-sm text-gray-900 mb-4 flex items-center gap-2"><FiMapPin className="text-gray-400"/> Delivery Details</h3>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">To</p>
                            <p className="font-black text-gray-800">{trackingOrder.deliveryRegion || 'Tanzania'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Shipping Method</p>
                            <p className="font-black text-gray-800 flex items-center gap-1">🛵 Bodaboda</p>
                          </div>
                       </div>
                       <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1"><FiHome/> Delivery Address</p>
                          <div className="flex justify-between items-end">
                            <p className="text-xs text-gray-600 font-medium max-w-[70%]">{trackingOrder.address}</p>
                            <button className="border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-gray-50"><FiMapPin/> View Map</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right Col: Map, Rider, Items */}
                 <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="hidden lg:flex relative bg-[#E5F2F8] rounded-2xl border border-gray-200 h-[220px] overflow-hidden items-center justify-center">
                       <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent"></div>
                       <div className="absolute top-4 left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-10 w-48">
                          <h4 className="text-[10px] font-black uppercase text-gray-900 mb-2">Live Tracking</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <FiTruck className="text-gray-500" size={14}/>
                            <span className="text-xs font-bold text-gray-800">Rider <span className="font-medium text-gray-500">2.4 km away</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-500" size={14}/>
                            <span className="text-xs font-bold text-gray-800">ETA <span className="font-medium text-gray-500">18 mins</span></span>
                          </div>
                       </div>
                       <svg className="absolute w-full h-full z-0" viewBox="0 0 1000 300" preserveAspectRatio="none">
                          <path d="M100 200 C 300 200, 400 150, 500 100 S 700 80, 900 50" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />
                          <circle cx="100" cy="200" r="6" fill="#10B981" />
                          <circle cx="900" cy="50" r="8" fill="#EF4444" />
                       </svg>
                       <div className="absolute top-[100px] left-[50%] bg-white rounded-full p-1.5 shadow-xl border-2 border-blue-500 z-10">🏍️</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                       <div className="flex justify-between items-center mb-4 relative z-10">
                         <h3 className="font-black text-sm text-gray-900">Your Rider</h3>
                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online</span>
                       </div>
                       
                       <div className="flex items-center gap-4 mb-5 relative z-10">
                         <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Rider" className="w-full h-full object-cover" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-0.5">
                             <h4 className="font-black text-base text-gray-900">Hassan Ali</h4>
                             <span className="flex items-center text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded"><FiStar className="fill-current mr-0.5"/> 4.8</span>
                           </div>
                           <p className="text-[10px] text-gray-500 font-medium mb-1">Bajaj Boxer • <span className="font-bold text-gray-800">TZ 123 DFG</span></p>
                         </div>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                          <button className="flex-1 bg-white border border-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:border-[#F2A900] transition"><FiPhone/> Call Rider</button>
                          <button className="flex-1 bg-green-50 border border-green-200 text-green-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-green-100 transition"><FiMessageCircle/> WhatsApp</button>
                          <button className="hidden lg:flex flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs items-center justify-center gap-2 hover:bg-gray-100 transition"><FiMessageCircle/> Chat</button>
                       </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="font-black text-sm text-gray-900">Items ({trackingOrder.items.length})</h3>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {trackingOrder.items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col justify-between">
                               <div className="w-full h-16 mb-2 flex items-center justify-center bg-white rounded-lg p-2 border border-gray-100">
                                 {item.product?.imageUrl ? <img src={getImageUrl(item.product.imageUrl)} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply" /> : <FiBox className="text-3xl text-gray-300"/>}
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-gray-800 leading-tight mb-1 line-clamp-1">{item.product?.name || 'Product'}<br/><span className="text-gray-400 font-medium">x {item.quantity}</span></p>
                                  <p className="text-[10px] font-black text-gray-900">TZS {item.subTotal?.toLocaleString()}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: OVERVIEW / ORDERS / OTHERS                      */}
          {/* ---------------------------------------------------- */}
          {activeTab !== 'tracking' && (
             <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center h-[500px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                   <FiSettings size={32} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">This section is currently being updated to match the new UI. Stay tuned!</p>
                <button onClick={() => setActiveTab('tracking')} className="bg-[#F2A900] text-black font-bold px-6 py-2.5 rounded-lg shadow-sm">View Order Tracking</button>
             </div>
          )}

        </div>
      </main>

      {/* ======================================================= */}
      {/* DESKTOP FIXED BOTTOM SUMMARY BAR FOR TRACKING           */}
      {/* ======================================================= */}
      {activeTab === 'tracking' && trackingOrder && (
        <div className="hidden lg:block fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
           <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
              <div className="flex items-center gap-12">
                 <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Total Amount</p><p className="font-black text-xl text-gray-900">TZS {trackingOrder.totalAmount.toLocaleString()}</p></div>
                 <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Paid</p><p className="font-black text-xl text-green-600">TZS {(trackingOrder.upfrontPayment || trackingOrder.totalAmount).toLocaleString()}</p></div>
                 <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Remaining</p><p className="font-black text-xl text-[#F2A900]">TZS {Math.max(0, trackingOrder.totalAmount - (trackingOrder.upfrontPayment || 0)).toLocaleString()}</p></div>
              </div>
              <div className="flex gap-4">
                 <button className="border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition text-sm flex items-center gap-2"><FiFileText/> Download Invoice</button>
                 <button onClick={() => router.push('/')} className="bg-[#0A101D] text-white font-black px-8 py-3 rounded-xl hover:bg-gray-800 transition shadow-md text-sm flex items-center gap-2"><FiHome/> Back to Home</button>
              </div>
           </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MOBILE FIXED BOTTOM SUMMARY BAR FOR TRACKING            */}
      {/* ======================================================= */}
      {activeTab === 'tracking' && trackingOrder && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
           <div className="bg-[#0A101D] text-white p-4 rounded-t-3xl flex justify-between items-center shadow-lg border-b border-gray-800">
              <div><p className="text-[9px] text-gray-400 font-bold mb-0.5">Total Amount</p><p className="font-black text-sm">TZS {trackingOrder.totalAmount.toLocaleString()}</p></div>
              <div className="w-px h-8 bg-gray-800"></div>
              <div><p className="text-[9px] text-gray-400 font-bold mb-0.5">Paid</p><p className="font-black text-sm text-green-400">TZS {(trackingOrder.upfrontPayment || trackingOrder.totalAmount).toLocaleString()}</p></div>
              <div className="w-px h-8 bg-gray-800"></div>
              <div><p className="text-[9px] text-gray-400 font-bold mb-0.5">Remaining</p><p className="font-black text-sm text-[#F2A900]">TZS {Math.max(0, trackingOrder.totalAmount - (trackingOrder.upfrontPayment || 0)).toLocaleString()}</p></div>
           </div>
           <div className="bg-white p-3 flex gap-2 border-t border-gray-100 pb-safe">
              <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px]"><FiFileText/> Invoice</button>
              <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px]"><FiHeadphones/> Support</button>
              <button onClick={() => router.push('/')} className="flex-1 bg-[#F2A900] text-black font-black py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] shadow-sm"><FiHome/> Home</button>
           </div>
        </div>
      )}
    </div>
  );
}