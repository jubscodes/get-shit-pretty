# OLED-Optimized Dark Mode

> True OLED optimization with pure blacks for pixel-off battery savings, reduced contrast for eye comfort, and structured surface/text token hierarchies.

Last verified: 2026-03-04

---

## Visual Characteristics

- True black (`#000000`) base — OLED pixels turn off completely
- Surface hierarchy via subtle lightness steps (`#000` → `#0A0A0A` → `#141414` → `#1E1E1E` → `#282828`)
- Off-white text (`#E0E0E0` max) to prevent halation — bright white text glows on OLED
- Desaturated accent colors (~15-20% less saturation than light mode)
- Elevation expressed through lightness, not shadows (shadows are invisible on dark surfaces)
- 82% of mobile users prefer dark mode (Android/iOS usage data, 2025)

---

## CSS Implementation

### Color Token Strategy

```css
:root {
  /* Surface hierarchy */
  --surface-base:   #000000;  /* true black — OLED pixel off */
  --surface-1:      #0A0A0A;  /* barely lifted — cards on pure black */
  --surface-2:      #141414;  /* secondary surface */
  --surface-3:      #1E1E1E;  /* elevated (modals, popovers) */
  --surface-4:      #282828;  /* highest elevation */

  /* Text hierarchy */
  --text-primary:   #E0E0E0;  /* off-white — never pure #FFF */
  --text-secondary: #A0A0A0;  /* muted */
  --text-tertiary:  #666666;  /* disabled / placeholder */

  /* Borders */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.12);
  --border-strong:  rgba(255, 255, 255, 0.20);
}
```

### Key Rules

- **True black `#000000`** for base backgrounds — OLED pixels turn off, saving significant battery
- **Never pure white `#FFFFFF`** text — causes halation (text glow/bleed) on OLED panels. Maximum brightness: `#E0E0E0`
- **Surface elevation via lightness** — each step increases by ~10 in hex (`0A`, `14`, `1E`, `28`). Shadows are invisible on dark, so lightness = elevation
- **Desaturate accents** ~15-20% for dark mode — full saturation causes eye strain on dark backgrounds
- **Minimum contrast**: 4.5:1 for body text, 3:1 for large text (WCAG AA)
- **Test on real OLED devices** — LCD emulators display dark grey, not true black

### Media Query

```css
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    /* swap all semantic tokens to dark values */
  }
}
```

### Battery Savings Context

The commonly cited "47% battery savings" for true black OLED comes from a 2018 Google/Android study comparing full-white vs full-black screens at max brightness. Real-world savings depend on actual screen content mix — typical dark UI interfaces see ~20-30% savings compared to light mode. The benefit is real but varies with usage patterns.

---

## Implementation Guide

### Step-by-step

1. Define surface hierarchy tokens: 5 levels from `#000000` to `#282828`
2. Define text hierarchy: primary (`#E0E0E0`), secondary (`#A0A0A0`), tertiary (`#666666`)
3. Define border tokens using `rgba(255,255,255)` at varying opacities (0.06, 0.12, 0.20)
4. Desaturate all accent colors 15-20% for dark mode variants
5. Apply `color-scheme: dark` to `:root` inside the media query
6. Replace shadow-based elevation with surface lightness stepping
7. Test all text/surface combinations for WCAG contrast compliance
8. Test on a real OLED device — halation is invisible on LCD/emulators

### Progressive Enhancement

```css
/* Baseline: light mode */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

/* Enhanced: dark mode when system preference is set */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --bg: #000000;
    --text: #E0E0E0;
  }
}
```

For manual toggle support, use a class-based approach:

```css
/* User-toggled dark mode */
html.dark {
  color-scheme: dark;
  --bg: #000000;
  --text: #E0E0E0;
}
```

### Framework Notes

#### React + Tailwind CSS

Tailwind supports two dark mode strategies:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // 'class' for manual toggle, 'media' for system preference
}
```

```tsx
// Component with dark mode support
export function Card({ children }) {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-[#E0E0E0] border border-zinc-200 dark:border-white/[0.12] rounded-2xl p-6">
      {children}
    </div>
  );
}

// OLED surface hierarchy via Tailwind
// surface-base: dark:bg-black
// surface-1:    dark:bg-[#0A0A0A]
// surface-2:    dark:bg-[#141414]
// surface-3:    dark:bg-[#1E1E1E]
// surface-4:    dark:bg-[#282828]
```

#### React Native

```tsx
import { useColorScheme } from 'react-native';

