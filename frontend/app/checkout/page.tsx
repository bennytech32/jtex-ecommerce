'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiArrowLeft, FiShoppingCart, FiMapPin, FiCreditCard, 
  FiTrash2, FiChevronRight, FiShield, FiCheckCircle, 
  FiTruck, FiBox, FiPhone, FiUser
} from 'react-icons/fi';

// === SHIPPING AND PAYMENT OPTIONS ===
const ALL_SHIPPING_METHODS = [
  { id: 'bodaboda', name: 'Bodaboda', price: 5000, time: '1 - 2 Hours', emoji: '🏍️' },
  { id: 'bus', name: 'Bus', price: 15000, time: '1 - 2 Days', emoji: '🚌' },
  { id: 'aeroplane', name: 'Aeroplane', price: 25000, time: '1 Day', emoji: '✈️' },
  { id: 'boat', name: 'Boat', price: 20000, time: '2 - 3 Days', emoji: '⛴️' }
];

const PAYMENT_METHODS = [
  { id: 'full', name: 'Full Payment', desc: 'Pay full amount now', icon: '💳' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay advance now, rest on delivery', icon: '🚚' },
  { id: 'store', name: 'Pay at Store', desc: 'Pay when you visit Jtex store', icon: '🏪' }
];

// === MIKOA YA TANZANIA ===
const TANZANIA_REGIONS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", 
  "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", 
  "Mtwara", "Mwanza", "Njombe", "Pemba Kaskazini", "Pemba Kusini", "Pwani", 
  "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", 
  "Tanga", "Zanzibar Kaskazini", "Zanzibar Kusini", "Zanzibar Mjini Magharibi"
];

const ISLAND_REGIONS = [
  "Pemba Kaskazini", "Pemba Kusini", "Zanzibar Kaskazini", 
  "Zanzibar Kusini", "Zanzibar Mjini Magharibi"
];

