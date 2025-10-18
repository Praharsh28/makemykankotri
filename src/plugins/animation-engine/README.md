# Animation Engine Plugin

**Status:** Week 3 Complete ✅ (Days 14-19)  
**Version:** 1.0.0  
**Tests:** 83/83 passing  
**Production Ready:** Yes

## Overview

Complete animation system with picker UI, canvas rendering (Konva), and timeline animations (GSAP). Includes visual animation library, live preview, and settings controls.

## Day 14: Konva Setup ✅
## Day 15: GSAP Integration ✅
## Day 16: Animation Picker UI ✅

### ParticleLayer Component

Physics-based particle system with gravity and collision detection.

```typescript
import { ParticleLayer } from '@/plugins/animation-engine';

<ParticleLayer
  count={40}
  width={800}
  height={600}
  gravity={0.1}
  velocityRange={{ min: -3, max: 3 }}
  color="#F5B800"
  sizeRange={{ min: 2, max: 6 }}
  opacity={0.8}
  speed={1}
  paused={false}
  onStart={() => console.log('Animation started')}
  onStop={() => console.log('Animation stopped')}
/>
```

### Features

**Physics:**
- Gravity simulation
- Velocity-based movement
- Wall collision with bounce
- Configurable parameters

**Appearance:**
- Custom colors (design system compliant)
- Size range (min/max radius)
- Opacity control
- Responsive canvas

**Performance:**
- RequestAnimationFrame for smooth 60fps
- Efficient particle updates
- Cleanup on unmount
- Pause/resume capability

**Customization:**
- Particle count (0-100+)
- Custom dimensions or auto-resize
- Adjustable gravity
- Speed multiplier
- Velocity range

### Props

```typescript
interface ParticleLayerProps {
  count: number;                              // Number of particles
  width?: number;                             // Canvas width (auto if not set)
  height?: number;                            // Canvas height (auto if not set)
  gravity?: number;                           // Gravity force (default: 0.1)
  velocityRange?: { min: number; max: number }; // Initial velocity (default: -3 to 3)
  color?: string;                             // Particle color (default: #F5B800)
  sizeRange?: { min: number; max: number };   // Particle radius (default: 2-6)
  opacity?: number;                           // Particle opacity (default: 0.8)
  paused?: boolean;                           // Pause animation (default: false)
  speed?: number;                             // Speed multiplier (default: 1)
  onStart?: () => void;                       // Called when animation starts
  onStop?: () => void;                        // Called on unmount
}
```

### Examples

**Basic Usage:**
```typescript
<ParticleLayer count={40} />
```

**Custom Colors:**
```typescript
<ParticleLayer
  count={50}
  color="#F5B800"  // Gold
/>
```

**Heavy Gravity:**
```typescript
<ParticleLayer
  count={30}
  gravity={0.5}
  velocityRange={{ min: -5, max: 5 }}
/>
```

**Slow Motion:**
```typescript
<ParticleLayer
  count={40}
  speed={0.5}
  gravity={0.05}
/>
```

**Paused State:**
```typescript
const [paused, setPaused] = useState(false);

<ParticleLayer
  count={40}
  paused={paused}
/>
<button onClick={() => setPaused(!paused)}>
  {paused ? 'Resume' : 'Pause'}
</button>
```

## Day 15: GSAP Integration ✅

### TimelineAnimation Component

GSAP timeline wrapper for React with full animation control.

```typescript
import { TimelineAnimation } from '@/plugins/animation-engine';

<TimelineAnimation
  duration={1}
  delay={0}
  stagger={0.2}
  ease="power3.out"
  paused={false}
  reverse={false}
  animateFrom={{ opacity: 0, y: 50 }}
  onComplete={() => console.log('Animation complete!')}
>
  <div>Animated Element 1</div>
  <div>Animated Element 2</div>
  <div>Animated Element 3</div>
</TimelineAnimation>
```

