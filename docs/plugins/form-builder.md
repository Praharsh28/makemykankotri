---
doc_type: plugin
system: form-builder
status: stable
owners: [Makemykankotri]
last_updated: 2025-10-25
tags: [plugin, forms, react-hook-form]
summary: Form builder plugin that generates and manages forms for template editable fields.
---

# Purpose
Provide dynamic form generation and submission for templates' editable fields.

# Entry Points
- `src/plugins/form-builder/index.ts` (plugin definition)
- Components: `FormGenerator`, `FormPreview`, `FileUpload`, `FormStepper`
- Hook: `useFormData`

# Feature Flags
- Plugin enables `form-builder` on install via `featureFlags.enable('form-builder')`.

# Hook API: useFormData(templateId)
```ts
const { formData, updateField, updateFields, reset, submit, isSubmitting, submitResult } = useFormData(templateId);
```
- Emits events via eventBus:
  - `form:dataChanged` on field changes
  - `form:submitted` on submit
  - `form:error` on failure

# Data Contract
```ts
interface FormData { templateId: string; fields: Record<string, unknown>; }
interface FormSubmissionResult { success: boolean; data?: FormData; error?: string; generatedUrl?: string; }
```

# Dependencies and Boundaries
- Uses eventBus for cross-plugin notifications (no cross-imports).
- In production, submit should call an API to persist invitation and return a URL.

# Failure Modes / Gotchas
- Current `submit` returns a simulated URL. Implement backend persistence when ready.
- Ensure RLS policies allow insert to `invitations` when wiring server.

# Examples
```tsx
const { updateField, submit } = useFormData(template.id);
updateField('brideName', 'Aisha');
const result = await submit();
```

# Changelog
- 2025-10-25: Initial doc created
