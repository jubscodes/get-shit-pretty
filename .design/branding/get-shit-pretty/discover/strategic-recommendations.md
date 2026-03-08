# Strategic Recommendations

> Phase: discover | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Recommendation 1: Own "Dark Neubrutalism" as GSP's Visual Territory

**What:** Establish a visual identity that fuses OLED-optimized dark mode with neubrutalist principles — true black base, thick borders (rendered in subtle rgba white), hard-offset shadows, flat accent colors, and monospace typography. This is not full neubrutalism (which is typically light-background, bright, and playful) but a darker, more refined variant that matches GSP's personality: raw craft with precision.

**Why:** Dark neubrutalism is an underexplored visual territory. Most developer tools default to either Linear-style polished dark (glassmorphism, gradients, blur) or generic dark gray. GSP can carve a distinct position: deliberately bold where Linear is deliberately subtle. The thick borders and flat colors translate naturally to ASCII-compatible contexts (terminal output, markdown documentation), solving the constraint that GSP must work in both web and CLI environments.

**How to apply:**
- True black (#000000) base with surface hierarchy for elevation
- 2-3px borders in rgba(255, 255, 255, 0.15-0.25) for structure
- One primary accent color (recommendation: a warm amber/gold like #E5A00D — warm enough to feel human, bold enough to read on black)
- Hard-offset shadows using subtle light values for web UI; ASCII box-drawing characters for terminal equivalents
- Monospace headings (JetBrains Mono or Berkeley Mono), grotesque sans-serif body (Inter or Geist Sans)

**Risk mitigation:** Dark neubrutalism can read as aggressive. Soften with generous whitespace, intentional micro-interactions (shadow-collapse on hover), and warm accent colors. Avoid cold blues; lean toward amber, gold, or warm white.

---

## Recommendation 2: Position GSP as the "GSD for Design" — Not a Design Tool

**What:** Frame GSP explicitly as a companion to GSD, not as a standalone design tool. The narrative: "GSD gets shit done. GSP gets shit pretty. Together, they are the complete CLI-native product development system." Avoid comparisons to Figma, Storybook, or shadcn/ui — those are different paradigms. GSP is a methodology that runs inside AI coding agents, not a GUI application.

**Why:** The biggest risk to GSP adoption is category confusion. If developers hear "design tool," they think Figma and dismiss it. If they hear "design system," they think Storybook and dismiss it. But if they hear "it is like GSD, but for design" — that clicks immediately for the target audience. GSD is already trusted by engineers at Amazon, Google, Shopify, and Webflow. Drafting behind GSD's credibility shortens the adoption curve.

**How to apply:**
- Naming convention: maintain the "Get Shit ___" pattern. GSP is to GSD what a design system is to a project management system.
- Shared architecture: same multi-runtime installer pattern (npx), same agent-and-command structure, same markdown-native output
- Cross-pollination: GSD users should discover GSP naturally. GSP documentation should reference GSD as the foundation.
- Launch messaging: "You learned to ship with GSD. Now learn to ship beautifully with GSP."

**Risk mitigation:** Do not become so tightly coupled to GSD that GSP cannot stand alone. GSP must work independently — the GSD connection is positioning, not a technical dependency.

---

## Recommendation 3: Lead with the Builder Identity, Market Through Craft

**What:** GSP's primary audience is not "developers" or "designers" — it is "builders." The brand should center on the builder identity: people who care about what they make, not just that they made it. Marketing should demonstrate craft, not explain features. The website, documentation, README, and terminal output should all be so well-designed that they serve as proof of concept.

**Why:** GSP's three audience segments (developer gaining product thinking, designer gaining CLI access, design engineer) converge on one shared trait: they build things and care about quality. Leading with job title divides the audience; leading with identity unites it. Furthermore, GSP is a design tool — it must demonstrate exceptional design in every touchpoint. If the README looks generic, if the docs look like every other open source project, the implicit message is "this tool cannot do what it promises."

**How to apply:**
- Brand voice: address the audience as "builders," not "developers" or "designers"
- Website: kinetic typography hero section, dark neubrutalist cards, monospace headings, ASCII art accents. Every pixel proves the tool works.
- README: structured, beautiful, with ASCII art logo and intentional formatting. Not a wall of badges and boilerplate.
- Terminal output: styled, color-coded, structured. Every GSP command should produce output that looks designed.
- Content marketing: show, do not tell. Case studies of products transformed by GSP's pipeline. Before/after comparisons. Visible craft.

**Risk mitigation:** "Builder" as an identity can be vague. Ground it with specifics: "builders who ship products, not just features." The CLI-native context keeps it specific to the technical audience.

---

## Related

- [Competitive Audit](./competitive-audit.md)
- [SWOT Analysis](./swot-analysis.md)
- [Mood Board Direction](./mood-board-direction.md)
- [Audience Personas](./audience-personas.md)