**Features:**
- Full GSAP timeline control
- Custom easing functions (power3, bounce, elastic)
- Stagger animations for multiple children
- Play/pause/reverse control
- Custom animation properties
- onComplete callback

**Props:**
```typescript
interface TimelineAnimationProps {
  children: React.ReactNode;
  duration?: number;              // Animation duration (default: 1s)
  delay?: number;                 // Delay before animation (default: 0s)
  stagger?: number;               // Stagger delay between children (default: 0s)
  ease?: string;                  // GSAP easing function (default: 'power3.out')
  paused?: boolean;               // Start paused (default: false)
  reverse?: boolean;              // Play in reverse (default: false)
  animateFrom?: gsap.TweenVars;   // Custom animation properties
  onComplete?: () => void;        // Callback when animation completes
}
```

**Easing Examples:**
```typescript
// Smooth and natural
<TimelineAnimation ease="power3.out">

// Bouncy
<TimelineAnimation ease="bounce.out">

// Elastic
<TimelineAnimation ease="elastic.out">

// Linear
<TimelineAnimation ease="none">
```

### CinematicReveal Component

Fade in + slide up effect with automatic stagger.

```typescript
import { CinematicReveal } from '@/plugins/animation-engine';

<CinematicReveal
  duration={1.2}
  delay={0}
  stagger={0.2}
  ease="power3.out"
>
  <h1>Title</h1>
  <p>Subtitle</p>
  <button>Call to Action</button>
</CinematicReveal>
```

**Features:**
- Automatic fade in (opacity: 0 → 1)
- Automatic slide up (y: 50 → 0)
- Stagger for cinematic effect
- Power3 easing by default
- Perfect for hero sections

**Props:**
```typescript
interface CinematicRevealProps {
  children: React.ReactNode;
  duration?: number;    // Animation duration (default: 1.2s)
  delay?: number;       // Delay before animation (default: 0s)
  stagger?: number;     // Stagger delay (default: 0.2s)
  ease?: string;        // GSAP easing (default: 'power3.out')
}
```

**Use Cases:**
- Hero section reveals
- Page transitions
- Content unveiling
- Sequential animations

## Day 16: Animation Picker UI ✅

### AnimationLibrary Component

Visual library to browse and select animations.

```typescript
import { AnimationLibrary } from '@/plugins/animation-engine';

<AnimationLibrary
  onSelect={(animation) => console.log('Selected:', animation)}
  selectedAnimation={{ type: 'timeline', props: {} }}
  category="transitions"
  showDetails
  columns={3}
  searchable
/>
```

**Features:**
- Grid layout with 2/3/4 columns
- Filter by category
- Search functionality
- Animation descriptions and icons
- Highlights selected animation
- Configuration details display
- Keyboard navigation
- ARIA compliant

**Props:**
```typescript
interface AnimationLibraryProps {
  onSelect: (animation: AnimationType) => void;
  selectedAnimation?: AnimationType;
  category?: string;           // Filter by category
  showDetails?: boolean;       // Show configuration details
  columns?: 2 | 3 | 4;        // Grid columns
  searchable?: boolean;        // Enable search
}
```

**Available Animations:**
- Particle Layer (Canvas Effects)
- Timeline Animation (Transitions)
- Cinematic Reveal (Transitions)

### AnimationPreview Component

Live preview with playback controls and settings editor.

```typescript
import { AnimationPreview } from '@/plugins/animation-engine';

<AnimationPreview
  animation={{ type: 'cinematic', props: { duration: 1.2, stagger: 0.2 } }}
  showSettings
  onSettingsChange={(newProps) => console.log('Updated:', newProps)}
/>
```

**Features:**
- Live animation preview
- Play/pause/restart controls
- Settings panel with real-time editing
- Duration, easing, and stagger controls
- Works with all animation types
- Instant updates on settings change

