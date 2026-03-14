# Glassmorphism

> Frosted-glass UI aesthetic using backdrop blur, controlled transparency, and hairline borders to create depth through layered translucency.

Last verified: 2026-03-04

---

## Visual Characteristics

- **Translucent fill**: backgrounds use rgba with alpha in the 0.08–0.20 range — enough to hint at depth without obscuring content
- **Backdrop blur**: the defining property; blur(10–16px) is the current production sweet spot (see CSS section for verified ranges)
- **Hairline border**: 1px solid rgba(255,255,255,0.18–0.25) traces the glass edge and is critical for legibility against dark backgrounds
- **Layered depth hierarchy**: closer cards run slightly higher opacity and brightness than recessed ones
- **Ambient shadow**: a soft, large-radius box-shadow (not sharp drop-shadow) reinforces float
- **Gradient inset highlight**: a top-left-to-bottom-right linear-gradient inside the card simulates light hitting beveled glass
- 64% of premium SaaS apps now incorporate glassmorphism elements (2025 trend analysis)

---

## CSS Implementation

### Light Variant

```css
.glass {
  /* Fill: 0.08–0.15 alpha is the reliable readable range */
  background: rgba(255, 255, 255, 0.12);

  /* Blur: 10–16px is optimal — see Performance section for rationale */
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%); /* Required: Safari */

  /* Hairline border — critical for edge definition */
  border: 1px solid rgba(255, 255, 255, 0.20);
  border-radius: 16px; /* cards: 16–20px | modals: 24–32px */

  /* Ambient shadow: large spread, low opacity */
  box-shadow:
    0 8px 32px rgba(31, 38, 135, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.40); /* top highlight */
}

.glass:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.30);
  box-shadow:
    0 16px 48px rgba(31, 38, 135, 0.30),
    inset 0 1px 0 rgba(255, 255, 255, 0.50);
}
```

### Dark Variant

```css
.glass-dark {
  /* Dark fill: 0.20–0.35 alpha needed because dark is less "glassy" at low opacity */
  background: rgba(10, 10, 20, 0.30);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);

  /* White border stays — it's the only edge definition on dark bg */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.50),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

### Blur Sweet Spot Verification

The "8–15px" figure in most tutorials is slightly low for modern dense displays. Current evidence:

| Blur Value | Effect | Verdict |
|---|---|---|
| 4–6px | Barely perceptible, looks like low opacity only | Too weak |
| 8px | Soft suggestion of glass | Minimum viable |
| 10–12px | Classic frosted glass | Reliable sweet spot |
| 16px | Rich depth, still crisp text | Strong but watch GPU cost |
| 20–24px | Heavy fog; text contrast degrades | Limit to modals only |
| 50px+ | Exponential GPU cost, no visual gain | Never use |

Revised recommendation: **10–16px** for cards and navbars; **up to 20px** acceptable for full-screen modal overlays only.

---

## Implementation Guide

### Step-by-step

1. **Prepare the canvas**: glassmorphism requires a visually rich background — gradient, photography, or aurora-style mesh. A flat color background renders the blur invisible.

2. **Set the fill**: start at `rgba(255,255,255,0.10)` for light mode. Increase alpha until text passes 4.5:1 WCAG contrast — do not rely on blur to do this work.

3. **Apply backdrop-filter**: use `blur(12px) saturate(180%)`. The `saturate` modifier prevents the blurred content from looking washed out.

4. **Add the hairline border**: `1px solid rgba(255,255,255,0.20)`. This is not decorative — it defines the glass edge. Without it the card dissolves into the background.

5. **Layer the shadows**: use a large-spread, low-opacity ambient shadow rather than a sharp drop shadow.

6. **Add inset highlight**: `inset 0 1px 0 rgba(255,255,255,0.40)` inside box-shadow simulates light hitting the top edge.

7. **Test text contrast**: measure actual contrast ratio with a tool. Do not eyeball it. Use a text-shadow or increase fill alpha if needed.

### Progressive Enhancement

```css
/* Baseline: solid card for browsers without backdrop-filter support */
.glass {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.30);
  border-radius: 16px;
}

