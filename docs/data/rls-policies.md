---
doc_type: data
system: rls
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [rls, policies, supabase, security]
summary: Row Level Security policies currently enforced in the database.
---

# Purpose
Document the exact RLS policies configured in the codebase (database-setup.sql) and note production recommendations.

# Enabled Tables
- public.templates
- public.invitations
- public.user_profiles

# Templates Policies (development-friendly)
- SELECT: `USING (true)` (anyone can view all templates)
- INSERT: `WITH CHECK (created_by IS NULL OR auth.uid() = created_by)`
- UPDATE: `USING (created_by IS NULL OR auth.uid() = created_by)`
- DELETE: `USING (created_by IS NULL OR auth.uid() = created_by)`

Notes
- SELECT is intentionally wide open for dev. Tighten for production.

# Invitations Policies
- SELECT: `USING (is_public = true OR created_by IS NULL OR auth.uid() = created_by)`
- INSERT: `WITH CHECK (created_by IS NULL OR auth.uid() = created_by)`
- UPDATE: `USING (created_by IS NULL OR auth.uid() = created_by)`
- DELETE: `USING (created_by IS NULL OR auth.uid() = created_by)`

# User Profiles Policies
- SELECT: `USING (auth.uid() = id)` (owner can read)
- INSERT: `WITH CHECK (auth.uid() = id)` (allow auto-create on first login)
- UPDATE: `USING (auth.uid() = id)` (owner can update)

# Production Recommendations
- Templates SELECT: restrict to `published = true` for public, and allow owner access
```sql
-- Example production SELECT for templates
CREATE POLICY "Public can view published templates" ON public.templates
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Users can view own templates" ON public.templates
  FOR SELECT TO authenticated USING (auth.uid() = created_by);
```
- Set `created_by` on write paths in app code when user is authenticated.
- Consider separate admin policies for template moderation if needed.

# Source of Truth
- See: /database-setup.sql (RLS section)
