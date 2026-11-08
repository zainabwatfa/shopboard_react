import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../../lib/format.ts";
import type { Product } from "../products.types.ts";
import { ProductImage } from "./ProductImage.tsx";

export interface ProductCardProps {
  product: Product;
  // Position in the grid: drives the staggered fade-in (the CSS reads --i)
  position: number;
  onAdd: (product: Product) => void;
}

// One product: picture, category, name, price and "Add to cart".
// The image and name link to the product details page.
export function ProductCard({ product, position, onAdd }: ProductCardProps) {
  const style: CSSProperties & { "--i": string } = { "--i": String(position) };

  return (
    <article
      className="product-card"
      data-category={product.category}
      style={style}
    >
      <Link
        to={`/products/${product.id}`}
        className="product-media"
        aria-label={product.name}
      >
        <ProductImage
          src={product.image}
          className="product-image"
          size={200}
        />
      </Link>
      <div className="product-body">
        <p className="category">{product.category}</p>
        <h3>
          <Link to={`/products/${product.id}`} className="product-link">
            {product.name}
          </Link>
        </h3>
        <p className="price">{formatMoney(product.price)}</p>
        {/* The name starts with the visible words, so "click Add to cart"
            works in voice control, and screen readers hear which product */}
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
