# Prioritized Fixes

> Phase: critique | Project: gsp-app | Generated: 2026-03-19

---

## Critical (Must Fix Before Launch)

### ~~1. Blockquote expression color~~ — DISMISSED

**Status:** Accepted as intentional design choice. Expression-mauve on blockquote borders adds personality to the reading experience. The brand system rule about atmospheric-only usage is relaxed for this specific application: a 2px border accent on prose blockquotes, used sparingly.

---

### 2. AtmosphericBg opacity floor is below reliable threshold (ONLY REMAINING CRITICAL)

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — Hero, AtmosphericBg component

**Problem:** The spec states characters render at "varying opacities" with "8-12%" range. The color-system.md specifies expression colors should be used at 10-20% opacity on void. 8% on #050505 (oklch 0.13) is perceptually below threshold on uncalibrated displays and OLED screens that compress near-black contrast. The atmospheric effect becomes invisible — not subtle, but absent — which means the hero looks like a plain dark background on a significant portion of real hardware.

**Fix:** Set the opacity floor to 10% (matching the brand system lower bound). Characters in the outer edges of the field use 10%, inner characters use up to 18%. The density ramp still works; only the minimum opacity changes. Update AtmosphericBg component props to accept `minOpacity` and `maxOpacity`, default to 0.10 and 0.18.

---

### ~~3. InstallCommand CTA visual treatment inconsistency~~ — DISMISSED

**Status:** Accepted as intentional. The hero uses a button treatment (high-impact, action-oriented) while the footer uses a code block treatment (reinforcement, copy-focused). Two visual treatments for two different contexts is a deliberate design choice, not an inconsistency.

---

## Important (High Priority)

### 4. Pipeline row labels are quieter than their content

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — Section 4 Pipeline Visualization

**Problem:** Row labels ("Branding" and "Project") use `text-caption text-text-muted uppercase tracking-wider` — the smallest, most muted text in the system. The node phase names they organize use standard text weight and size. For a Des persona evaluating the methodology, the organizational label should be at least as legible as the content it labels. Currently the grouping is visually hierarchically inverted.

**Fix:** Elevate row labels to `text-overline text-text-bright font-bold uppercase tracking-widest` — still uppercase and compact, but bright rather than muted. Alternatively, add a thin vertical rule or horizontal bar before each row (in `border-border` color) to create structural separation that removes the need for the label to do all the organizing work.

---

### 5. Features grid section has no identifying heading

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — Section 5 Features Grid

**Problem:** The features section has no overline or H2 to orient the visitor. Its position after the pipeline section implies context, but a visitor who jumps to this section via scroll (not reading linearly) has no header to anchor to. The VoiceOver reading order document notes "section heading implied" — implied is not the same as present.

**Fix:** Add a section overline ("WHAT IT DOES" or "CAPABILITIES") and optionally a minimal H2 ("Six tools in one pipeline"). This matches the pattern of every other landing section. The card grid can absorb this addition without restructuring — add it above the grid within the same section padding.

---

### 6. Mobile nav character-count risk at 320px

**Location:** [`../design/shared/navigation.md`](../design/shared/navigation.md)

**Problem:** The brand mark `/gsp: ◇◇` plus "Changelog" plus "GitHub ↗" at 14px JetBrains Mono with 16px padding on each side renders to approximately 240px of text in ~288px of usable space. This is tight enough that small layout rounding differences, font metric variance across browsers, or a slightly longer brand mark could overflow or force wrapping. The design assumes it works at 320px but no test is documented.

**Fix:** Add `white-space: nowrap` to the nav inner container and test on a real 320px device or browser-dev-tools at exactly 320px. If it clips, reduce the brand mark to `/gsp:` (dropping the diamond glyphs in the nav only) at mobile breakpoint, or reduce link font-size to 12px at the `<640px` breakpoint. Document the tested result.

---

### 7. Pipeline tooltip fallback unspecified for mobile

**Location:** [`../design/shared/micro-interactions.md`](../design/shared/micro-interactions.md) — Pipeline node hover tooltip

