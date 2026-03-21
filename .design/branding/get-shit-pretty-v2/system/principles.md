# Design Principles

> Phase: system | Brand: get-shit-pretty | Generated: 2026-03-19

---

## 1. Terminal is home

Design for the terminal first, then adapt to web. Every token, every component, every pattern must work in a character grid before it works in a pixel grid. This is not a constraint -- it is the creative brief.

**Do:**
- Define ANSI color tiers alongside hex values
- Test hierarchy with weight and casing before reaching for font size
- Use box-drawing characters for structure in CLI output

**Don't:**
- Design for web and "also make it work in terminal"
- Use web-only features (gradients, shadows, blur) as primary communication
- Assume color is available -- design for NO_COLOR first

---

## 2. Color is signal, not decoration

Every chromatic color earns its place. Amber means interaction or brand. Red means error. Green means success. If removing a color breaks the meaning, the color is doing its job. If removing it changes nothing, the color is decorative and should be removed.

**Do:**
- Design in monochrome first, then add color where it communicates
- Follow the 70/25/5 ratio (foundation / text / accent)
- Use semantic colors only for their defined purpose

**Don't:**
- Use amber decoratively (backgrounds, borders without purpose)
- Apply semantic colors (error red, success green) for brand styling
- Use more than one chromatic axis per context (amber OR expression, not both)

---

## 3. Precision over decoration

The Creator archetype builds systems, not ornaments. Every value in the system is mathematically derived -- 8px spacing base, 1.25 type ratio, OKLCH perceptual color steps. No magic numbers, no "it felt right." If a value can't be explained, it doesn't belong.

**Do:**
- Use spacing tokens -- never arbitrary pixel values
- Maintain the type scale ratio across all contexts
- Keep border-radius tight (2-4px default)

**Don't:**
- Add shadows, glows, or gradients for visual interest
- Round corners past 8px except for pills/avatars
- Use animation for decoration (motion is functional: 100-150ms, linear)

---

## 4. Walk alongside, never above

The Guide archetype explains *why*, not just *what*. Design output should teach -- every color choice has a rationale, every spacing value has a rule. The system is opinionated but transparent. Builders can disagree with information, not just obey instructions.

**Do:**
- Include rationale in design output (why this color, why this spacing)
- Show the before/after when making suggestions
- Use warm, direct language in system documentation

**Don't:**
- Present design decisions as arbitrary rules
- Use jargon without context ("visual hierarchy" without showing what changed)
- Over-explain obvious choices (condescension is the Guide's shadow)

---

## 5. Ship, then refine

The Creator's shadow is perfectionism paralysis. The system is designed to produce complete, usable output at every phase -- not to accumulate options. Each phase ends with a clear deliverable. "That's a wrap" means move forward, not keep polishing.

**Do:**
- Output complete, usable tokens at every phase
- Set clear boundaries between foundation, component, and application layers
- Default to opinionated choices rather than presenting unlimited options

**Don't:**
- Generate variations without recommending one
- Leave tokens undefined or marked "TBD"
- Require manual assembly of partial outputs into a working system

---

## Related

- [Color System](./foundations/color-system.md)
- [Typography](./foundations/typography.md)
- [Spacing](./foundations/spacing.md)
- [Elevation](./foundations/elevation.md)
- [Border Radius](./foundations/border-radius.md)
- [Strategy: Archetype](../strategy/archetype.md)
- [Strategy: Voice & Tone](../strategy/voice-and-tone.md)
