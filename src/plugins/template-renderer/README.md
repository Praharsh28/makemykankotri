# Template Renderer Plugin

**Status:** ✅ Complete  
**Version:** 1.0.0  
**Tests:** 17/17 passing

## Overview

Renders templates with injected user data to generate final invitation pages. Supports both preview and export modes for static HTML generation.

## Features

- ✅ Data injection with placeholder replacement
- ✅ Nested object support (`{{bride.name}}`)
- ✅ Multiple placeholders per element
- ✅ Absolute positioning with z-index
- ✅ Full style support
- ✅ Image and gallery elements
- ✅ Preview and export modes
- ✅ Static HTML generation

## Usage

### Basic Rendering

```typescript
import { TemplateRenderer } from '@/plugins/template-renderer';

<TemplateRenderer
  template={template}
  data={{
    brideName: 'Alice',
    groomName: 'Bob',
    weddingDate: '2025-12-25',
    venue: 'Mumbai, India'
  }}
/>
```

### With Nested Data

```typescript
<TemplateRenderer
  template={template}
  data={{
    bride: {
      name: 'Alice',
      family: 'Smith'
    },
    groom: {
      name: 'Bob',
      family: 'Jones'
    }
  }}
/>
```

### Export Mode

```typescript
<TemplateRenderer
  template={template}
  data={formData}
  mode="export"
/>
```

## Data Injection

### Placeholder Syntax

Use `{{key}}` in template content:

```typescript
// Template element
{
  content: "Wedding of {{bride.name}} & {{groom.name}}"
}

// Data
{
  bride: { name: 'Alice' },
  groom: { name: 'Bob' }
}

// Result
"Wedding of Alice & Bob"
```

### Supported Patterns

**Simple placeholders:**
```
{{name}}
{{email}}
{{date}}
```

**Nested objects:**
```
{{bride.name}}
{{bride.family}}
{{venue.address.city}}
```

**Multiple in one element:**
```
"{{greeting}} {{name}}, welcome to {{event}}!"
```

### Missing Data Handling

If data is missing, the placeholder remains:
```typescript
// Template: "Hello {{name}}"
// Data: {}
// Result: "Hello {{name}}"
```

## Template Structure

### Supported Element Types

**Text:**
```typescript
{
  type: 'text',
  content: 'Hello {{name}}',
  position: { x: 0, y: 0, z: 0 },
  size: { width: 'auto', height: 'auto' },
  style: {
    fontFamily: 'Cinzel',
    fontSize: 48,
    color: '#F5B800'
  }
}
```

**Image:**
```typescript
{
  type: 'image',
  content: {
    url: 'https://example.com/image.jpg',
    alt: 'Description'
  },
  position: { x: 100, y: 100, z: 1 },
  size: { width: 200, height: 200 }
}
```

**Gallery:**
```typescript
{
  type: 'gallery',
  content: [
    { url: 'image1.jpg', alt: 'Photo 1' },
    { url: 'image2.jpg', alt: 'Photo 2' }
  ],
  position: { x: 0, y: 0, z: 0 },
  size: { width: 600, height: 200 }
}
```

**Container:**
```typescript
{
  type: 'container',
  content: [/* child elements */],
  position: { x: 0, y: 0, z: 0 },
  size: { width: 800, height: 600 }
}
```

## Layout System

Templates use absolute positioning:

```typescript
layout: {
  width: 800,           // Container width
  height: 1200,         // Container height
  background: '#FFFFFF', // Background color
  orientation: 'portrait' // Portrait/landscape
}

elements: [
  {
    position: {
      x: 100,  // Left offset
      y: 200,  // Top offset
      z: 0     // Stack order (z-index)
    }
  }
]
```

## Modes

### Preview Mode (default)

For interactive display in the app:
```typescript
<TemplateRenderer template={template} data={data} mode="preview" />
```

### Export Mode

For generating static HTML:
```typescript
<TemplateRenderer template={template} data={data} mode="export" />
```

**Differences:**
- Export mode removes interactive elements
- Preview mode may include edit controls
- Export generates clean HTML for sharing

## Styling

### Supported Style Properties

```typescript
{
  fontFamily: 'Cinzel',
  fontSize: 48,              // Converted to pixels
  color: '#000000',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: '#FFFFFF',
  padding: 16,              // Converted to pixels
  margin: 8,                // Converted to pixels
  borderRadius: 4           // Converted to pixels
}
```

