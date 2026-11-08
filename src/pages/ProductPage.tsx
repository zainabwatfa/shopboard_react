import { Link, useParams } from "react-router-dom";
import { ProductDetail } from "../features/products/components/ProductDetail.tsx";
import { ProductGrid } from "../features/products/components/ProductGrid.tsx";
import { useCart } from "../features/cart/hooks/useCart.ts";
import { useProduct } from "../features/products/hooks/useProduct.ts";
import { getItemQty } from "../features/cart/cart.logic.ts";
import { parseProductId } from "../features/products/products.logic.ts";
import type { Product } from "../features/products/products.types.ts";
import { getAddedMessage } from "../lib/messages.ts";
import { StatusMessage } from "../shared/components/StatusMessage.tsx";
import { Toast } from "../shared/components/Toast.tsx";
import { useToast } from "../shared/hooks/useToast.ts";

// Product details page: loads a single product from the API by its id,
// provides "Add to cart", shows toast confirmation, and displays related items.
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = typeof id === "string" ? parseProductId(id) : null;
  const { state, retry } = useProduct(productId);
  const { actions } = useCart();
  const { toast, showToast, dismissToast } = useToast();

  function handleAdd(product: Product): void {
    const items = actions.add(product.id);
    const qty = getItemQty(items, product.id);
    showToast(getAddedMessage(product.name, qty), {
      label: "View cart",
      href: "/cart",
    });
  }

  return (
    <>
      <Link to="/" className="back-link">
        Back to shop
      </Link>

      {state.status === "loading" && (
        <StatusMessage
          id="product-status"
          tone="normal"
          message="Loading product…"
        />
      )}

      {state.status === "error" && (
        <StatusMessage
          id="product-status"
          tone="error"
          message={state.message}
          action={{ label: "Try again", onClick: retry }}
        />
      )}

      {state.status === "not-found" && (
        <div className="product-missing status status-empty">
          <h1>Product not found</h1>
          <p>
            We couldn&apos;t find the product you&apos;re looking for. It may
            have been removed or the link might be broken.
          </p>
          <Link to="/" className="button">
            Browse products
          </Link>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <ProductDetail product={state.product} onAdd={handleAdd} />
          {state.related.length > 0 && (
            <section
              className="related"
              aria-label={`More in ${state.product.category}`}
            >
              <h2>More in {state.product.category}</h2>
              <ProductGrid products={state.related} onAdd={handleAdd} />
            </section>
          )}
        </>
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
