// The sentences the React pages show or announce, built from data.
// Pure functions: everything comes in as arguments, a string goes out, so
// tests/messages.test.ts can check every wording without a browser.
import type { CartChange } from "../features/cart/cart.types.ts";
import { ApiError } from "../shared/api/client.ts";
import { formatMoney } from "./format.ts";

// How a status line looks: "normal" is the quiet line ("Loading…", the result
// count), "empty" and "error" turn it into a card (see .status in styles.css)
export type StatusTone = "normal" | "empty" | "error";

// What the shop's status line says once the products are there.
// offerClear: show "Clear filters" (only when the filters hide every product,
// not when the shop has none at all).
export type ResultsStatus = {
  tone: StatusTone;
  message: string;
  offerClear: boolean;
};

// The message for a product list that didn't load. status 0 means the request
// never reached the server (offline, DNS, blocked).
export function getLoadErrorMessage(error: unknown): string {
  return error instanceof ApiError && error.status === 0
    ? "Couldn't reach the shop. Check your connection and try again."
    : "Couldn't load the products. Please try again.";
}

// Cart page, when the products didn't load: the items can't be shown, but they
// are still saved and the header badge still counts them. Saying so keeps the
// message and the badge telling the same story.
export function withSavedItems(message: string, count: number): string {
  if (count <= 0) return message;
  const items = count === 1 ? "1 item is" : `${count} items are`;
  return `${message} Your ${items} still saved in your cart.`;
}

// "1 item", "3 items"
export function formatItemCount(count: number): string {
  return count === 1 ? "1 item" : `${count} items`;
}

// The toast after "Add to cart". The quantity makes the text change every
// time, so screen readers announce it again.
export function getAddedMessage(name: string, qty: number): string {
  return `${name} added to your cart (${qty} in cart).`;
}

// Shown in the shop's status line. total is how many products the shop has,
// shown how many are left after the search and the category filter.
export function getResultsStatus(shown: number, total: number): ResultsStatus {
  if (total === 0) {
    return {
      tone: "empty",
      message: "No products are available right now.",
      offerClear: false,
    };
  }
  if (shown === 0) {
    return {
      tone: "empty",
      message: "No products match your search.",
      offerClear: true,
    };
  }
  return {
    tone: "normal",
    message: `Showing ${shown} of ${total} products`,
    offerClear: false,
  };
}

// The sentence for one cart change, for screen reader users (they don't see a
// row change). count and total describe the cart after the change, e.g.
// "Leather Tote Bag: quantity 2. Cart total $178.00."
export function describeCartChange(
  change: CartChange,
  after: { count: number; total: number },
): string {
  const rest =
    after.count === 0
      ? "Your cart is empty."
      : `Cart total ${formatMoney(after.total)}.`;
  switch (change.type) {
    case "quantity":
      return `${change.name}: quantity ${change.qty}. ${rest}`;
    case "removed":
      return `${change.name} removed from your cart. ${rest}`;
    case "cleared":
      return "Cart cleared. Your cart is empty.";
  }
}
