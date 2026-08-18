# AGENTS.md — ticker-admin

## Project Overview

React 19 admin UI for the [systemli/ticker](https://github.com/systemli/ticker) backend.
Built with TypeScript (strict), Vite, MUI, TanStack React Query, react-hook-form,
react-router, and i18next. See `package.json` for versions. Node 24 (see `.nvmrc`), npm as
package manager (`package-lock.json`; do not use yarn).

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build (vite build)
npm run tsc          # TypeScript type-checking (no emit)
npm run lint         # ESLint (ts,tsx, zero warnings allowed)
npm run test         # Vitest in watch mode
npm run coverage     # Vitest single run with v8 coverage (lcov)
```

### Running a single test

```bash
npx vitest run src/api/Ticker.test.ts              # Run one test file
npx vitest run src/components/ticker/TickerList     # Match by partial path
npx vitest run -t "should render"                   # Match by test name
```

### Formatting (not in package.json scripts)

```bash
npx prettier --write src/                           # Format all source files
npx prettier --check src/                           # Check formatting (CI uses this)
```

## Code Style & Formatting

Configured in `.prettierrc.json`:

- **No semicolons**
- **Single quotes**
- **2-space indentation**
- **Print width 160** (wide lines — most JSX props stay on one line)
- **Trailing commas (ES5)**
- **No parens for single arrow params** (`x => x`, not `(x) => x`)

ESLint (`eslint.config.js`, flat config): `eslint:recommended` + `typescript-eslint`
recommended + `react-hooks/recommended` + `react-refresh/only-export-components` (warn).

## TypeScript Conventions

- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Use `interface` for object shapes (Props, API data, context types)
- Use `type` only for unions and aliases: `type Severity = 'success' | 'error' | 'warning' | 'info'`
- No `I` prefix on interfaces
- Component props interfaces are always named just `Props` (not `ComponentNameProps`)
- Form data types use `FormData` suffix: `TickerFormData`, `TickerMastodonFormData`
- API response types use `ResponseData` suffix: `TickerResponseData`, `TickersResponseData`
- Types are co-located with the code that uses them — no dedicated `types/` directory

## Component Patterns

- **Arrow functions with `const`**, always typed with `FC` or `FC<Props>`:
  ```tsx
  const TickerList: FC<Props> = ({ token }) => { ... }
  const LoginView: FC = () => { ... }
  ```
- **Default exports only** for components: `export default TickerList`
- Interfaces and types are named exports inline
- Sub-components in the same file are plain arrow functions without `FC` and are not exported
- Provider components (e.g., `AuthProvider`) use function declarations, not arrow functions

## File Naming

| Kind          | Convention            | Example                                 |
| ------------- | --------------------- | --------------------------------------- |
| Components    | PascalCase `.tsx`     | `TickerList.tsx`, `MessageForm.tsx`     |
| Views         | PascalCase + `View`   | `TickerView.tsx`, `LoginView.tsx`       |
| API modules   | PascalCase `.ts`      | `Ticker.ts`, `Api.ts`, `Message.ts`     |
| Context files | PascalCase            | `AuthContext.tsx`                       |
| Custom hooks  | camelCase `use*`      | `useAuth.tsx`, `useDebounce.tsx`        |
| Query hooks   | camelCase `use*Query` | `useTickerQuery.tsx`                    |
| Tests         | Co-located `.test.`   | `Ticker.test.ts`, `TickerList.test.tsx` |

## Import Style

- All imports in a single block — **no blank lines between groups**
- General order (not enforced by tooling): third-party libs → React → router/i18n → local API/utils → local contexts/hooks → local components
- Roughly alphabetical by module path within the block

## API Layer (`src/api/`)

- Thin function-based layer, no classes
- `apiClient<T>(url, options)` wraps `fetch()`, returns `ApiResponse<T>`, never throws
- API functions are named exports using **function declarations**: `export async function verbEntityApi(...)`
- Naming convention: `fetchTickersApi`, `postMessageApi`, `putTickerApi`, `deleteTickerApi`
- First parameter is always `token: string`
- Returns `Promise<ApiResponse<SpecificResponseData>>`

## Error Handling

- `apiClient` catches all errors and returns `{ status: 'error', error: { code, message } }`
- Components use `handleApiCall(apiPromise, { onSuccess, onError, onFailure })`:
  - `onSuccess` — server returned `status: 'success'`
  - `onError` — server returned `status: 'error'`
  - `onFailure` — promise rejected (network error)
- User-facing errors go through `useNotification` → `createNotification({ content, severity })`
- Views check TanStack Query errors and render `<ErrorView>` for failed queries
- Error casting: `(error as Error).message` for unknown catch clauses

## Context Pattern

Each context follows a 3-file structure:

1. `FooContext.tsx` — `createContext`, exports `FooProvider` (function declaration) + default-exports context
2. `useFoo.tsx` — custom hook calling `useContext(FooContext)` with error guard
3. `useFoo.test.tsx` — tests for the hook

Query hooks in `src/queries/` wrap TanStack `useQuery`/`useMutation` and are default-exported.

## Testing Conventions

- **Framework:** Vitest 4 with jsdom, globals enabled, 10s timeout
- **Libraries:** @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
- **Mocking:** `fetchMock` (vitest-fetch-mock) for API calls, globally enabled in `vitest-setup.ts`
- **Setup:** `vitest-setup.ts` mocks fetch, i18n (English), and localStorage globally
- **Test helpers** in `src/tests/utils.tsx`: `renderWithProviders`, `createAuthWrapper`, token helpers

### Test structure

```tsx
describe('ComponentName', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should render the component', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', data: { ... } }))
    renderWithProviders(<Component />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

- Use `describe`/`it` (not `test`)
- Use `renderWithProviders` for components needing context (auth, notifications, router, query client)
- Use plain `render` for simple presentational components
- Define local `component()` factory functions for test JSX
- Define local data factory functions for test data (cast with `as Type`)
- Use `setMockToken(token)` for authenticated test scenarios
- Mock child components with `vi.mock('./ChildComponent', () => ({ ... }))`
- Reset mocks in `beforeEach`, restore in `afterEach` when using fake timers

## Environment Variables

- Prefixed with `TICKER_` for Vite exposure (configured in `vite.config.ts`)
- `TICKER_API_URL` — backend API base URL, including the `/v1` suffix. Normally unset: the app then
  uses a relative `/api`, which the dev-server proxy and the image's nginx both forward. Attachment
  URLs come back relative as `/api/media/<file>`; resolve them with `mediaUrl()` from
  `src/api/Api.ts` so they also work with an absolute value.

## Commits and Pull Requests

### Commit messages

Start every commit with a [Gitmoji](https://gitmoji.dev/), followed by a space and a short
description in the imperative mood. Use the **Unicode emoji**, not the `:shortcode:` form — both
occur in the history, but new commits should use the emoji.

| Emoji | Use for |
| ----- | ------- |
| ✨ | New feature |
| 🐛 | Bug fix |
| 🩹 | Minor, non-critical fix |
| ♻️ | Refactor |
| ✅ | Add, update or pass tests |
| 🧪 | Add a deliberately failing test |
| 📝 | Documentation |
| ⬆️ | Upgrade dependencies |
| ➖ | Remove a dependency |
| 🔥 | Remove code or files |
| 👷 | CI / build system |
| 🔧 | Configuration files |
| 🚨 | Fix linter or compiler warnings |
| ⚡️ | Performance |
| 🔒️ | Security fix |
| 🗃️ | Database schema or storage changes |
| 🔊 | Logging |
| 💄 | UI and styling |
| 🌐 | Internationalization and localization |

Examples:

```
✨ Add Bluesky reply restrictions
🐛 Fix message ordering on the public timeline
♻️ Extract origin handling into a helper
✅ Cover the upload handler
⬆️ Upgrade dependencies
```

### Pull requests

PR titles follow the same Gitmoji convention as commits.

Every PR must be labeled. `release-drafter` (`.github/release-drafter.yml`) uses the label to
choose both the changelog category and the version bump:

| Label                   | Category       | Version bump |
| ----------------------- | -------------- | ------------ |
| `feature`               | 🚀 Features    | major        |
| `enhancement`           | 🚀 Features    | minor        |
| `fix`, `bugfix`, `bug`  | 🐛 Bug Fixes   | patch        |
| `chore`, `dependencies` | 🧹 Maintenance | patch        |

An unlabeled PR falls back to a patch bump. A release draft is kept up to date on every push to
`main`; drafts that are a pure patch bump are published automatically on the first of each month.

## CI/CD

GitHub Actions workflows: `integration.yml` (test + build + SonarCloud + Dependabot
automerge), `quality.yaml` (Prettier + ESLint), `release-drafter.yml` (maintains the draft
release), `release-monthly.yml` (publishes a patch draft monthly), `release.yml` (build
artifact + Docker multi-arch push to `systemli/ticker-admin`).
Docker: multi-stage build (node:24-alpine → nginx:stable-alpine). The image ships
`docker/nginx.conf.template` to `/etc/nginx/templates/`, which the base image renders at start with
`TICKER_API_URL` substituted, so the container serves the SPA and proxies `/api/` itself.

Deployment, configuration and troubleshooting are documented centrally at
<https://systemli.github.io/ticker/>.
