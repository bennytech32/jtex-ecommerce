'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiTruck, FiShield, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [region, setRegion] = useState('Dar es Salaam');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    else {
      // Kama hajalogin, mrudishe login
      router.push('/login');
    }
  }, [router]);

  // Logiki ya Usafirishaji na COD (Kulingana na Document yako)
  const shippingFee = region === 'Dar es Salaam' ? 0 : 10000; 
  const grandTotal = cartTotal + shippingFee;
  // Kianzio (Upfront Payment) ni 20% ya jumla kama mzigo unaenda nje ya Dar
  const upfrontPayment = region === 'Dar es Salaam' ? 0 : grandTotal * 0.2;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsLoading(true);
    setError('');

    const items = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      subTotal: item.price * item.quantity
    }));

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          deliveryRegion: region,
          address,
          paymentMethod: 'COD',
          shippingFee,
          upfrontPayment,
          items
        })
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => router.push('/'), 3000); // Mrudishe Home
      } else {
        const data = await res.json();
        setError(data.error || 'Imeshindwa kutuma oda.');
      }
    } catch (err) {
      setError('Tatizo la mtandao.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Oda Imefanikiwa!</h2>
          <p className="text-gray-500 text-sm">Asante kwa kununua Jtex. Oda yako imetumwa kwa wauzaji na inashughulikiwa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black text-gray-900 mb-8">Kamilisha Malipo (Checkout)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Fomu ya Usafirishaji */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4"><FiMapPin className="text-[#F2A900]" /> Taarifa za Usafirishaji</h2>
              
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><FiAlertTriangle /> {error}</div>}

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mkoa (Region)</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] text-sm">
                    <option value="Dar es Salaam">Dar es Salaam (Bure)</option>
                    <option value="Mwanza">Mwanza (Tsh 10,000)</option>
                    <option value="Arusha">Arusha (Tsh 10,000)</option>
                    <option value="Dodoma">Dodoma (Tsh 10,000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anwani Kamili (Wilaya, Mtaa)</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mfano: Kinondoni, Mkwajuni" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#F2A900] text-sm" />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-4"><FiShield className="text-green-500" /> Njia ya Malipo (Payment Method)</h2>
              <div className="border border-[#F2A900] bg-[#F2A900]/5 p-4 rounded-xl flex items-start gap-3">
                <input type="radio" checked readOnly className="mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Pay On Delivery (COD)</p>
                  <p className="text-xs text-gray-600 mt-1">Lipa mzigo utakapokufikia. Kwa wateja wa mikoani, utatakiwa kulipa kianzio cha 20% kuepuka oda za uongo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risiti na Hesabu (Order Summary) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 border-b pb-4">Risiti Yako</h2>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}
                    </div>
                    <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Jumla ya Bidhaa</span><span>TZS {cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><FiTruck /> Usafirishaji</span>
                  <span>{shippingFee === 0 ? 'BURE' : `TZS ${shippingFee.toLocaleString()}`}</span>
                </div>
                
                <div className="flex justify-between font-black text-lg text-gray-900 pt-2 border-t border-gray-100">
                  <span>Jumla Kuu</span><span>TZS {grandTotal.toLocaleString()}</span>
                </div>

                {upfrontPayment > 0 && (
                  <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                    <div>
                      <span className="block text-xs font-bold text-red-600 uppercase">Kianzio Unachotakiwa Kulipa (20%)</span>
                      <span className="text-[10px] text-red-500">Ili mzigo usafirishwe</span>
                    </div>
                    <span className="font-black text-red-600 text-lg">TZS {upfrontPayment.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isLoading || cart.length === 0}
                className="w-full mt-6 bg-[#0F172A] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition"
              >
                {isLoading ? 'Inatuma...' : 'Thibitisha Oda Yangu'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}