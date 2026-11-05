import type { ReactNode } from "react";
import { useCart } from "../hooks/useCart.ts";
import { useTheme } from "../hooks/useTheme.ts";
import type { Page } from "../lib/page.ts";
import { FOOTER_GROUPS } from "../lib/siteLinks.ts";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";
import { MainNav } from "./MainNav.tsx";
import { ThemeSwitch } from "./ThemeSwitch.tsx";

export interface LayoutProps {
  // Which page is open: its main-nav link gets aria-current="page"
  current: Page;
  // The page's own class on <main>, e.g. "shop-page"
  mainClassName: string;
  children: ReactNode;
}

// What every page has around its content: skip link, header (logo, nav with
// the cart badge, theme switch), <main id="main"> and footer
export function Layout({ current, mainClassName, children }: LayoutProps) {
  const { state } = useCart();
  const { choice, changeTheme } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header>
        <MainNav current={current} cartCount={state.count} />
        <ThemeSwitch choice={choice} onChange={changeTheme} />
      </Header>
      <main id="main" className={`container ${mainClassName}`}>
        {children}
      </main>
      <Footer groups={FOOTER_GROUPS} />
    </>
  );
}
