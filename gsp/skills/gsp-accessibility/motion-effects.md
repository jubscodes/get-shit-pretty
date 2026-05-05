# Motion + Effects Accessibility

Canonical accessibility guidance for visual effects. Read by `gsp-project-build`'s builder methodology and `gsp-project-build/visual-effects.md`. Owned by `gsp-accessibility` per the two-layer architecture (CLAUDE.md): expertise skills own domain knowledge.

## prefers-reduced-motion

All visual effects must degrade gracefully:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This rule applies everywhere — entrance animations, hover transforms, scroll-driven reveals, parallax. No effect should fight the user's stated preference.

## Contrast on effects

Effects must not compromise text/UI contrast:

- **Glow / shadow on text** — ensure text contrast meets WCAG AA *without* the effect (effects can fail in high-contrast mode or for users with backdrop-filter disabled)
- **Backdrop-blur** — pair with `@supports not (backdrop-filter: blur(1px))` solid-background fallback. The fallback must independently meet AA contrast against the foreground content
- **Gradient text** — test contrast ratio of *both endpoints*, not just the midpoint. A gradient from light-blue to dark-blue passes at one end and fails at the other
- **Translucent surfaces** — verify the layer behind (worst case: pure white or pure black if backdrop-filter is dropped) meets AA against the foreground

## Hover / interaction magnitudes

Keep transforms small to avoid disorientation:

- Translate: 2-4px maximum
- Scale: 1.02-1.05 maximum (5% growth ceiling)
- Rotation: avoid except for explicit affordances (loading spinners, expand chevrons)
- Layout-property animation (width/height/padding) — don't; use transform instead

## Cross-references

- `gsp-project-build/visual-effects.md` — CSS recipes for the effects this guidance constrains
- `gsp-accessibility-audit/wcag-checklist.md` — broader WCAG 2.2 AA criteria
- `gsp-accessibility/SKILL.md` — `--check`, `--tokens` modes for contrast validation
