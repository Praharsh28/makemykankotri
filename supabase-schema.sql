-- =============================================
-- WebKankotri v2 - Supabase Database Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  
  -- Template structure
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  editable_fields JSONB DEFAULT '[]'::jsonb,
  layout JSONB,
  global_animations JSONB,
  
  -- Media
  thumbnail TEXT,
  
  -- Publishing
  published BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  
  -- Metadata
  views INTEGER DEFAULT 0,
  uses INTEGER DEFAULT 0,
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_published ON public.templates(published);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);

-- =============================================
-- INVITATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id TEXT PRIMARY KEY,
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE,
  
  -- User data
  user_data JSONB NOT NULL,
  
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_template ON public.invitations(template_id);
CREATE INDEX IF NOT EXISTS idx_invitations_created_by ON public.invitations(created_by);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Templates: Public can read published templates
CREATE POLICY "Anyone can view published templates"
  ON public.templates
  FOR SELECT
  USING (published = true);

-- Templates: Authenticated users can view all templates
CREATE POLICY "Authenticated users can view all templates"
  ON public.templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Templates: Only creators can update their templates
CREATE POLICY "Users can update their own templates"
  ON public.templates
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Templates: Authenticated users can insert templates
CREATE POLICY "Authenticated users can insert templates"
  ON public.templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Templates: Only creators can delete their templates
CREATE POLICY "Users can delete their own templates"
  ON public.templates
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Invitations: Public can view public invitations
CREATE POLICY "Anyone can view public invitations"
  ON public.invitations
  FOR SELECT
  USING (is_public = true);

-- Invitations: Creators can view their own invitations
CREATE POLICY "Users can view their own invitations"
  ON public.invitations
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Invitations: Authenticated users can insert invitations
CREATE POLICY "Authenticated users can create invitations"
  ON public.invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Invitations: Only creators can update their invitations
CREATE POLICY "Users can update their own invitations"
  ON public.invitations
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Invitations: Only creators can delete their invitations
CREATE POLICY "Users can delete their own invitations"
  ON public.invitations
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for templates
DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for invitations
DROP TRIGGER IF EXISTS update_invitations_updated_at ON public.invitations;
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert a sample template for testing
INSERT INTO public.templates (
  id,
  name,
  slug,
  description,
  category,
  tags,
  elements,
  editable_fields,
  thumbnail,
  published,
  created_by
) VALUES (
  'sample-template-' || gen_random_uuid()::text,
  'Elegant Wedding Invitation',
  'elegant-wedding-' || floor(random() * 10000)::text,
  'A beautiful and elegant wedding invitation template with floral designs',
  'wedding',
  ARRAY['elegant', 'floral', 'modern'],
  '[
    {
      "id": "text-1",
      "type": "text",
      "content": "{{bride_name}} & {{groom_name}}",
      "styles": {
        "fontSize": "48px",
        "fontFamily": "Cinzel",
        "textAlign": "center",
        "color": "#2D3748",
        "marginTop": "100px"
      }
    },
    {
      "id": "text-2",
      "type": "text",
      "content": "Together with their families, invite you to celebrate their wedding",
      "styles": {
        "fontSize": "18px",
        "textAlign": "center",
        "color": "#4A5568",
        "marginTop": "20px"
      }
    },
    {
      "id": "text-3",
      "type": "text",
      "content": "{{wedding_date}}",
      "styles": {
        "fontSize": "24px",
        "textAlign": "center",
        "color": "#D4AF37",
        "marginTop": "40px"
      }
    },
    {
      "id": "text-4",
      "type": "text",
      "content": "{{venue_name}}\n{{venue_address}}",
      "styles": {
        "fontSize": "16px",
        "textAlign": "center",
        "color": "#4A5568",
        "marginTop": "20px",
        "whiteSpace": "pre-line"
      }
    }
  ]'::jsonb,
  '[
    {
      "id": "bride_name",
      "label": "Bride'\''s Name",
      "type": "text",
      "placeholder": "Enter bride'\''s name",
      "required": true
    },
    {
      "id": "groom_name",
      "label": "Groom'\''s Name",
      "type": "text",
      "placeholder": "Enter groom'\''s name",
      "required": true
    },
    {
      "id": "wedding_date",
      "label": "Wedding Date",
      "type": "date",
      "required": true
    },
    {
      "id": "venue_name",
      "label": "Venue Name",
      "type": "text",
      "placeholder": "Enter venue name",
      "required": true
    },
    {
      "id": "venue_address",
      "label": "Venue Address",
      "type": "textarea",
      "placeholder": "Enter complete address",
      "required": true
    }
  ]'::jsonb,
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  true,
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('templates', 'invitations');

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('templates', 'invitations');

-- Count templates
SELECT COUNT(*) as template_count FROM public.templates;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
-- If you see results from the queries above, your database is set up correctly!
-- You can now use the WebKankotri v2 app with full database functionality.
