# 🌐 WebKankotri v2 - Website Structure & User Flow Plan

**Status:** ⚠️ Backend Complete, Frontend Missing  
**Problem:** We have a working ENGINE but no INTERFACE  
**Solution:** Build complete website structure with pages, navigation, and user flows

---

## 🚨 CURRENT SITUATION

### ✅ **What We HAVE (Complete Backend)**

**1. Core Systems (100% Complete):**
- Plugin system with event bus
- Element system (Text, Image, Gallery, Container)
- Template storage (Supabase)
- Editor state management (Zustand)
- Feature flags
- TypeScript strict types

**2. Plugins (All 6 Complete):**
- **visual-editor**: Puck-based visual editor (12 files)
- **ai-generator**: v0.dev integration (5 files)
- **form-builder**: Dynamic forms with Zod validation (10 files)
- **template-renderer**: Data injection & rendering (5 files)
- **animation-engine**: GSAP + Konva + Framer (7 files)
- **gallery**: Browse & filter templates (6 files)

**3. UI Components (22 files):**
- Authentication: Login, Signup, Profile, ProtectedRoute
- Dashboard: MyTemplatesList, MyTemplateCard
- Export: PDF & Image export buttons
- UI: Toast, Alert, Loading, Skeleton, ErrorBoundary

**4. Features Built:**
- ✅ Create templates visually with Puck
- ✅ AI template generation
- ✅ Drag & drop elements
- ✅ Mark fields as editable
- ✅ Generate forms from templates
- ✅ Render templates with user data
- ✅ Animations (particles, GSAP, physics)
- ✅ User authentication
- ✅ PDF/Image export
- ✅ Template storage in Supabase

### ❌ **What We're MISSING (No Frontend Pages)**

**Current Problem:**
```
User visits: makemykankotri.vercel.app
Sees: Default Next.js welcome page ❌
Expected: Beautiful landing page with CTA ✅
```

**Missing Pages:**
1. Landing page (/) - NO HOME PAGE!
2. Navigation/Header - NO WAY TO NAVIGATE!
3. Admin dashboard (/admin) - NO ADMIN INTERFACE!
4. Template gallery page (/templates) - EXISTS but not connected
5. Template form page (/create/[id]) - MISSING!
6. View generated page (/invitation/[id]) - MISSING!
7. User dashboard (/dashboard) - MISSING!
8. About/Features page - MISSING!

**Missing Navigation Flow:**
- No header/navigation bar
- No way to go from landing → gallery
- No way to go from gallery → create
- No way to access admin features
- No footer with links

---

## 🎯 COMPLETE WEBSITE STRUCTURE PLAN

### **User Roles & Flows:**

**1. VISITOR (Not logged in):**
```
Landing Page (/) 
  ↓
Browse Templates (/templates)
  ↓
Select Template
  ↓
Fill Form (no login required)
  ↓
Generate Invitation (/invitation/[id])
  ↓
Share URL with guests
```

**2. REGISTERED USER:**
```
Sign Up/Login (/auth/login)
  ↓
User Dashboard (/dashboard)
  ↓
View My Invitations
  ↓
Edit/Reshare/Delete
```

**3. ADMIN (You):**
```
Admin Dashboard (/admin)
  ↓
Option 1: AI Generation
  - Give prompt → Generate template → Edit in Puck
Option 2: Create from Scratch
  - Open Puck editor → Build template
  ↓
Visual Editor (/editor/[id])
  ↓
Mark editable fields
  ↓
Publish to Gallery
```

---

## 📄 PAGES TO BUILD (Priority Order)

### **PHASE 1: Core Pages (Week 1)** 🔴 CRITICAL

#### **1. Landing Page (/)** 
**Purpose:** First impression, convert visitors  
**Components Needed:**
- Hero section with CTA
- Feature showcase (3-4 key features)
- Template gallery preview (6 cards)
- How it works (3 steps)
- Footer with links

