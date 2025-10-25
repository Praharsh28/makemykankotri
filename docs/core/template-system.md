---
doc_type: core
system: template-system
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, templates]
summary: Template CRUD, storage, queries, and interfaces with plugins via events.
---

# Purpose
Provide a centralized system to manage templates (CRUD, search, publish) and expose contracts used by plugins.

# Scope
- Read/write templates
- Indexes and search (slug/category/tags/text)
- Publish/unpublish
- Stats: views, uses (increment functions)

# Data Model (see /docs/data/schema.md)
- `public.templates` with JSONB fields: `elements`, `layout`, `global_animations`, `editable_fields`
- Indexes: slug, category, tags (GIN), published, created/updated
- Functions: `increment_template_views`, `increment_template_uses`

# Contracts (Types/Zod)
```ts
export interface TemplateRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  tags: string[];
  elements: unknown[];
  editable_fields: string[];
  layout: Record<string, unknown>;
  global_animations: unknown[];
  thumbnail?: string;
  published: boolean;
  version: number;
  views: number;
  uses: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}
```

# Events
- `template:load` → payload: `{ slug | id }` → returns `TemplateRecord`
- `template:save` → payload: `TemplateRecord` → persists and emits `template:saved`
- `template:publish`/`template:unpublish`

# Dependencies and Boundaries
- DB access via core services only
- No plugin cross-imports; plugins call via events

# Failure Modes / Gotchas
- Missing indexes degrade gallery performance
- Invalid schema in JSONB fields breaks renderer/editor assumptions

# Examples
- Gallery fetch by category/tags
- Visual editor saves and publishes template

# Changelog
- 2025-10-25: Initial doc created
