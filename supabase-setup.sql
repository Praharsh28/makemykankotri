-- WebKankotri v2 - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor
-- Project: https://ebaqzmfejeymmxfxkmczi.supabase.co

-- ==========================================
-- 1. Create templates table
-- ==========================================

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  
  -- Template content (JSONB for flexibility)
  elements jsonb NOT NULL DEFAULT '[]'::jsonb,
  editable_fields text[] NOT NULL DEFAULT ARRAY[]::text[],
  layout jsonb NOT NULL DEFAULT '{}'::jsonb,
  global_animations jsonb DEFAULT '[]'::jsonb,
  
  -- Media & Display
  thumbnail text DEFAULT '',
  
  -- Categorization
  category text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  description text DEFAULT '',
  
  -- Publishing & Stats
  published boolean DEFAULT false,
  version integer DEFAULT 1,
  views integer DEFAULT 0,
  uses integer DEFAULT 0,
  
  -- Ownership & Timestamps
  created_by uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==========================================
-- 2. Create indexes for better performance
-- ==========================================

CREATE INDEX IF NOT EXISTS templates_slug_idx ON templates(slug);
CREATE INDEX IF NOT EXISTS templates_published_idx ON templates(published);
CREATE INDEX IF NOT EXISTS templates_category_idx ON templates(category);
CREATE INDEX IF NOT EXISTS templates_created_by_idx ON templates(created_by);
CREATE INDEX IF NOT EXISTS templates_updated_at_idx ON templates(updated_at DESC);

-- GIN index for tag searches
CREATE INDEX IF NOT EXISTS templates_tags_idx ON templates USING GIN(tags);

-- ==========================================
-- 3. Enable Row Level Security (RLS)
-- ==========================================

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON templates;
DROP POLICY IF EXISTS "Authenticated users can view all templates" ON templates;
DROP POLICY IF EXISTS "Anyone can create templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

-- Policy: Anyone can read published templates
CREATE POLICY "Public templates are viewable by everyone"
  ON templates FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all templates
CREATE POLICY "Authenticated users can view all templates"
  ON templates FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Anyone can create templates (for development)
-- In production, restrict to authenticated users
CREATE POLICY "Anyone can create templates"
  ON templates FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own templates
CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  USING (created_by = auth.uid() OR created_by IS NULL);

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  USING (created_by = auth.uid() OR created_by IS NULL);

-- ==========================================
-- 4. Create helper functions
-- ==========================================

-- Function to increment template views
CREATE OR REPLACE FUNCTION increment_template_views(template_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET views = views + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Function to increment template uses
CREATE OR REPLACE FUNCTION increment_template_uses(template_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET uses = uses + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. Insert sample data (optional)
-- ==========================================

-- Uncomment to insert sample templates for testing
/*
INSERT INTO templates (name, slug, elements, editable_fields, layout, category, tags, description, published)
VALUES 
(
  'Traditional Gold Wedding',
  'traditional-gold-wedding',
  '[{"id": "elem-1", "type": "text", "content": "Wedding Invitation", "position": {"x": 0, "y": 0, "z": 0}, "size": {"width": "auto", "height": "auto"}, "style": {"fontFamily": "Cinzel", "fontSize": 48, "color": "#F5B800"}, "editable": false, "required": false, "animations": [], "createdAt": "2025-01-01T00:00:00.000Z", "updatedAt": "2025-01-01T00:00:00.000Z"}]'::jsonb,
  ARRAY['elem-2', 'elem-3'],
  '{"width": 800, "height": 1200, "background": "#FFFEF7", "orientation": "portrait"}'::jsonb,
  'wedding',
  ARRAY['traditional', 'gold', 'elegant'],
  'A beautiful traditional wedding invitation with gold accents',
  true
),
(
  'Modern Minimalist',
  'modern-minimalist',
  '[{"id": "elem-1", "type": "text", "content": "Celebrate With Us", "position": {"x": 0, "y": 0, "z": 0}, "size": {"width": "auto", "height": "auto"}, "style": {"fontFamily": "Inter", "fontSize": 36, "color": "#262626"}, "editable": false, "required": false, "animations": [], "createdAt": "2025-01-01T00:00:00.000Z", "updatedAt": "2025-01-01T00:00:00.000Z"}]'::jsonb,
  ARRAY['elem-2'],
  '{"width": 800, "height": 1200, "background": "#FFFFFF", "orientation": "portrait"}'::jsonb,
  'wedding',
  ARRAY['modern', 'minimalist', 'clean'],
  'A clean and modern wedding invitation design',
  true
);
*/

-- ==========================================
-- SETUP COMPLETE
-- ==========================================

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'templates'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE tablename = 'templates';
