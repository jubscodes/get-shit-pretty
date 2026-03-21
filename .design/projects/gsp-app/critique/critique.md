# Critique

> Phase: critique | Project: gsp-app | Generated: 2026-03-19

---

## Nielsen's 10 Usability Heuristics

| # | Heuristic | Score | Notes |
|---|-----------|-------|-------|
| 1 | Visibility of system status | 5 | InstallCommand copy feedback (icon swap + Sonner toast + aria-live region) is exemplary. Pipeline active-node pulse communicates "current phase" without text. No async states exist to miss — static site. |
| 2 | Match between system and the real world | 5 | Diamond glyphs (◇ ◈ ◆) map directly to the GSP CLI vocabulary users will see post-install. TerminalMock output mirrors real GSP output. The site's visual language IS the product's language. Zero translation cost. |
| 3 | User control and freedom | 3 | Changelog post has back links at top and bottom — good. But there is no breadcrumb or persistent indicator showing where in the site a user is when reading a post. The "active link" state on the nav Changelog item provides some orientation, but the current page is not underlined or otherwise differentiated at the H1 level. Minor: no previous/next between changelog posts (explicitly deferred, acceptable for launch). |
| 4 | Consistency and standards | 4 | Token usage is consistent throughout. Minor inconsistency: the hero CTA uses `rounded-sm` (2px) per the component plan, but the scope.md describes card radius as 4px (`rounded-sm` in Tailwind is 2px, `rounded` is 4px). This is probably a naming collision in the spec, not an intent conflict. The blockquote uses `border-expression-mauve` in prose — the only inline expression color not used atmospherically, which violates the "expression for background only" usage rule from the brand system. |
| 5 | Error prevention | 5 | Static site, no forms, no user input beyond the copy button. The copy mechanism resets after 2000ms, preventing stale "Copied!" state. Code blocks are wrapped in Scroll Area to prevent horizontal overflow breaking layout. No error surface to guard against. |
| 6 | Recognition over recall | 4 | All 10 pipeline phases are labeled inline on the PipelineViz — users do not need to remember what ◆ vs ◇ means because each node is captioned. The legend is implicit (completed = filled, active = amber, pending = muted) but not explained. For the Des persona who is new to the product, the distinction between ◆ and ◈ relies on color and fill — adding a legend below the viz would cost little and eliminate ambiguity. |
| 7 | Flexibility and efficiency of use | 4 | The primary Dev persona can copy the install command in one click without reading. Full marks for that path. The Des persona's deeper path (pipeline section) is well served. There are no keyboard shortcuts or power-user affordances, but for a marketing site this is not a gap — it would be noise. Minor: the pipeline nodes on desktop show tooltips on hover (micro-interactions.md), but on mobile those tooltips are absent and no fallback is specified. |
| 8 | Aesthetic and minimalist design | 4 | The 70/25/5 rule is respected throughout. The Meta Signal section (Section 6 of landing) is appropriately whisper-level. The six-card features grid is the most information-dense section — the diamond glyph as the sole icon in each card is visually sparse and reinforces restraint. One concern: the hero contains FIVE visual layers simultaneously — atmospheric ASCII art, overline, headline (Instrument Sans display), two-line subhead, two CTAs, and a TerminalMock. This is the most complex screen in the system. The layering is intentional but the density at the fold requires that each element earn its vertical space rather than cluster. |
| 9 | Help users recognize, diagnose, and recover from errors | 5 | Error states are designed for all pages (404 page, post not found, empty changelog). Each uses the same language and glyph vocabulary as the rest of the site. The empty changelog state offers a constructive next action (Watch on GitHub). No improvement needed for this scope. |
| 10 | Help and documentation | 3 | The pipeline visualization is the site's most educational section, but the explanatory body-sm text below it is described only as "brief explanation below the visualization" — the actual content is not specified. For the Des persona evaluating GSP's methodology, this text does significant persuasion work and its vagueness in the design spec is a risk. If that copy defaults to something generic, the section under-delivers on the promise. The site has no FAQ, no docs link, no "how does this actually work" secondary path for the curious visitor who wants more depth before installing. This is defensible for launch but worth noting. |

**Overall Score: 43/50**

Heuristics 3, 6, 8, and 10 account for all point loss. None are critical. The design is heuristically sound.

---

## Visual Hierarchy Assessment

The landing page hierarchy is clear and intentional at the macro level:

