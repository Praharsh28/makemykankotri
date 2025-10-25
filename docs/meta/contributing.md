---
doc_type: meta
system: contributing
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [meta, contributing]
summary: Internal contribution guidelines for AI agents and developers.
---

# Purpose
Define how AI agents and developers contribute to this codebase.

# Plugin Development
- Create under `/src/plugins/<plugin-name>/`
- Provide `index.ts` with plugin definition
- Use `featureFlags` to gate plugin
- Auto-register in browser: `if (typeof window !== 'undefined') pluginRegistry.register(...)`
- Emit events via `eventBus` with `EVENT_NAMES` constants
- No cross-imports from other plugins; communicate via events only

# Core Development
- Core changes must not break plugin isolation
- Add events to `EVENT_NAMES` when introducing new cross-plugin contracts
- Validate payloads at boundaries (zod or TS types)

# Documentation
- Update relevant doc in `/docs` when changing behavior
- Follow AI-optimized template (see doc-style-guide.md)
- Keep INDEX.md updated with new docs

# Testing
- Add unit tests for core modules and services
- Mock Supabase; do not hit network in tests
- Use EVENT_NAMES constants in test expectations

# Commit conventions
- feat: new feature
- fix: bug fix
- docs: documentation only
- chore: maintenance (refactor, deps, tooling)
- test: tests

# Code review
- Ensure no cross-plugin imports
- Check event emissions use constants
- Verify RLS policies align with data access
