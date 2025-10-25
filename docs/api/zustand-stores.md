---
doc_type: api
system: zustand-stores
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [api, zustand]
summary: Zustand stores exposed by the codebase.
---

# Stores

## useEditorStore (core/editor-state/EditorStore.ts)
- State: `selectedElement`, `template`, `history`, `historyIndex`, `clipboard`.
- Actions: selection, load/update template, add/update/delete element, undo/redo, copy/paste, markEditable.
- Emits editor and element events via `eventBus`.

# Usage
```ts
import { useEditorStore } from '@/core/editor-state/EditorStore';
const template = useEditorStore((s) => s.template);
```

# Notes
- See /docs/core/editor-state.md for full shape and events.
