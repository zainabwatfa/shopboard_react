// Tests for the sentences the React pages show or announce (src/lib/messages.ts)
// and for the footer link data (src/lib/siteLinks.ts).
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  describeCartChange,
  formatItemCount,
  getAddedMessage,
  getLoadErrorMessage,
  getResultsStatus,
  withSavedItems,
} from "../src/lib/messages.ts";
import { FOOTER_GROUPS } from "../src/lib/siteLinks.ts";
import { ApiError } from "../src/shared/api/client.ts";

describe("getLoadErrorMessage", () => {
  test("a request that never reached the server asks to check the connection", () => {
    const error = new ApiError("Network error", 0, "api/products.json");
    assert.equal(
      getLoadErrorMessage(error),
      "Couldn't reach the shop. Check your connection and try again.",
    );
  });

  test("a server error, bad JSON or anything else gives the general message", () => {
    for (const error of [
      new ApiError("Request failed: 500", 500, "api/products.json"),
      new ApiError("did not return a list", 200, "api/products.json"),
      new Error("something else"),
      "a string",
      undefined,
    ]) {
      assert.equal(
        getLoadErrorMessage(error),
        "Couldn't load the products. Please try again.",
      );
    }
  });
});

describe("withSavedItems", () => {
  const message = "Couldn't load the products. Please try again.";

  test("an empty cart adds nothing", () => {
    assert.equal(withSavedItems(message, 0), message);
  });

  test("says how many items are still saved, singular and plural", () => {
    assert.equal(
      withSavedItems(message, 1),
      `${message} Your 1 item is still saved in your cart.`,
    );
    assert.equal(
      withSavedItems(message, 3),
      `${message} Your 3 items are still saved in your cart.`,
    );
  });
});

describe("formatItemCount", () => {
  test("singular and plural", () => {
    assert.equal(formatItemCount(0), "0 items");
    assert.equal(formatItemCount(1), "1 item");
    assert.equal(formatItemCount(12), "12 items");
  });
});

describe("getAddedMessage", () => {
  test("names the product and the quantity now in the cart", () => {
    assert.equal(
      getAddedMessage("Silver Watch", 2),
      "Silver Watch added to your cart (2 in cart).",
    );
  });
});

describe("getResultsStatus", () => {
  test("a shop with no products says so, without Clear filters", () => {
    assert.deepEqual(getResultsStatus(0, 0), {
      tone: "empty",
      message: "No products are available right now.",
      offerClear: false,
    });
  });

  test("filters that hide every product offer Clear filters", () => {
    assert.deepEqual(getResultsStatus(0, 13), {
      tone: "empty",
      message: "No products match your search.",
      offerClear: true,
    });
  });

  test("otherwise the quiet result count", () => {
    assert.deepEqual(getResultsStatus(3, 13), {
      tone: "normal",
      message: "Showing 3 of 13 products",
      offerClear: false,
    });
    assert.deepEqual(getResultsStatus(13, 13), {
      tone: "normal",
      message: "Showing 13 of 13 products",
      offerClear: false,
    });
  });
});

describe("describeCartChange", () => {
  test("a new quantity with the new total", () => {
    assert.equal(
      describeCartChange(
        { type: "quantity", name: "Leather Tote Bag", qty: 2 },
        { count: 2, total: 178 },
      ),
      "Leather Tote Bag: quantity 2. Cart total $178.00.",
    );
  });

  test("a removed product, with or without items left", () => {
    assert.equal(
      describeCartChange(
        { type: "removed", name: "Silver Watch" },
        { count: 1, total: 89 },
      ),
      "Silver Watch removed from your cart. Cart total $89.00.",
    );
    assert.equal(
      describeCartChange(
        { type: "removed", name: "Silver Watch" },
        { count: 0, total: 0 },
      ),
      "Silver Watch removed from your cart. Your cart is empty.",
    );
  });

  test("a cleared cart", () => {
    assert.equal(
      describeCartChange({ type: "cleared" }, { count: 0, total: 0 }),
      "Cart cleared. Your cart is empty.",
    );
  });
});

describe("FOOTER_GROUPS", () => {
  test("Shop and About", () => {
    assert.deepEqual(
      FOOTER_GROUPS.map((group) => group.heading),
      ["Shop", "About"],
    );
  });

  test("links only to pages this site has, or to GitHub", () => {
    for (const group of FOOTER_GROUPS) {
      for (const link of group.links) {
        assert.ok(
          ["index.html", "cart.html"].includes(link.href) ||
            link.href.startsWith("https://github.com/zainabwatfa/"),
          link.href,
        );
      }
    }
  });

  test("no href starts with '/' (GitHub Pages serves the site under /<repo>/)", () => {
    for (const group of FOOTER_GROUPS) {
      for (const link of group.links) {
        assert.ok(!link.href.startsWith("/"), link.href);
      }
    }
  });

  test("hrefs are unique inside a group (they are the list keys)", () => {
    for (const group of FOOTER_GROUPS) {
      const hrefs = group.links.map((link) => link.href);
      assert.equal(new Set(hrefs).size, hrefs.length, group.heading);
    }
  });
});
