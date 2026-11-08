// Reads product data for Suspense. The pages call these hooks during render;
// use() shows the Suspense fallback while the promise is pending and re-throws
// to the nearest Error Boundary if it rejects. invalidate… drops the cached
// promise so "Try again" starts a fresh load.
import { use } from "react";
import { createCache } from "../../shared/api/suspenseCache.ts";
import { getProduct, getProducts } from "./products.api.ts";
import { getRelatedProducts } from "./products.logic.ts";
import type { Product } from "./products.types.ts";

// The product list has no id, so one fixed key holds its single promise
const LIST_KEY = "all";

// One product and the others in its category. product is null when no product
// has that id (a value, not an error: the page shows "not found").
export type ProductDetail =
  { product: null } | { product: Product; related: readonly Product[] };

const listCache = createCache<string, readonly Product[]>(() => getProducts());

const detailCache = createCache<number, ProductDetail>(async (id) => {
  // The list is only for related items, so a failed list falls back to none
  const [product, all] = await Promise.all([
    getProduct(id),
    getProducts().catch((): readonly Product[] => []),
  ]);
  if (product === null) return { product: null };
  return { product, related: getRelatedProducts([...all], product, 4) };
});

// Reads the whole product list (suspends while loading, throws on failure)
export function useProductList(): readonly Product[] {
  return use(listCache.get(LIST_KEY));
}

// Reads one product and its related items by id
export function useProductDetail(id: number): ProductDetail {
  return use(detailCache.get(id));
}

export function invalidateProductList(): void {
  listCache.invalidate();
}

export function invalidateProductDetail(id: number): void {
  detailCache.invalidate(id);
}
