---
doc_type: overview
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [architecture, overview]
summary: High-level architecture of the plugin-based, event-driven system.
---

# Purpose
Provide a map of systems and relationships so agents can navigate code and contracts fast.

# Architecture
- App: Next.js App Router (React 19)
- Core Systems (no UI):
  - plugin-system: event bus, feature flags
  - element-system: element types and serialization
  - template-system: CRUD, storage, queries
  - editor-state: selection, undo/redo
  - renderer-engine: compose template + data
- Plugins (UI features):
  - visual-editor, ai-generator, form-builder, template-renderer, animation-engine, gallery

# Boundaries
- No direct imports across plugins. Cross-plugin comms only via event bus.
- Core exposes minimal stable APIs and events.

# Data Flow
1. User selects template (gallery)
2. Form-builder captures data
3. Renderer merges template + data → invitation page
4. Admin uses visual-editor (Puck) to author templates

# Events (examples)
- template:load, template:saved
- invitation:created, invitation:view
- editor:select, editor:undo, editor:redo

# Security
- Supabase Auth, RBAC via user_profiles.role
- RLS for tables (templates, invitations, user_profiles)

# Deployment
- Vercel (Next.js) + Supabase backend

# Changelog
- 2025-10-25: Initial doc created
