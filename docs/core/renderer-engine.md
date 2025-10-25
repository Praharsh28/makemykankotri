---
doc_type: core
system: renderer-engine
status: draft
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, renderer]
summary: Core renderer responsibilities and contracts. Rendering is currently implemented in the template-renderer plugin.
---

# Purpose
Define the responsibilities of a core renderer that composes `Template` + data into DOM/canvas output.

# Current Implementation
- Rendering logic lives in `plugins/template-renderer/TemplateRenderer.tsx`.
- Core `renderer-engine` folder exists but is not yet implemented.

# Target Responsibilities (planned)
- Provide common interfaces for rendering text, image, gallery, container elements.
- Data injection for `{{placeholders}}`.
- Style normalization and conversion to React CSS/Canvas props.
- Hooks for animation engine to attach effects.

# Contracts
```ts
interface RenderContext {
  mode: 'preview' | 'export';
  data: Record<string, unknown>;
}
```

# Events (planned)
- `renderer:element:rendered`
- `renderer:completed`

# Failure Modes / Gotchas
- Keep DOM-only code out of server paths.
- Ensure consistent style conversion across plugins.

# Next Steps
- Extract reusable utilities from `TemplateRenderer.tsx` into core.
- Define element render adapters per `ElementType`.

# Changelog
- 2025-10-25: Initial draft created
