-- Quick fix for user_profiles RLS policy
-- Run this in Supabase SQL Editor if you're experiencing infinite loading

-- Add INSERT policy for user_profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Verify policies are set correctly
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';
