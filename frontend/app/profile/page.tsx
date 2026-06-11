'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiUser, FiPackage, FiFileText, FiStar, FiCreditCard, FiX, 
  FiDownload, FiLogOut, FiCheckCircle, FiPhone, FiMail,
  FiShoppingCart, FiSearch, FiGlobe, FiTrash2, FiChevronRight, 
  FiMapPin, FiShield, FiTruck, FiSmartphone, FiSettings, FiHeart, 
  FiHelpCircle, FiEdit2, FiPlus, FiMessageCircle, FiBox
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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="font-bold text-gray-500 animate-pulse">Loading Profile...</div>
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
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased flex flex-col">
      <TopTicker />
      
      {/* HEADER YA KAWAIDA */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-[#0F172A] tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
            </button>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
              <span className="text-xs font-bold hidden md:block">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* SIDEBAR YA MTEJA */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 text-center border-b border-gray-50 relative">
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-[#0F172A] to-gray-800"></div>
              <div className="relative w-20 h-20 bg-white border-4 border-white text-[#0F172A] rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-3 shadow-md z-10 mt-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-black text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <nav className="p-3 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id ? 'bg-[#F2A900]/10 text-[#F2A900]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`text-lg ${activeTab === item.id ? 'text-[#F2A900]' : 'text-gray-400'}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-100 my-2 pt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
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
              <h2 className="text-2xl font-black text-gray-900 mb-6">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl"><FiPackage /></div>
                  <div><p className="text-xs text-gray-500 font-bold uppercase">{t.totalOrders}</p><p className="text-2xl font-black text-gray-900">{orders.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 text-[#F2A900] flex items-center justify-center text-xl"><FiStar /></div>
                  <div><p className="text-xs text-gray-500 font-bold uppercase">{t.loyalty}</p><p className="text-2xl font-black text-gray-900">{fullUserInfo?.loyaltyPoints || 0}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl"><FiCreditCard /></div>
                  <div className="z-10"><p className="text-xs text-red-400 font-bold uppercase">{t.debt}</p><p className="text-xl font-black text-red-600">TZS {(fullUserInfo?.debtAmount || 0).toLocaleString()}</p></div>
                  {fullUserInfo?.debtAmount > 0 && <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-600 transition">PAY</button>}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-lg text-gray-900">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center"><FiBox className="text-gray-400" /></div>
                          <div><p className="font-bold text-sm text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 text-sm">TZS {order.totalAmount.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{order.status}</span>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><FiPackage className="text-xl" /></div>
                <h2 className="text-xl font-black text-gray-900">{t.myOrders}</h2>
              </div>
              <div className="flex-1 overflow-x-auto bg-gray-50/30">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-16 text-center text-gray-500">
                    <FiShoppingCart className="text-6xl mx-auto mb-4 text-gray-200" />
                    <p className="text-lg font-bold text-gray-800">{t.noOrders}</p>
                    <p className="text-sm mt-2">{t.noOrdersDesc}</p>
                    <button onClick={() => router.push('/')} className="mt-6 bg-[#0F172A] text-white font-bold py-3 px-8 rounded-xl text-sm transition hover:bg-gray-800">Shop Now</button>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                      <tr><th className="px-6 py-4">{t.orderId}</th><th className="px-6 py-4">{t.date}</th><th className="px-6 py-4">{t.status}</th><th className="px-6 py-4">{t.total}</th><th className="px-6 py-4 text-right">{t.action}</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-900">TZS {order.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg flex items-center justify-end gap-1 ml-auto"><FiFileText /> View</button>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900">{t.addressBook}</h2>
                <button className="bg-gray-100 hover:bg-gray-200 text-[#0F172A] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"><FiPlus /> Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-[#F2A900] bg-yellow-50/30 rounded-xl p-5 relative">
                  <span className="absolute top-4 right-4 bg-[#F2A900] text-[#0F172A] text-[10px] font-black px-2 py-1 rounded uppercase">Default</span>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-xl text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-black text-gray-900 text-sm mb-1">Home Address</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Makumbusho, Uhuru Street<br/>House No. 42<br/>Dar es Salaam, Tanzania</p>
                      <div className="mt-4 flex gap-3"><button className="text-xs font-bold text-blue-600 hover:underline">Edit</button><button className="text-xs font-bold text-red-500 hover:underline">Delete</button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in max-w-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4">{t.settings}</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label><input type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label><input type="email" disabled defaultValue={user.email} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none text-gray-400 cursor-not-allowed" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label><input type="tel" defaultValue={fullUserInfo?.phone || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50" /></div>
                <div className="pt-4 border-t border-gray-100"><h3 className="font-bold text-sm mb-4">Security</h3></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">New Password</label><input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2A900]/50" /></div>
                <button className="w-full bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition mt-6">Save Changes</button>
              </form>
            </div>
          )}

          {/* TAB 5: SUPPORT */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
              <h2 className="text-xl font-black text-gray-900 mb-6">{t.support}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a href="https://wa.me/255700000000" target="_blank" className="flex items-center gap-4 bg-green-50 p-5 rounded-xl border border-green-100 hover:shadow-md transition">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl"><FiMessageCircle /></div>
                  <div><h4 className="font-black text-green-900">WhatsApp Support</h4><p className="text-xs text-green-700">Chat with us live</p></div>
                </a>
                <a href="mailto:support@jtex.co.tz" className="flex items-center gap-4 bg-blue-50 p-5 rounded-xl border border-blue-100 hover:shadow-md transition">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl"><FiMail /></div>
                  <div><h4 className="font-black text-blue-900">Email Us</h4><p className="text-xs text-blue-700">support@jtex.co.tz</p></div>
                </a>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <FiHelpCircle className="text-4xl text-gray-300 mx-auto mb-3" />
                <h4 className="font-black text-gray-900 mb-2">Visit our Help Center</h4>
                <p className="text-sm text-gray-500 mb-4">Find answers to common questions about delivery, returns, and payments.</p>
                <button className="bg-white border border-gray-200 font-bold px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 text-sm">Read FAQs</button>
              </div>
            </div>
          )}

          {/* TAB 6: WISHLIST (ZILIZOPENDWA) */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4"><FiHeart className="text-3xl text-red-500" /></div>
              <h2 className="text-xl font-black text-gray-900 mb-2">No Saved Items</h2>
              <p className="text-sm text-gray-500 mb-6">Items you save by clicking the heart icon will appear here.</p>
              <button onClick={() => router.push('/')} className="bg-[#0F172A] text-white font-bold py-3 px-8 rounded-xl text-sm hover:bg-gray-800 transition">Explore Products</button>
            </div>
          )}

        </section>
      </main>

      <Footer />

      {/* MODAL YA RISITI (RECEIPT) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-fade-in border-t-8 border-[#0F172A]">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition z-10"><FiX size={20} /></button>
            
            <div className="p-8 md:p-12 overflow-y-auto print-section bg-white">
              {/* Kichwa cha Risiti */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900">J<span className="text-[#F2A900]">tex</span></h2>
                  <p className="text-xs text-gray-500 font-bold uppercase mt-1">Marketplace & Delivery</p>
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>TIN: 123-456-789</p>
                    <p>Dar es Salaam, Tanzania</p>
                    <p>support@jtex.co.tz | +255 700 000 000</p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:text-right">
                  <h1 className="text-3xl font-black text-gray-200 uppercase tracking-widest mb-2">INVOICE</h1>
                  <p className="text-gray-500 mb-1 text-sm">Invoice No: <span className="font-mono font-bold text-gray-900">INV-{selectedOrder.id.slice(-6).toUpperCase()}</span></p>
                  <p className="text-gray-500 mb-1 text-sm">Date Issued: <span className="font-bold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${
                      selectedOrder.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      STATUS: {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Taarifa za Mteja */}
              <div className="flex flex-col md:flex-row gap-8 mb-8 text-sm">
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 border-b border-gray-100 pb-1">Billed To (Mteja)</p>
                  <p className="font-black text-gray-900 text-lg">{user.name}</p>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  {fullUserInfo?.phone && <p className="text-gray-600">{fullUserInfo.phone}</p>}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 border-b border-gray-100 pb-1">Shipped To (Mahali)</p>
                  <p className="font-bold text-gray-900">{selectedOrder.deliveryRegion}</p>
                  <p className="text-gray-600 mt-1">{selectedOrder.address}</p>
                  <p className="text-xs text-[#F2A900] mt-2 font-bold bg-yellow-50 inline-block px-2 py-1 rounded">Payment Method: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Jedwali la Bidhaa */}
              <div className="mb-8">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold rounded-tl-lg">Description</th>
                      <th className="py-3 px-4 font-bold text-center">Qty</th>
                      <th className="py-3 px-4 font-bold text-right rounded-tr-lg">Amount (TZS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="py-4 px-4 font-medium text-gray-800">{item.product?.name || 'Item'}</td>
                        <td className="py-4 px-4 text-center text-gray-600 bg-gray-50 font-bold">{item.quantity}</td>
                        <td className="py-4 px-4 text-right font-bold text-gray-900">{item.subTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Malipo / Deni */}
              <div className="flex justify-end mb-10">
                <div className="w-full md:w-1/2 space-y-3 text-sm bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between text-gray-600"><span>{t.subtotal}</span><span className="font-bold">TZS {(selectedOrder.totalAmount - selectedOrder.shippingFee).toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600"><span>{t.shipping}</span><span className="font-bold">TZS {selectedOrder.shippingFee.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xl font-black text-[#0F172A] border-t border-gray-300 pt-3 mt-3">
                    <span>{t.grandTotal}</span><span>TZS {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  {selectedOrder.upfrontPayment > 0 && (
                    <div className="bg-green-100 p-3 rounded-lg border border-green-200 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <FiCheckCircle />
                        <span className="text-[10px] font-black uppercase">{t.upfrontPaid}</span>
                      </div>
                      <span className="font-black text-green-800">TZS {selectedOrder.upfrontPayment.toLocaleString()}</span>
                    </div>
                  )}
                  {/* Deni lililobaki */}
                  {selectedOrder.upfrontPayment > 0 && selectedOrder.totalAmount > selectedOrder.upfrontPayment && (
                     <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-between mt-2">
                       <span className="text-[10px] font-black uppercase text-red-600">Remaining Balance</span>
                       <span className="font-black text-red-600">TZS {(selectedOrder.totalAmount - selectedOrder.upfrontPayment).toLocaleString()}</span>
                     </div>
                  )}
                </div>
              </div>

              {/* Vigezo na Masharti */}
              <div className="border-t-2 border-dashed border-gray-200 pt-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <h5 className="font-black text-gray-900 text-xs uppercase mb-3">Terms & Conditions (Vigezo & Masharti)</h5>
                  <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1.5 font-medium leading-relaxed">
                    <li>Bidhaa zilizofunguliwa, kutumika, au kuharibiwa kimakosa haziwezi kurudishwa.</li>
                    <li>Mteja ana siku 7 za kurudisha bidhaa endapo ina matatizo ya kiwandani.</li>
                    <li>Kianzio (Upfront payment) hakirudishwi iwapo mteja atakataa kupokea mzigo.</li>
                  </ul>
                </div>
                <div className="w-48 text-center flex flex-col items-center justify-end">
                  <div className="w-32 h-32 border-4 border-red-500/20 rounded-full flex items-center justify-center transform -rotate-12 mb-2">
                    <span className="text-red-500/40 font-black text-xl tracking-widest uppercase">Approved</span>
                  </div>
                  <div className="w-full h-px bg-gray-400 mt-2"></div>
                  <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>

              {/* Kitufe cha Download */}
              <div className="mt-8 flex justify-end print:hidden">
                <button onClick={() => window.print()} className="bg-[#0F172A] text-white font-bold py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-800 shadow-md transition">
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