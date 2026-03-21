# Elevation

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

GSP uses **no shadows**. This is a design decision, not an omission.

Shadows imply a light source and physical layering -- metaphors that belong to material design, not to terminal-native tools. The Creator archetype values precision over effect. Drop shadows are decoration; GSP's depth system is structural.

Depth is communicated through three mechanisms: **background color steps**, **border differentiation**, and **text color hierarchy**. These work in both terminal and web contexts.

---

## Depth Through Color Steps

Elevation is expressed by stepping through the neutral scale. Deeper backgrounds are lower; lighter backgrounds are higher.

| Level | Token | Background | Border | Usage |
|-------|-------|-----------|--------|-------|
| 0 - Void | `--color-bg` | `#050505` | none | Page background, the base layer |
| 1 - Surface | `--color-surface` | `#111111` | `#1E1E1E` | Cards, panels, modals |
| 2 - Elevated | `--color-surface-elevated` | `#1E1E1E` | `#404040` | Popovers, dropdowns, nested panels |
| 3 - Overlay | `#2C2C2C` | `#2C2C2C` | `#404040` | Tooltips, floating elements |

Each step is a ~5-8 lightness increment in OKLCH (0.13 -> 0.18 -> 0.23 -> 0.25). The steps are perceptually even.

### Light Mode Equivalent

| Level | Background | Border |
|-------|-----------|--------|
| 0 - Base | `#FAFAFA` | none |
| 1 - Surface | `#F1F1F1` | `#DFDFDF` |
| 2 - Elevated | `#E8E8E8` | `#C1C1C1` |
| 3 - Overlay | `#DFDFDF` | `#A3A3A3` |

---

## Depth Through Borders

Borders serve the role that shadows play in other systems -- they define boundaries and create visual separation.

| Border Purpose | Token | Dark Value | Light Value |
|---------------|-------|-----------|-------------|
| Structural (default) | `--color-border` | `#1E1E1E` | `#DFDFDF` |
| Emphasis (focus, active) | `--color-border-strong` | `#404040` | `#A3A3A3` |
| Accent (brand moments) | `--color-accent-dim` | `#4A3810` | `#F9E8C4` |
| Interactive (hover) | `--color-accent` | `#E5A00D` | `#B07B0A` |

**Border width:** 1px default. Never 2px for emphasis -- use color differentiation instead.

---

## Depth Through Text Hierarchy

Text color creates implicit depth. Brighter text advances; dimmer text recedes.

| Text Level | Token | Value | Perceived Depth |
|-----------|-------|-------|-----------------|
| Emphasis | `--color-text-bright` | `#FAFAFA` | Foreground -- demands attention |
| Primary | `--color-text` | `#E8E8E8` | Content layer -- comfortable reading |
| Secondary | `--color-text-muted` | `#6B6B6B` | Receded -- metadata, hints |
| Disabled | `--color-text-disabled` | `#404040` | Deeply receded -- inactive elements |

---

## Terminal Depth

In the terminal, depth is communicated through structural patterns, not color alone.

| Depth Technique | Implementation | Example |
|----------------|----------------|---------|
| Indentation | 2-char indent per level | Nested list items, tree views |
| Box-drawing nesting | Nested `┌─┐` structures | Panels within panels |
| Color dimming | Muted color for secondary info | File paths, timestamps |
| Casing hierarchy | UPPERCASE > Title Case > lower | Phase banners > sections > body |
| Spacing | Blank lines between depth levels | Sections separated by 2 lines |

### Terminal Depth Example

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   ← Level 0: phase banner (accent, heavy box)
┃  IDENTITY COMPLETE             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Color System                        ← Level 1: section header (bright, bold)
  ┌─────────────────────────────┐
  │ Foundation  5 tokens         │    ← Level 2: content box (text, normal)
  │ Accent      4 tokens         │
  │ Semantic    4 tokens         │
  │                              │
  │ palettes.json                │    ← Level 3: metadata (muted)
  └─────────────────────────────┘
```

---

## Why Not Shadows

| Concern | Shadow Approach | GSP Approach |
|---------|----------------|-------------|
| Elevation signaling | Box shadow blur + offset | Background color step |
| Boundary definition | Shadow edge | Border line |
| Interactive feedback | Shadow intensification | Border color change |
| Focus indication | Shadow ring | Border-strong + accent color |
| Layering (modals) | Shadow behind modal | Background overlay (rgba) |

Shadows require compositor rendering and do not translate to terminal contexts. Color steps and borders work everywhere -- web, terminal, print, ASCII.

---

## CSS Implementation

```css
/* No shadow tokens -- intentional. */
/* Use background + border steps for elevation. */

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.popover {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-strong);
}

.overlay-backdrop {
  background: rgba(5, 5, 5, 0.7);
}
```

---

## Related

- [Color System](./color-system.md)
- [Border Radius](./border-radius.md)
- [Spacing](./spacing.md)
