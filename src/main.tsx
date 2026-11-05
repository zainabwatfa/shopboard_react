// Starts React. index.html (the shop) and cart.html both load this file;
// <body data-page="shop"|"cart"> says which page to draw.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { getCurrentPage } from "./lib/page.ts";

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
    <App page={page} />
  </StrictMode>,
);
