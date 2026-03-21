# Accessibility Patterns

> Phase: research | Project: gsp-app | Generated: 2026-03-19

---

## WCAG 2.2 AA Criteria Most Relevant

| Criterion | Level | Why It Matters for GSP |
|-----------|-------|----------------------|
| 1.4.3 Contrast (Minimum) | AA | Dark mode with muted text (#6B6B6B on #050505) must meet 4.5:1 |
| 1.4.11 Non-text Contrast | AA | Pipeline node borders, card borders must meet 3:1 against bg |
| 2.4.1 Bypass Blocks | A | Skip-to-content link for keyboard users |
| 2.4.7 Focus Visible | AA | Focus indicators must be visible on void (#050505) background |
| 2.4.11 Focus Appearance | AA (new in 2.2) | Focus indicator must have 3:1 contrast, min 2px solid |
| 2.5.8 Target Size (Minimum) | AA (new in 2.2) | Touch targets at least 24x24px (44px recommended on mobile) |
| 4.1.2 Name, Role, Value | A | Pipeline visualization nodes need accessible names |

Source: [WCAG 2.2 Complete Guide](https://www.allaccessible.org/blog/wcag-22-complete-guide-2025)

---

## Keyboard Navigation Map

### Tab Order: Landing Page

```
[Skip to content link] (visible on focus)
    |
[Logo / Home link]
    |
[Nav: Changelog] -> [Nav: GitHub]
    |
[Hero: Install CTA (primary)] -> [Hero: GitHub CTA (secondary)]
    |
[Pipeline Viz: Interactive nodes (if interactive)]
    |
[Feature cards (if links)] -- left to right, top to bottom
    |
[Footer: Install CTA] -> [Footer: GitHub] -> [Footer: npm]
```

### Tab Order: Changelog List

```
[Skip to content]
    |
[Nav links]
    |
[Post 1 link] -> [Post 2 link] -> ... -> [Post N link]
    |
[Footer links]
```

### Skip Links

Implement a skip-to-content link as the first focusable element. Pattern:

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50
  focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent
  focus:rounded-sm focus:font-primary focus:text-sm">
  Skip to content
</a>
```

Use shadcn/ui's `visually-hidden` component as the base, enhancing with focus-visible styles.

---

## Focus Indicators on Dark Backgrounds

### The Challenge

Default browser focus rings (blue outline) are nearly invisible on #050505 void background. Custom focus styles are mandatory.

### GSP Focus Ring Pattern

```css
:focus-visible {
  outline: 2px solid var(--color-accent);  /* #E5A00D amber */
  outline-offset: 2px;
  border-radius: var(--radius-sm);         /* 2px */
}
```

**Why amber works:** #E5A00D on #050505 has a contrast ratio well above the 3:1 minimum required by WCAG 2.4.11. The 2px offset prevents the ring from overlapping content. This matches the `target-adaptations.md` spec: "ring-accent (amber) with 2px offset."

**Exception -- on amber backgrounds:** For the primary CTA button (amber bg), the focus ring should be white or bright text color:

```css
.btn-primary:focus-visible {
  outline-color: var(--color-text-bright);  /* #FAFAFA */
  outline-offset: 2px;
}
```

Source: [WCAG 2.4.11 Focus Appearance Guide](https://www.allaccessible.org/blog/wcag-2413-focus-appearance-guide), [Managing Focus Indicators](https://vispero.com/resources/managing-focus-and-visible-focus-indicators-practical-accessibility-guidance-for-the-web/)

---

## Pipeline Visualization Accessibility

### Challenge

The PipelineViz is a visual, potentially animated component showing a dual-diamond workflow. It must be accessible to screen readers and keyboard users.

### Approach

**Role and labeling:**

```html
<figure role="img" aria-label="GSP dual-diamond pipeline: Branding phase (discover, strategy, identity, system) and Project phase (brief, research, design, critique, build, review)">
  <!-- Visual nodes and connections -->
  <figcaption class="sr-only">
    The GSP pipeline follows two connected diamond processes.
    The Branding diamond covers discovery, strategy, identity, and system design.
    The Project diamond covers brief, research, design, critique, build, and review.
  </figcaption>
</figure>
```

**If nodes are interactive (clickable/hoverable):**

- Each node should be a `<button>` or `<a>` with `aria-label="Branding: Discover phase"`
- Tab through nodes in logical order (left to right, following the pipeline flow)
- Arrow keys for navigation within the pipeline group (`role="group"`)
- Focus on a node reveals tooltip/detail via `aria-describedby`

**If nodes are decorative (display only):**

- Use `role="img"` on the container with comprehensive `aria-label`
- Individual nodes are `aria-hidden="true"`
- Provide a `<figcaption>` with text description (can be visually hidden)

---

## Reduced Motion

### Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Specific components affected:**

- **PipelineViz:** Entrance animation disabled. Shows final state immediately.
- **AtmosphericBg:** Gradient shift animation (if any) disabled. Static gradient shown.
- **TerminalMock:** Typing animation (if any) disabled. Full text shown immediately.
- **Hover transitions:** Reduced to near-instant (0.01ms). States still change, just without animation.

**Tailwind v4 utility:** Use `motion-safe:` and `motion-reduce:` variants:

```html
<div class="motion-safe:animate-fade-in motion-reduce:opacity-100">
```

---

## Semantic HTML Structure

```html
<body>
  <a href="#main">Skip to content</a>
  <header role="banner">
    <nav aria-label="Main navigation">...</nav>
  </header>
  <main id="main" role="main">
    <article> <!-- Landing page or blog post -->
      <section aria-labelledby="hero-heading">...</section>
      <section aria-labelledby="features-heading">...</section>
      <figure role="img" aria-label="Pipeline visualization">...</figure>
    </article>
  </main>
  <footer role="contentinfo">...</footer>
</body>
```

### Blog Post Semantics

```html
<article>
  <header>
    <time datetime="2026-03-19">March 19, 2026</time>
    <h1>Post Title</h1>
    <div role="list" aria-label="Tags">
      <span role="listitem">Feature</span>
    </div>
  </header>
  <div class="prose"><!-- MDX content --></div>
</article>
```

---

## Dark Mode Contrast Verification

Key color combinations from the brand system that need verification:

| Foreground | Background | Expected Ratio | Passes AA? |
|-----------|------------|-----------------|------------|
| #E8E8E8 (text) | #050505 (bg) | ~17.5:1 | Yes |
| #6B6B6B (muted) | #050505 (bg) | ~5.1:1 | Yes (normal), Yes (large) |
| #E5A00D (accent) | #050505 (bg) | ~8.5:1 | Yes |
| #050505 (on-accent) | #E5A00D (accent) | ~8.5:1 | Yes |
| #E8E8E8 (text) | #111111 (surface) | ~14.4:1 | Yes |
| #6B6B6B (muted) | #111111 (surface) | ~4.1:1 | Yes (normal), borderline |

**Watch item:** #6B6B6B on #111111 (muted text on surface cards) is close to the 4.5:1 threshold. Verify with a contrast checker. If it fails, bump muted text to #767676 or surface to #0A0A0A.

---

## Related

- [Scope](../brief/scope.md)
- [Target Adaptations](../brief/target-adaptations.md)
- [Recommendations](./recommendations.md)
