---
doc_type: overview
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [glossary]
summary: Canonical terms used across the codebase and docs.
---

# Glossary

- plugin: A feature module under src/plugins/* that communicates only via events.
- core: Shared non-UI systems under src/core/* (event bus, renderer, template-system, etc.).
- event bus: Core pub/sub mechanism for cross-plugin communication.
- contract: Zod/TypeScript-typed payload for an event or API surface.
- feature flag: Runtime toggle in core used to enable/disable plugins/features.
- template: A structured JSON definition with elements, layout, animations.
- invitation: A user instance of a template with user_data bound for rendering.
- RBAC: Role-based access control via user_profiles.role.
- RLS: Row Level Security policies in Postgres (Supabase) restricting data access.
- Puck: @measured/puck visual editor used by admins to author templates.
- Renderer: Core engine that merges template + data into a rendered page.
