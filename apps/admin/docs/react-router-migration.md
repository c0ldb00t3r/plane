# Admin App Migration to React Router v7 Framework Mode

## Goals
- Replace the existing Next.js App Router implementation in `apps/admin` with React Router v7 framework mode while preserving current UX and integrations.
- Maintain compatibility with existing MobX stores, SWR data flows, `@plane/*` packages, and theming infrastructure.
- Align build, deployment, and CI pipelines with the new router tooling (Vite-based) without disrupting other workspaces.

## Summary of Current State
- Routing and layouts rely on Next.js file-system conventions with nested groups (`(all)`, `(home)`, `(dashboard)`).
- Global providers live in `app/(all)/layout.tsx` (ThemeProvider, SWR, MobX root store, instance/user providers).
- Authenticated sections (`(dashboard)` routes) share chrome and guard logic via MobX state + `next/navigation` redirects.
- All data fetching is client-side (SWR + MobX async actions); no Next.js data fetching primitives or SSR.
- Assets & metadata depend on `ADMIN_BASE_PATH`, `export const metadata`, and `next/image` utilities.

## Target Architecture
- Use the React Router framework file layout with route modules under `app/routes/`.
- Provide a `root.tsx` wrapper that rehydrates global providers and loads global styles.
- Split layouts into public and authenticated route modules mirroring `home` and `dashboard` stacks.
- Implement loaders/actions selectively to pre-hydrate MobX stores while continuing to use SWR for incremental revalidation.
- Replace navigation and head utilities with React Router equivalents (`Link`, `useNavigate`, `meta` exports, `<Meta />`).
- Swap `next/image` with a lightweight `<PlaneImage />` helper that respects the deployment base path.

## Proposed Directory Structure (React Router)
```
apps/admin/
  app/
    routes.ts
    root.tsx
    providers.tsx          # wraps ThemeProvider, SWRConfig, MobX Store
    routes/
      public-layout.tsx
      home.tsx
      authenticated-layout.tsx
      general.tsx
      workspace.tsx
      workspace-create.tsx
      email.tsx
      authentication.tsx
      authentication-github.tsx
      authentication-gitlab.tsx
      authentication-google.tsx
      ai.tsx
      image.tsx
    components/
      RequireAuth.tsx
      PlaneImage.tsx
  entry.client.tsx
  entry.server.tsx
  react-router.config.ts
  vite.config.ts
  tsconfig.json            # updated to React baseline
  package.json             # scripts updated to react-router CLI
  public/
  styles/
  ... (existing core/, ce/, ee/ remain)
```

## Migration Steps

### 1. Tooling & Dependencies
- Install React Router v7 framework packages: `@react-router/dev`, `@react-router/node`, `react-router`, `react-router-dom`.
- Remove Next.js dependencies (`next`, `next/navigation`, `next-themes` stays) and related CLI scripts.
- Update `package.json` scripts to use `react-router dev`, `react-router build`, `react-router start`.
- Replace Next.js TypeScript config with a React/Vite-friendly base (`@plane/typescript-config/react.json` if available) and remove `next-env.d.ts`.
- Add `.react-router/` to `.gitignore`.

### 2. Project Scaffolding
- Generate framework mode boilerplate (CLI or manual): create `entry.client.tsx`, `entry.server.tsx`, `app/root.tsx`, `app/routes.ts`, and `react-router.config.ts`.
- Configure `react-router.config.ts`:
  - Set `appDirectory: "app"`, `ssr: false` (CSR only), `base` to `process.env.NEXT_PUBLIC_ADMIN_BASE_PATH` or similar.
  - Enable framework features as needed (`future.v8_fetcherPersist`, `v8_partialHydration`, etc. when stable).
- Import global CSS (`@/styles/globals.css`) in entry points instead of layouts.
- Ensure Vite aliases replicate existing `tsconfig` path mappings.

