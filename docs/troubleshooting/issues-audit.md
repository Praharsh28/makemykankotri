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

## ✅ FIXED

- **[events] Missing constants for element events** ✅ FIXED
  - Location: `core/editor-state/EditorStore.ts`, `core/element-system/ElementFactory.ts`, `core/element-system/ElementRegistry.ts`
  - Problem: Emits literal strings like `element:created`, `element:updated`, `element:duplicated`, `element:deleted` not present in `EVENT_NAMES` constants.
  - Fix: Added constants to EVENT_NAMES and replaced all literal emits with constants.

- **[data] created_by saved as null in TemplateStorage.save** ✅ FIXED
  - Location: `core/template-system/TemplateStorage.ts`
  - Problem: `created_by: null` on upsert. Should set to current auth user.
  - Fix: Now fetches session and sets `created_by = session.user.id` when available.

- **[plugins] Missing auto-registration for some plugins** ✅ FIXED
  - Location: `plugins/gallery/index.ts`, `plugins/form-builder/index.ts`, `plugins/ai-generator/index.ts`, `plugins/animation-engine/index.ts`, `plugins/template-renderer/index.ts`
  - Problem: Plugins did not auto-register, so feature flags may not enable.
  - Fix: Added browser-guarded auto-register blocks to all plugins.

- **[ui] next/image warnings** ✅ FIXED
  - Location: `TemplateRenderer.tsx`, `FileUpload.tsx`, `PuckConfig.tsx`, `app/templates/page.tsx`
  - Problem: `<img>` tags flagged by Next ESLint.
  - Fix: 
    - Migrated `/templates` page to use `next/image` with fill mode
    - Added eslint-disable for dynamic content (template renderer, file previews, Puck editor)
  - Rationale: Dynamic user content with inline styles and blob URLs cannot benefit from next/image optimization

- **[security] Templates SELECT policy open in dev** ✅ ADDRESSED
  - Location: `database-setup.sql` RLS
  - Problem: `USING (true)` for templates SELECT. Intentional for dev.
  - Fix: Created `database-production-rls.sql` with strict policies for production
  - Status: Ready for production deployment after staging tests

- **[lint] Unused middleware parameter** ✅ FIXED
  - Location: `src/middleware.ts`
  - Problem: `_req` parameter defined but never used
  - Fix: Removed unused parameter and import

## 📋 NOTED (Working as Designed)

- **[middleware] No-op middleware** (Intentional)
  - Location: `src/middleware.ts`
  - Note: Client wrappers handle protection. Future: SSR checks with Supabase cookies if needed.

- **[feature flags] Disabled defaults** (Correct behavior)
  - Location: `core/feature-flags.ts`
  - Note: Plugins enable flags on install. Verified: all plugins auto-register correctly now.

# Next Actions
All critical issues resolved! ✅

**Optional Future Improvements:**
1. Extract renderer utilities to `core/renderer-engine`
2. Add smoke tests for core modules (event-bus, feature-flags, TemplateStorage)
3. Implement SSR auth checks in middleware (when needed)
4. Add rate limiting on auth endpoints
5. Monitor performance impact of next/image on templates page

# Changelog
- 2025-10-25: Initial audit created
- 2025-10-25: Fixed all critical issues (events, plugins, ownership, images, lint, RLS policies)
