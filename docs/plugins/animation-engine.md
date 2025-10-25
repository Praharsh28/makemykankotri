---
doc_type: plugin
system: animation-engine
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, animations, gsap, konva]
summary: Animation engine plugin exposing animation components and enabling the feature flag.
---

# Purpose
Offer animation utilities/components to enhance templates (Konva + GSAP + Framer Motion).

# Entry Points
- `src/plugins/animation-engine/index.ts` (plugin definition)
- Components: `ParticleLayer`, `TimelineAnimation`, `CinematicReveal`, `AnimationLibrary`, `AnimationPreview`

# Feature Flags
- Plugin enables `animation-engine` on install.

# API
- Components exported via plugin index; see individual component props.

# Dependencies and Boundaries
- Uses `featureFlags` only; no cross-plugin imports.

# Failure Modes / Gotchas
- Ensure feature flag is enabled (plugin install path must execute on the client).
- Coordinate with renderer to attach animations.

# Changelog
- 2025-10-25: Initial doc created
