import { createContext, use } from "react";
import type { CartItem } from "../modules/cart/cart.types.ts";

// What every part of the page can read about the cart: the saved
// [{ id, qty }] and the number for the header badge
export interface CartState {
  items: readonly CartItem[];
  count: number;
}

// The only ways to change the cart. Each one runs the cart.state function of
// the same name and returns the cart as it is now, so the caller can read the
// new quantity right away (the toast, the screen reader message).
export interface CartActions {
  add: (id: number) => readonly CartItem[];
  changeQty: (id: number, delta: 1 | -1) => readonly CartItem[];
  remove: (id: number) => readonly CartItem[];
  clear: () => readonly CartItem[];
  keepOnly: (validIds: readonly number[]) => readonly CartItem[];
}

export interface CartContextValue {
  state: CartState;
  actions: CartActions;
}

// Filled by <CartProvider> (components/CartProvider.tsx), the only place that
// knows the cart lives in cart.state.ts and localStorage
export const CartContext = createContext<CartContextValue | null>(null);
// The name React DevTools shows for the provider: "CartContext.Provider"
CartContext.displayName = "CartContext";

export function useCart(): CartContextValue {
  const value = use(CartContext);
  if (value === null) {
    throw new Error("useCart() needs a <CartProvider> around the page.");
  }
  return value;
}
