-- =============================================
-- WebKankotri v2 - Complete Database Setup
-- =============================================
-- This is the ONLY SQL file you need to run
-- Safe to run multiple times (idempotent)
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TEMPLATES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Template structure (JSONB for flexibility)
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  editable_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  layout JSONB DEFAULT '{}'::jsonb,
  global_animations JSONB DEFAULT '[]'::jsonb,
  
  -- Media
  thumbnail TEXT,
  
  -- Publishing & Stats
  published BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  uses INTEGER DEFAULT 0,
  
  -- Ownership (nullable for development without auth)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVITATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  
  -- User-filled data
  user_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Sharing
  slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT true,
  
  -- Analytics
  views INTEGER DEFAULT 0,
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'User',
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  
  -- Preferences
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_published ON public.templates(published);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON public.templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_updated_at ON public.templates(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_tags ON public.templates USING GIN(tags);

-- Full-text search on templates
CREATE INDEX IF NOT EXISTS idx_templates_search ON public.templates USING GIN(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);

-- Invitations indexes
CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON public.invitations(template_id);
CREATE INDEX IF NOT EXISTS idx_invitations_created_by ON public.invitations(created_by);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_is_public ON public.invitations(is_public);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to increment template views
CREATE OR REPLACE FUNCTION increment_template_views(template_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.templates
  SET views = views + 1
  WHERE id = template_id;
END;
$$;

-- Function to increment template uses
CREATE OR REPLACE FUNCTION increment_template_uses(template_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.templates
  SET uses = uses + 1
  WHERE id = template_id;
END;
$$;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for templates updated_at
DROP TRIGGER IF EXISTS trigger_templates_updated_at ON public.templates;
CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for invitations updated_at
DROP TRIGGER IF EXISTS trigger_invitations_updated_at ON public.invitations;
CREATE TRIGGER trigger_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TEMPLATES RLS POLICIES (Development-Friendly)
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view all templates" ON public.templates;
DROP POLICY IF EXISTS "Allow insert for dev users" ON public.templates;
DROP POLICY IF EXISTS "Allow update for dev users" ON public.templates;
DROP POLICY IF EXISTS "Allow delete for dev users" ON public.templates;
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON public.templates;
DROP POLICY IF EXISTS "Users can view own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.templates;

-- SELECT: Anyone can view all templates (development mode)
CREATE POLICY "Anyone can view all templates"
  ON public.templates FOR SELECT
  TO public
  USING (true);

-- INSERT: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow insert for dev users"
  ON public.templates FOR INSERT
  TO public
  WITH CHECK (
    created_by IS NULL OR auth.uid() = created_by
  );

-- UPDATE: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow update for dev users"
  ON public.templates FOR UPDATE
  TO public
  USING (
    created_by IS NULL OR auth.uid() = created_by
  );

-- DELETE: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow delete for dev users"
  ON public.templates FOR DELETE
  TO public
  USING (
    created_by IS NULL OR auth.uid() = created_by
  );

-- =============================================
-- INVITATIONS RLS POLICIES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can view own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Allow insert for dev users inv" ON public.invitations;
DROP POLICY IF EXISTS "Allow update for dev users inv" ON public.invitations;
DROP POLICY IF EXISTS "Allow delete for dev users inv" ON public.invitations;

-- SELECT: Anyone can view public invitations
CREATE POLICY "Anyone can view public invitations"
  ON public.invitations FOR SELECT
  TO public
  USING (
    is_public = true OR 
    created_by IS NULL OR 
    auth.uid() = created_by
  );

-- INSERT: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow insert for dev users inv"
  ON public.invitations FOR INSERT
  TO public
  WITH CHECK (
    created_by IS NULL OR auth.uid() = created_by
  );

-- UPDATE: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow update for dev users inv"
  ON public.invitations FOR UPDATE
  TO public
  USING (
    created_by IS NULL OR auth.uid() = created_by
  );

-- DELETE: Allow anonymous (dev) and authenticated users
CREATE POLICY "Allow delete for dev users inv"
  ON public.invitations FOR DELETE
  TO public
  USING (
    created_by IS NULL OR auth.uid() = created_by
  );

-- =============================================
-- USER PROFILES RLS POLICIES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- SELECT: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  TO public
  USING (auth.uid() = id);

-- INSERT: Users can create their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- =============================================
-- SAMPLE DATA (For Testing)
-- =============================================

-- Insert sample template
INSERT INTO public.templates (
  id,
  name,
  slug,
  description,
  category,
  tags,
  elements,
  editable_fields,
  layout,
  thumbnail,
  published,
  created_by
) VALUES (
  uuid_generate_v4(),
  'Elegant Wedding Invitation',
  'elegant-wedding-' || floor(random() * 10000)::TEXT,
  'A beautiful and elegant wedding invitation template with floral designs',
  'wedding',
  ARRAY['elegant', 'floral', 'modern'],
  '[
    {
      "id": "text-1",
      "type": "text",
      "content": "You Are Invited",
      "position": {"x": 0, "y": 50, "z": 1},
      "size": {"width": 800, "height": "auto"},
      "style": {
        "fontFamily": "Cinzel",
        "fontSize": 48,
        "color": "#2D3748",
        "textAlign": "center",
        "fontWeight": "bold"
      },
      "editable": false,
      "animations": []
    },
    {
      "id": "text-2",
      "type": "text",
      "content": "{{bride_name}} & {{groom_name}}",
      "position": {"x": 0, "y": 150, "z": 2},
      "size": {"width": 800, "height": "auto"},
      "style": {
        "fontFamily": "Playfair Display",
        "fontSize": 36,
        "color": "#D4AF37",
        "textAlign": "center",
        "fontWeight": "600"
      },
      "editable": true,
      "required": true,
      "name": "Couple Names",
      "animations": ["fade-in"]
    },
    {
      "id": "text-3",
      "type": "text",
      "content": "Together with their families, invite you to celebrate their wedding",
      "position": {"x": 0, "y": 230, "z": 3},
      "size": {"width": 600, "height": "auto"},
      "style": {
        "fontFamily": "Inter",
        "fontSize": 18,
        "color": "#4A5568",
        "textAlign": "center"
      },
      "editable": false,
      "animations": []
    },
    {
      "id": "text-4",
      "type": "text",
      "content": "{{wedding_date}}",
      "position": {"x": 0, "y": 320, "z": 4},
      "size": {"width": 800, "height": "auto"},
      "style": {
        "fontFamily": "Inter",
        "fontSize": 24,
        "color": "#2D3748",
        "textAlign": "center",
        "fontWeight": "500"
      },
      "editable": true,
      "required": true,
      "name": "Wedding Date",
      "animations": []
    },
    {
      "id": "text-5",
      "type": "text",
      "content": "{{venue_name}}",
      "position": {"x": 0, "y": 380, "z": 5},
      "size": {"width": 800, "height": "auto"},
      "style": {
        "fontFamily": "Inter",
        "fontSize": 20,
        "color": "#4A5568",
        "textAlign": "center"
      },
      "editable": true,
      "required": true,
      "name": "Venue Name",
      "animations": []
    }
  ]'::jsonb,
  ARRAY['text-2', 'text-4', 'text-5'],
  '{"width": 800, "height": 600, "background": "#F7FAFC", "orientation": "portrait"}'::jsonb,
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  true,
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('templates', 'invitations')
ORDER BY tablename;

-- Check template columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'templates'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('templates', 'invitations')
ORDER BY tablename, policyname;

-- Count templates
SELECT 
  'templates' as table_name,
  COUNT(*) as row_count,
  COUNT(*) FILTER (WHERE published = true) as published_count
FROM public.templates
UNION ALL
SELECT 
  'invitations' as table_name,
  COUNT(*) as row_count,
  NULL as published_count
FROM public.invitations;

-- =============================================
-- SUCCESS!
-- =============================================
-- If you see results above, your database is ready!
-- 
-- What was created:
-- ✅ templates table (with UUID id)
-- ✅ invitations table (with UUID id and foreign key)
-- ✅ All indexes for performance
-- ✅ Helper functions for views/uses
-- ✅ Auto-update triggers
-- ✅ RLS policies (development-friendly)
-- ✅ Sample wedding template
-- 
-- Next steps:
-- 1. Restart your dev server: npm run dev
-- 2. Visit http://localhost:3000/templates
-- 3. You should see the sample template!
-- =============================================
