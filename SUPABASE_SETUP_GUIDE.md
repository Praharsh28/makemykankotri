# 🚀 Supabase Setup Guide for WebKankotri v2

You have your `.env.local` file with credentials, but you're getting **"Failed to fetch"** errors because your Supabase database doesn't have the required tables yet.

## ⚡ Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar (database icon)
4. Click **"New Query"**

### Step 2: Run the Schema

1. Open the file: `supabase-schema.sql` (in this directory)
2. **Copy ALL the SQL code** (Ctrl+A, Ctrl+C)
3. **Paste it** into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify It Worked

You should see:
```
Success. No rows returned
```

Scroll down in the results and check:
- ✅ 2 tables created: `templates`, `invitations`
- ✅ Multiple policies created
- ✅ 1 sample template inserted

### Step 4: Check Your Tables

1. Click **"Table Editor"** in the left sidebar
2. You should see:
   - `templates` table (with 1 sample row)
   - `invitations` table (empty)

### Step 5: Restart Your Dev Server

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

### Step 6: Test It!

1. Go to http://localhost:3000
2. Click **"Get Started"** or **"Browse Templates"**
3. You should see the sample template! 🎉

---

## 🔍 Troubleshooting

### Error: "Failed to fetch" still happening

**Check your environment variables are loaded:**

1. Stop dev server (Ctrl+C)
2. Verify `.env.local` has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
   ```
3. Make sure there are NO spaces around the `=` sign
4. Restart dev server: `npm run dev`

### Error: "relation 'templates' does not exist"

This means the SQL didn't run successfully:
1. Go back to Supabase SQL Editor
2. Run this quick check:
   ```sql
   SELECT * FROM public.templates;
   ```
3. If you get an error, re-run the full `supabase-schema.sql`

### Error: "permission denied for table templates"

This means RLS policies aren't set up:
1. Go to Supabase → Authentication → Policies
2. You should see policies for `templates` and `invitations`
3. If not, re-run the `supabase-schema.sql`

### Still having issues?

**Check browser console:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for the actual error message
4. The error will tell you if it's:
   - Network issue (wrong URL)
   - Auth issue (wrong key)
   - Database issue (missing table)

---

## 📊 What the Schema Creates

### Tables

1. **`templates`** - Stores all invitation templates
   - Structure, editable fields, styling
   - Publishing status, views, uses
   - Created by admin/users

2. **`invitations`** - Stores user-generated invitations
   - Links to template
   - User's data (names, dates, etc.)
   - Sharing settings, analytics

### Security (RLS Policies)

- ✅ **Anyone** can view published templates
- ✅ **Authenticated users** can create templates
- ✅ **Creators** can edit/delete their own templates
- ✅ **Anyone** can view public invitations
- ✅ **Creators** can manage their own invitations

### Sample Data

- 1 sample template: "Elegant Wedding Invitation"
- You can use this to test the system immediately
- Delete it later or keep it as reference

---

## 🎯 Next Steps After Setup

### 1. Create More Templates

**Option A: Use Visual Editor**
1. Go to `/admin`
2. Click "Create from Scratch"
3. Use Puck editor to design
4. Save & Publish

**Option B: Use AI Generator**
1. Go to `/admin`
2. Click "Generate with AI"
3. Describe your template
4. AI creates it for you

### 2. Enable Authentication

Your auth is already configured! Users can:
- Sign up at `/auth/signup`
- Sign in at `/auth/login`
- View their dashboard at `/dashboard`

### 3. Test the Full Flow

1. Browse templates at `/templates`
2. Click "Use This Template"
3. Fill in the form
4. Generate invitation
5. Share the link!

---

## 🔐 Security Notes

### Environment Variables

**IMPORTANT:** Your `.env.local` file contains sensitive keys!

- ✅ Already in `.gitignore` (safe)
- ❌ Never commit to GitHub
- ❌ Never share publicly

### Supabase Keys

You're using the `anon/public` key which is safe to expose in frontend:
- ✅ Row Level Security (RLS) protects your data
- ✅ Users can only access what policies allow
- ❌ Never use the `service_role` key in frontend

### Production Checklist

Before going live:
- [ ] Review all RLS policies
- [ ] Set up email templates in Supabase
- [ ] Configure custom domain
- [ ] Enable email confirmations
- [ ] Set up error tracking
- [ ] Add rate limiting

---

## 💡 Understanding the Error

**Why "Failed to fetch"?**

```
Your App → Supabase Client → Supabase Database
                                      ↓
                              Looking for 'templates' table
                                      ↓
                              ❌ Table doesn't exist!
                                      ↓
                              Returns error to your app
```

**After running the SQL:**

```
Your App → Supabase Client → Supabase Database
                                      ↓
                              ✅ 'templates' table exists!
                                      ↓
                              ✅ Returns template data
                                      ↓
                              🎉 Your app shows templates!
```

---

## ✅ Success Checklist

After running the SQL, you should be able to:

- [ ] Visit `/templates` without errors
- [ ] See the sample template
- [ ] Click "Use This Template"
- [ ] Fill the form and generate invitation
- [ ] Sign up for an account
- [ ] Create templates as admin
- [ ] View templates in gallery

If all checked, you're **100% ready to go!** 🚀

---

## 📞 Need Help?

If you're still stuck:
1. Check the Supabase logs (Dashboard → Logs)
2. Check browser console (F12 → Console)
3. Verify your `.env.local` file format
4. Try the troubleshooting steps above

The most common issue is forgetting to run the SQL schema. That's it! 🎉
