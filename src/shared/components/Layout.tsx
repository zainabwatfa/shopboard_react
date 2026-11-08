import type { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeSwitch } from "../../features/theme/components/ThemeSwitch.tsx";
import { useTheme } from "../../features/theme/hooks/useTheme.ts";
import type { Page } from "../../lib/page.ts";
import { FOOTER_GROUPS } from "../../lib/siteLinks.ts";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";
import { MainNav } from "./MainNav.tsx";

export interface LayoutProps {
  // Which page is open: its main-nav link gets aria-current="page"
  current?: Page;
  // The page's own class on <main>, e.g. "shop-page"
  mainClassName?: string;
  children?: ReactNode;
}

function getPageInfo(pathname: string): { page: Page; className: string } {
  if (
    pathname === "/" ||
    pathname === "/shop" ||
    pathname.startsWith("/index")
  ) {
    return { page: "shop", className: "shop-page" };
  }
  if (pathname.startsWith("/product")) {
    return { page: "product", className: "product-page" };
  }
  if (pathname.startsWith("/cart")) {
    return { page: "cart", className: "cart-page" };
  }
  if (pathname.startsWith("/checkout")) {
    return { page: "checkout", className: "checkout-page" };
  }
  if (pathname.startsWith("/about")) {
    return { page: "about", className: "about-page" };
  }
  if (pathname.startsWith("/faq")) {
    return { page: "faq", className: "faq-page" };
  }
  return { page: "not-found", className: "not-found-page" };
}

// What every page has around its content: skip link, header (logo, nav,
// theme switch), <main id="main"> and footer
export function Layout({ current, mainClassName, children }: LayoutProps = {}) {
  const { choice, changeTheme } = useTheme();
  const location = useLocation();

  const detected = getPageInfo(location.pathname);
  const activePage = current ?? detected.page;
  const activeClass = mainClassName ?? detected.className;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header>
        <MainNav current={activePage} />
        <ThemeSwitch choice={choice} onChange={changeTheme} />
      </Header>
      <main id="main" className={`container ${activeClass}`}>
        {children ?? <Outlet />}
      </main>
      <Footer groups={FOOTER_GROUPS} />
    </>
  );
}
