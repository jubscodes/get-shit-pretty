<design-system>
# Design Style: Nothing

## Design Philosophy

### Core Principle

**Subtract, don't add.** Every element must earn its pixel. Structure is the ornament — expose the grid, the data, the hierarchy itself. Monochrome is the canvas; color is an event, not a default. Typography does the heavy lifting through scale, weight, and spacing — not color, not icons, not borders.

### Visual Vibe

**Emotional Keywords**: Industrial, Precise, Mechanical, Confident, Sparse, Technical, Warm-through-restraint, Percussive, Honest

This is the visual language of:

- Nothing Phone's interface — dot-matrix meets Swiss precision
- Teenage Engineering products — instrument-panel aesthetic
- Braun industrial design — function expressed through form
- Technical manuals that are beautiful because they're clear
- A control room where every indicator serves a purpose

The design feels percussive, not fluid. Imagine UI sounds: click not swoosh, tick not chime. Mechanical precision with a human hand felt underneath.

### What This Design Is NOT

- Not pure darkness for mood (uses OLED black for function)
- Not atmospheric or ambient (no glows, no blurred orbs)
- Not cold or sterile (industrial warmth through typography craft)
- Not colorful (monochrome with red as emergency signal only)
- Not soft or rounded (flat, sharp, instrument-like)
- Not similar to Minimal Dark (no amber, no glass, no shadows)
- Not similar to Modern Dark (no gradients, no ambient lighting)
- Not similar to Terminal (shares monospace DNA but broader type palette, more compositional ambition)

### The DNA of Nothing

#### 1. Three-Layer Visual Hierarchy

