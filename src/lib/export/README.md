# Export Library

**Status:** Day 24 Complete ✅  
**Version:** 1.0.0  
**Tests:** 26/26 passing

## Overview

Complete export system for converting templates to PDF using html2canvas and jsPDF.

---

## Day 24: PDF Export ✅

### PDF Export Utilities

**Features:**
- Export any HTML element to PDF
- Multiple export formats (custom size, A4)
- High-quality rendering with html2canvas
- Configurable quality and scale
- Portrait/Landscape orientation
- Generate PDF blobs for advanced use cases

**Dependencies:**
- `html2canvas`: Convert HTML to canvas
- `jspdf`: Generate PDF documents

---

## API Reference

### exportToPDF()

Export element to PDF with custom dimensions.

```typescript
import { exportToPDF } from '@/lib/export';

await exportToPDF('template-preview', {
  filename: 'wedding-invitation.pdf',
  quality: 1.0,
  format: 'a4',
  orientation: 'portrait',
  scale: 2,
});
```

**Parameters:**
- `elementId` (string): DOM element ID to export
- `options` (PDFExportOptions):
  - `filename?` (string): Output filename (default: 'kankotri.pdf')
  - `quality?` (number): Image quality 0-1 (default: 1.0)
  - `format?` ('a4' | 'letter' | 'a3'): Paper format (default: 'a4')
  - `orientation?` ('portrait' | 'landscape'): Page orientation (default: 'portrait')
  - `scale?` (number): Rendering scale for quality (default: 2)

**Returns:** `Promise<void>`

**Throws:** Error if element not found or export fails

---

### exportToA4PDF()

Export element to standard A4 PDF with auto-scaling.

```typescript
import { exportToA4PDF } from '@/lib/export';

await exportToA4PDF('template-preview', 'my-invitation.pdf');
```

**Parameters:**
- `elementId` (string): DOM element ID to export
- `filename?` (string): Output filename (default: 'kankotri.pdf')

**Features:**
- Auto-scales content to fit A4 page
- Centers content on page
- Maintains aspect ratio
- Portrait orientation

**Returns:** `Promise<void>`

---

### generatePDFBlob()

Generate PDF as Blob without downloading.

```typescript
import { generatePDFBlob } from '@/lib/export';

const blob = await generatePDFBlob('template-preview', {
  quality: 0.9,
  scale: 2,
});

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'invitation.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });
```

**Parameters:**
- `elementId` (string): DOM element ID to export
- `options?` (PDFExportOptions): Export options

**Returns:** `Promise<Blob>` - PDF as Blob object

**Use Cases:**
- Upload to server/cloud storage
- Email attachments
- Preview before download
- Share via API

---

## ExportPDFButton Component

Ready-to-use button component with built-in loading and error states.

### Basic Usage

```typescript
import { ExportPDFButton } from '@/components/export';

<ExportPDFButton
  elementId="template-preview"
  filename="wedding-invitation.pdf"
>
  Download PDF
</ExportPDFButton>
```

### Props

```typescript
interface ExportPDFButtonProps {
  elementId: string;              // Required: Element ID to export
  filename?: string;              // Optional: Output filename
  options?: PDFExportOptions;     // Optional: Export options
  variant?: 'primary' | 'secondary' | 'outline';  // Button style
  size?: 'sm' | 'base' | 'lg';   // Button size
  children?: React.ReactNode;     // Button text/content
  useA4?: boolean;                // Use A4 format with auto-scaling
  onSuccess?: () => void;         // Success callback
  onError?: (error: Error) => void;  // Error callback
}
```

### Advanced Examples

```typescript
// Custom styling
<ExportPDFButton
  elementId="preview"
  variant="secondary"
  size="lg"
  filename="invitation.pdf"
>
  Download Invitation
</ExportPDFButton>

// With callbacks
<ExportPDFButton
  elementId="preview"
  onSuccess={() => console.log('PDF downloaded!')}
  onError={(err) => console.error('Export failed:', err)}
/>

// A4 format with auto-scaling
<ExportPDFButton
  elementId="preview"
  useA4={true}
  filename="invitation-a4.pdf"
/>

// Custom options
<ExportPDFButton
  elementId="preview"
  options={{
    quality: 0.95,
    scale: 3,
    orientation: 'landscape',
  }}
/>
```

### States

**Default:**
- Shows "Export PDF" with download icon
- Primary button style
- Enabled and clickable

**Loading:**
- Shows "Exporting..." with spinner
- Button disabled
- Animated spinner icon

**Error:**
- Shows error message below button
- Red background with error text
- Button re-enabled for retry

---

## Testing

26 comprehensive tests covering:

**PDF Export Utilities (12 tests):**
- exportToPDF with default options
- Custom filename
- Landscape orientation
- Element not found error
- Custom scale
- exportToA4PDF format
- Custom filename for A4
- A4 element not found
- Image added to PDF
- generatePDFBlob without saving
- Blob generation errors
- Custom options for blob

**ExportPDFButton (14 tests):**
- Button rendering
- Custom children
- exportToPDF call
- exportToA4PDF when useA4=true
- Loading state
- Success callback
- Error display
- Error callback
- Primary variant styles
- Secondary variant styles
- Outline variant styles
- Size styles
- Custom options passing
- Error clearing on retry

Run tests:
```bash
npm test -- export
```

---

## Implementation Details

### High-Quality Rendering

```typescript
const canvas = await html2canvas(element, {
  scale: 2,           // 2x resolution for crisp output
  useCORS: true,      // Load cross-origin images
  allowTaint: true,   // Allow tainted canvas
  backgroundColor: '#ffffff',  // White background
  logging: false,     // Disable console logs
});
```

### PDF Generation

```typescript
const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'px',
  format: [width, height],  // Custom size to match content
});

pdf.addImage(imageData, 'PNG', 0, 0, width, height);
pdf.save('filename.pdf');
```

### A4 Auto-Scaling

```typescript
// Calculate scaling ratio to fit A4
const ratio = Math.min(
  pdfWidth / imgWidth,
  pdfHeight / imgHeight
);

// Scale and center
const scaledWidth = imgWidth * ratio;
const scaledHeight = imgHeight * ratio;
const x = (pdfWidth - scaledWidth) / 2;
const y = (pdfHeight - scaledHeight) / 2;
```

---

## Performance

**Optimization Tips:**
1. **Use scale=2** for balance between quality and file size
2. **Reduce quality** (0.8-0.9) for smaller files
3. **Hide unnecessary elements** before export
4. **Optimize images** in template
5. **Use A4 format** for standard size

**Typical Performance:**
- Small template (<500KB): ~1-2 seconds
- Medium template (~1MB): ~2-4 seconds
- Large template (>2MB): ~4-6 seconds

---

## Error Handling

All functions throw descriptive errors:

```typescript
try {
  await exportToPDF('my-element');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Element does not exist');
  } else {
    console.error('Export failed:', error);
  }
}
```

**Common Errors:**
- Element not found
- Canvas rendering failed
- PDF generation failed
- Insufficient memory (large templates)

---

## Browser Support

**Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requirements:**
- Canvas API support
- Blob API support
- Download attribute support

---

## Files

```
src/lib/export/
├── pdf-export.ts        ~180 lines
├── index.ts             exports
└── README.md            this file

src/components/export/
├── ExportPDFButton.tsx  ~135 lines
└── index.ts             exports

tests/lib/
└── pdf-export.test.ts         12 tests

tests/components/
└── export-pdf-button.test.tsx  14 tests
```

---

**Status:** Day 24 Complete ✅  
**Tests:** 26/26 passing  
**Next:** Day 25 - Image Export & Thumbnails
