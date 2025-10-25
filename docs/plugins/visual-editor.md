---
doc_type: plugin
system: visual-editor
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, editor, puck, dnd-kit]
summary: Visual editor plugin (dnd-kit-based) with event emissions for save/publish.
---

# Purpose
Admin-facing visual editor to author templates. Emits events on save/publish.

# Entry Points
- `src/plugins/visual-editor/index.ts` (plugin definition + auto-registration on browser)
- `src/plugins/visual-editor/VisualEditor.tsx` (main component)

# Feature Flags
- Depends on `FEATURE_FLAGS.VISUAL_EDITOR`.

# Events
- Emits `editor:template:saved` with `{ templateId, template }`.
- Emits `template:published` with `{ templateId }`.
- Listens to `template:load` (logs in current implementation).
- Also logs `element:created` events.

# API
```ts
export interface VisualEditorProps {
  template?: Template;
  onSave?: (template: Template) => void;
  onPublish?: (template: Template) => void;
}
```

# Dependencies and Boundaries
- Uses core `featureFlags`, `eventBus`, and `types`.
- No cross-imports from other plugins.

# Failure Modes / Gotchas
- Ensure plugin registration occurs in the browser (window check present).
- Save/publish rely on consumers to persist (e.g., `TemplateStorage`).

# Examples
```tsx
<VisualEditor
  template={template}
  onSave={(t) => templateStorage.save(t)}
  onPublish={(t) => templateStorage.publish(t.id)}
/>
```

# Changelog
- 2025-10-25: Initial doc created
