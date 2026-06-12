// =============================================================
//  Product data hooks built on top of the API service.
// =============================================================

import {
  getProducts,
  getFeatured,
  getByCategory,
  getProduct
} from '../services/api.js';
import { isTrue } from '../utils/format.js';
import { useFetch } from './useFetch.js';

export function useProducts() {
  const { data, loading, error, reload } = useFetch(getProducts, []);
  const products = (data || []).filter((p) => isTrue(p.active));
  return { products, loading, error, reload };
}

export function useFeatured() {
  const { data, loading, error } = useFetch(getFeatured, []);
  return { products: data || [], loading, error };
}

export function useCategoryProducts(category) {
  const { data, loading, error } = useFetch(
    () => getByCategory(category),
    [category]
  );
  return { products: data || [], loading, error };
}

export function useProductDetails(id) {
  const { data, loading, error } = useFetch(() => getProduct(id), [id]);
  return { product: data, loading, error };
}