**Content:**
```
HERO:
"Create Beautiful Digital Wedding Invitations in Minutes"
Subheading: "No design skills needed. Choose a template, fill your details, share instantly."
CTA: [Browse Templates] [Create Free Invitation]

FEATURES:
- 📝 Easy-to-Use: Fill a simple form, we handle the design
- 🎨 Beautiful Templates: 50+ professionally designed templates
- 🚀 Instant Sharing: Get a unique URL to share with guests
- 📱 Mobile Friendly: Perfect on all devices

HOW IT WORKS:
1. Choose Template → 2. Fill Details → 3. Share Link

TEMPLATE PREVIEW:
Show 6 popular templates from gallery

FOOTER:
- About | Features | Templates | Contact
- © 2025 MakeMyKankotri
```

**File:** `src/app/page.tsx` (replace existing)

---

#### **2. Navigation Header (Global)**
**Purpose:** Allow users to navigate everywhere  
**Components Needed:**
- Logo/Brand
- Main navigation links
- Auth buttons (Login/Signup or User menu)
- Mobile responsive menu

**Structure:**
```
DESKTOP:
[Logo] [Templates] [How It Works] [Features] --- [Login] [Sign Up]
(if logged in: [Dashboard] [Avatar Menu])

MOBILE:
[Logo] [Hamburger Menu]
  → Templates
  → How It Works
  → Features
  → Login/Dashboard
```

**File:** `src/components/layout/Header.tsx`  
**Update:** `src/app/layout.tsx` to include Header

---

#### **3. Template Gallery Page (/templates)**
**Status:** Component exists, needs page wrapper  
**Purpose:** Let users browse all templates  
**Components Needed:**
- Use existing `GalleryPage` component
- Add page layout
- Add filters/search (already built)
- Add "Use This Template" button on each card

**Structure:**
```
PAGE LAYOUT:
[Header/Navigation]
  ↓
[Hero: "Choose Your Perfect Template"]
  ↓
[Filters: Category | Style | Color]
  ↓
[Template Grid - using existing GalleryPage]
  ↓
[Footer]
```

**File:** `src/app/templates/page.tsx` (already exists, needs enhancement)

---

#### **4. Template Creation Flow (/create/[templateId])**
**Purpose:** User fills form to create invitation  
**Components Needed:**
- Use existing `FormGenerator` component
- Add form layout
- Add preview sidebar
- Add "Generate" button

**Structure:**
```
PAGE LAYOUT:
Split screen:
LEFT: Form
  - Template preview (small)
  - Form fields (using FormGenerator)
  - [Generate Invitation] button

RIGHT: Live Preview
  - Show template with filled data
  - Update as user types
```

**Flow:**
```
User clicks "Use This Template" in gallery
  ↓
Route to /create/[templateId]
  ↓
Load template from Supabase
  ↓
Generate form using FormGenerator
  ↓
User fills form
  ↓
Click "Generate"
  ↓
Save to database, generate unique ID
  ↓
Redirect to /invitation/[id]
```

**File:** `src/app/create/[templateId]/page.tsx` (NEW)

---

#### **5. Generated Invitation Page (/invitation/[id])**
**Purpose:** Display final invitation, allow sharing  
**Components Needed:**
- Use existing `TemplateRenderer` component
- Add share buttons
- Add download options (PDF, Image)
- Add edit link (if creator)

**Structure:**
```
PAGE LAYOUT:
Full-screen beautiful invitation
  ↓
[Floating Action Bar at bottom]
  - [Share] [Download PDF] [Download Image]
  - [Copy Link]
  - (if creator) [Edit] [Delete]
```

**File:** `src/app/invitation/[id]/page.tsx` (NEW)

---

### **PHASE 2: User Features (Week 2)** 🟡

#### **6. User Dashboard (/dashboard)**
**Purpose:** User sees all their created invitations  
**Components Needed:**
- Use existing `MyTemplatesList` component
- Add stats (total invitations, views)
- Add action buttons

**Structure:**
```
DASHBOARD LAYOUT:
[Header: "My Invitations"]
  ↓
[Stats Cards]
  - Total Created: 5
  - Total Views: 234
  ↓
[Grid of My Invitations - using MyTemplatesList]
  Each card:
  - Preview image
  - Title
  - Created date
  - [View] [Edit] [Share] [Delete] buttons
```

**File:** `src/app/dashboard/page.tsx` (NEW)

