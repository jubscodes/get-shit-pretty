# Neubrutalism (Neo-Brutalism)

> Bold, flat, high-contrast aesthetic with thick borders and hard-offset shadows — intentionally raw but usable. Anti-polish meets modern UX.

Last verified: 2026-03-04

---

## Visual Characteristics

- Flat colors — no gradients, no blur, no transparency
- Thick black borders (2-4px)
- Hard-offset box shadows with zero blur radius
- High contrast — pure black + bright saturated accent
- Geometric shapes, sharp corners or intentionally chunky radius (8-12px)
- Monospaced or grotesque sans-serif typography
- Popularized by Gumroad, Figma, Notion Calendar

---

## CSS Implementation

```css
/* Neubrutalist card */
.neu-card {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 12px;
  box-shadow: 4px 4px 0px 0px #000000;
  padding: 24px;
}

/* Neubrutalist button */
.neu-button {
  background: #FFD700;
  color: #000000;
  border: 3px solid #000000;
  border-radius: 8px;
  box-shadow: 4px 4px 0px 0px #000000;
  padding: 12px 24px;
  font-weight: 700;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.neu-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #000000;
}

.neu-button:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px #000000;
}

/* Neubrutalist input */
.neu-input {
  border: 3px solid #000000;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  box-shadow: 3px 3px 0px 0px #000000;
  outline: none;
}

.neu-input:focus {
  box-shadow: 3px 3px 0px 0px #4169E1;
  border-color: #4169E1;
}
```

### Shadow Scale

| Token | Value | Use |
|-------|-------|-----|
| sm | `2px 2px 0px 0px #000` | Small elements, tags, chips |
| md | `4px 4px 0px 0px #000` | Cards, buttons, inputs |
| lg | `6px 6px 0px 0px #000` | Featured cards, hero elements |
| xl | `8px 8px 0px 0px #000` | Modals, popovers |

### Color Palette Pattern
- Background: `#FFFFFF` or warm off-white `#FFF8F0`
- Text: `#000000`
- Accents: `#FFD700` (yellow), `#FF6B6B` (red), `#4169E1` (blue), `#50C878` (green), `#FF69B4` (pink)
- No gradients, no opacity, no blur

### Typography
- Primary: Space Grotesk, Space Mono, Inter, or DM Sans
- Headings: Bold/Black weight, 48-96px for hero
- Body: Regular weight, 16-18px
- Monospaced accent: JetBrains Mono, IBM Plex Mono

---

## Implementation Guide

### Step-by-step

1. Set a flat background — white or warm off-white (`#FFF8F0`)
2. Apply thick borders: `3px solid #000000` to all interactive elements
3. Add hard-offset box-shadow: `4px 4px 0px 0px #000000` (zero blur is essential)
4. Choose 1-2 bright accent colors for CTAs and highlights
5. Set typography: grotesque sans-serif for headings, monospace for accents
6. Implement shadow-collapse interaction: hover reduces offset, active collapses to zero
7. Ensure all interactive states (hover, active, focus, disabled) are visually distinct

### Progressive Enhancement

Neubrutalism works in all browsers with no progressive enhancement needed — it uses only basic CSS properties (border, box-shadow, background-color). No `@supports` queries required.

### Framework Notes

#### React + Tailwind CSS

Tailwind doesn't ship hard-offset shadows by default. Add custom shadow utilities:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'neu-sm': '2px 2px 0px 0px #000000',
        'neu-md': '4px 4px 0px 0px #000000',
        'neu-lg': '6px 6px 0px 0px #000000',
        'neu-xl': '8px 8px 0px 0px #000000',
      }
    }
  }
}
```

```tsx
export function NeuButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-yellow-400 text-black border-[3px] border-black rounded-lg shadow-neu-md px-6 py-3 font-bold font-[Space_Grotesk] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neu-sm active:translate-x-1 active:translate-y-1 active:shadow-none">
      {children}
    </button>
  );
}
```

#### React Native

Neubrutalism translates well to React Native since it uses no advanced CSS:

```tsx
import { Pressable, Text, StyleSheet } from 'react-native';

