# 🗄️ Database Setup - Single File Solution

## 🎯 The Problem You Had

**Multiple SQL files were causing conflicts:**
- ❌ `supabase-schema.sql` - Used TEXT for IDs (wrong!)
- ❌ `supabase-setup.sql` - Used UUID for IDs (correct!)
- ❌ Type mismatch error: Can't create foreign key between TEXT and UUID
- ❌ Multiple schemas with different structures
- ❌ Files that error if run twice

**The specific error you got:**
```
ERROR: foreign key constraint "invitations_template_id_fkey" cannot be implemented
DETAIL: Key columns "template_id" and "id" are of incompatible types: text and uuid.
```

This happened because one file had:
- `templates.id` as TEXT
- `invitations.template_id` as TEXT trying to reference UUID

## ✅ The Solution

**ONE FILE TO RULE THEM ALL:** `database-setup.sql`

This single file:
- ✅ **Uses UUID everywhere** (templates.id, invitations.id, all foreign keys)
- ✅ **Fully idempotent** - Safe to run multiple times, won't error
- ✅ **Complete schema** - Everything you need in one place
- ✅ **Development-friendly** - Works without authentication
- ✅ **Sample data included** - Ready to test immediately

## 🚀 How to Use (Simple!)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"+ New Query"**

### Step 2: Copy & Run

1. **Open file:** `database-setup.sql`
2. **Select ALL** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Paste** into Supabase SQL Editor
5. **Click "RUN"** (or Ctrl+Enter)

### Step 3: Watch It Work

You'll see output like:
```
✅ Creating tables...
✅ Creating indexes...
✅ Creating functions...
✅ Creating triggers...
✅ Setting up RLS policies...
✅ Inserting sample data...
✅ Verification: 2 tables, 1 template inserted
```

**No errors!** 🎉

### Step 4: Restart & Test

```bash
# Stop your dev server (Ctrl+C)
npm run dev

# Open in browser
http://localhost:3000/templates
```

**You should see: "Elegant Wedding Invitation" template!** 🎊

---

## 📋 What Gets Created

### Tables
1. **`templates`** - Stores invitation templates
   - ID: UUID (not TEXT!)
   - Elements, layout, styling
   - Publishing status, views, uses
   - Development-friendly (works without auth)

2. **`invitations`** - Stores user-generated invitations
   - ID: UUID
   - Links to template via UUID foreign key ✅
   - User's data, sharing settings
   - Analytics

### Features
- ✅ All indexes for fast queries
- ✅ Helper functions (increment views/uses)
- ✅ Auto-update timestamps
- ✅ RLS policies (security enabled)
- ✅ Development mode (works without login)
- ✅ Sample template for testing

---

## 🔄 Can I Run It Again?

**YES! It's fully safe to re-run!**

The file uses:
- `CREATE TABLE IF NOT EXISTS` - Won't error if table exists
- `CREATE INDEX IF NOT EXISTS` - Won't error if index exists
- `DROP POLICY IF EXISTS` - Removes old policies before creating new ones
- `DROP TRIGGER IF EXISTS` - Removes old triggers
- `ON CONFLICT DO NOTHING` - Won't duplicate sample data

**Run it 100 times = Same result!** No errors! ✅

---

## 🛠️ Troubleshooting

### "relation already exists"

**This shouldn't happen** with the new file, but if it does:
- The file uses `IF NOT EXISTS` so it should skip existing tables
- Safe to re-run the entire file

### "permission denied"

Make sure you're running in Supabase SQL Editor as the project owner.

### Still seeing TEXT vs UUID error?

This means you ran old SQL first. Fix it:

```sql
-- Drop the problematic tables
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;

-- Now run the full database-setup.sql file
```

### Want to start completely fresh?

```sql
-- Nuclear option - delete everything
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;
DROP FUNCTION IF EXISTS increment_template_views CASCADE;
DROP FUNCTION IF EXISTS increment_template_uses CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Now run database-setup.sql
```

---

## 📊 Verification

After running, check at the bottom of SQL results:

**Tables created:**
```
templates    | public | your_username
invitations  | public | your_username
```

**Template columns (should show UUID):**
```
id          | uuid        | NO
name        | text        | NO
slug        | text        | NO
...
```

**Row counts:**
```
templates    | 1 row    | 1 published
invitations  | 0 rows   | -
```

**See "uuid" for id column?** ✅ Perfect!  
**See "text" for id column?** ❌ You ran old SQL, drop and re-run

---

## 🎯 Quick Checklist

Before running:
- [ ] You're in Supabase SQL Editor
- [ ] You have `database-setup.sql` open
- [ ] You've copied the ENTIRE file

After running:
- [ ] No errors in output
- [ ] See "uuid" for templates.id data type
- [ ] See "uuid" for invitations.template_id data type
- [ ] Foreign key created successfully
- [ ] 1 template in database
- [ ] RLS policies created

After restarting server:
- [ ] No errors when visiting `/templates`
- [ ] See sample template in gallery
- [ ] Can click "Use This Template"

---

## 🎉 Success Indicators

**You know it worked when:**

1. ✅ SQL runs without errors
2. ✅ `/templates` page shows sample template
3. ✅ Can click "Use This Template" button
4. ✅ Form generator works
5. ✅ Can create invitations

**If all checked:** **You're done!** Database is perfect! 🚀

---

## 💡 Why One File?

**Old way (confusing):**
```
run schema.sql     → creates tables with UUID
run dev-policies.sql → updates policies  
run supabase-schema.sql → BREAKS! Uses TEXT instead of UUID
```

**New way (simple):**
```
run database-setup.sql → Everything works! ✅
```

One file = One source of truth = No conflicts! 🎯

---

## 📞 Still Stuck?

1. Check the verification queries at end of SQL output
2. Look for "uuid" vs "text" in column types
3. If template.id shows "text", drop tables and re-run
4. The file is designed to be foolproof - if it fails, it's an old table conflict

**TL;DR:** Delete old tables, run `database-setup.sql`, profit! 💰
