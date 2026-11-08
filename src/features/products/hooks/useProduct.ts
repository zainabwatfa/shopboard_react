import { useCallback, useEffect, useState } from "react";
import { getLoadErrorMessage } from "../../../lib/messages.ts";
import { getProduct, getProducts } from "../products.api.ts";
import { getRelatedProducts } from "../products.logic.ts";
import type { Product } from "../products.types.ts";

const EMPTY_PRODUCTS: readonly Product[] = [];

// Product detail page state: loading, error, not found, or successfully loaded
export type ProductDetailState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      product: Product;
      related: readonly Product[];
    };

export interface ProductDetailResult {
  state: ProductDetailState;
  retry: () => void;
}

// Loads one product from the API by its id, plus related products in the same category
export function useProduct(id: number | null): ProductDetailResult {
  const [asyncState, setAsyncState] = useState<ProductDetailState>({
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (id === null) return;

    let current = true;

    Promise.all([
      getProduct(id),
      getProducts().catch((): readonly Product[] => EMPTY_PRODUCTS),
    ]).then(
      ([product, allProducts]) => {
        if (!current) return;
        if (product === null) {
          setAsyncState({ status: "not-found" });
        } else {
          const related = getRelatedProducts(allProducts, product, 4);
          setAsyncState({ status: "ready", product, related });
        }
      },
      (error: unknown) => {
        if (!current) return;
        console.error(error);
        setAsyncState({ status: "error", message: getLoadErrorMessage(error) });
      },
    );

    return () => {
      current = false;
    };
  }, [id, attempt]);

  const retry = useCallback(() => {
    setAsyncState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  // Derive not-found during render if id is invalid or missing
  if (id === null) {
    return { state: { status: "not-found" }, retry };
  }

  return { state: asyncState, retry };
}
