// =============================================================
//  GROZO — Global configuration
//  The ONLY place you need to edit after deploying Apps Script.
//  Paste your Web App URL below (ends with /exec).
// =============================================================

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'https://script.google.com/macros/s/AKfycbwX543Oe6Tm9LQ7-FMrzJfLqFPirjRwqi4TY_sXrzlY-uIUDwwPPUy8Syqs4U0jipT3-g/exec';

// How long (ms) to keep API responses cached in memory.
// Keeps the site fast and reduces Apps Script calls.
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Fallbacks used ONLY if the Settings sheet is unreachable.
// These are not product data — just safe UI defaults.
export const FALLBACK_SETTINGS = {
  site_name: 'GROZO',
  phone: '',
  whatsapp: '',
  address: '',
  delivery_message: 'No Delivery Charges',
  hero_title: 'Fresh From Farmer',
  hero_subtitle: 'Direct Farm Fresh Vegetables & Fruits'
};
