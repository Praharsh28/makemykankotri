# 🔐 Authentication System Requirements & Best Practices

**Date:** October 25, 2025  
**Status:** Requirements & Security Audit Before Implementation

---

## 🚨 CRITICAL SECURITY ISSUES (Must Fix Immediately)

### **Issue 1: No Route Protection** 🔴 CRITICAL
**Problem:**
- Anyone can access `/admin` without logging in
- Anyone can access `/dashboard` without authentication
- No middleware to protect routes
- No role-based access control

**Risk:** High - Unauthorized access to admin functions

### **Issue 2: No User Profile Display** 🟡 HIGH
**Problem:**
- User logs in but can't see their name/email
- No way to know if logged in
- No profile page
- No user settings

**Risk:** Medium - Poor UX, users confused about auth state

### **Issue 3: No Role/Permission System** 🟡 HIGH
**Problem:**
- No distinction between regular users and admins
- Everyone who logs in can potentially access admin features
- No role assignment

**Risk:** High - Security vulnerability

---

## 📋 Complete Authentication Requirements

### **1. User Account Data Structure**

**What Every User Account Needs:**

```typescript
interface User {
  // Core Identity (from Supabase Auth)
  id: string;                    // UUID from auth.users
  email: string;                 // User's email
  email_verified: boolean;       // Email confirmation status
  
  // Profile Information
  full_name: string;             // Display name
  avatar_url?: string;           // Profile picture
  phone?: string;                // Optional phone number
  
  // Role & Permissions
  role: 'user' | 'admin';        // User role
  permissions: string[];         // Specific permissions
  
  // Account Status
  is_active: boolean;            // Can login?
  is_banned: boolean;            // Banned from platform?
  
  // Timestamps
  created_at: Date;              // Account creation
  updated_at: Date;              // Last profile update
  last_login_at?: Date;          // Last login time
  
  // Preferences
  theme?: 'light' | 'dark';      // UI theme
  language?: string;             // Preferred language
  email_notifications: boolean;  // Email preferences
}
```

### **2. User Profile Database Table**

**Need to create:** `user_profiles` table in Supabase

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  
  -- Preferences
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'  -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🛡️ Authentication Best Practices

### **1. Password Requirements**

```typescript
const PASSWORD_RULES = {
  minLength: 8,                   // Minimum 8 characters
  requireUppercase: true,         // At least 1 uppercase
  requireLowercase: true,         // At least 1 lowercase
  requireNumber: true,            // At least 1 number
  requireSpecialChar: true,       // At least 1 special char
  maxLength: 128,                 // Prevent DOS attacks
  preventCommon: true,            // Block "password123", etc.
};
```

### **2. Session Management**

```typescript
const SESSION_CONFIG = {
  // Token expiry
  accessTokenExpiry: '1 hour',           // Short-lived
  refreshTokenExpiry: '30 days',         // Long-lived
  
  // Storage
  storage: 'localStorage',               // Client-side storage
  cookieSameSite: 'lax',                // CSRF protection
  
  // Security
  autoRefreshToken: true,                // Auto-refresh before expiry
  persistSession: true,                  // Persist across refreshes
  detectSessionInUrl: true,              // Handle OAuth redirects
  
  // Monitoring
  trackLastActivity: true,               // Update last_login_at
  logoutOnInactivity: false,             // Optional: auto-logout after X time
};
```

### **3. Route Protection Strategy**

