# Image Export Utilities

**Status:** Day 25 Complete ✅  
**Version:** 1.0.0  
**Tests:** 37/37 passing

## Overview

Complete image export system for converting templates to PNG/JPEG and generating optimized thumbnails.

---

## Day 25: Image Export & Thumbnails ✅

### Image Export Utilities

**Features:**
- Export to PNG with transparency support
- Export to JPEG with compression
- Generate thumbnails with custom dimensions
- Optimize images to target file size
- Generate image blobs for upload
- Configurable quality and scale
- Maintain aspect ratios

**Dependencies:**
- `html2canvas`: Convert HTML to canvas (already installed for PDF export)

---

## API Reference

### exportToPNG()

Export element to PNG image with transparency support.

```typescript
import { exportToPNG } from '@/lib/export';

await exportToPNG('template-preview', {
  filename: 'wedding-invitation.png',
  quality: 1.0,
  scale: 2,
  backgroundColor: '#ffffff',
});
```

**Parameters:**
- `elementId` (string): DOM element ID to export
- `options` (ImageExportOptions):
  - `filename?` (string): Output filename (default: 'kankotri.png')
  - `quality?` (number): Image quality 0-1 (default: 1.0)
  - `scale?` (number): Rendering scale (default: 2)
  - `backgroundColor?` (string): Background color (default: '#ffffff')

**Returns:** `Promise<void>`

**Use Cases:**
- High-quality prints
- Transparent backgrounds
- Lossless export

---

### exportToJPEG()

Export element to JPEG image with compression.

```typescript
import { exportToJPEG } from '@/lib/export';

await exportToJPEG('template-preview', {
  filename: 'invitation.jpg',
  quality: 0.92,
  scale: 2,
});
```

**Parameters:**
- `elementId` (string): DOM element ID
- `options` (ImageExportOptions): Same as PNG

**Returns:** `Promise<void>`

**Use Cases:**
- Smaller file sizes
- Web sharing
- Email attachments

---

### generateThumbnail()

Generate thumbnail data URL for preview.

```typescript
import { generateThumbnail } from '@/lib/export';

const dataUrl = await generateThumbnail('template-preview', {
  width: 400,
  height: 600,
  maintainAspectRatio: true,
  quality: 0.8,
  format: 'jpeg',
});

// Use in img tag
<img src={dataUrl} alt="Thumbnail" />
```

**Parameters:**
- `elementId` (string): DOM element ID
- `options` (ThumbnailOptions):
  - `width?` (number): Thumbnail width (default: 400)
  - `height?` (number): Thumbnail height (default: 600)
  - `maintainAspectRatio?` (boolean): Keep aspect ratio (default: true)
  - `quality?` (number): Image quality 0-1 (default: 0.8)
  - `format?` ('png' | 'jpeg'): Output format (default: 'jpeg')

**Returns:** `Promise<string>` - Data URL

**Use Cases:**
- Template previews
- Gallery thumbnails
- Quick previews
- Card images

---

### downloadThumbnail()

Generate and download thumbnail.

```typescript
import { downloadThumbnail } from '@/lib/export';

await downloadThumbnail('template-preview', 'thumb.jpg', {
  width: 300,
  height: 450,
  quality: 0.75,
});
```

**Parameters:**
- `elementId` (string): DOM element ID
- `filename?` (string): Output filename (default: 'thumbnail.jpg')
- `options?` (ThumbnailOptions): Thumbnail options

**Returns:** `Promise<void>`

---

### generateImageBlob()

Generate image blob without downloading.

```typescript
import { generateImageBlob } from '@/lib/export';

const blob = await generateImageBlob('template-preview', {
  format: 'jpeg',
  quality: 0.9,
  scale: 2,
});

// Upload to server
const formData = new FormData();
formData.append('image', blob, 'invitation.jpg');
await fetch('/api/upload', { method: 'POST', body: formData });
```

**Parameters:**
- `elementId` (string): DOM element ID
- `options?` (ImageExportOptions): Export options

**Returns:** `Promise<Blob>`

**Use Cases:**
- Server uploads
- Cloud storage
- Email attachments via API
- Custom processing

---

### optimizeImage()

Automatically optimize image to target file size.

```typescript
import { optimizeImage } from '@/lib/export';

// Optimize to ~500KB
const blob = await optimizeImage('template-preview', 500);

console.log(`Optimized size: ${blob.size / 1024}KB`);
```

**Parameters:**
- `elementId` (string): DOM element ID
- `targetSizeKB?` (number): Target size in KB (default: 500)

**Returns:** `Promise<Blob>`

**Algorithm:**
1. Start with quality 0.9, scale 2
2. If too large, reduce quality by 0.1
3. If quality < 0.5, reduce scale
4. Repeat until target size reached

**Use Cases:**
- Web optimization
- Mobile uploads
- Bandwidth limits
- Storage constraints

---

## ExportImageButton Component

Ready-to-use button for image export.

### Basic Usage

```typescript
import { ExportImageButton } from '@/components/export';

<ExportImageButton
  elementId="template-preview"
  format="png"
  filename="invitation.png"
>
  Download PNG
</ExportImageButton>
```

### Props

