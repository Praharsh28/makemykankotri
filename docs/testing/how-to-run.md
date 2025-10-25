---
doc_type: testing
system: how-to-run
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [testing, vitest]
summary: How to install, run, and debug tests locally and in CI.
---

# Install
```bash
npm install
```

# Run tests
```bash
npm test                  # run all tests once
npm run test:watch        # watch mode
npm run test:coverage     # with coverage
```

# UI runner (if configured)
```bash
npm run test:ui
```

# Debug tips
- Set `DEBUG=vitest:*` for verbose output
- Use `.only` on tests while iterating
- Mock Supabase and network requests; do not hit external APIs
- Prefer EVENT_NAMES constants in expectations

# CI notes
- Ensure Node 20+
- Cache node_modules for speed
- Fail on ESLint errors to match Vercel behavior
