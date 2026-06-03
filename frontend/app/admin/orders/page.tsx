'use client';

import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiShield } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders(); // Refresh table baada ya kubadili status
      }
    } catch (error) {
      console.error('Kosa kubadili status:', error);
    }
  };

  // Kupata rangi ya Status beji
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Oda & Usafirishaji</h1>
          <p className="text-sm text-gray-500">Dhibiti oda za wateja, kianzio (Upfront COD), na usafirishaji wa mikoani.</p>
        </div>
      </div>

      {/* Kadi za Takwimu za Haraka */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><FiShoppingCart /> Orodha ya Oda Zote</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Inavuta Oda...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Oda ID</th>
                  <th className="px-6 py-3">Mteja & Mahali</th>
                  <th className="px-6 py-3">Malipo & Kianzio</th>
                  <th className="px-6 py-3">Jumla (Tsh)</th>
                  <th className="px-6 py-3">Hali (Status)</th>
                  <th className="px-6 py-3">Kitendo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{order.user?.name || 'Mteja Asiyejulikana'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><FiMapPin /> {order.deliveryRegion} - {order.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold">{order.paymentMethod}</span>
                      {order.paymentMethod === 'COD' && order.upfrontPayment > 0 && (
                        <p className="text-[10px] text-green-600 font-bold mt-1">Kianzio: {order.upfrontPayment.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1.5 outline-none focus:border-[#F2A900] cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped (Njiani)</option>
                        <option value="DELIVERED">Delivered (Imefika)</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <FiShoppingCart className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold">Hakuna oda yoyote iliyofanyika bado.</p>
                      <p className="text-xs text-gray-400 mt-1">Wateja wakianza kununua bidhaa kule mbele, zitatokea hapa.</p>
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