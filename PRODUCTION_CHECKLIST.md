# 🚀 Production Deployment Checklist

**Project:** WebKankotri v2  
**Purpose:** Track all development-specific changes that MUST be reverted before production  
**Status:** DEVELOPMENT MODE ⚠️  
**Last Updated:** October 18, 2025

---

## ⚠️ CRITICAL: Changes Made for Development

These changes make development easier but are **NOT SECURE** for production.  
**You MUST revert/replace these before deploying to production.**

---

## 🔒 Database Security Changes

### **Change 1: Created_by Column Made Nullable**

**What We Changed:**
```sql
ALTER TABLE templates ALTER COLUMN created_by DROP NOT NULL;
```

**Why:** Allows anonymous users to create templates during development without authentication.

**⚠️ SECURITY RISK:** Templates can be created without tracking who created them.

**✅ FIX FOR PRODUCTION:**
```sql
-- Step 1: Require authentication (add Supabase Auth)
-- Step 2: Make created_by required again
ALTER TABLE templates ALTER COLUMN created_by SET NOT NULL;

-- Step 3: Set default value to authenticated user
-- (This will be handled by your auth middleware)
```

**Status:** 🔴 MUST FIX BEFORE PRODUCTION

---

### **Change 2: Development-Friendly RLS Policies**

**What We Changed:**
```sql
-- Created policies that allow created_by IS NULL for development
CREATE POLICY "Allow insert for dev users"
  ON templates FOR INSERT
  TO public
  WITH CHECK (
    created_by IS NULL  -- Allow anon users (development)
    OR 
    auth.uid() = created_by  -- Allow authenticated users
  );
-- Similar policies for UPDATE, DELETE
```

**File:** `supabase/dev-policies.sql`

**Why:** Allows anonymous development while keeping RLS ENABLED. Much more secure than disabling RLS entirely.

**⚠️ SECURITY RISK:** 
- Anyone can create templates without authentication (created_by IS NULL)
- Anyone can modify templates where created_by IS NULL
- Less secure than production, but RLS is still enabled

**✅ FIX FOR PRODUCTION:**

**Simply run:** `supabase/production-policies.sql`

Or manually:
```sql
-- Step 1: Make created_by required
ALTER TABLE templates ALTER COLUMN created_by SET NOT NULL;

-- Step 2: Drop development policies
DROP POLICY IF EXISTS "Anyone can view all templates (dev)" ON templates;
DROP POLICY IF EXISTS "Allow insert for dev users" ON templates;
DROP POLICY IF EXISTS "Allow update for dev users" ON templates;
DROP POLICY IF EXISTS "Allow delete for dev users" ON templates;

-- Step 3: Run supabase/production-policies.sql
-- (Creates secure authenticated-only policies)
```

**Status:** 🟡 MUST UPDATE BEFORE PRODUCTION (straightforward - just run production-policies.sql)

---

## 🔐 Authentication Requirements

### **What's Missing in Development:**

❌ **No authentication system**
- Users aren't logged in
- No user accounts
- No access control

### **✅ Required for Production:**

