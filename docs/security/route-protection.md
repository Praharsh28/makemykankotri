---
doc_type: security
system: route-protection
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [security, auth, routes]
summary: Route protection strategy for authenticated and admin areas.
---

# Purpose
Document how protected routes are enforced in the app and where to add checks.

# Current Strategy
- Client-side wrappers:
  - `ProtectedRoute` guards pages like `/dashboard`.
  - `AdminRoute` ensures `profile.role === 'admin'` for `/admin`.
- Middleware (`src/middleware.ts`) is intentionally a no-op to avoid edge-session complexity; may be enabled later.

# Components
- `src/components/auth/ProtectedRoute.tsx`
  - Redirects to `/auth/login` if `isAuthenticated` is false.
- `src/components/auth/AdminRoute.tsx`
  - Redirects to `/auth/login` if not authed.
  - Redirects to `/dashboard` if not admin (reads `user_profiles.role`).

# Data Contracts
- Depends on `AuthContext` exposing: `user`, `profile`, `isAuthenticated`, `isAdmin`.
- `user_profiles` table provides `role`.

# Failure Modes / Gotchas
- If `user_profiles` row is missing for existing users, AdminRoute would not find role → fixed by auto-create logic and INSERT policy.
- If enabling Middleware for server-side protection, ensure cookie/session parsing is set and Supabase helpers configured.

# Recommendations
- Keep client wrappers; add server-side checks on API routes when introduced.
- If SSR protection is required, implement Supabase auth cookies + server helpers, and move checks to middleware with a robust strategy.

# Changelog
- 2025-10-25: Initial doc created
