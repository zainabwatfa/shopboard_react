import type { Product } from "../modules/products/products.types.ts";
import { ProductCard } from "./ProductCard.tsx";

export interface ProductGridProps {
  products: readonly Product[];
  onAdd: (product: Product) => void;
}

// The cards, in the order given. The key is the product id, so a card keeps
// its place (and its focused button) when the list is filtered or sorted.
export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product, position) => (
        <ProductCard
          key={product.id}
          product={product}
          position={position}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