**Step 1: Enable Supabase Auth**
```typescript
// Add to app/layout.tsx or _app.tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RootLayout({ children }) {
  const supabase = createClientComponentClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <html>
      <body>
        {/* Add auth provider */}
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Step 2: Protect Editor Routes**
```typescript
// app/editor/page.tsx
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function EditorPage() {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }
  
  return <EditorPage />;
}
```

**Step 3: Set created_by Automatically**
```typescript
// Update TemplateStorage.ts
async save(template: Template): Promise<Template> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Must be authenticated to save templates');
  }
  
  const { data, error } = await supabase
    .from('templates')
    .upsert({
      ...template,
      created_by: user.id,  // ✅ Set from authenticated user
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  // ... rest of code
}
```

**Current Code (Development):**
```typescript
// src/core/template-system/TemplateStorage.ts line 31
created_by: null, // Development only - will be set from auth in production
```

**Status:** 🔴 MUST CHANGE BEFORE PRODUCTION

---

## 📝 Environment Variables

### **Current Setup (Development):**

**File:** `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ebaqzmfejeymxfxkmczi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

**Status:** ✅ OK for development (using anon key)

### **✅ Required for Production:**

**File:** `.env.production` or Platform Environment Variables
```bash
# Keep anon key for client-side operations
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Add service role key for server-side operations (NEVER expose to client!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Add production URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**⚠️ CRITICAL:**
- Use **production Supabase project** (not development)
- Keep service role key **server-side only**
- Never commit `.env.production` to Git

**Status:** 🟡 MUST UPDATE FOR PRODUCTION

---

## 📋 Pre-Production Deployment Checklist

### **Database Security (Critical):**
- [ ] **Run production policies:** `supabase/production-policies.sql`
  - This file contains all steps needed
  - Makes `created_by` required
  - Drops development policies
  - Creates secure production policies
  - Includes verification query
- [ ] Verify RLS is enabled and working:
  ```sql
  -- Should return: rls_enabled = true
  SELECT tablename, rowsecurity as rls_enabled 
  FROM pg_tables 
  WHERE tablename = 'templates';
  ```
- [ ] Test with authenticated users (should work)
- [ ] Test with anonymous users (should be rejected)
- [ ] Delete or archive `dev-policies.sql` (don't run in production!)

### **Authentication (Critical):**
- [ ] Add Supabase Auth to application
- [ ] Protect `/editor` route (require login)
- [ ] Set `created_by` from authenticated user
- [ ] Add login/logout UI
- [ ] Test user registration
- [ ] Test user login
- [ ] Test template ownership (users can only edit own templates)

### **Environment (Important):**
- [ ] Create production Supabase project
- [ ] Update environment variables
- [ ] Use production Supabase URL
- [ ] Use production anon key
- [ ] Add service role key (server-side)
- [ ] Remove development credentials from code

### **Code Changes (Important):**
- [ ] Update `TemplateStorage.ts` to use authenticated user ID
- [ ] Add auth checks to all API routes
- [ ] Add error handling for unauthenticated requests
- [ ] Remove any hardcoded test data

### **Testing (Critical):**
- [ ] Test login flow
- [ ] Test template creation (as authenticated user)
- [ ] Test template update (owner only)
- [ ] Test template delete (owner only)
- [ ] Test template viewing (public templates)
- [ ] Test that anonymous users CANNOT create/edit/delete
- [ ] Verify `created_by` is set correctly

### **Security Audit (Critical):**
- [ ] No anonymous write access
- [ ] All routes protected
- [ ] Service role key not exposed
- [ ] RLS policies tested
- [ ] SQL injection prevention verified
- [ ] CORS configured correctly

---

## 📂 Files to Review Before Production

### **Database Files:**
- [ ] `supabase/schema.sql` - Ensure secure policies only
- [ ] `supabase/dev-policies.sql` - **DO NOT RUN IN PRODUCTION**

### **Code Files:**
- [ ] `src/core/template-system/TemplateStorage.ts` - Add auth checks
- [ ] `src/core/template-system/supabase.ts` - Use production credentials
- [ ] `src/app/editor/page.tsx` - Add auth protection
- [ ] `src/app/templates/page.tsx` - Filter by user

### **Config Files:**
- [ ] `.env.production` - Production credentials
- [ ] `next.config.ts` - Production settings
- [ ] `supabase/.env` - Production project settings

---

## 🔄 Migration Path (Development → Production)

### **Phase 1: Add Authentication (Week 2-3)**
1. Install Supabase auth helpers
2. Add login/register pages
3. Protect editor routes
4. Update TemplateStorage with auth

### **Phase 2: Update Database (Before Launch)**
1. Create production Supabase project
2. Run `schema.sql` (without dev-policies.sql)
3. Test RLS policies with real users
4. Migrate development data (if needed)

### **Phase 3: Deploy (Launch Day)**
1. Update environment variables
2. Deploy to production
3. Test all auth flows
4. Monitor for errors
5. Verify no anonymous access

---

## 📊 Current Status Summary

| Component | Dev Status | Prod Ready | Action Required |
|-----------|------------|------------|-----------------|
| Database Schema | ✅ Working | ✅ Ready | Already secure |
| RLS Policies | 🟡 Dev Mode | 🟡 Update | Run production-policies.sql |
| Authentication | ❌ Disabled | 🔴 Required | Add Supabase Auth |
| created_by Field | ⚠️ Nullable | 🟡 Update | Make required (in production-policies.sql) |
| Environment Vars | ✅ Working | 🟡 Update | Use prod credentials |
| Editor Protection | ❌ Open | 🔴 Required | Add auth check |
| Code Security | ⚠️ Dev Mode | 🟡 Update | Update TemplateStorage.ts |

**Legend:**
- ✅ Good to go
- 🟡 Needs update
- ⚠️ Risky for production
- 🔴 CRITICAL - Must fix
- ❌ Not implemented

---

## 📝 Change Log

### October 18, 2025 - Development Setup
**Changes Made:**
1. Made `created_by` nullable for anonymous development
2. **Created RLS policies that allow `created_by IS NULL`** for development
3. Set `created_by: null` in TemplateStorage.ts
4. Using development Supabase credentials
5. No authentication system
6. **RLS ENABLED with development-friendly policies**

**Reason:** Needed to support anonymous development while keeping RLS security enabled.

**Revert Required:** YES - Before production launch (simple - just run `production-policies.sql`)

**Security Impact:** MODERATE RISK - RLS is enabled, but allows operations on NULL created_by rows

**Files Created:**
- `supabase/dev-policies.sql` - Development RLS policies
- `supabase/production-policies.sql` - Production RLS policies (ready to use)

---

## 🚨 Important Reminders

### **NEVER DO IN PRODUCTION:**
❌ Allow anonymous write access  
❌ Disable RLS  
❌ Make `created_by` nullable  
❌ Use development credentials  
❌ Skip authentication checks  
❌ Expose service role key  

### **ALWAYS DO IN PRODUCTION:**
✅ Require authentication for writes  
✅ Enable RLS with strict policies  
✅ Require `created_by` field  
✅ Use production credentials  
✅ Protect all sensitive routes  
✅ Keep service role key server-side  
✅ Test security thoroughly  

---

## 📞 Questions Before Production?

**Review these docs:**
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Supabase Auth: https://supabase.com/docs/guides/auth
- Next.js Auth: https://supabase.com/docs/guides/auth/auth-helpers/nextjs

**Test everything in staging first!**

---

**This document will be updated as we make more development-specific changes.**

*Last updated: October 18, 2025*  
*Next review: Before Week 2 (Authentication implementation)*
