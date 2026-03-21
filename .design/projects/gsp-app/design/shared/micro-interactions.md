# Micro-interactions

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

All animations use brand motion tokens: 100ms (fast) or 150ms (normal), linear easing. All respect `prefers-reduced-motion: reduce` by disabling transforms and reducing opacity transitions to instant.

## Interaction Table

| Trigger | Element | Animation | Duration | Easing | Notes |
|---------|---------|-----------|----------|--------|-------|
| Hover | Nav link | `color: muted -> accent` | 100ms | linear | Immediate response |
| Hover | Card | `border-color: border -> border-strong` | 150ms | linear | Subtle elevation |
| Hover | Button (primary) | `background: accent -> accent-hover` | 100ms | linear | Brightens |
| Hover | Button (outline) | `border-color: border-strong -> accent`, `color: text -> accent` | 100ms | linear | Color shift only |
| Click | InstallCommand copy button | Icon swap (clipboard -> check), text "Copied!" | Instant swap | — | Resets after 2000ms |
| Click | InstallCommand copy button | Sonner toast appears bottom-center | 150ms | linear | "Copied to clipboard" |
| Scroll | Section enter viewport | `opacity: 0 -> 1`, `translateY(8px) -> 0` | 400ms | ease-out | CSS-only, one-shot via `@keyframes` + `animation-fill-mode: both`. IntersectionObserver adds class |
| Scroll | Nav background | Backdrop blur appears on scroll past hero | Instant | — | Already sticky; blur is always on |
| Idle | Pipeline active node | Subtle opacity pulse on active diamond glow | 2000ms | ease-in-out | CSS `@keyframes pulse`. Expression lavender at 15% opacity |
| Hover | Pipeline node | Border-strong highlight, tooltip with phase name | 150ms | linear | Only on desktop |
| Focus | Any interactive | `outline: 2px solid accent`, `outline-offset: 2px` | Instant | — | `focus-visible` only |

## Scroll Reveal Implementation

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  opacity: 0;
}

.reveal.visible {
  animation: fadeInUp 400ms ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; }
  .reveal.visible { animation: none; }
}
```

Minimal JS: IntersectionObserver adds `.visible` class once. No library needed.

## Pipeline Pulse

```css
@keyframes nodePulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.25; }
}

.pipeline-active-glow {
  animation: nodePulse 2000ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .pipeline-active-glow { animation: none; opacity: 0.15; }
}
```

---

## Related

- [Navigation](./navigation.md)
- [Component Plan](./component-plan.md)
- [Screen 01: Landing](../screen-01-landing.md)
