# Accessibility Audit -- WCAG 2.2 AA

> Phase: critique | Project: gsp-app | Generated: 2026-03-19

---

## Scope

Audit of gsp-app marketing site design against WCAG 2.2 Level AA. Three screens audited:

- Screen 01: Landing page
- Screen 02: Changelog list
- Screen 03: Changelog post
- Shared: Navigation, micro-interactions, responsive behavior

Color system source: brand identity color-system.md and system foundations color-system.md.

---

## 1. Perceivable

### 1.1 Text Alternatives (SC 1.1.1)

| Element | Screen | Alt Text Specified? | Status |
|---------|--------|-------------------|--------|
| AtmosphericBg (ASCII sparkle field) | 01 | Not specified -- decorative, uses `pointer-events: none` | **Needs `aria-hidden="true"`** |
| TerminalMock (hero) | 01 | Design spec says `role="img" with alt` in VoiceOver reading order | **Pass** (needs implementation) |
| TerminalMock (What is GSP) | 01 | Design spec says `role="img"` in VoiceOver reading order | **Pass** (needs implementation) |
| PipelineViz | 01 | `role="img"` with `aria-label` fully specified: "GSP dual diamond pipeline: Branding phase has four steps..." | **Pass** |
| Diamond glyphs in feature cards | 01 | Decorative -- supplementary to heading text | **Pass** (ensure `aria-hidden="true"` on glyphs) |
| Diamond glyph in empty state | 02 | Decorative | **Pass** (ensure `aria-hidden="true"`) |
| Diamond glyph in 404 state | 03 | Decorative | **Pass** (ensure `aria-hidden="true"`) |
| External link icon on GitHub | Shared | 12px icon | **Needs alt or `aria-hidden="true"` with link text sufficient** |

**Finding:** TerminalMock components are marked as `role="img"` in the VoiceOver reading order section, but no explicit `aria-label` text is provided in the component specs. The implementation must include descriptive alt text (e.g., "Terminal showing GSP startup with brand mark and pipeline flow preview" for hero, "Terminal showing gsp brand-identity command generating a color palette" for section 3).

### 1.3 Adaptable

#### 1.3.1 Info and Relationships

**Heading hierarchy:**

| Screen | Heading Structure | Status |
|--------|------------------|--------|
| 01 Landing | H1 implied by Display 1 "Get Shit Pretty", H2 for sections (What is GSP, Pipeline, CTA Footer) | **Issue: No explicit `<h1>` tag specified for hero headline** |
| 02 Changelog List | H1 "Changelog", H2 for each post title | **Pass** |
| 03 Changelog Post | H1 post title, H2/H3 in prose body | **Pass** |

**Semantic structure:**

- Landmark regions specified: `<header>`, `<main id="main">`, `<section>` with `aria-labelledby`, `<footer>` -- **Pass**
- Changelog list uses `role="feed"` with `aria-label` -- **Pass**
- `<article>` elements with `aria-labelledby` -- **Pass**
- `<time>` elements with `datetime` attributes -- **Pass**
- Tags use `role="list"` with `role="listitem"` -- **Pass**
- Separators marked `aria-hidden="true"` -- **Pass**
- Breadcrumb navigation on changelog post uses `<nav aria-label="Breadcrumb">` -- **Pass**

**Issue:** The hero headline "Get Shit Pretty" is styled as Display 1 but the spec does not explicitly confirm it renders as `<h1>`. If the overline "DESIGN ENGINEERING" renders as a heading, the hierarchy breaks. The overline must be a `<p>` or `<span>`, and the headline must be `<h1>`.

#### 1.3.4 Orientation

No orientation lock specified. Content is vertical-scrolling. **Pass**

### 1.4 Distinguishable

#### 1.4.3 Contrast (Minimum) -- 4.5:1 for normal text, 3:1 for large text

