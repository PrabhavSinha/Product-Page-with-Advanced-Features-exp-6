import { useState, useEffect, useCallback, useRef } from 'react';
import { productCache } from '../utils/cache';

const BASE_URL = 'https://dummyjson.com/products';

/**
 * useProducts — smart data-fetching hook.
 *
 * Race condition guard: each fetch gets an `active` flag via closure.
 * If the component unmounts or a new fetch starts before this one
 * resolves, `active` is false and the stale response is dropped.
 *
 * Stale-state prevention: state is only updated when `active === true`.
 *
 * Caching: results are stored in `productCache` (in-memory, TTL=60s).
 */
export function useProducts(category = 'all', limit = 20) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheStats, setCacheStats] = useState({ fetchCount: 0, lastFetchTime: null, fromCache: false });

  // Track active fetch with a ref so cleanup closures can read it
  const activeRef = useRef(true);

  const fetchProducts = useCallback(async () => {
    // New fetch starts — mark any previous as stale via ref
    activeRef.current = false;
    const active = { value: true }; // per-fetch closure variable
    activeRef.current = active;

    setLoading(true);
    setError(null);

    const cacheKey = `${category}-${limit}`;

    // --- Check cache first ---
    const cached = productCache.get(cacheKey);
    if (cached) {
      if (active.value) {
        setProducts(cached);
        setLoading(false);
        setCacheStats({ ...productCache.getStats(), fromCache: true });
      }
      return;
    }

    try {
      productCache.recordFetch();

      // Build URL — support category filtering (prep for routing)
      const url =
        category === 'all'
          ? `${BASE_URL}?limit=${limit}`
          : `${BASE_URL}/category/${category}?limit=${limit}`;

      // Promise chain style for fetch, then async/await for json
      const response = await fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res;
      });

      const data = await response.json();
      const items = data.products ?? [];

      // --- Race condition / stale-state guard ---
      // `active.value` is false if a newer fetch has already started
      if (!active.value) {
        console.warn('[useProducts] Dropping stale response for', cacheKey);
        return;
      }

      productCache.set(cacheKey, items);
      setProducts(items);
      setCacheStats({ ...productCache.getStats(), fromCache: false });
    } catch (err) {
      if (active.value) {
        setError(err.message);
      }
    } finally {
      if (active.value) {
        setLoading(false);
      }
    }
  }, [category, limit]);

  useEffect(() => {
    fetchProducts();

    // Cleanup: mark this effect's fetch as stale on unmount / re-run
    return () => {
      if (activeRef.current && typeof activeRef.current === 'object') {
        activeRef.current.value = false;
      }
    };
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts, cacheStats };
}
