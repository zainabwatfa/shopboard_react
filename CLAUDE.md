# ShopBoard (React)

The React + TypeScript version of ShopBoard, a demo shop built for a course (task 2: "ShopBoard UI in React").
Nothing is sold: no real orders, no payments, no checkout. The first version (plain TypeScript) is [zainabwatfa/shopboard](https://github.com/zainabwatfa/shopboard).

Two pages, both drawn by React from `src/main.tsx`:

| File         | `<body data-page>` | What it shows                                                                   |
| ------------ | ------------------ | ------------------------------------------------------------------------------- |
| `index.html` | `shop`             | Search, category filter, sort (kept in the URL), product cards, toast after add |
| `cart.html`  | `cart`             | Cart rows (+ / − / Remove), summary with a demo note, Clear cart                |

Both HTML files have the same `<head>`: meta tags, Google Fonts, `src/styles.css` and a small inline script that applies the saved theme (`shopboard-theme`, the key `theme.state.ts` uses) before the first paint. A new page must also be added to `build.rollupOptions.input` in `vite.config.ts`.

## Scripts

`npm run dev` (open http://localhost:5173/), `npm run lint` (oxlint, 0 warnings allowed), `npm run typecheck`, `npm test` (`node --test`, Node 22 runs the `.ts` tests directly), `npm run build`, `npx prettier --check .`.
Run all of them after every change. `.github/workflows/ci.yml` runs lint, typecheck, test and build on every push and pull request. npm reaches the registry only through the proxy: `env -u NO_PROXY -u no_proxy npm_config_noproxy=localhost npm …`.

## Rules (the course checklist)

1. **Day 3 files are copied, not edited.** The `*.types.ts`, `*.logic.ts`, `*.state.ts` and `*.api.ts` files in `src/features/*/`, and `src/shared/api/client.ts`, come from the first repo (commit d77a533, where every `as` had been replaced by type guards). The only change allowed is `import type`. One agreed exception: `client.ts` also reads the API base URL (`VITE_API_BASE_URL`, see `.env.example`) through `resolveApiUrl`, which the first repo did not have. They are listed in `.prettierignore`, so Prettier never reformats them. React code calls them; it never copies their logic.
2. **No `any`, no `as` (not even `as const`), no non-null `!`.** Check with `instanceof`, `typeof` or a type guard instead. oxlint enforces this. `grep -rn " as " src/features src/shared` must find no type assertion.
3. **List keys come from the data** (`product.id`, `group.heading`, `link.href`, `option.value`), never the array index.
4. **Every state shows the right message.** Shop: "Loading products…", an error with **Try again** (retries without a reload), "No products are available right now." when the API gives none, "No products match your search." with **Clear filters**. Cart: "Loading your cart…", an error with **Try again** that says the saved items are kept, an empty cart with a link to the shop.
5. **No React warnings in the Console.** Check in the browser after a change, not only with the tests.
6. The cart is saved only by `cart.state.ts` (`addToCart`, `changeQty`, `removeFromCart`, `clearCart`, `keepOnly`, `getCart`, `reloadCart`), as `[{ id, qty }]` in `localStorage`. Prices always come from the product data. `CartProvider` is the only component that calls `cart.state.ts`; it reloads the cart on the browser `storage` event (another tab) and on `pageshow` from the Back/Forward cache.
7. Only `theme.state.ts` saves the theme choice.
8. Keep the accessibility the first site had: labelled controls, polite live regions for status lines, cart changes and the toast, a confirm before Clear cart, focus to the cart heading when a row disappears, visually hidden "Quantity" text.
9. Content stays true: it is a demo for a course. No invented company, address, people or policies.
10. **The README's component tree matches the code, file for file.** It starts at `App` and shows each component's props and who owns each piece of state. When you add, remove or rename a component, or change its props or state, update the tree and the state table in README.md. `tests/component-tree.test.ts` fails if a component file is missing from the tree or the tree names a component with no file. Check it with the Components tab in React DevTools.
11. Follow the skills in `.claude/skills/` (`vercel-react-best-practices`, `vercel-composition-patterns`): no components defined inside components, derive values during render instead of syncing them in effects, functional `setState`, `use(Context)` and `ref` as a prop (React 19), composition over boolean props.

## Mistakes I don't want the AI to make

> DRAFT written by Claude from the Debug Lab bugs and from mistakes made while building this repo. Rewrite these in your own words before you submit.

From the Debug Lab (details in `debug-lab-log.md`):

1. **Never put a number before `&&` in JSX.** `{count && <p>…</p>}` draws a "0" when `count` is 0, because React draws numbers. Write `{count > 0 && …}` or a ternary. No tool catches this one: look at the page.
2. **Never change props or state in place.** No `item.qty = …`, `push`, `splice` or `sort` on something that came from props or state. Make a new object or array and pass it to `setState` (functional update: `setCart((current) => …)`). `setState` with the same object does nothing, so the screen does not update, and the change shows up later at a random render. oxlint flags assignments to props (`react/immutability`).
3. **Never sort the array you were given.** `list.sort()` changes the original: in the lab it changed the shared product list for good, so "Featured" lost its order. Sort a copy: `[...list].sort(…)` or `list.toSorted(…)`. oxlint enforces it (`unicorn/no-array-sort`; off only for the copied Day 3 files, which already sort copies).
4. **A key decides which state belongs to which item.** Every list item needs a `key`, and it must come from the data (`product.id`), never the array index. With `key={index}`, sorting moved a saved heart to another product, because the state stayed with key 0. A missing key also shows a warning in the Console.
5. **tsc and lint passing doesn't mean it works.** For the 5 lab bugs, tsc found none and the lab's lint found 2. After every change, open the page: the Console must have no warnings, and the props, state and keys in the React DevTools Components tab must match what the screen shows.

From mistakes made while building this repo:

6. **Don't copy a template's shortcuts.** The Vite template's `main.tsx` used `document.getElementById("root")!`. Check the element with `instanceof HTMLElement` and throw a clear error instead.
7. **Protect copied files before formatting.** `prettier --write .` once reformatted the copied Day 3 files. Add them to `.prettierignore` before running a formatter on the whole repo, and check with `git diff` that they did not change.

## Folder layout

```
src/
├── features/         one folder per feature: cart, products, theme
│   └── <feature>/    its Day 3 files (*.types / *.api / *.logic / *.state, copied unchanged),
│                     components/ and hooks/ that belong to it (products/ also has hero.ts)
├── shared/           what several features use
│   ├── api/          client.ts: fetchJson, ApiError, resolveApiUrl (the only file that calls fetch)
│   ├── components/   Layout, Header, MainNav, NavLink, Footer, StatusMessage, Toast, SearchField, SelectField
│   └── hooks/        useToast, useAnnouncer, useStorageSync
├── pages/            ShopPage.tsx, CartPage.tsx: decide what happens; components draw it
├── lib/              small helpers: messages.ts (every sentence the pages show, pure and tested), format.ts, page.ts, siteLinks.ts
├── vite-env.d.ts     types for the VITE_ environment variables
├── main.tsx          reads <body data-page> and renders <App page> inside StrictMode
├── App.tsx           the top of the component tree: CartProvider > Layout > the page
└── styles.css        copied from the first repo, so the look is the same
tests/                node:test files: the copied Day 3 tests, the API client, messages, page and the README component tree
debug-lab-log.md      the 5 Debug Lab bugs: what I saw, the component, how I found it, the cause, the fix
docs/debug-lab/       React DevTools screenshots for each Debug Lab step (linked from debug-lab-log.md)
public/               api/products.json and products/ (pictures; credits in CREDITS.md)
```

## Paths: no leading `/`

GitHub Pages serves a project site under `/<repo-name>/`, so a path that starts with `/` points outside it. Hand-written links and paths are relative: `index.html`, `cart.html`, `./`, `api/products.json`, `products/x.webp`. `vite.config.ts` sets `base: "./"`. The only exception is the `<script>`, `<link>` and favicon paths in the HTML files (`/src/main.tsx`, `/src/styles.css`, `/favicon.svg`): Vite rewrites those to relative paths when it builds.
