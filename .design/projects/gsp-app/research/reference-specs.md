# Reference Specs

> Phase: research | Project: gsp-app | Generated: 2026-03-19

---

## shadcn/ui Documentation

### Theming API

**Source:** [ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)
**Retrieved:** 2026-03-19

**Key takeaways:**

- All colors now use OKLCH format: `oklch(lightness chroma hue)`
- Background/foreground naming convention: `--primary` for bg, `--primary-foreground` for text
- Custom colors added via `:root` + `@theme inline` pattern
- CSS variables defined in `:root` and `.dark` selectors (GSP only needs `:root`)

**Complete variable list for override:**
`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`, `--chart-1` through `--chart-5`

**How it applies:** The token override map in `target-adaptations.md` covers all these variables. The OKLCH format aligns with GSP's color system.

### Tailwind v4 Migration

**Source:** [ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4)
**Retrieved:** 2026-03-19

**Key changes for build:**

- Replace `tailwindcss-animate` with `tw-animate-css`
- Use `@theme inline` to register custom colors as Tailwind utilities
- Remove `hsl()` wrappers from color values (Tailwind v4 handles this)
- Chart color references change from `hsl(var(--chart-1))` to `var(--chart-1)`
- All components now include `data-slot` attributes for styling

### Component API

**Source:** [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

**Components to install for GSP (from install-manifest.md):**
`navigation-menu`, `sheet`, `separator`, `scroll-area`, `card`, `badge`, `button`, `tooltip`, `visually-hidden`

**One-line install:**
```bash
npx shadcn@latest add navigation-menu sheet separator scroll-area card badge button tooltip visually-hidden
```

---

## Next.js App Router

### Routing and Layout

**Source:** [nextjs.org/docs/app](https://nextjs.org/docs/app)
**Retrieved:** 2026-03-19

**Key conventions for GSP:**

```
app/
  layout.tsx          <-- Root layout (fonts, theme, nav, footer)
  page.tsx            <-- Landing page
  changelog/
    layout.tsx        <-- Changelog layout (narrower column)
    page.tsx          <-- List view
    [slug]/
      page.tsx        <-- Individual post
      opengraph-image.tsx  <-- Dynamic OG per post
  opengraph-image.tsx <-- Default OG image
  globals.css         <-- Tailwind + token definitions
```

**Layout nesting:** Root layout wraps all pages. Changelog layout adds centered reading column. This matches the scope's "6-8 col centered" requirement.

### Metadata API

**Source:** [nextjs.org/docs/app/getting-started/metadata-and-og-images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
**Retrieved:** 2026-03-19

**Static metadata in layouts:**
```typescript
export const metadata: Metadata = {
  title: 'Get Shit Pretty -- Design Engineering for CLI Tools',
  description: 'A design system that runs in your terminal.',
}
```

**Dynamic metadata for blog posts:**
```typescript
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  return { title: post.title, description: post.excerpt }
}
```

**OG image generation:** Use `ImageResponse` from `next/og` in `opengraph-image.tsx` files. Supports JSX/CSS (flexbox only), custom fonts loaded as ArrayBuffer. Output: 1200x630 PNG.

---

## Tailwind CSS v4

### @theme Directive

**Source:** [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme)
**Retrieved:** 2026-03-19

**Namespace reference for GSP tokens:**

| GSP Token | Tailwind Namespace | Generated Utility |
|-----------|-------------------|-------------------|
| `--color-bg` | `--color-*` | `bg-bg`, `text-bg` |
| `--color-accent` | `--color-*` | `bg-accent`, `text-accent` |
| `--font-primary` | `--font-*` | `font-primary` |
| `--font-display` | `--font-*` | `font-display` |
| `--radius-sm` | `--radius-*` | `rounded-sm` |
| `--spacing-*` | `--spacing-*` | `p-*`, `m-*`, `gap-*` |

**Key patterns:**

- `@theme { }` for design tokens that generate utilities
- `@theme inline { }` for tokens referencing other variables
- `--*: initial` to reset entire namespaces (not needed for GSP -- extend defaults)
- Animation keyframes can be defined inside `@theme` blocks

**Simplified import:** `@import "tailwindcss"` replaces three `@tailwind` directives.

### Animation Definitions

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-up: slide-up 0.4s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

Usage: `class="animate-fade-in"` or `class="motion-safe:animate-slide-up"`

---

## MDX Ecosystem

### @next/mdx Setup

**Source:** [nextjs.org/docs/app/guides/mdx](https://nextjs.org/docs/app/guides/mdx)
**Retrieved:** 2026-03-19

**Required packages:**
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

**Required file:** `mdx-components.tsx` at project root. Maps HTML elements to custom React components (styled headings, code blocks, etc.).

**Frontmatter:** Not supported natively. Use exported `metadata` objects:
```mdx
export const metadata = { title: "...", date: "...", tags: [...] }
```

**Plugin pipeline:** rehype plugins (like Shiki) configured in `next.config.mjs` via `createMDX({ options: { rehypePlugins: [...] } })`.

**Tailwind Typography:** Install `@tailwindcss/typography` and use `prose` classes on the blog post layout wrapper for automatic markdown styling.

---

## Shiki Syntax Highlighting

### Configuration

**Source:** [shiki.style/guide](https://shiki.style/guide/)
**Retrieved:** 2026-03-19

**Integration:** Use `@shikijs/rehype` as a rehype plugin in the MDX pipeline. Runs server-side, zero client JS.

**Relevant built-in themes:**
- `vitesse-dark` -- Minimal dark theme, good base for customization
- `github-dark` -- Familiar to developers
- `material-theme-darker` -- Deep dark, minimal color

**Custom theme:** Follow VS Code theme JSON format. Define token colors mapping to GSP brand colors (amber for keywords, muted for comments, text for default).

**Transformers:** `@shikijs/transformers` package provides line highlighting, diff notation, and focus highlighting. Useful for changelog code examples.

**Package:**
```bash
npm install shiki @shikijs/rehype @shikijs/transformers
```

---

## next/font

### Google Fonts Integration

**Source:** [nextjs.org/docs/app/optimizing/fonts](https://nextjs.org/docs/app/optimizing/fonts)

**Key behavior:**
- Self-hosts font files at build time (no runtime Google Fonts requests)
- `variable` option creates CSS custom property: `--font-primary`
- `display: 'swap'` prevents Flash of Invisible Text
- Multiple fonts applied via className concatenation on `<html>`
- Subset to `latin` to minimize file size

**Instrument Sans note:** Available on Google Fonts as of 2024. Weights available: 400-700 + italic. GSP needs 600 (SemiBold) and 700 (Bold) for display headings.

---

## Accessibility Specs

### WCAG 2.2 Quick Reference

**Source:** [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)

**Most relevant for GSP:**

- **1.4.3:** Text contrast 4.5:1 (normal), 3:1 (large/bold)
- **1.4.11:** Non-text contrast 3:1 (borders, icons, focus indicators)
- **2.4.1:** Skip navigation mechanism
- **2.4.7:** Focus visible on keyboard navigation
- **2.4.11:** Focus appearance -- 2px minimum, 3:1 contrast
- **2.5.8:** Target size -- 24x24px minimum for touch targets

### Focus Visible Spec

**Source:** [w3.org/WAI/WCAG22/Understanding/focus-visible.html](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)

**Key requirement:** When custom focus styles replace browser defaults, the replacement must meet 3:1 contrast ratio against adjacent colors. GSP's amber (#E5A00D) on void (#050505) exceeds this.

---

## Sonner (Toast Notifications)

**Source:** [sonner.emilkowal.ski](https://sonner.emilkowal.ski/)

**Usage in GSP:** Copy-to-clipboard feedback on InstallCommand component.

**shadcn integration:** Sonner is the recommended toast library for shadcn/ui. Add the `<Toaster />` component to root layout. Style with shadcn CSS variables automatically.

**Package:**
```bash
npm install sonner
```

---

## Related

- [Scope](../brief/scope.md)
- [Install Manifest](../brief/install-manifest.md)
- [Technical Research](./technical-research.md)
