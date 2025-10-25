---
doc_type: plugin
system: template-renderer
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, renderer]
summary: TemplateRenderer component that renders Template with injected data and element style conversion.
---

# Purpose
Render a Template's elements into DOM with data injection and style conversion.

# Entry Points
- `src/plugins/template-renderer/TemplateRenderer.tsx`

# Feature Flags
- Checks `featureFlags.isEnabled('template-renderer')` before rendering.

# API
```ts
export interface TemplateRendererProps {
  template: Template;
  data: Record<string, unknown>;
  mode?: 'preview' | 'export';
}
```

# Behavior
- Iterates over `template.elements` and renders per `Element.type`:
  - text → `<div>` with injected content
  - image → `<img>` (Next ESLint warns; see issues)
  - gallery → `<img>` list in a flex container
  - container → recursive rendering of children
- Injects `{{placeholders}}` from `data` into string content.
- Converts Element.style to React CSS (basic subset).

# Dependencies and Boundaries
- Uses core `featureFlags` and core `types`.
- No cross-imports from other plugins.

# Failure Modes / Gotchas
- Uses `<img>` directly; Next.js recommends `next/image`.
- `convertStyle` handles simple numeric to `px`; complex spacing object values may be ignored.

# Examples
```tsx
<TemplateRenderer template={tpl} data={{ bride: { name: 'Aisha' } }} />
```

# Changelog
- 2025-10-25: Initial doc created
