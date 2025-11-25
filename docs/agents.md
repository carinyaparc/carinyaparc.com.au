---
title: Carinya Parc – Agents Guide
status: active
owner: engineering
last_updated: 2025-11-25
---

## Agents Guide for Carinya Parc

This guide is for AI coding agents (and humans working like them) contributing to the Carinya Parc repository.  
It explains how to set up, navigate, and make safe, high-quality changes. Use ✓ for successful checks, ✗ for failures, ! for alerts, - for neutral notes, and + when summarising changes.

### Must-read before editing

Before you change code or docs, you MUST skim:

- `docs/agents.md` (this file) – commands, checks, conventions.
- `docs/structure.md` – where routes, components, hooks, tests, and docs live.
- `docs/tech.md` – stack choices, versions, and constraints.
- `docs/product.md` – product purpose, personas, and non-goals.

Treat these documents as **authoritative**. If reality diverges, call it out and fix either the docs or the code.

## Project overview

- **Product**: Carinya Parc – a rural property in NSW with a regenerative farm stay and storytelling website.
- **Primary app**: `apps/site` – Next.js v16 App Router site built with React and TypeScript.
- **Monorepo**: pnpm workspace with shared packages:
  - `packages/ui` – design system / UI primitives.
  - `packages/eslint-config`, `packages/typescript-config`, `packages/tailwind-config` – shared configuration.
- **Content**:
  - MDX posts and recipes under `apps/site/content/`.
  - Legal documents in `apps/site/content/legal/`.

Agents should consider the **docs in `docs/` authoritative** for product, tech, and structure. Keep these synchronised with code changes.

## Setup commands

Run these in the repository root unless specified.

- **Install dependencies (✓)**

  ```bash
  pnpm install
  ```

````

* **Start development server**

  * Monorepo-level (recommended):

    ```bash
    pnpm dev
    ```

  * Or target the site app directly:

    ```bash
    pnpm site:dev
    # or
    cd apps/site
    pnpm dev
    ```

* **Build**

  * Monorepo:

    ```bash
    pnpm build
    ```

  * Site only:

    ```bash
    cd apps/site
    pnpm build
    ```

* **Lint and format**

  ```bash
  pnpm lint
  pnpm format:check    # CI-style
  pnpm format          # To apply formatting
  ```

* **Typecheck**

  ```bash
  pnpm typecheck
  ```

If any of these commands fail (✗), do not treat your work as complete.

## Build & test commands

From the **repository root**:

```bash
# All tests via Turbo
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:smoke
pnpm test:coverage
pnpm test:ci
```

