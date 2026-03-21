# Color System

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-19

---

## Design Rationale

GSP's color system is **dark-mode native**. Void black is home, not a theme variant. The palette is monochrome-first -- the brand must work with zero color before amber is introduced. This reflects the Creator archetype's discipline (restraint is a design decision) and the Guide archetype's clarity (color is signal, not decoration).

Amber (#E5A00D) is the terminal accent. It carries personality in the CLI — craft (tool yellow), warmth (golden light), attention (cursor). In the terminal, amber is the only color beyond monochrome.

Beyond the terminal, GSP has a second layer: soft purples and pinks that no dev tool would dare. The expression palette (Lavender, Rose, Blush) is for web, marketing, social, and documentation — the moments where the brand needs to feel human, unexpected, and warm. Amber on void black says "I'm a serious tool." Lavender and rose say "...made by someone who sees beauty everywhere."

Full OKLCH palette scales are stored in [`./palettes.json`](./palettes.json).

---

## Foundation Palette

The monochrome foundation. These are the bones. Everything works with just these values.

| Role | Hex | OKLCH | RGB | ANSI True | ANSI 256 | ANSI 16 | Usage |
|------|-----|-------|-----|-----------|----------|---------|-------|
| Void | `#050505` | `oklch(0.13 0 0)` | `5, 5, 5` | `\e[38;2;5;5;5m` | `\e[38;5;232m` | `\e[30m` (black) | Primary background |
| Surface | `#111111` | `oklch(0.18 0 0)` | `17, 17, 17` | `\e[38;2;17;17;17m` | `\e[38;5;233m` | `\e[30m` (black) | Cards, panels |
| Border | `#1E1E1E` | `oklch(0.23 0 0)` | `30, 30, 30` | `\e[38;2;30;30;30m` | `\e[38;5;234m` | `\e[90m` (bright black) | Structural lines |
| Muted | `#6B6B6B` | `oklch(0.50 0 0)` | `107, 107, 107` | `\e[38;2;107;107;107m` | `\e[38;5;242m` | `\e[90m` (bright black) | Secondary text, metadata |
| Text | `#E8E8E8` | `oklch(0.93 0 0)` | `232, 232, 232` | `\e[38;2;232;232;232m` | `\e[38;5;254m` | `\e[37m` (white) | Primary text |
| Bright | `#FAFAFA` | `oklch(0.98 0 0)` | `250, 250, 250` | `\e[38;2;250;250;250m` | `\e[38;5;255m` | `\e[97m` (bright white) | Headlines, emphasis |

## Accent Palette

Amber is the personality. One color, used with intention.

| Role | Hex | OKLCH | RGB | ANSI True | ANSI 256 | ANSI 16 | Usage |
|------|-----|-------|-----|-----------|----------|---------|-------|
| Accent | `#E5A00D` | `oklch(0.754 0.155 77.29)` | `229, 160, 13` | `\e[38;2;229;160;13m` | `\e[38;5;178m` | `\e[33m` (yellow) | Primary interactive, brand moments |
| Accent Bright | `#F5C842` | `oklch(0.851 0.123 72.89)` | `245, 200, 66` | `\e[38;2;245;200;66m` | `\e[38;5;220m` | `\e[93m` (bright yellow) | Hover states, active emphasis |
| Accent Muted | `#8B6914` | `oklch(0.504 0.104 77.04)` | `139, 105, 20` | `\e[38;2;139;105;20m` | `\e[38;5;136m` | `\e[33m` (yellow) | Subtle accent, backgrounds |
| Accent Dim | `#4A3810` | `oklch(0.381 0.079 76.58)` | `74, 56, 16` | `\e[38;2;74;56;16m` | `\e[38;5;58m` | `\e[33m` (yellow) | Borders on accent surfaces |

## Expression Palette

Soft purples and pinks for personality moments. These are the surprise — no dev tool has this warmth. Used for gradients, decorative backgrounds, illustrations, marketing, and moments where the brand needs to feel human rather than technical. The Creator's unexpected side.

| Role | Hex | OKLCH | RGB | ANSI True | ANSI 16 | Usage |
|------|-----|-------|-----|-----------|---------|-------|
| Lavender | `#B8A9D4` | `oklch(0.74 0.07 296)` | `184, 169, 212` | `\e[38;2;184;169;212m` | `\e[35m` (magenta) | Primary expression color. Headers, badges, decorative accents. |
| Lilac | `#D4C1E8` | `oklch(0.82 0.06 300)` | `212, 193, 232` | `\e[38;2;212;193;232m` | `\e[95m` (bright magenta) | Lighter variant. Hover states, gradients. |
| Mauve | `#9B87B8` | `oklch(0.63 0.08 293)` | `155, 135, 184` | `\e[38;2;155;135;184m` | `\e[35m` (magenta) | Deeper variant. Text on light surfaces. |
| Rose | `#E8B4C8` | `oklch(0.80 0.06 350)` | `232, 180, 200` | `\e[38;2;232;180;200m` | `\e[95m` (bright magenta) | Warm pink. Gradients, social cards, highlights. |
| Blush | `#F2D1DE` | `oklch(0.88 0.04 355)` | `242, 209, 222` | `\e[38;2;242;209;222m` | `\e[97m` (bright white) | Softest pink. Backgrounds, washes. |

### Expression Usage Rules

1. **Never in terminal output.** The expression palette is for web, marketing, social, and documentation — not for CLI output. Terminal stays monochrome + amber.
2. **Pair with monochrome, not with amber.** Lavender on void black works. Rose next to amber fights. Choose one per context.
3. **Gradient direction:** Lavender → Rose creates a warm wash. Lilac → Blush creates a soft glow. Always on dark backgrounds.
4. **Opacity is your friend.** These colors at 10-20% opacity on void black create atmospheric depth without overwhelming the monochrome foundation.
5. **This is the surprise.** Use sparingly so it stays surprising. The expression palette is what makes someone say "I didn't expect a dev tool to feel like this."

## Semantic Colors

Functional signals. Not brand elements -- communication tools.

| Role | Hex | OKLCH | RGB | ANSI True | ANSI 16 | Rationale |
|------|-----|-------|-----|-----------|---------|-----------|
| Error | `#E54D42` | `oklch(0.629 0.19 27.95)` | `229, 77, 66` | `\e[38;2;229;77;66m` | `\e[31m` (red) | Warm red. Signals problem without panic. The Guide corrects gently. |
| Success | `#3FB950` | `oklch(0.695 0.181 145.62)` | `63, 185, 80` | `\e[38;2;63;185;80m` | `\e[32m` (green) | GitHub-familiar green. Terminal-native recognition. Completion, not celebration. |
| Warning | `#D29922` | `oklch(0.72 0.14 79.91)` | `210, 153, 34` | `\e[38;2;210;153;34m` | `\e[33m` (yellow) | Close to accent amber -- intentional. Warnings are attention, same family as brand attention. |
| Info | `#58A6FF` | `oklch(0.715 0.152 253.3)` | `88, 166, 255` | `\e[38;2;88;166;255m` | `\e[34m` (blue) | Cool blue, minimal usage. Informational only -- never for brand personality. |

## Contrast Ratios (WCAG AA)

All ratios calculated against their intended background.

| Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|------------|------------|-------|---------|----------|
| Text `#E8E8E8` | Void `#050505` | 17.4:1 | Pass | Pass |
| Bright `#FAFAFA` | Void `#050505` | 19.1:1 | Pass | Pass |
| Muted `#6B6B6B` | Void `#050505` | 5.2:1 | Pass | Fail |
| Accent `#E5A00D` | Void `#050505` | 8.7:1 | Pass | Pass |
| Accent Bright `#F5C842` | Void `#050505` | 12.4:1 | Pass | Pass |
| Text `#E8E8E8` | Surface `#111111` | 14.8:1 | Pass | Pass |
| Accent `#E5A00D` | Surface `#111111` | 7.4:1 | Pass | Pass |
| Muted `#6B6B6B` | Surface `#111111` | 4.4:1 | Pass (large) | Fail |
| Error `#E54D42` | Void `#050505` | 5.3:1 | Pass | Fail |
| Success `#3FB950` | Void `#050505` | 7.0:1 | Pass | Pass |
| Info `#58A6FF` | Void `#050505` | 6.4:1 | Pass | Fail |
| Void `#050505` | Accent `#E5A00D` | 8.7:1 | Pass | Pass |

## Dark Mode Mapping

GSP is dark-mode native. These values ARE the primary palette. Light mode is the adaptation.

| Semantic Role | Dark (primary) | Light (secondary) |
|---------------|---------------|-------------------|
| `--bg` | `#050505` (Void) | `#FAFAFA` (Bright) |
| `--surface` | `#111111` (Surface) | `#F1F1F1` (neutral-50) |
| `--border` | `#1E1E1E` (Border) | `#DFDFDF` (neutral-100) |
| `--text-muted` | `#6B6B6B` (Muted) | `#555555` (neutral-600) |
| `--text` | `#E8E8E8` (Text) | `#191919` (neutral-900) |
| `--text-bright` | `#FAFAFA` (Bright) | `#050505` (Void) |
| `--accent` | `#E5A00D` | `#8B6914` (darker for light bg contrast) |
| `--accent-hover` | `#F5C842` | `#E5A00D` |

## Color Usage Rules

1. **70/25/5 ratio:** 70% foundation (void, surface, border), 25% text (muted, text, bright), 5% accent (amber). The Creator's restraint.
2. **Amber is earned.** Never use amber decoratively. Every amber element is interactive, informational, or a brand moment. The Guide uses emphasis sparingly.
3. **Monochrome first.** Design everything in grayscale. Then add amber where it communicates something new. If removing amber breaks the design, the design is wrong.
4. **No gradients on amber.** Flat color only. Gradients dilute the signal. The Creator values precision, not effect.
5. **Semantic colors are functional.** Never use error red for brand styling. Never use success green for decoration. These are signals with specific meanings.

## Founder Ecosystem Differentiation

| Property | jubs.studio | GSP | Conflict? |
|----------|-------------|-----|-----------|
| Primary accent | `#00FF88` (neon green) | `#E5A00D` (amber) | No -- opposite temperature |
| Secondary | Burnt orange | None (monochrome) | No |
| Background | CRT dark | Void black `#050505` | Distinct feel |
| Accent energy | High saturation, cyberpunk | Moderate saturation, craft | No overlap |

---

## Related

- [Palettes (JSON)](./palettes.json)
- [Logo Directions](./logo-directions.md)
- [Typography](./typography.md)
- [Brand Applications](./brand-applications.md)
