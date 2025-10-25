---
doc_type: troubleshooting
system: known-issues
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [troubleshooting, known-issues]
summary: Known issues and workarounds.
---

# Build warnings (non-blocking)
- `<img>` elements flagged by Next ESLint (@next/next/no-img-element).
- Workaround: Ignore or migrate to `next/image` incrementally.

# Next.js workspace root inference warning
- Multiple lockfiles detected; Next infers wrong root.
- Workaround: Set `turbopack.root` in next.config.js or remove extra lockfiles.

# Infinite loading on login (resolved)
- Missing user_profiles for existing users.
- Fix: Profile auto-creation logic added; INSERT policy enabled.

# Admin role promotion
- Use SQL to set `user_profiles.role = 'admin'` by email:
```sql
UPDATE user_profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

# Middleware no-op
- Middleware intentionally does nothing; client-side wrappers handle protection.
- Future: Enable server-side checks when SSR auth is needed.
