---
doc_type: core
system: renderer-engine
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, rendering, utilities]
summary: Shared rendering utilities for template rendering across plugins.
---

# Purpose
Provide reusable rendering utilities for templates, extracted from `plugins/template-renderer` for use across multiple plugins.

# Scope
- Data injection ({{placeholder}} → actual values)
- Element type renderers (text, image, gallery, container)
- Style conversion (element style → React CSS)
- Position calculation
- Layout style generation

# Implementation
Located at: `/src/core/renderer-engine/`

## Modules

### dataInjector.ts
Handles placeholder replacement in content.

```ts
// Replace {{key}} and {{nested.key}} placeholders
injectData(content: unknown, data: Record<string, unknown>): unknown

// Get nested object value by dot notation
getNestedValue(obj: Record<string, unknown>, key: string): unknown

// Check if content has placeholders
hasPlaceholders(content: unknown): boolean

// Extract all placeholder keys from content
extractPlaceholderKeys(content: unknown): string[]
```

### styleConverter.ts
Converts element styles to React CSSProperties.

```ts
// Convert element style object to React CSS
convertStyle(style: Element['style']): React.CSSProperties

// Convert position to absolute positioning style
convertPositionStyle(position, size): React.CSSProperties

// Merge multiple style objects
mergeStyles(...styles: React.CSSProperties[]): React.CSSProperties

// Convert template layout to container style
convertLayoutStyle(layout): React.CSSProperties
```

### elementRenderer.tsx
Type-specific element renderers.

```ts
// Render different element types
renderTextElement({ element, data }): React.ReactNode
renderImageElement({ element }): React.ReactNode
renderGalleryElement({ element }): React.ReactNode
renderContainerElement({ element, children }): React.ReactNode

// Get appropriate renderer for element type
getElementRenderer(type: string): Function | null
```

## Usage Example

```ts
import {
  injectData,
  convertStyle,
  convertPositionStyle,
  mergeStyles,
} from '@/core/renderer-engine';

function MyRenderer({ element, data }) {
  const content = injectData(element.content, data);
  const style = mergeStyles(
    convertPositionStyle(element.position, element.size),
    convertStyle(element.style)
  );
  
  return <div style={style}>{content}</div>;
}
```

## Consumers
- `plugins/template-renderer` - Main template rendering
- Future: visual-editor preview, export plugin, email templates

## Tests
- `core/renderer-engine/__tests__/dataInjector.test.ts` - Placeholder injection tests
- More tests TBD for style converters

# Benefits
- ✅ Reusable across plugins
- ✅ Testable independently
- ✅ Follows core/plugin separation
- ✅ Reduces code duplication

# Failure Modes / Gotchas
- Keep DOM-only code out of server paths
- Ensure consistent style conversion across plugins
- Element renderers use `<img>` with eslint-disable for dynamic content

# Changelog
- 2025-10-25: Initial draft created
- 2025-10-25: Implemented and refactored TemplateRenderer to use core utilities
