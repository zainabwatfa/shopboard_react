# ShopBoard (React)

The React + TypeScript version of ShopBoard, a demo shop built for a course. It takes no real orders and no payments.

The first version (plain TypeScript, no framework) lives in [zainabwatfa/shopboard](https://github.com/zainabwatfa/shopboard).

The app uses React Router with lazy-loaded pages:

- `/` and `/shop` — the shop, with a hero, search, category filter, sorting, and product cards.
- `/products/:id` and `/product/:id` — an individual product and related products.
- `/cart` — the cart (+ / − / Remove, total, Clear cart).
- `/checkout` — the simulated checkout.
- `/about` — about page.
- `/faq` — frequently asked questions.
- Any unmatched route displays the 404 page.

The cart is saved on this device (`localStorage`) and stays in sync across open tabs. A System / Light / Dark switch is available in the shared layout. Product data comes from `public/api/products.json`.

## Scripts

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Starts the Vite dev server.                       |
| `npm run build`        | Type-checks (`tsc -b`), then builds into `dist/`. |
| `npm run typecheck`    | Type-checks only.                                 |
| `npm run lint`         | Runs oxlint; fails on any warning.                |
| `npm test`             | Runs the tests in `tests/` with `node --test`.    |
| `npm run format`       | Formats every file with Prettier.                 |
| `npm run format:check` | Checks formatting without changing files.         |
| `npm run preview`      | Serves the built `dist/` locally.                 |

A husky pre-commit hook runs lint-staged: oxlint and Prettier on the staged files. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on every push and pull request.

## Structure

```text
index.html                 HTML entry point (React renders inside #root)
src/
├── main.tsx               Starts React inside StrictMode
├── App.tsx                App providers, router, routes and lazy-loaded pages
├── pages/                 ShopPage, ProductPage, CartPage, CheckoutPage,
│                          AboutPage, FaqPage, NotFoundPage
├── features/              Feature folders (cart, products, theme), with
│                          their components, hooks and logic
├── shared/                Shared API client, components and hooks
│   ├── api/
│   ├── components/
│   └── hooks/
├── lib/                   Shared messages, formatting, page utilities and site links
└── styles.css             App styles

tests/                     node:test tests for logic, cart state, API, data and messages
public/                    api/products.json and product pictures
```

The Day 3 files (`*.types.ts`, `*.logic.ts`, `*.state.ts`, `*.api.ts` in `src/features/*/`) and `src/shared/api/client.ts` are copied unchanged from the first repo (only `import type` may change), so they are listed in `.prettierignore`. The one exception is the API base URL in `client.ts`.

## API base URL

By default the data is read from this site (`public/api/products.json`). To read it from another server, copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (for example `https://api.example.com/v1/`). `resolveApiUrl` in `client.ts` puts it in front of every API path.

## Component tree

The trees below describe the main React components and the props they receive. `[state: …]` marks the component that owns a piece of state. `main.tsx` wraps `App` in `StrictMode`.

### Shared application wrapper

```
main.tsx
└── StrictMode
    └── App { page? }
        └── CartProvider { children }                         [state: cart items]
            └── CartContext.Provider { value }                (shares the cart)
                └── BrowserRouter
                    └── Suspense { fallback: PageFallback }
                        ├── PageFallback (no props)
                        │   └── StatusMessage { id, tone, message }
                        └── Routes
                            └── Layout
                                ├── Header
                                │   ├── MainNav
                                │   │   └── NavLink
                                │   └── ThemeSwitch
                                ├── (active route page)
                                └── Footer { groups }
```

`App` defines the routes inside `Layout`. The route pages are lazy-loaded, so their code is downloaded when the route is opened. `PageFallback` is displayed while a lazy-loaded page is loading.

### Primary routes (Shop, Product, Cart)

```
Layout { current?, mainClassName?, children? }
[state: theme choice (useTheme)]
├── Header { children }
│   ├── MainNav { current, cartCount? }
│   │   ├── NavLink { href, isCurrent, children }   "Shop"
│   │   ├── NavLink { href, isCurrent, children }   "About"
│   │   ├── NavLink { href, isCurrent, children }   "FAQ"
│   │   └── NavLink { href, isCurrent, children }   "Cart"
│   └── ThemeSwitch { choice, onChange }
├── ShopPage (no props)
│   [state: products load + retry, filters, toast]
│   ├── Hero { tiles, productCount, onPick }
│   │   one tile per product, key = tile.id
│   ├── ShopFilters { filters, onChange, disabled, searchRef }
│   │   ├── SearchField { id, label, value, placeholder, disabled, onChange, ref }
│   │   ├── SelectField { id, label, value, options, disabled, onChange } Category
│   │   └── SelectField { id, label, value, options, disabled, onChange } Sort by
│   ├── StatusMessage { id, tone, message, action? }
│   ├── ProductGrid { products, onAdd }
│   │   └── ProductCard { product, position, onAdd }
│   │       one per product, key = product.id
│   │       └── ProductImage { src, className, size }
│   └── Toast { toast, onDismiss, duration? }
│       [state: text on screen]
├── ProductPage (no props)
│   [state: product load + retry, toast]
│   ├── StatusMessage { id, tone, message, action? }
│   ├── ProductDetail { product, onAdd }
│   │   └── ProductImage { src, className, size }
│   ├── ProductGrid { products, onAdd }
│   │   └── ProductCard { product, position, onAdd }
│   │       └── ProductImage { src, className, size }
│   └── Toast { toast, onDismiss, duration? }
└── CartPage (no props)
    └── DataBoundary {
          statusId,
          loadingMessage,
          onRetry,
          formatError
        }
        └── ErrorBoundary { onReset, fallback }
            ├── StatusMessage { id, tone, message, action? }
            │   error fallback
            └── Suspense { fallback }
                ├── StatusMessage { id, tone, message }
                │   loading fallback
                └── CartContent (no props)
                    ├── CartItemRow { line, onChangeQty, onRemove }
                    │   one per cart line, key = product.id
                    │   ├── ProductImage { src, className, size }
                    │   └── QuantityStepper { name, qty, onDecrease, onIncrease }
                    └── CartSummary { count, total, onClear }
```

`DataBoundary` handles the loading and error states for data-dependent content. It uses `ErrorBoundary` to display an error message with a retry action, and `Suspense` to display a loading message. The page content is rendered after the data is available.

When the cart is empty, `CartPage` shows the empty message instead of the rows and summary. While product data is loading or an error is displayed, the cart content waits.

### Secondary routes (Checkout, About, FAQ, 404)

```
Layout
├── Header
│   ├── MainNav { current, cartCount? }
│   │   └── NavLink { href, isCurrent, children }
│   └── ThemeSwitch { choice, onChange }
├── CheckoutPage (no props)
│   [state: products load + retry, submittedOrder]
│   ├── StatusMessage { id, tone, message, action? }
│   └── ProductImage { src, className, size }
├── AboutPage (no props)
├── FaqPage (no props)
├── NotFoundPage (no props)
└── Footer { groups }
```

### Who owns each piece of state

| State                                                  | Owner (file)                                                 | Hook           | Who uses it                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cart items `[{ id, qty }]`                             | `CartProvider` (`features/cart/components/CartProvider.tsx`) | `useState`     | Shared through `CartContext` (`useCart()`): `MainNav` (badge count), `ShopPage` (add), `ProductPage` (add), `CartPage` (rows, + / − / Remove / Clear), `CheckoutPage` (summary, clear on place order). Saved by `cart.state.ts` in `localStorage`, so it survives a refresh; reloaded on the `storage` event (another tab) and on `pageshow`. |
| Theme choice (System / Light / Dark)                   | `Layout` (`shared/components/Layout.tsx`)                    | `useTheme`     | Passed to `ThemeSwitch` as `choice` / `onChange`. Saved by `theme.state.ts`.                                                                                                                                                                                                                                                                  |
| Products: loading / ready / error, and the retry count | `ShopPage`, `CartPage`, and `CheckoutPage`                   | `useProducts`  | The page passes what to show to `StatusMessage`, `ProductGrid`, or the cart rows. The retry action triggers another load.                                                                                                                                                                                                                     |
| Single product: loading / ready / error / not-found    | `ProductPage` (`pages/ProductPage.tsx`)                      | `useProduct`   | Loads a single product from the API by its id, and displays details and related items. The retry action triggers another load.                                                                                                                                                                                                                |
| Filters: search, category, sort                        | `ShopPage` (`pages/ShopPage.tsx`)                            | `useFilters`   | Passed to `ShopFilters`; kept in the URL (`?q=&category=&sort=`).                                                                                                                                                                                                                                                                             |
| Toast message                                          | `ShopPage` and `ProductPage`                                 | `useToast`     | Passed to `Toast` as `toast` / `onDismiss`.                                                                                                                                                                                                                                                                                                   |
| Text on screen in the toast                            | `Toast` (`shared/components/Toast.tsx`)                      | `useState`     | Its own: set one frame later, so a screen reader reads the same message again.                                                                                                                                                                                                                                                                |
| Cart announcement (live region)                        | `CartPage` (`pages/CartPage.tsx`)                            | `useAnnouncer` | Drawn by `CartPage` in a polite live region.                                                                                                                                                                                                                                                                                                  |
| Checkout submitted order state                         | `CheckoutPage`                                               | `useState`     | Displayed when the simulated order is confirmed.                                                                                                                                                                                                                                                                                              |

Not state, on purpose:

- **Derived during render:** the products shown (`filterProducts` + `sortProducts`, memoised in `ShopPage`), the hero sticker's product count, the cart lines, count and total (`cart.logic.ts`), the badge count.
- **Refs:** `searchRef` (`ShopPage`, focus after **Clear filters**), the cart heading and the focus before a sync (`CartPage`), the status line (`StatusMessage`), timers (`Toast`).
- **Constants:** the footer links (`lib/siteLinks.ts`), the hero tiles (`features/products/hero.ts`), every sentence the pages show (`lib/messages.ts`).

### Check it with React DevTools

1. Install the React Developer Tools browser extension.
2. Run `npm run dev` and open the shop.
3. Open DevTools → **Components**. Inspect the component tree, props and hooks. The `StrictMode` wrapper is not listed as a component in React DevTools.

`tests/component-tree.test.ts` checks that every component file in `src/` appears in the trees above.

## Rules the linter enforces

- No `any`, no type assertions (`as`), no non-null `!`.
- List items need a `key` from the data, never the array index.
- React hooks rules and complete effect dependencies.

## Credits and license

Product photos are from Pexels: see [CREDITS.md](CREDITS.md). The code is under the [MIT License](LICENSE).

## Agent skills

`.claude/skills/` holds two skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT): `vercel-react-best-practices` and `vercel-composition-patterns`.
