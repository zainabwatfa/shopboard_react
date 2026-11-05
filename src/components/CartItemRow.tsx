import type { CartLine } from "../modules/cart/cart.types.ts";
import type { Product } from "../modules/products/products.types.ts";
import { formatMoney } from "../lib/format.ts";
import { ProductImage } from "./ProductImage.tsx";
import { QuantityStepper } from "./QuantityStepper.tsx";

export interface CartItemRowProps {
  line: CartLine;
  onChangeQty: (product: Product, delta: 1 | -1) => void;
  onRemove: (product: Product) => void;
}

// One cart row: picture, name, unit price, − qty +, line total, Remove
export function CartItemRow({ line, onChangeQty, onRemove }: CartItemRowProps) {
  const { product, qty, lineTotal } = line;
  return (
    <li className="cart-item" data-category={product.category}>
      <ProductImage src={product.image} className="cart-thumb" size={96} />
      <span className="cart-name">{product.name}</span>
      <span className="cart-unit">{`${formatMoney(product.price)} each`}</span>
      <QuantityStepper
        name={product.name}
        qty={qty}
        onDecrease={() => onChangeQty(product, -1)}
        onIncrease={() => onChangeQty(product, 1)}
      />
      <span className="cart-line">{formatMoney(lineTotal)}</span>
      <button
        className="button button-small cart-remove"
        type="button"
        aria-label={`Remove ${product.name} from cart`}
        onClick={() => onRemove(product)}
      >
        Remove
      </button>
    </li>
  );
}
