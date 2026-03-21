# Landing Page

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Purpose

Entry point for all visitors. Converts awareness to installation. Dev copies the install command. Des understands the methodology and shares the link.

**Flow position:** First page. Arrived from GitHub README, social post, or search.

---

## Layout Overview

Full-width page, sections stacked vertically. Each section constrained to `max-w-grid` (1200px) centered with `mx-auto`. Sections separated by 96px (`space-24`) vertical spacing on desktop, 64px (`space-16`) on mobile.

```
┌─────────────────────────────────────────────────────────┐
│ [Nav]  (sticky, shared)                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Hero]  atmospheric bg, headline, CTAs, terminal mock   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [What is GSP]  two-column: prose + terminal             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Pipeline]  dual diamond visualization                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Features]  3-column card grid                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Meta Signal]  whisper: "designed by GSP"               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [CTA Footer]  install command repeated                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Footer]  (shared)                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Section 1: Navigation

See [shared/navigation.md](./shared/navigation.md).

Sticky at top. Brand mark left, links right. `border-b border-border bg-bg/80 backdrop-blur-sm`.

---

## Section 2: Hero

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ ·  ✧  .    ·  atmospheric ASCII art field   .  ·  ✧  . │
│                                                         │
│              OVERLINE: DESIGN ENGINEERING                │
│                                                         │
│            Get Shit Pretty                              │
│                                                         │
│     Design decisions, not design debt.                  │
│     Brand-to-build in your terminal.                    │
│                                                         │
│     [npm install -g get-shit-pretty]  [GitHub →]        │
│                                                         │
│     ┌─────────────────────────────────────┐             │
│     │ ● ● ●                               │             │
│     │ $ gsp                               │             │
│     │                                     │             │
│     │  /gsp: ◇◇                           │             │
│     │                                     │             │
│     │  ◇ discover ─── ◇ strategy ─── ...  │             │
│     │                                     │             │
│     └─────────────────────────────────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

- **AtmosphericBg** — ASCII art field positioned behind hero content. A sparse grid of sparkle characters (`.`, `·`, `✧`) and diamond glyphs (`◇`, `◈`) rendered as a monospace text layer at low opacity (8-12%). Characters use expression palette colors (lavender #B8A9D4, rose #E8B4C8) at varying opacities to create depth. The field is generated procedurally or from a static pattern, rendered as a `<pre>` or CSS grid of characters with `pointer-events: none`. Density increases toward center (where the headline sits) and fades at edges — a sparkle density ramp adapted from the terminal banner component. This is terminal-native design brought to the web: the background IS monospace art, not a gradient pretending to be atmospheric
- **Overline** — `text-overline font-primary font-bold tracking-widest text-text-muted uppercase`. Content: "DESIGN ENGINEERING"
- **Headline** — `font-display font-bold text-display-1 text-text-bright tracking-tighter leading-none`. Content: "Get Shit Pretty"
- **Subhead** — `font-primary text-body text-text-muted leading-loose max-w-lg`. Two lines of value prop
- **Primary CTA** — InstallCommand component. Displays `npm install -g get-shit-pretty`. Click copies to clipboard. Styled as primary button: `bg-accent text-on-accent font-primary font-bold text-body-sm rounded-sm border border-accent px-4 py-2`
- **Secondary CTA** — Button (outline variant). "View on GitHub". `bg-transparent text-text border border-border-strong rounded-sm px-4 py-2 hover:border-accent hover:text-accent`
- **TerminalMock** — Below CTAs, centered, max-width 672px (max-w-2xl). Shows GSP startup output: brand mark, pipeline flow preview

### Spacing

- Hero padding: `py-24` (96px top/bottom) on desktop, `py-16` (64px) on mobile
- Overline to headline: `mb-4` (16px)
- Headline to subhead: `mt-6` (24px)
- Subhead to CTAs: `mt-8` (32px)
- CTAs to TerminalMock: `mt-12` (48px)
- Content centered: `text-center mx-auto`

### Responsive

- **Desktop:** Display 1 headline, inline CTAs, TerminalMock at max-w-2xl
- **Tablet:** Display 1 scales down via clamp, same layout
- **Mobile:** Headline scales to ~56px. CTAs stack full-width. TerminalMock full-width with 16px margin

---

## Section 3: What is GSP

### Layout

```
┌──────────────────────┬──────────────────────────────────┐
│                      │                                  │
│  OVERLINE: HOW IT    │  ┌────────────────────────────┐  │
│  WORKS               │  │ ● ● ●                      │  │
│                      │  │ $ gsp brand-identity        │  │
│  H2: A design        │  │                            │  │
│  engineer in your    │  │  ◈ Generating palette...   │  │
│  terminal            │  │                            │  │
│                      │  │  Primary: #E5A00D (amber)  │  │
│  Body text: GSP      │  │  Surface: #111111          │  │
│  walks you through   │  │  Text:    #E8E8E8          │  │
│  brand strategy to   │  │                            │  │
│  design tokens...    │  │  ◆ Palette written to      │  │
│                      │  │    .design/tokens.json     │  │
│                      │  └────────────────────────────┘  │
│                      │                                  │
└──────────────────────┴──────────────────────────────────┘
```

### Components

- **Overline** — "HOW IT WORKS", `text-overline text-text-muted uppercase tracking-widest`
- **H2** — `font-primary font-bold text-h2 text-text-bright tracking-snug`. "A design engineer in your terminal"
- **Body** — `font-primary text-body text-text leading-loose max-w-md`. 2-3 paragraphs explaining what GSP does
- **TerminalMock** — Shows a realistic GSP command running: brand-identity generating a palette. Animated cursor optional (CSS only)

### Grid

- Desktop: 5-col prose + 7-col terminal (within 12-col grid)
- Tablet: 4+4 within 8-col grid
- Mobile: Single column, prose above terminal

### Spacing

- Section padding: `py-24` desktop, `py-16` mobile
- Overline to H2: `mb-4`
- H2 to body: `mt-4`
- Grid gap: `gap-12` (48px) desktop, `gap-8` (32px) mobile

---

## Section 4: Pipeline Visualization

### Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  OVERLINE: THE PROCESS                                  │
│                                                         │
│  H2: Dual diamond. Brand to build.                      │
│                                                         │
│  Branding                                               │
│  ◆ discover ─── ◆ strategy ─── ◆ identity ─── ◆ system │
│                                                         │
│  Project                                                │
│  ◆ brief ─── ◆ research ─── ◈ design ─── ◇ critique    │
│          ─── ◇ build ─── ◇ review                       │
│                                                         │
│  Body-sm: explanation text below                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

- **PipelineViz** — Full custom component. Two horizontal rows of connected diamond nodes
  - Row labels: "Branding" and "Project" in `text-caption text-text-muted uppercase tracking-wider`
  - Completed nodes: `◆` in `text-text`, phase name in `text-text`
  - Active node: `◈` in `text-accent font-bold`, phase name in `text-accent font-bold`. Lavender glow behind (expression at 15% opacity, CSS `nodePulse` animation)
  - Pending nodes: `◇` in `text-text-muted`, phase name in `text-text-muted`
  - Connectors: `───` in `text-border` between nodes
- **Overline** — "THE PROCESS"
- **H2** — "Dual diamond. Brand to build."
- **Body-sm** — Brief explanation below the visualization

### Accessibility

- Entire PipelineViz wrapped in `role="img"` with `aria-label="GSP dual diamond pipeline: Branding phase has four steps (discover, strategy, identity, system). Project phase has six steps (brief, research, design, critique, build, review)."`
- Individual nodes are decorative within the img role — not individually focusable
- Phase names are visible text, so the diamond glyphs are supplementary

### Responsive

- **Desktop:** Horizontal, two rows, generous spacing
- **Tablet:** Horizontal but compact, smaller gaps between nodes
- **Mobile:** Vertical compact layout. Each pipeline stacks nodes vertically with `│` connectors

---

## Section 5: Features Grid

### Layout

```
┌──────────────────┬──────────────────┬──────────────────┐
│ ◆                │ ◆                │ ◆                │
│ Brand Strategy   │ Design Tokens    │ Type & Color     │
│                  │                  │                  │
│ Body-sm text     │ Body-sm text     │ Body-sm text     │
│ describing the   │ describing the   │ describing the   │
│ feature...       │ feature...       │ feature...       │
├──────────────────┼──────────────────┼──────────────────┤
│ ◆                │ ◆                │ ◆                │
│ Component System │ Terminal Native  │ Open Source      │
│                  │                  │                  │
│ Body-sm text     │ Body-sm text     │ Body-sm text     │
│ describing...    │ describing...    │ describing...    │
└──────────────────┴──────────────────┴──────────────────┘
```

### Components

- **Card** (refactored shadcn) — `bg-surface border border-border rounded-md p-6 hover:border-border-strong transition-colors duration-normal`
- Each card contains:
  - **Icon** — Diamond glyph `◆` in `text-accent text-h2` (decorative accent)
  - **H3** — `font-primary font-bold text-h3 text-text-bright mt-4`
  - **Body-sm** — `font-primary text-body-sm text-text-muted mt-2 leading-relaxed`

### Grid

- Desktop: `grid grid-cols-3 gap-6`
- Tablet: `grid grid-cols-2 gap-6`
- Mobile: `grid grid-cols-1 gap-4`

### Feature List (6 cards)

1. **Brand Strategy** — Positioning, archetype, voice. Strategy before pixels.
2. **Design Tokens** — Colors, type, spacing exported as code-ready tokens.
3. **Type & Color** — OKLCH palettes, fluid type scales, contrast-tested.
4. **Component Foundations** — Specs for buttons, cards, inputs, navigation.
5. **Terminal Native** — Runs inside Claude Code, OpenCode, Gemini CLI, Codex.
6. **Open Source** — MIT licensed. Your brand, your tokens, your codebase.

---

## Section 6: Meta Signal

### Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ──────────── separator ────────────                    │
│                                                         │
│  Caption text, centered, muted:                         │
│  "This site was designed by GSP."                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

- **Separator** — `bg-border` horizontal line
- **Caption** — `font-primary text-caption text-text-muted text-center tracking-wider`. Content: "This site was designed by GSP." — a whisper, not a shout

### Spacing

- `py-8` (32px) above and below
- Separator has `mb-8`

---

## Section 7: CTA Footer

### Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  H2: Ready to ship something pretty?                    │
│                                                         │
│  ┌─────────────────────────────────────────────┐        │
│  │ $ npm install -g get-shit-pretty        [⎘] │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  View on GitHub →                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

- **H2** — `font-primary font-bold text-h2 text-text-bright text-center`
- **InstallCommand** — Same component as hero, repeated. Full-width on mobile, max-w-lg centered on desktop
- **GitHub link** — `font-primary text-body-sm text-text-muted hover:text-accent`. External link icon

### Spacing

- `py-24` padding
- H2 to InstallCommand: `mt-8`
- InstallCommand to GitHub link: `mt-6`

---

## Section 8: Footer

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ ──────────── separator ────────────                     │
│                                                         │
│  /gsp: ◇◇                    npm · GitHub · MIT         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

- **Separator** — Full-width border-top
- **Brand mark** — `/gsp: ◇◇` in `font-primary text-body-sm text-text-muted`
- **Links** — npm, GitHub, MIT license. `font-primary text-caption text-text-muted hover:text-accent`. Separated by `·` (middle dot)

### Spacing

- `py-8` padding
- Flex row, `justify-between items-center`

---

## States

### Default

All sections render with content as described above. Pipeline shows a demo state (branding complete, project at design phase).

### Loading

Page is statically generated — no loading state for content. If JavaScript is disabled, all CSS-only animations still work. Scroll reveal elements start visible (no `.reveal` class without JS).

### Error

No dynamic data to fail. If the page cannot be served, Next.js default error boundary applies. No custom error UI needed for static content.

---

## Accessibility

### VoiceOver Reading Order

1. Skip-to-content link
2. Nav: brand mark, Changelog link, GitHub link
3. Hero: overline, headline, subheadline, primary CTA (install command), secondary CTA (GitHub), terminal mock (role="img" with alt)
4. What is GSP: overline, heading, body text, terminal mock (role="img")
5. Pipeline: overline, heading, pipeline visualization (role="img" with full description), body text
6. Features: section heading implied, then card 1 (title, description), card 2, etc.
7. Meta signal: caption text
8. CTA footer: heading, install command, GitHub link
9. Footer: brand mark, links

### Focus Management

- Tab order follows visual order (no `tabindex` manipulation needed)
- All interactive elements (links, buttons, copy button) have visible focus rings: `outline-2 outline-accent outline-offset-2`
- InstallCommand copy button announces "Copy install command" via `aria-label`, state change announced via `aria-live="polite"` region: "Copied to clipboard"

### Landmarks

- `<header>` — navigation
- `<main id="main">` — all content sections
- `<section>` — each content section with `aria-labelledby` pointing to its heading
- `<footer>` — site footer

### Motion

- All animations respect `prefers-reduced-motion: reduce`
- Scroll reveals default to visible without animation
- Pipeline pulse stops

---

## Related

- [Navigation](./shared/navigation.md)
- [Micro-interactions](./shared/micro-interactions.md)
- [Responsive](./shared/responsive.md)
- [Component Plan](./shared/component-plan.md)
- [Screen 02: Changelog List](./screen-02-changelog-list.md)
