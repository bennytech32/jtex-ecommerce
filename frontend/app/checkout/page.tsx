'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { 
  FiArrowLeft, FiShoppingCart, FiMapPin, FiCreditCard, 
  FiTrash2, FiChevronRight, FiShield, FiCheckCircle, 
  FiTruck, FiBox, FiPhone, FiUser, FiStar, FiLock, FiInfo
} from 'react-icons/fi';

// === SHIPPING OPTIONS ===
const ALL_SHIPPING_METHODS = [
  { id: 'bodaboda', name: 'Bodaboda', price: 5000, time: '1 - 2 Hours', emoji: '🏍️' },
  { id: 'bus', name: 'Bus', price: 15000, time: '1 - 2 Days', emoji: '🚌' },
  { id: 'aeroplane', name: 'Aeroplane', price: 25000, time: '1 Day', emoji: '✈️' },
  { id: 'boat', name: 'Boat', price: 20000, time: '2 - 3 Days', emoji: '⛴️' }
];

// === PAYMENT TYPES ===
const PAYMENT_TYPES = [
  { id: 'full', name: 'Full Payment', desc: 'Pay the full amount now' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay advance now, rest on delivery' },
  { id: 'store', name: 'Pay at Store', desc: 'Pay when you pick up' }
];

// === PAYMENT METHODS (GATEWAYS) ===
const PAYMENT_METHODS = [
  { id: 'mobile_money', name: 'Mobile Money', desc: 'Pay via Lipa Namba', icon: '📱' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Direct to our bank', icon: '🏦' },
  { id: 'visa', name: 'Visa Card', desc: 'Debit/Credit Card', icon: 'VISA' },
  { id: 'mastercard', name: 'MasterCard', desc: 'Debit/Credit Card', icon: '🔴🟠' }
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
  
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };
  
  // States
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState(PAYMENT_TYPES[1]); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]); 
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'Tanzania',
    region: 'Dar es Salaam', 
    district: '',
    address: ''
  });

  const isDarEsSalaam = formData.region === 'Dar es Salaam';
  const isIsland = ISLAND_REGIONS.includes(formData.region);

  const availableShippingMethods = ALL_SHIPPING_METHODS.filter(method => {
    if (method.id === 'bodaboda') return isDarEsSalaam;
    if (method.id === 'boat') return isIsland;
    if (method.id === 'bus') return !isIsland; 
    if (method.id === 'aeroplane') return true; 
    return true;
  });

  const [selectedShipping, setSelectedShipping] = useState(availableShippingMethods[0]);

  useEffect(() => {
    if (!availableShippingMethods.find(m => m.id === selectedShipping?.id)) {
      setSelectedShipping(availableShippingMethods[0]);
    }
  }, [formData.region, availableShippingMethods, selectedShipping?.id]);

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

  const subtotal = cartTotal || 0; 
  const deliveryFee = currentStep > 1 && selectedShipping ? selectedShipping.price : 0;
  const totalAmount = subtotal + deliveryFee;
  
  const advancePayment = selectedPaymentType.id === 'cod' ? Math.min(50000, totalAmount) : totalAmount;
  const remainingBalance = totalAmount - advancePayment;

  const handleProceedToShipping = () => {
    const savedUser = localStorage.getItem('jtex_user');
    if (!savedUser) {
      alert("Lazima uingie kwenye akaunti yako (Login) ili uweze kuendelea na malipo.");
      return;
    }
    if (cart.length === 0) {
      alert("Kikapu chako kipo wazi.");
      return;
    }
    setCurrentStep(2);
  };

  // WhatsApp Order Submission (Takes over the Final Button)
  const handleWhatsAppOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Tafadhali kamilisha kujaza taarifa zako za makazi kwanza.");
      setCurrentStep(2);
      return;
    }

    const businessPhone = "255767949581"; // Namba ya Jtex
    let itemsText = cart.map((item: any, index: number) => 
      `${index + 1}. ${item.name} - Qty: ${item.quantity} (TZS ${(item.price * item.quantity).toLocaleString()})`
    ).join('%0A');

    const paymentInfo = selectedPaymentType.id === 'cod' 
      ? `Nimelipia Kianzio (Advance): TZS ${advancePayment.toLocaleString()}%0ASalia langu ni: TZS ${remainingBalance.toLocaleString()} (Nitalipa nikipokea mzigo)` 
      : `Nimelipia Full Amount: TZS ${totalAmount.toLocaleString()}`;

    const message = `Habari Jtex, nimefanya manunuzi mtandaoni.%0A%0A*BIDHAA ZANGU:*%0A${itemsText}%0A%0A*TAARIFA ZANGU:*%0AJina: ${formData.fullName}%0ASimu: ${formData.phone}%0AMkoa: ${formData.region}%0AAnwani: ${formData.address}%0A%0A*NJIA YA KUSAFIRISHA:*%0A${selectedShipping.name} (TZS ${deliveryFee.toLocaleString()})%0A%0A*JUMLA KUU:* TZS ${totalAmount.toLocaleString()}%0A%0A*MALIPO YALIYOTEULIWA:*%0ANjia: ${selectedPaymentMethod.name}%0A${paymentInfo}%0A%0ATafadhali thibitisha order yangu.`;

    const whatsappUrl = `https://wa.me/${businessPhone}?text=${message}`;
    
    clearCart();
    window.open(whatsappUrl, '_blank');
    router.push('/');
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 relative px-4">
      <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep >= 1 ? 'bg-[#F2A900] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
          {currentStep > 1 ? <FiCheckCircle size={20} /> : '1'}
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>My Cart</span>
      </div>
      <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#F2A900]' : 'bg-transparent'}`}></div>
      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep >= 2 ? 'bg-[#F2A900] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
          {currentStep > 2 ? <FiCheckCircle size={20} /> : '2'}
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Checkout</span>
      </div>
      <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-[#F2A900]' : 'bg-transparent'}`}></div>
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
      <header className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1 as any) : router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} className="text-gray-800" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-gray-900">{currentStep === 3 ? 'Payment' : 'Checkout'}</h1>
          <span className="text-xs font-bold text-[#F2A900] bg-yellow-50 px-2 py-0.5 rounded-full">Step {currentStep} of 3</span>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1.5 rounded-lg">
          <FiShield /> <span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-6 px-4">
        {renderStepper()}

        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">
            {currentStep === 1 && "Review your cart items before checkout."}
            {currentStep === 2 && "Please fill in your details and complete your order."}
            {currentStep === 3 && "Review and confirm your payment."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ======================= LEFT COLUMN ======================= */}
          <div className="flex-1 space-y-6">
            
            {/* STEP 1: CART */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg flex items-center gap-2"><FiShoppingCart className="text-[#F2A900]"/> My Cart ({cart?.length || 0} Items)</h2>
                  {cart?.length > 0 && <button onClick={clearCart} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><FiTrash2/> Clear All</button>}
                </div>
                
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

            {/* STEP 2: SHIPPING */}
            {currentStep === 2 && (
              <div className="space-y-6">
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

                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiTruck className="text-[#F2A900]"/> 2. Shipping Method</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

            {/* STEP 3: PAYMENT UI MPYA */}
            {currentStep === 3 && (
              <div className="space-y-6">
                
                {/* 1. Payment Type */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4">💳 1. Payment Type</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                     {PAYMENT_TYPES.map((type) => (
                       <div 
                         key={type.id} 
                         onClick={() => setSelectedPaymentType(type)}
                         className={`relative p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${selectedPaymentType.id === type.id ? 'border-[#F2A900] bg-yellow-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                       >
                         <div className="mt-0.5">
                           {selectedPaymentType.id === type.id ? (
                              <FiCheckCircle size={18} className="text-[#F2A900] fill-[#F2A900] text-white" />
                           ) : (
                              <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                           )}
                         </div>
                         <div>
                           <h4 className="font-bold text-sm text-gray-900 leading-none">{type.name}</h4>
                           <p className="text-[10px] text-gray-500 mt-1.5">{type.desc}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   {/* Good Choice Helper Text */}
                   <div className="mt-4 flex items-center gap-2 bg-yellow-50/80 p-3 rounded-lg border border-yellow-100/50">
                      <FiStar className="text-[#F2A900]" size={14}/>
                      <p className="text-xs font-bold text-gray-800">Good choice! <span className="font-medium text-gray-600 ml-1">You will pay {selectedPaymentType.id === 'cod' ? 'the advance amount now and the rest upon delivery' : 'the full amount now and your order will be processed'}.</span></p>
                   </div>
                </div>

                {/* 2. Payment Method */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4"><FiCreditCard className="text-[#F2A900]"/> 2. Payment Method</h2>
                   
                   {/* Main Gateway Selection */}
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                     {PAYMENT_METHODS.map((method) => (
                       <div 
                         key={method.id} 
                         onClick={() => setSelectedPaymentMethod(method)}
                         className={`relative p-3 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-2 ${selectedPaymentMethod.id === method.id ? 'border-[#F2A900] bg-yellow-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                       >
                         {selectedPaymentMethod.id === method.id && (
                            <FiCheckCircle size={16} className="absolute top-2 right-2 text-[#F2A900] fill-[#F2A900] text-white" />
                         )}
                         {method.icon === 'VISA' ? (
                            <span className="font-black text-blue-800 italic text-2xl tracking-tighter mt-1 mb-1">VISA</span>
                         ) : method.icon === '🔴🟠' ? (
                            <div className="flex -space-x-2 mt-2 mb-2"><div className="w-5 h-5 bg-red-600 rounded-full mix-blend-multiply"></div><div className="w-5 h-5 bg-yellow-500 rounded-full mix-blend-multiply"></div></div>
                         ) : (
                            <span className="text-2xl mt-1">{method.icon}</span>
                         )}
                         <div>
                           <h4 className="font-bold text-xs text-gray-900">{method.name}</h4>
                           <p className="text-[9px] font-medium text-gray-500 mt-0.5">{method.desc}</p>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* MOBILE MONEY DETAILS */}
                   {selectedPaymentMethod.id === 'mobile_money' && (
                     <div className="animate-fade-in border-t border-gray-100 pt-5">
                       <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><FiInfo className="text-blue-500"/> Akaunti za Mitandao (Lipa Namba)</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                         
                         {/* Vodacom M-Pesa */}
                         <div className="border border-red-200 bg-red-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                           <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-lg">M</div>
                           <div>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Vodacom M-Pesa</p>
                             <p className="text-xl font-black text-red-600 tracking-wider">52121360</p>
                             <p className="text-[11px] font-bold text-gray-800 mt-0.5">Name | Jtex</p>
                           </div>
                         </div>

                         {/* Mixx by Yas */}
                         <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                           <div className="w-12 h-12 bg-[#0A101D] rounded-full flex items-center justify-center font-black text-yellow-400 text-sm italic">Mixx</div>
                           <div>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Mixx By Yas</p>
                             <p className="text-xl font-black text-blue-700 tracking-wider">7101850</p>
                             <p className="text-[11px] font-bold text-gray-800 mt-0.5">Name | Jtex</p>
                           </div>
                         </div>

                       </div>
                       
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 font-medium">
                         <p className="font-bold text-gray-900 mb-2">Jinsi ya Kulipia kwa M-Pesa:</p>
                         <ol className="list-decimal ml-4 space-y-1.5 text-[11px]">
                           <li>Piga <strong>*150*00#</strong></li>
                           <li>Chagua 4. <strong>Lipa kwa M-Pesa</strong></li>
                           <li>Chagua 1. <strong>Weka LIPA Namba</strong></li>
                           <li>Weka namba <strong>52121360</strong></li>
                           <li>Weka kiasi kinachotakiwa (Tsh {selectedPaymentType.id === 'cod' ? advancePayment.toLocaleString() : totalAmount.toLocaleString()})</li>
                           <li>Weka Namba ya Siri kuthibitisha.</li>
                         </ol>
                       </div>
                     </div>
                   )}

                   {/* BANK TRANSFER DETAILS */}
                   {selectedPaymentMethod.id === 'bank' && (
                     <div className="animate-fade-in border-t border-gray-100 pt-5">
                       <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><FiInfo className="text-green-500"/> Akaunti za Benki</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                         
                         {/* NMB Bank */}
                         <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                           <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-[10px]">NMB</div>
                           <div>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">NMB Close to you</p>
                             <p className="text-xl font-black text-blue-700 tracking-wider">23310067430</p>
                             <p className="text-[11px] font-bold text-gray-800 mt-0.5">Jtex Company</p>
                           </div>
                         </div>

                         {/* CRDB Bank */}
                         <div className="border border-green-200 bg-green-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                           <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-black text-white text-[10px]">CRDB</div>
                           <div>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">CRDB BANK</p>
                             <p className="text-xl font-black text-green-700 tracking-wider">0150001JGMU00</p>
                             <p className="text-[11px] font-bold text-gray-800 mt-0.5">Jtex Company</p>
                           </div>
                         </div>

                       </div>

                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 font-medium">
                         Tafadhali fanya muamala wa <strong>Tsh {selectedPaymentType.id === 'cod' ? advancePayment.toLocaleString() : totalAmount.toLocaleString()}</strong> kwenda kwenye moja ya akaunti za benki hapo juu. Tunashauri uhifadhi ujumbe wako wa muamala.
                       </div>
                     </div>
                   )}
                   
                   {/* Placeholder For Cards */}
                   {(selectedPaymentMethod.id === 'visa' || selectedPaymentMethod.id === 'mastercard') && (
                     <div className="animate-fade-in border-t border-gray-100 pt-5 text-center py-4">
                       <p className="text-sm font-bold text-gray-500">You will be redirected to the secure {selectedPaymentMethod.name} gateway to complete this payment.</p>
                     </div>
                   )}

                   <div className="flex gap-3 mt-8 border-t border-gray-100 pt-6">
                      <button type="button" onClick={() => setWorkflowStep(2)} className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                      <button type="button" onClick={handleWhatsAppOrder} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
                        <FiLock /> {selectedPaymentType.id === 'cod' ? `Confirm Order TZS ${advancePayment.toLocaleString()}` : `Confirm Order TZS ${totalAmount.toLocaleString()}`}
                      </button>
                   </div>
                </div>

                {/* Pricing Summary (Mobile only visual match) */}
                <div className="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                   <h2 className="font-black text-base flex items-center gap-2 mb-4">📝 3. Pricing Summary</h2>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-gray-600 font-medium"><span>Delivery ({selectedShipping?.name})</span><span>TZS {deliveryFee.toLocaleString()}</span></div>
                   </div>
                   <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="font-black text-xl text-gray-900">TZS {totalAmount.toLocaleString()}</span>
                   </div>

                   {selectedPaymentType.id === 'cod' && (
                     <div className="mt-4 bg-yellow-50/80 border border-[#F2A900]/30 rounded-xl flex">
                        <div className="p-3 w-[45%] flex flex-col justify-center border-r border-[#F2A900]/30">
                           <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold mb-1"><span className="w-5 h-5 bg-[#F2A900] text-black rounded flex items-center justify-center"><FiCreditCard size={12}/></span> Advance (20%)</div>
                           <div className="font-black text-green-700 text-sm">TZS {advancePayment.toLocaleString()}</div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center bg-white rounded-r-xl border-y border-r border-transparent">
                           <div className="text-[10px] text-gray-600 font-bold mb-1">Remaining Balance</div>
                           <div className="font-black text-gray-900 text-sm">TZS {remainingBalance.toLocaleString()}</div>
                           <div className="text-[8px] text-gray-400 mt-0.5">Balance will be paid upon delivery.</div>
                        </div>
                     </div>
                   )}
                </div>

              </div>
            )}
          </div>

          {/* ======================= RIGHT COLUMN (Order Summary) ======================= */}
          <div className="hidden lg:block w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                 <h2 className="font-black text-lg">Order Summary <span className="text-sm font-medium text-gray-500">({cart.length} Items)</span></h2>
                 {currentStep < 3 && <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-gray-500 hover:text-black">Edit Cart ✏️</button>}
              </div>
              
              <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                 {cart.map((item: any) => (
                   <div key={item.id} className="flex gap-3">
                     <div className="w-10 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 p-1">
                       {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-lg">{item.imageEmoji || '📦'}</span>}
                     </div>
                     <div className="flex-1">
                       <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                       <p className="text-[9px] text-gray-500 mt-0.5">Qty: {item.quantity} {item.storage && `• ${item.storage}`}</p>
                     </div>
                     <div className="text-xs font-black">TZS {(item.price * item.quantity).toLocaleString()}</div>
                   </div>
                 ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600 font-medium"><span>Sub Total</span><span>TZS {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600 font-medium">
                   <span>Delivery {currentStep > 1 && selectedShipping ? `(${selectedShipping.name})` : ''}</span>
                   <span>TZS {deliveryFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                   <span className="font-bold text-gray-900">Total Amount</span>
                   <span className="font-black text-xl text-gray-900">TZS {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {currentStep < 3 ? (
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
                    }
                  }}
                  disabled={cart.length === 0}
                  className="w-full bg-[#F2A900] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-yellow-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                >
                  {currentStep === 1 ? 'Proceed to Checkout' : 'Continue to Payment'}
                </button>
              ) : (
                <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md">
                   <FiLock /> {selectedPaymentType.id === 'cod' ? `Confirm Order TZS ${advancePayment.toLocaleString()}` : `Confirm Order TZS ${totalAmount.toLocaleString()}`}
                </button>
              )}
              
              <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
                 <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium"><FiShield className="text-green-500"/> Your information is safe with us</div>
                 <div className="flex justify-between mt-2">
                    <div className="flex flex-col items-center gap-1 w-1/3"><FiShield className="text-gray-400 text-lg"/><span className="text-[8px] font-bold text-center">Secure Manual Payment</span></div>
                    <div className="flex flex-col items-center gap-1 w-1/3 border-x border-gray-100"><FiCheckCircle className="text-gray-400 text-lg"/><span className="text-[8px] font-bold text-center">Quality Guarantee</span></div>
                    <div className="flex flex-col items-center gap-1 w-1/3"><FiPhone className="text-gray-400 text-lg"/><span className="text-[8px] font-bold text-center">24/7 Human Support</span></div>
                 </div>
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
              <FiShield /> Submit your order safely via WhatsApp
            </div>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <FiPhone /> Order via WhatsApp <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}