---
doc_type: plugin
system: gallery
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, gallery]
summary: Gallery plugin enabling browsing templates with optional category filtering.
---

# Purpose
Provide a responsive gallery to browse published templates with optional category filters.

# Entry Points
- `src/plugins/gallery/index.ts` (plugin definition)
- `src/plugins/gallery/TemplateGallery.tsx` (component)

# Feature Flags
- Plugin enables `gallery` on install via `featureFlags.enable('gallery')`.

# API
```ts
export interface TemplateGalleryProps {
  onSelectTemplate?: (template: Template) => void;
  selectedTemplateId?: string;
  category?: string;
}
```

# Behavior
- Loads templates via `templateStorage.list({ published: true, category })`.
- Shows skeletons while loading; error UI with retry.
- Renders `TemplateCard` grid; highlights selected.

# Dependencies and Boundaries
- Uses core `featureFlags` and `templateStorage` service.
- No cross-imports from other plugins.

# Failure Modes / Gotchas
- Feature flag must be enabled (plugin install).
- Ensure DB has published templates for public display.

# Examples
```tsx
<TemplateGallery onSelectTemplate={(tpl) => setSelected(tpl)} />
```

# Changelog
- 2025-10-25: Initial doc created
