'use client';

import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiShield, FiAlertCircle } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Mfumo wa kupata API URL ya live mtandaoni
  const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';
    return url.replace(/\/$/, ''); 
  };

  const fetchOrders = async () => {
    try {
      setFetchError(null);
      const url = getApiUrl();
      // 'cache: no-store' inalazimisha kuvuta oda mpya zilizochongwa sasa hivi bila kutumia cache ya zamani
      const res = await fetch(`${url}/api/orders`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Kosa la Server (Code ${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const url = getApiUrl();
      const res = await fetch(`${url}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert("Hali ya oda imebadilishwa kikamilifu! 🔥");
        fetchOrders(); // Refresh table baada ya kubadili status
      } else {
        alert("Imeshindwa kubadili hali ya oda.");
      }
    } catch (error) {
      console.error('Kosa kubadili status:', error);
      alert("Tatizo la mtandao limetokea.");
    }
  };

  // Kupata rangi ya Status beji
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-700 border border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Oda & Usafirishaji</h1>
          <p className="text-sm text-gray-500">Dhibiti oda za wateja, kianzio (Upfront COD), na usafirishaji wa mikoani.</p>
        </div>
      </div>

      {/* Kadi za Takwimu za Haraka */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><FiClock size={20} /></div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Zinazosubiri</p><p className="text-xl font-black text-gray-900">{orders.filter(o => o.status === 'PENDING').length}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><FiTruck size={20} /></div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Njiani</p><p className="text-xl font-black text-gray-900">{orders.filter(o => o.status === 'SHIPPED').length}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><FiCheckCircle size={20} /></div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Zimefika</p><p className="text-xl font-black text-gray-900">{orders.filter(o => o.status === 'DELIVERED').length}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F2A900]/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F2A900]/10 flex items-center justify-center text-[#F2A900]"><FiShield size={20} /></div>
          <div><p className="text-xs text-gray-500 font-bold uppercase">Ulinzi wa COD</p><p className="text-xs font-bold text-gray-900 mt-1">Kianzio Kinahitajika</p></div>
        </div>
      </div>

      {/* Jedwali la Oda */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><FiShoppingCart /> Orodha ya Oda Zote</h2>
          <span className="text-xs font-bold bg-gray-200 px-2.5 py-1 rounded-full text-gray-600">{orders.length} Total</span>
        </div>

        {fetchError && (
           <div className="p-6 bg-red-50 text-red-600 text-center flex flex-col items-center justify-center border-b border-gray-100">
              <FiAlertCircle className="text-3xl mb-2" />
              <p className="font-bold">Kuna tatizo la mtandao kuvuta data za oda</p>
              <p className="text-xs mt-1">{fetchError}</p>
              <button onClick={fetchOrders} className="mt-3 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Jaribu Tena</button>
           </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse font-bold tracking-wider">Inavuta Oda Kutoka Server ya Live...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-black tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">Oda ID</th>
                  <th className="px-6 py-4">Mteja & Mahali</th>
                  <th className="px-6 py-4">Malipo & Kianzio</th>
                  <th className="px-6 py-4">Jumla (Tsh)</th>
                  <th className="px-6 py-4">Hali (Status)</th>
                  <th className="px-6 py-4">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-base">{order.user?.name || 'Mteja Asiyejulikana'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium"><FiMapPin className="text-gray-400" /> {order.deliveryRegion} - {order.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 border px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-700">{order.paymentMethod}</span>
                      {order.upfrontPayment > 0 && (
                        <p className="text-[11px] text-green-600 font-black mt-1.5">Paid Upfront: TZS {order.upfrontPayment.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-base">
                      TZS {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-white border-2 border-gray-200 text-xs font-black uppercase tracking-wider rounded-xl px-3 py-2 outline-none focus:border-[#F2A900] cursor-pointer transition shadow-sm"
                      >
                        <option value="PENDING">Pending (Subiri)</option>
                        <option value="PROCESSING">Processing (Inaundwa)</option>
                        <option value="SHIPPED">Shipped (Njiani)</option>
                        <option value="DELIVERED">Delivered (Imefika)</option>
                        <option value="CANCELLED">Cancelled (Ghairi)</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && !fetchError && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <FiShoppingCart className="mx-auto text-5xl text-gray-200 mb-3 animate-bounce" />
                      <p className="text-gray-500 font-black text-lg">Hakuna oda yoyote iliyofanyika bado.</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Wateja wakianza kununua bidhaa kule kwenye duka la mbele, data zote za manunuzi zitamwagika hapa papo hapo.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}