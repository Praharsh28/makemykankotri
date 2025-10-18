# 🔧 Fix Supabase NetworkError

## Problem

**Error:** `NetworkError when attempting to fetch resource`

**Cause:** The `templates` table doesn't exist in your Supabase database yet.

---

## ✅ Solution (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard**
2. Select your project: `ebaqzmfejeymmxfxkmczi`
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run the Setup SQL

1. Open the file: `supabase-setup.sql` (in this project root)
2. **Copy ALL the SQL** (entire file content)
3. **Paste** into Supabase SQL Editor
4. Click **RUN** button (or press Ctrl/Cmd + Enter)

**Note:** 
- The SQL includes security hardening (`SET search_path = ''`) to prevent SQL injection vulnerabilities
- The script is **idempotent** - you can run it multiple times safely (it uses `IF NOT EXISTS` and `DROP IF EXISTS`)

### Step 3: Verify Setup

You should see output showing:
- ✅ Table created
- ✅ Indexes created  
- ✅ RLS policies enabled
- ✅ Functions created

The last query will show all columns in the `templates` table.

### Step 4: Test Your App

1. Restart your Next.js dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. Try saving a template again
3. Error should be gone! ✨

---

## What the SQL Does

1. **Creates `templates` table** with all required columns:
   - Basic info (name, slug, description)
   - Template data (elements, layout, animations)
   - Metadata (category, tags, thumbnail)
   - Stats (views, uses, version)
   - Timestamps (created_at, updated_at)

2. **Creates indexes** for fast queries:
   - Slug lookups
   - Category filtering
   - Tag searches
   - Published status

3. **Enables Row Level Security (RLS)**:
   - Public can view published templates
   - Anyone can create (for development)
   - Users can edit/delete their own templates

4. **Creates helper functions**:
   - `increment_template_views()` - Track views
   - `increment_template_uses()` - Track uses
   - Auto-update `updated_at` timestamp

---

## Verify It Worked

After running the SQL, check in Supabase:

1. Go to **Table Editor**
2. You should see `templates` table
3. It should have these columns:
   - id, name, slug
   - elements, editable_fields, layout
   - global_animations
   - thumbnail, category, tags, description
   - published, version, views, uses
   - created_by, created_at, updated_at

---

## Still Having Issues?

### Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check if project is **Active** (not paused)
3. Check if you're on the **Free Plan** (should have database access)

### Verify Environment Variables

```bash
# Check .env.local has correct values
cat .env.local | grep SUPABASE

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://ebaqzmfejeymmxfxkmczi.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Check Network

```bash
# Test if you can reach Supabase
curl https://ebaqzmfejeymmxfxkmczi.supabase.co

# Should return HTML, not error
```

---

## Next Steps After Fix

Once the database is set up, you can:

1. ✅ Save templates in the visual editor
2. ✅ Load templates from database
3. ✅ Publish/unpublish templates
4. ✅ Track views and uses
5. ✅ Auto-save working properly

---

## Database Schema Reference

```sql
templates
├── id (uuid, primary key)
├── name (text)
├── slug (text, unique)
├── elements (jsonb) - Template elements array
├── editable_fields (text[]) - IDs of editable fields
├── layout (jsonb) - Width, height, background
├── global_animations (jsonb) - Global animation configs
├── thumbnail (text) - Preview image URL
├── category (text) - Template category
├── tags (text[]) - Search tags
├── description (text) - Template description
├── published (boolean) - Public visibility
├── version (integer) - Template version number
├── views (integer) - View count
├── uses (integer) - Usage count
├── created_by (uuid) - User ID (references auth.users)
├── created_at (timestamp) - Creation time
└── updated_at (timestamp) - Last update time
```

---

**Ready!** Run the SQL and you're good to go! 🚀