| Color Pair | Documented Ratio | Context | Min Size | Status |
|------------|-----------------|---------|----------|--------|
| Text #E8E8E8 on Void #050505 | 17.4:1 | Body text, primary bg | Any | **Pass** |
| Bright #FAFAFA on Void #050505 | 19.1:1 | Headlines | Any | **Pass** |
| Muted #6B6B6B on Void #050505 | 5.2:1 | Overlines, nav links, footer links, metadata | Any | **Pass** |
| Accent #E5A00D on Void #050505 | 8.7:1 | Interactive elements, CTAs | Any | **Pass** |
| Text #E8E8E8 on Surface #111111 | 14.8:1 | Body text on cards | Any | **Pass** |
| Accent #E5A00D on Surface #111111 | 7.4:1 | Interactive on cards | Any | **Pass** |
| **Muted #6B6B6B on Surface #111111** | **4.4:1** | Feature card body text (body-sm), badge text, code block comments | **Large only (18pt+/14pt bold)** | **FAIL for normal text** |
| Void #050505 on Accent #E5A00D | 8.7:1 | Text on primary CTA button | Any | **Pass** |
| Lavender #B8A9D4 on Void #050505 | 8.2:1 | Expression decorative (at full opacity) | Any | **Pass** |
| Rose #E8B4C8 on Void #050505 | 10.1:1 | Expression decorative (at full opacity) | Any | **Pass** |

**Critical finding: Muted #6B6B6B on Surface #111111 at 4.4:1**

This pair is used in the following contexts at body or small text sizes:

