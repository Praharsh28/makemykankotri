---
doc_type: security
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [auth, supabase, rbac, session]
summary: Authentication flow, session persistence, RBAC, and route protection.
---

# Purpose
Define how users authenticate, how sessions persist, and how roles authorize access to routes and features.

# Flow
1. Signup/Login via Supabase (`@supabase/supabase-js`)
2. Session persists in localStorage (client) with auto-refresh
3. `AuthContext` hydrates `user`, `session`, and `profile` from `user_profiles`
4. RBAC via `profile.role` (`user` | `admin`)

# Contracts (Types)
```ts
interface UserProfile {
  id: string;                // auth.users.id
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  email: string;
}
```

# Components
- `AuthContext` (src/lib/auth/AuthContext.tsx)
  - Exposes: `user`, `profile`, `session`, `isAuthenticated`, `isAdmin`
  - Auto-creates profile if missing (INSERT policy allows)
- `ProtectedRoute` (redirects to /auth/login when not authed)
- `AdminRoute` (ensures profile.role === 'admin')

# Data Dependencies
- Table: `public.user_profiles` (see /docs/data/schema.md)
- Trigger: `on_auth_user_created` populates default profile for new users
- Policies: SELECT/INSERT/UPDATE where `auth.uid() = id`

# Route Protection
- Client-side wrappers:
  - `/dashboard` wrapped with `ProtectedRoute`
  - `/admin` wrapped with `AdminRoute`
- Middleware kept minimal to avoid edge-session pitfalls

# Failure Modes / Gotchas
- Missing INSERT policy on `user_profiles` → profile creation fails → loading loops
- Using email instead of UUID when updating roles
- Old users without profiles need auto-create path

# Playbooks
- Promote user to admin by email:
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

# Changelog
- 2025-10-25: Initial doc created
