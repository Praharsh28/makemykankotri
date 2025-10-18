-- Development RLS Policies for WebKankotri v2
-- ⚠️ These policies allow development without authentication
-- ⚠️ MUST UPDATE BEFORE PRODUCTION DEPLOYMENT ⚠️

-- Step 1: Make created_by nullable for development
ALTER TABLE templates ALTER COLUMN created_by DROP NOT NULL;

-- Step 2: Ensure RLS is ENABLED (we want security, just configured for dev)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to start fresh
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON templates;
DROP POLICY IF EXISTS "Users can view own templates" ON templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;
DROP POLICY IF EXISTS "Allow anonymous insert for development" ON templates;
DROP POLICY IF EXISTS "Allow anonymous update for development" ON templates;
DROP POLICY IF EXISTS "Allow anonymous delete for development" ON templates;

-- Step 4: Create development-friendly policies
-- These work for BOTH anonymous (created_by IS NULL) AND authenticated users

-- Allow SELECT for everyone (anon and authenticated)
CREATE POLICY "Anyone can view all templates (dev)"
  ON templates FOR SELECT
  TO public
  USING (true);

-- Allow INSERT for anon (created_by IS NULL) and authenticated (owns it)
CREATE POLICY "Allow insert for dev users"
  ON templates FOR INSERT
  TO public
  WITH CHECK (
    created_by IS NULL  -- Allow anon users (development)
    OR 
    auth.uid() = created_by  -- Allow authenticated users
  );

-- Allow UPDATE for anon (created_by IS NULL) and authenticated (owns it)
CREATE POLICY "Allow update for dev users"
  ON templates FOR UPDATE
  TO public
  USING (
    created_by IS NULL  -- Allow anon users (development)
    OR 
    auth.uid() = created_by  -- Allow authenticated users
  );

-- Allow DELETE for anon (created_by IS NULL) and authenticated (owns it)
CREATE POLICY "Allow delete for dev users"
  ON templates FOR DELETE
  TO public
  USING (
    created_by IS NULL  -- Allow anon users (development)
    OR 
    auth.uid() = created_by  -- Allow authenticated users
  );

-- These policies:
-- ✅ Keep RLS ENABLED (security is on)
-- ✅ Work for anonymous development (created_by IS NULL)
-- ✅ Work for authenticated users (auth.uid() = created_by)
-- ✅ Easy to update for production (just remove the "IS NULL" checks)
