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
├── main.tsx            picks the page from <body data-page="shop|cart">
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

## Rules the linter enforces

- No `any`, no type assertions (`as`), no non-null `!`.
- List items need a `key` from the data, never the array index.
- React hooks rules and complete effect dependencies.

## Credits and license

Product photos are from Pexels: see [CREDITS.md](CREDITS.md). The code is under the [MIT License](LICENSE).

## Agent skills

`.claude/skills/` holds two skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT): `vercel-react-best-practices` and `vercel-composition-patterns`.