**Problem:** Micro-interactions specify pipeline nodes show "border-strong highlight, tooltip with phase name" on hover, "only on desktop." But on mobile, touching a pipeline node has no fallback interaction. The node names are visible as text below each diamond, so the tooltip is redundant on desktop anyway — but the inconsistency between "has tooltip" and "no tooltip" is not explicitly resolved.

**Fix:** Remove the tooltip on desktop too. The phase name is already rendered as visible text beneath the node — a tooltip repeating it adds nothing except redundant information. This simplification also removes the need to manage a tooltip component entirely. If you keep the tooltip, specify what happens on touch: either the node name becomes visible on tap (toggled state), or the tooltip is permanently removed on touch devices via `@media (hover: none)`.

---

### 8. Des persona hero signal is weak

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — Hero section

**Problem:** The hero subhead ("Design decisions, not design debt. / Brand-to-build in your terminal.") is written primarily for the Dev persona. "Brand-to-build" is meaningful to someone who knows the end-to-end pipeline. For the Des persona (product designer curious about methodology), the hero does not signal "this respects design process" until the pipeline section further down the page. The risk is Des bouncing before scrolling that far.

**Fix:** Replace one of the two subhead lines with language that signals methodology rather than workflow. Candidate: "From brand strategy to component specs — in your terminal." This communicates that GSP follows a process (strategy → specs) not just that it produces output. Alternatively, add a single sentence below the CTAs that names the dual-diamond approach: "A dual-diamond process. Built for the terminal."

---

## Polish (If Time Allows)

### 9. Overline repetition on landing page

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — Sections 2, 3, 4

**Problem:** Four overlines appear on the landing page (DESIGN ENGINEERING, HOW IT WORKS, THE PROCESS, and indirectly on feature cards). Overlines are strongest when they feel earned. At this frequency they read as a layout template.

**Fix:** Remove the overline from the hero (Section 2) — the display headline needs no label at Display 1 size. Keep overlines for subsequent sections where they provide genuine wayfinding. This makes the hero feel more direct and makes the overlines on later sections feel more intentional.

---

### 10. Hero layout alignment alternates without clear logic

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) and [`../design/screen-01-landing.md`](../design/screen-01-landing.md) Section 3

**Problem:** Hero is centered, "What is GSP" is left-aligned two-column, Pipeline is centered again. The center-left-center rhythm is not obviously motivated by content logic.

**Fix:** Commit to one dominant alignment strategy. Either: (a) all sections left-aligned, with the hero being the single centered exception because it uses a display headline (consistent with how most dev marketing sites treat hero vs body sections), or (b) accept the alternation and make it feel more deliberate by ensuring the centered sections (Hero and Pipeline) have similar visual weight and treatment — matching overline styles, similar padding.

---

### 11. Changelog list: no visual date grouping

**Location:** [`../design/screen-02-changelog-list.md`](../design/screen-02-changelog-list.md)

**Problem:** Date is shown as a per-post overline ("MARCH 2026") but multiple posts from the same month would repeat the same month overline independently. This is a future-content concern — at launch there may be only 2-3 posts — but worth designing for now.

**Fix:** Group posts by month with the month/year as a section label above the group, not as a repeated per-post overline. Move the date from "overline above each title" to "YYYY-MM-DD" as a smaller inline metadata label beside or below the title. This scales cleanly as the changelog grows.

---

### 12. No light-mode treatment for AtmosphericBg

**Location:** [`../design/screen-01-landing.md`](../design/screen-01-landing.md) — AtmosphericBg component plan

**Problem:** The component plan notes expression colors on void black. The brand system defines a full light-mode adaptation. Light mode is explicitly out of scope for P0, but AtmosphericBg with lavender/rose characters at 10% opacity on #FAFAFA background will be invisible (the colors are too light). If light mode is enabled later without addressing this, the hero loses its signature element.

**Fix:** Add a `data-theme="light"` override in the AtmosphericBg component that inverts the expression colors to mauve and rose at higher opacity (20-25%) on the light background, or replaces the atmospheric field with a different treatment. Document this as a known debt in a code comment so it is not forgotten.

---

## Related

- [Critique](./critique.md)
- [Screen 01: Landing](../design/screen-01-landing.md)
- [Screen 02: Changelog List](../design/screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../design/screen-03-changelog-post.md)