From **`apps/site`**:

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:unit
pnpm test:integration
pnpm test:smoke
pnpm test:ci
```

### Minimum checks before marking a change as done

* ✓ `pnpm lint`
* ✓ `pnpm test:unit` (at minimum)
* ✓ `pnpm test:smoke` (for changes impacting key flows or routing)
* ✓ `pnpm typecheck`

For large or risky changes, also run `pnpm test` or `pnpm test:ci`.

## Code style & conventions

### Languages & syntax

* **TypeScript only** for production code (`.ts` / `.tsx`).
* Use **ES modules** and modern syntax (no CommonJS in app code).
* Prefer **async/await** over raw Promise chains.

### React & Next.js

* **Function components only**, no class components.
* Prefer **server components** for pages and most components.

  * Use `"use client"` only when necessary (client-side hooks, browser APIs, interactive UI).
* Keep **page components thin**:

  * Fetch data and compose sections.
  * Delegate layout and visual details to components in `src/components/`.

### Styling

* Preferred stack:

  * Tailwind CSS utility classes (configured in `tailwind.config.ts` and `packages/tailwind-config`).
  * Shared UI primitives from `@repo/ui`.
  * Global and component-level CSS in `src/styles/` where needed.
* Avoid scattered inline styles or ad-hoc `styled-components` unless matching an established pattern.

### Linting & formatting

* Respect **ESLint** and **Prettier** rules; do not suppress rules without a clear reason tied to product needs (document in code comments if you must disable something).
* Keep imports ordered and de-duplicated.
* Prefer explicit exports over large “barrel” files unless patterns are well established.

### Semantics in comments and docs

* Use the following symbols:

  * **✓** for things that should be true or passed checks.
  * **✗** for failures or anti-patterns.
  * **!** for important alerts or gotchas.
  * **-** for neutral bullets or notes.
  * **+** when summarising new changes.
* Keep comments concise; focus on *why* rather than restating *what* the code does.

## Testing expectations

* **Unit tests (✓ required)**:

  * Colocated with source files using `.test.ts` / `.test.tsx` suffix
  * Example: `src/lib/cn.ts` → `src/lib/cn.test.ts`
  * Add or update unit tests whenever you change logic in `src/app`, `src/lib`, `src/hooks`, or `src/utils`.
* **Integration & smoke tests**:

  * **Integration** (`apps/site/__tests__/integration`) for flows involving multiple components or modules.
  * **Smoke** (`apps/site/__tests__/smoke`) for critical site behaviour (rendering key pages, basic navigation).
* **Security tests**:

  * Located in `apps/site/__tests__/security/`; keep these green, especially when touching auth/session, cookies, or headers.

### What to run when you change…

* **Routes, layouts, navigation, or forms** → run:

  * `pnpm test:unit`
  * `pnpm test:integration`
  * `pnpm test:smoke`

* **API routes, session, or schema** → also:

  * Run or add security tests as relevant.

* **Styling-only changes** (safe) → at least:

  * `pnpm lint`
  * `pnpm test:smoke` (if the layout could break).

Treat red tests as ✗ blockers, not optional signals.

## Working with routes & components

### Routes

* App Router root: `apps/site/src/app/`.
* Pages:

  * Home: `page.tsx`.
  * About: `about/page.tsx` and subroutes.
  * Regeneration: `regenerate/page.tsx`.
  * Blog: `blog/page.tsx`, `blog/[post]/page.tsx`.
  * Recipes: `recipes/[recipe]/page.tsx`.
  * Legal: `legal/[slug]/page.tsx`.
  * Subscribe: `subscribe/page.tsx`.

Conventions:

* Dynamic segments use `[segment]` folder naming.
* Use metadata helpers from `src/lib/metadata/` where possible.

### Components

* Shared components under `apps/site/src/components/`:

  * `sections/` for page sections.
  * `forms/` for reusable forms.
  * `ui/` for wrappers on `@repo/ui` primitives.
* Prefer composition:

  * Page → sections → UI primitives.
* When adding a new section or reusable component:

  * Use PascalCase filenames and exports.
  * Keep props small and focused.

### Import aliases

Use aliases from `apps/site/tsconfig.json`:

* `@/components/...` for components.
* `@/app/...` for routing utilities.
* `@/hooks/...`, `@/lib/...`, `@/utils/...`, `@/styles/...`, `@/types/...`.
* `@repo/ui/...` for shared UI primitives.

Avoid long relative paths (✗ `../../../../`).

## Documentation expectations

* **Always update docs when behaviour or architecture meaningfully changes.**

Specifically:

* `docs/product.md`:

  * Update when you add or significantly change user-facing features, key flows (e.g., stay enquiries), or business objectives.

* `docs/tech.md`:

  * Update when you change the stack (framework major versions, hosting, data stores, observability) or introduce new core tools.

* `docs/structure.md`:

  * Update when routing, directory layout, or alias conventions change, or when adding major new top-level routes.

* `docs/agents.md`:

  * Update when commands, conventions, or expectations for agents change.

For new, contained areas (e.g., **workshops**, **online courses**, **produce boxes**):

* Add a **small feature spec** under `docs/` (e.g., `docs/workshops.md`) and link it from `docs/README.md`.
* Use ✓, ✗, !, -, + consistently to describe decisions and trade-offs.

When code and docs disagree, treat that as a ✗ bug and fix it.

## Security & secrets

* **Never commit secrets**:

  * API keys, Sentry DSN, mailing list tokens, and other secrets must live in environment variables (`.env.local` for development, platform-specific config for deployment).
  * If you see a hard-coded secret, treat it as a ✗ issue and redact/migrate it.

* **Data handling**:

  * Only collect necessary data (primarily emails for subscriptions).
  * Honour the privacy policy and terms defined in MDX under `apps/site/content/legal/`.

* **Go services (assumption)**:

  * If you introduce any Go-based tooling or services, they must target Go **1.25** and be documented (build, run, deploy).

When in doubt, err on the side of **less data, more transparency**.

## Performance & accessibility expectations

* Performance (✓ goals):

  * Use server components and static generation where possible.
  * Optimise images (via Next.js and the `optimize-images` script).
  * Avoid loading heavy libraries on the client unless strictly necessary.

* Accessibility:

  * Use semantic HTML and accessible patterns from `@repo/ui`.
  * Ensure keyboard access and visible focus states for all interactive elements.

* SEO:

  * Maintain accurate metadata for pages and posts.
  * Keep the sitemap and robots.txt aligned with live routes.

If a change risks performance or accessibility (e.g., adding a large third-party script), call it out with ! in your summary and suggest mitigation.

## PR / change guidelines for agents

When preparing a change (even if not literally opening a PR):

### Scope (✓ good practice)

* Keep diffs small and focused on one feature or bug.
* Avoid mixing refactors with feature work unless the refactor is essential.

### Checks

Run:

* `pnpm lint`
* `pnpm test:unit`
* `pnpm test:smoke` (if relevant)
* `pnpm typecheck`

Treat any failure as ✗ and fix before completion.

### Docs & tests

* * Update or add tests that cover your change.
* * Update relevant docs under `docs/` so they stay truthful.

### Change summaries

When summarising changes to a human:

* `+` for new behaviour or files.
* `-` for removed behaviour.
* `✓` for checks that pass or constraints you respected.
* `✗` for known limitations or follow-ups (only if acceptable after explicit justification).
* `!` for noteworthy impacts or risks.

### Tone & style

* Be concise and precise.
* Explain *why* important decisions were made (especially around UX, performance, and data handling).

If you are unsure whether a change fits the product direction, consult `docs/product.md` and prefer alignment over adding speculative complexity.
````
