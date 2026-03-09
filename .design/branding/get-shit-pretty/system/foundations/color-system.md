# Color System

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Terminal Color Strategy

GSP is dark-only. The terminal background is the user's own -- we never set it. Color is signal, not decoration. Burnt orange emerges from the void. The Magician's reveal.

Three rendering tiers ensure every terminal gets the brand experience:

| Tier | Support | Detection |
|------|---------|-----------|
| **True color (24-bit)** | iTerm2, Kitty, WezTerm, Windows Terminal, most modern terms | `COLORTERM=truecolor` or `COLORTERM=24bit` |
| **ANSI 256** | Nearly universal | `TERM` contains `256color` |
| **ANSI 16** | Everything, including CI/CD pipes | Always available |

Always detect and degrade gracefully. Meaning must never depend on color alone.

---

## Brand Colors — Terminal Mappings

### Primary Accent: Burnt Orange

| Context | Hex | True Color (ANSI escape) | 256-Color | 16-Color |
|---------|-----|--------------------------|-----------|----------|
| **accent** (primary) | `#FF6B35` | `\x1b[38;2;255;107;53m` | `\x1b[38;5;209m` | `\x1b[33m` (yellow) |
| accent-light | `#F48148` | `\x1b[38;2;244;129;72m` | `\x1b[38;5;209m` | `\x1b[93m` (bright yellow) |
| accent-dark | `#D4501E` | `\x1b[38;2;212;80;30m` | `\x1b[38;5;166m` | `\x1b[33m` (yellow) |
| accent-muted | `#A33B14` | `\x1b[38;2;163;59;20m` | `\x1b[38;5;130m` | `\x1b[33m` (yellow) |
| accent-dim | `#72290E` | `\x1b[38;2;114;41;14m` | `\x1b[38;5;94m` | `\x1b[2;33m` (dim yellow) |

### Text Hierarchy

| Token | Hex | True Color | 256-Color | 16-Color | Use |
|-------|-----|------------|-----------|----------|-----|
| **text-primary** | `#E0E0E0` | `\x1b[38;2;224;224;224m` | `\x1b[38;5;254m` | `\x1b[37m` (white) | Headings, primary content, body |
| **text-secondary** | `#A0A0A0` | `\x1b[38;2;160;160;160m` | `\x1b[38;5;248m` | `\x1b[37m` (white) | Labels, descriptions, metadata |
| **text-tertiary** | `#666666` | `\x1b[38;2;102;102;102m` | `\x1b[38;5;242m` | `\x1b[2;37m` (dim) | Hints, decorative, sparkle field |

### Semantic Colors

| Token | Hex | True Color | 256-Color | 16-Color | Symbol | Use |
|-------|-----|------------|-----------|----------|--------|-----|
| **success** | `#22C55E` | `\x1b[38;2;34;197;94m` | `\x1b[38;5;41m` | `\x1b[32m` (green) | `✓` | Phase complete, file written |
| **warning** | `#FBBF24` | `\x1b[38;2;251;191;36m` | `\x1b[38;5;220m` | `\x1b[33m` (yellow) | `⚠` | Caution, override needed |
| **error** | `#EF4444` | `\x1b[38;2;239;68;68m` | `\x1b[38;5;196m` | `\x1b[31m` (red) | `✗` | Failure, fatal |
| **info** | `#60A5FA` | `\x1b[38;2;96;165;250m` | `\x1b[38;5;75m` | `\x1b[34m` (blue) | `ℹ` | Neutral information |
| **progress** | `#FF6B35` | `\x1b[38;2;255;107;53m` | `\x1b[38;5;209m` | `\x1b[33m` (yellow) | `◈` | In-progress, active |

### ANSI Reset

```
\x1b[0m
```

Always reset after every styled span. No style leakage.

---

## Syntax Highlighting Palette

For code blocks, file previews, and config display in terminal output.

| Token Type | Hex | True Color | Semantic Role |
|------------|-----|------------|---------------|
| Keywords | `#FF6B35` | `\x1b[38;2;255;107;53m` | Brand accent — commands, keys |
| Strings | `#FBBF24` | `\x1b[38;2;251;191;36m` | Warm adjacent — values, paths |
| Comments | `#666666` | `\x1b[38;2;102;102;102m` | Dim — annotations, hints |
| Functions | `#E0E0E0` | `\x1b[38;2;224;224;224m` | Primary — identifiers, names |
| Numbers | `#60A5FA` | `\x1b[38;2;96;165;250m` | Cool contrast — counts, sizes |

