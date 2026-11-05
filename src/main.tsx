// Starts React. index.html (the shop) and cart.html both load this file;
// <body data-page="shop"|"cart"> says which page to draw.
import { StrictMode } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./components/CartProvider.tsx";
import { Layout } from "./components/Layout.tsx";
import { getCurrentPage } from "./lib/page.ts";
import type { Page } from "./lib/page.ts";
import { CartPage } from "./pages/CartPage.tsx";
import { ShopPage } from "./pages/ShopPage.tsx";

function renderPage(page: Page): ReactNode {
  switch (page) {
    case "shop":
      return (
        <Layout current="shop" mainClassName="shop-page">
          <ShopPage />
        </Layout>
      );
    case "cart":
      return (
        <Layout current="cart" mainClassName="cart-page">
          <CartPage />
        </Layout>
      );
  }
}

// getElementById can return null: check it instead of using `!`
const root = document.getElementById("root");
if (!(root instanceof HTMLElement)) {
  throw new Error(
    'The page has no <div id="root"></div> for React to draw in.',
  );
}

// data-page is text from the HTML: getCurrentPage checks it
const page = getCurrentPage();
if (page === null) {
  throw new Error('<body data-page> must be "shop" or "cart".');
}

createRoot(root).render(
  <StrictMode>
    <CartProvider>{renderPage(page)}</CartProvider>
  </StrictMode>,
);
