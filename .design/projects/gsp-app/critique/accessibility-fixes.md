# Accessibility Fixes

> Phase: critique | Project: gsp-app | Generated: 2026-03-19

---

## Violations

| # | Issue | Severity | WCAG Criterion | Screen | Remediation |
|---|-------|----------|----------------|--------|-------------|
| 1 | Muted text (#6B6B6B) on surface (#111111) fails 4.5:1 for normal text (4.4:1 actual) | **Critical** | 1.4.3 Contrast (Minimum) | 01, 02, 03 | Bump muted to #787878 or darken surface to #0D0D0D |
| 2 | TerminalMock components lack explicit `aria-label` text | **Critical** | 1.1.1 Non-text Content | 01 | Add descriptive aria-label to each TerminalMock |
| 3 | Hero headline not explicitly tagged as `<h1>` in spec | **Major** | 1.3.1 Info and Relationships | 01 | Confirm Display 1 headline renders as `<h1>` |
| 4 | Features grid has no section heading | **Major** | 2.4.6 Headings and Labels | 01 | Add visually-hidden H2 "Features" before grid |
| 5 | AtmosphericBg sparkle field missing `aria-hidden="true"` | **Major** | 1.1.1 Non-text Content | 01 | Add `aria-hidden="true"` to decorative layer |
| 6 | Focus not obscured -- no scroll-padding for sticky nav | **Major** | 2.4.11 Focus Not Obscured | All | Add `scroll-padding-top: 64px` to html |
| 7 | Footer links may fail 24px minimum target size on mobile | **Major** | 2.5.8 Target Size | All | Add min-height and adequate gap to footer links |
| 8 | Footer flex row may overflow at 320px | **Major** | 1.4.10 Reflow | All | Wrap footer to two rows on mobile |
| 9 | Pipeline tooltip hover behavior unspecified | Minor | 1.4.13 Content on Hover | 01 | Spec dismissable, hoverable, persistent tooltip |
| 10 | Primary CTA focus ring on amber bg may be below 3:1 | Minor | 2.4.11 Focus Appearance | 01 | Use #FFFFFF or add dark offset ring |
| 11 | `<html lang="en">` not specified | Minor | 3.1.1 Language of Page | All | Add to implementation checklist |
| 12 | Page titles not specified | Minor | 2.4.2 Page Titled | All | Add unique `<title>` per page |
| 13 | Viewport meta not specified | Minor | 1.4.4 Resize Text | All | Add viewport meta without scale restrictions |
| 14 | GitHub external link missing "(opens in new tab)" hint | Minor | 4.1.2 Name, Role, Value | All | Add `aria-label` suffix or visible text |
| 15 | Decorative diamond glyphs need `aria-hidden="true"` | Minor | 1.1.1 Non-text Content | 01, 02, 03 | Add `aria-hidden="true"` to all decorative glyphs |

---

## Detailed Remediation

### #1: Muted text contrast on surface backgrounds (Critical)

**WCAG:** 1.4.3 Contrast (Minimum)

**Problem:** `--color-text-muted` (#6B6B6B) on `--color-surface` (#111111) produces a 4.4:1 contrast ratio. WCAG AA requires 4.5:1 for normal text (under 18pt or under 14pt bold). This pair appears in:

- Feature card descriptions (`text-body-sm` = 14px) -- `../design/screen-01-landing.md` Section 5
- Badge/tag text (`text-caption`) on surface-colored badges -- `../design/screen-02-changelog-list.md`
- Code block comments (`text-text-muted`) in `bg-surface` code blocks -- `../design/screen-03-changelog-post.md`
- Pipeline row labels IF rendered on surface -- `../design/screen-01-landing.md` Section 4

**Fix options (choose one):**

**Option A -- Lighten muted text (recommended):**
Change `--color-text-muted` from #6B6B6B to #787878 in dark mode.
- #787878 on #111111 = ~5.0:1 (passes AA)
- #787878 on #050505 = ~5.7:1 (still passes AA)
- Minimal visual impact -- slightly lighter secondary text

**Option B -- Darken surface:**
Change `--color-surface` from #111111 to #0D0D0D.
- #6B6B6B on #0D0D0D = ~4.8:1 (passes AA)
- Reduces contrast between void and surface, may affect card perception

**Option C -- Context-specific override:**
Keep #6B6B6B globally but use a lighter muted (#787878) specifically on surface backgrounds via a `.on-surface` utility or CSS nesting:
```css
.bg-surface { --color-text-muted: #787878; }
```
This preserves the original muted value on void while fixing the surface context.

**Files to update:**
- `../../branding/get-shit-pretty-v2/identity/color-system.md` -- Foundation palette table
- `../../branding/get-shit-pretty-v2/system/foundations/color-system.md` -- Semantic token map, CSS properties, contrast table

### #2: TerminalMock missing aria-label (Critical)

**WCAG:** 1.1.1 Non-text Content

**Problem:** The design specifies `role="img"` for TerminalMock in the VoiceOver reading order, but no `aria-label` text is provided in the component specifications.

**Fix:** Add explicit `aria-label` to each TerminalMock instance:

- **Hero TerminalMock** (screen-01, Section 2): `aria-label="Terminal window showing GSP startup: the gsp command displays the brand mark and a pipeline flow preview with phases from discover through review"`
- **What is GSP TerminalMock** (screen-01, Section 3): `aria-label="Terminal window showing the gsp brand-identity command generating a color palette: primary amber, surface dark, with output written to .design/tokens.json"`

**File to update:** `../design/screen-01-landing.md` -- Sections 2 and 3 component specs

### #3: Hero headline semantic tag (Major)

**WCAG:** 1.3.1 Info and Relationships

**Problem:** The hero headline "Get Shit Pretty" is styled with Display 1 typography but the spec does not explicitly confirm it renders as an `<h1>` element. The overline "DESIGN ENGINEERING" above it could be mistaken for a heading.

**Fix:** Add to the hero component spec:
- Overline renders as `<p>` or `<span>` (NOT a heading)
- Headline "Get Shit Pretty" renders as `<h1>`
- Confirm this in the semantic structure section

**File to update:** `../design/screen-01-landing.md` -- Section 2

### #4: Missing features section heading (Major)

**WCAG:** 2.4.6 Headings and Labels

**Problem:** The Features grid (Section 5) has no heading. Screen reader users navigating by headings will jump from "Dual diamond. Brand to build." (H2) to feature card titles (H3), losing context.

**Fix:** Add a visually-hidden H2 before the features grid:
```html
<section aria-labelledby="features-heading">
  <h2 id="features-heading" class="sr-only">Features</h2>
  <div class="grid grid-cols-3 gap-6">
    <!-- cards -->
  </div>
</section>
```

**File to update:** `../design/screen-01-landing.md` -- Section 5

### #5: AtmosphericBg needs aria-hidden (Major)

**WCAG:** 1.1.1 Non-text Content

**Problem:** The ASCII sparkle field in the hero section is decorative but not explicitly marked as hidden from assistive technology. If a screen reader encounters the `<pre>` element containing sparkle characters, it will attempt to read them.

**Fix:** Add `aria-hidden="true"` and `role="presentation"` to the AtmosphericBg component:
```html
<pre aria-hidden="true" role="presentation" class="pointer-events-none ...">
  <!-- sparkle characters -->
</pre>
```

**File to update:** `../design/screen-01-landing.md` -- Section 2 AtmosphericBg component spec

### #6: Sticky nav focus obscuring (Major)

**WCAG:** 2.4.11 Focus Not Obscured (Minimum)

**Problem:** The 56px sticky nav can overlap focused elements when tabbing through page content. No scroll-padding is specified.

**Fix:** Add to the root layout or CSS:
```css
html {
  scroll-padding-top: 64px; /* 56px nav + 8px buffer */
}
```

Also ensure anchor targets (like `#main`) account for the sticky header.

**File to update:** `../design/shared/navigation.md` -- add scroll-padding specification

### #7: Footer link touch targets (Major)

**WCAG:** 2.5.8 Target Size (Minimum)

**Problem:** Footer links (npm, GitHub, MIT) at `text-caption` size separated by middle dots may produce touch targets below 24px on mobile.

**Fix:** Update footer link styling for mobile:
```html
<div class="flex items-center gap-4 sm:gap-2">
  <a class="min-h-[44px] inline-flex items-center ...">npm</a>
  <span aria-hidden="true">·</span>
  <a class="min-h-[44px] inline-flex items-center ...">GitHub</a>
  <span aria-hidden="true">·</span>
  <a class="min-h-[44px] inline-flex items-center ...">MIT</a>
</div>
```

**File to update:** `../design/screen-01-landing.md` -- Section 8 Footer

### #8: Footer reflow at 320px (Major)

**WCAG:** 1.4.10 Reflow

**Problem:** Brand mark + 3 links in `justify-between` flex row may overflow at 320px with 16px margins (288px usable width).

**Fix:** Wrap footer to stacked layout on mobile:
```html
<footer class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between py-8">
  <span>/gsp: ◇◇</span>
  <div class="flex items-center gap-4">...</div>
</footer>
```

**File to update:** `../design/screen-01-landing.md` -- Section 8 Footer, `../design/shared/responsive.md`

---

## Related

- [Accessibility Audit](./accessibility-audit.md)
- [Accessibility Patterns (Research)](../research/accessibility-patterns.md)
- [Screen 01: Landing](../design/screen-01-landing.md)
- [Screen 02: Changelog List](../design/screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../design/screen-03-changelog-post.md)
