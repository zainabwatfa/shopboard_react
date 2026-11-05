// Which page is open, and the query part of the address bar.
// Each HTML file says which page it is: <body data-page="shop">.

// index.html is the shop, cart.html the cart
export type Page = "shop" | "cart";

const pages: readonly Page[] = ["shop", "cart"];

// A type guard: text from the page becomes a Page only after this check
function isPage(value: unknown): value is Page {
  return pages.some((page) => page === value);
}

// The attribute is text from the page, so check it: a missing or unknown
// value gives null
export function parsePage(value: string | undefined): Page | null {
  return isPage(value) ? value : null;
}

export function getCurrentPage(): Page | null {
  return parsePage(document.body.dataset.page);
}

// The whole query part of the address as plain text, e.g. "?category=Bags",
// or "" when there is none. The caller checks it (parseFilterQuery).
export function getQueryString(): string {
  return window.location.search;
}

// Puts `query` ("?category=Bags", or "" for none) in the address bar without
// reloading the page or adding a Back step, so the page as it is now can be
// bookmarked, shared or reloaded. Keeps the path and any #part.
export function replaceQueryString(query: string): void {
  const { pathname, search, hash } = window.location;
  if (search === query) return;
  window.history.replaceState(
    window.history.state,
    "",
    `${pathname}${query}${hash}`,
  );
}
