/**
 * createCache — uses a closure to store fetched data + metadata.
 * The inner state (store, fetchCount, lastFetchTime) is private
 * and only accessible via the returned API.
 */
export function createCache(ttlMs = 60_000) {
  // --- closure variables (private state) ---
  const store = {};
  let fetchCount = 0;
  let lastFetchTime = null;

  return {
    get(key) {
      const entry = store[key];
      if (!entry) return null;
      const isExpired = Date.now() - entry.timestamp > ttlMs;
      if (isExpired) {
        delete store[key];
        return null;
      }
      return entry.data;
    },

    set(key, data) {
      store[key] = { data, timestamp: Date.now() };
    },

    recordFetch() {
      fetchCount += 1;
      lastFetchTime = new Date().toLocaleTimeString();
    },

    getStats() {
      return { fetchCount, lastFetchTime };
    },

    has(key) {
      return this.get(key) !== null;
    },
  };
}

// Singleton cache shared across the app
export const productCache = createCache(60_000);
