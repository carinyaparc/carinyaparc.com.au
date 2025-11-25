---
title: Carinya Parc – Documentation Index
status: active
owner: product+engineering
last_updated: 2025-11-25
---

## Overview

The `docs/` directory is the shared knowledge base for the Carinya Parc project. It captures product intent, technical decisions, project structure, and guidance for both humans and AI agents working in the repository.

All critical decisions that affect users, architecture, or contributor workflows should be discoverable here.

## Quick links

| File           | Purpose                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------- |
| `product.md`   | Product overview – who we serve, what problems we solve, and what success looks like.        |
| `tech.md`      | Technology stack – frameworks, tools, and constraints that guide implementation.             |
| `structure.md` | Project structure – how the repo and Next.js App Router app are organised.                   |
| `agents.md`    | Agents guide – commands, checks, and conventions for AI agents and humans working like them. |

### Summaries

- **`product.md` – Product Overview**
  - Describes what Carinya Parc is, who it serves, the problems it solves, and the business objectives for the website.
  - Includes target personas, value propositions, key features, non-goals, and assumptions.

- **`tech.md` – Technology Stack**
  - Defines the core stack: Next.js v16 App Router, React, TypeScript, Tailwind, MDX, pnpm, Turborepo, and supporting tools.
  - Documents linting, testing, hosting assumptions, observability, performance, accessibility, security, and constraints.

- **`structure.md` – Project Structure**
  - Explains the repository and `apps/site` layout, routing conventions, component and hook organisation, import aliases, and naming.
  - Provides guidance and a worked example for adding new pages and features.

- **`agents.md` – Agents Guide**
  - Optimised for AI coding agents (and humans working like them).
  - Covers setup, commands, code style, testing expectations, documentation rules, security, performance, and change guidelines, including use of ✓, ✗, !, -, and +.

Other files (e.g., `TODO.md`) may exist for ad-hoc notes, but the four documents above should be treated as the long-lived spine of the documentation.

## Recommended reading order

### For new human contributors

1. **`product.md`**
   - Understand the property, brand, and why the website exists.
2. **`tech.md`**
   - Learn the stack, constraints, and how the system is expected to behave technically.
3. **`structure.md`**
   - See how the codebase is organised and where to make changes.
4. **`agents.md`**
   - Pick up concrete expectations for commands, testing, and documentation while working.

### For AI coding agents

1. **`agents.md`**
   - Get the commands, checks, and conventions you must follow.
2. **`structure.md`**
   - Learn where routes, components, hooks, tests, and docs live.
3. **`tech.md`**
   - Understand stack choices, integration points, and constraints (e.g., Node version, Go 1.25 if used).
4. **`product.md`**
   - Align changes with the product’s purpose, personas, and value proposition.

Agents and humans should re-skim relevant docs when touching new areas (e.g., adding booking flows, integrating new services).

## Extending the docs

### When to add new documents

Add or extend documentation when:

- You introduce a **new feature area** (e.g., workshops, on-farm events, produce boxes) that has its own user flows or content model.
- You make significant **architectural decisions** (e.g., introducing a database, switching hosting, adding a new major dependency).
- You integrate **external systems** (e.g., mailing list providers, payment gateways, analytics beyond what is already defined).

Typical patterns:

- **Feature specs**:
  - `docs/workshops.md`, `docs/booking-enquiries.md`, etc.
  - Describe goals, flows, UX notes, and constraints.

- **Architecture Decision Records (ADRs)**:
  - Store under `docs/adr/` with filenames like `0001-use-vercel-for-hosting.md`.
  - Explain the context, decision, alternatives, and consequences.

- **Integration notes**:
  - `docs/integrations/<service-name>.md` for third-party services.

### Naming and structure conventions

- Use **lowercase, kebab-case** filenames (e.g., `feature-name.md`, `adr/0002-add-sqlite-store.md`).
- Start with a short **front matter block** for long-lived docs:

  ```yaml
  ---
  title: Short Title – Purpose
  status: active
  owner: product|engineering|shared
  last_updated: YYYY-MM-DD
  ---
  ```

```

* Use clear `##` and `###` headings, short paragraphs, and bullet lists.
* Where useful, adopt the ✓, ✗, !, -, + symbols to make decisions and outcomes easy to scan.

### Keeping docs up to date

* When code and docs disagree, treat that as a ✗ bug:

  * Prefer to update the docs promptly to match the implemented behaviour.
  * If the code is wrong relative to an agreed decision, update the code or write an ADR explaining a deliberate change.

* Significant changes should:

  * * Update at least one of `product.md`, `tech.md`, `structure.md`, or `agents.md`.
  * * Be cross-linked where helpful (e.g., `tech.md` referencing a new ADR).

Use this directory as the shared “source of truth” for Carinya Parc, so that both humans and agents can act with confidence.

## Governance

* **Product-led docs** (`product.md` and feature specs):

  * Owned by product, with input from engineering and content.
* **Engineering-led docs** (`tech.md`, `structure.md`, `agents.md`, ADRs):

  * Owned by engineering, with input from product as needed.

Any contributor (human or agent) may propose changes, but long-lived docs should be reviewed by the relevant owner before being treated as the new truth.
```