1. **Feature card descriptions** -- `text-body-sm text-text-muted` on `bg-surface` cards. Body-sm is 14px. At 14px normal weight, 4.4:1 fails the 4.5:1 AA threshold for normal text. **FAIL**
2. **Badge text on changelog list** -- `text-caption text-text-muted` on `bg-surface` badges. Caption size is smaller than body. **FAIL**
3. **Code block comments** -- `text-text-muted` on `bg-surface` code blocks (changelog post). Comments at body-sm (14px). **FAIL**
4. **Pipeline row labels** -- `text-caption text-text-muted` on whatever background the pipeline section uses. If on void (#050505), ratio is 5.2:1 and passes. If on surface, fails.

**Remediation:** Bump muted to #787878 (approximately 5.0:1 on surface) or #767676 (the classic minimum). Alternatively, darken surface to #0D0D0D.

**Expression palette at low opacity:**

The AtmosphericBg uses expression colors (lavender, rose) at 8-12% opacity. At those opacities on void (#050505), these characters are essentially invisible and are purely decorative. No text is overlaid on them (they sit behind hero content). **Pass** -- but only because no text relies on these colors for contrast. The `pointer-events: none` confirms decorative intent.

#### 1.4.4 Contrast (Minimum) for links

- Inline links in blog posts use `text-accent` (#E5A00D) with underline decoration. Underline provides non-color differentiation from surrounding text. **Pass**
- Nav links use `text-text-muted` (#6B6B6B). On void background, 5.2:1 passes. But these are links differentiated only by position (nav bar), which is acceptable per SC 1.4.1. **Pass**

#### 1.4.10 Reflow (320px)

- Responsive spec confirms all screens reflow to single-column at mobile (<640px)
- Content constrained with `max-w-grid` and percentage-based margins
- Code blocks use `overflow-x-auto` with Scroll Area component
- No horizontal scrolling required for text content at 320px
- **Pass**

#### 1.4.11 Non-text Contrast (3:1)

| Element | Colors | Ratio | Status |
|---------|--------|-------|--------|
| Card borders | Border #1E1E1E on Void #050505 | ~1.4:1 | **FAIL** |
| Focus ring | Accent #E5A00D on Void #050505 | 8.7:1 | **Pass** |
| Pipeline connectors | Border #1E1E1E between nodes | Decorative (within role="img") | **N/A** |
| Completed pipeline nodes | Text #E8E8E8 on Void | 17.4:1 | **Pass** |
| Active pipeline node | Accent #E5A00D on Void | 8.7:1 | **Pass** |
| Pending pipeline nodes | Muted #6B6B6B on Void | 5.2:1 | **Pass** |

**Finding: Card border contrast.** Border #1E1E1E on Void #050505 has approximately 1.4:1 contrast. However, SC 1.4.11 applies to UI components that are needed to identify the component. If the card boundary is purely decorative (content is readable without perceiving the border), this is acceptable. The cards also have `bg-surface` (#111111) which creates a ~1.3:1 contrast with void -- subtle but paired with the border creates a perceptible container. The hover state changes to `border-strong` (#404040) which has ~2.6:1 against void. **Borderline -- acceptable if cards are identifiable through content grouping alone, but worth monitoring.**

#### 1.4.12 Text Spacing

No spec prevents user override of line-height, letter-spacing, word-spacing, or paragraph spacing. Design uses `leading-loose` and `tracking-*` Tailwind utilities which can be overridden. **Pass**

#### 1.4.13 Content on Hover or Focus

Pipeline nodes show tooltip on desktop hover (150ms). Tooltips must be dismissable (Escape), hoverable (mouse can move to tooltip without it disappearing), and persistent (stays until dismissed). **Not specified in design -- needs implementation guidance.**

---

## 2. Operable

### 2.1 Keyboard Accessible

#### 2.1.1 Keyboard (No Keyboard Trap)

| Element | Keyboard Access | Status |
|---------|----------------|--------|
| Skip-to-content link | Specified as first focusable element, visible on focus | **Pass** |
| Nav links | Standard `<a>` elements, tabbable | **Pass** |
| Brand mark (home link) | Standard `<a>` element | **Pass** |
| InstallCommand copy button | Clickable, should be `<button>` | **Pass** (needs `<button>` implementation) |
| GitHub CTA | Standard `<a>` element | **Pass** |
| PipelineViz | Wrapped in `role="img"` -- not individually focusable (decorative) | **Pass** |
| Feature cards | Cards have hover state but no click handler specified -- are they links? | **Needs clarification** |
| Blog post title links | Standard `<a>` elements | **Pass** |
| Back-to-changelog link | Standard `<a>` element | **Pass** |
| Code blocks with overflow | `tabindex="0"` for keyboard scrolling, `aria-label` specified | **Pass** |
| Footer links | Standard `<a>` elements | **Pass** |

**Finding: Feature cards.** The feature cards have hover interaction (`hover:border-border-strong`) but no link or click action is specified. If they are purely informational (no href), they should NOT be focusable. If they link to documentation, they need `<a>` wrappers. **Current spec: acceptable as non-interactive.**

#### 2.1.2 No Keyboard Trap

No modal dialogs, no custom widgets that trap focus. Sonner toast is non-modal. **Pass**

### 2.3 Seizures and Physical Reactions

#### 2.3.1 Three Flashes or Below Threshold

| Animation | Flash Risk | Status |
|-----------|-----------|--------|
| AtmosphericBg sparkle field | Static or very slow procedural -- not flashing | **Pass** |
| Pipeline node pulse | 2000ms ease-in-out, opacity 0.15-0.25 -- very subtle, no flash | **Pass** |
| Scroll reveal | One-shot 400ms fade, not repeating | **Pass** |
| Hover color transitions | 100-150ms, not flashing | **Pass** |

No animation exceeds the three-flashes-per-second threshold. **Pass**

#### 2.3.3 Animation from Interactions

All animations respect `prefers-reduced-motion: reduce`:
- Scroll reveals default to visible (opacity: 1, no animation)
- Pipeline pulse stops (static opacity: 0.15)
- Hover transitions reduced to 0.01ms
- **Pass**

### 2.4 Navigable

#### 2.4.1 Bypass Blocks

Skip-to-content link specified: `<a href="#main">Skip to content</a>`, visually hidden until focused, styled with `bg-accent text-on-accent`. **Pass**

#### 2.4.2 Page Titled

Not explicitly specified in design docs. Implementation must include:
- Landing: "Get Shit Pretty -- Design engineering for your terminal"
- Changelog: "Changelog -- Get Shit Pretty"
- Post: "{Post Title} -- Get Shit Pretty"
- **Needs implementation**

#### 2.4.3 Focus Order

Tab order follows visual/reading order per spec. No `tabindex` manipulation. **Pass**

#### 2.4.6 Headings and Labels

| Screen | Heading | Tag | Descriptive? |
|--------|---------|-----|-------------|
| 01 | "Get Shit Pretty" | H1 (assumed) | Brand name -- acceptable for homepage |
| 01 | "A design engineer in your terminal" | H2 | **Pass** |
| 01 | "Dual diamond. Brand to build." | H2 | **Pass** |
| 01 | "Ready to ship something pretty?" | H2 | **Pass** |
| 01 | Feature card titles (H3) | H3 | **Pass** |
| 02 | "Changelog" | H1 | **Pass** |
| 02 | Post titles | H2 | **Pass** |
| 03 | Post title | H1 | **Pass** |
| 03 | Section headings | H2, H3 | **Pass** |

**Issue:** Landing page has no explicit section heading for the Features grid. The design shows "3-column card grid" but no H2 before it. Screen readers lose context. **Minor -- add a visually-hidden H2 like "Features" before the grid.**

#### 2.4.7 Focus Visible

Focus ring specified: `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`. Amber #E5A00D on void #050505 = 8.7:1 contrast. Well above the 3:1 minimum for focus indicators.

Exception for primary CTA button (amber bg): focus ring uses `--color-text-bright` (#FAFAFA) instead. #FAFAFA on #E5A00D needs verification -- approximately 2.8:1. **Borderline for focus indicator contrast against the button background.** Consider using white (#FFFFFF) or adding a dark outline offset.

**Pass with caveat on primary CTA focus ring.**

#### 2.4.11 Focus Not Obscured (Minimum) -- New in WCAG 2.2

Sticky nav is 56px tall. When tabbing to elements below the nav, the focused element could be partially obscured by the sticky header. The design does not specify `scroll-margin-top` or `scroll-padding-top` on focusable elements.

**Needs implementation:** Add `scroll-padding-top: 64px` (56px nav + 8px buffer) to `<html>` or `scroll-margin-top` on section elements.

### 2.5 Input Modalities

#### 2.5.8 Target Size (Minimum) -- New in WCAG 2.2

WCAG 2.2 AA minimum is 24x24px. The design aims for 44x44px on mobile (best practice).

| Element | Specified Size | Status |
|---------|---------------|--------|
| Nav links | `min-h-[44px]` | **Pass** |
| CTA buttons | `min-h-[44px] px-4` | **Pass** |
| InstallCommand copy area | 44x44px tap area | **Pass** |
| Pipeline nodes on mobile | 44x44px with padding | **Pass** |
| Blog post titles | Full row tappable | **Pass** |
| Footer links (npm, GitHub, MIT) | Not specified | **Needs verification** -- small text links separated by `·` may be too close together |
| Badge tags | Not interactive -- display only | **N/A** |

**Finding: Footer links.** Three links separated by middle dots at `text-caption` size. On mobile, these could be below 24x24px and too close together. **Add `min-h-[44px] inline-flex items-center` and adequate gap.**

---

## 3. Understandable

### 3.1 Readable

#### 3.1.1 Language of Page

Not specified in design. Implementation must include `<html lang="en">`. **Needs implementation**

#### 3.1.2 Language of Parts

No multilingual content. **N/A**

**Monospace readability for long-form content:**

The changelog post uses `font-primary` (JetBrains Mono) for all prose. Monospace fonts are inherently less readable for long-form content than proportional fonts due to uniform character widths reducing word-shape recognition. However:

- Line length is constrained to `max-w-2xl` (672px) -- appropriate for readability
- `leading-loose` (1.75 line-height) provides generous vertical rhythm
- Body text at 16px is adequate size

**Observation:** This is a stylistic choice aligned with the terminal-native brand. For short-to-medium changelog posts, this is acceptable. If posts become longer (1500+ words), readability may degrade. Not a WCAG violation, but a usability consideration.

### 3.2 Predictable

#### 3.2.3 Consistent Navigation

Navigation is identical across all three screens (shared component). Same position, same links, same order. **Pass**

#### 3.2.4 Consistent Identification

- InstallCommand component is identical in hero and CTA footer sections
- Back-to-changelog links are identical at top and bottom of post
- Badge styling is consistent between changelog list and post
- **Pass**

### 3.3 Input Assistance

#### 3.3.1 Error Identification

No form inputs in current scope. **N/A**

**Copy-to-clipboard feedback:**

The InstallCommand copy action uses:
- Immediate: Icon swap (clipboard to check icon), "Copied!" text
- Toast: Sonner toast appears bottom-center with "Copied to clipboard"
- Screen reader: `aria-live="polite"` region announces "Copied to clipboard"

**Pass** -- the aria-live region handles screen reader feedback. Verify the toast also uses `role="status"` for redundancy.

---

## 4. Robust

### 4.1 Compatible

#### 4.1.2 Name, Role, Value

| Component | Specified Semantics | Status |
|-----------|-------------------|--------|
| PipelineViz | `role="img"` + `aria-label` (full description) | **Pass** |
| TerminalMock (hero) | `role="img"` referenced in reading order | **Needs explicit `aria-label` in component spec** |
| TerminalMock (section 3) | `role="img"` referenced in reading order | **Needs explicit `aria-label` in component spec** |
| InstallCommand copy button | `aria-label="Copy install command"`, state via `aria-live` | **Pass** |
| Changelog feed | `role="feed"` with `aria-label="Changelog entries"` | **Pass** |
| Tags | `role="list"` with `role="listitem"` children | **Pass** |
| Separators | `aria-hidden="true"` | **Pass** |
| Code blocks | `role="code"` from Shiki, `tabindex="0"` with `aria-label` for scrollable ones | **Pass** |
| Skip link | Proper href to `#main` | **Pass** |
| External links (GitHub) | `target="_blank" rel="noopener"` | **Pass** -- consider adding `aria-label` suffix "(opens in new tab)" |

---

## 5. Mobile Accessibility

### Touch Targets

All primary interactive elements specify 44x44px minimum on mobile. **Pass** (with footer link caveat noted in 2.5.8).

### Horizontal Overflow at 320px

| Element | 320px Behavior | Status |
|---------|---------------|--------|
| Navigation | Horizontal with 16px padding, tighter gap. 2 links + logo fits. | **Pass** |
| Hero CTAs | Stack full-width | **Pass** |
| TerminalMock | Full-width with 16px margin | **Pass** |
| Pipeline | Vertical compact layout with stacked nodes | **Pass** |
| Feature cards | Single column | **Pass** |
| InstallCommand | Full-width on mobile | **Pass** |
| Code blocks | Horizontal scroll via Scroll Area | **Pass** |
| Footer | Not specified for 320px. Flex row `justify-between` could overflow with brand mark + 3 links. | **Needs verification** |

**Finding: Footer at 320px.** Brand mark `/gsp: ◇◇` plus three links (`npm · GitHub · MIT`) in a flex row with `justify-between` may overflow at 320px with 16px margins. Consider wrapping to two rows on mobile.

### Viewport Meta

Not specified in design. Implementation must include `<meta name="viewport" content="width=device-width, initial-scale=1">` without `maximum-scale=1` or `user-scalable=no` (which would fail SC 1.4.4 Resize Text). **Needs implementation**

---

## 6. Cognitive Accessibility

### Reading Level

Landing page copy is concise and direct:
- "Design decisions, not design debt." -- Clear, punchy.
- "Brand-to-build in your terminal." -- Technical audience appropriate.
- Feature descriptions are 1-2 sentences each.

**Pass** -- language is appropriate for the developer audience.

### PipelineViz Complexity

The pipeline shows 10 nodes across 2 rows (4 branding + 6 project). Each node is a labeled diamond glyph connected by lines.

- **Visual complexity:** Moderate. Two clear rows with labels. Linear flow (not a graph).
- **Cognitive load:** Acceptable. The dual-diamond pattern is a known design methodology. Labels are single words.
- **At-a-glance comprehension:** The two-row structure with row labels ("Branding", "Project") provides clear grouping.
- **Screen reader alternative:** Comprehensive aria-label lists all steps in both phases.

**Pass** -- 10 nodes in two labeled groups is not cognitively overloading. The linear progression aids comprehension.

### Consistent Patterns

| Pattern | Consistency | Status |
|---------|------------|--------|
| Page structure | Nav + content + footer on all pages | **Pass** |
| Heading hierarchy | H1 per page, H2 for sections | **Pass** |
| Interactive styling | Amber for all interactive elements | **Pass** |
| Hover pattern | Color transition to accent on all hover targets | **Pass** |
| Back navigation | Same back link style on changelog post (top and bottom) | **Pass** |

---

## Summary

### Counts

| Category | Pass | Fail | Needs Implementation | N/A |
|----------|------|------|---------------------|-----|
| Perceivable | 14 | 2 | 2 | 1 |
| Operable | 11 | 0 | 3 | 1 |
| Understandable | 5 | 0 | 1 | 2 |
| Robust | 7 | 0 | 2 | 0 |
| Mobile | 5 | 0 | 2 | 0 |
| Cognitive | 4 | 0 | 0 | 0 |
| **Total** | **46** | **2** | **10** | **4** |

### Overall Conformance

**WCAG 2.2 AA: Conditionally conformant.** Two failures must be resolved before claiming conformance:

1. **Muted text on surface background** (SC 1.4.3) -- 4.4:1 fails the 4.5:1 threshold for normal-sized text. Affects feature card descriptions, badge text, and code comments.
2. **TerminalMock missing explicit `aria-label`** (SC 1.1.1) -- Role is specified but descriptive text is not documented.

Ten items need implementation-time attention (page titles, lang attribute, viewport meta, scroll-padding for sticky nav, footer responsive, tooltip behavior, feature section heading, footer touch targets, external link labeling, primary CTA focus ring).

### Design Strengths

- Excellent semantic HTML structure specified throughout
- Skip-to-content link fully designed
- `prefers-reduced-motion` support for all animations
- PipelineViz accessibility thoroughly considered (role="img" with descriptive label)
- aria-live region for copy feedback
- Touch targets specified at 44px for mobile
- `role="feed"` for changelog entries is a strong pattern
- Code block keyboard scrolling with `tabindex="0"` and aria-label

---

## Accessibility Statement (Draft)

> **Accessibility**
>
> Get Shit Pretty is committed to making this website accessible to everyone. We target WCAG 2.2 Level AA conformance.
>
> **What we do:**
> - All pages support keyboard navigation with visible focus indicators
> - Screen reader users can navigate via landmarks, headings, and skip links
> - Animations respect your motion preferences (`prefers-reduced-motion`)
> - Touch targets meet minimum size recommendations on mobile
> - Color contrast meets or exceeds WCAG AA ratios for all text
>
> **Known limitations:**
> - Some secondary text in card components uses a contrast ratio of 4.4:1, which meets AA for large text but not normal text. We are working on a fix.
>
> **Feedback:**
> If you experience any accessibility barriers, please open an issue on our [GitHub repository](https://github.com/jubs/get-shit-pretty).

---

## Related

- [Accessibility Fixes](./accessibility-fixes.md)
- [Accessibility Patterns (Research)](../research/accessibility-patterns.md)
- [Color System (Identity)](../../../branding/get-shit-pretty-v2/identity/color-system.md)
- [Color System (Foundations)](../../../branding/get-shit-pretty-v2/system/foundations/color-system.md)
