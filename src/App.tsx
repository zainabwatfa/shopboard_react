// The top of the component tree: the cart provider that every page shares,
// the browser router with lazy-loaded route pages, and the shared Layout.
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "./features/cart/components/CartProvider.tsx";
import { Layout } from "./shared/components/Layout.tsx";
import { StatusMessage } from "./shared/components/StatusMessage.tsx";
import type { Page } from "./lib/page.ts";

export interface AppProps {
  page?: Page;
}

// Pages are lazy loaded and downloaded only when their route is opened
const ShopPage = lazy(() =>
  import("./pages/ShopPage.tsx").then((m) => ({ default: m.ShopPage })),
);
const ProductPage = lazy(() =>
  import("./pages/ProductPage.tsx").then((m) => ({ default: m.ProductPage })),
);
const CartPage = lazy(() =>
  import("./pages/CartPage.tsx").then((m) => ({ default: m.CartPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage.tsx").then((m) => ({ default: m.CheckoutPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage.tsx").then((m) => ({ default: m.AboutPage })),
);
const FaqPage = lazy(() =>
  import("./pages/FaqPage.tsx").then((m) => ({ default: m.FaqPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage.tsx").then((m) => ({ default: m.NotFoundPage })),
);

function PageFallback() {
  return (
    <StatusMessage id="page-loading" tone="normal" message="Loading page…" />
  );
}

export function App(_props: AppProps = {}) {
  return (
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<ShopPage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="products/:id" element={<ProductPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route
                path="cart.html"
                element={<Navigate to="/cart" replace />}
              />
              <Route path="index.html" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  );
}
