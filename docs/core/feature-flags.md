---
doc_type: core
system: feature-flags
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [core, feature-flags]
summary: Feature flags system to enable/disable plugins and features.
---

# Purpose
Toggle features and plugins at runtime and broadcast changes via events.

# Source
- `src/core/feature-flags.ts`

# API
```ts
interface FeatureFlags {
  isEnabled(name: string): boolean;
  enable(name: string): void;
  disable(name: string): void;
  toggle(name: string): void;
  getAll(): Record<string, boolean>;
  setFlags(flags: Record<string, boolean>): void;
  resetToDefaults(): void;
}
```

# Storage
- Persists to `localStorage` key `webkankotri-feature-flags` (browser only)

# Events
- Emits `feature:enabled` and `feature:disabled` with `{ featureName }`
- Emits `feature:reset` on reset

# Defaults
- Core: `core`, `event-bus`, `plugin-system` → enabled
- Plugins default: `visual-editor`, `template-storage`, `template-renderer`, `form-builder` → enabled
- Optional plugins: `ai-generator`, `animation-engine`, `gallery`, `export`, `user-management` → disabled
- Dev: `dev-tools` = NODE_ENV === development; `debug-mode` = false

# Usage
```ts
import { featureFlags, FEATURE_FLAGS } from '@/core/feature-flags';

if (!featureFlags.isEnabled(FEATURE_FLAGS.VISUAL_EDITOR)) return null;
```

# Gotchas
- Server environments have no localStorage; guards are in place.
- Plugins call enable/disable on install/uninstall; ensure install paths run on browser.

# Changelog
- 2025-10-25: Initial doc created
