# Mood Board Direction

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-18

---

## Overall Feel

**"Terminal precision meets design irreverence."**

The mood is the brief's reference brought to life: Teenage Engineering meets Vercel. That means monochrome confidence as the foundation, but with a single high-personality accent that breaks the seriousness. Not cyberpunk neon. Not corporate blue. Something unexpected that says "I care about design AND I ship from the terminal."

The visual identity should feel like opening a beautifully configured terminal -- dark, precise, considered -- and then encountering a moment of personality that makes you grin. The craft is in the restraint. The personality is in the punctuation.

## Color Direction

### Foundation: Monochrome Core

GSP must work in pure black and white first. Terminal constraint is design constraint.

| Role | Hex | Usage |
|------|-----|-------|
| Void | `#050505` | Primary background. Near-black, not pure black -- reduces harshness on OLED. |
| Surface | `#111111` | Cards, panels, elevated surfaces. One step up from void. |
| Border | `#1E1E1E` | Subtle structural lines. Present but not dominant. |
| Muted | `#6B6B6B` | Secondary text, captions, metadata. |
| Text | `#E8E8E8` | Primary text. Warm white, not blue-white. Reduces eye strain. |
| Bright | `#FAFAFA` | Headlines, emphasis. Near-white for maximum contrast moments. |

### Accent: The Personality Layer

