import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { getLoadErrorMessage } from "../lib/messages.ts";
import { getProducts } from "../modules/products/products.api.ts";
import type { Product } from "../modules/products/products.types.ts";

// One of three: still loading, failed (with the message to show), or loaded
export type ProductsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; products: readonly Product[] };

export interface ProductsResult {
  state: ProductsState;
  // "Try again": loads the list again, without reloading the page
  retry: () => void;
}

// Loads the product list from the API (products.api.ts). onLoad runs once
// after each load that worked, before the list is shown: the pages use it to
// drop cart items whose product no longer exists (cart keepOnly).
export function useProducts(
  onLoad: (products: readonly Product[]) => void,
): ProductsResult {
  const [state, setState] = useState<ProductsState>({ status: "loading" });
  // Each "Try again" adds 1, which starts the effect below again
  const [attempt, setAttempt] = useState(0);
  const handleLoad = useEffectEvent(onLoad);

  useEffect(() => {
    // False once this load no longer matters (the page left, or a newer load
    // started), so an old answer never overwrites a newer one
    let current = true;
    getProducts().then(
      (products) => {
        if (!current) return;
        handleLoad(products);
        setState({ status: "ready", products });
      },
      (error: unknown) => {
        if (!current) return;
        console.error(error);
        setState({ status: "error", message: getLoadErrorMessage(error) });
      },
    );
    return () => {
      current = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  return { state, retry };
}
