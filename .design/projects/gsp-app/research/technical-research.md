# Technical Research

> Phase: research | Project: gsp-app | Generated: 2026-03-19

---

## MDX Strategy

### Recommendation: @next/mdx with dynamic imports

Three options evaluated:

| Option | Status | Best For | Risk |
|--------|--------|----------|------|
| @next/mdx | Actively maintained, official | Local MDX files as pages | Frontmatter requires plugin |
| next-mdx-remote | Poorly maintained, RSC unstable | Remote/CMS content | Future compat issues |
| Velite/Contentlayer | Contentlayer dead, Velite niche | Complex content pipelines | Ecosystem fragility |

**Decision: Use @next/mdx.** GSP's blog content lives in the repo (no CMS), making @next/mdx the simplest path. It runs server-side so the MDX runtime doesn't ship to the client.

### Implementation Pattern

```
content/
  changelog/
    v0-5-0.mdx
    v0-4-0.mdx
app/
  changelog/
    page.tsx          <-- List view (reads content/ dir)
    [slug]/
      page.tsx        <-- Dynamic import of MDX file
```

**Frontmatter approach:** @next/mdx doesn't support YAML frontmatter natively. Use exported `metadata` objects in MDX files instead:

```mdx
export const metadata = {
  title: "v0.5.0 -- Design System Scanning",
  date: "2026-03-19",
  tags: ["feature", "composable-skills"],
  version: "0.5.0"
}

# v0.5.0 -- Design System Scanning
...
```

This is idiomatic Next.js and avoids adding remark-frontmatter/gray-matter dependencies.

**Static generation:** Use `generateStaticParams` + `dynamicParams: false` to prerender all blog posts at build time. Zero runtime MDX parsing.

Source: [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx)

---

## Tailwind v4 Configuration

### CSS-First Setup

Tailwind v4 replaces `tailwind.config.js` with CSS-native `@theme` directives. All design tokens defined in CSS.

```css
@import "tailwindcss";

@theme {
  /* GSP Brand Tokens */
  --color-bg: #050505;
  --color-surface: #111111;
  --color-surface-elevated: #1E1E1E;
  --color-text: #E8E8E8;
  --color-text-bright: #FAFAFA;
  --color-text-muted: #6B6B6B;
  --color-accent: #E5A00D;
  --color-accent-hover: #F0B020;
  --color-border: #1E1E1E;
  --color-border-strong: #333333;

  /* Expression palette */
  --color-expression-lavender: #B8A9D4;
  --color-expression-rose: #E8B4C8;

  /* Fonts */
  --font-primary: "JetBrains Mono", monospace;
  --font-display: "Instrument Sans", sans-serif;

  /* Radius -- no shadows */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-full: 9999px;
}
```

**Key difference from v3:** No JavaScript config file. The `@theme` directive generates both CSS variables AND utility classes. `bg-bg`, `text-accent`, `font-primary` all work automatically.

**For shadcn/ui integration:** Use `@theme inline` to map GSP tokens to shadcn's expected variable names:

```css
@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--text);
  --color-primary: var(--accent);
  --color-primary-foreground: var(--color-on-accent);
}
```

