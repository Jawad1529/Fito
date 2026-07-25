'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorageState('fito_cart', []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const existing = items.find((item) => item.id === product.id);
      const next = existing
        ? items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [
            ...items,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
            },
          ];
      setItems(next);
    },
    [items, setItems]
  );

  const removeFromCart = useCallback(
    (id) => {
      setItems(items.filter((item) => item.id !== id));
    },
    [items, setItems]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      if (quantity <= 0) {
        setItems(items.filter((item) => item.id !== id));
        return;
      }
      setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [items, setItems]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const isInCart = useCallback((id) => items.some((item) => item.id === id), [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
    }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return ctx;
}
