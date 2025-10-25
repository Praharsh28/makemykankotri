---
doc_type: events
system: global
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [events, pubsub]
summary: Catalog of events emitted/consumed by core and plugins.
---

# Purpose
Centralized list of events to prevent typos and ensure consistent cross-plugin contracts.

# Event Bus
- Source: `src/core/event-bus.ts`
- Constants: `EVENT_NAMES` (preferred)

# Editor Events
- editor:element:selected (EVENT_NAMES.EDITOR_ELEMENT_SELECTED)
- editor:element:updated (EVENT_NAMES.EDITOR_ELEMENT_UPDATED)
- editor:element:deleted (EVENT_NAMES.EDITOR_ELEMENT_DELETED)
- editor:template:saved (EVENT_NAMES.EDITOR_TEMPLATE_SAVED)
- editor:template:loaded (EVENT_NAMES.EDITOR_TEMPLATE_LOADED)
- element:created (literal string in EditorStore; recommend adding constant)

# Template Events
- template:created
- template:updated
- template:published (EVENT_NAMES.TEMPLATE_PUBLISHED)
- template:deleted

# User Events
- user:form:submitted
- user:kankotri:generated
- user:kankotri:shared

# Animation Events
- animation:applied
- animation:preview
- animation:removed

# Storage Events
- storage:save:success
- storage:save:error
- storage:load:success
- storage:load:error

# Plugin Lifecycle
- plugin:installed
- plugin:uninstalled

# Recommendations
- Prefer EVENT_NAMES constants over literal strings.
- Version breaking events with suffix (e.g., `template:save@v2`).
