# Component Plan

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Reuse (as-is, with token override)

These shadcn components work with the global CSS variable override from `target-adaptations.md`. No structural changes needed.

| Component | Usage | Override |
|-----------|-------|----------|
| Badge | Blog post tags, version labels | Token override gives pill shape + muted colors automatically |
| Separator | Section dividers, footer border | Maps to `--border` color |
| Scroll Area | Code block horizontal overflow | Muted scrollbar via token override |

## Refactor (install + adapt)

These shadcn components need class-level modifications beyond token override.

| Component | Changes | Reference |
|-----------|---------|-----------|
| Button | Remove all `shadow-*` classes. Force `font-primary` (monospace). Primary: amber bg, void text. Outline: transparent bg, border-strong, amber on hover. `rounded-sm` (2px) | `target-adaptations.md` > Button |
| Card | Remove all `shadow-*` classes. `bg-surface border border-border rounded-md`. Hover: `border-border-strong`. No elevation | `target-adaptations.md` > Card |
| Navigation Menu | Force `font-primary text-body-sm`. Link colors: `text-muted -> text-accent` on hover, `text-bright font-medium` when active. Sticky container with backdrop blur | `target-adaptations.md` > Navigation |

## New (shared)

Custom components used across multiple screens or reusable in future projects.

| Component | Description | Used in | Tokens |
|-----------|-------------|---------|--------|
| AtmosphericBg | CSS-only radial gradient overlay using expression palette (lavender at 12%, rose at 8%) on void. Absolutely positioned behind content. Renders as `::before` pseudo-element or dedicated `<div>` | Screen 01 (Hero) | `--color-expression-lavender`, `--color-expression-rose`, `--color-bg` |
| TerminalMock | Fake terminal window. Void bg, border, no radius. Top bar with three dots (muted). Monospace content area. Supports syntax-highlighted GSP output | Screen 01 (Hero, What is GSP) | `--color-bg`, `--color-border`, `--color-text`, `--color-accent`, `--font-mono` |
| InstallCommand | Copyable code block. Displays `npm install -g get-shit-pretty`. Click-to-copy button (clipboard icon). Sonner toast on copy. Monospace, no radius, border | Screen 01 (Hero, CTA Footer) | `--color-surface`, `--color-border`, `--color-text`, `--color-accent`, `--font-mono` |
| PipelineViz | Dual diamond visualization. Two rows: Branding (4 phases) and Project (6 phases). Connected nodes with diamond glyphs (◇ ◈ ◆). CSS-only animation for active node glow. Horizontal on desktop, vertical compact on mobile | Screen 01 (Pipeline) | `--color-text`, `--color-accent`, `--color-text-muted`, `--color-border`, `--color-expression-lavender`, diamond component tokens |

## New (local)

Components specific to a single screen.

| Component | Screen | Description |
|-----------|--------|-------------|
| PostLayout | Screen 03 | MDX-rendered blog post container. Prose styling for headings, paragraphs, lists, blockquotes, code blocks. Centered reading column. Applies full type scale |

---

## Dependency Graph

```
Screen 01 (Landing)
├── AtmosphericBg
├── TerminalMock
├── InstallCommand
├── PipelineViz
├── Card (refactored shadcn)
├── Button (refactored shadcn)
├── Badge (shadcn as-is)
└── Separator (shadcn as-is)

Screen 02 (Changelog List)
├── Badge (shadcn as-is)
└── Separator (shadcn as-is)

Screen 03 (Changelog Post)
├── PostLayout (local)
├── Badge (shadcn as-is)
└── Scroll Area (shadcn as-is)

Shared Layout
├── Navigation Menu (refactored shadcn)
├── Separator (shadcn as-is)
└── Button (refactored shadcn) [footer]
```

---

## Related

- [Micro-interactions](./micro-interactions.md)
- [Responsive](./responsive.md)
- [Screen 01: Landing](../screen-01-landing.md)
- [Screen 02: Changelog List](../screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../screen-03-changelog-post.md)
