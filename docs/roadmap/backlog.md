---
doc_type: roadmap
system: backlog
status: draft
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [roadmap, features]
summary: Feature and plugin recommendations to improve the platform.
---

# High Impact
- Add `EVENT_NAMES` constants for element lifecycle events (`element:created`, `element:updated`, `element:duplicated`, `element:deleted`) and refactor emitters.
- Set `created_by = session.user.id` on template writes in production paths.
- Migrate renderer and gallery images to `next/image` with proper sizes/loaders.
- SSR route protection (middleware + Supabase cookie strategy) for admin/API routes.
- Auto-register core plugins on the client: gallery, form-builder, ai-generator, animation-engine (visual-editor already auto-registers).

# New Plugins/Features
- Analytics plugin: template views/uses dashboard, funnel metrics.
- Export plugin: centralized export flows (PDF/PNG/JPEG) with queues and progress.
- User management plugin: roles, bans, activation toggles.
- Audit logging plugin: security-relevant action logs.
- Real-time collaboration: multi-user editing, presence indicators.
- Template versioning: diff, restore, publish channels.
- Marketplace: share/buy/sell templates with moderation.
- Sharing & scheduling: RSVP links, reminders, WhatsApp share packs.
- Caching/search: precomputed indexes for gallery search filters.

# Ops & Security
- Production RLS tightening for templates SELECT (published-only + owner access).
- Rate limiting on auth endpoints; CAPTCHA where needed.
- Monitoring: capture event bus errors, auth changes.

# UI/UX
- Mobile editor improvements; touch gestures.
- Accessibility testing pass (ARIA roles, focus states).

# Notes
- Each item should become an ADR under `/docs/roadmap/decisions/` when approved.
