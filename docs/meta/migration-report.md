---
doc_type: meta
system: migration-report
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [meta, migration]
summary: Old scattered docs → new unified /docs system mapping and removal list.
---

# Purpose
Track migration from scattered root-level docs to unified /docs system.

# Kept (intentionally)
- README.md → minimal pointer to /docs
- CHANGELOG.md → historical record
- database-setup.sql → SQL source
- .env.local, .env.example → config

# Removed (content migrated to /docs)
- AI_GENERATOR_INTEGRATION.md → /docs/plugins/ai-generator.md
- AUTH_REQUIREMENTS.md → /docs/security/auth.md, /docs/security/rbac.md
- BUILD_COMPLETE_SUMMARY.md → /docs/overview/project-overview.md
- DATABASE_README.md → /docs/data/schema.md
- DEPLOYMENT_GUIDE.md, DEPLOY_VERCEL_GITHUB.md → /docs/ops/build-deploy.md
- FEATURES_INVENTORY.md, FEATURE_STATUS_AUDIT.md → /docs/overview/project-overview.md, /docs/roadmap/backlog.md
- FINAL_VERIFICATION.md, FRONTEND_PROGRESS.md → obsolete working docs
- PERFORMANCE_GUIDE.md, PERFORMANCE_METRICS.md → future /docs/ops/performance.md (not yet needed)
- PRODUCTION_CHECKLIST.md → /docs/ops/build-deploy.md + /docs/security/*.md
- PROJECT_STATUS.md, PROJECT_STATUS_BACKUP.md → obsolete working docs
- SUPABASE_FIX.md, SUPABASE_SETUP_GUIDE.md → /docs/data/schema.md, /docs/troubleshooting/playbooks.md
- VERSION_1.0.md, WEEK_3_SUMMARY.md, WEBSITE_STRUCTURE_PLAN.md → obsolete working docs

# New unified docs
All docs live under /docs with clear IA and AI-optimized structure.
See /docs/INDEX.md for full list.

# Safe to delete
All files listed in "Removed" section above.

# Blueprint folder note
The `/home/enigma/Desktop/windsurf/projects/webkankotri-v2-blueprint/` folder contains original design docs (00_README.md through WINDSURFRULES.md). These were reference material during development.

**Status:** Superseded by /docs which is grounded in actual code implementation.

The blueprint remains as historical design docs but is NO LONGER the source of truth. All authoritative documentation is now under /docs in this repo.