/* Enhanced: backdrop-filter when supported */
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
  }
}

/* Reduced transparency: respect OS-level accessibility preference */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

### Framework Notes

#### React + Tailwind CSS

Tailwind's `backdrop-blur-*` scale maps directly to production values:

| Class | Blur | Use Case |
|---|---|---|
| `backdrop-blur-sm` | 8px | Subtle overlays |
| `backdrop-blur-md` | 12px | Cards, navbars (recommended default) |
| `backdrop-blur-lg` | 16px | Modals, drawers |
| `backdrop-blur-xl` | 24px | Full-screen overlays only |

```tsx
// Glass card component — React + Tailwind
export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        // Translucent fill
        "bg-white/10",
        // Backdrop blur — md is the safe default
        "backdrop-blur-md",
        // Saturate avoids washed-out look
        "backdrop-saturate-150",
        // Hairline border
        "border border-white/20",
        // Corners
        "rounded-2xl",
        // Ambient shadow
        "shadow-[0_8px_32px_rgba(31,38,135,0.20)]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// Dark variant — add to className or wrap in dark: variants
// "dark:bg-black/30 dark:border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.50)]"
```

For the `@supports` fallback in Tailwind, add this to your global CSS — Tailwind utilities cannot express `@supports` conditions directly:

```css
@supports not (backdrop-filter: blur(1px)) {
  .backdrop-blur-md,
  .backdrop-blur-lg,
  .backdrop-blur-xl {
    background-color: rgba(255, 255, 255, 0.85) !important;
  }
}
```

#### React Native

Use `@react-native-community/blur` — the only production-stable blur library as of 2025.

```tsx
import { BlurView } from "@react-native-community/blur";

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView
      style={{
        borderRadius: 16,
        overflow: "hidden",         // Required: clips blur to border radius
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
      }}
      blurType="light"              // "light" | "dark" | "xlight" | "prominent"
      blurAmount={10}               // Maps to blur(px) — 8–16 recommended
      reducedTransparencyFallbackColor="rgba(255,255,255,0.85)"
    >
      {children}
    </BlurView>
  );
}
```

Note: `BlurView` on Android uses a software renderer fallback — blur values above 16 cause visible lag on mid-range devices. Clamp to 10 for Android targets.

#### Vanilla CSS

```css
:root {
  --glass-fill-light: rgba(255, 255, 255, 0.12);
  --glass-fill-dark: rgba(10, 10, 20, 0.30);
  --glass-blur: 12px;
  --glass-saturate: 180%;
  --glass-border-light: rgba(255, 255, 255, 0.20);
  --glass-border-dark: rgba(255, 255, 255, 0.08);
  --glass-radius-card: 16px;
  --glass-radius-modal: 28px;
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.20);
}

.glass {
  background: var(--glass-fill-light);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--glass-radius-card);
  box-shadow: var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.40);
}

@media (prefers-color-scheme: dark) {
  .glass {
    background: var(--glass-fill-dark);
    border-color: var(--glass-border-dark);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
}
```

### Common Pitfalls

1. **Glass on a flat background**: the blur effect has nothing to blur — the card looks like a faded rectangle. Always require a visually complex background layer.

2. **Omitting `-webkit-backdrop-filter`**: Safari requires the prefix. Without it, glass cards appear as solid opaque blocks on iOS and macOS Safari.

3. **Relying on blur for text legibility**: blur softens backgrounds but does not guarantee WCAG contrast. Always verify actual contrast ratio and increase fill alpha or add `text-shadow` if needed.

4. **Animating `backdrop-filter`**: transitioning blur values triggers layer compositing on every frame. If you must animate, animate `opacity` or `transform` instead — not the blur value itself.

