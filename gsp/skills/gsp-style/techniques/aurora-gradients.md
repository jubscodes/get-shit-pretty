# Aurora / Mesh Gradients

> Organic, multi-directional color blends created by layering radial gradients — painterly, atmospheric backgrounds inspired by the northern lights.

Last verified: 2026-03-04

---

## Visual Characteristics

- Multiple layered radial gradients creating organic, flowing color
- Painterly quality that goes beyond simple linear/radial gradients
- Often combined with subtle grain texture for tactile quality
- Works best on dark backgrounds (`#0a0a1a` to `#1a1a2e`) where colors pop
- Slow, breathing animation creates a living, atmospheric feel
- 3-5 color points at varying opacities produce the most organic results

---

## CSS Implementation

### Aurora Gradient

```css
.aurora-bg {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(120, 80, 255, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 100, 200, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(80, 200, 255, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 30%, rgba(100, 255, 180, 0.2) 0%, transparent 50%);
  background-color: #0a0a1a;
}

/* Animated aurora */
.aurora-animated {
  background-size: 200% 200%;
  animation: aurora-shift 15s ease-in-out infinite alternate;
}

@keyframes aurora-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Mesh Gradient (Multi-Point)

```css
.mesh-gradient {
  background:
    radial-gradient(at 0% 0%, #7c3aed 0%, transparent 50%),
    radial-gradient(at 100% 0%, #06b6d4 0%, transparent 50%),
    radial-gradient(at 100% 100%, #f43f5e 0%, transparent 50%),
    radial-gradient(at 0% 100%, #eab308 0%, transparent 50%);
  background-color: #1a1a2e;
}
```

### Grain Texture Overlay

```css
.aurora-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

### Design Rules
- Use 3-5 color points for organic feel
- Keep opacity 0.2-0.4 per layer to avoid muddy blends
- Grain texture opacity: 0.02-0.05 for subtle tactile quality
- Animation: slow (10-20s), `ease-in-out`, subtle position shift
- Dark backgrounds: `#0a0a1a` to `#1a1a2e` for maximum color vibrancy

---

## Implementation Guide

### Step-by-step

1. Set a dark base color (`background-color: #0a0a1a`)
2. Layer 3-5 `radial-gradient` declarations with `ellipse` shape at different positions
3. Use rgba colors at 0.2-0.4 opacity per gradient layer — too high and colors become muddy
4. Set each gradient to fade from color to `transparent` at 50%
5. For animation: set `background-size: 200% 200%` and animate `background-position`
6. Add grain overlay via `::after` pseudo-element with SVG noise at 0.03 opacity
7. Ensure the parent has `position: relative` for the grain overlay positioning

### Progressive Enhancement

```css
/* Baseline: solid dark background */
.aurora-bg {
  background-color: #0a0a1a;
}

/* Enhanced: radial gradients (supported everywhere, but expensive) */
@media (prefers-reduced-motion: no-preference) {
  .aurora-animated {
    background-size: 200% 200%;
    animation: aurora-shift 15s ease-in-out infinite alternate;
  }
}

/* Reduced motion: static gradient, no animation */
@media (prefers-reduced-motion: reduce) {
  .aurora-animated {
    animation: none;
    background-size: 100% 100%;
  }
}
```

### Framework Notes

#### React + Tailwind CSS

```tsx
export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a1a]">
      {/* Gradient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(120,80,255,0.4)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,100,200,0.3)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,rgba(80,200,255,0.3)_0%,transparent_50%)]" />
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url(...)' }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

Alternative: use Tailwind's `bg-gradient-*` utilities for simpler linear gradients, but layered radials require arbitrary values `bg-[radial-gradient(...)]`.

#### React Native

Use `expo-linear-gradient` or `react-native-linear-gradient` for basic gradient backgrounds. True multi-point radial mesh gradients are not natively supported — use `react-native-skia` for custom shader-based aurora effects.

#### Vanilla CSS

The CSS implementation above is pure vanilla. Use CSS `@property` for smoother gradient animations:

```css
@property --aurora-x {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}
```

### Common Pitfalls

1. **Too many gradient layers**: beyond 5 layers the colors become muddy. Use 3-5 for organic feel.
2. **High opacity gradients**: above 0.4 opacity per layer causes hard color boundaries instead of blending. Keep at 0.2-0.4.
3. **Light backgrounds**: aurora gradients lose their vibrancy on light backgrounds. Use dark base colors only.
4. **Fast animation**: animation speed below 10s feels frantic. Keep at 15-20s for a breathing, natural feel.
5. **Missing grain**: without subtle grain texture, the gradients look digital/synthetic. Even 0.02 opacity grain adds significant tactile quality.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Stripe | Signature mesh gradients on hero sections — smooth, premium, continuously animated | Landing page with flowing purple-blue-pink gradient |
| Linear | Dark aurora background with gradient borders on glass cards | Homepage with atmospheric gradient behind feature grid |
| Vercel | Subtle aurora accents behind dark UI — glow effects on borders and highlights | Dashboard with gradient glow accents |
| Raycast | Aurora-style gradients as app background with glassmorphism overlay panels | Command palette floating over atmospheric gradient |
| Awwwards — Lusion Lab | Award-winning 3D aurora with WebGL-enhanced gradients and particle effects | Immersive gradient background with interactive depth |

---

## Accessibility

- **Text over gradients**: always place text on a semi-opaque surface layer, not directly on the aurora. Use glassmorphism cards or solid overlays.
- **Contrast**: gradient color variation means contrast ratios change across the viewport. Test at the worst-case position (lightest gradient area).
- **Reduced motion**: stop animation entirely for `prefers-reduced-motion: reduce` — display static gradient
- **Color dependence**: don't convey information through gradient color alone — always pair with text or icons

---

## Performance

- **Gradient layers**: each `radial-gradient` layer is composited by the GPU. 3-5 layers are fine; 10+ causes measurable overhead
- **Animation cost**: `background-position` animation is GPU-accelerated and relatively cheap
- **Grain overlay**: the SVG noise filter is rendered once and cached — negligible ongoing cost
- **Optimization**: use `will-change: background-position` on animated aurora elements (but not globally)
- **Mobile**: reduce to 2-3 gradient layers on mobile for smoother scrolling
- **Alternative for heavy use**: pre-render the aurora as a static image and use CSS to animate opacity/position of the image layer

---

## When to Use / When to Avoid

### Use When
- Hero sections, landing page backgrounds
- App backgrounds behind glassmorphism cards
- Brand identity expressing premium, modern aesthetic
- Dark-mode-first products (developer tools, creative tools)

### Avoid When
- Behind text-heavy content without an overlay surface
- Data dashboards where the background distracts from data
- Light-mode-only products — aurora needs dark backgrounds
- Performance-constrained mobile experiences with heavy UI layers

---

## Design Tokens

```json
{
  "aurora": {
    "bg-base": "#0a0a1a",
    "bg-alt": "#1a1a2e",
    "color-1": "rgba(120, 80, 255, 0.4)",
    "color-2": "rgba(255, 100, 200, 0.3)",
    "color-3": "rgba(80, 200, 255, 0.3)",
    "color-4": "rgba(100, 255, 180, 0.2)",
    "grain-opacity": "0.03",
    "grain-blend-mode": "overlay",
    "animation-duration": "15s",
    "animation-easing": "ease-in-out",
    "mesh-purple": "#7c3aed",
    "mesh-cyan": "#06b6d4",
    "mesh-rose": "#f43f5e",
    "mesh-amber": "#eab308"
  }
}
```

---

## Related

- [Glassmorphism](./glassmorphism.md) — the canonical foreground pairing: frosted glass cards over aurora backgrounds
- [Liquid Glass](./liquid-glass.md) — advanced foreground with refraction over aurora
- [Dark Mode OLED](./dark-mode-oled.md) — aurora on true black (#000000) is visually stunning