All numeric values are automatically converted to pixels in the rendered output.

## Complete Example

```typescript
import { TemplateRenderer } from '@/plugins/template-renderer';
import { useState } from 'react';

export function InvitationPreview({ template }) {
  const [formData, setFormData] = useState({
    bride: {
      name: 'Alice Smith',
      family: 'The Smiths'
    },
    groom: {
      name: 'Bob Jones',
      family: 'The Jones'
    },
    wedding: {
      date: 'December 25, 2025',
      time: '4:00 PM',
      venue: 'Grand Hotel, Mumbai'
    },
    rsvp: {
      email: 'rsvp@wedding.com',
      phone: '+91 98765 43210'
    }
  });

  return (
    <div>
      <h2>Preview</h2>
      <TemplateRenderer
        template={template}
        data={formData}
        mode="preview"
      />
      
      <button onClick={() => exportHTML()}>
        Export HTML
      </button>
    </div>
  );
}
```

## API

### TemplateRenderer Props

```typescript
interface TemplateRendererProps {
  template: Template;                  // Template to render
  data: Record<string, unknown>;       // Data to inject
  mode?: 'preview' | 'export';        // Render mode (default: 'preview')
}
```

### Template Type

```typescript
interface Template {
  id: string;
  name: string;
  elements: Element[];
  layout: {
    width: number;
    height: number;
    background: string;
    orientation: 'portrait' | 'landscape';
  };
  // ... other metadata
}
```

### Element Type

```typescript
interface Element {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'container';
  content: string | object | Element[];
  position: { x: number; y: number; z: number };
  size: { width: number | 'auto'; height: number | 'auto' };
  style: Record<string, unknown>;
  // ... other properties
}
```

## Performance

**Optimizations:**
- Uses React's efficient rendering
- Absolute positioning for predictable layout
- No runtime reflows
- Pure component re-renders

**Best Practices:**
- Keep templates under 50 elements for best performance
- Optimize images before using
- Use simple data structures

## Testing

17 comprehensive tests covering:
- Feature flag integration
- Template rendering
- Data injection (simple, nested, multiple)
- Element positioning and z-index
- Style application
- Image and gallery handling
- Preview/export modes
- Static HTML generation

Run tests:
```bash
npm test -- template-renderer
```

## Architecture Compliance

✅ **Plugin Isolation** - No cross-plugin imports  
✅ **Feature Flag** - Can be enabled/disabled  
✅ **TypeScript Strict** - No `any` types  
✅ **Tests** - 17/17 passing  
✅ **Design System** - Renders template styles  

## URL Generation & Sharing

### Generate Unique URLs

```typescript
import { generateSlug, generateInvitationUrl, saveInvitation } from '@/plugins/template-renderer';

// Generate slug
const slug = generateSlug('Alice & Bob Wedding');
// Result: "alice-bobs-wedding-x7k9m2p1"

// Generate full URL
const url = generateInvitationUrl(slug);
// Result: "https://yourdomain.com/preview/alice-bobs-wedding-x7k9m2p1"

// Save invitation and get URL
const result = await saveInvitation(template, formData);
if (result.success) {
  console.log('Share this:', result.url);
}
```

### Share Button Component

```typescript
import { ShareButton } from '@/plugins/template-renderer';

<ShareButton
  url="https://example.com/preview/wedding-abc123"
  showShareOptions  // Optional: Show WhatsApp/Email buttons
/>
```

**Features:**
- Copy link button with visual feedback
- WhatsApp sharing (opens WhatsApp with message)
- Email sharing (opens mailto link)
- Success/error states
- Responsive design

## Future Enhancements

1. ~~**URL Generation**~~ ✅ Complete
2. ~~**Share Functionality**~~ ✅ Complete  
3. **PDF Export** - Generate PDF from rendered template
4. **Image Export** - Export as PNG/JPEG
5. **Animation Support** - Render GSAP animations
6. **Responsive Rendering** - Auto-scale for different screen sizes
7. **Print Optimization** - CSS print styles
8. **SEO Metadata** - Add meta tags for sharing
9. **QR Code** - Generate QR code for easy mobile access

---

**Status:** Production ready with URL generation & sharing! 🚀
