# OpenSource Together Agent Guidelines

## Architecture & Ownership

- `src/app` defines Next.js routing, layouts, metadata, and server components; keep business logic and feature UI outside this directory.
- Each feature lives under `src/features/<feature>` and encapsulates its own `components`, `views`, `forms`, `hooks`, `services`, `stores`, `types`, and `validations`.
- Cross-feature utilities belong in `src/shared` (components, hooks, lib, services, types). Keep these stateless and reusable.
- Global configuration sits in `src/config`, shared styles in `src/styles`, and static assets in `public`.
- Use kebab-case filenames with explicit suffixes (`.component.tsx`, `.view.tsx`, `.form.tsx`, `.hook.ts`, `.service.ts`, `.schema.ts`, `.type.ts`). Prefer named exports.

## Clean React Patterns

- Default to React Server Components; add `"use client"` only when a hook or browser API demands it.
- Compose small, predictable components with early returns and declarative data flows.
- Keep UI components stateless; place data fetching and mutations in feature hooks or services.
- Use Suspense for async boundaries and provide matching skeleton/empty/error states from `src/shared`.
- Align with accessibility best practices (semantic HTML, aria attributes, keyboard-friendly interactions).

## Data Fetching & State

- TanStack Query is the single source of server state. Use stable array query keys, explicit `staleTime`/`gcTime`, and handle errors via UI states or toasts.
- Hydrate data through `ReactQueryStreamedHydration` in `src/app/providers.tsx`; prefer server prefetched data when possible.
- Zustand stores are only for ephemeral client state (UI toggles, filters). Never mirror TanStack Query data in Zustand.
- Services wrap native `fetch`, check `response.ok`, parse JSON, and throw typed errors. Log contextual info before rethrowing.

## Forms, Validation & Types

- Build forms with React Hook Form plus Zod schemas stored alongside the feature (`*.schema.ts`). Re-export inferred types for reuse.
- Input components come from Shadcn UI / Radix primitives. Keep validations declarative and surface messages through `FormMessage`.
- Centralize shared schema helpers under `src/shared/validations`.

## Commands & Tooling

- Always use pnpm. Run scripts with `pnpm run <script>` (e.g., `pnpm run dev`, `pnpm run build`, `pnpm run lint`, `pnpm run type-check`, `pnpm run format`, `pnpm run pages:build`).
- Install or execute one-off tools with `pnpm dlx <pkg>`.
- Format intentionally with Prettier + Tailwind plugin; avoid accidental large diffs.

## Testing & Quality

- Co-locate tests using the `.test.ts(x)` suffix. Aim for smoke/integration coverage on new feature work.
- Until the dedicated runner lands, rely on `pnpm run lint` and `pnpm run type-check` as mandatory gates and document manual verification in PRs.
- Use TanStack Query Devtools and browser network tools during development; disable devtools in production builds.

## Git, PRs & Deployment

- Use Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.) with concise subjects.
- PRs must describe the change, include verification steps, relevant issue links, and UI evidence when applicable. Wait for CI green before merge.
- Copy `.env.example` to `.env` and manage secrets through Wrangler. Production deploys target Cloudflare Workers via OpenNext (`pnpm run pages:build` + Wrangler publish).
- Coordinate with maintainers when touching authentication, real-time features, or shared infrastructure to keep integrations aligned.
