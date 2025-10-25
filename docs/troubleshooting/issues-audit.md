---
doc_type: troubleshooting
system: issues-audit
status: draft
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [audit, issues]
summary: Live audit of issues/gotchas found while scanning actual code (not old docs).
---

# Purpose
Track potential issues, inconsistencies, and improvements found during code-grounded documentation.

# Findings

- **[events] Missing constants for element events**
  - Location: `core/editor-state/EditorStore.ts`, `core/element-system/ElementFactory.ts`
  - Problem: Emits literal strings like `element:created`, `element:updated`, `element:duplicated`, `element:deleted` not present in `EVENT_NAMES` constants. Risk of typos and inconsistency.
  - Recommendation: Add matching constants in `EVENT_NAMES` and replace literals.

- **[data] created_by saved as null in TemplateStorage.save**
  - Location: `core/template-system/TemplateStorage.ts`
  - Problem: `created_by: null // Development only` on upsert. In production, should set to current auth user to satisfy RLS and ownership.
  - Recommendation: When user is authenticated, set `created_by = session.user.id` at write time.

- **[ui] next/image warnings**
  - Location: `TemplateRenderer.tsx`, gallery and form-builder components
  - Problem: `<img>` tags flagged by Next ESLint. Non-blocking but affects performance.
  - Recommendation: Migrate to `next/image` where possible with appropriate sizes/loaders.

- **[security] Templates SELECT policy open in dev**
  - Location: `database-setup.sql` RLS
  - Problem: `USING (true)` for templates SELECT. Intentional for dev; must tighten for prod (published-only + owner access).
  - Recommendation: See /docs/data/rls-policies.md production example.

- **[middleware] No-op middleware**
  - Location: `src/middleware.ts`
  - Note: We rely on client wrappers for now; if enabling SSR protection later, ensure Supabase cookie/session strategy is implemented.

- **[feature flags] Disabled defaults may hide features**
  - Location: `core/feature-flags.ts`
  - Note: Gallery, animation-engine, export, user-management are disabled by default; plugins enable on install. Ensure install paths are executed where required.

# Next Actions
- Add EVENT_NAMES constants for element events; update emitters.
- Update TemplateStorage to set `created_by` when session exists.
- Plan migration to `next/image` incrementally.
- Prepare production RLS policy set.

# Changelog
- 2025-10-25: Initial audit created.