5. **Too many glass elements per viewport**: performance degrades noticeably on mobile above 5 simultaneous glass elements. On mid-range Android, 10+ elements causes measurable frame drops.

6. **Missing `overflow: hidden` on bordered containers**: in some browsers, `backdrop-filter` bleeds outside `border-radius` without explicit overflow clipping. Add `overflow: hidden` to the container.

---

## Examples Gallery

### 1. Nike After Dark Tour (Website)
Campaign site for Nike's global after-dark running events. Glassmorphic panels separate navigational and decorative layers — CTA chips sit on frosted glass so they read over photo backgrounds without obscuring the imagery. Route distance markers use the same treatment. Demonstrates glassmorphism as functional information hierarchy, not decoration.

### 2. AnyDistance (iOS Training App)
Uses heavy blur and higher opacity glass containers for the workout selector and Start button — contexts where legibility is non-negotiable. Collectibles and Stats sections layer glass cards over gradient backgrounds. The depth stacking is explicit: top-layer cards are slightly brighter and less opaque than recessed ones, which creates a tactile sense of card height.

### 3. The General Intelligence Company (Homepage)
Glass navigation bar over a vivid pixel-art skyline backdrop. Uses high blur (estimated 16–20px) with low opacity (~0.08–0.10) so the background illustration remains a visual feature rather than being obliterated. Demonstrates that glassmorphism can coexist with illustration-heavy art direction.

### 4. Henning Tillmann — Glassmorphism Dark & Light Theme (Awwwards Inspiration)
Designer showcase featured on Awwwards demonstrating glassmorphism adapted across both color schemes using CSS custom properties for theme switching. Cards, modals, buttons, and form inputs all carry the glass treatment with consistent variable-driven tokens. The Awwwards community cited it as a reference implementation for production-grade theming.

### 5. Apple macOS / iOS (System UI)
The canonical reference. macOS Sonoma and iOS 18 use blur(20px) with adaptive tint values that read the luminance of background content and adjust fill opacity accordingly — lighter fill over light content, darker fill over dark content. Apple's 2025 Liquid Glass evolution adds physically accurate lensing and real-time refraction, extending glassmorphism into a fully dynamic material. All web implementations are approximations of this system-level capability.

---

## Accessibility

### Contrast Requirements

WCAG 2.2 AA minimums apply regardless of the glass aesthetic:
- Normal text (under 18pt / 14pt bold): **4.5:1** contrast ratio minimum
- Large text and UI component boundaries: **3:1** minimum

Glass surfaces introduce a dynamic background that changes as the user scrolls or as content shifts behind the panel. This means you cannot measure contrast against a static color — measure against the lightest plausible background value that will appear behind the element.

### Practical Strategies

```css
/* Strategy 1: text-shadow for subtle lift on variable backgrounds */
.glass p,
.glass label {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

/* Strategy 2: semi-opaque text backing for critical readable zones */
.glass .text-zone {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 4px 8px;
}

/* Strategy 3: increase fill alpha until text is readable — preferred over text-shadow */
/* Start at 0.10, step up by 0.05 until contrast passes */

/* Focus indicator — glass surfaces swallow default focus rings */
.glass :focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.90);
  outline-offset: 2px;
}
```

### Reduced Transparency

macOS and iOS expose a "Reduce Transparency" accessibility toggle. The CSS media query for this is `prefers-reduced-transparency: reduce`. As of 2025, browser support is limited but growing — include it alongside `@supports` fallbacks:

