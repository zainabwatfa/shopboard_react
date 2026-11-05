# ShopBoard (React)

The React + TypeScript version of ShopBoard, a demo shop built for a course. It takes no real orders and no payments.

The first version (plain TypeScript, no framework) lives in [zainabwatfa/shopboard](https://github.com/zainabwatfa/shopboard).

## Scripts

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Starts the Vite dev server.                       |
| `npm run build`        | Type-checks (`tsc -b`), then builds into `dist/`. |
| `npm run typecheck`    | Type-checks only.                                 |
| `npm run lint`         | oxlint; fails on any warning.                     |
| `npm run format`       | Formats every file with Prettier.                 |
| `npm run format:check` | Checks formatting without changing files.         |
| `npm run preview`      | Serves the built `dist/` locally.                 |

A husky pre-commit hook runs lint-staged: oxlint and Prettier on the staged files.

## Rules the linter enforces

- No `any`, no type assertions (`as`), no non-null `!`.
- List items need a `key` from the data, never the array index.
- React hooks rules and complete effect dependencies.

## Agent skills

`.claude/skills/` holds two skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT): `vercel-react-best-practices` and `vercel-composition-patterns`.
