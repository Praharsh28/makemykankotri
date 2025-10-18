# Authentication Library

**Status:** Day 22 Complete ✅  
**Version:** 1.0.0  
**Tests:** 32/32 passing

## Overview

Complete authentication system with Supabase Auth integration, React Context API, and protected routes.

---

## Day 22: Authentication ✅

### AuthContext
Global authentication state management with React Context.

**Features:**
- User session management
- Auto-refresh tokens
- Auth state persistence
- Loading states
- Error handling

**Usage:**
```typescript
import { AuthProvider, useAuth } from '@/lib/auth';

// Wrap app with provider
<AuthProvider>
  <YourApp />
</AuthProvider>

// Use in components
function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome {user.email}</div>;
}
```

**API:**
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isAuthenticated: boolean;
}
```

---

## Components

### LoginForm
Beautiful login form following design system.

**Features:**
- Email/password authentication
- Loading states
- Error display
- Design system styling
- Link to signup

**Usage:**
```typescript
import { LoginForm } from '@/components/auth';

<LoginForm
  onSuccess={() => console.log('Logged in')}
  redirectTo="/dashboard"
/>
```

### SignupForm
User registration with validation.

**Features:**
- Full name + email + password
- Password confirmation
- Minimum 6 characters
- Success state
- Error handling

**Usage:**
```typescript
import { SignupForm } from '@/components/auth';

<SignupForm
  onSuccess={() => console.log('Account created')}
  redirectTo="/dashboard"
/>
```

### ProtectedRoute
Wrapper for authenticated pages.

**Features:**
- Auto-redirect to login
- Loading spinner
- Custom redirect path
- Seamless UX

**Usage:**
```typescript
import { ProtectedRoute } from '@/components/auth';

<ProtectedRoute redirectTo="/auth/login">
  <UserDashboard />
</ProtectedRoute>
```

### UserProfile
Display user information and stats.

**Features:**
- Avatar with initial
- User metadata display
- Member since date
- Stats (templates, invitations, shares)
- Sign out button

**Usage:**
```typescript
import { UserProfile } from '@/components/auth';

<UserProfile />
```

---

## Testing

32 comprehensive tests covering:

**AuthContext (8 tests):**
- Provider initialization
- Loading states
- Session management
- Sign in/up/out
- Error handling
- Hook usage validation

**LoginForm (6 tests):**
- Form rendering
- Successful login
- Error display
- Loading states
- Form validation

**SignupForm (7 tests):**
- Form rendering
- Password validation
- Password match
- Successful signup
- Error handling

**ProtectedRoute (4 tests):**
- Loading spinner
- Redirect when unauthenticated
- Render when authenticated
- Custom redirect path

**UserProfile (7 tests):**
- Loading state
- Profile display
- Default values
- Stats section
- Sign out

Run tests:
```bash
npm test -- auth
```

---

## Integration

### Setup in app/layout.tsx

```typescript
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Protect routes

```typescript
// app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/auth';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Access user in components

```typescript
import { useAuth } from '@/lib/auth';

export function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <Link href="/auth/login">Sign In</Link>
      )}
    </div>
  );
}
```

---

## Security

**Supabase Auth:**
- Email/password authentication
- Secure token storage
- Auto-refresh tokens
- Row Level Security (RLS)

**Best Practices:**
- Passwords min 6 characters
- HTTPS only in production
- Secure cookie storage
- CSRF protection

---

## Files

```
src/lib/auth/
├── AuthContext.tsx     ~95 lines
├── index.ts            exports
└── README.md           this file

src/components/auth/
├── LoginForm.tsx       ~165 lines
├── SignupForm.tsx      ~245 lines
├── ProtectedRoute.tsx  ~45 lines
├── UserProfile.tsx     ~80 lines
└── index.ts            exports

tests/lib/
└── auth-context.test.tsx       8 tests

tests/components/
├── login-form.test.tsx         6 tests
├── signup-form.test.tsx        7 tests
├── protected-route.test.tsx    4 tests
└── user-profile.test.tsx       7 tests
```

---

**Status:** Day 22 Complete ✅  
**Tests:** 32/32 passing  
**Next:** Day 23 - My Templates Dashboard
