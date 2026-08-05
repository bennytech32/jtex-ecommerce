'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import {
  FiArrowLeft, FiShoppingCart, FiMapPin, FiCreditCard,
  FiTrash2, FiChevronRight, FiShield, FiCheckCircle,
  FiTruck, FiPhone, FiUser, FiStar, FiInfo, FiMinus, FiPlus, FiX, FiLock, FiMail, FiList
} from 'react-icons/fi';

// === HELPER FUNCTION: KUBADILI JINA LA RANGI KUWA RANGI HALISI ===
const getColorCode = (colorName: string) => {
  if (!colorName) return '';
  const c = colorName.toLowerCase().trim();
  const colorsMap: any = {
    'black': '#000000', 'white': '#FFFFFF', 'silver': '#C0C0C0', 'gray': '#808080', 'grey': '#808080',
    'titanium': '#878681', 'natural titanium': '#878681', 'blue titanium': '#2F3C4D',
    'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000', 'yellow': '#FFFF00',
    'gold': '#FFD700', 'rose gold': '#B76E79', 'purple': '#800080', 'pink': '#FFC0CB',
    'midnight': '#191970', 'starlight': '#F8F9FA'
  };
  return colorsMap[c] || c;
};

// === SHIPPING OPTIONS ===
const ALL_SHIPPING_METHODS = [
  { id: 'bodaboda', name: 'Bodaboda', price: 0, time: '1 - 2 Hours', emoji: '🏍️' },
  { id: 'bus', name: 'Bus', price: 0, time: '1 - 2 Days', emoji: '🚌' },
  { id: 'aeroplane', name: 'Aeroplane', price: 0, time: '1 Day', emoji: '✈️' },
  { id: 'boat', name: 'Boat', price: 0, time: '2 - 3 Days', emoji: '⛴️' }
];

