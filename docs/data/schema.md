---
doc_type: data
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [data, schema, supabase]
summary: Canonical database schema for templates, invitations, user_profiles, indexes.
---

# Purpose
Single source of truth for DB tables, columns, constraints, indexes. Mirrors database-setup.sql.

# Tables

## public.templates
- id: UUID PK DEFAULT uuid_generate_v4()
- name: TEXT NOT NULL
- slug: TEXT UNIQUE NOT NULL (INDEX: idx_templates_slug)
- description: TEXT
- category: TEXT (INDEX: idx_templates_category)
- tags: TEXT[] DEFAULT [] (GIN INDEX: idx_templates_tags)
- elements: JSONB NOT NULL DEFAULT []
- editable_fields: TEXT[] DEFAULT []
- layout: JSONB DEFAULT {}
- global_animations: JSONB DEFAULT []
- thumbnail: TEXT
- published: BOOLEAN DEFAULT false (INDEX: idx_templates_published)
- version: INTEGER DEFAULT 1
- views: INTEGER DEFAULT 0
- uses: INTEGER DEFAULT 0
- created_by: UUID REFERENCES auth.users(id) ON DELETE SET NULL (INDEX: idx_templates_created_by)
- created_at: TIMESTAMPTZ DEFAULT NOW() (INDEX: idx_templates_created_at DESC)
- updated_at: TIMESTAMPTZ DEFAULT NOW() (INDEX: idx_templates_updated_at DESC)

Triggers
- trigger_templates_updated_at BEFORE UPDATE → update_updated_at_column()

Functions
- increment_template_views(template_id UUID)
- increment_template_uses(template_id UUID)

## public.invitations
- id: UUID PK DEFAULT uuid_generate_v4()
- template_id: UUID REFERENCES public.templates(id) ON DELETE CASCADE (INDEX: idx_invitations_template_id)
- user_data: JSONB NOT NULL DEFAULT {}
- slug: TEXT UNIQUE (INDEX: idx_invitations_slug)
- is_public: BOOLEAN DEFAULT true (INDEX: idx_invitations_is_public)
- views: INTEGER DEFAULT 0
- created_by: UUID REFERENCES auth.users(id) ON DELETE CASCADE (INDEX: idx_invitations_created_by)
- created_at: TIMESTAMPTZ DEFAULT NOW()
- updated_at: TIMESTAMPTZ DEFAULT NOW()

Triggers
- trigger_invitations_updated_at BEFORE UPDATE → update_updated_at_column()

## public.user_profiles
- id: UUID PK REFERENCES auth.users(id) ON DELETE CASCADE
- full_name: TEXT NOT NULL DEFAULT 'User'
- avatar_url: TEXT
- phone: TEXT
- role: TEXT DEFAULT 'user' CHECK IN ('user','admin') (INDEX: idx_user_profiles_role)
- is_active: BOOLEAN DEFAULT true (INDEX: idx_user_profiles_is_active)
- is_banned: BOOLEAN DEFAULT false
- theme: TEXT DEFAULT 'light' CHECK IN ('light','dark')
- language: TEXT DEFAULT 'en'
- email_notifications: BOOLEAN DEFAULT true
- created_at: TIMESTAMPTZ DEFAULT NOW()
- updated_at: TIMESTAMPTZ DEFAULT NOW()
- last_login_at: TIMESTAMPTZ

Triggers
- trigger_user_profiles_updated_at BEFORE UPDATE → update_updated_at_column()
- on_auth_user_created AFTER INSERT ON auth.users → handle_new_user()

# Row Level Security (RLS)

Enable RLS: templates, invitations, user_profiles.

Policies (development-friendly defaults):

templates
- SELECT: public can view published; dev also allows created_by IS NULL
- INSERT/UPDATE/DELETE: public if created_by IS NULL or auth.uid() = created_by (dev-friendly)

invitations
- SELECT: public can view where is_public = true OR created_by IS NULL OR auth.uid() = created_by
- INSERT/UPDATE/DELETE: public if created_by IS NULL or auth.uid() = created_by (dev-friendly)

user_profiles
- SELECT: auth.uid() = id
- INSERT: auth.uid() = id (allows first-time profile creation client-side)
- UPDATE: auth.uid() = id

# Functions & Triggers

update_updated_at_column()
- Sets NEW.updated_at = NOW() on BEFORE UPDATE

handle_new_user()
- Inserts default row into public.user_profiles on new auth.users row
- full_name from NEW.raw_user_meta_data->>'full_name' fallback 'User'
- role = 'user'

# Notes
- UUID extension required: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
- Keep schema and this document in sync; update last_updated.
- Any schema change requires updating RLS and indexes accordingly.
