import { useCart } from "../../features/cart/hooks/useCart.ts";
import type { Page } from "../../lib/page.ts";
import { NavLink } from "./NavLink.tsx";

export interface MainNavProps {
  // The page that is open: its link gets aria-current="page"
  current: Page;
  // Optional override for the badge count; defaults to the shared cart count
  cartCount?: number;
}

// Navigation links for the site: Shop, About, FAQ, and Cart with live count badge
export function MainNav({ current, cartCount }: MainNavProps) {
  const { state } = useCart();
  const count = cartCount ?? state.count;

  return (
    <nav aria-label="Main">
      <ul className="nav-list">
        <li>
          <NavLink href="/" isCurrent={current === "shop"}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink href="/about" isCurrent={current === "about"}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink href="/faq" isCurrent={current === "faq"}>
            FAQ
          </NavLink>
        </li>
        <li>
          <NavLink href="/cart" isCurrent={current === "cart"}>
            Cart{" "}
            <span id="cart-count" className="badge">
              {count}
            </span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
