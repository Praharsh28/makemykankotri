---
doc_type: api
system: hooks
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [api, hooks]
summary: Hooks exposed by the codebase.
---

# Auth Hooks
- `useAuth` (src/lib/auth/AuthContext.tsx) → `user`, `profile`, `session`, `isAuthenticated`, `isAdmin`, `signIn`, `signUp`, `signOut`.

# Form Hooks
- `useFormData` (plugins/form-builder/useFormData.ts) → form state and submit events.

# Editor Hooks
- `useAutoSave` (exported by visual-editor plugin) → auto-save integration (see plugin for details).
