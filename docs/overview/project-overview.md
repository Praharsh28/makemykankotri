---
doc_type: overview
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [overview, goals, scope]
summary: High-level overview of the MakeMyKankotri platform and goals.
---

# Purpose
MakeMyKankotri is a visual template builder platform (Canva-like) for wedding invitations, built with a plugin-based, event-driven architecture.

# Scope
- Public template gallery and invitation creation
- Visual editor (Puck) for admin template authoring
- Rendering engine to produce invitation pages
- Auth with Supabase, RBAC for admin features
- Plugin isolation via event bus

# Key Concepts
- Plugin-based features that never import each other; communicate via events
- Strict boundaries enforced with contracts and zod schemas (at edges)
- Core systems provide shared infra: event bus, renderer, editor state, template system

# Tech Stack
- Framework: Next.js 15 (App Router), React 19
- State: Zustand
- Forms: react-hook-form + zod
- Visual editor: @measured/puck
- Drag & Drop: @dnd-kit/core
- Canvas: konva + react-konva
- Animations: gsap + framer-motion
- DB/Auth: Supabase (@supabase/supabase-js)

# User Roles
- user: can browse templates, create invitations, manage own data
- admin: manages templates, runs visual editor, publishes to gallery

# Major Subsystems
- Core: plugin-system, element-system, template-system, editor-state, renderer-engine, feature-flags
- Plugins: visual-editor, ai-generator, form-builder, template-renderer, animation-engine, gallery
- Data: templates, invitations, user_profiles, SQL functions/triggers, RLS

# Success Criteria
- Features are isolated and compose via events
- RBAC protected admin flows
- Deployable to Vercel with Supabase backend

# Changelog
- 2025-10-25: Initial doc created