```typescript
interface ExportImageButtonProps {
  elementId: string;              // Required: Element ID
  filename?: string;              // Optional: Output filename
  format?: 'png' | 'jpeg';       // Optional: Image format (default: 'png')
  options?: ImageExportOptions;   // Optional: Export options
  variant?: 'primary' | 'secondary' | 'outline';  // Button style
  size?: 'sm' | 'base' | 'lg';   // Button size
  children?: React.ReactNode;     // Button text
  onSuccess?: () => void;         // Success callback
  onError?: (error: Error) => void;  // Error callback
}
```

### Advanced Examples

```typescript
// PNG export with high quality
<ExportImageButton
  elementId="preview"
  format="png"
  filename="invitation-hq.png"
  options={{ quality: 1.0, scale: 3 }}
/>

// JPEG export for web
<ExportImageButton
  elementId="preview"
  format="jpeg"
  filename="invitation-web.jpg"
  options={{ quality: 0.85, scale: 2 }}
  variant="secondary"
/>

// With callbacks
<ExportImageButton
  elementId="preview"
  format="png"
  onSuccess={() => console.log('Downloaded!')}
  onError={(err) => console.error('Failed:', err)}
/>

// Custom styling
<ExportImageButton
  elementId="preview"
  format="jpeg"
  variant="outline"
  size="lg"
>
  Save as JPEG
</ExportImageButton>
```

---

## Testing

37 comprehensive tests covering:

**Image Export Utilities (20 tests):**
- exportToPNG with default options
- Custom filename for PNG
- PNG element not found error
- Custom options for PNG
- exportToJPEG with defaults
- Custom JPEG quality
- JPEG element not found
- generateThumbnail with defaults
- Custom thumbnail dimensions
- Aspect ratio maintenance
- PNG thumbnail format
- Thumbnail element not found
- downloadThumbnail functionality
- Default thumbnail filename
- generateImageBlob for PNG
- generateImageBlob for JPEG
- Custom blob quality
- Blob element not found
- optimizeImage to target size
- Optimize element not found

**ExportImageButton (17 tests):**
- Button rendering with PNG
- Button rendering with JPEG
- Custom children
- exportToPNG call
- exportToJPEG call
- Loading state
- Success callback
- Error display
- Error callback
- Primary variant styles
- Secondary variant styles
- Outline variant styles
- Size styles
- Custom options passing
- Default PNG filename
- Default JPEG filename
- Error clearing on retry

Run tests:
```bash
npm test -- image-export
```

---

## Format Comparison

| Feature | PNG | JPEG |
|---------|-----|------|
| Transparency | ✅ Yes | ❌ No |
| Compression | Lossless | Lossy |
| File Size | Larger | Smaller |
| Quality | Perfect | Good |
| Best For | Prints, logos | Web, photos |
| Typical Size | 2-5MB | 200-800KB |

---

## Performance Tips

**Optimization Strategies:**
1. **Use JPEG for web** - 60-80% smaller files
2. **Reduce scale** - scale=1 for thumbnails
3. **Lower quality** - 0.85 is visually identical
4. **Optimize images** - Use optimizeImage() for uploads
5. **Generate thumbnails** - Pre-generate for faster loading

**Typical Export Times:**
- PNG (scale=2): ~2-3 seconds
- JPEG (scale=2): ~1-2 seconds
- Thumbnail: ~500ms
- Optimize: ~3-5 seconds (iterative)

---

## Usage Patterns

### Template Gallery Thumbnails
```typescript
// Generate thumbnail on template save
const thumbnail = await generateThumbnail('template-preview', {
  width: 400,
  height: 600,
  format: 'jpeg',
  quality: 0.75,
});

// Save to database
await supabase
  .from('templates')
  .update({ thumbnail })
  .eq('id', templateId);
```

### User Download Options
```typescript
<div className="flex gap-2">
  <ExportImageButton
    elementId="preview"
    format="png"
    filename="invitation.png"
  >
    PNG (High Quality)
  </ExportImageButton>
  
  <ExportImageButton
    elementId="preview"
    format="jpeg"
    filename="invitation.jpg"
    variant="secondary"
  >
    JPEG (Smaller Size)
  </ExportImageButton>
</div>
```

### Cloud Upload
```typescript
async function uploadToCloud() {
  // Generate optimized image
  const blob = await optimizeImage('preview', 500);
  
  // Upload to S3/Cloud Storage
  const formData = new FormData();
  formData.append('file', blob, 'invitation.jpg');
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
}
```

---

## Browser Support

**Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requirements:**
- Canvas API
- Blob API
- Canvas.toBlob()
- URL.createObjectURL()

---

## Files

```
src/lib/export/
├── image-export.ts        ~300 lines
├── pdf-export.ts          ~180 lines
├── index.ts               exports
└── IMAGE_EXPORT_README.md  this file

src/components/export/
├── ExportImageButton.tsx  ~150 lines
├── ExportPDFButton.tsx    ~135 lines
└── index.ts               exports

tests/lib/
├── image-export.test.ts         20 tests
└── pdf-export.test.ts           12 tests

tests/components/
├── export-image-button.test.tsx  17 tests
└── export-pdf-button.test.tsx    14 tests
```

---

**Status:** Day 25 Complete ✅  
**Tests:** 37/37 passing  
**Next:** Days 26-27 - Final Polish & Testing
