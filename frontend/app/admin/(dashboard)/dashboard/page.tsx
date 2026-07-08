'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  FiBox, FiUsers, FiDollarSign, FiAlertCircle, FiGlobe, 
  FiPlusCircle, FiMonitor, FiTruck, FiTrendingUp, FiCreditCard,
  FiCheckCircle, FiPhone, FiTag
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const translations = {
  en: {
    overview: "Overview",
    overviewDesc: "Welcome to the Jtex management dashboard.",
    inventoryValue: "Inventory Value",
    totalProducts: "Total Products",
    lowStock: "Low/Out of Stock",
    totalUsers: "Total Users",
    totalRevenue: "Total Revenue",
    pendingOrders: "Pending Orders",
    salesTrend: "6-Month Sales Trend",
    revenueCompare: "Revenue Comparison",
    recentOrders: "Recent Orders",
    viewAll: "View All",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    amount: "Amount",
    status: "Status",
    noOrders: "No orders at the moment.",
    sales: "Sales",
    revenue: "Revenue",
    switchLang: "SWAHILI",
    quickActions: "Quick Actions",
    openPos: "Open POS System",
    addProduct: "Add New Product",
    manageOrders: "Manage Orders",
    tabOverview: "Dashboard",
    tabOrders: "Order Management",
    tabCrm: "CRM & Debts",
    tabProducts: "Products & Inventory",
    productsDesc: "Manage stock, SKUs, images, and prices of your products.",
    updateStatus: "Update Status",
    address: "Delivery Address",
    upfront: "Upfront Paid",
    debt: "Remaining Debt",
    phone: "Phone Number",
    loyalty: "Loyalty Points",
    clearDebt: "Clear Debt",
    alertStatusSuccess: "Status updated successfully!",
    alertDebtFeature: "Clear debt feature is coming soon to the backend!",
    alertPosFeature: "POS System interface is coming soon!",
    subOverviewDesc: "Manage, update status, and fulfill customer orders.",
    subCrmDesc: "Manage customer profiles, loyalty points, and track outstanding debts.",
    noCustomers: "No customers found.",
    unknownCustomer: "Unknown Customer",
    optPending: "PENDING",
    optShipped: "SHIPPED",
    optDelivered: "DELIVERED",
    optCancelled: "CANCELLED",
    prodName: "Product Name",
    prodSku: "SKU",
    prodPrice: "Price",
    prodStock: "Stock",
    prodCategory: "Category",
    noProducts: "No products available in inventory.",
    catElectronics: "Electronics",
    catFashion: "Fashion",
    catShoes: "Shoes",
    catPhones: "Phones",
    catComputers: "Computers",
    catBeauty: "Beauty"
  },
  sw: {
    overview: "Muhtasari",
    overviewDesc: "Karibu kwenye jopo la usimamizi la Jtex.",
    inventoryValue: "Thamani ya Ghalani",
    totalProducts: "Jumla ya Bidhaa",
    lowStock: "Zinazoisha / Kwisha",
    totalUsers: "Jumla ya Wateja",
    totalRevenue: "Jumla ya Mapato",
    pendingOrders: "Oda Mpya (Pending)",
    salesTrend: "Mauzo ya Miezi 6",
    revenueCompare: "Ulinganisho wa Mapato",
    recentOrders: "Oda za Hivi Karibuni",
    viewAll: "Tazama Zote",
    orderId: "Namba ya Oda",
    customer: "Mteja",
    date: "Tarehe",
    amount: "Kiasi",
    status: "Hali",
    noOrders: "Hakuna oda kwa sasa.",
    sales: "Mauzo",
    revenue: "Mapato",
    switchLang: "ENGLISH",
    quickActions: "Vitendo vya Haraka",
    openPos: "Fungua POS (Uza)",
    addProduct: "Weka Bidhaa Mpya",
    manageOrders: "Shughulikia Oda",
    tabOverview: "Dashibodi",
    tabOrders: "Usimamizi wa Oda",
    tabCrm: "Wateja & Madeni",
    tabProducts: "Bidhaa & Inventory",
    productsDesc: "Dhibiti stock, SKU, picha na bei za bidhaa zako.",
    updateStatus: "Badili Hali",
    address: "Anwani ya Mzigo",
    upfront: "Kianzio (Imelipwa)",
    debt: "Deni Lililobaki",
    phone: "Namba ya Simu",
    loyalty: "Pointi za Uaminifu",
    clearDebt: "Futa Deni",
    alertStatusSuccess: "Hali ya oda imebadilishwa kikamilifu!",
    alertDebtFeature: "Mfumo wa kufuta deni backend utawaka hivi punde!",
    alertPosFeature: "Mfumo wa mauzo wa POS unakuja hivi punde!",
    subOverviewDesc: "Simamia, badili hali, na kamilisha oda za wateja.",
    subCrmDesc: "Kagua wasifu wa wateja, pointi za uaminifu, na fuatilia madeni yao.",
    noCustomers: "Hakuna wateja waliopatikana.",
    unknownCustomer: "Mteja Asiyejulikana",
    optPending: "PENDING (Subiri)",
    optShipped: "SHIPPED (Njiani)",
    optDelivered: "DELIVERED (Imefika)",
    optCancelled: "CANCELLED (Ghairi)",
    prodName: "Jina la Bidhaa",
    prodSku: "SKU",
    prodPrice: "Bei",
    prodStock: "Stoki",
    prodCategory: "Kategoria",
    noProducts: "Hakuna bidhaa ghalani kwa sasa.",
    catElectronics: "Elektroniki",
    catFashion: "Nguo",
    catShoes: "Viatu",
    catPhones: "Simu",
    catComputers: "Kompyuta",
    catBeauty: "Urembo"
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'crm' | 'products'>('overview');
  
  const [stats, setStats] = useState({
    totalProducts: 0, lowStock: 0, outOfStock: 0, inventoryValue: 0, totalUsers: 0
  });
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [calculatedStats, setCalculatedStats] = useState({ revenue: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  const salesData = [
    { name: 'Jan', mauzo: 4000000 },
    { name: 'Feb', mauzo: 3000000 },
    { name: 'Mar', mauzo: 5000000 },
    { name: 'Apr', mauzo: 4500000 },
    { name: 'Mei', mauzo: 6000000 },
    { name: 'Jun', mauzo: 8000000 },
  ];

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  // FIX: Imeondolewa Guard ya "Token" hapa kwasababu layout ishaifanya.
  // Tunaita data zetu moja kwa moja.
  useEffect(() => {
    fetchData();
  }, []);

  const getTranslatedCategoryName = (categoryStr: string) => {
    if (!categoryStr) return 'N/A';
    const cat = categoryStr.toLowerCase();
    if (cat.includes('electronics') || cat.includes('elektroniki')) return t.catElectronics;
    if (cat.includes('fashion') || cat.includes('nguo')) return t.catFashion;
    if (cat.includes('shoes') || cat.includes('viatu')) return t.catShoes;
    if (cat.includes('phones') || cat.includes('simu')) return t.catPhones;
    if (cat.includes('computers') || cat.includes('kompyuta')) return t.catComputers;
    if (cat.includes('beauty') || cat.includes('urembo')) return t.catBeauty;
    return categoryStr;
  };

  const fetchData = async () => {
    try {
      const apiUrl = getApiUrl();
      
      const statsRes = await fetch(`${apiUrl}/api/dashboard`, { cache: 'no-store' });
      if (statsRes.ok) setStats(await statsRes.json());

      const ordersRes = await fetch(`${apiUrl}/api/orders`, { cache: 'no-store' });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setAllOrders(ordersData);
        let rev = 0, pend = 0;
        ordersData.forEach((o: any) => {
          if(o.status !== 'CANCELLED') rev += o.totalAmount;
          if(o.status === 'PENDING') pend += 1;
        });
        setCalculatedStats({ revenue: rev, pending: pend });
      }

      const usersRes = await fetch(`${apiUrl}/api/users`, { cache: 'no-store' });
      if (usersRes.ok) setAllUsers(await usersRes.json());

      const productsRes = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
      if (productsRes.ok) setRealProducts(await productsRes.json());

    } catch (error) {
      console.error("Kosa kuvuta data za admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if(res.ok) {
        alert(t.alertStatusSuccess);
        fetchData();
      }
    } catch (error) {
      alert("Error updating order status.");
    }
  };


  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">Loading Admin System...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{t.overview}</h2>
          <p className="text-sm text-gray-500 font-medium">{t.overviewDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-[#0F172A] shadow-sm hover:bg-gray-50 transition"
          >
            <FiGlobe /> {t.switchLang}
          </button>
        </div>
      </header>

      {/* ADMIN TABS NAVIGATION */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FiTrendingUp /> {t.tabOverview}
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FiBox /> {t.tabProducts}
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FiTruck /> {t.tabOrders} 
          {calculatedStats.pending > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{calculatedStats.pending}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('crm')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'crm' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FiUsers /> {t.tabCrm}
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* QUICK ACTIONS */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t.quickActions}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => alert(t.alertPosFeature)} className="flex items-center gap-4 bg-gradient-to-r from-[#0F172A] to-gray-800 p-4 rounded-2xl text-white hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl"><FiMonitor /></div>
                <div className="text-left"><p className="font-black text-lg">{t.openPos}</p><p className="text-[10px] text-gray-300">Point of Sale System</p></div>
              </button>
              <button onClick={() => setActiveTab('products')} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-2xl text-[#0F172A] hover:border-amber-500 hover:shadow-md transition">
                <div className="w-12 h-12 bg-yellow-50 text-amber-500 rounded-full flex items-center justify-center text-2xl"><FiPlusCircle /></div>
                <div className="text-left"><p className="font-bold text-sm">{t.addProduct}</p><p className="text-[10px] text-gray-500">Update Inventory</p></div>
              </button>
              <button onClick={() => setActiveTab('orders')} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-2xl text-[#0F172A] hover:border-blue-500 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl"><FiTruck /></div>
                <div className="text-left"><p className="font-bold text-sm">{t.manageOrders}</p><p className="text-[10px] text-gray-500">Ship & Deliver</p></div>
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl"><FiTrendingUp /></div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{t.totalRevenue}</p>
                <p className="text-xl sm:text-2xl font-black text-gray-900">TZS {calculatedStats.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl"><FiAlertCircle /></div>
              <div className="z-10">
                <p className="text-xs font-bold text-red-400 uppercase">{t.pendingOrders}</p>
                <p className="text-xl sm:text-2xl font-black text-red-600">{calculatedStats.pending}</p>
              </div>
              {calculatedStats.pending > 0 && <div className="absolute right-0 top-0 w-2 h-full bg-red-500 animate-pulse"></div>}
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl"><FiDollarSign /></div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{t.inventoryValue}</p>
                <p className="text-lg font-black text-gray-900">TZS {stats.inventoryValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl"><FiUsers /></div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{t.totalUsers}</p>
                <p className="text-xl sm:text-2xl font-black text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">{t.salesTrend}</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip cursor={{stroke: '#F3F4F6', strokeWidth: 2}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`TZS ${value.toLocaleString()}`, t.sales]} />
                    <Line type="monotone" dataKey="mauzo" stroke="#F2A900" strokeWidth={4} dot={{r: 4, fill: '#0F172A', strokeWidth: 2}} activeDot={{r: 6, fill: '#F2A900'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider">{t.revenueCompare}</h3>
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={salesData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                     <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`TZS ${value.toLocaleString()}`, t.revenue]} />
                     <Bar dataKey="mauzo" fill="#0F172A" radius={[6, 6, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in border border-gray-100 min-h-[500px]">
          <div className="p-6 border-b border-gray-100 bg-amber-50/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiBox className="text-amber-500"/> {t.tabProducts}</h3>
              <p className="text-sm text-gray-500 mt-1">{t.productsDesc}</p>
            </div>
            <button onClick={() => router.push('/admin/products')} className="bg-[#0F172A] text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-gray-800 transition shadow-sm">
              <FiPlusCircle /> {t.addProduct}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">{t.prodName}</th>
                  <th className="px-6 py-4">{t.prodSku}</th>
                  <th className="px-6 py-4">{t.prodCategory}</th>
                  <th className="px-6 py-4">{t.prodPrice}</th>
                  <th className="px-6 py-4 text-center">{t.prodStock}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {realProducts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">{t.noProducts}</td></tr>
                ) : (
                  realProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.imageEmoji || '📦'}</span>
                          <p className="font-bold text-gray-900 line-clamp-1 max-w-xs">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">
                        {product.sku || `SKU-${product.id.slice(-4).toUpperCase()}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded-full w-max">
                          <FiTag className="text-gray-400 text-[10px]" />
                          {getTranslatedCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-[#0F172A]">
                        TZS {product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded font-black text-xs ${
                          (product.stock || 0) <= 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in border border-gray-100 min-h-[500px]">
          <div className="p-6 border-b border-gray-100 bg-blue-50/10">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiTruck className="text-blue-600"/> {t.tabOrders}</h3>
            <p className="text-sm text-gray-500 mt-1">{t.subOverviewDesc}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">{t.orderId} / {t.date}</th>
                  <th className="px-6 py-4">{t.customer} & {t.address}</th>
                  <th className="px-6 py-4">Finance ({t.upfront} / {t.debt})</th>
                  <th className="px-6 py-4 text-center">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allOrders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">{t.noOrders}</td></tr>
                ) : (
                  allOrders.map((order) => {
                    const debtAmount = order.totalAmount - (order.upfrontPayment || 0);
                    return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-5">
                        <p className="font-mono font-black text-gray-900 text-base">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900">{order.user?.name || t.unknownCustomer}</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-xs">{order.address}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900">Total: TZS {order.totalAmount.toLocaleString()}</p>
                          {order.upfrontPayment > 0 && <p className="text-xs font-bold text-green-600">{t.upfront}: TZS {order.upfrontPayment.toLocaleString()}</p>}
                          {debtAmount > 0 && <p className="text-xs font-bold text-red-500">{t.debt}: TZS {debtAmount.toLocaleString()}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider outline-none cursor-pointer border-2 transition ${
                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200 focus:border-green-500' :
                            order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:border-blue-500' :
                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200 focus:border-red-500' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200 focus:border-yellow-500'
                          }`}
                        >
                          <option value="PENDING">{t.optPending}</option>
                          <option value="SHIPPED">{t.optShipped}</option>
                          <option value="DELIVERED">{t.optDelivered}</option>
                          <option value="CANCELLED">{t.optCancelled}</option>
                        </select>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CRM & DEBTS */}
      {activeTab === 'crm' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in border border-gray-100 min-h-[500px]">
          <div className="p-6 border-b border-gray-100 bg-purple-50/10">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><FiUsers className="text-purple-600"/> {t.tabCrm}</h3>
            <p className="text-sm text-gray-500 mt-1">{t.subCrmDesc}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">{t.customer}</th>
                  <th className="px-6 py-4">{t.phone} & Email</th>
                  <th className="px-6 py-4 text-center">{t.loyalty}</th>
                  <th className="px-6 py-4 text-right">{t.debt} (TZS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">{t.noCustomers}</td></tr>
                ) : (
                  allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-black text-sm shadow-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-gray-900 text-base">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-700 flex items-center gap-2"><FiPhone className="text-gray-400"/> {u.phone || 'N/A'}</p>
                        <p className="text-gray-500 text-xs mt-1">{u.email}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-yellow-50 text-[#F2A900] font-black px-3 py-1 rounded-full text-xs border border-yellow-200">
                          {u.loyaltyPoints || 0} PTS
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {u.debtAmount > 0 ? (
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-black text-red-600 text-lg">TZS {u.debtAmount.toLocaleString()}</span>
                            <button onClick={() => alert(t.alertDebtFeature)} className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-600 hover:text-white transition">
                              {t.clearDebt}
                            </button>
                          </div>
                        ) : (
                          <span className="font-black text-gray-400">0</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}