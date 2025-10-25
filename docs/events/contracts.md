---
doc_type: events
system: contracts
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [events, contracts, zod]
summary: Event payload contracts inferred from code. Prefer using constants from EVENT_NAMES.
---

# Purpose
Provide type-safe payload definitions for events to enforce boundaries between plugins.

# Conventions
- Use EVENT_NAMES where possible (see event-catalog.md)
- Validate at boundaries (zod or TS types)

# Contracts (TypeScript)
```ts
// Editor
export interface EditorElementSelectedEvent {
  elementId: string;
  element: unknown;
}

export interface EditorElementUpdatedEvent {
  elementId: string;
  changes: Record<string, unknown>;
}

export interface EditorElementDeletedEvent {
  elementId: string;
}

export interface EditorTemplateSavedEvent {
  templateId: string;
  template: unknown;
}

export interface EditorTemplateLoadedEvent {
  template: unknown;
}

// Template
export interface TemplatePublishedEvent {
  templateId: string;
}

// Element Factory (literal events in ElementFactory.ts)
export interface ElementCreatedEvent {
  element: unknown;
}

export interface ElementUpdatedEvent {
  elementId: string;
  changes: Record<string, unknown>;
  element: unknown;
}

export interface ElementDuplicatedEvent {
  originalId: string;
  duplicate: unknown;
}

export interface ElementDeletedEvent {
  elementId: string;
}
```

# Zod (optional)
```ts
import { z } from 'zod';

export const ZEditorElementSelectedEvent = z.object({
  elementId: z.string(),
  element: z.unknown(),
});

export const ZEditorElementUpdatedEvent = z.object({
  elementId: z.string(),
  changes: z.record(z.unknown()),
});

export const ZEditorTemplateSavedEvent = z.object({
  templateId: z.string(),
  template: z.unknown(),
});

export const ZTemplatePublishedEvent = z.object({
  templateId: z.string(),
});
```

# Notes
- Consider adding constants for `element:created`, `element:updated`, `element:duplicated`, `element:deleted` to EVENT_NAMES for consistency.
