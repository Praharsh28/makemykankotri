-- Production RLS Policies for WebKankotri v2
-- ⚠️ Run this when deploying to production
-- ⚠️ Requires authentication system to be in place

-- Step 1: Make created_by required (enforce authentication)
ALTER TABLE templates ALTER COLUMN created_by SET NOT NULL;

-- Step 2: Drop development policies
DROP POLICY IF EXISTS "Anyone can view all templates (dev)" ON templates;
DROP POLICY IF EXISTS "Allow insert for dev users" ON templates;
DROP POLICY IF EXISTS "Allow update for dev users" ON templates;
DROP POLICY IF EXISTS "Allow delete for dev users" ON templates;

-- Step 3: Create production-secure policies
-- These require authentication and proper ownership

-- Allow anyone to view PUBLISHED templates
CREATE POLICY "Public can view published templates"
  ON templates FOR SELECT
  TO public
  USING (published = true);

-- Allow authenticated users to view their OWN templates
CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Allow authenticated users to INSERT their own templates
CREATE POLICY "Users can insert own templates"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow authenticated users to UPDATE their own templates
CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Allow authenticated users to DELETE their own templates
CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Verification query (run after to confirm)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'templates'
ORDER BY policyname;

-- Expected output should show 5 policies:
-- 1. Public can view published templates - SELECT - {public}
-- 2. Users can delete own templates - DELETE - {authenticated}
-- 3. Users can insert own templates - INSERT - {authenticated}
-- 4. Users can update own templates - UPDATE - {authenticated}
-- 5. Users can view own templates - SELECT - {authenticated}
