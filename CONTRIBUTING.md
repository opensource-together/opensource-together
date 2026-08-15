# Contributing

OpenSource Together is built in public. We welcome focused contributions that
are easy to review and consistent with the existing product experience.

## Start locally

```bash
git clone https://github.com/opensource-together/opensource-together.git
cd opensource-together
pnpm install
pnpm dev:mock
```

The app runs at [localhost:3000](http://localhost:3000) against a local mock API.
No environment variables, database, Docker, backend access, or OAuth app are
required.

Use the **Mock mode** control in the bottom-left corner to switch between signed
in and signed out states. Local changes are kept in memory and reset when the
mock server restarts.

## Before you submit

```bash
pnpm lint
pnpm type-check
pnpm test:mock
```

Keep pull requests small and purposeful. For visual changes, include before and
after screenshots. Avoid unrelated formatting or refactors.

## Working with mocks

The public frontend does not require access to the private backend. Its local
API covers the product flows needed for frontend development, including project
discovery, profiles, bookmarks, ownership, and project mutations.

Mock files are grouped in `src/mocks/`:

| File | Role |
|---|---|
| `handlers.mock.ts` | API routes and response shapes |
| `db.mock.ts` | in-memory state |
| `fixtures/` | deterministic sample data |
| `api.mock.ts` | local HTTP server |
| `handlers.mock.test.ts` | behaviour and fixture tests |

Add or adjust a handler only when a frontend flow needs it. Requests without a
handler return `501` and print the missing route in the terminal. Project data
lives in `fixtures/projects.mock.json`.

OAuth redirects and file storage are intentionally not reproduced locally. The
session control replaces OAuth, and upload routes return stable placeholders.

## Codebase conventions

- Keep domain code inside its folder in `src/features/`.
- Put cross-feature components, hooks, utilities, and types in `src/shared/`.
- Reuse design-system components and tokens before introducing new styles.
- Preserve existing naming patterns and keep mock-specific files discoverable
  with the `.mock` suffix.
- Add a focused test when changing mock behaviour or state.

## Reporting a problem

If the terminal reports an unhandled mock route, the local API is missing that
flow. Otherwise, you have likely found a frontend issue. In both cases, open an
issue with reproduction steps and relevant screenshots or console output.

By contributing, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
