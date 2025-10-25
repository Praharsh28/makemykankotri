-- Production RLS Policies for webkankotri-v2
-- These are stricter policies for production use
-- Apply AFTER testing in staging environment

-- ============================================================================
-- TEMPLATES TABLE - Production RLS
-- ============================================================================

-- Drop development-friendly SELECT policy
DROP POLICY IF EXISTS "Anyone can view templates" ON public.templates;

-- Production: Users can view published templates OR their own templates
CREATE POLICY "Users can view published templates or own templates"
  ON public.templates FOR SELECT
  TO public
  USING (
    published = true 
    OR (auth.uid() IS NOT NULL AND created_by = auth.uid())
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- ============================================================================
-- USER_PROFILES TABLE - Production RLS
-- ============================================================================

-- Add additional check for profile visibility
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

CREATE POLICY "Users can view own profile or public profiles"
  ON public.user_profiles FOR SELECT
  TO public
  USING (
    id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- ============================================================================
-- INVITATIONS TABLE - Production RLS
-- ============================================================================

-- Tighten invitation access
DROP POLICY IF EXISTS "Anyone can view invitations" ON public.invitations;

CREATE POLICY "Users can view own invitations"
  ON public.invitations FOR SELECT
  TO public
  USING (
    user_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- ============================================================================
-- ADMIN VERIFICATION
-- ============================================================================

-- Function to verify admin role (optional - for extra security)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin-only template management policy
CREATE POLICY "Admins can manage all templates"
  ON public.templates FOR ALL
  TO public
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- RATE LIMITING (Optional - via pg_cron or application layer)
-- ============================================================================

-- Consider adding:
-- 1. Max invitations per user per day
-- 2. Max template creates per user per hour
-- 3. Failed login attempt tracking

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Test these policies in staging first
-- 2. Monitor query performance after applying
-- 3. Adjust USING clauses based on actual usage patterns
-- 4. Consider adding audit logging for admin actions
-- 5. Review policies quarterly for security updates
