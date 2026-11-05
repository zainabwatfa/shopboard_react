import type { Page } from "../lib/page.ts";
import { NavLink } from "./NavLink.tsx";

export interface MainNavProps {
  // The page that is open: its link gets aria-current="page"
  current: Page;
  // The number in the badge next to "Cart"
  cartCount: number;
}

// The two pages of the site. No leading "/" in the links (see lib/siteLinks.ts).
export function MainNav({ current, cartCount }: MainNavProps) {
  return (
    <nav aria-label="Main">
      <ul className="nav-list">
        <li>
          <NavLink href="index.html" isCurrent={current === "shop"}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink href="cart.html" isCurrent={current === "cart"}>
            Cart{" "}
            <span id="cart-count" className="badge">
              {cartCount}
            </span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