---

#### **7. Auth Pages**
**Purpose:** Let users sign up/login  
**Components Needed:**
- Use existing `LoginForm` component
- Use existing `SignupForm` component
- Add page wrappers

**Files:**
- `src/app/auth/login/page.tsx` (NEW)
- `src/app/auth/signup/page.tsx` (NEW)

**Structure:**
```
CENTERED LAYOUT:
[Logo]
[LoginForm or SignupForm]
[Link to switch between Login/Signup]
[Footer]
```

---

### **PHASE 3: Admin Features (Week 3)** 🟢

#### **8. Admin Dashboard (/admin)**
**Purpose:** Admin controls everything  
**Components Needed:**
- Dashboard with stats
- Links to create template
- Links to manage templates
- Links to view users

**Structure:**
```
ADMIN DASHBOARD:
[Stats Overview]
  - Total Templates: 47
  - Published: 42
  - Drafts: 5
  - Total Users: 1,234
  - Invitations Created: 5,678

[Quick Actions]
  - [Generate Template with AI]
  - [Create from Scratch]
  - [Manage Templates]
  - [View Users]

[Recent Templates]
  - List of last 10 created
```

**File:** `src/app/admin/page.tsx` (NEW)

---

#### **9. Template Editor (/admin/editor/[id])**
**Purpose:** Admin edits template in Puck  
**Components Needed:**
- Use existing `VisualEditor` component
- Add save/publish controls
- Add preview mode

**Structure:**
```
FULL-SCREEN EDITOR:
[Top Bar]
  - [< Back to Admin] [Template Name] [Save] [Publish]
  ↓
[Puck Editor - full screen]
  (using existing VisualEditor)
```

**File:** `src/app/admin/editor/[id]/page.tsx` (NEW)

---

#### **10. AI Template Generator (/admin/generate)**
**Purpose:** Admin generates template with AI  
**Components Needed:**
- Use existing `AIPromptDialog` component
- Add result preview
- Add "Edit in Puck" button

**Structure:**
```
PAGE LAYOUT:
[AI Generator Form]
  - Textarea: "Describe your template..."
  - [Generate with AI] button
  ↓
[Generated Template Preview]
  - Show preview
  - [Edit in Puck] [Save as Draft] [Publish]
```

**File:** `src/app/admin/generate/page.tsx` (NEW)

---

### **PHASE 4: Info Pages (Week 4)** 🔵

#### **11. Features Page (/features)**
**Purpose:** Explain all features  
**Content:**
```
- Visual Template Editor
- AI-Powered Generation
- Dynamic Forms
- Beautiful Animations
- PDF/Image Export
- Mobile Responsive
- Instant Sharing
```

**File:** `src/app/features/page.tsx` (NEW)

---

#### **12. How It Works Page (/how-it-works)**
**Purpose:** Tutorial/Guide  
**Content:**
```
Step 1: Browse Templates
Step 2: Fill Your Details
Step 3: Generate & Share
```

**File:** `src/app/how-it-works/page.tsx` (NEW)

---

#### **13. Footer (Global)**
**Purpose:** Site-wide links  
**Components:**
```
FOOTER LAYOUT:
[Logo] MakeMyKankotri

[Quick Links]
  - Templates
  - Features
  - How It Works
  - About

[Legal]
  - Privacy Policy
  - Terms of Service

[Social]
  - Twitter | Facebook | Instagram

© 2025 MakeMyKankotri. All rights reserved.
```

**File:** `src/components/layout/Footer.tsx` (NEW)

---

## 🗺️ COMPLETE SITEMAP

```
/                           → Landing Page (public)
/templates                  → Gallery (public)
/create/[id]               → Fill form (public)
/invitation/[id]           → View invitation (public)

/auth/login                → Login (public)
/auth/signup               → Signup (public)

/dashboard                 → User dashboard (protected)

/admin                     → Admin dashboard (admin only)
/admin/editor/[id]        → Edit template (admin only)
/admin/generate            → AI generator (admin only)
/admin/templates           → Manage templates (admin only)

/features                  → Features page (public)
/how-it-works             → Tutorial (public)
/about                    → About page (public)
```

---

