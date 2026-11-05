# Debug lab log

The 5 planted bugs in the Debug Lab shop (shopboard-api.vercel.app/debug-lab). TypeScript shows no
errors for any of them.

**How the bugs were found and checked:**

- The lab page was opened in Chromium (driven by Playwright), and the five "Try this" steps were
  followed in order, reading the Console after each one.
- The React component tree was read from the running page: each component's key, props and state
  (hooks). This is the same data the React DevTools **Components** tab shows.
- The source code came from the lab's `debug-lab-src.zip` (what the **Sources** tab shows).
- Every fix below was applied to a copy of that code and the five steps were run again. All five now
  behave as expected, and the Console is clean.

## Bug 1

- **What I saw:** On load, the Console shows a red error: `Each child in a list should have a unique
"key" prop. … Check the render method of 'CategoryChips'.`
- **Component:** `CategoryChips` (`src/components/CategoryChips.tsx`)
- **How I found it:** Console warning. It names the component after "Check the render method of".
  The Components tab shows the chips with no key, and `npm run lint` also flags it (`react/jsx-key`).
- **Cause:** Line 9, `<span className="chip">{category}</span>`, is returned from `categories.map()`
  without a `key`. React needs a key on every item in a list to tell the items apart between renders.
- **Fix:** Give each chip a key from the data. The category names are unique:

  ```tsx
  {
    categories.map((category) => (
      <span key={category} className="chip">
        {category}
      </span>
    ));
  }
  ```

## Bug 2

- **What I saw:** The two sold-out cards (Mini Crossbody Bag and Wool Scarf) show a stray **0** where
  the stock note goes. The empty cart shows a **0** under the "Cart" heading.
- **Component:** `StockNote` (`src/components/StockNote.tsx`) and `CartPanel`
  (`src/components/CartPanel.tsx`): the same mistake in two places.
- **How I found it:** By looking at the page (step 2), then at the props in the Components tab:
  `StockNote` has `stock: 0`, and `CartPanel` has `cart: []`, so `cart.length` is 0. Then the code in
  Sources. Neither tsc nor the lint flags it.
- **Cause:** `StockNote` line 6, `{stock && <span>…</span>}`, and `CartPanel` line 19,
  `{cart.length && (<ul>…</ul>)}`. When the number is 0, `0 && …` gives `0`, and React draws numbers
  (it skips only `false`, `null` and `undefined`). So a "0" appears that nobody wrote.
- **Fix:** Put a real boolean before `&&`:

  ```tsx
  // StockNote.tsx
  <p className="stock">{stock > 0 && <span>Only {stock} left</span>}</p>;

  // CartPanel.tsx
  {
    cart.length > 0 && <ul>…</ul>;
  }
  ```

## Bug 3

- **What I saw:** I saved (♡) the Leather Tote Bag, then sorted by "Price: low to high". The heart
  moved to the **Wool Scarf**, the product now in the first place. The Leather Tote Bag lost it.
- **Component:** `ProductList` (`src/components/ProductList.tsx`); the state lives in `ProductCard`.
- **How I found it:** Keys in the Components tab. Each `ProductCard` has `key="0"`…`key="5"`. Before
  sorting, `key="0"` shows the Leather Tote Bag and its state is `saved: true`. After sorting,
  `key="0"` still has `saved: true`, but its `product` prop is now the Wool Scarf. `npm run lint` with
  this repo's settings flags it (`react/no-array-index-key`); the lab's own lint settings don't.
- **Cause:** Line 18, `<ProductCard key={index} …>`. State belongs to the key, not to the product.
  When the order changes, the card with key 0 keeps its `saved` state and just gets a different
  product.
- **Fix:** Use a key from the data, so the state stays with its product:

  ```tsx
  {
    shown.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ));
  }
  ```

## Bug 4

- **What I saw:** After sorting by price and then choosing "Featured" again, the products stay in price
  order (Wool Scarf, Mini Crossbody Bag, Canvas Backpack…) instead of going back to the order at load
  (Leather Tote Bag, Canvas Backpack, Mini Crossbody Bag…).
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** Props in the Components tab. Selecting `ProductList` after sorting back to
  "Featured" shows `sort: "featured"`, but its `products` prop is still in price order. So the list
  itself was changed, not only what was shown. Then line 13 in Sources.
- **Cause:** Line 13, `products.sort((a, b) => a.price - b.price)`. `Array.prototype.sort()` sorts
  the array **in place**. `products` is the shared `PRODUCTS` array from `data.ts`, so sorting it once
  changes the "Featured" order for good, during a render.
- **Fix:** Sort a copy (or use `toSorted()`), so the original order is never touched:

  ```tsx
  const shown =
    sort === "price-asc"
      ? [...products].sort((a, b) => a.price - b.price)
      : products;
  ```

## Bug 5

- **What I saw:** I added the Canvas Backpack, then clicked **+** twice. Nothing changed on the
  screen: still "× 1", "Total: $49" and "Cart (1)". Then I added the White Sneakers, and the backpack
  suddenly jumped to "× 3" (total $222, "Cart (4)").
- **Component:** `CartRow` (`src/components/CartRow.tsx`), with `App` (`src/App.tsx`)
- **How I found it:** Props in the Components tab. After clicking + twice, `CartRow` shows
  `item: { id: 2, qty: 3 }` while the screen still shows "× 1". So the data changed, but nothing
  re-rendered (Highlight updates shows no render on +). `npm run lint` flags the assignment
  (`react/immutability`).
- **Cause:**
  - `CartRow` line 11, `item.qty = item.qty + 1`, **changes the prop object in place**. That object
    is the same object that is in `App`'s `cart` state.
  - Then `App` line 35 calls `onChange={() => setCart(cart)}`, passing the **same array** back.
    React sees the same reference and skips the render.
  - The changed number only shows up at the next real render, the one from adding another product.
- **Fix:** Never change props or state. `CartRow` only reports the click, and `App` makes a new array
  with a new item:

  ```tsx
  // CartRow.tsx
  interface CartRowProps {
    item: CartItem;
    product: Product;
    onIncrease: (id: number) => void;
  }
  // …
  <button
    type="button"
    aria-label={`Add one more ${product.name}`}
    onClick={() => onIncrease(item.id)}
  >
    +
  </button>;

  // App.tsx
  function increase(id: number) {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  }
  // …
  <CartPanel cart={cart} products={PRODUCTS} onIncrease={increase} />;
  ```

  `CartPanel` passes `onIncrease` down to each `CartRow` instead of `onChange`.

## What found what

| Bug                    | tsc | lab's `npm run lint` | this repo's lint              | Only by running the app |
| ---------------------- | --- | -------------------- | ----------------------------- | ----------------------- |
| 1 Missing key          | no  | yes (`jsx-key`)      | yes                           |                         |
| 2 Stray "0"            | no  | no                   | no                            | yes                     |
| 3 Index as key         | no  | no                   | yes (`no-array-index-key`)    |                         |
| 4 Sort in place        | no  | no                   | yes (`unicorn/no-array-sort`) |                         |
| 5 Mutated prop / state | no  | yes (`immutability`) | yes                           |                         |

After today, this repo's `.oxlintrc.json` turns on `unicorn/no-array-sort`, so 4 of the 5 would now
fail `npm run lint`. The stray "0" still needs a look in the browser.
