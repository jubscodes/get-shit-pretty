# Design Trends Reference — Index

Production-ready specs for current design trends. Each trend is a self-contained file — load only what you need.

Last updated: 2026-03-04

---

## Trends

| # | Trend | File | Description | Compat |
|---|-------|------|-------------|--------|
| 1 | Liquid Glass | [liquid-glass.md](./trends/liquid-glass.md) | Apple's 2025 refractive glass with dynamic blur and fluid morphing | Safari 15+, Chrome 76+ |
| 2 | Glassmorphism | [glassmorphism.md](./trends/glassmorphism.md) | Frosted glass with backdrop-blur, subtle borders, layered depth | ~95% (needs -webkit-) |
| 3 | Neubrutalism | [neubrutalism.md](./trends/neubrutalism.md) | Bold flat aesthetic with thick borders and hard-offset shadows | All browsers |
| 4 | Bento Grid | [bento-grid.md](./trends/bento-grid.md) | Asymmetric modular grid inspired by Japanese bento boxes | All browsers |
| 5 | Claymorphism | [claymorphism.md](./trends/claymorphism.md) | Soft 3D inflated clay aesthetic with double inset shadows | All browsers |
| 6 | Aurora Gradients | [aurora-gradients.md](./trends/aurora-gradients.md) | Organic multi-directional color blends inspired by northern lights | All browsers |
| 7 | Kinetic Typography | [kinetic-typography.md](./trends/kinetic-typography.md) | Scroll-triggered and character-level text animation | All browsers (JS needed) |
| 8 | Micro-Interactions | [micro-interactions.md](./trends/micro-interactions.md) | Small UI responses to user actions — hover, click, focus, load | All browsers |
| 9 | Dark Mode (OLED) | [dark-mode-oled.md](./trends/dark-mode-oled.md) | True OLED optimization with pure blacks and surface hierarchy | All browsers |

## How to Use

- **Researcher agent:** Load this index, then load specific trend files relevant to the project's industry
- **System architect:** Pull exact CSS specs and token values from individual trend files
- **Each file contains:** Visual characteristics, verified CSS, implementation guide, framework notes, examples gallery, accessibility, performance, design tokens

---

## Trend Combination Compatibility

Some trends pair well; others clash. Use this matrix when mixing.

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
