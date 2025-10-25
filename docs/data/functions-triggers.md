---
doc_type: data
system: functions-triggers
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [supabase, functions, triggers]
summary: SQL functions and triggers defined in database-setup.sql.
---

# Purpose
Document all database functions and triggers implemented by the SQL setup script.

# Functions

## increment_template_views(template_id UUID)
- Updates: `public.templates.views = views + 1` where `id = template_id`.
- Security: `SECURITY DEFINER`

## increment_template_uses(template_id UUID)
- Updates: `public.templates.uses = uses + 1` where `id = template_id`.
- Security: `SECURITY DEFINER`

## update_updated_at_column()
- Trigger function: sets `NEW.updated_at = NOW()` on `BEFORE UPDATE`.

## handle_new_user()
- Trigger function on `auth.users` insert.
- Inserts a default row in `public.user_profiles`:
  - `id = NEW.id`
  - `full_name = NEW.raw_user_meta_data->>'full_name' || 'User' fallback`
  - `role = 'user'`

# Triggers

- `trigger_templates_updated_at`
  - BEFORE UPDATE ON `public.templates` → `update_updated_at_column()`

- `trigger_invitations_updated_at`
  - BEFORE UPDATE ON `public.invitations` → `update_updated_at_column()`

- `trigger_user_profiles_updated_at`
  - BEFORE UPDATE ON `public.user_profiles` → `update_updated_at_column()`

- `on_auth_user_created`
  - AFTER INSERT ON `auth.users` → `handle_new_user()`

# Notes
- Functions use `SET search_path` appropriately in SQL file.
- For production, consider logging or auditing triggers if moderation is required.
- Keep this doc in sync with `/database-setup.sql`.
