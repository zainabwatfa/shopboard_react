// Which page is open, and the query part of the address bar.

export type Page =
  "shop" | "product" | "cart" | "checkout" | "about" | "faq" | "not-found";

const htmlPages: readonly string[] = ["shop", "cart"];

function isHtmlPage(value: unknown): value is "shop" | "cart" {
  return htmlPages.some((page) => page === value);
}

// The attribute is text from the HTML body dataset: a missing or unknown value gives null
export function parsePage(value: string | undefined): "shop" | "cart" | null {
  return isHtmlPage(value) ? value : null;
}

export function getCurrentPage(): "shop" | "cart" | null {
  return parsePage(document.body.dataset.page);
}

// The whole query part of the address as plain text, e.g. "?category=Bags",
// or "" when there is none.
export function getQueryString(): string {
  return window.location.search;
}

// Puts `query` in the address bar without reloading
export function replaceQueryString(query: string): void {
  const { pathname, search, hash } = window.location;
  if (search === query) return;
  window.history.replaceState(
    window.history.state,
    "",
    `${pathname}${query}${hash}`,
  );
}
