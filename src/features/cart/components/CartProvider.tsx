import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCartCount } from "../cart.logic.ts";
import {
  addToCart,
  changeQty,
  clearCart,
  getCart,
  keepOnly,
  reloadCart,
  removeFromCart,
} from "../cart.state.ts";
import type { CartItem } from "../cart.types.ts";
import { CartContext } from "../hooks/useCart.ts";
import type { CartActions, CartContextValue } from "../hooks/useCart.ts";
import { useStorageSync } from "../../../shared/hooks/useStorageSync.ts";

export interface CartProviderProps {
  children: ReactNode;
}

// Gives the whole page one cart (header badge and page share it). The cart
// itself stays in cart.state.ts, which saves it in localStorage, so it
// survives a reload. This component keeps a copy in React state so the page
// draws again after every change.
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<readonly CartItem[]>(getCart);

  // Every action: change the cart in cart.state.ts (which reads the saved cart
  // first, so another tab's change is kept), then show the result
  const actions = useMemo<CartActions>(() => {
    const apply = (change: () => void): readonly CartItem[] => {
      change();
      const next = getCart();
      setItems(next);
      return next;
    };
    return {
      add: (id) => apply(() => addToCart(id)),
      changeQty: (id, delta) => apply(() => changeQty(id, delta)),
      remove: (id) => apply(() => removeFromCart(id)),
      clear: () => apply(clearCart),
      keepOnly: (validIds) => apply(() => keepOnly(validIds)),
    };
  }, []);

  // Another tab changed the cart, or Back showed this page from the cache
  useStorageSync(() => {
    reloadCart();
    setItems(getCart());
  });

  const value = useMemo<CartContextValue>(
    () => ({ state: { items, count: getCartCount(items) }, actions }),
    [items, actions],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
