import { Link, useParams } from "react-router-dom";
import { ProductDetail } from "../features/products/components/ProductDetail.tsx";
import { ProductGrid } from "../features/products/components/ProductGrid.tsx";
import { DataBoundary } from "../shared/components/DataBoundary.tsx";
import { useCart } from "../features/cart/hooks/useCart.ts";
import {
  invalidateProductDetail,
  useProductDetail,
} from "../features/products/products.resource.ts";
import { getItemQty } from "../features/cart/cart.logic.ts";
import { parseProductId } from "../features/products/products.logic.ts";
import type { Product } from "../features/products/products.types.ts";
import { getAddedMessage } from "../lib/messages.ts";
import { Toast } from "../shared/components/Toast.tsx";
import { useToast } from "../shared/hooks/useToast.ts";

// Product details page. An unknown id shows "not found" straight away; a valid
// id loads through DataBoundary (loading line and load error with Try again).
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = typeof id === "string" ? parseProductId(id) : null;

  return (
    <>
      <Link to="/" className="back-link">
        Back to shop
      </Link>

      {productId === null ? (
        <ProductMissing />
      ) : (
        <DataBoundary
          statusId="product-status"
          loadingMessage="Loading product…"
          onRetry={() => invalidateProductDetail(productId)}
        >
          <ProductContent id={productId} />
        </DataBoundary>
      )}
    </>
  );
}

function ProductContent({ id }: { id: number }) {
  const detail = useProductDetail(id);
  const { actions } = useCart();
  const { toast, showToast, dismissToast } = useToast();

  function handleAdd(product: Product): void {
    const items = actions.add(product.id);
    showToast(getAddedMessage(product.name, getItemQty(items, product.id)), {
      label: "View cart",
      href: "/cart",
    });
  }

  if (detail.product === null) {
    return <ProductMissing />;
  }

  return (
    <>
      <ProductDetail product={detail.product} onAdd={handleAdd} />
      {detail.related.length > 0 ? (
        <section
          className="related"
          aria-label={`More in ${detail.product.category}`}
        >
          <h2>More in {detail.product.category}</h2>
          <ProductGrid products={detail.related} onAdd={handleAdd} />
        </section>
      ) : null}
      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}

// Shown for an unknown id, or one that is not a number
function ProductMissing() {
  return (
    <div className="product-missing status status-empty">
      <h1>Product not found</h1>
      <p>
        We couldn&apos;t find the product you&apos;re looking for. It may have
        been removed or the link might be broken.
      </p>
      <Link to="/" className="button">
        Browse products
      </Link>
    </div>
  );
}
