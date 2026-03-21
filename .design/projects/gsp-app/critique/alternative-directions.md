# Alternative Directions

> Phase: critique | Project: gsp-app | Generated: 2026-03-19

---

These are not full redesigns. They are meaningful pivots that address the most significant critique findings: the weak Des persona hook at the hero fold, and the cognitive density of the hero section. Both directions preserve the brand system, token compliance, and the monospace-forward aesthetic.

---

## Direction A: Methodology-First Hero

**What this addresses:** Fix 8 (Des persona hero signal is weak), Fix 10 (alignment rhythm), Fix 9 (overline repetition).

### Description

Flip the hero's communicative priority. Instead of leading with the brand name at display scale and the install command as primary CTA, lead with the process — then reveal the tool name as the thing that runs it.

**Layout change:**
- Remove the overline "DESIGN ENGINEERING" from the hero.
- Change the hero headline to a process statement instead of the product name: "Brand to build. Four phases. Your terminal."
- Move "Get Shit Pretty" to a smaller, branded subhead beneath — `font-display text-h1 text-accent` — positioned as the name of the tool that delivers the process, not the name of the page.
- Keep the two CTAs unchanged.
- Move the TerminalMock to the "What is GSP" section only, removing it from the hero fold entirely. This reduces hero complexity by one major layer.

**What changes:**
- Hero becomes methodology-first, brand-name-second — the Des persona immediately understands this is a process tool, not a style generator.
- The display headline is a shorter, more scannable statement rather than a three-word brand name.
- "Get Shit Pretty" remains present and prominent, but now reads as the confident tool name beneath a clear process claim rather than the first thing the page says.
- Hero complexity drops: no TerminalMock at the fold. The mock reappears in its proper context in "What is GSP."

**Trade-offs:**
- The brand name loses its display-size moment. For the Dev persona who already knows GSP, this is a minor loss.
- The hero is more text-forward — it relies on copy quality, not typographic drama. The design direction must commit to writing that line well.
- TerminalMock at the fold is a strong signal for the Dev persona ("this is a terminal tool, I get it immediately"). Moving it below the fold delays that confirmation.

**Best for:** A product positioning that wants to attract designers and developers equally. Prioritizes the Des persona.

---

## Direction B: Single Dominant Visual — The Live Pipeline

**What this addresses:** Fix 8 (Des persona hero signal), the hero cognitive density finding in the Heuristic 8 assessment, and the pipeline section's position (currently section 4, below the fold for most visitors).

### Description

Collapse the hero and the pipeline visualization into one combined section. The hero IS the pipeline — the dual diamond renders at scale as the hero's central visual, with the install command positioned below it rather than above.

**Layout change:**
- Hero layout becomes: overline → PipelineViz (rendered large, spanning full content width) → headline (below the viz, not above) → subhead → CTAs.
- PipelineViz renders at 1.5x its current specified size in this context, with generous node spacing. It is the first thing that loads after the nav — a full-bleed typographic diagram.
- Headline drops to H1 size (`font-display text-h1`), not Display 1. The visual work is done by the pipeline, not the typographic scale.
- "Get Shit Pretty" becomes the label beneath the pipeline, not the headline above it.
- The atmospheric ASCII art background is still present but renders behind the pipeline, providing texture without competing with the diagram.
- Below the pipeline section: "What is GSP" and features grid, with the same design as the current spec.
- The PipelineViz section disappears as a standalone section — it has been promoted to the hero.

**What changes:**
- The visitor sees the dual diamond before they read the product name. This front-loads methodology comprehension for both personas.
- The display headline is removed from the hero. Typography serves the diagram; the diagram is the statement.
- Less vertical height required for the hero (no stacked overline + giant headline + subhead + CTAs + TerminalMock). The pipeline itself carries the visual weight.
- The site feels more like a process diagram than a marketing page — which is exactly what GSP claims to be.

**Trade-offs:**
- The PipelineViz at full scale is complex. A first-time visitor who has never heard of GSP may not immediately understand what they are seeing. The product name "Get Shit Pretty" needs to appear quickly after the pipeline to anchor the context.
- The display-scale Instrument Sans headline is visually distinctive and immediately premium-feeling. Removing it reduces the typographic drama of the hero significantly.
- The pipeline at hero scale needs to perform at all breakpoints. On mobile, the vertical compact layout (specified in responsive.md) needs to be even more legible when it is the first thing seen — not a supporting diagram but the primary statement.
- This direction works if the pipeline is genuinely comprehensible to a fresh visitor in 5 seconds. If it requires prior context, it will confuse rather than persuade.

**Best for:** A positioning that wants to lead with differentiation — "we are the only tool that shows you the full process before it asks you to install anything." Highest reward, highest risk.

---

## Related

- [Critique](./critique.md)
- [Prioritized Fixes](./prioritized-fixes.md)
- [Strengths](./strengths.md)
- [Screen 01: Landing](../design/screen-01-landing.md)
