export interface QuantityStepperProps {
  // The product's name, for the buttons' accessible names
  name: string;
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

// − 2 +. Screen readers ignore aria-label on a plain <span>, so "Quantity" is
// real text, only hidden on screen: they read "Quantity 2", sighted users see "2".
export function QuantityStepper({
  name,
  qty,
  onDecrease,
  onIncrease,
}: QuantityStepperProps) {
  return (
    <div className="cart-qty">
      <button
        className="button button-small"
        type="button"
        aria-label={`Decrease quantity of ${name}`}
        onClick={onDecrease}
      >
        −
      </button>
      <span>
        <span className="visually-hidden">Quantity </span>
        {qty}
      </span>
      <button
        className="button button-small"
        type="button"
        aria-label={`Increase quantity of ${name}`}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}
