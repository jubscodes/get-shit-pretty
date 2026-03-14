# Liquid Glass

> Apple's 2025 design language featuring semi-transparent surfaces with light refraction, dynamic blur, and fluid morphing — the first major Apple UI overhaul in 10 years.

Last verified: 2026-03-04

---

## Visual Characteristics

- Semi-transparent surfaces that refract and bend background content
- Dynamic light response — surfaces react to scroll, tilt, and ambient light
- Fluid shape transitions — UI elements morph between states like water
- Layered depth with specular highlights simulating real glass curvature
- Soft, organic edges — no hard borders
- Deployed across iOS 26, macOS Tahoe, iPadOS, visionOS from WWDC 2025

---

## CSS Implementation

### Core Surface

Apple's native implementation uses system-level compositing unavailable to web. This CSS approximation achieves ~80% of the visual effect:

```css
.liquid-glass {
  position: relative;
  backdrop-filter: blur(2px) saturate(180%);
  -webkit-backdrop-filter: blur(2px) saturate(180%);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  box-shadow:
    0 8px 32px rgba(31, 38, 135, 0.2),
    inset 0 4px 20px rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

/* Inner light reflection layer */
.liquid-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(1px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  opacity: 0.6;
  box-shadow:
    inset -10px -8px 0px -11px rgba(255, 255, 255, 1),
    inset 0px -9px 0px -8px rgba(255, 255, 255, 1);
  filter: blur(1px) drop-shadow(10px 4px 6px black) brightness(115%);
  pointer-events: none;
}
```

### SVG Distortion Filter (Refraction Effect)

True liquid glass distortion requires SVG filters — CSS alone cannot achieve light bending:

```html
<svg style="position: absolute; width: 0; height: 0;">
  <filter id="liquid-distortion">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008"
      numOctaves="3" seed="1" result="noise" />
    <feGaussianBlur in="noise" stdDeviation="2" result="blurred-noise" />
    <feDisplacementMap in="SourceGraphic" in2="blurred-noise"
      scale="70" xChannelSelector="R" yChannelSelector="G" />
    <feSpecularLighting in="blurred-noise" surfaceScale="3"
      specularConstant="0.75" specularExponent="20" result="specular">
      <fePointLight x="-50" y="-100" z="200" />
    </feSpecularLighting>
    <feComposite in="specular" in2="SourceGraphic" operator="in" />
  </filter>
</svg>
```

Apply: `filter: url(#liquid-distortion);`

### Animation Values
- Transition timing: `cubic-bezier(0.175, 0.885, 0.32, 2.2)` (springy/elastic)
- Morph duration: 300-500ms
- Blur transition: 200ms ease-out

---

## Implementation Guide

### Step-by-step

1. Add a visually rich background layer (gradient, image, or aurora) — liquid glass needs content to refract
2. Create the glass container with `position: relative` and `overflow: hidden`
3. Apply `backdrop-filter: blur(2px) saturate(180%)` with `-webkit-` prefix
4. Set translucent fill: `rgba(255,255,255, 0.15)` for light, `rgba(0,0,0, 0.2)` for dark
5. Add the `::after` pseudo-element for the inner light reflection
6. For refraction: include the SVG filter inline and apply via `filter: url(#liquid-distortion)`
7. Add spring-based transition for morph states

### Progressive Enhancement

```css
/* Baseline: solid frosted card */
.liquid-glass {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Layer 1: backdrop blur when supported */
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(2px) saturate(180%);
    -webkit-backdrop-filter: blur(2px) saturate(180%);
  }
}

/* Reduced transparency preference */
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.90);
    backdrop-filter: none;
  }
}
```

### Framework Notes

#### React + Tailwind CSS

