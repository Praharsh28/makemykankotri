---
doc_type: security
system: rbac
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [security, rbac]
summary: Role-based access control using user_profiles.role.
---

# Purpose
Define roles and how they control access in the app.

# Roles
- user (default)
- admin

# Source of Truth
- `public.user_profiles.role` (TEXT CHECK IN ('user','admin'))
- Auto-created via `on_auth_user_created` trigger (defaults to `user`)

# Usage in App
- `AdminRoute` reads `user_profiles.role` and redirects if not `admin`.
- Promotion playbook:
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

# Recommendations
- Consider adding a permissions table for fine-grained rights if needed.
- Add audit logging for role changes.
- Enforce server-side checks on admin API routes (when added).

# Changelog
- 2025-10-25: Initial doc created
