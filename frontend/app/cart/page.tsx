'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShield, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import TopTicker from '../components/navigation/TopTicker';
import MainHeader from '../components/navigation/MainHeader';
import NavbarLinks from '../components/navigation/NavbarLinks';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jtex-ecommerce-production.up.railway.app';

  useEffect(() => {
    setMounted(true);
  }, []);

  const getFirstImage = (imgData: any) => {
    if (!imgData) return null;
    try {
      const parsed = JSON.parse(imgData);
      const firstImg = Array.isArray(parsed) ? parsed[0] : parsed;
      return firstImg.startsWith('http') ? firstImg : `${API_URL}${firstImg}`;
    } catch(e) {
      return typeof imgData === 'string' && imgData.startsWith('http') ? imgData : `${API_URL}${imgData}`;
    }
  };

  // Kazi ya kusoma idadi halisi (Quantity) ya bidhaa bila kukosa
  const getItemQuantity = (item: any) => {
    return Number(item.quantity || item.quantityToAdd || item.qty || 1);
  };

  // Kusoma Rangi zinazopatikana kwenye Specs ili kuweka kwenye Dropdown ya Cart
  const getColorOptions = (item: any) => {
    let options: string[] = [];
    if (item.specifications) {
      try {
        const parsed = typeof item.specifications === 'string' ? JSON.parse(item.specifications) : item.specifications;
        const rawColor = parsed.Color || parsed.color || parsed.Colors || parsed.colors;
        if (rawColor) {
          options = rawColor.split(/[\/,]/).map((c: string) => c.trim()).filter(Boolean);
        }
      } catch(e) {}
    }
    return options;
  };

  // Kazi ya kubadili rangi hapohapo kwenye kikapu
  const handleColorChange = (item: any, newColor: string) => {
    if (item.selectedColor === newColor) return;
    
    const oldCartId = item.cartId || `${item.id}-${item.selectedColor || 'default'}`;
    const newCartId = `${item.id}-${newColor}`;
    const qty = getItemQuantity(item);

    const updatedItem = {
      ...item,
      selectedColor: newColor,
      cartId: newCartId,
      quantity: qty,
      quantityToAdd: qty,
      qty: qty
    };

    if (removeFromCart) removeFromCart(oldCartId);
    
    // Timeout ndogo inahakikisha item ya zamani inatoka kwanza kabla ya mpya kuingia (kuzuia bugs za React state)
    setTimeout(() => {
      if (addToCart) addToCart(updatedItem);
    }, 0);
  };

  // Kazi ya kuongeza au kupunguza quantity moja kwa moja kwenye Cart imeboreshwa
  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1) return;
    
    const targetCartId = item.cartId || `${item.id}-${item.selectedColor || 'default'}`;
    
    const updatedItem = {
      ...item,
      quantity: newQty,
      quantityToAdd: newQty,
      qty: newQty,
      cartId: targetCartId
    };

    // Tunatoa ile ya zamani kwanza kuzuia Context yetu isifanye + (addition) badala ya update
    if (removeFromCart) removeFromCart(targetCartId);
    
    setTimeout(() => {
      if (addToCart) addToCart(updatedItem);
    }, 0);
  };

  const cartSubtotal = cart?.reduce((acc: number, item: any) => {
    const qty = getItemQuantity(item);
    return acc + (Number(item.price) * qty);
  }, 0) || 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans antialiased flex flex-col">
      <TopTicker />
      <MainHeader />
      <NavbarLinks />

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 my-4">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Shopping Cart</h1>

        {cart?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/" className="bg-[#0A101D] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* UPANDE WA KUSHOTO: Orodha ya Bidhaa */}
            <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              <div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-gray-100 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:grid">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item: any, index: number) => {
                  const imgUrl = getFirstImage(item.imageUrl);
                  const qty = getItemQuantity(item);
                  const itemTotal = Number(item.price) * qty;
                  const uniqueId = item.cartId || `${item.id}-${item.selectedColor || 'default'}` || index; 
                  
                  const colorOptions = getColorOptions(item);

                  return (
                    <div key={uniqueId} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-gray-50/50 transition">
                      
                      <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-gray-100 p-1.5 overflow-hidden flex-shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <span className="text-3xl">📦</span>
                          )}
                        </div>
                        <div>
                          <Link href={`/product/${item.id}`} className="font-bold text-sm text-gray-900 hover:text-blue-600 transition line-clamp-2">
                            {item.name}
                          </Link>
                          
                          {/* DROPDOWN YA RANGI BADALA YA STATIC TEXT */}
                          {colorOptions.length > 0 ? (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[11px] font-bold text-gray-500 uppercase">Color:</span>
                              <select
                                value={item.selectedColor || colorOptions[0]}
                                onChange={(e) => handleColorChange(item, e.target.value)}
                                className="text-[11px] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 outline-none focus:border-[#F2A900] cursor-pointer"
                              >
                                {colorOptions.map((c: string, i: number) => (
                                  <option key={i} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            item.selectedColor && (
                              <p className="text-[11px] font-medium text-gray-500 mt-1 uppercase">Color: <span className="font-bold text-gray-800">{item.selectedColor}</span></p>
                            )
                          )}

                          <p className="text-xs font-bold text-[#F2A900] mt-1.5">TZS {Number(item.price).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Vitufe vya Kupunguza na Kuongeza Idadi (SASA VINAFANYA KAZI BILA ERROR) */}
                      <div className="col-span-1 sm:col-span-3 flex items-center sm:justify-center mt-2 sm:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-gray-50">
                          <button 
                            onClick={() => handleQuantityChange(item, qty - 1)}
                            className="px-3 hover:bg-gray-200 text-gray-600 transition h-full flex items-center"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-4 text-sm font-bold border-x border-gray-200 h-full flex items-center justify-center min-w-[45px] bg-white text-gray-900">
                            {qty}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item, qty + 1)}
                            className="px-3 hover:bg-gray-200 text-gray-600 transition h-full flex items-center"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                        <div className="flex flex-col items-end">
                           <span className="font-black text-[#0A101D]">TZS {itemTotal.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => {
                            if(removeFromCart) removeFromCart(uniqueId);
                          }} 
                          className="ml-5 p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                          title="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      
                    </div>
                  );
                })}
              </div>

              <div className="p-4 md:p-6 flex justify-between items-center bg-gray-50 border-t border-gray-100">
                <Link href="/" className="text-sm font-bold text-[#0A101D] hover:text-[#F2A900] transition flex items-center gap-2">
                  <FiArrowLeft size={16}/> Continue Shopping
                </Link>
              </div>
            </div>

            {/* UPANDE WA KULIA: Order Summary */}
            <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-black text-[#0A101D] mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal ({cart.reduce((acc:any, i:any)=> acc + getItemQuantity(i), 0)} items):</span>
                  <span className="font-bold text-gray-900">TZS {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Discount:</span>
                  <span className="font-bold text-gray-400">- TZS 0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Shipping:</span>
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-500">Total:</span>
                <span className="text-2xl font-black text-[#0A101D]">TZS {cartSubtotal.toLocaleString()}</span>
              </div>

              <Link href="/checkout" className="w-full bg-[#F2A900] text-[#0A101D] text-sm font-black py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02]">
                Proceed to Checkout <FiArrowRight size={18} />
              </Link>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <FiShield size={14} />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}