# Issue #69: Structured Patterns + Constraints in Style Presets

## Objective

Extend GSP's `.yml` style presets with three new structured blocks — `patterns:`, `constraints:`, and `effects:` — so downstream agents (designer, builder, critic) get actionable composition rules instead of just token values.

Currently presets define **what tokens exist** ("this blue exists"). After this work they also define **how to use them** ("cards use this blue as border") and **what's forbidden** ("never use gradient borders").

## The problem

Style presets (74 `.yml` files in `gsp/skills/gsp-style/styles/`) define token values but not composition rules. The `.md` companion file has prose descriptions but they're freeform — every style gets a different structure, agents interpret loosely. Quick projects via `/gsp:style` never get a style prompt at all, so agents receive tokens.json with zero guidance on how to compose them.

## Research gathered

All references are in `dev/research/style-references/`:

### `taste-skill-all.md` (926 lines)
7 skills from github.com/Leonxlnx/taste-skill:
- **brutalist** — Swiss Industrial Print vs CRT Terminal archetypes, extreme type scale, zero border-radius, ASCII decoration, analog degradation effects
- **minimalist** — Warm monochrome, editorial serif contrast, flat bento grids, muted pastels, invisible motion (600ms fades, 0.02 opacity ambient blobs)
- **soft/high-end** — $150k agency aesthetic, Double-Bezel nested cards, Button-in-Button CTAs, Variance Engine with 3 vibe + 3 layout archetypes, magnetic button physics
- **taste (general)** — 3 configurable dials (Variance 8, Motion 6, Density 4), bias correction directives, 30+ named interaction patterns, Bento 2.0 motion paradigm
- **redesign** — 80+ audit checks across typography/color/layout/interactivity/content/components/iconography/code quality. Fix priority ordering. Upgrade technique library.
- **output-enforcement** — Anti-truncation rules, banned placeholder patterns
- **stitch** — DESIGN.md generator for Google Stitch with 9-section analysis process

### `skills-sh-top.md` (3,981 lines)
21 skills from skills.sh ecosystem:
- **Anthropic** `frontend-design`, `brand-guidelines`, `theme-factory` — Anthropic's own official skills
- **Impeccable** (pbakaus, 31K installs) — 15 composable design skills: `critique`, `colorize`, `typeset`, `animate`, `overdrive`, `delight`, `audit`, `arrange`, `bolder`, `quieter`, `polish`, `normalize`, `harden`, `adapt`, `frontend-design`
- **UI-UX-Pro-Max** (84K installs) — `ui-ux-pro-max`, `design-system`, `ui-styling`

### designprompts.dev (shared in conversation)
- **Bauhaus** — Constructivist modernism, primary color theory, hard offset shadows, geometric purity, thick borders, asymmetric balance
- **Bold Typography** — Type as hero, extreme scale contrast, dark mode, vermillion accent, no shadows (depth from layered type), noise grain texture

## Structural patterns across all sources

Every good source follows this implicit structure:

| Layer | What it defines | Example |
|---|---|---|
| **Philosophy** | Vibe, mood, personality keywords | "Constructivist, Geometric, Modernist" |
| **Tokens** | Color hex, font stacks, spacing scale, radius, shadows | `primary-red: #D02020`, `radius: 0px` |
| **Patterns** | Per-component composition rules with exact CSS | "Cards: border-4 border-black, shadow-[8px_8px_0px_0px_black]" |
| **Constraints** | Explicit NEVER/ALWAYS rules | "Never use blur shadows", "Always use hard-offset shadows" |
| **Effects** | Hover, active, scroll, ambient motion with easing curves | "hover: translate(-2px,-2px) + shadow increase, duration-200, ease-out" |

GSP presets currently cover Philosophy (`.md`) and Tokens (`.yml`). The last three are missing.

## Key insight from research

**Constraints are as important as patterns.** The taste-skill approach of explicit "BANNED" lists with reasoning produces better output than prose descriptions. Agents need to know what's forbidden, not just what's preferred.

**The redesign-skill's audit checklist** is essentially what our `gsp-project-critic` agent should internalize — 80+ specific anti-patterns organized by domain.

**Impeccable's decomposition** (separate skills for color, type, animation, critique) validates GSP's composable skills approach.

## Proposed schema extension

Add three new blocks to the `.yml` preset format:

```yaml
# Existing
name: neubrutalism
description: ...
category: bold
tokens:
  color: ...
  typography: ...
  spacing: ...

# New blocks
patterns:
  card:
    border: "always {shape.border-width} solid {shape.border-color}"
    shadow: "always hard-offset, never blur"
    radius: "{shape.border-radius-md}"
  button-primary:
    background: "{color.primary}"
    border: "always {shape.border-width} solid {color.foreground}"
    text: "uppercase, weight {typography.font-weight-heading}"
    shape: "rounded-none or rounded-full, never in-between"
  input:
    border: "always {shape.border-width} solid {shape.border-color}"
    focus: "shadow-lg offset, no ring/outline glow"

constraints:
  never:
    - "backdrop-filter / blur — conflicts with flat aesthetic"
    - "gradient backgrounds — solid colors only"
    - "drop shadows with blur > 0"
    - "border-radius between 0 and 9999px — binary extremes only"
  always:
    - "hard-offset shadows (x y 0px 0px)"
    - "visible borders on all interactive surfaces"
    - "uppercase on labels and buttons"

effects:
  hover: "translate(-2px, -2px) + shadow increase"
  active: "translate(2px, 2px) + shadow decrease (press effect)"
  focus: "shadow-lg hard-offset + 2px outline offset"
  transition: "duration-200, ease-out (mechanical feel)"
  scroll-entry: "none (static, constructivist)"
```

## Pipeline changes needed

| Component | Change |
|-----------|--------|
| `.yml` schema | Add `patterns:`, `constraints:`, `effects:` blocks |
| `style-preset-schema.md` | Document the new blocks |
| `/gsp:style` skill | Write `style-rules.md` chunk alongside tokens |
| `/gsp:brand-patterns` | Pattern-architect inherits preset constraints, can extend but not violate |
| `gsp-project-designer` agent | Constraints become hard rules in prompt |
| `gsp-project-builder` agent | Validate against constraints during build |
| `gsp-project-critic` agent | Check output against constraints in critique |
| SubagentStop hooks | Optionally grep for `never:` constraint violations |

## Approach

1. **Design the schema** — finalize `patterns:`, `constraints:`, `effects:` structure using the research as reference. Start with 3-5 diverse presets (neubrutalism, minimalist, bold-typography, professional, organic) to validate the schema covers the range.

2. **Update all 74 presets** — add the three blocks to every `.yml` file. Can batch by category since presets within a category share many patterns.

3. **Update `/gsp:style`** — generate a `style-rules.md` chunk from the new blocks when writing tokens.

4. **Wire into agents** — update designer, builder, critic prompts to consume constraints. This overlaps with #72 (reference distillation) — the constraints REPLACE much of what the reference files currently do.

5. **Update audit tests** — add schema validation for the new blocks.

## What NOT to do

- Don't make patterns too granular — they should be 5-10 component types, not 50
- Don't duplicate token values in patterns — reference them with `{token.path}` syntax
- Don't add constraints that are universal (like "be accessible") — only style-specific ones
- Don't overengineer the effects block — keep it to the 4-5 interaction states that vary by style

## Context notes

- User prefers context engineering over model routing for cost reduction
- Style refs should be MORE enforced, not less — they're the design contract
- General knowledge (HIG, Nielsen) should be baked into agents, not loaded as references
- The full reference files stay on disk for edge-case agent lookup