export function NeuButton({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && { transform: [{ translateX: 4 }, { translateY: 4 }], shadowOffset: { width: 0, height: 0 } }
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  text: { color: '#000000', fontWeight: '700', fontSize: 16 },
});
```

#### Vanilla CSS

The CSS implementation section above is already vanilla CSS. No additional tooling needed.

### Common Pitfalls

1. **Adding blur to shadows**: the entire aesthetic depends on `0px` blur radius in box-shadow. Any blur softens the hard offset and breaks the brutalist look.
2. **Mixing with glassmorphism**: these trends clash fundamentally — glass needs transparency and blur, neubrutalism demands flatness and opacity.
3. **Inconsistent border width**: mixing 2px and 3px borders within the same UI breaks visual rhythm. Pick one and stick with it.
4. **Shadow not collapsing on press**: the shadow-to-zero interaction pattern is what makes neubrutalism feel physical. Without it, buttons feel static and the hard shadow looks like a decoration.
5. **Too many accent colors**: limit to 2-3 bright accents max. More than that reads as chaotic rather than intentionally bold.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Gumroad | The canonical neubrutalist product — thick borders, hard shadows, bright yellow accent on every CTA | Product pages with bold cards and shadow-collapse buttons |
| Figma Community | Bold flat cards with chunky radius and monospace accents — neubrutalism at scale | Community file browser with high-contrast cards |
| Notion Calendar | Soft neubrutalism variant — slightly rounded, pastel accents with hard shadows | Calendar grid with event chips using hard offsets |
| Poolsuite | Full commitment — retro-brutalist with monospace type, hot pink/green accents, and zero visual softness | App landing page with maximum contrast |
| The Whimsical Web (Awwwards) | Experimental neubrutalism with animated shadow offsets and color-shifting accents | Portfolio site with interactive card states |

---

## Accessibility

- **High contrast by default**: neubrutalism's pure black + white base exceeds WCAG AAA (21:1 ratio). Colored accents on white also tend to pass AA.
- **Focus indicators**: replace the shadow-collapse focus state with a distinct visual — color-shifted shadow (`3px 3px 0px 0px #4169E1`) plus `border-color` change
- **Color alone**: don't rely on accent color alone to convey state — combine with shadow offset changes, border changes, or text labels
- **Motion**: the shadow-collapse animation is brief (100ms) and subtle — generally safe for `prefers-reduced-motion`, but provide instant state change as alternative

---

## Performance

- **Minimal GPU cost**: neubrutalism uses only basic CSS properties (border, box-shadow, background-color). No compositing layers, no blur, no filters.
- **Most performant trend**: flat colors + hard shadows = zero GPU overhead beyond standard rendering
- **Safe for low-end devices**: works identically on all hardware tiers
- **Shadow transition**: `transform` + `box-shadow` transition at 100ms is well within 16ms frame budget

---

## When to Use / When to Avoid

### Use When
- SaaS products, developer tools, creative platforms
- Landing pages, marketing sites with personality
- Products targeting young/creative audiences
- Brands that want to stand out against the polished-glass mainstream

### Avoid When
- Luxury brands — hard shadows read as cheap/raw
- Healthcare, fintech — clashes with trust/security signals
- Enterprises expecting conservative visual language
- Products already using glassmorphism — the trends clash fundamentally

---

## Design Tokens

```json
{
  "neubrutalism": {
    "border-width": "3px",
    "border-color": "#000000",
    "radius-sm": "8px",
    "radius-md": "12px",
    "shadow-sm": "2px 2px 0px 0px #000000",
    "shadow-md": "4px 4px 0px 0px #000000",
    "shadow-lg": "6px 6px 0px 0px #000000",
    "shadow-xl": "8px 8px 0px 0px #000000",
    "bg-primary": "#FFFFFF",
    "bg-warm": "#FFF8F0",
    "text": "#000000",
    "accent-yellow": "#FFD700",
    "accent-red": "#FF6B6B",
    "accent-blue": "#4169E1",
    "accent-green": "#50C878",
    "accent-pink": "#FF69B4",
    "transition-duration": "100ms",
    "transition-easing": "ease"
  }
}
```

---

## Related

- [Kinetic Typography](./kinetic-typography.md) — great pairing for bold text effects
- [Micro-Interactions](./micro-interactions.md) — shadow collapse on press is the signature interaction
- [Bento Grid](./bento-grid.md) — compatible layout structure for neubrutalist cards
