// The top of the component tree: the cart that every page shares, the layout
// around the page (header, footer), and the page <body data-page> asked for.
import type { ReactNode } from "react";
import { CartProvider } from "./components/CartProvider.tsx";
import { Layout } from "./components/Layout.tsx";
import type { Page } from "./lib/page.ts";
import { CartPage } from "./pages/CartPage.tsx";
import { ShopPage } from "./pages/ShopPage.tsx";

export interface AppProps {
  // Which page to draw, read from <body data-page> by main.tsx
  page: Page;
}

function pageContent(page: Page): ReactNode {
  switch (page) {
    case "shop":
      return <ShopPage />;
    case "cart":
      return <CartPage />;
  }
}

export function App({ page }: AppProps) {
  return (
    <CartProvider>
      <Layout current={page} mainClassName={`${page}-page`}>
        {pageContent(page)}
      </Layout>
    </CartProvider>
  );
}
