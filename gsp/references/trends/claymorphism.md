# Claymorphism

> Soft 3D aesthetic where UI elements look like inflated clay — playful, tactile, and friendly. Combines neumorphism's depth with warmer, colorful execution.

Last verified: 2026-03-04

---

## Visual Characteristics

- Soft 3D inflated appearance — elements look "puffed up"
- Double inset shadows (dark + light) creating clay-like depth
- Very rounded corners (24-40px)
- Pastel color palette — non-saturated, light, airy
- Outer shadow for floating elevation
- No sharp edges, no flat surfaces

---

## CSS Implementation

```css
/* Claymorphism card */
.clay-card {
  background: #F0E6FF;
  border-radius: 30px;
  box-shadow:
    inset -8px -8px 16px rgba(0, 0, 0, 0.1),
    inset 8px 8px 16px rgba(255, 255, 255, 0.5),
    8px 8px 24px rgba(0, 0, 0, 0.15);
  padding: 32px;
}

/* Claymorphism button */
.clay-button {
  background: #A8D8FF;
  border: none;
  border-radius: 20px;
  box-shadow:
    inset -4px -4px 8px rgba(0, 0, 0, 0.1),
    inset 4px 4px 8px rgba(255, 255, 255, 0.5),
    4px 4px 12px rgba(0, 0, 0, 0.15);
  padding: 14px 28px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clay-button:hover {
  transform: translateY(-2px);
  box-shadow:
    inset -4px -4px 8px rgba(0, 0, 0, 0.1),
    inset 4px 4px 8px rgba(255, 255, 255, 0.5),
    6px 6px 16px rgba(0, 0, 0, 0.2);
}

.clay-button:active {
  transform: translateY(1px);
  box-shadow:
    inset -6px -6px 12px rgba(0, 0, 0, 0.12),
    inset 6px 6px 12px rgba(255, 255, 255, 0.4),
    2px 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Shadow Formula

The 3D clay effect = 2 inset shadows (dark + light) + 1 outer shadow:
1. **Inset dark** (bottom-right): creates depth cavity, `rgba(0,0,0, 0.08-0.12)`
2. **Inset light** (top-left): creates highlight/bulge, `rgba(255,255,255, 0.4-0.6)`
3. **Outer dark**: lifts element off background, `rgba(0,0,0, 0.1-0.2)`

### Color Palette
- Pastels: `#F0E6FF` (lavender), `#A8D8FF` (sky), `#FFD4E8` (pink), `#C8F7C5` (mint), `#FFF3CD` (cream)
- Background: `#F5F0FF` or `#F0F4FF` (tinted white)

---

## Implementation Guide

### Step-by-step

1. Choose a pastel base color for the element background
2. Set a large border-radius (24-40px) — the puffy look depends on this
3. Apply the 3-shadow formula: `inset dark` + `inset light` + `outer`
4. Set background to a slightly lighter tint of the element color for the page
5. Add hover state: increase outer shadow spread + `translateY(-2px)`
6. Add active state: compress shadows + `translateY(1px)` for a "squish" effect
7. Remove all borders — claymorphism uses shadows exclusively for definition

### Progressive Enhancement

Claymorphism uses only `box-shadow` and `border-radius` — both have universal browser support. No `@supports` queries needed.

### Framework Notes

#### React + Tailwind CSS

