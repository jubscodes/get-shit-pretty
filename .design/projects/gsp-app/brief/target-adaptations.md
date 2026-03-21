# Target Adaptations

> Phase: brief | Project: gsp-app | Generated: 2026-03-19

---

## Implementation Target: shadcn/ui + Tailwind v4

shadcn/ui ships with its own CSS variable scheme (`--background`, `--foreground`, `--primary`, etc.). The GSP brand system has its own token names. This section maps between them.

### Strategy: Override shadcn defaults with GSP tokens

Rather than rename all GSP tokens to match shadcn conventions, override shadcn's CSS variables at the root level. This keeps the brand system as the source of truth while letting shadcn components render correctly.

---

## Token Override Map (shadcn vars <- GSP tokens)

```css
@layer base {
  :root {
    /* shadcn expects HSL values, but Tailwind v4 supports oklch and raw values.
       Map GSP custom properties directly. */

    --background: var(--color-bg);           /* #050505 */
    --foreground: var(--color-text);         /* #E8E8E8 */

    --card: var(--color-surface);            /* #111111 */
    --card-foreground: var(--color-text);    /* #E8E8E8 */

    --popover: var(--color-surface-elevated); /* #1E1E1E */
    --popover-foreground: var(--color-text); /* #E8E8E8 */

    --primary: var(--color-accent);          /* #E5A00D */
    --primary-foreground: var(--color-on-accent); /* #050505 */

    --secondary: var(--color-surface);       /* #111111 */
    --secondary-foreground: var(--color-text); /* #E8E8E8 */

    --muted: var(--color-surface);           /* #111111 */
    --muted-foreground: var(--color-text-muted); /* #6B6B6B */

    --accent: var(--color-surface-elevated); /* #1E1E1E */
    --accent-foreground: var(--color-text-bright); /* #FAFAFA */

    --destructive: var(--color-error);       /* #E54D42 */
    --destructive-foreground: var(--color-text-bright); /* #FAFAFA */

    --border: var(--color-border);           /* #1E1E1E */
    --input: var(--color-border);            /* #1E1E1E */
    --ring: var(--color-accent);             /* #E5A00D */

    --radius: var(--radius-sm);              /* 2px */

    /* Chart colors (if needed) */
    --chart-1: var(--color-accent);
    --chart-2: var(--color-expression-lavender);
    --chart-3: var(--color-expression-rose);
    --chart-4: var(--color-success);
    --chart-5: var(--color-info);
  }
}
```

---

## Component Adaptations

### Button

- **Brand reference:** `system/components/web/token-mapping.md` -- Buttons section
- **Primary:** `bg-accent text-on-accent font-primary font-bold text-body-sm tracking-wide rounded-sm border border-accent`. Hover: `bg-accent-hover border-accent-hover`
- **Secondary (outline):** `bg-transparent text-text border border-border-strong`. Hover: `border-accent text-accent`
- **Ghost:** `bg-transparent text-text-muted`. Hover: `text-accent`
- **Override:** Remove all shadcn default `shadow-*` classes. GSP uses no shadows
- **Font:** All buttons use `font-primary` (JetBrains Mono), not system sans-serif

### Card

- **Brand reference:** `system/components/web/token-mapping.md` -- Cards section
- **Default:** `bg-surface border border-border rounded-md`. Hover: `border-border-strong`
- **Override:** Remove any `shadow-*`. No elevation through shadow
- **Title:** `font-primary font-bold text-h3 text-text-bright`
- **Description:** `text-body-sm text-text-muted`

### Badge

- **Default:** `rounded-full font-primary text-caption tracking-wider`
- **Variant (amber):** `bg-accent-surface text-accent border border-accent-dim`
- **Variant (muted):** `bg-surface text-text-muted border border-border`
- **Usage:** Blog post tags, version labels, status indicators

### Navigation

- **Brand reference:** `system/components/web/token-mapping.md` -- Navigation section
- **Links:** `font-primary text-body-sm text-text-muted`. Hover: `text-accent`. Active: `text-text-bright font-medium`
- **Container:** `border-b border-border bg-bg/80 backdrop-blur-sm` (sticky)
- **Mobile:** Sheet component slides from right. Same link styling, stacked vertically

### Separator

- **Default:** `bg-border` (maps to `#1E1E1E`)
- **Usage:** Between sections, above footer, between blog posts in list

### Code Block (custom)

- **Style:** `bg-surface border border-border rounded-none font-mono text-body-sm leading-loose`
- **No border radius** -- terminal-style, square edges
- **Syntax highlighting:** Monochrome with accent for keywords (amber sparingly)

---

## Expression Palette Usage

The expression palette (lavender, lilac, mauve, rose, blush) debuts on web here. Usage is intentional and sparse.

### Where expression colors appear

| Location | Treatment | Colors used |
|----------|-----------|-------------|
| Hero background | Atmospheric radial gradient at 10-12% opacity on void | Lavender + Rose |
| Pipeline visualization | Subtle glow behind active node | Lavender at 15% opacity |
| Blog post accent | Decorative border-left on blockquotes (optional) | Mauve |
| Social Open Graph image | Gradient wash behind brand mark | Lavender to Rose gradient |

### Where expression colors do NOT appear

- Navigation or footer (amber domain)
- Buttons or interactive elements (amber domain)
- Text body or headings (monochrome domain)
- Feature cards (monochrome + amber domain)

### Rule enforcement

Never combine expression colors and amber in the same visual context. The hero uses expression; the CTA buttons within it use amber. These occupy separate z-layers (background atmosphere vs. foreground interaction).

---

## Platform Considerations

### Responsive Behavior

| Breakpoint | Grid | Nav | Hero headline | Pipeline |
|------------|------|-----|---------------|----------|
| Mobile (<640px) | 4 col, 16px margin | Sheet drawer | Display 2 (clamp down) | Vertical compact |
| Tablet (640-1023px) | 8 col, 24px margin | Full nav | Display 1 (mid clamp) | Horizontal, compact |
| Desktop (1024px+) | 12 col, 48px margin | Full nav | Display 1 (full) | Horizontal, full |

### Font Loading

- Use `next/font/google` for JetBrains Mono (400, 500, 700) and Instrument Sans (600, 700)
- `font-display: swap` to prevent FOIT
- Preconnect to Google Fonts as fallback

### Performance

- Expression gradients use CSS only (no images)
- Pipeline visualization: CSS + minimal JS, no heavy animation library
- Blog content: Static MDX, no client-side rendering
- Images: Next.js Image component with lazy loading for any that exist

### Accessibility

- All color combinations pass WCAG AA per the contrast table in `system/foundations/color-system.md`
- Focus rings: `ring-accent` (amber) with 2px offset -- visible on void background
- Skip-to-content link for keyboard navigation
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<footer>`
- Pipeline visualization: `aria-label` on nodes, role="img" on the overall component

---

## Related

- [Scope](./scope.md)
- [Install Manifest](./install-manifest.md)
- [Brand: Token Mapping](../../../branding/get-shit-pretty-v2/system/components/web/token-mapping.md)
- [Brand: Color System](../../../branding/get-shit-pretty-v2/system/foundations/color-system.md)
- [Brand: Typography](../../../branding/get-shit-pretty-v2/system/foundations/typography.md)
- [Brand: Elevation](../../../branding/get-shit-pretty-v2/system/foundations/elevation.md)
