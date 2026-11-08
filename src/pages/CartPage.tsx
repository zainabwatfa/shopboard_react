import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CartItemRow } from "../features/cart/components/CartItemRow.tsx";
import { CartSummary } from "../features/cart/components/CartSummary.tsx";
import { DataBoundary } from "../shared/components/DataBoundary.tsx";
import { useAnnouncer } from "../shared/hooks/useAnnouncer.ts";
import { useCart } from "../features/cart/hooks/useCart.ts";
import { useProductList } from "../features/products/products.resource.ts";
import { invalidateProductList } from "../features/products/products.resource.ts";
import { useStorageSync } from "../shared/hooks/useStorageSync.ts";
import {
  describeCartChange,
  getLoadErrorMessage,
  withSavedItems,
} from "../lib/messages.ts";
import {
  getCartCount,
  getCartLines,
  getCartTotal,
  getItemQty,
} from "../features/cart/cart.logic.ts";
import type { CartChange, CartItem } from "../features/cart/cart.types.ts";
import type { Product } from "../features/products/products.types.ts";

// The cart (/cart). Prices need the product data, so the rows load through
// DataBoundary; a load error keeps the "your saved items are kept" wording.
export function CartPage() {
  const { state: cart } = useCart();

  return (
    <DataBoundary
      statusId="cart-status"
      loadingMessage="Loading your cart…"
      onRetry={invalidateProductList}
      formatError={(error) =>
        withSavedItems(getLoadErrorMessage(error), cart.count)
      }
    >
      <CartContent />
    </DataBoundary>
  );
}

// The rows (+ / − / Remove), the summary, and Clear cart. Prices always come
// from the product data; the saved cart only has { id, qty }.
function CartContent() {
  const products = useProductList();
  const { state: cart, actions } = useCart();
  const { announcement, announce } = useAnnouncer();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Once the products are known, drop cart items whose product no longer exists
  useEffect(() => {
    actions.keepOnly(products.map((product) => product.id));
  }, [products, actions]);

  const lines = getCartLines(cart.items, products);
  const total = getCartTotal(cart.items, products);

  // Another tab can remove the row that has keyboard focus. Remember what had
  // focus before that change is drawn; if it is gone afterwards, focus the
  // heading instead of losing focus.
  const focusBeforeSync = useRef<Element | null>(null);
  useStorageSync(() => {
    focusBeforeSync.current = document.activeElement;
  });
  useLayoutEffect(() => {
    const focused = focusBeforeSync.current;
    focusBeforeSync.current = null;
    if (focused instanceof HTMLElement && !focused.isConnected) {
      headingRef.current?.focus();
    }
  });

  // Says what changed (items is the cart after the change), for screen reader users
  function announceChange(
    change: CartChange,
    items: readonly CartItem[],
  ): void {
    announce(
      describeCartChange(change, {
        count: getCartCount(items),
        total: getCartTotal(items, products),
      }),
    );
  }

  // + and −. A quantity never reaches 0: − on 1 removes the product (cart.state).
  function handleChangeQty(product: Product, delta: 1 | -1): void {
    const items = actions.changeQty(product.id, delta);
    const qty = getItemQty(items, product.id);
    if (qty > 0) {
      announceChange({ type: "quantity", name: product.name, qty }, items);
      return;
    }
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus();
  }

  function handleRemove(product: Product): void {
    const items = actions.remove(product.id);
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus();
  }

  // Clearing removes every row at once and can't be undone, so ask first.
  function handleClear(): void {
    if (!window.confirm("Remove all items from your cart?")) return;
    const items = actions.clear();
    announceChange({ type: "cleared" }, items);
    headingRef.current?.focus();
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Your bag</p>
        <h1 id="cart-title" ref={headingRef} tabIndex={-1}>
          Your <em>cart</em>
        </h1>
      </div>

      <p id="cart-announcer" className="visually-hidden" role="status">
        {announcement}
      </p>

      {lines.length === 0 ? (
        <div id="cart-empty" className="cart-empty-state">
          <p>Your cart is empty.</p>
          <Link className="button" to="/">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul id="cart-list" className="cart-list" aria-labelledby="cart-title">
            {lines.map((line) => (
              <CartItemRow
                key={line.product.id}
                line={line}
                onChangeQty={handleChangeQty}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <CartSummary count={cart.count} total={total} onClear={handleClear} />
        </div>
      )}
    </>
  );
}
