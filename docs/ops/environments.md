---
doc_type: ops
system: environments
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [ops, env]
summary: Environment variables and their usage across the app.
---

# Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

# AI Generator (optional)
- `V0_API_KEY` → used by ai-generator; falls back to mock if missing.

# Notes
- Keep secrets out of the repo.
- For Vercel, set env vars in Project Settings.
