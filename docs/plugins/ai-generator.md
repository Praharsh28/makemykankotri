---
doc_type: plugin
system: ai-generator
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, ai, v0.dev]
summary: AI generator plugin integrating v0.dev to produce templates from prompts.
---

# Purpose
Generate template scaffolds from a text prompt using v0.dev API.

# Entry Points
- `src/plugins/ai-generator/index.ts` (plugin definition)
- `src/plugins/ai-generator/V0Generator.ts` (service)
- `AIPromptDialog` (UI)

# Feature Flags
- Plugin enables `ai-generator` on install.

# Service API (V0Generator)
```ts
class V0Generator {
  constructor(config?: V0Config);
  generateTemplate(prompt: string): Promise<V0GenerationResult>;
}
```

# Events
- `ai:generation:start` { prompt }
- `ai:generation:success` { templateId, prompt }
- `ai:generation:error` { prompt, error }

# Configuration
- Env: `V0_API_KEY` (optional). If missing, service falls back to mock response.
- Endpoint/timeouts configurable via `V0Config`.

# Failure Modes / Gotchas
- Without `V0_API_KEY`, returns mocked code; parse still produces a usable template.
- Regex-based parsing is simplistic; consider AST parsing for robustness.

# Changelog
- 2025-10-25: Initial doc created
