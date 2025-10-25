---
doc_type: ops
system: linting-formatting
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [ops, eslint, formatting]
summary: Linting rules and known warnings.
---

# ESLint
- Next.js rules enabled (e.g., `@next/next/no-img-element`).
- TypeScript ESLint rules (e.g., unused vars).

# Known Warnings
- `<img>` elements in several plugins/plugins; plan migration to `next/image`.
- Unused parameters should be prefixed with `_`.
