import { formatMoney } from "../lib/format.ts";
import { formatItemCount } from "../lib/messages.ts";

export interface CartSummaryProps {
  count: number;
  total: number;
  // Asking "are you sure?" first is the page's job
  onClear: () => void;
}

// Item count, total, the demo note and the next steps
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
        Demo shop for a course: there is no checkout, and nothing is sold or
        charged.
      </p>
      <a className="button" href="index.html">
        Continue shopping
      </a>
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
