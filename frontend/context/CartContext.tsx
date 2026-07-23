'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Aina ya data za kwenye Kikapu (Cart Item)
type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  cartId: string; // ID mpya inayochanganya product.id na selectedColor
  selectedColor?: string; // Rangi iliyochaguliwa
  quantity: number; // Idadi
  [key: string]: any; // Data zingine kama specs, nk.
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Pakia cart kutoka LocalStorage mara tu page inapofunguka
  useEffect(() => {
    const storedCart = localStorage.getItem('jtex_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Kosa kusoma cart kutoka local storage', e);
      }
    }
  }, []);

  // Hifadhi Cart kwenye LocalStorage kila inabadilika
  useEffect(() => {
    localStorage.setItem('jtex_cart', JSON.stringify(cart));
  }, [cart]);

  // Kuongeza Bidhaa (Inatambua Quantity na Rangi)
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      // Tunatengeneza unique ID kulingana na product id na rangi aliyochagua
      const colorKey = product.selectedColor || 'default';
      const cartId = `${product.id}-${colorKey}`;
      
      // Kiasi anachotaka kuongeza alichochagua kutoka ProductDetail
      const qtyToAdd = Number(product.quantityToAdd || product.quantity || 1);

      // Angalia kama bidhaa ya rangi hii ipo tayari kwenye cart
      const existingItemIndex = prevCart.findIndex(item => item.cartId === cartId);

      if (existingItemIndex !== -1) {
        // Ipo tayari, ongeza idadi (quantity)
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += qtyToAdd;
        return updatedCart;
      } else {
        // Haipo, iweke kama mpya kwenye cart
        return [...prevCart, { 
            ...product, 
            cartId, 
            quantity: qtyToAdd,
            selectedColor: product.selectedColor 
        }];
      }
    });
  };

  // Kutoa Bidhaa Kwenye Cart
  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.cartId !== cartId));
  };

  // Kubadilisha Idadi Moja Kwa Moja Ukiwa Ndani Ya Cart Page (+ / - buttons)
  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  // Kufuta Cart Yote (Kama baada ya malipo)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart lazima itumike ndani ya CartProvider');
  }
  return context;
}