---

## Background Color Rules

**Never set the terminal background color.** The user's terminal is their space. GSP colors are foreground-only.

Exceptions (use sparingly):
- **Inline highlight:** `\x1b[48;2;255;107;53m\x1b[38;2;0;0;0m` — orange bg + black text for critical callouts only
- **Error banner:** `\x1b[48;2;239;68;68m\x1b[38;2;255;255;255m` — red bg + white text for fatal errors only

These exceptions must be a single line maximum. Never paint large background areas.

---

## Color Usage Rules

1. **Accent is signal.** Burnt orange marks the thing worth reading: the brand name, the phase transition, the key value. If everything is orange, nothing is.
2. **Dim is atmosphere.** Text-tertiary and ANSI dim create depth without competing. Sparkle fields, decorative borders, secondary metadata.
3. **Semantic colors are functional.** Green means done. Red means broken. Yellow means careful. Blue means neutral info. Never use semantic colors decoratively.
4. **Monochrome is the default.** Most terminal output should be text-primary and text-secondary. Color is the exception, not the rule.
5. **No color dependency.** Every piece of information must be parseable without color. Use symbols (`✓`, `✗`, `⚠`), indentation, and text labels alongside color.

---

## Node.js Implementation Hints

```javascript
// With picocolors (zero-dependency, recommended)
import pc from 'picocolors'

const accent = (text) => pc.hex('#FF6B35')(text)     // True color
const dim    = (text) => pc.dim(text)                 // ANSI dim
const bold   = (text) => pc.bold(text)                // ANSI bold

// With chalk
import chalk from 'chalk'

const accent = chalk.hex('#FF6B35')
const success = chalk.hex('#22C55E')
const error = chalk.hex('#EF4444')
const warning = chalk.hex('#FBBF24')
const info = chalk.hex('#60A5FA')
const dim = chalk.dim
const secondary = chalk.hex('#A0A0A0')
const tertiary = chalk.hex('#666666')
```

```javascript
// Raw ANSI (zero-dependency)
const RESET   = '\x1b[0m'
const BOLD    = '\x1b[1m'
const DIM     = '\x1b[2m'
const ITALIC  = '\x1b[3m'
const ULINE   = '\x1b[4m'

const accent  = (t) => `\x1b[38;2;255;107;53m${t}${RESET}`
const success = (t) => `\x1b[38;2;34;197;94m${t}${RESET}`
const error   = (t) => `\x1b[38;2;239;68;68m${t}${RESET}`
const warning = (t) => `\x1b[38;2;251;191;36m${t}${RESET}`
const info    = (t) => `\x1b[38;2;96;165;250m${t}${RESET}`
const primary = (t) => `\x1b[38;2;224;224;224m${t}${RESET}`
const secondary = (t) => `\x1b[38;2;160;160;160m${t}${RESET}`
const tertiary  = (t) => `\x1b[38;2;102;102;102m${t}${RESET}`
```

---

## Rendered Examples

Phase completion:

```
  ✓ strategy complete — 6 chunks written              ← success (#22C55E)
    ├── archetype.md                                   ← text-secondary (#A0A0A0)
    ├── brand-prism.md                                 ← text-secondary
    └── brand-platform.md                              ← text-secondary
```

Error with context:

```
  ✗ brief validation failed                            ← error (#EF4444)
    Missing required field: audience                    ← text-primary (#E0E0E0)
    Run /gsp:project-brief to complete the brief.              ← text-secondary (#A0A0A0)
```

Brand mark with accent:

```
  /gsp: ◆◈                                            ← "gsp:" in accent (#FF6B35)
                                                          diamonds in text-primary (#E0E0E0)
```

Density ramp (hero moment):

```
  ░▒▓█  GET SHIT PRETTY  █▓▒░                         ← ramp in accent (#FF6B35)
                                                          text in bold text-primary
```

---

## Related

- [Typography](./typography.md) — text formatting and emphasis styles
- [ASCII Art](./ascii-art.md) — color usage in sparkle fields and density ramps
- [Content Patterns](./content-patterns.md) — semantic color in status messages
