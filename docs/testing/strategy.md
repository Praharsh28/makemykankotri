---
doc_type: testing
system: strategy
status: draft
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [testing, vitest, strategy]
summary: Testing strategy for core, plugins, and UI.
---

# Scope
- Core: event-bus, feature-flags, element-system, template-system services
- Plugins: visual-editor (unit for event emissions), template-renderer (DOM output), form-builder hooks
- UI: components with basic rendering and props

# Tools
- Vitest + @testing-library/react + jsdom

# Types of tests
- Unit: functions, stores, services (fast)
- Component: render output, props, events
- Contract: event payloads (shape), DB mappers

# Guidelines
- Mock Supabase in unit tests; do not hit network
- Prefer EVENT_NAMES constants in tests
- Keep tests deterministic; avoid timing flakiness

# Coverage targets
- Core modules ≥ 80%
- Critical plugins ≥ 70%

# Example areas
- event-bus: on/off/emit/once behavior
- feature-flags: enable/disable/reset and localStorage effects
- TemplateStorage: mapToTemplate, list filters (with mocked supabase)
- EditorStore: actions update state and emit expected events
