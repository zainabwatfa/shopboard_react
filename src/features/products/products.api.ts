// Loads the product list from the server.
import { ApiError, fetchJson } from "../../shared/api/client.ts";
import { isProduct } from "./products.logic.ts";
import type { Product } from "./products.types.ts";

// No leading "/": the path starts from the page, so it also works when the
// site lives in a sub-folder (GitHub Pages serves it under /shopboard/)
const PRODUCTS_URL = "api/products.json";

// Asks for `unknown`, because nothing guarantees what the server sends,
// then keeps only the entries that really are products.
export async function getProducts(): Promise<Product[]> {
  const data = await fetchJson<unknown>(PRODUCTS_URL);
  if (!Array.isArray(data)) {
    throw new ApiError(`${PRODUCTS_URL} did not return a list`, 200, PRODUCTS_URL);
  }
  return data.filter(isProduct);
}

// Loads one product from the API by its id.
export async function getProduct(id: number): Promise<Product | null> {
  const singleUrl = `api/products/${id}.json`;
  try {
    const data = await fetchJson<unknown>(singleUrl);
    if (isProduct(data)) {
      return data;
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 0) {
      throw error;
    }
  }

  const products = await getProducts();
  const match = products.find((product) => product.id === id);
  return match ?? null;
}