**Props:**
```typescript
interface AnimationPreviewProps {
  animation: AnimationType;
  showSettings?: boolean;
  onSettingsChange?: (props: Record<string, unknown>) => void;
}
```

**Settings Support:**
- Particle: count, gravity, colors
- Timeline: duration, easing, stagger
- Cinematic: duration, easing, stagger

**Use Cases:**
- Template editor animation picker
- Animation configuration UI
- Preview before applying to elements
- User-friendly animation selection

## Testing

83 comprehensive tests covering:

**ParticleLayer (21 tests):**
- Feature flag integration
- Rendering (Stage, Layer, particles)
- Particle count handling
- Physics configuration
- Appearance customization
- Animation control (pause/resume/speed)
- Lifecycle management
- Integration callbacks

**TimelineAnimation (18 tests):**
- Timeline creation and configuration
- Easing functions (power3, bounce, elastic)
- Stagger animations
- Animation control (play/pause/reverse)
- Custom animation properties
- Lifecycle and cleanup
- onComplete callback

**CinematicReveal (15 tests):**
- Fade in effect
- Slide up effect
- Stagger effect
- Custom duration/delay/easing
- Lifecycle and cleanup

**AnimationLibrary (15 tests):**
- Library UI rendering
- Animation selection and highlighting
- Category filtering
- Search functionality
- Grid layout (2/3/4 columns)
- Configuration details display
- Keyboard navigation and accessibility
- Empty state handling

**AnimationPreview (14 tests):**
- Preview rendering
- Play/pause/restart controls
- Settings panel
- Live preview updates
- Animation type switching
- Settings changes
- Accessibility

Run tests:
```bash
npm test -- animation
# Or specific components:
npm test -- particle-layer timeline-animation cinematic-reveal animation-library animation-preview
```

## Architecture Compliance

✅ **Plugin Isolation** - No cross-plugin imports  
✅ **Event Bus** - Ready for event integration  
✅ **Feature Flag** - 'animation-engine' flag checked  
✅ **TypeScript Strict** - No `any` types  
✅ **Tests** - 83/83 passing (100%)  
✅ **Design System** - Uses gold (#F5B800) color  
✅ **GSAP Integration** - Properly wrapped for React  
✅ **Cleanup** - All timelines cleaned up on unmount  
✅ **UI Components** - AnimationLibrary & AnimationPreview  
✅ **Accessibility** - ARIA labels, keyboard navigation  

## Technical Details

**Canvas Rendering:**
- Uses react-konva for React integration
- Stage → Layer → Circle components
- RequestAnimationFrame for smooth updates

**Physics Simulation:**
- Position: (x, y) coordinates
- Velocity: (vx, vy) components
- Gravity: Constant downward force
- Collision: Bounce with energy loss (0.8x)

**GSAP Timeline System:**
- React wrapper for GSAP timelines
- Automatic cleanup on unmount
- Support for all GSAP easing functions
- Stagger for sequential animations
- Full playback control (play/pause/reverse)

**State Management:**
- useRef for particles and timelines (no re-render)
- useState for dimensions (responsive)
- useEffect for animation initialization
- Proper cleanup on unmount

## Known Limitations

1. **2D Only** - No z-axis depth
2. **Simple Physics** - Basic gravity/collision
3. **No Interaction** - Particles don't interact with each other
4. **Fixed Bounds** - Canvas dimensions

## Future Enhancements

1. **Particle Trails** - Motion blur effect
2. **Mouse Interaction** - Attract/repel particles
3. **3D Depth** - Parallax layers
4. **Particle Types** - Stars, confetti, snow
5. **Performance Modes** - Low/Med/High quality

---

**Status:** Day 14-16 Complete - Animation Engine COMPLETE ✅  
**Next:** Performance & Polish  
**Tests:** 83/83 passing (386 total project)  
**Components:** 5 (ParticleLayer, TimelineAnimation, CinematicReveal, AnimationLibrary, AnimationPreview)
