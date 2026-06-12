// =============================================================
//  GROZO — API service layer
//  Talks to the Google Apps Script Web App. Everything dynamic.
//  Includes a tiny in-memory cache so repeat views are instant.
// =============================================================

import { API_BASE, CACHE_TTL } from '../config.js';

const cache = new Map(); // key -> { time, data }

function cacheGet(key) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < CACHE_TTL) return hit.data;
  return null;
}

function cacheSet(key, data) {
  cache.set(key, { time: Date.now(), data });
}

export function clearCache() {
  cache.clear();
}

// Core GET helper. Apps Script returns { ok, data } envelopes.
async function apiGet(params, { useCache = true } = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}?${qs}`;

  if (useCache) {
    const cached = cacheGet(url);
    if (cached) return cached;
  }

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  if (json && json.ok === false) {
    throw new Error(json.error || 'API returned an error');
  }
  const data = json.data !== undefined ? json.data : json;
  if (useCache) cacheSet(url, data);
  return data;
}

// ---- Read endpoints ----
export const getProducts = () => apiGet({ action: 'products' });
export const getProduct = (id) => apiGet({ action: 'product', id });
export const getCategories = () => apiGet({ action: 'categories' });
export const getBanners = () => apiGet({ action: 'banners' });
export const getSettings = () => apiGet({ action: 'settings' });
export const getFeatured = () => apiGet({ action: 'featured' });
export const searchProducts = (q) =>
  apiGet({ action: 'search', q }, { useCache: false });
export const getByCategory = (category) =>
  apiGet({ action: 'category', category });

// ---- Write endpoint: save order ----
// Apps Script Web Apps don't support custom CORS preflight headers well,
// so we POST as text/plain (a "simple request") to avoid the OPTIONS
// preflight entirely. The body is JSON the server parses.
export async function saveOrder(order) {
  const url = `${API_BASE}?action=saveOrder`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error(`Order failed (${res.status})`);
  const json = await res.json();
  if (json && json.ok === false) throw new Error(json.error || 'Order failed');
  return json.data !== undefined ? json.data : json;
}
