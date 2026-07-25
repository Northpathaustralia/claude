import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, stockFor } from '../data/products.js';

const StoreContext = createContext(null);

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const usePersistent = (key, initial) => {
  const [value, setValue] = useState(() => load(key, initial));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
  }, [key, value]);
  return [value, setValue];
};

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersistent('ts.cart', []); // {productId, colour, size, qty}
  const [recent, setRecent] = usePersistent('ts.recent', []); // productIds, newest first
  const [vip, setVip] = usePersistent('ts.vip', null); // {email, sms?}
  const [restockRequests, setRestockRequests] = usePersistent('ts.restock', []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [account, setAccount] = usePersistent('ts.account', null); // {name,email} demo only

  const addToCart = (productId, colour, size, qty = 1) => {
    const product = getProduct(productId);
    const available = stockFor(product, colour, size);
    if (available <= 0) return false;
    setCart((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.colour === colour && l.size === size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, available) };
        return next;
      }
      return [...prev, { productId, colour, size, qty: Math.min(qty, available) }];
    });
    setCartOpen(true);
    return true;
  };

  const updateQty = (index, qty) =>
    setCart((prev) =>
      qty <= 0 ? prev.filter((_, i) => i !== index) : prev.map((l, i) => (i === index ? { ...l, qty } : l)),
    );

  const removeLine = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  const touchRecent = (productId) =>
    setRecent((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));

  const requestRestock = (productId, colour, size, email) =>
    setRestockRequests((prev) => [...prev, { productId, colour, size, email, at: Date.now() }]);

  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  const cartTotal = cart.reduce((a, l) => a + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);

  const value = useMemo(
    () => ({
      cart, addToCart, updateQty, removeLine, clearCart, cartCount, cartTotal,
      cartOpen, setCartOpen, searchOpen, setSearchOpen,
      recent, touchRecent, vip, setVip, restockRequests, requestRestock,
      account, setAccount,
    }),
    [cart, cartOpen, searchOpen, recent, vip, restockRequests, account, cartCount, cartTotal],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