export default function CheckoutSystem() {
  const router = useRouter();
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  
  const getApiUrl = () => 'https://jtex-ecommerce-production.up.railway.app';
  
  // Function ya kufix link za picha
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };
  
  // States
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[1]); // Default COD
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'Tanzania',
    region: 'Dar es Salaam', // Default Region
    address: ''
  });

  // Logiki ya Usafiri kulingana na Mkoa (Region)
  const isDarEsSalaam = formData.region === 'Dar es Salaam';
  const isIsland = ISLAND_REGIONS.includes(formData.region);

  const availableShippingMethods = ALL_SHIPPING_METHODS.filter(method => {
    if (method.id === 'bodaboda') return isDarEsSalaam;
    if (method.id === 'boat') return isIsland;
    if (method.id === 'bus') return !isIsland; // Mabasi hayaendi visiwani
    if (method.id === 'aeroplane') return true; // Ndege zinaenda kote
    return true;
  });

  const [selectedShipping, setSelectedShipping] = useState(availableShippingMethods[0]);

  // Hakikisha usafiri uliopo unabadilika kama mkoa ukibadilika na usafiri ule kutoendelea kuwepo
  useEffect(() => {
    if (!availableShippingMethods.find(m => m.id === selectedShipping.id)) {
      setSelectedShipping(availableShippingMethods[0]);
    }
  }, [formData.region, availableShippingMethods, selectedShipping.id]);

  // Fetch User Info on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.name || '',
          phone: parsedUser.phone || '',
        }));
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  // Mahesabu
  const subtotal = cartTotal || 0; 
  const discount = 0; 
  const deliveryFee = currentStep > 1 && selectedShipping ? selectedShipping.price : 0;
  const totalAmount = subtotal - discount + deliveryFee;
  const advancePayment = selectedPayment.id === 'cod' ? totalAmount * 0.2 : totalAmount;
  const remainingBalance = totalAmount - advancePayment;

  // Handle Proceed to Step 2 (Check Authentication)
  const handleProceedToShipping = () => {
    const savedUser = localStorage.getItem('jtex_user');
    if (!savedUser) {
      alert("Lazima uingie kwenye akaunti yako (Login) ili uweze kuendelea na malipo.");
      router.push('/'); // Mpeleke nyumbani afanye login (au weka path ya login page)
      return;
    }
    if (cart.length === 0) {
      alert("Kikapu chako kipo wazi.");
      return;
    }
    setCurrentStep(2);
  };

  // Header Stepper
  const renderStepper = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 relative px-4">
      <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
      
      {/* Hatua 1 */}
      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep >= 1 ? 'bg-[#F2A900] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
          {currentStep > 1 ? <FiCheckCircle size={20} /> : '1'}
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>My Cart</span>
      </div>

      <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#F2A900]' : 'bg-transparent'}`}></div>

      {/* Hatua 2 */}
      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep >= 2 ? 'bg-[#F2A900] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
          {currentStep > 2 ? <FiCheckCircle size={20} /> : '2'}
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Checkout</span>
      </div>

      <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-[#F2A900]' : 'bg-transparent'}`}></div>

      {/* Hatua 3 */}
      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep >= 3 ? 'bg-[#F2A900] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
          3
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-12">
      {/* Top Navigation */}
      <header className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1 as any) : router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} className="text-gray-800" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-gray-900">Checkout</h1>
          <span className="text-xs font-bold text-[#F2A900] bg-yellow-50 px-2 py-0.5 rounded-full">{currentStep} / 3</span>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1.5 rounded-lg">
          <FiShield /> <span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto pt-6 px-4">
        {renderStepper()}

        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">
            {currentStep === 1 && "Review your cart items before checkout."}
            {currentStep === 2 && "Complete your delivery details."}
            {currentStep === 3 && "Review your order & make payment."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LUPANDE WA KUSHOTO (Main Content) */}
          <div className="flex-1 space-y-6">
            
            {/* ================= STEP 1: CART ================= */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg flex items-center gap-2"><FiShoppingCart className="text-[#F2A900]"/> My Cart ({cart?.length || 0} Items)</h2>
                  {cart?.length > 0 && <button onClick={clearCart} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><FiTrash2/> Clear All</button>}
                </div>
                
                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart?.length > 0 ? cart.map((item: any) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl relative hover:border-[#F2A900] transition group">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2 border border-gray-200">
                        {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-3xl">{item.imageEmoji || '📦'}</span>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-sm text-gray-900 pr-8 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          {item.color && <><span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800 border border-gray-300"></span> {item.color}</span><span className="text-gray-300">|</span></>}
                          {item.storage && <span>{item.storage}</span>}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-black text-gray-900">TZS {item.price?.toLocaleString()}</span>
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                            <span className="text-xs font-black px-2 py-0.5 text-center">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><FiTrash2 size={16}/></button>
                    </div>
                  )) : (
                    <div className="text-center py-10">
                      <FiShoppingCart className="mx-auto text-4xl text-gray-300 mb-4"/>
                      <p className="text-gray-500 font-medium mb-4">Your cart is empty</p>
                      <button onClick={() => router.push('/')} className="bg-[#0A101D] text-white px-6 py-2 rounded-xl text-sm font-bold">Continue Shopping</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= STEP 2: SHIPPING ================= */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Shipping Details Form */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiUser className="text-[#F2A900]"/> 1. Shipping Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" required value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#F2A900]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" required value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#F2A900]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Country <span className="text-red-500">*</span></label>
                      <select value={formData.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#F2A900]">
                        <option value="Tanzania">Tanzania</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Region <span className="text-red-500">*</span></label>
                      <select value={formData.region} onChange={(e)=>setFormData({...formData, region: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#F2A900]">
                        {TANZANIA_REGIONS.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Address / Landmark <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                        <textarea required rows={2} value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} placeholder="E.g., Kinondoni, Mkwajuni" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#F2A900]"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Choose Shipping Method */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiTruck className="text-[#F2A900]"/> 2. Choose Shipping Method</h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {availableShippingMethods.map((method) => (
                      <div 
                        key={method.id} 
                        onClick={() => setSelectedShipping(method)}
                        className={`relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition flex flex-col items-start gap-2 ${selectedShipping?.id === method.id ? 'border-[#F2A900] bg-yellow-50/30 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        {selectedShipping?.id === method.id ? (
                           <div className="absolute top-3 right-3 text-[#F2A900]"><FiCheckCircle size={18} className="fill-[#F2A900] text-white" /></div>
                        ) : (
                           <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-2xl">{method.emoji}</span>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{method.name}</h4>
                          <p className="text-xs font-black text-gray-900 mt-1">TZS {method.price.toLocaleString()}</p>
                          <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mt-0.5">⏱ {method.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PAYMENT ================= */}
            {currentStep === 3 && (
              <div className="space-y-6">
                
                {/* Order Summary Recap - Real Data */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiBox className="text-[#F2A900]"/> 1. Order Summary ({cart.length} Items)</h2>
                   <div className="space-y-3">
                     {cart.map(item => (
                       <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                         <div className="w-12 h-12 bg-gray-50 rounded border border-gray-200 flex items-center justify-center flex-shrink-0 p-1">
                           {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-xl">{item.imageEmoji || '📦'}</span>}
                         </div>
                         <div className="flex-1">
                           <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                           <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                         </div>
                         <div className="text-xs font-black">TZS {(item.price * item.quantity).toLocaleString()}</div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Payment Type */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiCreditCard className="text-[#F2A900]"/> 2. Payment Type</h2>
                   <div className="space-y-3">
                     {PAYMENT_METHODS.map((method) => (
                       <div 
                         key={method.id} 
                         onClick={() => setSelectedPayment(method)}
                         className={`relative p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${selectedPayment.id === method.id ? 'border-[#F2A900] bg-yellow-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                       >
                         {selectedPayment.id === method.id ? (
                            <FiCheckCircle size={20} className="text-[#F2A900] fill-[#F2A900] text-white flex-shrink-0" />
                         ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"></div>
                         )}
                         <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{method.icon}</div>
                         <div className="flex-1">
                           <h4 className="font-bold text-sm text-gray-900">{method.name}</h4>
                           <p className="text-[10px] font-medium text-gray-500 mt-0.5">{method.desc}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Pricing Summary (Mobile only visual match) */}
                <div className="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4">📝 3. Pricing Summary</h2>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-600 font-medium"><span>Delivery ({selectedShipping?.name})</span><span>TZS {deliveryFee.toLocaleString()}</span></div>
                      <div className="flex justify-between text-green-600 font-bold"><span>Discount</span><span>- TZS {discount.toLocaleString()}</span></div>
                   </div>
                   <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="font-black text-xl text-gray-900">TZS {totalAmount.toLocaleString()}</span>
                   </div>

                   {/* Advance Box */}
                   {selectedPayment.id === 'cod' && (
                     <div className="mt-4 bg-yellow-50/80 border border-[#F2A900]/30 rounded-xl flex">
                        <div className="p-3 w-[45%] flex flex-col justify-center border-r border-[#F2A900]/30">
                           <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold mb-1"><span className="w-5 h-5 bg-[#F2A900] text-black rounded flex items-center justify-center"><FiCreditCard size={12}/></span> Advance (20%)</div>
                           <div className="font-black text-green-700 text-sm">TZS {advancePayment.toLocaleString()}</div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center bg-white rounded-r-xl border-y border-r border-transparent">
                           <div className="text-[10px] text-gray-600 font-bold mb-1">Remaining Balance on Delivery</div>
                           <div className="font-black text-gray-900 text-sm">TZS {remainingBalance.toLocaleString()}</div>
                           <div className="text-[8px] text-gray-400 mt-0.5">Balance will be paid upon delivery.</div>
                        </div>
                     </div>
                   )}
                </div>

              </div>
            )}
          </div>

          {/* LUPANDE WA KULIA (Desktop Summary Panel) */}
          <div className="hidden lg:block w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-black text-lg border-b border-gray-100 pb-4 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600 font-medium">
                   <span>Delivery {currentStep > 1 && `(${selectedShipping?.name})`}</span>
                   <span>TZS {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold"><span>Discount</span><span>- TZS {discount.toLocaleString()}</span></div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                   <span className="font-bold text-gray-900">Total Amount</span>
                   <span className="font-black text-2xl text-gray-900">TZS {totalAmount.toLocaleString()}</span>
                </div>
                {discount > 0 && <p className="text-[10px] text-green-600 font-bold mt-1 text-right">You will save TZS {discount.toLocaleString()} on this order</p>}
              </div>

              {currentStep === 3 && selectedPayment.id === 'cod' && (
                <div className="mb-6 bg-yellow-50 border border-[#F2A900]/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-gray-700">Advance to Pay (20%)</span>
                     <span className="font-black text-green-700 text-lg">TZS {advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#F2A900]/20 pt-2">
                     <span className="text-[10px] font-bold text-gray-500">Balance on Delivery</span>
                     <span className="font-black text-sm text-gray-900">TZS {remainingBalance.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (currentStep === 1) {
                    handleProceedToShipping();
                  } else if (currentStep === 2) {
                    if(!formData.fullName || !formData.phone || !formData.address) {
                       alert("Please fill in all required shipping details.");
                       return;
                    }
                    setCurrentStep(3);
                  } else {
                    alert('Proceeding to payment gateway...');
                  }
                }}
                disabled={cart.length === 0}
                className="w-full bg-[#F2A900] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-yellow-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
              >
                {currentStep === 1 ? 'Proceed to Checkout' : currentStep === 2 ? 'Continue to Payment' : `Pay ${selectedPayment.id === 'cod' ? 'Advance ' : ''}TZS ${selectedPayment.id === 'cod' ? advancePayment.toLocaleString() : totalAmount.toLocaleString()}`}
                <FiChevronRight size={18} />
              </button>
              
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><FiShield className="text-green-500"/> 100% Secure Payment</div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><FiCheckCircle className="text-green-500"/> 7 Days Easy Returns</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE FIXED BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
        {currentStep < 3 ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500">Total</span>
              <span className="text-sm font-black text-gray-900">TZS {totalAmount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => {
                 if (currentStep === 1) handleProceedToShipping();
                 else {
                    if(!formData.fullName || !formData.phone || !formData.address) {
                       alert("Please fill in all required shipping details.");
                       return;
                    }
                    setCurrentStep(3);
                 }
              }}
              disabled={cart.length === 0}
              className="flex-1 bg-[#F2A900] disabled:bg-gray-300 text-black font-black py-3.5 rounded-xl flex items-center justify-center gap-1 shadow-sm"
            >
              {currentStep === 1 ? 'Proceed to Checkout' : 'Continue to Payment'} <FiChevronRight />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-green-600 font-bold mb-1">
              <FiShield /> Your payment is secure and protected
            </div>
            <button 
              onClick={() => alert('Proceeding to payment gateway...')}
              className="w-full bg-[#F2A900] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <FiCreditCard /> {selectedPayment.id === 'cod' ? `Pay Advance TZS ${advancePayment.toLocaleString()}` : `Pay TZS ${totalAmount.toLocaleString()}`} <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}