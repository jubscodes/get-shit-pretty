# Responsive Behavior

> Phase: design | Project: gsp-app | Generated: 2026-03-19

---

## Breakpoints

| Name | Width | Token | Grid Columns | Margin |
|------|-------|-------|-------------|--------|
| Mobile | <640px | `--bp-sm` | 4 | 16px |
| Tablet | 640-1023px | `--bp-md` | 8 | 24px |
| Desktop | 1024px+ | `--bp-lg` | 12 | 48px |

Max content width: 1200px (`max-w-grid`). Centered with `mx-auto`.

---

## Per-Section Adaptations

### Navigation

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Horizontal, 16px padding, tighter link gap | Horizontal, 24px padding | Horizontal, 48px padding |

Same layout at all sizes. No hamburger.

### Hero

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Display 2 headline (clamp scales down), stacked CTAs (full-width buttons), TerminalMock below at full width | Display 1 (mid), inline CTAs, TerminalMock constrained | Display 1 (full), inline CTAs side by side, TerminalMock max-w-2xl centered |

Atmospheric gradient renders at all sizes but is more visible on larger screens.

### What is GSP

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Single column: prose above, TerminalMock below | Two-column: 4+4 grid, prose left, terminal right | Two-column: 5+7 grid, prose left, terminal right |

### Pipeline Visualization

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Vertical compact: stacked nodes with vertical connectors | Horizontal compact: two rows (branding + project) | Horizontal full: two rows with generous spacing |

### Features Grid

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Single column, cards stacked | 2-column grid | 3-column grid |

### CTA Footer

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Full-width install block, stacked GitHub link below | Inline layout | Inline layout |

### Changelog List

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Full width with 16px margin | max-w-xl centered | max-w-2xl centered |

### Changelog Post

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Full width with 16px margin, code blocks scroll horizontally | max-w-xl centered | max-w-2xl centered |

---

## Typography Scaling

Body text stays at 16px at all breakpoints. Only display and heading sizes change via `clamp()`.

| Level | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Display 1 | ~56px | ~96px | ~160px |
| Display 2 | ~40px | ~56px | ~72px |
| H1 | ~28px | ~32px | ~40px |
| H2 | ~22px | ~24px | ~28px |
| H3 | ~18px | ~20px | ~20px |
| Body | 16px | 16px | 16px |

---

## Touch Targets

All interactive elements on mobile have minimum 44x44px touch targets:

- Nav links: `min-h-[44px] flex items-center`
- Buttons: `min-h-[44px] px-4` (padding provides width)
- InstallCommand copy: 44x44px tap area
- Pipeline nodes: 44x44px tap area with padding
- Blog post titles (as links): full row is tappable

---

## Spacing Scale by Breakpoint

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Section vertical gap | 64px (`space-16`) | 80px | 96px (`space-24`) |
| Card grid gap | 16px | 24px | 24px |
| Component padding | 16px | 24px | 24px |

---

## Related

- [Navigation](./navigation.md)
- [Screen 01: Landing](../screen-01-landing.md)
- [Screen 02: Changelog List](../screen-02-changelog-list.md)
- [Screen 03: Changelog Post](../screen-03-changelog-post.md)
