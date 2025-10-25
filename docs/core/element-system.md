---
doc_type: core
system: element-system
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, elements]
summary: Element registry and factory for creating, validating, and manipulating elements.
---

# Purpose
Provide an extensible element system with type registration and helpers to create/update/validate elements.

# Entry Points
- `src/core/element-system/ElementRegistry.ts`
- `src/core/element-system/ElementFactory.ts`

# Registry API
```ts
interface ElementTypeConfig {
  name: string;
  icon?: string;
  defaultContent: unknown;
  defaultStyle?: Record<string, unknown>;
  renderer: (element: Element) => React.ReactNode;
  editor?: (element: Element) => React.ReactNode;
  validator?: (element: Element) => boolean;
}

// registry methods
register(type: string, config: ElementTypeConfig): void
unregister(type: string): void
get(type: string): ElementTypeConfig | null
has(type: string): boolean
getAll(): Map<string, ElementTypeConfig>
getTypeNames(): string[]
```

# Factory API
```ts
createElement(type: ElementType, config?: Partial<Element>): Element
updateElement(element: Element, changes: Partial<Element>): Element
updateElementStyle(element: Element, styleChanges: Record<string, unknown>): Element
updateElementPosition(element: Element, x: number, y: number, z?: number): Element
updateElementSize(element: Element, width: number|'auto', height: number|'auto'): Element
duplicateElement(element: Element): Element
deleteElement(elementId: string): void
validateElement(element: Element): { valid: boolean; errors: string[] }
validateElementField(element: Element, value: unknown): { valid: boolean; error?: string }
```

# Events
- Emits on create/update/duplicate/delete:
  - `element:created`
  - `element:updated`
  - `element:duplicated`
  - `element:deleted`
- Registry emits:
  - `element-type:registered`
  - `element-type:unregistered`

# Boundaries
- Uses `eventBus` for cross-component notifications.
- Consumers implement renderers/editors per element type.

# Gotchas
- EVENTS are literal strings; consider adding these to `EVENT_NAMES` to avoid typos.
- `defaultContent` must be provided at registration; renderer should handle shape.

# Changelog
- 2025-10-25: Initial doc created
