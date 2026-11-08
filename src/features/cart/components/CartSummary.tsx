import { Link } from "react-router-dom";
import { formatMoney } from "../../../lib/format.ts";
import { formatItemCount } from "../../../lib/messages.ts";

export interface CartSummaryProps {
  count: number;
  total: number;
  // Asking "are you sure?" first is the page's job
  onClear: () => void;
}

// Item count, total, the demo note, checkout button, and next steps
export function CartSummary({ count, total, onClear }: CartSummaryProps) {
  return (
    <aside
      id="cart-summary"
      className="cart-summary"
      aria-labelledby="summary-title"
    >
      <h2 id="summary-title">Summary</h2>
      <p>
        Items <span id="cart-items">{formatItemCount(count)}</span>
      </p>
      <p className="cart-total-row">
        Total <strong id="cart-total">{formatMoney(total)}</strong>
      </p>
      <p className="hint">
        Demo shop for a course: test checkout with simulated orders.
      </p>
      <Link className="button" to="/checkout">
        Proceed to checkout
      </Link>
      <Link className="button button-secondary" to="/">
        Continue shopping
      </Link>
      <button
        id="cart-clear"
        className="button button-secondary cart-clear"
        type="button"
        onClick={onClear}
      >
        Clear cart
      </button>
    </aside>
  );
}
