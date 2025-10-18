# UI Components Library

**Status:** Day 26 Complete ✅  
**Version:** 1.0.0  
**Tests:** 34/34 passing

## Overview

Reusable UI components with semantic colors following the design system from `09_UI_UX_DESIGN.md`.

---

## Day 26: Final Polish - UI Components ✅

### Toast Notification System

Global toast notification system with auto-dismiss and semantic colors.

**Features:**
- 4 types: success, error, warning, info
- Auto-dismiss with configurable duration
- Manual close button
- Smooth slide-in/out animations
- Stack multiple toasts
- Semantic colors (#10B981, #EF4444, #F59E0B, #3B82F6)

**Usage:**
```typescript
import { useToast, ToastContainer } from '@/components/ui';

// Add ToastContainer to root layout
<ToastContainer />

// Use in components
function MyComponent() {
  const toast = useToast();

  function handleSuccess() {
    toast.success('Saved!', 'Template saved successfully');
  }

  function handleError() {
    toast.error('Failed', 'Could not save template');
  }

  function handleWarning() {
    toast.warning('Warning', 'Unsaved changes');
  }

  function handleInfo() {
    toast.info('Tip', 'Use Ctrl+S to save');
  }
}
```

**Methods:**
- `toast.success(title, message?, duration?)`
- `toast.error(title, message?, duration?)`
- `toast.warning(title, message?, duration?)`
- `toast.info(title, message?, duration?)`

**Default Duration:** 5000ms (5 seconds)

---

### Alert Component

Inline alert messages with semantic colors.

**Features:**
- 4 types: success, error, warning, info
- Optional title
- Optional close button
- Semantic colors
- ARIA role="alert"

**Usage:**
```typescript
import { Alert } from '@/components/ui';

// Success alert
<Alert
  type="success"
  title="Success!"
  message="Template saved successfully"
/>

// Error alert with close
<Alert
  type="error"
  message="Failed to load templates"
  onClose={() => setError(null)}
/>

// Warning alert
<Alert
  type="warning"
  message="You have unsaved changes"
/>

// Info alert
<Alert
  type="info"
  message="Pro tip: Use keyboard shortcuts"
/>
```

**Props:**
```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}
```

---

### LoadingOverlay Component

Full-screen or contained loading overlay.

**Features:**
- Full-screen or relative positioning
- Backdrop blur effect
- Animated spinner
- Custom loading message
- Transparent or opaque background
- ARIA live region

**Usage:**
```typescript
import { LoadingOverlay } from '@/components/ui';

// Full-screen loading
<LoadingOverlay
  fullScreen
  message="Saving template..."
/>

// Contained loading (within parent)
<div className="relative">
  <LoadingOverlay message="Loading..." />
  {/* Content */}
</div>

// Transparent overlay
<LoadingOverlay transparent />
```

**Props:**
```typescript
interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}
```

---

## Semantic Color System

Following design system from `09_UI_UX_DESIGN.md`:

```typescript
const semanticColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600',
    value: '#10B981',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    value: '#EF4444',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-600',
    value: '#F59E0B',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600',
    value: '#3B82F6',
  },
};
```

---

## Testing

34 comprehensive tests covering:

**Toast (17 tests):**
- Empty container render
- Success toast display
- Error toast display
- Warning toast display
- Info toast display
- Auto-dismiss after duration
- Manual close button
- Multiple toasts
- useToast hook - success method
- useToast hook - error method
- useToast hook - warning method
- useToast hook - info method

**Alert (12 tests):**
- Success alert render
- Error alert render
- Warning alert render
- Info alert render
- Title display
- Close button show/hide
- Close button functionality
- Custom className
- ARIA role
- Icon rendering for each type

**LoadingOverlay (5 tests):**
- Default message
- Custom message
- Full-screen positioning
- Absolute positioning
- Transparent/opaque background
- ARIA attributes
- Spinner animation
- Backdrop blur
- Z-index

Run tests:
```bash
npm test -- ui
```

---

## Accessibility (WCAG 2.1 AA)

**Toast:**
- ✅ ARIA live region (assertive/polite)
- ✅ Role="alert" on each toast
- ✅ Keyboard accessible close button
- ✅ Screen reader friendly

**Alert:**
- ✅ Role="alert"
- ✅ Semantic HTML
- ✅ Keyboard accessible close button
- ✅ Color + icon for context

**LoadingOverlay:**
- ✅ Role="status"
- ✅ ARIA live="polite"
- ✅ ARIA label with message
- ✅ Visual spinner + text

---

## Integration with Existing Components

**Updated Components:**
- ✅ LoginForm - uses Alert for errors
- ✅ SignupForm - uses Alert for errors
- ✅ MyTemplatesList - uses Alert for errors
- ✅ ExportPDFButton - improved ARIA labels
- ✅ ExportImageButton - improved ARIA labels

**Focus-Visible Styles:**
All interactive elements now have:
- `focus-visible:ring-2 focus-visible:ring-primary-500`

---

## Animation System

**Transitions:**
- `transition-all duration-200` - Default transitions
- `transition-opacity duration-300` - Fade effects
- `animate-spin` - Loading spinners

**Toast Animations:**
- Slide in from right: `translate-x-0`
- Slide out to right: `translate-x-full`
- Fade in: `opacity-100`
- Fade out: `opacity-0`

---

## Files

```
src/components/ui/
├── Toast.tsx           ~220 lines
├── Alert.tsx           ~120 lines
├── LoadingOverlay.tsx  ~40 lines
├── index.ts            exports
└── README.md           this file

tests/components/ui/
├── toast.test.tsx              17 tests
├── alert.test.tsx              12 tests
└── loading-overlay.test.tsx     5 tests
```

---

## Usage Examples

### Complete Error Handling
```typescript
import { Alert, useToast } from '@/components/ui';

function MyForm() {
  const [error, setError] = useState('');
  const toast = useToast();

  async function handleSubmit() {
    try {
      await saveData();
      toast.success('Saved!', 'Data saved successfully');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Loading States
```typescript
import { LoadingOverlay } from '@/components/ui';

function DataTable() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-h-[400px]">
      {loading && <LoadingOverlay message="Loading data..." />}
      {/* Table content */}
    </div>
  );
}
```

### Success Feedback
```typescript
import { useToast } from '@/components/ui';

function DeleteButton({ onDelete }) {
  const toast = useToast();

  async function handleDelete() {
    try {
      await onDelete();
      toast.success('Deleted!', 'Template deleted successfully');
    } catch (err) {
      toast.error('Failed', err.message);
    }
  }

  return <button onClick={handleDelete}>Delete</button>;
}
```

---

**Status:** Day 26 Complete ✅  
**Tests:** 34/34 passing  
**Next:** Day 27 - Final Testing
