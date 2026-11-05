// Tests for reading <body data-page> (src/lib/page.ts): main.tsx draws the
// shop or the cart, and anything else is refused.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { parsePage } from "../src/lib/page.ts";

describe("parsePage", () => {
  test("the two pages of the site", () => {
    assert.equal(parsePage("shop"), "shop");
    assert.equal(parsePage("cart"), "cart");
  });

  test("a missing, empty or unknown value gives null", () => {
    for (const value of [undefined, "", "home", "Shop", " cart", "product"]) {
      assert.equal(parsePage(value), null, String(value));
    }
  });
});
