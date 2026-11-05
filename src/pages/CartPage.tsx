import { useLayoutEffect, useRef } from "react";
import { CartItemRow } from "../components/CartItemRow.tsx";
import { CartSummary } from "../components/CartSummary.tsx";
import { StatusMessage } from "../components/StatusMessage.tsx";
import type { StatusMessageProps } from "../components/StatusMessage.tsx";
import { useAnnouncer } from "../hooks/useAnnouncer.ts";
import { useCart } from "../hooks/useCart.ts";
import { useProducts } from "../hooks/useProducts.ts";
import { useStorageSync } from "../hooks/useStorageSync.ts";
import { describeCartChange, withSavedItems } from "../lib/messages.ts";
import {
  getCartCount,
  getCartLines,
  getCartTotal,
  getItemQty,
} from "../modules/cart/cart.logic.ts";
import type { CartChange, CartItem } from "../modules/cart/cart.types.ts";
import type { Product } from "../modules/products/products.types.ts";

// One empty list for "no products yet", so it is the same list on every render
const NO_PRODUCTS: readonly Product[] = [];

// The cart (cart.html): the rows (+ / − / Remove), the summary and Clear cart. Prices
// always come from the product data; the saved cart only has { id, qty }.
export function CartPage() {
  const { state: cart, actions } = useCart();
  const { state, retry } = useProducts((products) =>
    actions.keepOnly(products.map((product) => product.id)),
  );
  const { announcement, announce } = useAnnouncer();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const products = state.status === "ready" ? state.products : NO_PRODUCTS;
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
      return; // the row stays, and so does the focused button
    }
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus(); // the row and its buttons are gone
  }

  function handleRemove(product: Product): void {
    const items = actions.remove(product.id);
    announceChange({ type: "removed", name: product.name }, items);
    headingRef.current?.focus();
  }

  // Clearing removes every row at once and can't be undone, so ask first.
  // confirm() is the browser's own dialog: it works with the keyboard and
  // screen readers, and Cancel (or Esc) changes nothing.
  function handleClear(): void {
    if (!window.confirm("Remove all items from your cart?")) return;
    const items = actions.clear();
    announceChange({ type: "cleared" }, items);
    headingRef.current?.focus();
  }

  function getStatus(): StatusMessageProps {
    switch (state.status) {
      case "loading":
        return {
          id: "cart-status",
          tone: "normal",
          message: "Loading your cart…",
        };
      case "error":
        // The rows can't be shown, but the saved items are kept: say so
        return {
          id: "cart-status",
          tone: "error",
          message: withSavedItems(state.message, cart.count),
          action: { label: "Try again", onClick: retry },
        };
      case "ready":
        return { id: "cart-status", tone: "normal", message: "" };
    }
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Your bag</p>
        <h1 id="cart-title" ref={headingRef} tabIndex={-1}>
          Your <em>cart</em>
        </h1>
      </div>

      {/* Screen readers aren't told when a row changes, so changes are also
          said in words here. role="status" reads them politely; it is in the
          page before the first change, or the first one would not be read. */}
      <p id="cart-announcer" className="visually-hidden" role="status">
        {announcement}
      </p>
      <StatusMessage {...getStatus()} />

      {state.status === "ready" && lines.length === 0 ? (
        <div id="cart-empty" className="cart-empty-state">
          <p>Your cart is empty.</p>
          <a className="button" href="index.html">
            Browse the shop
          </a>
        </div>
      ) : null}

      {/* Always in the page (empty while there are no rows), so the space
          above the footer is the same in every state */}
      <div className="cart-layout">
        {lines.length > 0 ? (
          <>
            <ul
              id="cart-list"
              className="cart-list"
              aria-labelledby="cart-title"
            >
              {lines.map((line) => (
                <CartItemRow
                  key={line.product.id}
                  line={line}
                  onChangeQty={handleChangeQty}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
            <CartSummary
              count={cart.count}
              total={total}
              onClear={handleClear}
            />
          </>
        ) : null}
      </div>
    </>
  );
}