**Public Routes** (No auth required):
- `/` - Landing page
- `/templates` - Browse templates
- `/features` - Features page
- `/how-it-works` - How it works
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/invitation/[id]` - View shared invitation

**Protected Routes** (Login required):
- `/dashboard` - User dashboard
- `/create/[id]` - Create invitation (optional: allow without login?)
- `/profile` - User profile
- `/settings` - User settings

**Admin Routes** (Admin role required):
- `/admin` - Admin dashboard
- `/admin/editor/[id]` - Template editor
- `/admin/users` - User management
- `/admin/analytics` - Analytics

**Implementation:**
```typescript
// Middleware approach
const routeConfig = {
  public: ['/', '/templates', '/features', '/auth/*'],
  protected: ['/dashboard', '/profile', '/settings'],
  admin: ['/admin', '/admin/*'],
};
```

---

## 🎯 What Users Should See

### **1. Dashboard (After Login)**

```
┌─────────────────────────────────────────┐
│  Welcome back, John Doe! 👋             │
├─────────────────────────────────────────┤
│                                         │
│  Your Account                           │
│  📧 john.doe@example.com               │
│  ⏰ Last login: 5 minutes ago          │
│                                         │
│  Quick Actions:                         │
│  🎨 Create New Invitation              │
│  📋 My Invitations (3)                 │
│  ⚙️  Account Settings                   │
│  🚪 Logout                              │
│                                         │
│  Recent Invitations:                    │
│  • Wedding Invitation #1  [View] [Edit]│
│  • Anniversary Card       [View] [Edit]│
│  • Birthday Invite        [View] [Edit]│
│                                         │
└─────────────────────────────────────────┘
```

### **2. Profile Page**

```
┌─────────────────────────────────────────┐
│  Your Profile                           │
├─────────────────────────────────────────┤
│                                         │
│  [Avatar]   John Doe                   │
│             john.doe@example.com       │
│             ✅ Email Verified           │
│                                         │
│  Profile Information:                   │
│  Full Name:  [John Doe        ]        │
│  Phone:      [+1234567890     ]        │
│  Language:   [English ▼       ]        │
│                                         │
│  Account Security:                      │
│  Password:   ********** [Change]       │
│  2FA:        Disabled    [Enable]      │
│                                         │
│  Preferences:                           │
│  Theme:          ⚪ Light ⚫ Dark       │
│  Notifications:  ☑️ Email me updates   │
│                                         │
│  [Save Changes]                         │
│                                         │
│  Danger Zone:                           │
│  [Delete Account]                       │
│                                         │
└─────────────────────────────────────────┘
```

### **3. Header (When Logged In)**

```
┌──────────────────────────────────────────┐
│ 💍 MakeMyKankotri    [JD ▼] [Logout]   │
│                      John Doe            │
└──────────────────────────────────────────┘
```

---

## 🔒 Security Checklist

### **Authentication Security:**
- [ ] Strong password requirements enforced
- [ ] Password hashing (handled by Supabase) ✅
- [ ] Rate limiting on login attempts
- [ ] CAPTCHA on signup/login (optional)
- [ ] Email verification required
- [ ] 2FA support (optional, future)
- [ ] Session timeout after inactivity
- [ ] Secure password reset flow
- [ ] Prevent account enumeration attacks

### **Authorization Security:**
- [ ] Role-based access control (RBAC)
- [ ] Protected routes middleware
- [ ] Admin-only route protection
- [ ] Permission checks on actions
- [ ] RLS policies in database
- [ ] API endpoint protection
- [ ] CSRF protection
- [ ] XSS protection

### **Session Security:**
- [ ] HTTPOnly cookies (if using cookies)
- [ ] Secure flag in production
- [ ] SameSite cookie attribute
- [ ] Token refresh mechanism ✅
- [ ] Session invalidation on logout
- [ ] Concurrent session management
- [ ] Session hijacking prevention

### **Data Security:**
- [ ] Encrypt sensitive data at rest
- [ ] Encrypt data in transit (HTTPS) ✅
- [ ] Sanitize user inputs
- [ ] Validate all inputs
- [ ] SQL injection prevention (Supabase) ✅
- [ ] XSS prevention
- [ ] CORS properly configured

---

## 📝 Implementation Plan (Priority Order)

### **Phase 1: Critical Security (TODAY)** 🔴

**1. Create user_profiles table**
- Add to database-setup.sql
- Run in Supabase
- Auto-create profiles on signup

**2. Add route protection middleware**
- Create middleware.ts
- Protect /dashboard routes
- Protect /admin routes
- Redirect to login if not authenticated

**3. Add role checking**
- Check user role from profile
- Restrict admin routes to admin role only
- Add isAdmin helper

**4. Display user info**
- Show user name in dashboard
- Show email and verification status
- Add logout button

**Time:** 2-3 hours

---

### **Phase 2: User Profile (NEXT)** 🟡

**1. Create profile page**
- Display user information
- Edit profile form
- Change password flow
- Upload avatar

**2. Update dashboard**
- Welcome message with name
- Quick stats
- Recent invitations

**3. Add user menu**
- Dropdown in header
- Profile link
- Settings link
- Logout link

**Time:** 2-3 hours

---

### **Phase 3: Enhanced Security (LATER)** 🟢

**1. Email verification flow**
- Require email confirmation
- Resend confirmation email
- Email verified badge

**2. Password reset**
- Forgot password link
- Reset email
- Secure reset flow

**3. Rate limiting**
- Login attempt limits
- Signup rate limits
- API rate limits

**4. Security logs**
- Track login attempts
- Track failed logins
- Suspicious activity alerts

**Time:** 4-5 hours

---

## 🎯 Immediate Action Items

### **RIGHT NOW (Before continuing):**

1. **Create user_profiles table**
   - Add SQL to database-setup.sql
   - Run in Supabase
   - Test profile creation

2. **Add route protection**
   - Create middleware.ts
   - Protect dashboard
   - Protect admin

3. **Display user info**
   - Update dashboard to show name
   - Add user menu in header
   - Show logout button

4. **Test security**
   - Try accessing /admin without login → should redirect
   - Try accessing /dashboard without login → should redirect
   - Login → should see name and info
   - Logout → should clear session

---

## ⚠️ Common Security Mistakes to Avoid

1. **❌ Client-side only auth checks**
   - Don't just hide UI elements
   - Always check on server/database level
   - RLS policies are critical

2. **❌ Storing sensitive data client-side**
   - Don't store passwords
   - Don't store API keys
   - Use Supabase session tokens only

3. **❌ Weak password requirements**
   - Not enforcing minimums
   - Allowing common passwords
   - No password strength meter

4. **❌ No rate limiting**
   - Brute force attacks possible
   - DOS vulnerability
   - Need Supabase rate limiting

5. **❌ Exposing user information**
   - Don't show email to other users
   - Don't expose user IDs unnecessarily
   - Privacy by default

6. **❌ Missing logout**
   - Users can't end session
   - Session persists indefinitely
   - Security risk on shared computers

7. **❌ No role checking**
   - Everyone is admin
   - No permission boundaries
   - Complete security failure

---

## 📊 Current Status vs Required

| Feature | Current | Required | Priority |
|---------|---------|----------|----------|
| User signup | ✅ | ✅ | Done |
| User login | ✅ | ✅ | Done |
| Session persistence | ✅ | ✅ | Done |
| **User profile table** | ❌ | ✅ | 🔴 Critical |
| **Show user name** | ❌ | ✅ | 🔴 Critical |
| **Route protection** | ❌ | ✅ | 🔴 Critical |
| **Admin role check** | ❌ | ✅ | 🔴 Critical |
| Profile page | ❌ | ✅ | 🟡 High |
| Change password | ❌ | ✅ | 🟡 High |
| Email verification | ⚠️ | ✅ | 🟡 High |
| Password reset | ❌ | ✅ | 🟡 High |
| 2FA | ❌ | ⚪ | 🟢 Optional |
| Rate limiting | ❌ | ⚠️ | 🟢 Future |

---

## 🎯 Next Steps

**I'll now implement in this order:**

1. ✅ Create user_profiles table + trigger
2. ✅ Add route protection middleware
3. ✅ Update dashboard to show user info
4. ✅ Protect admin routes with role check
5. ✅ Add user menu with logout
6. ✅ Test everything

**Estimated time:** 2-3 hours

**Ready to start?** Let me know and I'll implement these critical security features immediately! 🔒
