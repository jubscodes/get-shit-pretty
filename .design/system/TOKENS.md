# Tokens
> Design System Analysis | Generated: 2026-03-18

## Token Source

**Token source:** `scripts/gsp-statusline.js` (runtime), `bin/install.js` (installer), `.design/branding/get-shit-pretty/system/tokens.json` (brand spec)
**Format:** JavaScript objects with ANSI escape code values; brand tokens in JSON

## Token Coverage

| Category | Defined? | Details |
|----------|----------|---------|
| Colors | Yes | Truecolor ANSI palette: accent (`#FF6B35`), primary (`#E0E0E0`), secondary (`#A0A0A0`), tertiary (`#666666`), success (`#22C55E`), warning (`#FBBF24`), error (`#EF4444`), info (`#60A5FA`). 256-color and 16-color fallbacks defined. |
| Typography | No | Terminal-bound — no font control. Uses Unicode block elements (`░▒▓█`) and box-drawing characters for visual structure. |
| Spacing | No | Not applicable — terminal output uses character-width spacing. Some alignment via `center()` utility and `process.stdout.columns`. |
| Radii | No | Not applicable — terminal rendering has no border-radius concept. |
| Shadows | No | Not applicable — uses ANSI dim (`\x1b[2m`) for depth suggestion. |
| Dark mode | N/A | Terminal inherits user's terminal theme. Color tier detection (`NO_COLOR`, `FORCE_COLOR`, `COLORTERM`) adapts output. |

## Theme Configuration

### Truecolor palette (primary)

```javascript
const TRUECOLOR = {
  accent:    '\x1b[38;2;255;107;53m',   // #FF6B35 — warm orange
  primary:   '\x1b[38;2;224;224;224m',   // #E0E0E0 — light gray (text)
  secondary: '\x1b[38;2;160;160;160m',   // #A0A0A0 — mid gray (labels)
  tertiary:  '\x1b[38;2;102;102;102m',   // #666666 — dark gray (borders)
  success:   '\x1b[38;2;34;197;94m',     // #22C55E
  warning:   '\x1b[38;2;251;191;36m',    // #FBBF24
  error:     '\x1b[38;2;239;68;68m',     // #EF4444
  info:      '\x1b[38;2;96;165;250m',    // #60A5FA
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  reset:     '\x1b[0m',
};
```

### Color tier fallbacks

| Tier | Detection | Palette |
|------|-----------|---------|
| Truecolor | `COLORTERM=truecolor\|24bit` | RGB values above |
| 256-color | `TERM=xterm-256color` | Closest 256-color approximations (e.g., accent → 202) |
| 16-color | Default TTY | Standard ANSI (e.g., accent → yellow `\x1b[33m`) |
| None | `NO_COLOR` set or non-TTY | Empty strings — all formatting stripped |

### Skill output ANSI tokens

Skills use a consistent token set for summary boxes:

| Element | ANSI Code | Usage |
|---------|-----------|-------|
| Brand mark `/gsp:` | `\x1b[1m\x1b[38;2;255;107;53m` | Accent + bold |
| Box border | `\x1b[38;2;102;102;102m` | Tertiary |
| Keys | `\x1b[38;2;160;160;160m` | Secondary |
| Values | `\x1b[38;2;224;224;224m` | Primary |
| Reset | `\x1b[0m` | — |

## Prior GSP Tokens

**Brand:** `get-shit-pretty`
**Location:** `.design/branding/get-shit-pretty/system/`

Found prior GSP brand system with:
- `tokens.json` — structured brand token file
- `foundations/color-system.md` — color system specification
- `foundations/typography.md` — typography specification
- `foundations/spacing.md` — spacing specification
- `foundations/motion.md` — motion/animation specification
- `foundations/ascii-art.md` — ASCII art style guide
- `foundations/content-patterns.md` — content patterns
- `principles.md` — design principles
- 15 component specifications in `components/`
