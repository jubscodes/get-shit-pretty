# Style

## Brand: {BRAND_NAME}
**Style:** {STYLE_NAME} | **Generated:** {DATE}

> STYLE.md is the single document designer and builder agents consume. It merges the structured rules from the `.yml` preset with the implementation knowledge from the `.md` companion. Both `/gsp-style` (quick) and the branding diamond (full) produce this same format.

---

## Intensity

| Dial | Value | Meaning |
|------|-------|---------|
| Variance | {1-10} | {1=symmetric grid, 10=artsy chaos} |
| Motion | {1-10} | {1=static, 10=cinematic choreography} |
| Density | {1-10} | {1=gallery airy, 10=cockpit packed} |

---

## Philosophy

{2-4 sentences from the `.md` companion's Design Philosophy section. The emotional DNA — not what the tokens ARE, but what the design FEELS like. Cultural references, analogies, the "vibe in a sentence." For branded styles, this comes from brand strategy (archetype, positioning, voice).}

---

## Patterns

### Card
| Property | Rule |
|----------|------|
| border | {value or token ref} |
| shadow | {value or token ref} |
| radius | {value or token ref} |
| background | {value or token ref} |
| {style-specific} | {value — only if this style has unique card properties} |

### Button (primary)
| Property | Rule |
|----------|------|
| background | {value or token ref} |
| border | {value or token ref} |
| text | {casing, weight, tracking} |
| radius | {value or token ref} |
| {style-specific} | {value} |

### Button (secondary)
| Property | Rule |
|----------|------|
| background | {value or token ref} |
| border | {value or token ref} |
| text | {casing, weight, tracking} |
| radius | {value or token ref} |

### Input
| Property | Rule |
|----------|------|
| border | {value or token ref} |
| radius | {value or token ref} |
| background | {value or token ref} |
| focus | {focus behavior} |

### Badge
| Property | Rule |
|----------|------|
| shape | {value} |
| text | {styling} |

### Navigation
| Property | Rule |
|----------|------|
| style | {description} |
| {style-specific} | {value} |

### Layout
| Property | Rule |
|----------|------|
| archetype | **{named-archetype}** |
| max-width | {value} |
| section-spacing | {value} |
| grid-gap | {value} |
| surfaces | {texture/grain/clean strategy} |
| {style-specific} | {decoration, backgrounds, depth, etc.} |

---

## Constraints

### Never
- {forbidden thing} — {why it breaks this aesthetic}

### Always
- {required thing}

---

## Effects

**Interaction vocabulary:** {comma-separated list of allowed technique names}

### Hover
| Element | Technique | Description |
|---------|-----------|-------------|
| card | {technique-name} | {brief} |
| button | {technique-name} | {brief} |
| link | {technique-name} | {brief} |

### Active
| Element | Technique | Description |
|---------|-----------|-------------|
| button | {technique-name} | {brief} |

### Focus
| Element | Rule |
|---------|------|
| general | {focus behavior} |
| {specific} | {if different from general} |

### Transition
{duration range}, {easing function}

### Ambient
{Optional. Only for styles with always-on animations.}

- {technique-name} — {what it does}

---

## Bold Bets

{3-5 specific visual techniques that make this style unmistakable. Extracted from the `.md` companion's signature techniques and non-genericness sections. Each must be specific enough for a builder to implement.}

1. **{Technique name}** — {What it is and how to implement it.}
2. **{Technique name}** — {Description}
3. **{Technique name}** — {Description}

---

## Implementation

{Extracted from the `.md` companion's component stylings and CSS code hints. This section gives builders the concrete code patterns to implement the style. Only include what's specific to THIS style — skip universal patterns.}

### Component Code Hints
{Per-component CSS/Tailwind patterns from the `.md` companion. Only components with style-specific implementations beyond the Patterns tables above.}

### Textures & Surfaces
{CSS code for style-specific textures: noise SVGs, halftone gradients, grain overlays, scanlines, etc. Skip if the style has no texture requirements.}

### Typography Treatments
{Style-specific type treatments: text-stroke, tracking overrides, display type techniques. Skip if standard.}

### Animation Recipes
{CSS/Tailwind for style-specific animations: keyframes, transition definitions, interaction implementations. Skip if effects vocabulary + agent training is sufficient.}

---

## Related

- [{brand-name}.yml](./{brand-name}.yml) — Source of truth (tokens, intensity, patterns, constraints, effects)