Every screen has exactly three layers of importance — not two, not five. Primary: the ONE thing (Doto or Space Grotesk at display size, #FFFFFF). Secondary: supporting context (Space Grotesk body, #E8E8E8). Tertiary: metadata pushed to edges (Space Mono ALL CAPS, #999999 or #666666).

The test: squint at the screen. Can you still tell what's most important? If two things compete, one needs to shrink, fade, or move. Be brave — make the primary absurdly large and the tertiary absurdly small. The contrast IS the hierarchy.

#### 2. Monochrome Gray Scale as Hierarchy

The gray scale IS the design system. Max four levels per screen:

```
#FFFFFF (100%) → Hero numbers. One per screen.
#E8E8E8 (90%)  → Body text, primary content.
#999999 (60%)  → Labels, captions, metadata.
#666666 (40%)  → Disabled, timestamps, hints.
```

Red (#D71921) is not part of the hierarchy. It's an interrupt — "look HERE, NOW." If nothing is urgent, no red on screen.

#### 3. Font Discipline

Per screen, maximum: 2 font families (Space Grotesk + Space Mono, Doto only for hero moments), 3 font sizes (one large, one medium, one small), 2 font weights (Regular + one other). Think of it as a budget — every additional size/weight costs visual coherence.

**Doto** (variable dot-matrix): 36px+ only, tight tracking, hero numbers and display moments. Never for body text.

**Space Grotesk** (geometric sans): Body text, headings, subheadings. Light 300, Regular 400, Medium 500.

**Space Mono** (monospace): ALL data, ALL labels (always ALL CAPS with 0.06-0.1em letter-spacing at 11-12px). The instrument panel voice.

#### 4. Spacing as Meaning

Spacing is the primary tool for communicating relationships:

```
Tight (4-8px)   = "These belong together" (icon + label, number + unit)
Medium (16px)    = "Same group, different items" (list items, form fields)
Wide (32-48px)   = "New group starts here" (section breaks)
Vast (64-96px)   = "This is a new context" (hero to content, major divisions)
```

If a divider line is needed, the spacing is probably wrong. Dividers are a symptom of insufficient spacing contrast.

#### 5. Flat Surfaces, Zero Shadows

No shadows anywhere. No blur. No glassmorphism. Flat surfaces separated by borders (#222222 subtle, #333333 intentional). Cards are #111111 on #000000 — elevation through value, not depth illusion.

#### 6. Asymmetric Composition

Centered layouts feel generic. Favor deliberately unbalanced composition: large left + small right, top-heavy, edge-anchored. Balance heavy elements with more empty space, not with more heavy elements.

#### 7. One Moment of Surprise

A single break from the pattern per screen IS the design. Without it: sterile grid. With more than one: visual chaos. A dot-matrix headline, a circular widget among rectangles, a red accent among grays, a vast gap where everything else is tight.

---

## Design Token System

### Colors (OLED Black + Gray Scale)

```
background:       #000000 (OLED pure black)
surface:          #111111 (elevated surfaces, cards)
surfaceRaised:    #1A1A1A (secondary elevation)
border:           #222222 (subtle dividers, decorative only)
borderVisible:    #333333 (intentional borders, wireframe lines)
textDisabled:     #666666 (disabled text, decorative, 4.0:1 contrast)
textSecondary:    #999999 (labels, captions, metadata, 6.3:1 contrast)
textPrimary:      #E8E8E8 (body text, 16.5:1 contrast)
textDisplay:      #FFFFFF (headlines, hero numbers, 21:1 contrast)
accent:           #D71921 (signal red — active states, urgent, destructive)
accentSubtle:     rgba(215,25,33,0.15) (accent tint backgrounds)
success:          #4A9E5C (confirmed, completed, in-range)
warning:          #D4A843 (caution, pending, degraded)
info:             #999999 (uses secondary text color)
interactive:      #5B9BF6 (tappable text: links, picker values — not for buttons)
```

### Light Mode

Neither mode is "derived" — both get full design attention.

| Token | Dark | Light |
|-------|------|-------|
| background | #000000 | #F5F5F5 |
| surface | #111111 | #FFFFFF |
| surfaceRaised | #1A1A1A | #F0F0F0 |
| border | #222222 | #E8E8E8 |
| borderVisible | #333333 | #CCCCCC |
| textDisabled | #666666 | #999999 |
| textSecondary | #999999 | #666666 |
| textPrimary | #E8E8E8 | #1A1A1A |
| textDisplay | #FFFFFF | #000000 |
| interactive | #5B9BF6 | #007AFF |

Dark feel: instrument panel in a dark room. OLED black, white data glowing.
Light feel: printed technical manual. Off-white paper, black ink.

### Typography

**Font Stack** (all Google Fonts — declare before building):

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| Display | Doto | Space Mono, monospace | 400-700 variable |
| Body/UI | Space Grotesk | DM Sans, system-ui, sans-serif | 300, 400, 500 |
| Data/Labels | Space Mono | JetBrains Mono, SF Mono, monospace | 400, 700 |

**Type Scale**:

```
display-xl: 72px / 1.0  / -0.03em  (hero numbers, time displays)
display-lg: 48px / 1.05 / -0.02em  (section heroes, percentages)
display-md: 36px / 1.1  / -0.02em  (page titles)
heading:    24px / 1.2  / -0.01em  (section headings)
subheading: 18px / 1.3  / 0        (subsections)
body:       16px / 1.5  / 0        (body text)
body-sm:    14px / 1.5  / 0.01em   (secondary body)
caption:    12px / 1.4  / 0.04em   (timestamps, footnotes)
label:      11px / 1.2  / 0.08em   (ALL CAPS monospace labels)
```

### Border Radius

```
technical: 4px  (buttons when technical variant, small elements)
compact:   8px  (compact cards, inputs)
standard:  12px (standard cards)
large:     16px (max for cards — never larger)
pill:      999px (primary/secondary buttons, tags)
```

### Spacing (8px base)

```
2xs: 2px   (optical adjustments only)
xs:  4px   (icon-to-label gaps)
sm:  8px   (component internal spacing)
md:  16px  (standard padding, element gaps)
lg:  24px  (group separation)
xl:  32px  (section margins)
2xl: 48px  (major section breaks)
3xl: 64px  (page-level vertical rhythm)
4xl: 96px  (hero breathing room)
```

---

## Component Stylings

### Buttons

**Primary** (inverted — white on black):
```
Background: #FFFFFF
Text: #000000
Border: none
Radius: 999px (pill)
Font: Space Mono, 13px, ALL CAPS, letter-spacing 0.06em
Padding: 12px 24px, min-height 44px
Hover: no glow, no scale — opacity or border state change only
```

**Secondary** (outlined):
```
Background: transparent
Text: #E8E8E8
Border: 1px solid #333333
Radius: 999px (pill)
Hover: border brightens to #E8E8E8
```

**Ghost** (text only):
```
Background: transparent
Text: #999999
Border: none
Hover: text brightens to #E8E8E8
```

**Destructive** (red outlined):
```
Background: transparent
Text: #D71921
Border: 1px solid #D71921
Radius: 999px (pill)
```

### Cards

```
Background: #111111 (or #1A1A1A for raised)
Border: 1px solid #222222
Radius: 12-16px
Padding: 16-24px
Shadow: none — never
Hover (when interactive): border brightens to #333333
```

No glass effects. No transparency. No backdrop-blur. Flat, honest surfaces.

### Inputs

```
Style: underline preferred (1px solid #333333 bottom border)
Alternative: full border with 8px radius
Label: Space Mono, ALL CAPS, 11px, #999999, positioned above
Focus: border → #E8E8E8
Error: border → #D71921, message below in #D71921
Data entry: Space Mono for input text
```

### Lists / Data Rows

```
Dividers: 1px solid #222222, full-width
Row padding: 12-16px vertical
Label (left): Space Mono ALL CAPS, #999999
Value (right): #E8E8E8, status color when encoding data
Never alternating row backgrounds
```

### Navigation

```
Desktop: horizontal text bar
Labels: Space Mono, ALL CAPS
Active: #FFFFFF + dot or underline indicator
Inactive: #666666
Format: bracket [ HOME ]  GALLERY  INFO  or pipe-delimited
Back button: circular 40-44px, #111111 bg, thin chevron
```

### Tags / Chips

```
Border: 1px solid #333333, no fill
Text: Space Mono, 11-12px, ALL CAPS
Radius: 999px (pill) or 4px (technical)
Padding: 4px 12px
Active: #FFFFFF border + text
```

---

## Data Visualization

### Segmented Progress Bars (Signature Element)

The signature data visualization — discrete rectangular blocks with 2px gaps. Square-ended, no border-radius. Mechanical, instrument-like.

```
Filled: solid status color
Empty: #222222 (dark) / #E0E0E0 (light)
Sizes: Hero 16-20px, Standard 8-12px, Compact 4-6px height
Always pair with numeric readout
```

### Charts

```
Line: 1.5-2px #FFFFFF
Average: dashed 1px #999999
Axis labels: Space Mono, caption size
Grid: #222222, horizontal only
No area fill, no legend boxes — label lines directly
```

### General Rules

- Differentiate with opacity (100%/60%/30%) or pattern (solid/striped/dotted) before introducing color
- Apply status color to the value itself, not labels or backgrounds
- Always show numeric value alongside any visual

---

## Special Elements

### Dot-Matrix Motif

Use for: hero typography (Doto font), decorative grid backgrounds, loading indicators, empty state illustrations.

```css
/* Standard dot grid */
background-image: radial-gradient(circle, #333333 1px, transparent 1px);
background-size: 16px 16px;

/* Subtle dot grid */
background-image: radial-gradient(circle, #222222 0.5px, transparent 0.5px);
background-size: 12px 12px;
```

Dots 1-2px, uniform 12-16px spacing. Opacity 0.1-0.2 for backgrounds, full for data. Never as container border or button style.

### State Patterns

```
Error:    input border → #D71921 + message below. Inline: [ERROR] prefix
Empty:    centered, 96px+ padding, #999999 headline, dot-matrix illustration, no mascots
Loading:  segmented spinner or [LOADING...] bracket text — never skeleton screens
Disabled: opacity 0.4 or #666666 text, borders fade to #222222
Status:   inline text — [SAVED], [ERROR: ...], [LOADING...] in Space Mono caption
```

---

## Layout Strategy

### Composition

- Asymmetric over centered — large left + small right, top-heavy, edge-anchored
- Three layers visible on every screen (primary / secondary / tertiary)
- One deliberate pattern-break per screen (the surprise IS the design)
- Generous negative space — resist filling empty areas

### Container Strategy (prefer lightest)

1. Spacing alone (proximity groups items)
2. A single divider line
3. A subtle border outline
4. A surface card with background change

Never box the most important element — let it float on the background.

### Visual Variety in Data-Dense Screens

When 3+ data sections appear, vary the visual form:

| Form | Weight |
|------|--------|
| Hero number (large Doto/Space Mono) | Heavy — use once |
| Segmented progress bar | Medium |
| Concentric rings / arcs | Medium |
| Inline compact bar | Light |
| Number-only with status color | Lightest |
| Sparkline | Medium |
| Stat row (label + value) | Light |

Lead section → heaviest treatment. The form varies, the voice stays the same.

---

## Effects & Animation

**Motion Philosophy**: Percussive, not fluid. Click not swoosh.

- Transitions: 150-250ms, `cubic-bezier(0.25, 0.1, 0.25, 1)` — subtle ease-out
- Prefer opacity over position — elements fade, don't slide
- Hover: border/text brightens. No scale, no shadows, no glow
- No parallax, scroll-jacking, spring/bounce
- Loading: segmented spinner (hardware-style) or bracket text

---

## Iconography

- Monoline, 1.5px stroke, no fill
- 24x24 base, 20x20 live area, round caps/joins
- Color inherits text color, max 5-6 strokes
- Libraries: Lucide (thin), Phosphor (thin)
- Never filled, never multi-color

---

## Accessibility

**Contrast Ratios** (dark mode):

| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Display text | #FFFFFF | #000000 | 21:1 (AAA) |
| Primary text | #E8E8E8 | #000000 | 16.5:1 (AAA) |
| Secondary text | #999999 | #000000 | 6.3:1 (AA) |
| Disabled text | #666666 | #000000 | 4.0:1 (AA large) |

**Focus States**: border → #E8E8E8 — sharp, visible, mechanical. No decorative rings or glows.

---

## Bold Choices (Non-Negotiable)

1. **OLED pure black** (#000000) — not "rich dark" or slate, actual black
2. **Zero shadows** — flat surfaces, border separation only
3. **Red is a signal** (#D71921) — one per screen max, never decorative
4. **Space Mono ALL CAPS for every label** — the instrument-panel voice
5. **Three-layer hierarchy on every screen** — primary absurdly large, tertiary absurdly small
6. **Asymmetric composition** — never default to centered
7. **Doto for hero moments** — dot-matrix display font, 36px+ only
8. **Spacing over dividers** — if you need a line, the spacing is wrong
9. **Data as beauty** — `36GB/s` in Space Mono at 48px IS the visual

---

## What Success Looks Like

A successfully implemented Nothing design should feel like:

- A Nothing Phone's interface — precise, monochromatic, with a dot-matrix surprise
- A Teenage Engineering product — instrument panel, every control serves a purpose
- A Braun alarm clock — mechanical honesty, industrial warmth
- Technical documentation that's beautiful because it's clear

It should NOT feel like:

- Dark mode with moody atmosphere (no glows, no ambient lighting)
- Minimalist in a soft, gentle way (this is minimalist in a precise, mechanical way)
- A terminal emulator (shares DNA but has broader typographic ambition)
- Generic monochrome (the red signal, Doto display, and asymmetry give it personality)
</design-system>