// === PAYMENT TYPES ===
const ALL_PAYMENT_TYPES = [
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

// === NCHI NA MIKOA PAMOJA NA BENDERA ZAKE ===
const EA_COUNTRIES = [
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "DR Congo", code: "+243", flag: "🇨🇩" }
];

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

  // FIX: Tumeondoa updateQuantity hapa ili kuzuia Type Error ya TypeScript
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getApiUrl()}${url}`;
  };

  const getImagesArray = (imgData: string) => {
    if (!imgData) return [];
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [imgData];
    } catch (e) {
      return [imgData];
    }
  };

  const getItemQuantity = (item: any) => {
    return Number(item.quantity || item.quantityToAdd || item.qty || 1);
  };

  const getColorOptions = (item: any) => {
    let options: string[] = [];
    try {
      let parsed = item.specifications;

      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch (e) { }
      }
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch (e) { }
      }

      if (parsed && typeof parsed === 'object') {
        const colorKey = Object.keys(parsed).find(k =>
          ['color', 'colors', 'colour', 'colours', 'rangi'].includes(k.toLowerCase().trim())
        );
        if (colorKey && parsed[colorKey]) {
          options = String(parsed[colorKey]).split(/[\/,|]/).map((c: string) => c.trim()).filter(Boolean);
        }
      }
    } catch (e) {
      console.error("Color parse error:", e);
    }

    if (options.length === 0) {
      const rootColor = item.Color || item.color || item.Colors || item.colors || item.Colour || item.colour || item.Rangi || item.rangi;
      if (rootColor) {
        options = String(rootColor).split(/[\/,|]/).map((c: string) => c.trim()).filter(Boolean);
      }
    }

    if (options.length === 0 && item.selectedColor) {
      options = [item.selectedColor];
    }

    return options;
  };

  const handleColorChange = (item: any, newColor: string) => {
    if (item.selectedColor === newColor) return;
    const oldCartId = item.cartId || item.id;
    const qty = getItemQuantity(item);

    const updatedItem = {
      ...item,
      selectedColor: newColor,
      cartId: `${item.id}-${newColor}`,
      quantity: qty,
      quantityToAdd: qty,
      qty: qty
    };

    if (removeFromCart) removeFromCart(oldCartId);
    setTimeout(() => { if (addToCart) addToCart(updatedItem); }, 200);
  };

  // FIX: Njia safi ya ku-update idadi bila kutegemea function ambayo haipo
  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1) return;
    const targetCartId = item.cartId || item.id;

    const updatedItem = {
      ...item,
      quantity: newQty,
      quantityToAdd: newQty,
      qty: newQty,
      cartId: targetCartId
    };

    if (removeFromCart) removeFromCart(targetCartId);
    setTimeout(() => { if (addToCart) addToCart(updatedItem); }, 200);
  };

  // States
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState(ALL_PAYMENT_TYPES[1]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phoneCode: '+255',
    phone: '',
    country: 'Tanzania',
    region: 'Dar es Salaam',
    district: '',
    address: ''
  });

  const isTanzania = formData.country === 'Tanzania';
  const isDarEsSalaam = isTanzania && formData.region === 'Dar es Salaam';
  const isIsland = isTanzania && ISLAND_REGIONS.includes(formData.region);

  const availablePaymentTypes = isTanzania ? ALL_PAYMENT_TYPES : ALL_PAYMENT_TYPES.filter(type => type.id !== 'cod');

  useEffect(() => {
    if (!isTanzania && selectedPaymentType.id === 'cod') {
      setSelectedPaymentType(availablePaymentTypes[0]);
    }
  }, [isTanzania, selectedPaymentType, availablePaymentTypes]);

  useEffect(() => {
    const selectedCountryObj = EA_COUNTRIES.find(c => c.name === formData.country);
    if (selectedCountryObj) {
      setFormData(prev => ({ ...prev, phoneCode: selectedCountryObj.code }));
    }
  }, [formData.country]);

  const availableShippingMethods = ALL_SHIPPING_METHODS.filter(method => {
    if (!isTanzania) return method.id === 'aeroplane' || method.id === 'bus';
    if (method.id === 'bodaboda') return isDarEsSalaam;
    if (method.id === 'boat') return isIsland;
    if (method.id === 'bus') return !isIsland;
    if (method.id === 'aeroplane') return true;
    return true;
  });

  const [selectedShipping, setSelectedShipping] = useState(availableShippingMethods.find(m => m.id !== 'bodaboda') || availableShippingMethods[0]);

  useEffect(() => {
    setMounted(true);
    // Hapa tunazuia bodaboda isichaguliwe kama default kwa sababu ni "Coming Soon"
    if (!availableShippingMethods.find(m => m.id === selectedShipping?.id) || selectedShipping?.id === 'bodaboda') {
      const validMethod = availableShippingMethods.find(m => m.id !== 'bodaboda') || availableShippingMethods[0];
      setSelectedShipping(validMethod);
    }
  }, [formData.region, formData.country, availableShippingMethods, selectedShipping?.id]);

  useEffect(() => {
    const savedUser = localStorage.getItem('jtex_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        let phoneVal = parsedUser.phone || '';
        let extractedCode = '+255';

        if (phoneVal.startsWith('+')) {
          const match = EA_COUNTRIES.find(c => phoneVal.startsWith(c.code));
          if (match) {
            extractedCode = match.code;
            phoneVal = phoneVal.replace(match.code, '').trim();
          }
        } else if (phoneVal.startsWith('0')) {
          phoneVal = phoneVal.substring(1);
        }

        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.name || '',
          phoneCode: extractedCode,
          phone: phoneVal,
        }));
      } catch (e) { }
    }
  }, []);

  const subtotal = cart?.reduce((acc: number, item: any) => acc + (Number(item.price) * getItemQuantity(item)), 0) || 0;
  const deliveryFee = 0;
  const totalAmount = subtotal + deliveryFee;

  const advancePayment = selectedPaymentType.id === 'cod' ? Math.min(50000, totalAmount) : totalAmount;
  const remainingBalance = totalAmount - advancePayment;

  const handleProceedToShipping = () => {
    const savedUser = localStorage.getItem('jtex_user');
    if (cart.length === 0) {
      alert("Kikapu chako kipo wazi.");
      return;
    }
    if (!savedUser) {
      // Redirect to main login page with checkout return URL
      router.push('/login?redirect=/checkout');
      return;
    }
    setCurrentStep(2);
  };

  const handleWhatsAppOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Tafadhali kamilisha kujaza taarifa zako za makazi kwanza.");
      setCurrentStep(2);
      return;
    }

    const businessPhone = "255767949581";
    const fullPhoneNumber = `${formData.phoneCode}${formData.phone.startsWith('0') ? formData.phone.substring(1) : formData.phone}`;

    let itemsText = cart.map((item: any, index: number) => {
      const qty = getItemQuantity(item);
      const colorOptions = getColorOptions(item);
      const activeColor = item.selectedColor || colorOptions[0];
      const colorText = activeColor ? ` (Color: ${activeColor})` : '';

      return `${index + 1}. ${item.name}${colorText} - Qty: ${qty} (TZS ${(Number(item.price) * qty).toLocaleString()})`;
    }).join('%0A');

    const paymentInfo = selectedPaymentType.id === 'cod'
      ? `Nimelipia Kianzio (Advance): TZS ${advancePayment.toLocaleString()}%0ASalia langu ni: TZS ${remainingBalance.toLocaleString()} (Nitalipa nikipokea mzigo)`
      : `Nimelipia Full Amount: TZS ${totalAmount.toLocaleString()}`;

    const shippingPriceInfo = "Negotiable";

    const message = `Habari Jtex, nimefanya manunuzi mtandaoni.%0A%0A*BIDHAA ZANGU:*%0A${itemsText}%0A%0A*TAARIFA ZANGU:*%0AJina: ${formData.fullName}%0ASimu: ${fullPhoneNumber}%0ANchi: ${formData.country}%0AMkoa/Mji: ${formData.region}%0AAnwani: ${formData.address}%0A%0A*NJIA YA KUSAFIRISHA:*%0A${selectedShipping.name} (${shippingPriceInfo})%0A%0A*JUMLA KUU BIDHAA:* TZS ${subtotal.toLocaleString()}%0A%0A*MALIPO YALIYOTEULIWA:*%0ANjia: ${selectedPaymentMethod.name}%0A${paymentInfo}%0A%0ATafadhali thibitisha order yangu.`;

    const whatsappUrl = `https://wa.me/${businessPhone}?text=${message}`;
    clearCart();
    window.open(whatsappUrl, '_blank');
    router.push('/');
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 relative px-4 max-w-lg mx-auto">
      <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>

      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#E8A922] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
          <FiShoppingCart size={14} />
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 1 ? 'text-[#1B6B80]' : 'text-gray-400'}`}>Cart</span>
      </div>

      <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#E8A922]' : 'bg-transparent'}`}></div>

      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#E8A922] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
          <FiTruck size={14} />
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 2 ? 'text-[#1B6B80]' : 'text-gray-400'}`}>Shipping</span>
      </div>

      <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-[#E8A922]' : 'bg-transparent'}`}></div>

      <div className="flex flex-col items-center gap-2 bg-white px-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#E8A922] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
          <FiCreditCard size={14} />
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${currentStep >= 3 ? 'text-[#1B6B80]' : 'text-gray-400'}`}>Payment</span>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-12">

      <header className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1 as any) : router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} className="text-[#1B6B80]" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black text-[#1B6B80] tracking-wide uppercase">
            {currentStep === 1 && 'Shopping Cart'}
            {currentStep === 2 && 'Shipping Details'}
            {currentStep === 3 && 'Secure Payment'}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1.5 rounded-lg border border-green-100">
          <FiShield /> <span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-6 px-4">
        {renderStepper()}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">

            {/* STEP 1: CART */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <h2 className="font-black text-lg flex items-center gap-2 text-[#1B6B80]"><FiShoppingCart className="text-[#E8A922]" /> My Cart ({cart?.length || 0} Items)</h2>
                  {cart?.length > 0 && <button onClick={clearCart} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><FiTrash2 /> Clear All</button>}
                </div>

                <div className="space-y-4">
                  {cart?.length > 0 ? cart.map((item: any) => {
                    const displayImage = getImagesArray(item.imageUrl)[0];
                    const qty = getItemQuantity(item);
                    const uniqueId = item.cartId || item.id;

                    const colorOptions = getColorOptions(item);
                    const activeColor = item.selectedColor || colorOptions[0];

                    return (
                      <div key={uniqueId} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl relative hover:border-[#E8A922] transition group">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2 border border-gray-200 mx-auto sm:mx-0">
                          {displayImage ? <img src={getImageUrl(displayImage)} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-3xl">{item.imageEmoji || '📦'}</span>}
                        </div>
                        <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                          <h3 className="font-bold text-sm text-[#1B6B80] pr-0 sm:pr-8 line-clamp-2">{item.name}</h3>

                          <div className="text-xs text-gray-500 mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            {colorOptions.length > 1 ? (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Color:</span>
                                <select
                                  value={activeColor || ''}
                                  onChange={(e) => handleColorChange(item, e.target.value)}
                                  className="text-[10px] font-bold text-[#1B6B80] bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 outline-none focus:border-[#E8A922] cursor-pointer"
                                >
                                  {colorOptions.map((c: string, i: number) => (
                                    <option key={i} value={c}>{c}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              activeColor && (
                                <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-gray-600">
                                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: getColorCode(activeColor) }}></span>
                                  Color: {activeColor}
                                </span>
                              )
                            )}
                            {item.storage && <span className="font-bold text-[10px] uppercase hidden sm:inline">| {item.storage}</span>}
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-3 sm:gap-0">
                            <div className="flex flex-col">
                              <span className="font-black text-[#1B6B80] text-sm">TZS {(Number(item.price) * qty).toLocaleString()}</span>
                              {qty > 1 && <span className="text-[10px] font-bold text-gray-400 mt-0.5">TZS {Number(item.price).toLocaleString()} each</span>}
                            </div>

                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-gray-50">
                              <button onClick={() => handleQuantityChange(item, qty - 1)} className="px-3 hover:bg-gray-200 text-[#1B6B80] transition h-full flex items-center">
                                <FiMinus size={12} />
                              </button>
                              <span className="px-3 text-xs font-bold border-x border-gray-200 h-full flex items-center justify-center bg-white text-[#1B6B80] min-w-[35px]">
                                {qty}
                              </span>
                              <button onClick={() => handleQuantityChange(item, qty + 1)} className="px-3 hover:bg-gray-200 text-[#1B6B80] transition h-full flex items-center">
                                <FiPlus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(uniqueId)} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-300 hover:text-red-500 transition bg-white p-1 rounded-full shadow-sm sm:shadow-none sm:bg-transparent"><FiTrash2 size={16} /></button>
                      </div>
                    )
                  }) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                      <FiShoppingCart className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium mb-4">Your cart is empty</p>
                      <button onClick={() => router.push('/')} className="bg-[#1B6B80] hover:bg-[#145363] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition">Continue Shopping</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4 text-[#1B6B80] border-b border-gray-100 pb-3"><FiUser className="text-[#E8A922]" /> Shipping Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B6B80]" />
                        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Country <span className="text-red-500">*</span></label>
                      <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922] appearance-none cursor-pointer">
                        {EA_COUNTRIES.map(c => (
                          <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <div className="w-[95px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 gap-1.5 flex-shrink-0">
                          <span className="text-lg">{EA_COUNTRIES.find(c => c.name === formData.country)?.flag || '🇹🇿'}</span>
                          <span>{formData.phoneCode}</span>
                        </div>
                        <div className="relative flex-1">
                          <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="767 123 456" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922]" />
                        </div>
                      </div>
                    </div>

                    {isTanzania ? (
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Region <span className="text-red-500">*</span></label>
                        <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922]">
                          {TANZANIA_REGIONS.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">City/State <span className="text-red-500">*</span></label>
                        <input type="text" required value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} placeholder="City or State" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922]" />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Address / Landmark <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-3 text-[#1B6B80]" />
                        <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="E.g., Kinondoni, Mkwajuni" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#E8A922]"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4 text-[#1B6B80] border-b border-gray-100 pb-3"><FiTruck className="text-[#E8A922]" /> Shipping Method</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
                    {availableShippingMethods.map((method) => {
                      const isComingSoon = method.id === 'bodaboda';
                      const isSelected = selectedShipping?.id === method.id;

                      return (
                        <div
                          key={method.id}
                          onClick={() => !isComingSoon && setSelectedShipping(method)}
                          className={`relative p-3 sm:p-4 rounded-xl border-2 transition flex flex-col items-start gap-2 ${isComingSoon ? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-100' : (isSelected ? 'border-[#E8A922] bg-[#E8A922]/10 shadow-sm cursor-pointer' : 'border-gray-100 bg-white hover:border-[#1B6B80]/30 cursor-pointer')}`}
                        >
                          {!isComingSoon && isSelected ? (
                            <div className="absolute top-3 right-3 text-[#E8A922]"><FiCheckCircle size={18} className="fill-[#E8A922] text-white" /></div>
                          ) : (
                            !isComingSoon && <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full border border-gray-300"></div>
                          )}
                          <span className="text-2xl">{method.emoji}</span>
                          <div>
                            <h4 className="font-bold text-sm text-[#1B6B80]">{method.name}</h4>
                            <p className="text-xs font-black mt-1">
                              {isComingSoon ? <span className="text-red-500">Coming Soon</span> : <span className="text-gray-900">Negotiable</span>}
                            </p>
                            <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mt-0.5">⏱ {method.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT UI MPYA - FULLY VISIBLE ON MOBILE */}
            {currentStep === 3 && (
              <div className="space-y-6">

                {/* 1. Payment Type Selection */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4 text-[#1B6B80] border-b border-gray-100 pb-3">💳 Payment Type</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                    {availablePaymentTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedPaymentType(type)}
                        className={`relative p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${selectedPaymentType.id === type.id ? 'border-[#E8A922] bg-[#E8A922]/10 shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B6B80]/30'}`}
                      >
                        <div className="mt-0.5">
                          {selectedPaymentType.id === type.id ? (
                            <FiCheckCircle size={18} className="text-[#E8A922] fill-[#E8A922] text-white" />
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#1B6B80] leading-none">{type.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1.5">{type.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 bg-[#1B6B80]/5 p-3 rounded-lg border border-[#1B6B80]/10">
                    <FiStar className="text-[#E8A922] flex-shrink-0" size={16} />
                    <p className="text-xs font-bold text-[#1B6B80]">Good choice! <span className="font-medium text-gray-600 ml-1">You will pay {selectedPaymentType.id === 'cod' ? 'the advance amount now and the rest upon delivery' : 'the full amount now and your order will be processed'}.</span></p>
                  </div>
                </div>

                {/* 2. Payment Gateway Selection (Always visible now) */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4 text-[#1B6B80] border-b border-gray-100 pb-3"><FiCreditCard className="text-[#E8A922]" /> Payment Method</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 pt-2">
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`relative p-3 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-2 ${selectedPaymentMethod.id === method.id ? 'border-[#E8A922] bg-[#E8A922]/10 shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B6B80]/30'}`}
                      >
                        {selectedPaymentMethod.id === method.id && (
                          <FiCheckCircle size={16} className="absolute top-2 right-2 text-[#E8A922] fill-[#E8A922] text-white" />
                        )}
                        {method.icon === 'VISA' ? (
                          <span className="font-black text-blue-800 italic text-2xl tracking-tighter mt-1 mb-1">VISA</span>
                        ) : method.icon === '🔴🟠' ? (
                          <div className="flex -space-x-2 mt-2 mb-2"><div className="w-5 h-5 bg-red-600 rounded-full mix-blend-multiply"></div><div className="w-5 h-5 bg-yellow-500 rounded-full mix-blend-multiply"></div></div>
                        ) : (
                          <span className="text-2xl mt-1">{method.icon}</span>
                        )}
                        <div>
                          <h4 className="font-bold text-xs text-[#1B6B80]">{method.name}</h4>
                          <p className="text-[9px] font-medium text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MOBILE MONEY DETAILS */}
                  {selectedPaymentMethod.id === 'mobile_money' && (
                    <div className="animate-fade-in border-t border-gray-100 pt-5">
                      <h3 className="text-xs font-bold text-[#1B6B80] mb-3 uppercase tracking-wider flex items-center gap-2"><FiInfo className="text-[#E8A922]" /> Akaunti za Mitandao (Lipa Namba)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="border border-red-200 bg-red-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-lg">M</div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Vodacom M-Pesa</p>
                            <p className="text-xl font-black text-red-600 tracking-wider">52121360</p>
                            <p className="text-[11px] font-bold text-gray-800 mt-0.5">Name | Jtex</p>
                          </div>
                        </div>
                        <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                          <div className="w-12 h-12 bg-[#1B6B80] rounded-full flex items-center justify-center font-black text-[#E8A922] text-sm italic">Mixx</div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Mixx By Yas</p>
                            <p className="text-xl font-black text-[#1B6B80] tracking-wider">7101850</p>
                            <p className="text-[11px] font-bold text-gray-800 mt-0.5">Name | Jtex</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 font-medium">
                        <p className="font-bold text-[#1B6B80] mb-2">Jinsi ya Kulipia kwa M-Pesa:</p>
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
                      <h3 className="text-xs font-bold text-[#1B6B80] mb-3 uppercase tracking-wider flex items-center gap-2"><FiInfo className="text-[#E8A922]" /> Akaunti za Benki</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="border border-blue-200 bg-blue-50/30 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm transition">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-[10px]">NMB</div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">NMB Close to you</p>
                            <p className="text-xl font-black text-blue-700 tracking-wider">23310067430</p>
                            <p className="text-[11px] font-bold text-gray-800 mt-0.5">Jtex Company</p>
                          </div>
                        </div>
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

                  {/* CARDS REDIRECT INFO */}
                  {(selectedPaymentMethod.id === 'visa' || selectedPaymentMethod.id === 'mastercard') && (
                    <div className="animate-fade-in border-t border-gray-100 pt-5 text-center py-4">
                      <p className="text-sm font-bold text-gray-500">You will be redirected to the secure {selectedPaymentMethod.name} gateway to complete this payment.</p>
                    </div>
                  )}

                  <div className="hidden lg:flex gap-3 mt-8 border-t border-gray-100 pt-6">
                    <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-4 bg-gray-100 text-[#1B6B80] font-bold rounded-xl text-sm hover:bg-gray-200 transition">Back</button>
                    <button type="button" onClick={handleWhatsAppOrder} className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
                      <FiPhone className="text-xl" /> Confirm via WhatsApp
                    </button>
                  </div>
                </div>

                <div className="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                  <h2 className="font-black text-base flex items-center gap-2 mb-4 text-[#1B6B80]"><FiList className="text-[#E8A922]" /> Pricing Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>TZS {subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Delivery ({selectedShipping?.name})</span>
                      <span>Negotiable</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-[#1B6B80]">Total Amount</span>
                    <span className="font-black text-xl text-[#1B6B80]">TZS {subtotal.toLocaleString()}</span>
                  </div>

                  {selectedPaymentType.id === 'cod' && (
                    <div className="mt-4 bg-[#E8A922]/10 border border-[#E8A922]/30 rounded-xl flex overflow-hidden">
                      <div className="p-3 w-[45%] flex flex-col justify-center border-r border-[#E8A922]/30 bg-[#E8A922]/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#1B6B80] font-bold mb-1">
                          <span className="w-5 h-5 bg-[#E8A922] text-white rounded flex items-center justify-center"><FiCreditCard size={12} /></span>
                          Advance
                        </div>
                        <div className="font-black text-[#1B6B80] text-sm">TZS {advancePayment.toLocaleString()}</div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-center bg-white">
                        <div className="text-[10px] text-gray-500 font-bold mb-1">Remaining Balance</div>
                        <div className="font-black text-red-600 text-sm">TZS {remainingBalance.toLocaleString()}</div>
                        <div className="text-[8px] text-gray-400 mt-0.5 leading-tight">Balance will be paid upon delivery.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ======================= RIGHT COLUMN (Order Summary - DESKTOP ONLY) ======================= */}
          <div className="hidden lg:block w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h2 className="font-black text-lg text-[#1B6B80]">Order Summary <span className="text-sm font-medium text-gray-500">({cart.length} Items)</span></h2>
                {currentStep < 3 && <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-[#E8A922] hover:text-[#D4981C] transition">Edit Cart ✏️</button>}
              </div>

              <div className="space-y-5 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item: any) => {
                  const displayImage = getImagesArray(item.imageUrl)[0];
                  const qty = getItemQuantity(item);

                  const colorOptions = getColorOptions(item);
                  const activeColor = item.selectedColor || colorOptions[0];

                  return (
                    <div key={item.cartId || item.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-gray-50 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 p-1">
                        {displayImage ? <img src={getImageUrl(displayImage)} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" /> : <span className="text-xl">{item.imageEmoji || '📦'}</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#1B6B80] line-clamp-1 mb-1">{item.name}</h4>

                        <div className="flex items-center gap-2 mb-2">
                          {colorOptions.length > 1 ? (
                            <select
                              value={activeColor || ''}
                              onChange={(e) => handleColorChange(item, e.target.value)}
                              className="text-[10px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-[#E8A922] cursor-pointer"
                            >
                              {colorOptions.map((c: string, i: number) => (
                                <option key={i} value={c}>{c}</option>
                              ))}
                            </select>
                          ) : (
                            activeColor && (
                              <span className="flex items-center gap-1 font-bold uppercase text-[9px] text-gray-600 bg-gray-50 border border-gray-100 px-1 py-0.5 rounded">
                                <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: getColorCode(activeColor) }}></span>
                                {activeColor}
                              </span>
                            )
                          )}

                          <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-gray-50 h-5">
                            <button onClick={() => handleQuantityChange(item, qty - 1)} className="px-1.5 hover:bg-gray-200 text-[#1B6B80] transition h-full flex items-center">
                              <FiMinus size={8} />
                            </button>
                            <span className="px-1.5 text-[10px] font-bold border-x border-gray-200 h-full flex items-center justify-center bg-white text-[#1B6B80] min-w-[20px]">
                              {qty}
                            </span>
                            <button onClick={() => handleQuantityChange(item, qty + 1)} className="px-1.5 hover:bg-gray-200 text-[#1B6B80] transition h-full flex items-center">
                              <FiPlus size={8} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-black text-right flex flex-col justify-start text-gray-900">
                        <span>TZS {(Number(item.price) * qty).toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600 font-medium"><span>Sub Total</span><span>TZS {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery {currentStep > 1 && selectedShipping ? `(${selectedShipping.name})` : ''}</span>
                  <span>Negotiable</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[#1B6B80]">Total Amount</span>
                  <span className="font-black text-xl text-[#1B6B80]">TZS {subtotal.toLocaleString()}</span>
                </div>
              </div>

              {currentStep < 3 && (
                <button
                  onClick={() => {
                    if (currentStep === 1) handleProceedToShipping();
                    else if (currentStep === 2) {
                      if (!formData.fullName || !formData.phone || !formData.address) {
                        alert("Please fill in all required shipping details.");
                        return;
                      }
                      setCurrentStep(3);
                    }
                  }}
                  disabled={cart.length === 0}
                  className="w-full bg-[#E8A922] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#D4981C] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                >
                  {currentStep === 1 ? 'Proceed to Checkout' : 'Continue to Payment'}
                </button>
              )}

              <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium"><FiShield className="text-[#1B6B80]" /> Your information is safe with us</div>
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col items-center gap-1 w-1/3"><FiShield className="text-gray-400 text-lg" /><span className="text-[8px] font-bold text-center">Secure Manual Payment</span></div>
                  <div className="flex flex-col items-center gap-1 w-1/3 border-x border-gray-100"><FiCheckCircle className="text-gray-400 text-lg" /><span className="text-[8px] font-bold text-center">Quality Guarantee</span></div>
                  <div className="flex flex-col items-center gap-1 w-1/3"><FiPhone className="text-gray-400 text-lg" /><span className="text-[8px] font-bold text-center">24/7 Human Support</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
        {currentStep < 3 ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500">Products Total</span>
              <span className="text-sm font-black text-[#1B6B80]">TZS {subtotal.toLocaleString()}</span>
            </div>
            <button
              onClick={() => {
                if (currentStep === 1) handleProceedToShipping();
                else {
                  if (!formData.fullName || !formData.phone || !formData.address) {
                    alert("Please fill in all required shipping details.");
                    return;
                  }
                  setCurrentStep(3);
                }
              }}
              disabled={cart.length === 0}
              className="flex-1 bg-[#E8A922] disabled:bg-gray-300 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-1 shadow-sm transition hover:bg-[#D4981C]"
            >
              {currentStep === 1 ? 'Proceed to Checkout' : 'Continue to Payment'} <FiChevronRight />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#1B6B80] font-bold mb-1">
              <FiShield /> Submit your order safely via WhatsApp
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition hover:bg-[#1EBE5D]"
            >
              <FiPhone className="text-xl" /> Confirm via WhatsApp <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}