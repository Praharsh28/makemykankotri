---
doc_type: meta
system: doc-style-guide
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [meta, style-guide]
summary: AI-optimized documentation conventions.
---

# Purpose
Ensure consistent, parseable docs for AI agents.

# Frontmatter (required)
```yaml
---
doc_type: core|plugin|data|event|api|security|ops|testing|troubleshooting|roadmap|meta
system: <system-name or plugin-name>
status: stable|draft
owners: [Makemykankotri]
last_updated: YYYY-MM-DD
tags: [tag1, tag2]
summary: One-line purpose
---
```

# Sections (template)
```md
# Purpose
Brief explanation of what this doc covers.

# Scope
What's in/out of scope.

# Key Concepts
Terms and abstractions.

# Contracts (Types/Zod)
Interface definitions, schemas.

# Dependencies and Boundaries
What this depends on; what it exposes.

# Events (publish/subscribe)
Events emitted/consumed.

# API Surfaces (functions/hooks/stores)
Public APIs.

# Data (tables/columns/constraints)
DB schema if relevant.

# Security (RLS, RBAC)
Security considerations.

# Failure Modes / Gotchas
Common pitfalls.

# Examples
Code snippets.

# Changelog
- YYYY-MM-DD: change description
```

# Conventions
- Use backticks for code/paths/types
- Keep sections short and scannable
- Link to other docs with relative paths
- Update last_updated on every edit
- Add to INDEX.md when creating new docs
