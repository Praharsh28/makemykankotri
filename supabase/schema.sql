-- WebKankotri v2 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Templates table
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  elements jsonb not null default '[]'::jsonb,
  editable_fields text[] not null default array[]::text[],
  layout jsonb not null default '{}'::jsonb,
  global_animations text[] default array[]::text[],
  thumbnail text,
  category text,
  tags text[] default array[]::text[],
  description text,
  published boolean default false,
  created_by uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  version integer default 1,
  views integer default 0,
  uses integer default 0
);

-- Indexes for performance
create index if not exists templates_slug_idx on templates(slug);
create index if not exists templates_published_idx on templates(published);
create index if not exists templates_category_idx on templates(category);
create index if not exists templates_created_by_idx on templates(created_by);
create index if not exists templates_created_at_idx on templates(created_at desc);
create index if not exists templates_updated_at_idx on templates(updated_at desc);

-- Full-text search index
create index if not exists templates_search_idx on templates using gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Function to increment views
create or replace function increment_template_views(template_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.templates
  set views = views + 1
  where id = template_id;
end;
$$;

-- Function to increment uses
create or replace function increment_template_uses(template_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.templates
  set uses = uses + 1
  where id = template_id;
end;
$$;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to auto-update updated_at
drop trigger if exists update_templates_updated_at on templates;
create trigger update_templates_updated_at
  before update on templates
  for each row
  execute function update_updated_at_column();

-- Row Level Security (RLS)
alter table templates enable row level security;

-- Policy: Anyone can view published templates
drop policy if exists "Public templates are viewable by everyone" on templates;
create policy "Public templates are viewable by everyone"
  on templates for select
  using (published = true);

-- Policy: Authenticated users can view their own templates
drop policy if exists "Users can view own templates" on templates;
create policy "Users can view own templates"
  on templates for select
  using (auth.uid() = created_by);

-- Policy: Authenticated users can insert their own templates
drop policy if exists "Users can insert own templates" on templates;
create policy "Users can insert own templates"
  on templates for insert
  with check (auth.uid() = created_by);

-- Policy: Authenticated users can update their own templates
drop policy if exists "Users can update own templates" on templates;
create policy "Users can update own templates"
  on templates for update
  using (auth.uid() = created_by);

-- Policy: Authenticated users can delete their own templates
drop policy if exists "Users can delete own templates" on templates;
create policy "Users can delete own templates"
  on templates for delete
  using (auth.uid() = created_by);

-- Sample template (optional - for testing)
insert into templates (
  name,
  slug,
  elements,
  editable_fields,
  layout,
  category,
  description,
  published
) values (
  'Simple Wedding Invitation',
  'simple-wedding-invitation',
  '[
    {
      "id": "text-1",
      "type": "text",
      "content": "You are invited",
      "position": {"x": 100, "y": 50, "z": 1},
      "size": {"width": 600, "height": "auto"},
      "style": {"font": "Cinzel", "fontSize": 48, "color": "#2c3e50", "textAlign": "center"},
      "editable": false,
      "animations": []
    },
    {
      "id": "text-2",
      "type": "text",
      "content": "Bride & Groom",
      "position": {"x": 100, "y": 150, "z": 2},
      "size": {"width": 600, "height": "auto"},
      "style": {"font": "Playfair Display", "fontSize": 36, "color": "#e74c3c", "textAlign": "center"},
      "editable": true,
      "required": true,
      "name": "Couple Names",
      "animations": ["fade-in"]
    },
    {
      "id": "text-3",
      "type": "text",
      "content": "Date: December 25, 2025",
      "position": {"x": 100, "y": 250, "z": 3},
      "size": {"width": 600, "height": "auto"},
      "style": {"font": "Inter", "fontSize": 24, "color": "#34495e", "textAlign": "center"},
      "editable": true,
      "required": true,
      "name": "Wedding Date",
      "animations": []
    }
  ]'::jsonb,
  array['text-2', 'text-3'],
  '{"width": 800, "height": 600, "background": "#f8f9fa", "orientation": "portrait"}'::jsonb,
  'wedding',
  'A simple and elegant wedding invitation template',
  true
)
on conflict (slug) do nothing;