The accent color is the brand's most important visual decision. It must:
- Work as a terminal ANSI color
- Read clearly on dark backgrounds
- Feel distinct from Vercel (no pure white/black only), Linear (no purple), shadcn (no neutral zinc), and jubs.studio (no neon green #00FF88 or burnt orange)
- Signal craft and confidence without corporate energy

**Recommendation: Warm amber/gold -- `#E5A00D`**

Rationale:
- Amber is the color of terminal cursors, caution tape, and builder tools. It says "attention" and "craft" simultaneously.
- It sits between Teenage Engineering's playful orange and Vercel's austere absence of color -- confident but warm.
- It works as ANSI yellow in terminal contexts.
- It contrasts sharply with the jubs.studio palette (green/orange), establishing GSP as its own entity in the founder ecosystem.
- It carries the "irreverent but precise" tone: amber is not a "safe" brand color. It is a choice.

| Role | Hex | Usage |
|------|-----|-------|
| Accent | `#E5A00D` | Primary accent. Interactive elements, highlights, brand moments. |
| Accent Bright | `#F5C842` | Hover states, emphasis on accent. |
| Accent Muted | `#8B6914` | Subtle accent applications, backgrounds. |

### Semantic Colors

Kept minimal and functional. These are signals, not brand elements.

| Role | Hex | Usage |
|------|-----|-------|
| Error | `#E54D42` | Errors, destructive actions. Warm red, not alarming. |
| Success | `#3FB950` | Confirmations, completion. GitHub-green, familiar in terminal. |
| Info | `#58A6FF` | Informational highlights. Cool blue, minimal usage. |
| Warning | `#D29922` | Warnings. Close to accent -- intentional overlap. |

## Typography

### Primary: JetBrains Mono

**Use JetBrains Mono for everything terminal-facing and most brand applications.**

- Free and open source (Apache 2.0) -- aligns with GSP's open-source values
- Designed for extended code reading with increased letter height and distinct character forms
- 8M+ downloads, instant developer recognition
- Ligature support for code contexts
- Available on Google Fonts for web use

Weights to use:
- **Bold (700)** for headlines and emphasis
- **Medium (500)** for subheadings and navigation
- **Regular (400)** for body text and terminal output
- **Light (300)** for metadata and captions (sparingly)

### Display: Space Grotesk

**Use Space Grotesk for large display moments where monospace would feel constrained.**

Wait -- Space Grotesk is already claimed by jubs.studio. GSP needs its own display face.

**Use Instrument Sans for display headlines.**

- Geometric sans-serif by Rodrigo Fuenzalida, available on Google Fonts (free)
- Sharp, modern geometry that complements monospace without competing
- Works at large sizes for landing pages, conference slides, promotional materials
- Distinct from Inter (shadcn/Cursor), Geist Sans (Vercel), and Space Grotesk (jubs.studio)

Weights to use:
- **Bold (700)** for display headlines only
- **SemiBold (600)** for section headers in non-terminal contexts

### Pairing Logic

| Context | Font | Weight |
|---------|------|--------|
| Terminal output | JetBrains Mono | 400 |
| CLI headings | JetBrains Mono | 700 |
| Web headlines | Instrument Sans | 700 |
| Web body | JetBrains Mono | 400 |
| Web code blocks | JetBrains Mono | 400 |
| Documentation | JetBrains Mono | 400/500 |
| Marketing display | Instrument Sans | 700 |

## Imagery Style

### ASCII as Art, Not Decoration

GSP's primary visual medium is text. ASCII art is not a fallback -- it is the native visual language. The brand should invest in high-quality ASCII illustrations that demonstrate craft.

Characteristics:
- **Box-drawing characters** for structure (not asterisks or dashes)
- **Considered whitespace** -- ASCII art should breathe, not fill every character cell
- **Functional, not ornamental** -- diagrams, progress visualization, architecture maps
- **Personality through surprise** -- unexpected ASCII moments that reward attention

### Photography/Illustration: Not Primary

GSP does not need photography or illustration as core brand elements. If used (documentation, blog posts, social media):
- **Screenshots of terminal output** styled as hero images
- **Code snippets as visual content** -- the code IS the imagery
- **Architectural diagrams** rendered in monospace
- **No stock photography.** Ever. It would destroy the brand's credibility instantly.

### Texture and Pattern

- **Subtle dot grid** at very low opacity (0.02-0.04) on surfaces -- references graph paper and engineering precision
- **No noise/grain** -- the terminal aesthetic is clean, not distressed
- **Scanlines only if very subtle** -- a nod to CRT heritage without cosplaying retro

## Shape and Structure

| Property | Value | Rationale |
|----------|-------|-----------|
| Border radius | `2px-4px` | Sharp, not soft. Terminal windows have minimal rounding. |
| Border width | `1px` | Present but not heavy. Not neubrutalism thick. |
| Border color | `#1E1E1E` | Barely visible structure. |
| Spacing base | `8px` | Standard 8-point grid. |
| Line height | `1.7` | Generous for monospace readability. |

## Motion

Minimal and purposeful. The brand moves like a terminal -- fast response, no theatrics.

- **Transitions**: 100-150ms, linear or ease-out. No spring physics.
- **Loading states**: Typed text animation (characters appearing) rather than spinners.
- **Hover effects**: Subtle background color shift, not scale or shadow changes.
- **Page transitions**: Instant. No slide-ins, no fades.

## Brand Differentiation Within Founder Ecosystem

| Element | jubs.studio | cyphercn | GSP |
|---------|-------------|----------|-----|
| Primary color | Neon green #00FF88 | TBD (retro-terminal) | Amber #E5A00D |
| Accent | Burnt orange | TBD | Monochrome + amber |
| Primary font | Space Grotesk | TBD | JetBrains Mono |
| Display font | Space Grotesk | TBD | Instrument Sans |
| Mono font | JetBrains Mono | TBD | JetBrains Mono (shared DNA) |
| Vibe | Cyberpunk editorial | Retro-terminal | Precise irreverence |
| Background | CRT dark | TBD | Void black #050505 |

The shared JetBrains Mono connects the ecosystem. The distinct accent colors and display faces separate the identities.

---

## Style Affinity

### Recommended GSP Style Presets

Based on research findings, these presets from the GSP style library align with the direction established above:

**1. `terminal`**
- **Tag matches:** developer, monospace, dark, minimal, technical
- **Rationale:** The terminal preset is the structural foundation. GSP is a CLI tool -- its color tokens, monospace-first typography, and dark background approach directly match the market positioning. However, the preset's default green primary (#22C55E) should be swapped for amber to differentiate from generic "hacker" aesthetics and from jubs.studio's green.

**2. `monochrome`**
- **Tag matches:** black-white, monochrome, high-contrast, minimal
- **Rationale:** The monochrome trend analysis confirms that GSP's strongest competitors (Vercel, Linear) succeed through typographic depth over color. The monochrome preset's zero-decoration, zero-shadow approach matches GSP's "opinionated minimalism" direction. Use its dark mode tokens (#000000 background, #FFFFFF text) as the severity test: if the brand works in pure monochrome, the accent color is truly additive, not required.

**3. `bold-typography`**
- **Tag matches:** type-driven, editorial, bold, dark, expressive
- **Rationale:** GSP's name has inherent personality ("get shit pretty"). The bold-typography preset's approach -- massive headlines, extreme scale contrast, poster aesthetic -- matches moments where GSP needs to be loud (marketing, conference presence, README headers). Use selectively for display contexts where JetBrains Mono at large sizes creates the "monospace as design choice" effect the trend analysis recommends.

### Presets Explicitly Not Recommended

- **`cyberpunk`** -- Too close to jubs.studio's neon aesthetic. Would blur the founder ecosystem distinction.
- **`modern-dark`** -- Too close to Vercel/Linear. GSP needs to feel CLI-native, not SaaS-polished. The ambient blobs and mouse spotlights are antithetical to terminal precision.
- **`neubrutalism`** -- The thick borders and hard shadows conflict with GSP's restrained structural approach. The playfulness is right but the execution is wrong for this brand.

---

## Related

- [Competitive Audit](./competitive-audit.md)
- [Trend Analysis](./trend-analysis.md)
