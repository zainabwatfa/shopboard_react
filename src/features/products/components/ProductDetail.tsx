import { formatMoney } from "../../../lib/format.ts";
import type { Product } from "../products.types.ts";
import { ProductImage } from "./ProductImage.tsx";

export interface ProductDetailProps {
  product: Product;
  onAdd: (product: Product) => void;
}

// Product detail view: large media sticker, category eyebrow, title, formatted price, and Add to cart
export function ProductDetail({ product, onAdd }: ProductDetailProps) {
  return (
    <article className="product-detail">
      <div className="product-detail-media">
        <ProductImage
          src={product.image}
          className="product-image"
          size={400}
        />
      </div>
      <div className="product-detail-body">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="product-detail-price">{formatMoney(product.price)}</p>
        <button
          className="button"
          type="button"
          aria-label={`Add to cart: ${product.name}`}
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
