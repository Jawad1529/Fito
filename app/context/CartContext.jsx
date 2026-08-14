'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorageState('Fitoo_cart', []);

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
            // Charges the discounted amount automatically wherever a product
            // has an active discount — see Product.model.js/toPublicProduct.
            price: product.discountedPrice ?? product.price,
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

  // Derived in one pass and memoized — this context sits above every page, so
  // it re-runs on any ancestor render otherwise.
  const { totalItems, totalPrice } = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.totalItems += item.quantity;
          acc.totalPrice += item.quantity * item.price;
          return acc;
        },
        { totalItems: 0, totalPrice: 0 }
      ),
    [items]
  );

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