1. Instrument Sans display headline creates a distinct typographic break from everything else on the page — it is the only place the display typeface appears in body copy contexts, which makes it land correctly as a brand moment.
2. The amber accent is deployed with genuine restraint. It appears on the primary CTA, the active pipeline node, card icons, and links — never decoratively. The 70/25/5 rule holds.
3. Section separators use 96px spacing on desktop, which is substantial. Each section reads as its own composition. This works well for a scrolling funnel structure.

Hierarchy concerns:

- The overline pattern is used four times on the landing page (DESIGN ENGINEERING, HOW IT WORKS, THE PROCESS, and implied by the section structure). Overlines are effective when rare; at this frequency they risk reading as a template habit rather than intentional labeling.
- The hero layout centers all content (`text-center`), then the "What is GSP" section switches to left-aligned two-column, then the pipeline section returns to centered. This alternation can create a reading rhythm, but the visual logic of why center/left/center is not obvious from the design spec. A consistent left-alignment with a centered display headline would be more architecturally coherent.
- The features grid (Section 5) has no overline or heading of its own — it relies on visual position after the pipeline section to imply "here is what GSP does." Consider whether a minimal "WHAT YOU GET" or similar label aids orientation for users who scroll fast.

---

## Typography and Color Assessment

**Token compliance:** Full compliance. Every text style traces to a token in the typography foundation. The hero headline correctly uses `font-display` (Instrument Sans). All other text uses `font-primary` (JetBrains Mono). No arbitrary font choices found.

**Color compliance:** Near-full. The blockquote in the PostLayout uses `border-expression-mauve` — this is an expression color applied as a foreground border, not as an atmospheric background, which conflicts with the brand system rule "pair with monochrome, not with amber" and the rule against expression colors in foreground roles. This should be `border-accent-dim` or `border-border-strong` instead.

**Monospace body at 16px/1.7:** The brief explicitly defends this and the typography foundation's design rationale calls 1.7 non-negotiable for JetBrains Mono. This is the right call. At 1.7 line height with 16px, a JetBrains Mono paragraph is readable. The changelog post view (screen-03) is the proof test — a 700-word post at these settings should be comfortable. No change needed.

**Display 1 at up to 160px:** At max-width with `clamp(3.5rem, 8vw + 1rem, 10rem)`, the headline tops out at 160px. "Get Shit Pretty" at that scale is three words. The Instrument Sans set at -0.04em tracking at this size will look extremely tight — which is correct and intentional — but "Shit" as the central word will carry a lot of visual weight at that scale. This is a tone call, not a typography error, and it is on-brand.

**Expression palette atmospheric use:** The design specifies lavender and rose characters at 8-12% opacity in the ASCII art background. The brand system approves expression colors at 10-20% opacity on void. The 8% floor is at the edge — on displays with lower contrast ratios (non-calibrated monitors, older laptops), 8% opacity on #050505 may be imperceptible. The atmospheric effect will then be invisible rather than subtle. Recommend 10% as the floor.

---

## Usability Assessment

**Install flow (Dev persona, 60-second goal):** The path from page load to clipboard copy is: land → read 3-word headline → see amber CTA with `npm install -g get-shit-pretty` → click. This is one action. The primary CTA affordance is strong — amber background, monospace text, visible copy icon. The aria-live region closes the feedback loop. This flow is well-designed.

**Pipeline comprehension (Des persona):** Ten nodes across two rows is information-dense. Research shows users process 3-5 distinct items before chunking breaks down. Ten items chunked into two groups of four and six is cognitively manageable, but only if the group labels ("Branding" and "Project") are immediately visible and clearly differentiated from the node labels. The current spec applies `text-caption text-text-muted uppercase tracking-wider` to the row labels — this is smaller and more muted than the node phase names. For the section's core purpose (communicating methodology to the Des persona), the row labels should not be quieter than the content they organize. They should at minimum match node text weight.

**InstallCommand as CTA affordance:** The component is described as styled with `bg-accent text-on-accent` — an amber button. This communicates clickability. However, on the CTA Footer (Section 7), the component is described separately as a code block displaying `$ npm install -g get-shit-pretty` with a `[⎘]` copy icon. This is a different visual treatment — closer to a terminal code block with an appended copy icon — which is actually a stronger affordance for developers (code = copyable). The design spec should confirm whether the hero CTA and the footer InstallCommand use the same component or two different visual treatments. If they differ, the hero amber-button treatment and the footer code-block treatment serve the same purpose but look different, which is a consistency gap.