## 🎨 DESIGN SYSTEM (Already Built!)

**Use existing components from:** `09_UI_UX_DESIGN.md`

**Typography:**
- Headings: Cinzel (font-heading)
- Body: Inter (font-sans)

**Colors:**
- Primary: Gold (#D4AF37) - primary-500
- Secondary: Deep Red (#B91C1C) - secondary-500
- Neutral: Grays - neutral-*

**Components Available:**
- Button (lines 512-560 in design doc)
- Input (lines 617-645)
- Card (lines 564-612)
- Toast, Alert, Loading (already built)

---

## 📊 BUILD PRIORITY

### **Week 1: Essential Pages** (5 pages)
1. Landing Page (/) - 4 hours
2. Header Navigation - 2 hours
3. Template Gallery (/templates) - 3 hours
4. Create Page (/create/[id]) - 6 hours
5. Invitation Page (/invitation/[id]) - 4 hours

### **Week 2: User Flow** (3 pages)
6. User Dashboard (/dashboard) - 5 hours
7. Login Page - 2 hours
8. Signup Page - 2 hours

### **Week 3: Admin Flow** (3 pages)
9. Admin Dashboard (/admin) - 4 hours
10. Editor Page (/admin/editor/[id]) - 5 hours
11. AI Generator (/admin/generate) - 4 hours

### **Week 4: Polish** (3 pages)
12. Features Page - 3 hours
13. How It Works - 2 hours
14. Footer Component - 2 hours

**Total:** ~45-50 hours over 4 weeks

---

## 🚀 IMPLEMENTATION STRATEGY

### **Day 1-2: Landing Page & Navigation**
Build the front door to your app:
- Replace default Next.js page with beautiful landing
- Build header with navigation
- Test navigation flow

### **Day 3-4: User Flow (Templates → Form → Invitation)**
Connect the dots:
- Gallery already works, add "Use Template" button
- Build /create/[id] page with FormGenerator
- Build /invitation/[id] page with TemplateRenderer
- Test complete user journey

### **Day 5-6: User Dashboard & Auth**
Let users see their work:
- Build dashboard using MyTemplatesList
- Add login/signup pages using existing forms
- Add protected routes

### **Day 7-8: Admin Interface**
Give you control:
- Build admin dashboard
- Connect Puck editor on /admin/editor/[id]
- Add AI generator page

### **Day 9-10: Polish & Info Pages**
Make it professional:
- Add features page
- Add how-it-works page
- Build footer
- Test everything end-to-end

---

## ✅ SUCCESS CRITERIA

After implementation, users should be able to:
1. ✅ Land on beautiful homepage
2. ✅ Browse template gallery
3. ✅ Select template and fill form (no login)
4. ✅ See generated invitation
5. ✅ Share invitation URL
6. ✅ Sign up and see dashboard
7. ✅ (Admin) Generate templates with AI
8. ✅ (Admin) Edit templates visually
9. ✅ (Admin) Publish to gallery

**Navigation should work:**
- Landing → Templates → Create → Invitation ✅
- Landing → Login → Dashboard ✅
- Admin → Generate/Edit → Publish ✅

---

## 🎯 FINAL RESULT

```
BEFORE (Now):
makemykankotri.vercel.app → Default Next.js page ❌

AFTER (Goal):
makemykankotri.vercel.app → Beautiful landing page ✅
  → Browse 50+ templates ✅
  → Create invitation in 2 minutes ✅
  → Share with guests ✅
  → Admin creates templates with AI ✅
```

---

## 📝 NOTES

**What We Have:**
- ✅ Powerful backend (100% complete)
- ✅ All plugins working
- ✅ All components built
- ✅ Database & auth configured

**What We Need:**
- ❌ Pages to expose functionality
- ❌ Navigation to connect pages
- ❌ User flows to guide visitors
- ❌ Admin interface to manage system

**Analogy:**
We built a Ferrari engine (backend) but forgot the steering wheel, dashboard, and doors (frontend pages). Time to build the car body! 🚗

---

**Created:** October 23, 2025  
**Purpose:** Complete website structure plan  
**Status:** Ready to implement  
**Timeline:** 4 weeks to full website
