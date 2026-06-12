// =============================================================
//  Cart context — manages the shopping cart across the app.
//  Variant-aware: the same product in two different sizes/units
//  becomes two separate lines. Persists to sessionStorage so a
//  refresh keeps the cart while staying private to the tab.
// =============================================================

import { createContext, useContext, useReducer, useEffect } from 'react';
import { effectivePrice, unitLabel } from '../utils/format.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'grozo_cart';

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Build a normalized cart line from a product + an optional chosen variant.
// variant = { label, price, offer_price } | null
function makeLine(product, qty, variant) {
  const isVariant = !!variant;

  // What we show in parentheses after the name in cart/checkout/WhatsApp.
  // - variant products   -> the variant label ("1kg", "500g", "2 Pieces")
  // - non-variant w/ pack -> the unit label only when it carries info
  //   (e.g. "500g", "250 ml"); a plain value-of-1 unit (kg/piece) is shown
  //   in the price line instead, so we leave the tag blank.
  const uLabel = unitLabel(product);
  const valNum = Number(product.unitValue);
  const baseHasInfo = Number.isFinite(valNum) && valNum > 0 && valNum !== 1;
  const variantLabel = isVariant ? variant.label : baseHasInfo ? uLabel : '';

  const price = isVariant ? variant.price : product.price;
  const offer_price = isVariant ? variant.offer_price : product.offer_price;

  return {
    key: `${product.id}::${isVariant ? variant.label : 'base'}`,
    id: product.id,
    name: product.name,
    tamil_name: product.tamil_name,
    image: product.image,
    unitType: product.unitType || product.unit || '',
    unitValue: product.unitValue || '',
    isVariant,
    variant: variantLabel, // display tag, may be ''
    price,
    offer_price: offer_price === undefined ? '' : offer_price,
    qty
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, qty, variant } = action;
      const line = makeLine(product, qty, variant);
      const existing = state.find((i) => i.key === line.key);
      if (existing) {
        return state.map((i) =>
          i.key === line.key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...state, line];
    }
    case 'SET_QTY': {
      const qty = Math.max(1, action.qty);
      return state.map((i) => (i.key === action.key ? { ...i, qty } : i));
    }
    case 'REMOVE':
      return state.filter((i) => i.key !== action.key);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable; cart still works in memory */
    }
  }, [items]);

  // variant is optional: addItem(product, qty, { label, price, offer_price })
  const addItem = (product, qty = 1, variant = null) =>
    dispatch({ type: 'ADD', product, qty, variant });
  const setQty = (key, qty) => dispatch({ type: 'SET_QTY', key, qty });
  const removeItem = (key) => dispatch({ type: 'REMOVE', key });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + effectivePrice(i) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, setQty, removeItem, clearCart, count, total }}
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
