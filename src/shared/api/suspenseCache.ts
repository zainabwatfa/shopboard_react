// A small promise cache for reading async data with React's use() under
// Suspense. use() suspends on a pending promise and re-throws a rejected one,
// so it needs the SAME promise reference on every render: this cache keeps one
// promise per key until it is invalidated. "Try again" invalidates, which
// drops the (often rejected) promise so the next read starts a fresh load.

export interface Cache<K> {
  // The cached promise for this key, created on first use
  get(key: K): Promise<unknown>;
  // Drop one key, or every key when called with no argument, so it reloads
  invalidate(key?: K): void;
}

export interface TypedCache<K, V> {
  get(key: K): Promise<V>;
  invalidate(key?: K): void;
}

// load turns a key into the promise to cache. The key is reduced to a string
// for the map, so numbers and strings both work as keys.
export function createCache<K, V>(
  load: (key: K) => Promise<V>,
): TypedCache<K, V> {
  const promises = new Map<string, Promise<V>>();

  return {
    get(key: K): Promise<V> {
      const id = String(key);
      const existing = promises.get(id);
      if (existing !== undefined) return existing;
      const created = load(key);
      promises.set(id, created);
      return created;
    },
    invalidate(key?: K): void {
      if (key === undefined) {
        promises.clear();
      } else {
        promises.delete(String(key));
      }
    },
  };
}
