'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import { 
  FiUser, FiPackage, FiFileText, FiStar, FiCreditCard, FiX, 
  FiDownload, FiLogOut, FiCheckCircle, FiPhone, FiMail,
  FiShoppingCart, FiSearch, FiGlobe, FiTrash2, FiChevronRight, FiMapPin, FiShield, FiTruck, FiSmartphone
} from 'react-icons/fi';

import TopTicker from '../components/navigation/TopTicker';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';

const translations = {
  en: {
    profile: "My Profile",
    userInfo: "User Information",
    crmStats: "Account Stats",
    loyalty: "Loyalty Points",
    debt: "Current Debt",
    logout: "Log Out",
    myOrders: "Order History",
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
    deliveryFee: "Shipping Fee", // KOSA LILILOREKEBISHWA HAPA
    grandTotal: "Grand Total",
    upfrontPaid: "Upfront Paid",
    items: "Items Purchased",
    cart: "Cart Review",
    location: "Location",
    payment: "Payment",
    emptyCart: "Your cart is empty.",
    proceedLocation: "Proceed to Location",
    proceedPayment: "Proceed to Payment",
    confirmOrder: "Confirm & Place Order",
    successMsg: "Order placed successfully! We've sent an SMS and Email to your phone.",
  },
  sw: {
    profile: "Profaili Yangu",
    userInfo: "Taarifa Zako",
    crmStats: "Hali ya Akaunti",
    loyalty: "Pointi za Uaminifu",
    debt: "Deni Lako",
    logout: "Ondoka (Log Out)",
    myOrders: "Historia ya Manunuzi",
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
    deliveryFee: "Gharama ya Usafiri", // KOSA LILILOREKEBISHWA HAPA
    grandTotal: "Jumla Kuu",
    upfrontPaid: "Kianzio Kimelipwa",
    items: "Bidhaa Ulizonunua",
    cart: "Kikapu Chako",
    location: "Mahali",
    payment: "Malipo",
    emptyCart: "Kikapu chako kipo wazi.",
    proceedLocation: "Endelea na Mahali",
    proceedPayment: "Endelea na Malipo",
    confirmOrder: "Thibitisha na Lipia",
    successMsg: "Oda imekamilika! Tumekutumia SMS na Barua Pepe (Email).",
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullUserInfo, setFullUserInfo] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const t = translations[lang];

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1); 
  const [region, setRegion] = useState('Dar es Salaam');
  const [address, setAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        
        const ordersRes = await fetch(`${apiUrl}/api/orders`);
        const allOrders = await ordersRes.json();
        const myOrders = allOrders.filter((o: any) => o.userId === parsedUser.id);
        setOrders(myOrders);

        const usersRes = await fetch(`${apiUrl}/api/users`);
        const allUsers = await usersRes.json();
        const myFullInfo = allUsers.find((u: any) => u.id === parsedUser.id);
        setFullUserInfo(myFullInfo);
      } catch (error) {
        console.error("Kosa kuvuta data:", error);
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
  
  const openCartWorkflow = () => { setWorkflowStep(1); setIsWorkflowOpen(true); };

  const shippingFee = region === 'Dar es Salaam' ? 0 : 10000;
  const grandTotal = cartTotal + shippingFee;
  const upfrontPayment = region === 'Dar es Salaam' ? 0 : grandTotal * 0.2;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); setCheckoutLoading(true);
    const checkoutItems = cart.map(item => ({ productId: item.id, quantity: item.quantity, unitPrice: item.price, subTotal: item.price * item.quantity }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, deliveryRegion: region, address, paymentMethod: 'COD', shippingFee, upfrontPayment, items: checkoutItems })
      });
      if (res.ok) { setWorkflowStep(4); clearCart(); }
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="font-bold text-gray-500 animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased flex flex-col">
      <TopTicker />
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          <span onClick={() => router.push('/')} className="text-2xl font-black text-gray-900 tracking-tight cursor-pointer">
            J<span className="text-[#F2A900]">tex</span>
          </span>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full flex border border-[#F2A900] rounded-full overflow-hidden">
              <select className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs outline-none hidden lg:block"><option>All</option></select>
              <input type="text" placeholder="Search for products..." className="flex-1 px-4 py-2.5 text-sm outline-none" />
              <button className="bg-[#F2A900] px-6 flex items-center justify-center text-[#0F172A]"><FiSearch /></button>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={toggleLanguage} className="hidden lg:flex items-center gap-1 text-xs font-bold border border-gray-200 px-2 py-1 rounded">
              <span className="text-[#F2A900]">TZS</span> | {lang === 'en' ? 'EN' : 'SW'}
            </button>
            <button onClick={openCartWorkflow} className="relative text-gray-700 hover:text-[#F2A900] transition flex flex-col items-center">
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
              </div>
              <span className="text-[10px] mt-0.5 font-bold">Cart</span>
            </button>
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer">
              <div className="w-6 h-6 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
              <span className="text-xs font-bold hidden md:block">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <NavbarLinks />

      <main className="w-full max-w-[1920px] mx-auto p-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row gap-8 flex-1 mt-4">
        
        <div className="w-full md:w-[320px] flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-[#0F172A]"></div>
            <div className="relative w-24 h-24 bg-white border-4 border-white text-[#0F172A] rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-md z-10 mt-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
            <p className="text-xs font-bold text-[#F2A900] uppercase tracking-wider mb-6">Customer</p>
            <div className="space-y-3 mb-8 text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
               <div className="flex items-center gap-3"><FiMail className="text-gray-400" /> {user.email}</div>
               {fullUserInfo?.phone && <div className="flex items-center gap-3"><FiPhone className="text-gray-400" /> {fullUserInfo.phone}</div>}
            </div>
            <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition duration-300">
              <FiLogOut /> {t.logout}
            </button>
          </div>

          {fullUserInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-5 border-b border-gray-100 pb-3">{t.crmStats}</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center"><FiStar className="text-[#F2A900] text-lg" /></div>
                    <span className="text-sm font-bold">{t.loyalty}</span>
                  </div>
                  <span className="font-black text-xl text-[#F2A900]">{fullUserInfo.loyaltyPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><FiCreditCard className="text-red-500 text-lg" /></div>
                    <span className="text-sm font-bold">{t.debt}</span>
                  </div>
                  <span className={`font-black ${fullUserInfo.debtAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    TZS {fullUserInfo.debtAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><FiPackage className="text-xl" /></div>
            <h2 className="text-2xl font-black text-gray-900">{t.myOrders}</h2>
          </div>

          <div className="flex-1 overflow-x-auto bg-gray-50/50">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-500">
                <FiPackage className="text-6xl mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-bold text-gray-800">{t.noOrders}</p>
                <p className="text-sm mt-2">{t.noOrdersDesc}</p>
                <button onClick={() => router.push('/shop')} className="mt-6 bg-[#0F172A] text-white font-bold py-3 px-8 rounded-xl text-sm transition hover:bg-gray-800">
                  {lang === 'en' ? 'Start Shopping' : 'Anza Kununua'}
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                  <tr>
                    <th className="px-6 py-5">{t.orderId}</th>
                    <th className="px-6 py-5">{t.date}</th>
                    <th className="px-6 py-5">{t.status}</th>
                    <th className="px-6 py-5">{t.total}</th>
                    <th className="px-6 py-5 text-right">{t.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-white transition bg-transparent">
                      <td className="px-6 py-5 font-mono text-xs text-gray-500 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-5 font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border border-green-200' : 
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border border-red-200' : 
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-black text-gray-900 text-base">TZS {order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 text-[#0F172A] font-bold bg-gray-100 hover:bg-[#F2A900] px-4 py-2 rounded-xl transition text-xs"
                        >
                          <FiFileText /> {t.receipt}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-fade-in border-t-8 border-[#0F172A]">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition"><FiX size={20} /></button>
            
            <div className="p-8 md:p-12 overflow-y-auto print-section bg-white">
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
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <h5 className="font-black text-gray-900 text-xs uppercase mb-3">Terms & Conditions (Vigezo & Masharti)</h5>
                  <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1.5 font-medium leading-relaxed">
                    <li>Bidhaa zilizofunguliwa, kutumika, au kuharibiwa kimakosa haziwezi kurudishwa.</li>
                    <li>Mteja ana siku 7 za kurudisha bidhaa endapo ina matatizo ya kiwandani.</li>
                    <li>Kianzio (Upfront payment) hakirudishwi iwapo mteja atakataa kupokea mzigo.</li>
                    <li>Tafadhali hifadhi risiti hii kama uthibitisho wa malipo.</li>
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

              <div className="mt-8 flex justify-end print:hidden">
                <button onClick={() => window.print()} className="bg-[#0F172A] text-white font-bold py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-800 shadow-md transition">
                  <FiDownload /> {t.download}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {isWorkflowOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col animate-fade-in">
            <button onClick={() => setIsWorkflowOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"><FiX size={24} /></button>
            
            <div className="bg-gray-50 border-b border-gray-200 p-6 pt-8 flex items-center justify-between">
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 1 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 1 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>1</div>
                 <span className="text-[10px] font-bold uppercase">{t.cart}</span>
               </div>
               <FiChevronRight className="text-gray-300" />
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 2 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 2 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>2</div>
                 <span className="text-[10px] font-bold uppercase">{t.location}</span>
               </div>
               <FiChevronRight className="text-gray-300" />
               <div className={`flex flex-col items-center flex-1 ${workflowStep >= 3 ? 'text-[#0F172A]' : 'text-gray-300'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${workflowStep >= 3 ? 'bg-[#F2A900] text-black' : 'bg-gray-200'}`}>3</div>
                 <span className="text-[10px] font-bold uppercase">{t.payment}</span>
               </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {workflowStep === 1 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">{t.cart}</h3>
                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-bold">{t.emptyCart}</div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                            {item.imageUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${item.imageUrl}`} className="object-contain w-full h-full p-1" /> : <span className="text-2xl">{item.imageEmoji}</span>}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-black text-[#0F172A] mt-1">TZS {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><FiTrash2 /></button>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Subtotal:</span>
                        <span className="text-2xl font-black text-gray-900">TZS {cartTotal.toLocaleString()}</span>
                      </div>
                      <button onClick={() => setWorkflowStep(2)} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                         {t.proceedLocation} <FiChevronRight />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {workflowStep === 2 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiMapPin className="text-[#F2A900]"/> {t.location}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Region</label>
                      <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#F2A900]">
                        <option value="Dar es Salaam">Dar es Salaam (Free Delivery)</option>
                        <option value="Mwanza">Mwanza (+ TZS 10,000)</option>
                        <option value="Arusha">Arusha (+ TZS 10,000)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Address</label>
                      <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F2A900]" placeholder="Example: Kinondoni, Mkwajuni" />
                    </div>
                    <button onClick={() => setWorkflowStep(3)} disabled={!address} className="w-full bg-[#0F172A] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition">
                       {t.proceedPayment} <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {workflowStep === 3 && (
                <form onSubmit={handlePlaceOrder}>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiShield className="text-green-500"/> {t.payment}</h3>
                  <div className="bg-[#F2A900]/10 border border-[#F2A900] rounded-xl p-4 mb-6">
                     <p className="font-bold text-gray-900 text-sm">Pay On Delivery (COD)</p>
                     <p className="text-xs text-gray-600 mt-1">Pay when you receive the product.</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold">TZS {cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600"><span>{t.deliveryFee}</span><span className="font-bold">TZS {shippingFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3"><span>{t.grandTotal}</span><span>TZS {grandTotal.toLocaleString()}</span></div>
                    {upfrontPayment > 0 && (
                      <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex justify-between items-center mt-4">
                        <span className="block text-xs font-black text-red-600 uppercase">{t.upfrontPaid}</span>
                        <span className="font-black text-red-600 text-lg">TZS {upfrontPayment.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={checkoutLoading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-6 transition hover:bg-green-700 shadow-lg">
                    {checkoutLoading ? 'Processing...' : t.confirmOrder}
                  </button>
                </form>
              )}

              {workflowStep === 4 && (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-7xl text-green-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Order Successful!</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 mb-6 flex items-start gap-3 text-left">
                    <FiSmartphone className="text-blue-600 text-3xl flex-shrink-0" />
                    <p className="text-sm text-blue-800 font-medium">{t.successMsg}</p>
                  </div>
                  <button onClick={() => { setIsWorkflowOpen(false); window.location.reload(); }} className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                    View Invoice in Orders
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}