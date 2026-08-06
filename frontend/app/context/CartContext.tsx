'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('jtex_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jtex_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => (i.cartId || i.id) === (item.cartId || item.id));
      if (existing) {
        return prev.map(i => (i.cartId || i.id) === (item.cartId || item.id)
          ? { ...i, quantity: i.quantity + (item.quantityToAdd || 1), qty: i.quantity + (item.quantityToAdd || 1) }
          : i);
      }
      return [...prev, { ...item, quantity: item.quantityToAdd || 1, qty: item.quantityToAdd || 1, cartId: item.cartId || item.id }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => (item.cartId || item.id) !== cartId));
  };

  const clearCart = () => setCart([]);

  // ========================================================
  // MPYA: Function ya kuongeza/kupunguza Idadi papo hapo
  // ========================================================
  const updateQuantity = (cartId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item =>
      (item.cartId || item.id) === cartId
        ? { ...item, quantity: newQty, qty: newQty, quantityToAdd: newQty }
        : item
    ));
  };

  // ========================================================
  // MPYA: Function ya kubadilisha Rangi papo hapo
  // ========================================================
  const updateItemColor = (oldCartId: string, newColor: string, originalId: string) => {
    setCart(prev => {
      const newCartId = `${originalId}-${newColor}`;
      const exists = prev.find(i => i.cartId === newCartId && i.cartId !== oldCartId);

      if (exists) {
        // Kama rangi aliyochagua tayari ipo kwenye cart, unganisha idadi
        const oldItem = prev.find(i => (i.cartId || i.id) === oldCartId);
        const extraQty = oldItem ? (oldItem.quantity || 1) : 0;
        return prev.map(i => i.cartId === newCartId
          ? { ...i, quantity: i.quantity + extraQty, qty: i.quantity + extraQty }
          : i).filter(i => (i.cartId || i.id) !== oldCartId);
      } else {
        // Badilisha rangi tu bila kuathiri mengine
        return prev.map(item =>
          (item.cartId || item.id) === oldCartId
            ? { ...item, selectedColor: newColor, cartId: newCartId }
            : item
        );
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, updateItemColor }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);