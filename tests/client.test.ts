// Tests for the API base URL (src/shared/api/client.ts): how resolveApiUrl puts
// VITE_API_BASE_URL in front of a path.
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveApiUrl } from "../src/shared/api/client.ts";

test("no base: the path stays as it is (the demo's default)", () => {
  assert.equal(resolveApiUrl("api/products.json", ""), "api/products.json");
});

test("under node there is no .env, so the default base is empty", () => {
  assert.equal(resolveApiUrl("api/products.json"), "api/products.json");
});

test("a base goes in front, with exactly one slash between", () => {
  const expected = "https://api.example.com/v1/products.json";
  assert.equal(
    resolveApiUrl("products.json", "https://api.example.com/v1"),
    expected,
  );
  assert.equal(
    resolveApiUrl("products.json", "https://api.example.com/v1/"),
    expected,
  );
  assert.equal(
    resolveApiUrl("/products.json", "https://api.example.com/v1//"),
    expected,
  );
});

test("a full URL ignores the base", () => {
  assert.equal(
    resolveApiUrl(
      "https://other.example.com/x.json",
      "https://api.example.com/",
    ),
    "https://other.example.com/x.json",
  );
});
