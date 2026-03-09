# Color System

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Design Philosophy

GSP is dark-only. There is no light mode for brand materials. The terminal is the canvas. True black is the ground. Burnt orange is the signal.

Every color decision traces to strategy: the Creator archetype demands craft in color relationships. The Magician archetype demands the "reveal" -- burnt orange emerging from void is transformation made visible. The brand prism physique defines "citric heat against void."

Machine-readable color scales: `./palettes.json`

---

## Primary Accent

### Burnt Orange

| Property | Value |
|----------|-------|
| **Hex** | `#FF6B35` |
| **RGB** | `255, 107, 53` |
| **HSL** | `16, 100%, 60%` |
| **OKLCH** | `oklch(0.705 0.193 39.23)` |
| **Pantone** | 1655 C (nearest match) |
| **CMYK** | `0, 58, 79, 0` |

**Rationale:** Inherited from jubs.studio's cyberpunk palette. Where jubs.studio splits its DNA -- cyphercn gets neon green (#00FF88), GSP gets burnt orange. Complementary to cyphercn on the color wheel. Citric, warm, unexpected in dev tools where everyone defaults to blue/purple. Warm against true black -- glows rather than glares. The Magician's reveal color.

### Accent Scale (OKLCH)

| Stop | OKLCH | Use |
|------|-------|-----|
| 50 | `oklch(0.966 0.017 26.74)` | Tinted backgrounds |
| 100 | `oklch(0.942 0.029 25.61)` | Hover states on light |
| 200 | `oklch(0.877 0.066 28.95)` | -- |
| 300 | `oklch(0.821 0.101 30.65)` | Soft emphasis |
| 400 | `oklch(0.765 0.141 33.61)` | Secondary accent |
| **500** | **`oklch(0.705 0.193 39.23)`** | **Primary brand accent** |
| 600 | `oklch(0.597 0.181 41.7)` | Pressed states |
| 700 | `oklch(0.481 0.146 41.55)` | Dark UI accents |
| 800 | `oklch(0.366 0.111 41.78)` | Muted references |
| 900 | `oklch(0.258 0.079 41.42)` | Near-black tint |
| 950 | `oklch(0.194 0.058 42.4)` | Darkest tint |

---

## Surface Hierarchy

True black base. Not dark gray, not charcoal. OLED pixel-off black. Five levels provide depth without abandoning the void.

| Level | Hex | RGB | Use | Rationale |
|-------|-----|-----|-----|-----------|
| surface-base | `#000000` | `0, 0, 0` | Page background, canvas | The terminal IS the medium. Honor it. |
| surface-1 | `#0A0A0A` | `10, 10, 10` | Card backgrounds, panels | First lift -- barely perceptible, structurally necessary. |
| surface-2 | `#141414` | `20, 20, 20` | Elevated containers, modals | Clear separation without abandoning dark. |
| surface-3 | `#1E1E1E` | `30, 30, 30` | Active states, hover backgrounds | Interactive feedback layer. |
| surface-4 | `#282828` | `40, 40, 40` | Highest elevation, tooltips | Maximum lift. Still dark. |

---

## Text Hierarchy

Off-white primary prevents halation (pure white on true black vibrates). Three levels enforce information hierarchy.

| Level | Hex | RGB | Use |
|-------|-----|-----|-----|
| text-primary | `#E0E0E0` | `224, 224, 224` | Headings, body text, primary content |
| text-secondary | `#A0A0A0` | `160, 160, 160` | Descriptions, labels, metadata |
| text-tertiary | `#666666` | `102, 102, 102` | Disabled, placeholders, hints |

---

## Border System

Neubrutalist DNA. Borders are structural, not decorative. Thick (2-3px), flat, honest.

| Level | Value | Use |
|-------|-------|-----|
| border-subtle | `rgba(255, 255, 255, 0.08)` | Separation between related elements |
| border-default | `rgba(255, 255, 255, 0.15)` | Standard container borders |
| border-strong | `rgba(255, 255, 255, 0.25)` | Emphasized containers, cards |
| border-accent | `rgba(255, 107, 53, 0.4)` | Active states, focus rings, brand emphasis |

---

## Semantic Colors

Chosen to work harmoniously with burnt orange without competing for attention.

| Role | Hex | RGB | OKLCH | Rationale |
|------|-----|-----|-------|-----------|
| Success | `#22C55E` | `34, 197, 94` | `oklch(0.723 0.191 149.58)` | Green signals completion. Echoes cyphercn's palette -- ecosystem coherence. |
| Warning | `#FBBF24` | `251, 191, 36` | `oklch(0.828 0.162 83.7)` | Warm yellow adjacent to orange -- same temperature family. |
| Error | `#EF4444` | `239, 68, 68` | `oklch(0.628 0.209 22.18)` | Red shares orange's hue neighborhood but is unmistakably danger. |
| Info | `#60A5FA` | `96, 165, 250` | `oklch(0.706 0.132 252.72)` | Cool blue provides temperature contrast to the warm palette. |

---

## Contrast Ratios (WCAG AA)

All text/surface combinations must meet AA standard (4.5:1 for normal text, 3:1 for large text).

| Text | Surface | Ratio | AA Normal | AA Large |
|------|---------|-------|-----------|----------|
| text-primary (#E0E0E0) | surface-base (#000000) | 14.4:1 | Pass | Pass |
| text-primary (#E0E0E0) | surface-2 (#141414) | 11.1:1 | Pass | Pass |
| text-primary (#E0E0E0) | surface-4 (#282828) | 8.5:1 | Pass | Pass |
| text-secondary (#A0A0A0) | surface-base (#000000) | 8.3:1 | Pass | Pass |
| text-secondary (#A0A0A0) | surface-2 (#141414) | 6.4:1 | Pass | Pass |
| text-secondary (#A0A0A0) | surface-4 (#282828) | 4.9:1 | Pass | Pass |
| text-tertiary (#666666) | surface-base (#000000) | 3.9:1 | Fail | Pass |
| text-tertiary (#666666) | surface-2 (#141414) | 3.0:1 | Fail | Pass |
| accent (#FF6B35) | surface-base (#000000) | 5.2:1 | Pass | Pass |
| accent (#FF6B35) | surface-2 (#141414) | 4.0:1 | Fail | Pass |

**Note:** text-tertiary is intended for decorative/hint content only -- never for essential information. Accent on surface-2 should be used at large sizes only (18px+).

---

## Ecosystem Color Inheritance

| Brand | Primary Accent | Secondary | Base | Relationship |
|-------|---------------|-----------|------|-------------|
| jubs.studio | `#00FF88` + `#FF6B35` | -- | Dark | Parent. Both colors. Cyberpunk. |
| GSP | `#FF6B35` | -- | `#000000` | Child. Inherits orange. Structured avant-garde. |
| cyphercn | `#00FF88` | -- | Dark | Sibling. Inherits green. Retro-terminal. |

The ecosystem reads as a family -- unmistakably related, immediately distinct. Orange and green sit across the color wheel. Side by side, the brands have natural contrast and energy.

---

## Dark Mode Note

GSP is dark-only for brand materials. There is no light mode mapping because there is no light mode. If a third-party context requires light backgrounds, use the accent scale's 600-950 stops for text on light, and surface hierarchy inverts to whites/grays. But this is an accommodation, not a brand expression.

---

## Related

- [Typography](./typography.md)
- [Imagery Style](./imagery-style.md)
- [Logo Directions](./logo-directions.md)
