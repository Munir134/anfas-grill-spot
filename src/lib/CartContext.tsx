import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AnfasCartItem, WaselProduct } from './wasel';

interface CartContextType {
  items: AnfasCartItem[];
  addItem: (item: Omit<AnfasCartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItemCount: number;
  subtotal: number;
  
  // Customizer modal state
  activeModalProduct: WaselProduct | null;
  openCustomizer: (product: WaselProduct) => void;
  closeCustomizer: () => void;

  // Live Order tracking modal state
  activeTrackingToken: string | null;
  openTracking: (token: string) => void;
  closeTracking: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'anfas_cart_v1';
const TRACKING_STORAGE_KEY = 'anfas_active_order_token';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AnfasCartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<WaselProduct | null>(null);
  const [activeTrackingToken, setActiveTrackingToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TRACKING_STORAGE_KEY) || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist Anfas cart:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (activeTrackingToken) {
        localStorage.setItem(TRACKING_STORAGE_KEY, activeTrackingToken);
      } else {
        localStorage.removeItem(TRACKING_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist Anfas tracking token:', e);
    }
  }, [activeTrackingToken]);

  const addItem = (item: Omit<AnfasCartItem, 'cartItemId'>) => {
    // Generate deterministic ID based on product + selected modifiers
    const modKey = item.selectedOptions
      .map((o) => o.optionId)
      .sort()
      .join('-');
    const cartItemId = `${item.productId}_${modKey}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, cartItemId }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as AnfasCartItem[]
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCustomizer = (product: WaselProduct) => {
    setActiveModalProduct(product);
  };

  const closeCustomizer = () => {
    setActiveModalProduct(null);
  };

  const openTracking = (token: string) => {
    setActiveTrackingToken(token);
  };

  const closeTracking = () => {
    setActiveTrackingToken(null);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const modTotal = item.selectedOptions.reduce((mSum, opt) => mSum + opt.price, 0);
    return sum + (item.unitPrice + modTotal) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItemCount,
        subtotal,
        activeModalProduct,
        openCustomizer,
        closeCustomizer,
        activeTrackingToken,
        openTracking,
        closeTracking,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