### 3. Route Module Mapping
- Translate Next.js route inventory into explicit `route()` entries in `app/routes.ts`.
- Create route modules under `app/routes/` mirroring page components. Each module should:
  - Export `Component` (wrapped with `observer` when needed).
  - Reuse existing page-level components, adjusting imports from `@/` aliases.
  - Export `meta` functions to replace `export const metadata`.
  - Define `clientLoader` functions where initial data fetch should block navigation (e.g., `InstanceProvider`, `fetchCurrentUser`).
- Implement `public-layout.tsx` and `authenticated-layout.tsx` modules that render shared shells and run guard logic.

### 4. Provider Consolidation
- Move logic from `app/(all)/layout.tsx`, `instance.provider.tsx`, `user.provider.tsx`, and `store.provider.tsx` into a unified `providers.tsx` module.
- Wrap `<Outlet />` children with ThemeProvider, SWRConfig, MobX Store context, Instance/User providers.
- Consider exposing helper hooks for loader contexts if we shift SWR calls into loaders.

### 5. Auth Guard & Navigation
- Replace `next/navigation` usage with React Router hooks:
  - `useNavigate` for redirects inside effects.
  - `useLocation`/`useParams` for active state and query parsing.
  - Create a `RequireAuth` component that checks `useUser().isUserLoggedIn` and redirects unauthenticated users.
- Update navigation components (`sidebar-menu.tsx`, `header.tsx`) to rely on `Link`, `NavLink`, and `useLocation` with normalized trailing slashes.

### 6. Query Param Handling
- Swap `useSearchParams` from Next.js with React Router's `useSearchParams` (same signature) or `useLocation` + `URLSearchParams`.
- Verify forms like `InstanceSetupForm` and `InstanceSignInForm` continue to parse error tokens and OTP flows correctly.

### 7. Asset & Metadata Strategy
- Implement a reusable `<PlaneImage />` component wrapping `<img>` and automatically prefixing `ADMIN_BASE_PATH` when needed.
- Move favicon and manifest links into `root.tsx` `<head>` via `<Links />` and `<Meta />`.
- Replace `export const metadata` with `meta` functions on route modules; ensure titles replicate current copy.

### 8. Error Boundaries & Loading States
- Define a top-level route `ErrorBoundary` export to mirror `app/error.tsx` behaviour.
- Optionally add route-level boundaries for critical flows (workspace create, auth providers).
- Retain SWR-based loading placeholders; evaluate adopting React Router's `<Await>` if loaders return promises.

### 9. Build & Deployment
- Update Dockerfiles (`Dockerfile.admin`, `.dev`) to use `react-router` CLI commands and new build artifacts (`build/client`, `build/server` if SSR enabled later).
- Adjust proxies (Caddy) to serve from the new asset directory while respecting trailing slashes.
- Revise CI workflows to run `pnpm --filter admin run build` with new scripts.

### 10. Validation Checklist
- Run `pnpm --filter admin run check:lint` and `check:types` after dependency swaps.
- Smoke test all routes, ensuring redirects, modals, and SWR mutations behave identically.
- Verify dark/light theme toggling with the new entry point to prevent FOUC.
- Confirm workspace creation and authentication provider toggles still hit backend endpoints.

## Incremental Migration Tips
- Branch off `preview` and preserve the Next.js implementation until feature parity is proven (e.g., keep both builds behind flags).
- Start by scaffolding React Router alongside Next.js, toggled by an environment variable in `package.json` scripts for internal QA.
- Migrate routes in batches, reusing existing components where possible before refactoring for loaders/actions.
- Automate regression coverage using existing MobX-driven tests or add Playwright smoke tests once the router swap stabilizes.

## Open Questions
- Should we introduce SSR or remain CSR-only for admin? (Current plan keeps CSR.)
- Is there appetite to refactor SWR usage into loader-driven data fetching for initial render? (Optional, can defer.)
- How should we handle legacy Next.js-specific imports during transition (feature flags vs. immediate swap)?
- Coordinate with infra to ensure `ADMIN_BASE_PATH` is provided at build time for the new toolchain.
