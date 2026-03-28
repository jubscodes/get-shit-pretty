# Visual Taste Evaluation Framework

Companion to `nielsen-heuristics.md`. Nielsen measures usability (/50); this measures visual quality (/75). Both are evaluated independently during critique — a design can score high on one and low on the other.

## What Taste Means

Taste is intentionality in every decision. It's the difference between assembling parts and composing an experience.

- **Signal vs noise** — knowing what deserves emphasis and what should fade
- **Visual coherence** — all elements speaking the same design language
- **Confidence in constraints** — doing less with more intention
- **The gap between "it works" and "it feels right"**
- **Not decoration** — it's the absence of things that shouldn't be there

Taste cannot be added at the end. It's a quality that emerges when every decision — type, color, spacing, motion, content — serves the same story.

## Sophistication Scale

| Level | Name | Description | Examples |
|-------|------|-------------|----------|
| 1 | Default | Browser defaults, no styling intention. Looks like a homework assignment. | Unstyled HTML, Craigslist |
| 2 | Functional | Styled but generic. Could be any product. Uses a component library without customization. | Default Bootstrap site, early-stage SaaS with Tailwind defaults |
| 3 | Polished | Consistent, professional, follows best practices. Looks like a well-made product. | Notion, Slack, most well-funded SaaS products |
| 4 | Refined | Intentional details, personality showing through. You notice the craft. | Raycast, Arc Browser, Lottie |
| 5 | Distinctive | Unmistakably this brand. Memorable. You'd recognize it without the logo. | Linear, Stripe, Vercel |

## Taste Evaluation Checklist

Score each item 1-5. Total: X/75.

### 1. Typography personality
Does the type choice have character beyond the default? Score 1 if Inter/system font with no hierarchy. Score 5 if a distinctive pairing embodies brand personality with clear weight and size hierarchy.

### 2. Color intentionality
Is the palette considered or default? Score 1 if random, oversaturated, or too many hues. Score 5 if a cohesive system with clear semantic hierarchy and tinted neutrals.

### 3. Spacing rhythm
Does whitespace feel intentional or arbitrary? Score 1 if inconsistent padding with no scale. Score 5 if a clear vertical rhythm creates breathing room and content grouping.

### 4. Shadow & depth
Are surfaces creating meaningful hierarchy? Score 1 if flat or generic `box-shadow: 0 2px 4px rgba(0,0,0,.1)`. Score 5 if tinted shadows with consistent light direction communicate z-layers.

### 5. Motion personality
Does animation match the brand's energy? Score 1 if no motion or linear easing. Score 5 if spring physics, choreographed entrances, and exit animations match brand character.

### 6. Content authenticity
Does copy feel real or templated? Score 1 if Lorem Ipsum, "Welcome to our platform," or AI cliches. Score 5 if specific, voice-consistent, believable content throughout.

### 7. Component individuality
Are components styled to brand or default? Score 1 if stock library defaults (default Radix, unstyled shadcn). Score 5 if radius, color, shadow, and motion are customized to match brand DNA.

### 8. Layout confidence
Does the layout make bold choices or play it safe? Score 1 if generic centered single-column symmetry. Score 5 if intentional asymmetry, creative grid usage, or distinctive composition that serves the content.

### 9. Visual coherence
Do all elements speak the same design language? Score 1 if mixing incompatible styles (glassmorphism + neubrutalism + flat). Score 5 if every element reinforces one visual story.

### 10. Surface texture
Is there tactile quality or is it flat? Score 1 if pure flat vectors with no material quality. Score 5 if subtle grain, glass refraction, or tinted shadows create physical presence appropriate to brand.

### 11. State completeness
Are all interaction states designed? Score 1 if hover, active, loading, empty, and error states are missing or unstyled. Score 5 if every state feels intentional with smooth transitions between them.

### 12. Responsive craft
Is mobile a first-class experience? Score 1 if "it fits on mobile" is the only consideration. Score 5 if mobile has its own considered layout with touch-appropriate sizing and gestures.

### 13. Icon consistency
Unified family, weight, style? Score 1 if mixed icon sets, inconsistent weights, or mismatched sizing. Score 5 if one curated set with consistent stroke width and optical alignment throughout.

### 14. Image direction
Do images match brand personality? Score 1 if stock photos, broken URLs, or placeholder boxes. Score 5 if imagery style (photography, illustration, generative, CSS-only) is a deliberate brand choice.

### 15. Overall impression
Does it feel like a $150k agency build? Score 1 if it looks AI-generated or template-derived. Score 5 if someone would ask "who designed this?"

## Scoring

**X/75 total**, mapped to sophistication levels:

- **15-25**: Level 1-2 (Default/Functional) — needs significant visual work
- **26-40**: Level 3 (Polished) — professional but not distinctive
- **41-55**: Level 4 (Refined) — shows craft and personality
- **56-75**: Level 5 (Distinctive) — agency-quality, memorable

## How to Improve Each Level

### Level 2 → 3 (Functional → Polished)

- Swap default fonts for a considered pairing
- Establish a consistent spacing scale (4/8px or similar)
- Add hover states and transitions to all interactive elements
- Use one accent color consistently with tinted neutrals
- Add loading and empty states

### Level 3 → 4 (Polished → Refined)

- Customize component library beyond defaults (radius, shadows, colors)
- Add subtle texture (noise grain, tinted shadows, soft gradients)
- Introduce spring physics for interactive motion
- Use staggered entrances instead of instant mounting
- Make responsive layouts feel native to each breakpoint

### Level 4 → 5 (Refined → Distinctive)

- Create signature visual patterns unique to this brand
- Use advanced interactions (spotlight borders, magnetic elements, scroll choreography)
- Ensure every surface, shadow, and animation reinforces brand personality
- Content feels authored — specific voice, real data, believable context
- Someone could identify the brand from a screenshot without the logo

## How to Use

This reference is loaded by the critique agent alongside `nielsen-heuristics.md`. During critique:

1. Score each of the 15 taste items 1-5 with specific examples from the design
2. Calculate total and map to sophistication level
3. Write taste evaluation as a section in `critique.md`
4. Include taste-specific fixes in `prioritized-fixes.md`

Usability (Nielsen's, /50) and Taste (/75) are evaluated separately. A design can be highly usable but lack taste, or be visually stunning but have usability problems. Both dimensions must be addressed.
