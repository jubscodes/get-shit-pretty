# Imagery Style

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Core Principle

GSP's visual content IS text. ASCII art, terminal screenshots, code output, architectural diagrams -- these are not substitutes for imagery. They are the native visual language of a CLI tool. The Creator archetype finds beauty in structured text. The Guide archetype communicates through the medium the audience already reads.

---

## ASCII Art Direction

ASCII art is GSP's primary illustration medium. It must feel crafted, not generated. Every piece should reward close reading.

### Character Vocabulary

| Category | Characters | Use |
|----------|------------|-----|
| Box-drawing | `┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼` | Structure, containers, borders |
| Diamonds | `◆ ◇ ◈` | Brand marks, phase indicators, progress |
| Arrows | `→ ← ↑ ↓ ▸ ▹` | Flow, direction, navigation |
| Blocks | `█ ▓ ▒ ░` | Density ramps, progress bars, emphasis |
| Dots | `· • ●` | Lists, separators, subtle markers |
| Dashes | `─ ── ━` | Dividers, horizontal rules |

### Composition Rules

- **Whitespace is structural.** ASCII art should breathe. Never fill every character cell. The empty space is as designed as the filled space.
- **Maximum width: 60 characters.** Art should fit comfortably within 80-column terminals with margin.
- **Vertical economy.** Keep ASCII illustrations under 15 lines unless they are full-screen moments (phase completion banners).
- **No ASCII portraits or pictorial art** in brand contexts. GSP's ASCII is abstract, structural, and diagrammatic. Save figurative ASCII for `/gsp:art` skill output where personality is the point.

### Density Ramp

For progress visualization and emphasis gradients:

```
░░▒▒▓▓██  (light to dense)
```

Use amber ANSI coloring on the dense end to indicate active/current state.

---

## Terminal Screenshots

Terminal screenshots are GSP's hero images. They replace photography across all contexts.

### Styling Rules

- **Dark background matching Void (#050505).** Never screenshot a light terminal.
- **Font: JetBrains Mono** at 14-16px with 1.7 line-height.
- **Window chrome: minimal.** Show the terminal content, not the application frame. If a frame is needed, use a simple border with no traffic lights or title bar branding.
- **Amber highlights** on key output lines to draw attention.
- **Content is real.** Screenshots must show actual GSP output, not mockups. The brand is the proof.
- **Crop tight.** Show the relevant 10-20 lines, not a full scrollback buffer.

### Screenshot Composition

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  $ /gsp:palette                                  │
│                                                  │
│  ◆ Generating OKLCH palette from #E5A00D         │
│                                                  │
│    amber-50   #FDF6E7  oklch(0.975 0.016 64.69)  │
│    amber-100  #F9E8C4  oklch(0.949 0.033 63.05)  │
│    amber-200  #F0D28B  oklch(0.901 0.073 68.03)  │
│    ...                                           │
│                                                  │
│  Written to .design/system/palettes.json         │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Diagrams and Visualization

### Architecture Diagrams

Rendered in monospace with box-drawing characters. Never as raster images in documentation.

```
  discover ──→ strategy ──→ identity ──→ system
     ◇            ◇            ◇           ◆
```

### Data Visualization

- **Progress bars:** Block characters with amber fill, muted empty
- **Tables:** Box-drawing borders, not ASCII pipes
- **Trees:** Standard tree-drawing characters (`├── └──`)
- **Flowcharts:** Box-drawing with arrow characters

---

## Texture

### Dot Grid

A subtle dot grid pattern at 0.02-0.04 opacity on surfaces (web contexts only). References engineering graph paper and precision measurement.

- Grid spacing: 24px (3x the 8px base unit)
- Dot size: 1px
- Color: `#FAFAFA` at 2-4% opacity on dark surfaces
- Never on void background -- only on surface (#111111) and above

### No Noise, No Grain

The terminal aesthetic is clean, not distressed. No film grain, no paper texture, no CRT scanlines. GSP is not retro -- it is native. This also differentiates from cyphercn's retro-terminal direction.

---

## Photography Policy

**GSP does not use photography.** This is a deliberate brand decision, not a limitation.

- Stock photography would destroy terminal-native credibility instantly
- Custom photography is unnecessary -- GSP's content IS its visual language
- The only exception: contributor headshots on an About page, treated minimally (grayscale, small, not hero)

---

## Illustration Policy

**No traditional illustration.** No icons from icon libraries in brand contexts. No hand-drawn elements. No 3D renders.

If iconography is needed (documentation navigation, feature indicators):
- Build from Unicode characters and box-drawing elements
- Monospace-aligned, single-color (text or amber)
- Functional, not decorative -- every icon communicates a specific state or action
- Diamond variants (`◇ ◆ ◈`) serve as the primary icon vocabulary

---

## Related

- [Logo Directions](./logo-directions.md)
- [Color System](./color-system.md)
- [Brand Applications](./brand-applications.md)
