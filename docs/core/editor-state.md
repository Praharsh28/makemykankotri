---
doc_type: core
system: editor-state
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, zustand, editor]
summary: Visual editor state store (Zustand) with actions and emitted events.
---

# Purpose
Centralized editor state using Zustand. Manages selection, template state, history, clipboard, and editable fields.

# Store Shape (inferred from code)
```ts
interface EditorStore {
  selectedElement: Element | null;
  template: Template | null;
  history: Template[];
  historyIndex: number;
  clipboard: Element | null;

  setSelectedElement(el: Element | null): void;
  loadTemplate(t: Template): void;
  getTemplate(): Template | null;
  updateTemplate(updates: Partial<Template>): void;
  addElement(el: Element): void;
  updateElement(elementId: string, updates: Partial<Element>): void;
  deleteElement(elementId: string): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  copy(el: Element): void;
  paste(): void;
  markEditable(elementIds: string[]): void;
}
```

# Events Emitted
- `editor:element:selected` (EVENT_NAMES.EDITOR_ELEMENT_SELECTED)
- `editor:template:loaded` (EVENT_NAMES.EDITOR_TEMPLATE_LOADED)
- `editor:template:saved` (EVENT_NAMES.EDITOR_TEMPLATE_SAVED)
- `editor:element:updated` (EVENT_NAMES.EDITOR_ELEMENT_UPDATED)
- `editor:element:deleted` (EVENT_NAMES.EDITOR_ELEMENT_DELETED)
- `element:created` (literal string, see Gotchas)

# Dependencies and Boundaries
- Uses `eventBus` from core for all side-effects (no direct plugin imports)
- Consumers listen to events rather than store internals across plugins

# Failure Modes / Gotchas
- `element:created` is emitted as a literal string and is not present in EVENT_NAMES. For consistency and typo-safety, consider adding it to EVENT_NAMES.
- `updateTemplate` sets `updatedAt: new Date()` on the client model; persistence layer (`TemplateStorage.save`) separately sets `updated_at`. Keep this distinction documented.

# Examples
- Selecting an element emits `editor:element:selected` payload `{ elementId, element }`.
- Adding an element emits `element:created`.

# Changelog
- 2025-10-25: Initial doc created