Tailwind requires custom shadow definitions since the multi-shadow clay formula isn't built-in:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'clay': 'inset -8px -8px 16px rgba(0,0,0,0.1), inset 8px 8px 16px rgba(255,255,255,0.5), 8px 8px 24px rgba(0,0,0,0.15)',
        'clay-hover': 'inset -8px -8px 16px rgba(0,0,0,0.1), inset 8px 8px 16px rgba(255,255,255,0.5), 6px 6px 16px rgba(0,0,0,0.2)',
        'clay-active': 'inset -6px -6px 12px rgba(0,0,0,0.12), inset 6px 6px 12px rgba(255,255,255,0.4), 2px 2px 8px rgba(0,0,0,0.1)',
      }
    }
  }
}
```

```tsx
export function ClayCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F0E6FF] rounded-[30px] shadow-clay p-8 hover:shadow-clay-hover hover:-translate-y-0.5 active:shadow-clay-active active:translate-y-px transition-all duration-200">
      {children}
    </div>
  );
}
```

#### React Native

```tsx
const styles = StyleSheet.create({
  clay: {
    backgroundColor: '#F0E6FF',
    borderRadius: 30,
    padding: 32,
    // React Native can't do inset shadows — approximate with outer shadow + gradient overlay
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  }
});
```

Note: React Native cannot render inset shadows natively. The full clay effect requires a `LinearGradient` overlay from `expo-linear-gradient` or `react-native-linear-gradient` to simulate the inner highlight.

#### Vanilla CSS

The implementation section above is pure vanilla CSS. Use CSS custom properties for theming multiple clay colors.

### Common Pitfalls

1. **Missing the inset light shadow**: without the top-left white inset, elements look dented rather than puffy. The highlight is what creates the 3D clay illusion.
2. **Borders**: adding any `border` breaks the soft organic feel. Use shadows exclusively for definition.
3. **Dark backgrounds**: claymorphism requires light/pastel backgrounds. On dark surfaces, the inset shadows become invisible and the effect collapses.
4. **Too many clay elements**: a page full of puffy elements feels overwhelming. Use clay for 3-5 key interactive elements, not every UI component.
5. **Confusing with neumorphism**: claymorphism uses color and asymmetric shadows — neumorphism uses monochrome with symmetric shadows. The result is visually very different.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Duolingo | Signature clay aesthetic across the entire app — 3D inflated buttons, character cards, and progress elements | Lesson cards with colorful puffy buttons |
| Headspace | Meditation cards use soft 3D elevation with pastel backgrounds and rounded corners | Session selection with inflated card grid |
| Oatly | Brand pages with playful 3D card elements and pastel palette on warm backgrounds | Product showcase with clay-styled CTA buttons |
| Figma Community | Clay-inspired plugin cards with soft shadows and rounded thumbnails | Plugin browser with puffy card hover states |
| Awwwards — Cuberto portfolio | Clay-styled interactive elements with exaggerated 3D shadows and pastel accents | Portfolio cards with tactile hover animations |

---

## Accessibility

- **Contrast on pastels**: pastel backgrounds with light text can fail WCAG. Use dark text (`#333` minimum) on all pastel surfaces.
- **Focus indicators**: shadow-only styling makes focus rings essential — use `outline: 3px solid #5B4FA0` with `outline-offset: 3px`
- **No border definition**: since claymorphism removes borders, ensure interactive elements have sufficient shadow contrast to be distinguishable from background
- **Reduced motion**: the hover lift and squish are subtle (200ms, 2px) — generally safe, but provide instant state change as fallback

---

## Performance

- **Low GPU cost**: `box-shadow` is well-optimized in all browsers. No compositing layers or filters.
- **Multi-shadow cost**: 3 shadows per element is slightly more expensive than single-shadow designs but negligible in practice
- **Safe for all devices**: no blur, no filters, no backdrop effects
- **Animation**: `transform` + `box-shadow` transitions at 200ms stay within frame budget

---

## When to Use / When to Avoid

### Use When
- Children's apps, educational platforms, gamified UX
- Landing pages for friendly/approachable products
- Onboarding flows, empty states, playful CTAs
- Brands targeting warmth and whimsy

### Avoid When
- Enterprise apps — reads as too playful for corporate contexts
- Fintech, healthcare — undermines trust signals
- Data-heavy interfaces — inflated elements waste screen real estate
- Dark mode — the clay effect requires light backgrounds to function

---

## Design Tokens

```json
{
  "claymorphism": {
    "radius-sm": "20px",
    "radius-md": "30px",
    "radius-lg": "40px",
    "shadow-card": "inset -8px -8px 16px rgba(0,0,0,0.1), inset 8px 8px 16px rgba(255,255,255,0.5), 8px 8px 24px rgba(0,0,0,0.15)",
    "shadow-button": "inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.5), 4px 4px 12px rgba(0,0,0,0.15)",
    "palette-lavender": "#F0E6FF",
    "palette-sky": "#A8D8FF",
    "palette-pink": "#FFD4E8",
    "palette-mint": "#C8F7C5",
    "palette-cream": "#FFF3CD",
    "bg-light": "#F5F0FF",
    "transition-duration": "200ms",
    "transition-easing": "ease"
  }
}
```

---

## Related

- [Micro-Interactions](./micro-interactions.md) — tactile feedback (squish, lift) enhances the clay feel
- [Bento Grid](./bento-grid.md) — compatible layout structure for clay cards