Source: [Tailwind v4 Theme Docs](https://tailwindcss.com/docs/theme), [shadcn Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4)

---

## shadcn/ui Theming

### CSS Variable Override Strategy

shadcn/ui v2 uses OKLCH color format (matching GSP's approach). The override strategy from `target-adaptations.md` is sound. Key implementation notes:

1. **Define GSP tokens in `:root`** -- These are the source of truth
2. **Map to shadcn variables in `:root`** -- `--background: var(--color-bg)`
3. **Register with `@theme inline`** -- Makes them available as Tailwind utilities
4. **No `.dark` class needed** -- GSP is dark-only for launch. Define everything in `:root`

**Animation migration:** shadcn/ui deprecated `tailwindcss-animate` in favor of `tw-animate-css`. Install `tw-animate-css` and import it instead:

```css
@import "tw-animate-css";
```

**Component data-slot:** All shadcn primitives now include `data-slot` attributes for targeted styling. Use `[data-slot="button"]` selectors for global overrides.

Source: [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

---

## Font Loading

### next/font/google Setup

```typescript
import { JetBrains_Mono, Instrument_Sans } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-primary',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})
```

Apply both to the root layout's `<html>` or `<body>` as `className={`${jetbrainsMono.variable} ${instrumentSans.variable}`}`.

**Performance:** `next/font` self-hosts fonts (no Google Fonts requests). `display: swap` prevents FOIT. The variable approach allows CSS custom properties to reference them via `var(--font-primary)`.

**Instrument Sans availability:** Verify Instrument Sans is on Google Fonts. If not, use `next/font/local` with downloaded files. JetBrains Mono is confirmed available.

Source: [Google Fonts: JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## Code Syntax Highlighting

### Shiki Setup

Shiki runs server-side, ships zero JavaScript, and supports custom themes. For GSP's terminal-style code blocks:

**Integration with MDX:** Use `@shikijs/rehype` as a rehype plugin in the MDX pipeline:

```javascript
// next.config.mjs
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      ['@shikijs/rehype', { theme: 'vitesse-dark' }]
    ],
  },
})
```

**Custom theme approach:** Create a monochrome theme with amber accents for keywords:

- Background: `#111111` (surface)
- Default text: `#E8E8E8` (text)
- Keywords: `#E5A00D` (accent, used sparingly)
- Comments: `#6B6B6B` (text-muted)
- Strings: `#B8A9D4` (expression-lavender, optional)

**Transformers:** Use `@shikijs/transformers` for line highlighting and diff display in changelog posts.

Source: [Shiki Guide](https://shiki.style/guide/), [Shiki + Next.js](https://shiki.style/packages/next)

---

## Animation Strategy

### CSS-Only for Pipeline Visualization

Research finding: Framer Motion adds ~50kb to bundle. For GSP's pipeline visualization (connected nodes with diamond states), CSS is sufficient.

**Recommended approach:**

- **Node entrance:** CSS `@keyframes` with staggered `animation-delay` for sequential node reveal
- **Diamond state transitions:** CSS `transition` on `transform` and `opacity`
- **Connection lines:** CSS `border` or `background` with `scaleX` animation
- **Hover effects:** CSS `transition` on `border-color` and `box-shadow` (glow via expression color)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all animation, shows static state

**When to add Framer Motion:** Only if scroll-triggered entrance animations are needed across multiple sections. For a single pipeline component, CSS is sufficient and lighter.

Tailwind v4 supports `@keyframes` inside `@theme` blocks, keeping animation definitions co-located with design tokens.

Source: [Motion Magazine: Animation Performance](https://motion.dev/magazine/web-animation-performance-tier-list), [CSS vs Framer Motion](https://blog.ryanaque.com/fuck-framer-motion-im-going-to-css-instead/)

---

## Open Graph Images

### Dynamic Generation with ImageResponse

Next.js provides `ImageResponse` (from `next/og`) for generating OG images with JSX and CSS. No external dependencies needed.

**Implementation:**

```
app/
  opengraph-image.tsx              <-- Default OG image (landing page)
  changelog/
    [slug]/
      opengraph-image.tsx          <-- Per-post OG image
```

**Font loading in OG images:** Load JetBrains Mono as an ArrayBuffer for use in ImageResponse. The expression palette gradient (lavender to rose) provides the background wash described in `target-adaptations.md`.

**Constraints:** Only flexbox layout supported. No CSS Grid. No `border-radius` on images. Keep designs simple -- monospace text on gradient background with brand mark.

**Size:** 1200x630px standard. Generate as PNG.

Source: [Next.js OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

---

## Performance Patterns

### Static Generation

- All pages statically generated at build time (no server runtime needed)
- Blog posts use `generateStaticParams` for pre-rendering
- Expression gradients are CSS-only (no image assets)
- Shiki runs at build time (zero JS for syntax highlighting)

### Bundle Optimization

- No Framer Motion (CSS animations only) saves ~50kb
- next/font self-hosts fonts (no external requests)
- shadcn/ui components are tree-shakeable (only import what's used)
- MDX compiles to React components at build time

### Target: Lighthouse 90+

The static nature of the site (no API calls, no dynamic data, no auth) makes 90+ achievable with standard Next.js optimization.

---

## Related

- [Scope](../brief/scope.md)
- [Target Adaptations](../brief/target-adaptations.md)
- [Reference Specs](./reference-specs.md)
