---
doc_type: troubleshooting
system: playbooks
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [troubleshooting, playbooks]
summary: Step-by-step fixes for common scenarios.
---

# Promote user to admin
1. Get user email
2. Run in Supabase SQL Editor:
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```
3. User refreshes browser; AdminRoute now allows access

# Fix missing user_profiles
1. Run in Supabase SQL Editor:
```sql
-- Add INSERT policy if missing
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);
```
2. Restart dev server; profile auto-created on login

# Reset feature flags
```ts
import { featureFlags } from '@/core/feature-flags';
featureFlags.resetToDefaults();
```

# Clear event bus (testing)
```ts
import { eventBus } from '@/core/event-bus';
eventBus.clear();
```

# Reproduce build locally
```bash
npm run build
```
Check for ESLint errors blocking deploy.
