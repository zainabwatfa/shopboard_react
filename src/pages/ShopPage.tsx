import { useMemo, useRef } from "react";
import { Hero } from "../features/products/components/Hero.tsx";
import { ProductGrid } from "../features/products/components/ProductGrid.tsx";
import { ShopFilters } from "../features/products/components/ShopFilters.tsx";
import { StatusMessage } from "../shared/components/StatusMessage.tsx";
import type { StatusMessageProps } from "../shared/components/StatusMessage.tsx";
import { Toast } from "../shared/components/Toast.tsx";
import { useCart } from "../features/cart/hooks/useCart.ts";
import { useFilters } from "../features/products/hooks/useFilters.ts";
import { useProducts } from "../features/products/hooks/useProducts.ts";
import { useToast } from "../shared/hooks/useToast.ts";
import { HERO_TILES } from "../features/products/hero.ts";
import type { HeroTile } from "../features/products/hero.ts";
import { getAddedMessage, getResultsStatus } from "../lib/messages.ts";
import { getItemQty } from "../features/cart/cart.logic.ts";
import {
  DEFAULT_FILTERS,
  filterProducts,
  sortProducts,
} from "../features/products/products.logic.ts";
import type { Product } from "../features/products/products.types.ts";

// One empty list for "no products yet", so it is the same list on every render
const NO_PRODUCTS: readonly Product[] = [];

// The shop (index.html): the hero, then search, category filter, sort and the product cards.
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

  // A hero tile: search for that product (other filters reset) and move
  // focus to the search box, which also scrolls the list into view
  function handlePickTile(tile: HeroTile): void {
    setFilters({ ...DEFAULT_FILTERS, query: tile.name });
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
      <Hero
        tiles={HERO_TILES}
        productCount={products.length}
        onPick={handlePickTile}
      />

      <div className="page-head">
        <p className="eyebrow">The collection</p>
        <h2 id="products-title">
          Find your next <em>favourite</em>
        </h2>
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
