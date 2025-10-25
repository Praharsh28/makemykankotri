---
doc_type: core
system: plugin-system
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, plugins, events, feature-flags]
summary: Plugin isolation, event bus communication, and feature flags.
---

# Purpose
Define how features are built as isolated plugins that communicate exclusively through events and gated by feature flags.

# Scope
- Event bus patterns (publish/subscribe)
- Event naming and versioning
- Contracts (payload schemas)
- Feature flags
- Boundary rules (no cross-imports)

# Key Concepts
- Isolation: Plugins must not import from other plugins. They may import from core only.
- Events: All cross-plugin communication uses the event bus.
- Contracts: Every event payload is validated at boundaries via zod/types.
- Flags: Feature availability is toggled via core feature flags.

# Dependencies and Boundaries
- Allowed imports: `@/core/...`
- Forbidden imports: `@/plugins/<other-plugin>/*`

# Event Naming
- Format: `<domain>:<action>` e.g., `template:save`, `editor:select`
- Use past tense for notifications (`:saved`) and imperative for commands (`:save`)
- Version with suffix when breaking: `template:save@v2`

# Contracts (Types/Zod)
```ts
// Example shape (pseudo)
import { z } from 'zod';

export const TemplateSaveEvent = z.object({
  templateId: z.string().uuid(),
  payload: z.object({ name: z.string(), elements: z.array(z.any()) }),
  actorId: z.string().uuid().optional(),
});

export type TemplateSaveEvent = z.infer<typeof TemplateSaveEvent>;
```

# Events (Publish/Subscribe)
- Publish: `eventBus.emit('template:save', data)`
- Subscribe: `eventBus.on('template:saved', handler)`
- All listeners must validate payloads before processing.

# Feature Flags
- Read via `@/core/feature-flags`
- Example:
```ts
if (!featureFlags.isEnabled('visual-editor')) return <Placeholder />;
```

# Failure Modes / Gotchas
- Cross-imports between plugins breaks isolation.
- Missing payload validation leads to runtime bugs across boundaries.
- Event name typos result in silent no-ops.

# Examples
- `visual-editor` publishes `template:save`
- `template-system` persists and emits `template:saved`

# Changelog
- 2025-10-25: Initial doc created
