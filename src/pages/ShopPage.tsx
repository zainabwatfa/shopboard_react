import { useMemo, useRef } from "react";
import { ProductGrid } from "../components/ProductGrid.tsx";
import { ShopFilters } from "../components/ShopFilters.tsx";
import { StatusMessage } from "../components/StatusMessage.tsx";
import type { StatusMessageProps } from "../components/StatusMessage.tsx";
import { Toast } from "../components/Toast.tsx";
import { useCart } from "../hooks/useCart.ts";
import { useFilters } from "../hooks/useFilters.ts";
import { useProducts } from "../hooks/useProducts.ts";
import { useToast } from "../hooks/useToast.ts";
import { getAddedMessage, getResultsStatus } from "../lib/messages.ts";
import { getItemQty } from "../modules/cart/cart.logic.ts";
import {
  DEFAULT_FILTERS,
  filterProducts,
  sortProducts,
} from "../modules/products/products.logic.ts";
import type { Product } from "../modules/products/products.types.ts";

// One empty list for "no products yet", so it is the same list on every render
const NO_PRODUCTS: readonly Product[] = [];

// The shop (index.html): search, category filter, sort and the product cards.
// index.html?q=tote&category=Bags&sort=price-asc opens with those filters.
export function ShopPage() {
  const { actions } = useCart();
  const { state, retry } = useProducts((products) =>
    actions.keepOnly(products.map((product) => product.id)),
  );
  const [filters, setFilters] = useFilters();
  const { toast, showToast, dismissToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const products = state.status === "ready" ? state.products : NO_PRODUCTS;
  // Filter first, then sort a copy (sortProducts never changes its input)
  const shown = useMemo(
    () =>
      sortProducts(
        filterProducts(products, filters.query, filters.category),
        filters.sortKey,
      ),
    [products, filters],
  );

  function handleAdd(product: Product): void {
    const cart = actions.add(product.id);
    showToast(getAddedMessage(product.name, getItemQty(cart, product.id)), {
      label: "View cart",
      href: "cart.html",
    });
  }

  // "Clear filters" (shown when nothing matches): everything again, and
  // keyboard focus in the search box, ready for a new search
  function handleClearFilters(): void {
    setFilters(DEFAULT_FILTERS);
    searchRef.current?.focus();
  }

  function getStatus(): StatusMessageProps {
    switch (state.status) {
      case "loading":
        return {
          id: "product-status",
          tone: "normal",
          message: "Loading products…",
        };
      case "error":
        return {
          id: "product-status",
          tone: "error",
          message: state.message,
          action: { label: "Try again", onClick: retry },
        };
      case "ready": {
        const results = getResultsStatus(shown.length, products.length);
        return {
          id: "product-status",
          tone: results.tone,
          message: results.message,
          action: results.offerClear
            ? { label: "Clear filters", onClick: handleClearFilters }
            : undefined,
        };
      }
    }
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">The collection</p>
        <h1 id="products-title">
          Find your next <em>favourite</em>
        </h1>
        <p>
          Search by name, filter by category or sort by price. Everything you
          add waits in your cart.
        </p>
      </div>

      <section aria-labelledby="products-title">
        <ShopFilters
          filters={filters}
          onChange={setFilters}
          disabled={state.status === "error"}
          searchRef={searchRef}
        />
        <StatusMessage {...getStatus()} />
        <ProductGrid products={shown} onAdd={handleAdd} />
      </section>

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
