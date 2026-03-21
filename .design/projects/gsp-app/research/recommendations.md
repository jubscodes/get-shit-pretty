# Recommendations

> Phase: research | Project: gsp-app | Generated: 2026-03-19

---

## Adopt

These patterns should be used directly, as-is.

### 1. @next/mdx with exported metadata objects

Use @next/mdx for the blog/changelog content pipeline with `export const metadata` instead of YAML frontmatter. This is the official, actively maintained approach that compiles to static React components at build time. No runtime MDX parsing, zero client JS for content.

References: [Technical Research > MDX Strategy](./technical-research.md), [Reference Specs > MDX Ecosystem](./reference-specs.md)

### 2. Tailwind v4 @theme for all brand tokens

Define all GSP design tokens in `@theme` blocks. This generates both CSS variables and utility classes from a single source. Use `@theme inline` to bridge GSP tokens to shadcn/ui's expected variable names.

References: [Technical Research > Tailwind v4](./technical-research.md), [Reference Specs > @theme Directive](./reference-specs.md)

### 3. CSS-only animation for PipelineViz

Use CSS `@keyframes` with staggered `animation-delay` for the pipeline visualization. Framer Motion adds ~50kb for capabilities this component doesn't need. Define animations inside Tailwind's `@theme` block for co-location with design tokens. Respect `prefers-reduced-motion`.

References: [Technical Research > Animation Strategy](./technical-research.md)

### 4. Shiki via @shikijs/rehype for syntax highlighting

Server-rendered, zero JS, integrates directly into the MDX pipeline as a rehype plugin. Use a custom monochrome theme with amber keyword accents matching the brand.

References: [Technical Research > Code Syntax Highlighting](./technical-research.md), [Reference Specs > Shiki](./reference-specs.md)

### 5. next/font self-hosting for JetBrains Mono + Instrument Sans

Eliminates Google Fonts runtime requests. CSS variable approach (`--font-primary`, `--font-display`) integrates with Tailwind v4's `--font-*` namespace. `display: swap` prevents layout shift.

References: [Technical Research > Font Loading](./technical-research.md)

### 6. Centered hero with dual CTA and terminal visual

The dominant pattern across 100+ dev tool sites. Bold headline, one-line description, primary CTA (install command), secondary CTA (GitHub), TerminalMock below. Don't reinvent this layout.

References: [UX Patterns > Hero Section](./ux-patterns.md), [Competitor UX > Evil Martians Study](./competitor-ux.md)

### 7. Amber focus ring with 2px offset on dark backgrounds

Meets WCAG 2.4.11 Focus Appearance. Amber (#E5A00D) on void (#050505) provides contrast well above the 3:1 minimum. White focus ring for elements on amber backgrounds.

References: [Accessibility Patterns > Focus Indicators](./accessibility-patterns.md)

---

## Adapt

These patterns should be modified for GSP's specific needs.

### 1. Expression palette as atmospheric gradients (not section accents)

Tailwind CSS uses distinct accent colors per section (sky, pink, fuchsia). GSP should NOT do this -- the expression palette (lavender, rose) is reserved for atmospheric backgrounds only, per the brand system rules. Use them as low-opacity radial gradients in the hero, not as section markers.

**Adaptation:** Instead of colored section headers, use subtle expression gradients at 10-12% opacity behind the hero, and amber as the sole accent color for interactive elements.

References: [Competitor UX > Tailwind CSS](./competitor-ux.md), [Target Adaptations > Expression Palette Usage](../brief/target-adaptations.md)

### 2. shadcn/ui Card component -- remove all shadows

shadcn cards ship with shadow utilities. GSP's brand uses no shadows -- depth through color steps only. Override globally by removing `shadow-*` classes and relying on `border` + `bg-surface` for card definition.

References: [Competitor UX > Linear (opacity-based depth)](./competitor-ux.md), [Target Adaptations > Component Adaptations](../brief/target-adaptations.md)

### 3. Blog list as simple stacked entries (not a card grid)

Most SaaS changelogs use card grids. For GSP's scope (few posts, text-heavy), a simple stacked list with date overline, h2 title, excerpt, and tags is cleaner and matches the monospace-forward aesthetic. Cards add visual weight without adding value for a changelog.

References: [UX Patterns > Changelog Patterns](./ux-patterns.md)

### 4. Mobile nav -- horizontal links, not hamburger

GSP has only 2-3 nav items (Home, Changelog, GitHub). A hamburger menu is overkill. Keep horizontal links on mobile, reducing font size if needed. Only add Sheet/hamburger if the nav grows beyond 4 items.

References: [UX Patterns > Navigation Patterns](./ux-patterns.md)

---

## Avoid

Anti-patterns and common mistakes to steer clear of.

### 1. Do NOT use next-mdx-remote

It's poorly maintained, has unstable RSC support, and is overkill for local file content. @next/mdx handles everything GSP needs.

References: [Technical Research > MDX Strategy](./technical-research.md)

### 2. Do NOT add Framer Motion for launch

The pipeline visualization and page transitions do not require a physics engine. CSS animations with `animation-delay` achieve the needed effects. Framer Motion can be added later if scroll-triggered animations become necessary.

References: [Technical Research > Animation Strategy](./technical-research.md)

### 3. Do NOT use generic CTA copy

"Get started" and "Try it now" are generic. The install command (`npx get-shit-pretty` or `npm install -g get-shit-pretty`) IS the CTA. Developers trust specificity.

References: [Content Strategy > CTA Conventions](./content-strategy.md), [UX Patterns > Install-CTA Patterns](./ux-patterns.md)

### 4. Do NOT lead with "AI-powered"

GSP uses AI but leading with it positions the tool in the crowded AI tools space rather than the design engineering space. Let the quality of the output speak.

References: [Content Strategy > Words to Avoid](./content-strategy.md)

### 5. Do NOT combine expression colors with amber in the same visual context

The brand system explicitly separates these domains: expression (atmospheric background) and amber (foreground interaction). They occupy separate z-layers. Never use lavender or rose for buttons, badges, or interactive elements.

References: [Target Adaptations > Expression Palette](../brief/target-adaptations.md)

### 6. Do NOT over-explain the meta narrative

"This site was designed by GSP" should be a whisper, not a shout. A small callout near the footer, not a hero-level message. Let the site's quality be the primary proof. Over-explaining ("We ate our own dogfood!") undermines the sophistication the brand projects.

References: [Content Strategy > The Meta Narrative](./content-strategy.md)

---

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| MDX library | @next/mdx | Official, static, zero client JS |
| Animation library | CSS-only (no Framer Motion) | 50kb savings, sufficient for scope |
| Font loading | next/font/google | Self-hosted, no FOIT, CSS variable integration |
| Syntax highlighting | Shiki via @shikijs/rehype | Server-rendered, zero JS, custom themes |
| OG images | ImageResponse (next/og) | Built-in, no dependencies, dynamic per post |
| CSS framework | Tailwind v4 @theme | CSS-first, token-to-utility mapping |
| Component library | shadcn/ui with GSP token override | OKLCH support, data-slot styling |
| Toast library | Sonner | shadcn-compatible, copy feedback |
| Mobile nav | Horizontal links (no hamburger) | Only 2-3 items |

---

## Related

- [Scope](../brief/scope.md)
- [UX Patterns](./ux-patterns.md)
- [Competitor UX](./competitor-ux.md)
- [Technical Research](./technical-research.md)
- [Accessibility Patterns](./accessibility-patterns.md)
- [Content Strategy](./content-strategy.md)
- [Reference Specs](./reference-specs.md)
