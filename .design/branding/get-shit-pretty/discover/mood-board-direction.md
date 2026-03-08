# Mood Board Direction

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Color Direction

Dark-first. True black base. One warm accent. Monochrome hierarchy.

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| base | `#000000` | True black — OLED pixel off, terminal native |
| surface-1 | `#0A0A0A` | Barely lifted — cards on base |
| surface-2 | `#141414` | Secondary surfaces |
| surface-3 | `#1E1E1E` | Elevated elements (modals, popovers) |
| surface-4 | `#282828` | Highest elevation |

### Text Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | `#E0E0E0` | Primary text — off-white, prevents halation |
| text-secondary | `#A0A0A0` | Muted text, descriptions |
| text-tertiary | `#666666` | Disabled, placeholder |

### Accent Color

| Token | Hex | Usage |
|-------|-----|-------|
| accent-primary | `#E5A00D` | Warm amber/gold — CTAs, highlights, brand moments |
| accent-primary-muted | `#B8800A` | Desaturated variant for dark surfaces |
| accent-secondary | `#E0E0E0` | White-as-accent — borders, emphasis |

**Why amber/gold (#E5A00D):** Warm enough to feel human on a cold black background. Bold enough to be visible at small sizes. Distinct from Linear (blue), Vercel (white), shadcn (neutral). Gold signals craft and quality without luxury pretension. Works in both web (as color) and terminal (as ANSI yellow).

### Border System

| Token | Value | Usage |
|-------|-------|-------|
| border-subtle | `rgba(255, 255, 255, 0.08)` | Subtle separation |
| border-default | `rgba(255, 255, 255, 0.15)` | Standard borders |
| border-strong | `rgba(255, 255, 255, 0.25)` | Neubrutalist emphasis, card outlines |
| border-accent | `rgba(229, 160, 13, 0.4)` | Accent-colored borders |

---

## Typography Direction

Monospace for identity. Grotesque sans-serif for readability.

### Primary: JetBrains Mono

- **Use for:** Headings, brand name, labels, navigation, code
- **Why:** Open source (SIL license), designed for developers, excellent legibility, distinctive character. Includes ligatures for code contexts. More personality than IBM Plex Mono, more refined than Source Code Pro.
- **Weights:** Regular (400), Bold (700), ExtraBold (800)
- **Fallback:** `'Berkeley Mono', 'Geist Mono', 'SF Mono', monospace`

### Secondary: Inter

- **Use for:** Body text, descriptions, long-form content
- **Why:** Best-in-class proportional sans-serif for UI. Used by Linear (brand credibility). Variable font with optical sizing. Free. Industry standard.
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Fallback:** `'Geist Sans', 'SF Pro', -apple-system, sans-serif`

### Type Scale

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Display | JetBrains Mono | 48-72px | 800 | -0.02em |
| H1 | JetBrains Mono | 36-48px | 700 | -0.02em |
| H2 | JetBrains Mono | 24-32px | 700 | -0.01em |
| H3 | JetBrains Mono | 18-24px | 700 | 0 |
| Body | Inter | 16-18px | 400 | 0 |
| Body small | Inter | 14px | 400 | 0.01em |
| Label | JetBrains Mono | 12-14px | 500 | 0.05em |
| Code | JetBrains Mono | 14px | 400 | 0 |

---

## Imagery and Visual Style

### ASCII Art as Brand Element

GSP should use ASCII art and box-drawing characters as a signature visual element. Not nostalgic/retro — refined and intentional.

```
+------------------------------------------+
|  GSP                                     |
|  Get Shit Pretty                         |
|                                          |
|  brand-to-build in the terminal          |
+------------------------------------------+
```

Box-drawing characters (`+`, `-`, `|`, Unicode variants `┌ ┐ └ ┘ ─ │`) work in both terminal output and web contexts. They reinforce the CLI-native identity.

### Imagery Principles

1. **No stock photography.** Ever. GSP is code-native; its visuals should be code-native.
2. **Screenshots as hero images.** Show the tool in action — terminal output, styled command results, before/after comparisons.
3. **Diagrams over illustrations.** Flow diagrams, architecture maps, positioning grids. Functional visuals, not decorative.
4. **Syntax highlighting as texture.** Code blocks with well-chosen syntax themes can serve as background texture or section dividers.

### Texture and Pattern

- Subtle dot grid pattern at very low opacity (2-4%) on surface backgrounds — references engineering graph paper
- Horizontal scan lines at extreme subtlety (1-2% opacity) — references terminal CRT monitors without being kitsch
- No gradients except for rare atmospheric moments (aurora-style, like Linear, for hero sections only)

---

## Overall Feel

**The terminal, elevated.** GSP should feel like the best-designed terminal you have ever seen — precise, dark, warm (not cold), monospace-first, structurally beautiful. It should feel like a tool made by someone who sweats the details.

**Reference gradient:**
- Omarchy's terminal-as-design-medium philosophy and system-wide theme coherence
- Gumroad's bold, opinionated neubrutalism
- Raycast's keyboard-first, developer-native craft
- GSD's irreverent, direct personality

**What it is not:**
- Not corporate (no blue gradients, no stock photos, no generic SaaS)
- Not agency-polished (no overly smooth animations, no glass-heavy effects)
- Not cutesy (no rounded corners everywhere, no pastel palettes, no emoji-heavy)
- Not retro for retro's sake (no green-on-black CRT, no pixel fonts)

---

## Related

- [Trend Analysis](./trend-analysis.md)
- [Strategic Recommendations](./strategic-recommendations.md)
- [Audience Personas](./audience-personas.md)