```tsx
export function LiquidGlass({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-sm backdrop-saturate-[180%] border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.2),inset_0_4px_20px_rgba(255,255,255,0.3)]">
      {/* Inner reflection via absolute overlay */}
      <div className="absolute inset-0 rounded-[2rem] bg-white/10 opacity-60 blur-[1px] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

#### React Native

Liquid glass is not directly achievable in React Native. Use `@react-native-community/blur` for a simplified frosted glass approximation. The SVG distortion filter has no React Native equivalent.

#### Vanilla CSS

Use the CSS + SVG filter approach from the implementation section. Define glass properties as custom properties for theme switching.

### Common Pitfalls

1. **Nested backdrop-filters**: stacking multiple `backdrop-filter` elements causes compounding blur and severe GPU cost. Limit to one glass layer per viewport section.
2. **Missing `-webkit-` prefix**: Safari requires `-webkit-backdrop-filter`. Without it, the surface appears opaque on all Apple devices.
3. **SVG filter on mobile Safari**: `feDisplacementMap` renders inconsistently on iOS Safari (WebKit bug). Disable the SVG distortion filter on mobile and rely on backdrop-filter only.
4. **No background content**: liquid glass over a flat solid color is invisible. Always ensure a rich visual layer behind the glass.
5. **Animating blur values**: transitioning `backdrop-filter` blur triggers compositing on every frame. Animate `opacity` or `transform` instead.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Apple iOS 26 / macOS Tahoe | The canonical reference — system-wide liquid glass with real-time refraction and adaptive tint | Control Center, notifications, and app chrome all use dynamic glass |
| Apple Vision Pro UI | Liquid glass in spatial computing — panels float in 3D space with real depth-of-field blur | Floating app windows with environment showing through |
| The General Intelligence Company | High-blur glass navigation over pixel-art backdrop — demonstrates glass over illustration | Nav bar with vivid background visible through |
| Raycast (macOS app) | Launcher panels use frosted glass with subtle light reflection matching system appearance | Command palette floating over desktop content |
| Amie Calendar | Meeting cards and sidebar use liquid-glass-inspired translucency with light edge highlights | Calendar grid with frosted event cards |

---

## Accessibility

- **Contrast**: text on glass surfaces must meet WCAG 4.5:1 minimum. Increase fill opacity or add `text-shadow: 0 1px 3px rgba(0,0,0,0.3)` when contrast is insufficient
- **Reduced transparency**: respect `prefers-reduced-transparency: reduce` — replace glass with solid, opaque backgrounds
- **Reduced motion**: disable morph animations and SVG distortion for `prefers-reduced-motion: reduce`
- **Focus indicators**: glass surfaces swallow default focus rings — use `outline: 3px solid rgba(255,255,255,0.9)` with `outline-offset: 3px`

---

## Performance

- **Backdrop-filter cost**: ~15-25% more GPU than opaque surfaces. Scales with element area.
- **SVG filter cost**: `feDisplacementMap` + `feSpecularLighting` is expensive. Limit to 1-2 elements per page.
- **Avoid**: blur > 20px, nested backdrop-filters, animating blur values
- **Optimize**: use `transform: translateZ(0)` for GPU compositing, `isolation: isolate` to contain stacking context
- **Mobile**: reduce or remove SVG distortion filter entirely on mobile devices

---

## When to Use / When to Avoid

### Use When
- Navigation bars, toolbars, floating panels
- Modal overlays, action sheets
- Cards layered over rich visual backgrounds (photography, gradients, aurora)
- Apple ecosystem-aligned products seeking visual consistency

### Avoid When
- Text-heavy content areas — transparency reduces sustained reading comfort
- Data tables, forms — functionality over aesthetics
- Performance-critical mobile experiences on mid-range devices
- Flat-color backgrounds where the glass effect is invisible

---

## Design Tokens

```json
{
  "liquid-glass": {
    "fill-light": "rgba(255, 255, 255, 0.15)",
    "fill-dark": "rgba(0, 0, 0, 0.20)",
    "blur": "2px",
    "saturate": "180%",
    "border-light": "rgba(255, 255, 255, 0.8)",
    "border-dark": "rgba(255, 255, 255, 0.15)",
    "radius": "2rem",
    "shadow": "0 8px 32px rgba(31, 38, 135, 0.2)",
    "shadow-inset": "inset 0 4px 20px rgba(255, 255, 255, 0.3)",
    "reflection-opacity": "0.6",
    "transition-timing": "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    "morph-duration": "400ms",
    "blur-transition": "200ms"
  }
}
```

---

## Related

- [Glassmorphism](./glassmorphism.md) — predecessor with simpler frosted glass, no refraction
- [Aurora Gradients](./aurora-gradients.md) — ideal background layer under liquid glass
- [Dark Mode OLED](./dark-mode-oled.md) — surface token adaptation needed for dark variant
