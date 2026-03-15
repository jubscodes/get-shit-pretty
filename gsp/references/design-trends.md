# Design Trends Reference — Index

Production-ready style presets and deep engineering references for current design trends. Consolidated in the `/gsp:style` skill.

Last updated: 2026-03-14

---

## Style Presets (34)

Style presets with structured tokens live in the `/gsp:style` skill at `skills/gsp-style/styles/`. Each preset is a YAML file with color, typography, shape, elevation, spacing, and motion tokens ready for W3C Design Token expansion.

Run `/gsp:style --list` to see all available styles, or read `skills/gsp-style/styles/INDEX.yml` for the full catalog with tags and vibes.

## Deep Engineering References (9)

Detailed CSS implementation guides, framework notes, and accessibility analysis live in the `/gsp:style` skill at `skills/gsp-style/trends/`:

| # | Trend | Description | Compat |
|---|-------|-------------|--------|
| 1 | Liquid Glass | Apple's 2025 refractive glass with dynamic blur and fluid morphing | Safari 15+, Chrome 76+ |
| 2 | Glassmorphism | Frosted glass with backdrop-blur, subtle borders, layered depth | ~95% (needs -webkit-) |
| 3 | Neubrutalism | Bold flat aesthetic with thick borders and hard-offset shadows | All browsers |
| 4 | Bento Grid | Asymmetric modular grid inspired by Japanese bento boxes | All browsers |
| 5 | Claymorphism | Soft 3D inflated clay aesthetic with double inset shadows | All browsers |
| 6 | Aurora Gradients | Organic multi-directional color blends inspired by northern lights | All browsers |
| 7 | Kinetic Typography | Scroll-triggered and character-level text animation | All browsers (JS needed) |
| 8 | Micro-Interactions | Small UI responses to user actions — hover, click, focus, load | All browsers |
| 9 | Dark Mode (OLED) | True OLED optimization with pure blacks and surface hierarchy | All browsers |

## How to Use

- **Researcher agent:** Read this index for awareness, then validate trends via open web research. Load specific trend files from the style skill only when research confirms relevance.
- **System architect:** Pull exact CSS specs and token values from individual trend files or style presets.
- **Style skill:** Expands YAML presets into W3C Design Tokens + foundation chunks.

---

## Trend Combination Compatibility

Some trends pair well; others clash. Use this matrix when mixing. Also see `styles/INDEX.yml` for per-preset compatibility and clash lists.

| | Liquid Glass | Glassmorphism | Neubrutalism | Bento | Clay | Aurora | Kinetic Type | Micro-ix | Dark OLED |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Liquid Glass** | - | ++ | -- | + | - | ++ | + | ++ | + |
| **Glassmorphism** | ++ | - | -- | + | - | ++ | + | ++ | ++ |
| **Neubrutalism** | -- | -- | - | + | -- | -- | ++ | + | + |
| **Bento Grid** | + | + | + | - | + | + | + | ++ | + |
| **Claymorphism** | - | - | -- | + | - | - | + | ++ | - |
| **Aurora** | ++ | ++ | -- | + | - | - | + | + | ++ |
| **Kinetic Type** | + | + | ++ | + | + | + | - | ++ | + |
| **Micro-ix** | ++ | ++ | + | ++ | ++ | + | ++ | - | ++ |
| **Dark OLED** | + | ++ | + | + | - | ++ | + | ++ | - |

`++` great pairing | `+` compatible | `-` awkward | `--` clash
