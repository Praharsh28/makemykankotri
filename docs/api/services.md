---
doc_type: api
system: services
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [api, services]
summary: Service layer APIs (Supabase client and TemplateStorage).
---

# Supabase Client
- Location: `src/core/template-system/supabase.ts`
- Persists session; logs current session type.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

# TemplateStorage (core/template-system/TemplateStorage.ts)
- `save(template)` → upsert; emits `editor:template:saved`.
- `load(id)` / `loadBySlug(slug)` → returns Template; emits `editor:template:loaded`.
- `list({ published, category, createdBy, limit, offset })` → array.
- `getUserTemplates(userId)` → list filtered by owner.
- `delete(id)` → emits `template:deleted`.
- `publish(id)` / `unpublish(id)` → toggles `published`; emits `template:published`.
- `incrementViews(id)` / `incrementUses(id)` → RPC calls.

# Gotchas
- `save` sets `created_by: null` for development. For production, set to current `session.user.id` to align with RLS/ownership.
