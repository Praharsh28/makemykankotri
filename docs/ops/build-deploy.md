---
doc_type: ops
system: build-deploy
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [ops, build, deploy, vercel]
summary: Build and deploy processes (local and Vercel).
---

# Local
```bash
npm run dev    # Turbopack
npm run build  # Production build
```

# Vercel
- Next.js 15 with Turbopack supported.
- ESLint runs during build; errors block deploy.

# Notes
- Next.js may infer wrong workspace root if multiple lockfiles exist. Consider setting `turbopack.root` in next.config.js or removing extra lockfiles.
- Migrate `<img>` to `next/image` to avoid warnings (non-blocking).
