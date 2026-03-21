# Navigation

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Pattern

Horizontal sticky navigation bar. No hamburger menu at any breakpoint (only 2-3 items).

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  /gsp: ◇◇                          Changelog   GitHub ↗     │
└──────────────────────────────────────────────────────────────┘
```

- **Left:** Brand mark (`/gsp: ◇◇`) — links to `/`. Monospace, text-bright, font-bold
- **Right:** Navigation links — `Changelog` (internal), `GitHub` (external, opens new tab)
- **Height:** 56px (h-14)
- **Padding:** 0 48px desktop, 0 24px tablet, 0 16px mobile

## Styling

- **Container:** `sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm`
- **Inner:** `max-w-[1200px] mx-auto flex items-center justify-between h-14`
- **Links:** `font-primary text-body-sm text-text-muted hover:text-accent transition-colors duration-fast`
- **Active link:** `text-text-bright font-medium`
- **GitHub link:** Includes subtle external-link icon (12px), `target="_blank" rel="noopener"`

## Focus States

- Links receive `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
- Brand mark receives same focus ring

## Responsive Behavior

| Breakpoint | Change |
|------------|--------|
| Desktop (1024px+) | Full layout as described, 48px horizontal padding |
| Tablet (640-1023px) | Same layout, 24px horizontal padding |
| Mobile (<640px) | Same horizontal layout, 16px padding, tighter gap between links (16px instead of 24px) |

No hamburger at any breakpoint. With only 2 links + logo, horizontal fits at 320px.

## Skip Link

Hidden anchor above nav: `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to content</a>`. Becomes visible on keyboard focus. Styled with `bg-accent text-on-accent px-4 py-2 rounded-sm font-primary text-body-sm`.

## Token References

| Property | Token | Value |
|----------|-------|-------|
| Background | `--color-bg` | #050505 at 80% opacity |
| Border | `--color-border` | #1E1E1E |
| Link color | `--color-text-muted` | #6B6B6B |
| Link hover | `--color-accent` | #E5A00D |
| Active link | `--color-text-bright` | #FAFAFA |
| Font | `--font-primary` | JetBrains Mono |
| Font size | `--text-body-sm` | 14px |
| Transition | `--duration-fast` | 100ms linear |

---

## Related

- [Information Architecture](./information-architecture.md)
- [Micro-interactions](./micro-interactions.md)
- [Screen 01: Landing](../screen-01-landing.md)