export function useOLEDTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? {
    surfaceBase: '#000000',
    surface1: '#0A0A0A',
    surface2: '#141414',
    surface3: '#1E1E1E',
    textPrimary: '#E0E0E0',
    textSecondary: '#A0A0A0',
    borderDefault: 'rgba(255,255,255,0.12)',
  } : {
    surfaceBase: '#FFFFFF',
    surface1: '#F5F5F5',
    surface2: '#EEEEEE',
    surface3: '#E0E0E0',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    borderDefault: 'rgba(0,0,0,0.12)',
  };
}
```

For true black on React Native, ensure no background color overrides on ancestor views — any non-black ancestor prevents OLED pixel-off.

#### Vanilla CSS

The CSS implementation section above is pure vanilla. Use CSS custom properties for the full token system and swap values inside the media query.

### Common Pitfalls

1. **Pure white text on black**: causes halation — bright text bleeds/glows on OLED screens. Cap text brightness at `#E0E0E0`.
2. **Using shadows for elevation in dark mode**: shadows are invisible on dark surfaces. Use surface lightness stepping instead.
3. **Same accent saturation as light mode**: fully saturated colors cause eye strain on dark backgrounds. Desaturate 15-20%.
4. **Testing on LCD only**: dark grey (`#0A0A0A`) and true black (`#000000`) look identical on LCD but are visually distinct on OLED. Always test on real OLED hardware.
5. **Forgetting `color-scheme: dark`**: without this property, form elements, scrollbars, and browser chrome stay in light mode appearance.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Twitter/X (mobile) | True black OLED mode with #000000 base, surface hierarchy for cards and menus | Timeline with pure black background and elevated card surfaces |
| Spotify | True black with vibrant (but desaturated) accent colors — album art drives color | Player screen with black base and colorful album artwork |
| YouTube (dark mode) | Surface hierarchy: #000 base, #0F0F0F for cards, #272727 for elevated elements | Video player with layered dark surfaces |
| Apple Developer (docs) | System-respecting dark mode with precise surface hierarchy and desaturated code highlighting | Documentation with OLED-optimized code blocks |
| Linear | Dark-first product — true black with aurora gradient accents and glass overlays | Issue tracker with atmospheric dark background |

---

## Accessibility

### Contrast Requirements

| Text Type | WCAG AA Minimum | Recommended |
|-----------|----------------|-------------|
| Body text on surface-base | 4.5:1 | `#E0E0E0` on `#000` = 18.4:1 |
| Body text on surface-2 | 4.5:1 | `#E0E0E0` on `#141414` = 14.9:1 |
| Secondary text on surface-base | 4.5:1 | `#A0A0A0` on `#000` = 10.3:1 |
| Tertiary text on surface-base | 3:1 (large text) | `#666666` on `#000` = 4.0:1 |
| Disabled text | No minimum | `#666666` — clearly visible but muted |

### Halation Prevention

Halation occurs when bright content (above ~`#E8E8E8`) on a pure black OLED background causes the text to appear to glow or bleed. The threshold varies by device, but `#E0E0E0` (88% brightness) is a safe maximum for body text.

### Focus Indicators

On dark surfaces, use high-contrast focus rings:

```css
:focus-visible {
  outline: 2px solid #60A5FA;  /* blue works well on dark surfaces */
  outline-offset: 2px;
}
```

---

## Performance

- **OLED battery**: true black areas consume zero power (pixels off). Real-world UI savings: 20-30% vs light mode
- **No GPU cost**: dark mode is a color swap — no filters, blur, or compositing involved
- **CSS custom properties**: token swapping via media query is computed once on theme change, not per-frame
- **Image consideration**: images on true black backgrounds may appear too bright. Consider reducing image brightness by 5-10% in dark mode
- **Transition**: when toggling themes, use `transition: background-color 200ms ease, color 200ms ease` on body — but not `*` (too expensive)

---

## When to Use / When to Avoid

### Use When
- Default: offer both modes, respect `prefers-color-scheme` system preference
- Dark-first: media apps, developer tools, creative tools, nighttime-use apps
- OLED-targeting mobile apps where battery savings matter
- Environments with low ambient light where bright screens cause discomfort

### Avoid When
- Print-focused content where dark mode creates excessive ink usage on print
- Products where brand identity requires a light aesthetic (some luxury, healthcare)
- Consider: auto-switching based on ambient light sensor or time of day

---

## Design Tokens

```json
{
  "dark-oled": {
    "surface-base": "#000000",
    "surface-1": "#0A0A0A",
    "surface-2": "#141414",
    "surface-3": "#1E1E1E",
    "surface-4": "#282828",
    "text-primary": "#E0E0E0",
    "text-secondary": "#A0A0A0",
    "text-tertiary": "#666666",
    "border-subtle": "rgba(255, 255, 255, 0.06)",
    "border-default": "rgba(255, 255, 255, 0.12)",
    "border-strong": "rgba(255, 255, 255, 0.20)",
    "accent-desaturate": "15%",
    "halation-max-brightness": "#E0E0E0"
  }
}
```

---

## Related

- [Glassmorphism](./glassmorphism.md) — dark glassmorphism variant with adjusted opacity and border values
- [Aurora Gradients](./aurora-gradients.md) — aurora on true black is visually stunning
- [Liquid Glass](./liquid-glass.md) — surface token adaptation needed for dark liquid glass
