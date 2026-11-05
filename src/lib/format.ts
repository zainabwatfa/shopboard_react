// Formats numbers for the page. Pure: a number comes in, text goes out.

// Made once and reused: building an Intl.NumberFormat is slow
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// 89 gives "$89.00"
export function formatMoney(amount: number): string {
  return money.format(amount);
}
