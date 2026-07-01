import { calculateDiscounts } from './discountLogic.js';

export const CART_STORAGE_KEY = 'control_center_cart';

export function readCart() {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function writeCart(items) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('control-center-cart-updated'));
}

export function addToCart(product, qty = 1) {
  const items = readCart();
  const existing = items.find((item) => item.id === product.id);
  if (existing) existing.qty += qty;
  else items.push({ ...product, qty });
  writeCart(items);
  return items;
}

export function removeFromCart(id) {
  const items = readCart().filter((item) => item.id !== id);
  writeCart(items);
  return items;
}

export function updateCartQty(id, qty) {
  if (qty <= 0) return removeFromCart(id);
  const items = readCart().map((item) => (item.id === id ? { ...item, qty } : item));
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}

export function summarizeCart(items = readCart()) {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.precio) || 0) * (Number(item.qty) || 1), 0);
  const discounts = calculateDiscounts(items);
  return {
    count: items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0),
    subtotal,
    discount: discounts.totalDiscount,
    chargerCablePairs: discounts.chargerCablePairs,
    total: Math.max(0, subtotal - discounts.totalDiscount),
  };
}
