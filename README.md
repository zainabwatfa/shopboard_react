# ShopBoard (React)

The React + TypeScript version of ShopBoard, a demo shop built for a course. It takes no real orders and no payments.

The first version (plain TypeScript, no framework) lives in [zainabwatfa/shopboard](https://github.com/zainabwatfa/shopboard).

Two pages: `index.html` is the shop (search, category filter and sort, kept in the URL, and product cards) and `cart.html` is the cart (+ / − / Remove, total, Clear cart). The cart is saved on this device (`localStorage`) and stays in sync across open tabs. A System / Light / Dark switch is on both pages. Product data comes from `public/api/products.json`.

## Scripts

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Starts the Vite dev server.                       |
| `npm run build`        | Type-checks (`tsc -b`), then builds into `dist/`. |
| `npm run typecheck`    | Type-checks only.                                 |
| `npm run lint`         | oxlint; fails on any warning.                     |
| `npm test`             | Runs the tests in `tests/` with `node --test`.    |
| `npm run format`       | Formats every file with Prettier.                 |
| `npm run format:check` | Checks formatting without changing files.         |
| `npm run preview`      | Serves the built `dist/` locally.                 |

A husky pre-commit hook runs lint-staged: oxlint and Prettier on the staged files. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on every push and pull request.

## Structure

```
index.html, cart.html   the two pages (React draws everything inside <div id="root">)
src/
├── main.tsx            reads <body data-page="shop|cart"> and renders <App page>
├── App.tsx             the top of the component tree
├── pages/              ShopPage, CartPage
├── components/         one reusable component per file, each with a typed Props interface
├── hooks/              useProducts, useFilters, useCart, useTheme, useToast, useAnnouncer, useStorageSync
├── lib/                messages (every sentence the pages show), format, page, siteLinks
├── modules/            Day 3 logic copied from the first repo: products, cart, theme
├── shared/api/         client.ts: fetchJson and ApiError (copied from the first repo)
└── styles.css          the same styles as the first repo
tests/                  node:test tests for the logic, the cart state, the API, the data and the messages
public/                 api/products.json and the product pictures
```

The files in `src/modules/` and `src/shared/api/client.ts` are copied unchanged from the first repo (only `import type` may change), so they are listed in `.prettierignore`.

## Component tree

What React draws, from `App` down. Next to each component: the props it gets. `[state: …]` marks the
component that owns a piece of state (through the hook in brackets). `main.tsx` wraps `App` in
`<StrictMode>`, which React DevTools does not list.

### Shop page (`index.html`)

```
App                       { page }
└── CartProvider          { children }                                          [state: cart items]
    └── CartContext.Provider { value }                                            (shares the cart)
        └── Layout        { current, mainClassName, children }                  [state: theme choice (useTheme)]
            ├── Header    { children }
            │   ├── MainNav       { current, cartCount }
            │   │   ├── NavLink   { href, isCurrent, children }   "Shop"
            │   │   └── NavLink   { href, isCurrent, children }   "Cart"
            │   └── ThemeSwitch   { choice, onChange }
            ├── ShopPage  (no props)                                            [state: products load + retry (useProducts),
            │   │                                                                       filters (useFilters), toast (useToast)]
            │   ├── ShopFilters   { filters, onChange, disabled, searchRef }
            │   │   ├── SearchField   { id, label, value, placeholder, disabled, onChange, ref }
            │   │   ├── SelectField   { id, label, value, options, disabled, onChange }   Category
            │   │   └── SelectField   { id, label, value, options, disabled, onChange }   Sort by
            │   ├── StatusMessage { id, tone, message, action? }
            │   ├── ProductGrid   { products, onAdd }
            │   │   └── ProductCard   { product, position, onAdd }    one per product, key = product.id
            │   │       └── ProductImage  { src, className, size }
            │   └── Toast         { toast, onDismiss, duration? }                [state: text on screen]
            └── Footer    { groups }
```

### Cart page (`cart.html`)

```
App                       { page }
└── CartProvider          { children }                                          [state: cart items]
    └── CartContext.Provider { value }
        └── Layout        { current, mainClassName, children }                  [state: theme choice (useTheme)]
            ├── Header    { children }
            │   ├── MainNav       { current, cartCount }
            │   │   ├── NavLink   { href, isCurrent, children }   "Shop"
            │   │   └── NavLink   { href, isCurrent, children }   "Cart"
            │   └── ThemeSwitch   { choice, onChange }
            ├── CartPage  (no props)                                            [state: products load + retry (useProducts),
            │   │                                                                       announcement (useAnnouncer)]
            │   ├── StatusMessage { id, tone, message, action? }
            │   ├── CartItemRow   { line, onChangeQty, onRemove }   one per cart line, key = product.id
            │   │   ├── ProductImage    { src, className, size }
            │   │   └── QuantityStepper { name, qty, onDecrease, onIncrease }
            │   └── CartSummary   { count, total, onClear }
            └── Footer    { groups }
```

When the cart is empty, `CartPage` shows the empty message instead of the rows and the summary. While
loading or after an error, `StatusMessage` shows the message (and **Try again**) and the rows wait.

### Who owns each piece of state

| State                                                  | Owner (file)                                        | Hook           | Who uses it                                                                                                                                                                                                                                                             |
| ------------------------------------------------------ | --------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart items `[{ id, qty }]`                             | `CartProvider` (`components/CartProvider.tsx`)      | `useState`     | Shared through `CartContext` (`useCart()`): `Layout` (badge count), `ShopPage` (add), `CartPage` (rows, + / − / Remove / Clear). Saved by `cart.state.ts` in `localStorage`, so it survives a refresh; reloaded on the `storage` event (another tab) and on `pageshow`. |
| Theme choice (System / Light / Dark)                   | `Layout` (`components/Layout.tsx`)                  | `useTheme`     | Passed to `ThemeSwitch` as `choice` / `onChange`. Saved by `theme.state.ts`.                                                                                                                                                                                            |
| Products: loading / ready / error, and the retry count | `ShopPage` and `CartPage` (each page loads its own) | `useProducts`  | The page passes what to show to `StatusMessage`, `ProductGrid` or the cart rows. **Try again** bumps the retry count.                                                                                                                                                   |
| Filters: search, category, sort                        | `ShopPage` (`pages/ShopPage.tsx`)                   | `useFilters`   | Passed to `ShopFilters`; kept in the URL (`?q=&category=&sort=`).                                                                                                                                                                                                       |
| Toast message                                          | `ShopPage`                                          | `useToast`     | Passed to `Toast` as `toast` / `onDismiss`.                                                                                                                                                                                                                             |
| Text on screen in the toast                            | `Toast` (`components/Toast.tsx`)                    | `useState`     | Its own: set one frame later, so a screen reader reads the same message again.                                                                                                                                                                                          |
| Cart announcement (live region)                        | `CartPage` (`pages/CartPage.tsx`)                   | `useAnnouncer` | Drawn by `CartPage` in a polite live region ("Silver Watch removed from your cart…").                                                                                                                                                                                   |

Not state, on purpose:

- **Derived during render:** the products shown (`filterProducts` + `sortProducts`, memoised in
  `ShopPage`), the cart lines, count and total (`cart.logic.ts`), the badge count.
- **Refs:** `searchRef` (`ShopPage`, focus after **Clear filters**), the cart heading and the focus
  before a sync (`CartPage`), the status line (`StatusMessage`), timers (`Toast`).
- **Constants:** the footer links (`lib/siteLinks.ts`), every sentence the pages show (`lib/messages.ts`).

### Check it with React DevTools

1. Install the React Developer Tools browser extension.
2. Run `npm run dev` and open the shop (or `cart.html`).
3. Open DevTools → **Components**. The tree is the one above: `App` at the top, `CartProvider`,
   `CartContext.Provider`, `Layout`… Click a component to see its **props** and its **hooks** (each
   `State` there is the state in the table).

`tests/component-tree.test.ts` checks that every component file in `src/` appears in the trees above.

## Rules the linter enforces

- No `any`, no type assertions (`as`), no non-null `!`.
- List items need a `key` from the data, never the array index.
- React hooks rules and complete effect dependencies.

## Credits and license

Product photos are from Pexels: see [CREDITS.md](CREDITS.md). The code is under the [MIT License](LICENSE).

## Agent skills

`.claude/skills/` holds two skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT): `vercel-react-best-practices` and `vercel-composition-patterns`.