**Mobile navigation at 320px:** The nav contains `/gsp: ◇◇` (brand mark in monospace) plus "Changelog" and "GitHub ↗" at 14px (`text-body-sm`) with 16px horizontal padding. At 320px, the total character count across the nav is approximately 28-30 characters. JetBrains Mono at 14px averages ~8px per character, giving ~240px of text across ~288px of available space (320px - 2x16px). This is tight but workable. However, if `font-bold` applies to the brand mark and `font-medium` applies to the active link, the actual rendering will depend on font metric precision. A real-device test at 320px is mandatory before shipping.

---

## Strategic Alignment

**"Design process" positioning:** The dual-diamond pipeline visualization is the single strongest differentiator against competitors. It communicates that GSP is a methodology, not just a style tool. The design supports this positioning correctly by giving the pipeline its own dedicated section with a centered layout and generous spacing.

**Creator + Guide archetype:** The Creator archetype is expressed through the precision of the monochrome foundation, the systematic token usage, and the no-gradient, no-shadow discipline. The Guide archetype is expressed in the TerminalMock content (which shows output and explains what happened), the pipeline labels, and the meta signal. Both archetypes land.

**Meta narrative placement:** "This site was designed by GSP" as a caption between the features grid and the CTA footer is appropriately subtle. The research explicitly warns against over-explaining this. The current placement honors that guidance. The quality of the site is the proof — the caption is confirmation, not argument.

**Two-page site adequacy:** Three routes (landing, changelog list, changelog post) is tight but defensible for launch. The landing page answers the full evaluation funnel in one scroll. The changelog provides momentum and trust. The absence of documentation is the real gap — a visitor who wants to understand a specific skill (e.g., `/gsp:brand-strategy`) has nowhere to go after the landing page. This is a future-scope concern, not a launch blocker.

---

## Cognitive Load Analysis

The landing page asks the visitor to process: atmospheric ASCII art, display headline, subhead (2 lines), two CTAs, a TerminalMock, a two-column explanation section, a ten-node pipeline visualization, six feature cards, a meta signal, and a repeated CTA. This is a substantial page.

The cognitive load is managed by three techniques in the design:
1. Section spacing (96px gaps) creates hard stops between concepts.
2. Each section has an overline that names what is happening before content begins.
3. The information hierarchy within each section is strict (overline → heading → body → visual).

The residual risk is the hero fold. The atmospheric background + display headline + subhead + dual CTAs + TerminalMock creates a high initial density. The TerminalMock in particular requires the visitor to parse fake terminal output, which is a context switch from the marketing copy. The content of the TerminalMock (brand mark + pipeline flow preview) is valuable but secondary to the headline message. A visitor who reads the headline, reads the subhead, and clicks the CTA without reading the TerminalMock should still understand the product. This appears to be the intent — the TerminalMock is demonstrative proof, not critical path. But it adds visual weight to an already-loaded fold.

---

## Differentiation

GSP-app does not look like Linear, Vercel, Raycast, or the typical Next.js SaaS landing page because:
1. The primary typeface is monospace — not a display sans with a mono code font as an accent.
2. There are no screenshots, illustrations, or 3D renders — all visuals are typographic/glyphic.
3. The atmospheric background is ASCII art character field, not a CSS gradient or mesh.
4. The expression palette (lavender/rose) is genuinely unexpected in a developer tool context.
5. The pipeline visualization is bespoke ASCII-glyph-based, not a flowchart with rounded rectangles.

This combination is distinctive. The closest comp is the terminal-native aesthetic of tools like Charm.sh or Ghostty's site, but GSP adds the expression palette layer and the Instrument Sans display headline to create warmth that those sites don't have.

The risk: the monospace-everything approach may signal "for developers" so strongly that the Des persona (product/brand designer curious about terminal tools) is alienated before the methodology content reaches them. The design relies on the Des persona reading past the hero to the pipeline section, where the dual-diamond methodology is persuasive. Whether the hero communicates enough "design thinking" for the Des persona to commit to scrolling is the main strategic question this design does not fully answer.

---

## Related

- [Prioritized Fixes](./prioritized-fixes.md)
- [Alternative Directions](./alternative-directions.md)
- [Strengths](./strengths.md)
- [Screen 01: Landing](../design/screen-01-landing.md)
- [Screen 02: Changelog List](../design/screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../design/screen-03-changelog-post.md)
