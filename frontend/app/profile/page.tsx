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
  FiHome, FiGrid, FiShare2, FiArrowLeft, FiHeadphones
} from 'react-icons/fi';

export default function ProfileTrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullUserInfo, setFullUserInfo] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('tracking'); // default to tracking tab
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  const { cart } = useCart();
  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';

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
          
          // Panga oda mpya ziwe juu
          myOrders.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(myOrders);
          
          // Chagua oda ya kwanza (mpya zaidi) kama default tracking
          if (myOrders.length > 0) setSelectedOrder(myOrders[0]); 
        }
        
        // Vuta info kamili za mtumiaji
        const usersRes = await fetch(`${url}/api/users`, { cache: 'no-store' });
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          const myFullInfo = allUsers.find((u: any) => u.id === parsedUser.id);
          setFullUserInfo(myFullInfo || { ...parsedUser, loyaltyPoints: 120, debtAmount: 0 });
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

  // Mahesabu Real-Time kwa ajili ya Dashboard
  const totalPaid = orders.reduce((acc, order) => acc + (order.upfrontPayment || order.totalAmount), 0);
  const activeDeliveries = orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length;
  const currentDebt = fullUserInfo?.debtAmount || 0;

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: FiHome },
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'tracking', label: 'Order Tracking', icon: FiMapPin, isSub: true, dot: true },
    { id: 'address', label: 'My Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Account Settings', icon: FiSettings },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">Inapakia profile yako...</p>
      </div>
    );
  }

  const trackingOrder = selectedOrder || orders[0] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-0 font-sans antialiased flex flex-col lg:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 flex-shrink-0 bg-white border-r border-gray-100 p-4">
        <div className="mb-8 cursor-pointer px-4" onClick={() => router.push('/')}>
          <div className="flex text-3xl font-black italic tracking-tighter">
            <span className="text-blue-500">J</span><span className="text-[#F2A900]">t</span><span className="text-[#0F172A]">ex</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${isActive ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`text-lg ${isActive ? 'text-[#F2A900]' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
              </button>
            )
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-bold text-sm mt-auto">
          <FiLogOut className="text-lg" /> Log Out
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP BREADCRUMB */}
        <div className="hidden lg:block bg-white border-b border-gray-100 p-6 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
             <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span> <FiChevronRight/>
                <span className="text-gray-900 capitalize">{activeTab}</span>
                {activeTab === 'tracking' && trackingOrder && (
                   <> <FiChevronRight/> <span className="text-[#F2A900]">JTX-{trackingOrder.id.slice(-6).toUpperCase()}</span> </>
                )}
             </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
             <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Jumla ya Oda</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-2">{orders.length}</h3>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Kiasi Kilicholipwa</p>
                      <h3 className="text-2xl font-black text-green-600 mt-2">TZS {totalPaid.toLocaleString()}</h3>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Deni la Oda (COD)</p>
                      <h3 className="text-2xl font-black text-red-500 mt-2">TZS {currentDebt.toLocaleString()}</h3>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase">Oda Zisizofika</p>
                      <h3 className="text-2xl font-black text-[#F2A900] mt-2">{activeDeliveries}</h3>
                   </div>
                </div>

                {/* List ya Oda zote za hivi karibuni */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-5 border-b border-gray-100"><h3 className="font-black text-sm text-gray-900">Mstari wa Oda Zako</h3></div>
                   <div className="divide-y divide-gray-100">
                     {orders.map((o: any) => (
                       <div key={o.id} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedOrder(o); setActiveTab('tracking'); }}>
                          <div>
                             <p className="text-xs font-mono font-bold text-gray-500">#JTX-{o.id.slice(-6).toUpperCase()}</p>
                             <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{o.status}</span>
                          <span className="text-sm font-black text-gray-900">TZS {o.totalAmount.toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          )}

          {/* TAB 2: ORDER TRACKING SYSTEM REAL DATA */}
          {activeTab === 'tracking' && trackingOrder ? (
            <div className="space-y-6 animate-fade-in">
              {/* Info Row Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0"><FiFileText size={24}/></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Order ID</p>
                      <h3 className="font-black text-base text-gray-900">JTX-{trackingOrder.id.slice(-6).toUpperCase()}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">{new Date(trackingOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Paid Status</p>
                    <h3 className="font-black text-lg text-green-600 mt-1">TZS {(trackingOrder.upfrontPayment || trackingOrder.totalAmount).toLocaleString()}</h3>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Remaining Balance</p>
                    <h3 className="font-black text-lg text-[#F2A900] mt-1">TZS {Math.max(0, trackingOrder.totalAmount - (trackingOrder.upfrontPayment || 0)).toLocaleString()}</h3>
                 </div>
              </div>

              {/* Live Tracking Header */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-4">
                    <span className="text-4xl">🛵</span>
                    <div>
                       <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1">Status: <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span></span>
                       <h2 className="text-xl font-black text-gray-900 capitalize">{trackingOrder.status.toLowerCase().replace('_', ' ')}</h2>
                    </div>
                 </div>
                 <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">Estimated Delivery: Today</div>
              </div>

              {/* Details & Items Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                       <h3 className="font-black text-sm text-gray-900 mb-4"><FiMapPin className="inline mr-1"/> Delivery Address</h3>
                       <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{trackingOrder.address}, {trackingOrder.deliveryRegion}</p>
                    </div>
                 </div>

                 {/* Real Order Items List */}
                 <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-black text-sm text-gray-900 mb-4">Ordered Items ({trackingOrder.items.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {trackingOrder.items.map((item: any, idx: number) => (
                         <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-14 h-14 bg-white rounded-lg p-1 border flex items-center justify-center flex-shrink-0">
                              {item.product?.imageUrl ? <img src={getImageUrl(item.product.imageUrl)} className="object-contain w-full h-full" alt="Product"/> : <span className="text-2xl">📦</span>}
                            </div>
                            <div className="min-w-0 flex-1">
                               <h4 className="text-xs font-bold text-gray-900 truncate">{item.product?.name || 'Item'}</h4>
                               <p className="text-[10px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                               <p className="text-xs font-black text-gray-900 mt-1">TZS {item.unitPrice?.toLocaleString()}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          ) : activeTab === 'tracking' && (
             <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm">
                <FiPackage className="text-4xl text-gray-300 mx-auto mb-2"/>
                <p className="text-gray-500 font-bold">Hujafanya oda yoyote bado ili kuweza kuifuatilia (Track).</p>
             </div>
          )}

          {/* Fallback for other unfinished sections */}
          {activeTab !== 'tracking' && activeTab !== 'overview' && (
             <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
                <FiSettings className="text-3xl text-gray-300 mx-auto mb-2" />
                <h2 className="text-lg font-black text-gray-900 capitalize">{activeTab} Section</h2>
                <button onClick={() => setActiveTab('overview')} className="mt-4 bg-[#F2A900] text-black font-bold px-4 py-2 rounded-lg text-xs">Back to Dashboard</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}