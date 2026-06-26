'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiCheck, FiCopy, FiMapPin, FiPackage, FiTruck, 
  FiCalendar, FiShield, FiStar, FiShoppingCart, FiArrowLeft,
  FiClock, FiCheckCircle, FiChevronRight, FiBox
} from 'react-icons/fi';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [popProducts, setPopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (!savedUser) {
      router.push('/');
      return;
    }
    const user = JSON.parse(savedUser);

    const fetchData = async () => {
      try {
        // 1. Vuta oda halisi ya mwisho ya huyu user
        const ordersRes = await fetch(`${getApiUrl()}/api/orders`, { cache: 'no-store' });
        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          const myOrders = allOrders.filter((o: any) => o.userId === user.id);
          if (myOrders.length > 0) {
            // Panga ili oda mpya zaidi iwe ya kwanza
            myOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setLatestOrder(myOrders[0]);
          }
        }

        // 2. Vuta bidhaa halisi kwa ajili ya "Explore Popular Products"
        const productsRes = await fetch(`${getApiUrl()}/api/products`);
        if (productsRes.ok) {
          const allProducts = await productsRes.json();
          setPopProducts(allProducts.slice(0, 4)); // Chukua bidhaa 4 za kwanza
        }
      } catch (error) {
        console.error("Error fetching success page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#F2A900] border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-bold text-gray-500">Inapakia taarifa za oda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Mobile Header */}
      <header className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm md:hidden">
        <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} className="text-gray-800" />
        </button>
        <span className="text-xs font-bold text-gray-800">Order Success</span>
      </header>

      <main className="max-w-6xl mx-auto md:pt-10 px-4 pt-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          
          {/* Success Banner */}
          <div className="bg-green-50/50 border border-green-100 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-6 border-8 border-green-100">
              <FiCheck size={48} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Success!</h1>
            <p className="text-gray-600 font-medium mb-6 max-w-xs">Thank you for shopping with JTex.<br/>Your order has been placed successfully.</p>
            
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <span className="text-sm font-bold text-gray-800">
                Order ID: {latestOrder ? `JTX-${latestOrder.id.slice(-6).toUpperCase()}` : 'N/A'}
              </span>
              <button className="text-gray-400 hover:text-gray-800" onClick={() => latestOrder && navigator.clipboard.writeText(latestOrder.id)}><FiCopy/></button>
            </div>
          </div>

          {/* Tracker Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><FiClock size={20}/></div>
                <div>
                  <h3 className="font-bold text-sm text-green-700">Order Status: {latestOrder?.status || 'RECEIVED'}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">We've received your order and it is being processed.</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-gray-500 justify-end mb-1"><FiCalendar size={14}/><span className="text-[10px] sm:text-xs font-bold uppercase">Estimated Delivery</span></div>
                <p className="font-black text-sm sm:text-base text-green-700">Within 1-3 Days</p>
              </div>
            </div>

            {/* Stepper dynamic state logic */}
            <div className="flex items-center justify-between relative mb-10 px-2 sm:px-6">
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md border-4 border-white"><FiCheck size={20}/></div>
                <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Received</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm ${latestOrder?.status !== 'PENDING' ? 'bg-green-500 text-white border-transparent' : 'bg-white border-gray-200 text-gray-400'}`}>{latestOrder?.status !== 'PENDING' ? <FiCheck/> : <FiPackage size={18}/>}</div>
                <span className="text-[10px] font-bold text-gray-400">Processed</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm ${latestOrder?.status === 'SHIPPED' || latestOrder?.status === 'DELIVERED' ? 'bg-green-500 text-white border-transparent' : 'bg-white border-gray-200 text-gray-400'}`}>{latestOrder?.status === 'SHIPPED' || latestOrder?.status === 'DELIVERED' ? <FiCheck/> : <FiTruck size={18}/>}</div>
                <span className="text-[10px] font-bold text-gray-400">Shipped</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm ${latestOrder?.status === 'DELIVERED' ? 'bg-green-500 text-white border-transparent' : 'bg-white border-gray-200 text-gray-400'}`}>{latestOrder?.status === 'DELIVERED' ? <FiCheck/> : <FiMapPin size={18}/>}</div>
                <span className="text-[10px] font-bold text-gray-400">Delivered</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push('/profile')} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"><FiPackage/> View Order Details</button>
              <button onClick={() => router.push('/profile')} className="flex-1 bg-[#F2A900] text-black font-black py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-md text-sm flex items-center justify-center gap-2"><FiMapPin/> Track Order</button>
            </div>
          </div>
        </div>

        {/* Real Dynamic Explore Products */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-black text-gray-900">Explore Popular Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popProducts.map((p: any) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col cursor-pointer hover:border-[#F2A900] transition">
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 p-2">
                  {p.imageUrl ? (
                     <img src={`${getApiUrl()}${p.imageUrl}`} alt={p.name} className="object-contain w-full h-full mix-blend-multiply" />
                  ) : (
                     <span className="text-4xl">{p.imageEmoji || '📦'}</span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-gray-800 mb-1 line-clamp-1">{p.name}</h4>
                <div className="flex items-center gap-2 mb-2 mt-auto">
                  <span className="font-black text-xs">TZS {p.price.toLocaleString()}</span>
                </div>
                <button onClick={() => addToCart(p)} className="w-full bg-[#0A101D] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition"><FiShoppingCart/> Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}