```css
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: rgba(255, 255, 255, 0.90);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

---

## Performance

### Benchmarks (2025 data)

| Scenario | Impact |
|---|---|
| 1–3 glass elements | Negligible on modern desktop and mobile |
| 4–5 glass elements | Slight GPU overhead, no visible lag |
| 6–9 glass elements | Measurable on mid-range Android (12–15fps drop) |
| 10+ glass elements | Noticeable lag on mid-range phones |
| Animated blur value | Compositing hit on every frame — avoid |
| blur > 20px | Exponential GPU cost with diminishing visual return |

Static `backdrop-filter` effects consume approximately 15–25% more GPU resources than equivalent opaque surfaces. The cost scales with element area, not count alone — a full-viewport glass panel is more expensive than 10 small cards.

### Optimization Techniques

```css
/* Hardware acceleration — create a GPU compositing layer */
.glass {
  transform: translateZ(0);           /* Force GPU layer */
  will-change: transform;             /* Hint — use sparingly, not globally */
  isolation: isolate;                 /* Contain compositing context */
}

/* Mobile: reduce blur for low-powered devices */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(8px) saturate(150%);
    -webkit-backdrop-filter: blur(8px) saturate(150%);
  }
}

/* Respect reduced motion — avoid blur animation */
@media (prefers-reduced-motion: reduce) {
  .glass {
    transition: none;
  }
}
```

Do not apply `will-change: backdrop-filter` — it creates a stacking context that can break z-index layering in complex UIs. Use `will-change: transform` instead.

---

## When to Use / When to Avoid

### Use When

- Cards or panels float over a rich visual background (photography, gradient, illustration)
- Navigation bars and toolbars that need to feel lightweight while remaining always-visible
- Modal dialogs — blur reinforces focus by softening the background
- Dashboard widgets where depth hierarchy communicates data relationships
- Premium or luxury brand contexts where perceived quality justifies the GPU cost

### Avoid When

- The background is a flat color — the effect is invisible and the extra CSS is noise
- Text-heavy content (articles, documentation, forms) — transparency conflicts with sustained reading
- Performance-critical mobile experiences targeting low-end hardware
- High-density information displays where background bleed adds cognitive load
- Contexts where `prefers-reduced-transparency` users make up a significant portion of the audience

---

## Design Tokens

```json
{
  "glass": {
    "light": {
      "fill": "rgba(255, 255, 255, 0.12)",
      "fill-hover": "rgba(255, 255, 255, 0.18)",
      "border": "rgba(255, 255, 255, 0.20)",
      "border-hover": "rgba(255, 255, 255, 0.30)",
      "blur": "12px",
      "saturate": "180%",
      "shadow": "0 8px 32px rgba(31, 38, 135, 0.20)",
      "inset-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.40)"
    },
    "dark": {
      "fill": "rgba(10, 10, 20, 0.30)",
      "fill-hover": "rgba(10, 10, 20, 0.40)",
      "border": "rgba(255, 255, 255, 0.08)",
      "border-hover": "rgba(255, 255, 255, 0.14)",
      "blur": "12px",
      "saturate": "150%",
      "shadow": "0 8px 32px rgba(0, 0, 0, 0.50)",
      "inset-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    },
    "radius": {
      "card": "16px",
      "card-large": "20px",
      "modal": "28px",
      "pill": "999px"
    },
    "blur-scale": {
      "subtle": "8px",
      "default": "12px",
      "heavy": "16px",
      "modal": "20px"
    },
    "fallback": {
      "light": "rgba(255, 255, 255, 0.90)",
      "dark": "rgba(20, 20, 30, 0.92)"
    }
  }
}
```

---

## Related

- [Liquid Glass](./liquid-glass.md) — Apple's 2025 evolution: adds physically accurate lensing, refraction, and adaptive tint on top of the glassmorphism foundation
- [Aurora Gradients](./aurora-gradients.md) — the canonical background pairing; provides the visual richness that makes backdrop blur meaningful
- [Dark Mode OLED](./dark-mode-oled.md) — dark glassmorphism variant; OLED black backgrounds make glass panels pop without any ambient glow
- [Neumorphism](./neumorphism.md) — the competing depth metaphor; softer but requires monochrome backgrounds; often combined with glass for hybrid cards
