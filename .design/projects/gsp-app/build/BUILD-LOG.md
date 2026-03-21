---
name: BUILD-LOG
type: build-log
project: gsp-app
phase: foundations
created: 2026-03-20
---

# Build Log -- Foundations

## Implementation Summary

Integrated GSP brand design tokens into the scaffolded Next.js 16 + Tailwind v4 + shadcn/ui 4.1 codebase. The foundations phase covers: token integration, font setup, dark-first theming, global base styles, and the root layout shell (sticky nav + footer).

GSP is a **dark-first** brand. The default theme (no class on `<html>`) renders the dark palette. Light mode is activated by adding `class="light"` to `<html>`. The `@custom-variant` directive was inverted from shadcn's default to match this convention.

## Files Created

| File | Purpose |
|------|---------|
| `src/components/site-header.tsx` | Sticky nav shell -- logo, navigation links, GitHub link. Blur backdrop, border-b. |
| `src/components/site-footer.tsx` | Footer shell -- brand name, footer nav links. |

## Files Modified

| File | Changes |
|------|---------|
| `src/app/globals.css` | Complete rewrite. Replaced shadcn default neutral theme with GSP brand tokens. Added: foundation colors, text colors, accent (amber), semantic colors, expression palette, typography tokens, spacing, radius, motion, shadcn variable overrides, focus ring, selection styles, scrollbar styling, reduced-motion support, typography utility classes. |
| `src/app/layout.tsx` | Replaced Geist font with JetBrains Mono (primary/mono) and Instrument Sans (display) via `next/font/google`. Added SiteHeader and SiteFooter shell components. Set up flex column layout with sticky header. |

## Component Map

| Design Component | Codebase File | Status |
|-----------------|---------------|--------|
| Nav container | `src/components/site-header.tsx` | Shell complete |
| Footer | `src/components/site-footer.tsx` | Shell complete |
| Design tokens | `src/app/globals.css` :root block | Complete |
| Light mode tokens | `src/app/globals.css` .light block | Complete |
| Typography utilities | `src/app/globals.css` @layer utilities | Complete |
| shadcn overrides | `src/app/globals.css` shadcn variable block | Complete |

## Patterns Applied

- **Dark-first theming**: Default is dark. `@custom-variant dark` uses `&:not(.light *)` instead of shadcn's default `&:is(.dark *)`.
- **Token indirection**: GSP tokens (`--gsp-*`) are the source of truth. shadcn variables (`--background`, `--foreground`, etc.) reference GSP tokens via `var()`. This means shadcn components work out of the box with GSP colors.
- **Font strategy**: JetBrains Mono for all body/UI text (including code -- it is a monospace-first brand). Instrument Sans only for display headings (40px+). Both loaded via `next/font/google` with `display: swap`.
- **Motion tokens**: All transitions use `--gsp-motion-normal` (150ms) with `--gsp-motion-easing` (linear). `prefers-reduced-motion` respected globally.
- **Spacing**: GSP spacing scale available as `gap-gsp-4`, `px-gsp-6`, etc. via `--spacing-gsp-*` in `@theme inline`.
- **No shadows**: Per brand spec, no box-shadows on any components.
- **Accessibility**: Focus rings (2px accent, 2px offset), reduced-motion media query, semantic HTML landmarks, ARIA labels on nav elements.

## Dependencies Added

None -- all fonts loaded via `next/font/google` (already available in Next.js).

## Known Gaps

- **Theme toggle**: No JS-based theme switcher implemented. The `.light` class must be toggled manually or by a future component.
- **Mobile nav**: Header hides nav links below `sm` breakpoint. Hamburger/sheet menu not implemented (would use the installed `sheet.tsx` shadcn component).
- **Page content**: Root `page.tsx` is an empty placeholder per spec (foundations only).

## Screen Status

| # | Screen | Status | Notes |
|---|--------|--------|-------|
| -- | Root layout | complete | Nav shell, footer shell, fonts, tokens |
| 01 | Landing (Home) | complete | All 8 sections implemented |
| -- | Docs | pending | Not in scope for foundations |

---

# Build Log -- Screen 01: Landing

## Implementation Summary

Full landing page with 8 sections: nav (updated), hero with atmospheric background, "what is GSP" explainer, pipeline visualization, features grid, meta signal, CTA footer, and footer (updated). All sections are constrained to max-w-[1200px] centered, with 96px/64px vertical rhythm (desktop/mobile).

## Files Created

| File | Purpose |
|------|---------|
| `src/components/atmospheric-bg.tsx` | Sparse sparkle character field (`., ., ., ·, ·, ✧, ◇, ◈`) using expression palette colors at 10-18% opacity. Seeded RNG for SSR consistency. Density increases toward center. |
| `src/components/install-command.tsx` | Click-to-copy install command (`npm install -g get-shit-pretty`). Uses sonner toast for "Copied!" feedback. |
| `src/components/terminal-mock.tsx` | Terminal window chrome (3 dots, title bar) with slot for content. `rounded-none` per spec. |
| `src/components/pipeline-viz.tsx` | Dual diamond pipeline visualization. Horizontal rows on desktop, vertical on mobile. `◆`/`◈`/`◇` glyphs with connectors. Full aria-label. |
| `src/components/feature-card.tsx` | Feature card with diamond icon, title, description. Hover state on border. |
| `src/components/ui/sonner.tsx` | Simplified sonner Toaster (dark-first, no next-themes dependency). Installed via `npx shadcn@latest add sonner`. |

## Files Modified

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Complete rewrite. 8 sections: hero, what-is-gsp, pipeline, features grid, meta signal, CTA footer. Server component with client sub-components. |
| `src/components/site-header.tsx` | Updated to match design: `/gsp: ◇◇` brand mark, Changelog + GitHub links, skip-to-content link, max-w-[1200px] inner container. |
| `src/components/site-footer.tsx` | Updated to match design: `/gsp: ◇◇` brand mark, npm/GitHub/MIT links separated by middle dots, py-gsp-8. |

## Component Map

| Design Component | Codebase File | Status |
|-----------------|---------------|--------|
| Navigation | `src/components/site-header.tsx` | Complete |
| Skip-to-content | `src/components/site-header.tsx` | Complete |
| AtmosphericBg | `src/components/atmospheric-bg.tsx` | Complete |
| InstallCommand | `src/components/install-command.tsx` | Complete |
| TerminalMock | `src/components/terminal-mock.tsx` | Complete |
| PipelineViz | `src/components/pipeline-viz.tsx` | Complete |
| FeatureCard | `src/components/feature-card.tsx` | Complete |
| Footer | `src/components/site-footer.tsx` | Complete |

## Patterns Applied

- **Server-first rendering**: page.tsx is a Server Component. Client components (InstallCommand, AtmosphericBg, Separator) are marked `"use client"` individually.
- **Token-only styling**: All spacing uses `gap-gsp-*`/`py-gsp-*`, all colors reference GSP tokens via Tailwind utilities or CSS variables. No magic numbers.
- **Accessibility**: Skip-to-content link, `role="img"` with `aria-label` on pipeline and terminal mocks, `aria-hidden` on decorative glyphs, keyboard-accessible copy button with focus-visible ring.
- **Critique fixes applied**: (1) AtmosphericBg opacity floor 10% minimum, max 18%. (2) Pipeline row labels use `text-overline text-foreground font-bold` (elevated from muted). (3) Features grid has overline + H2 heading above grid.
- **Responsive**: Mobile-first. Hero CTAs stack on mobile, inline on desktop. Pipeline switches to vertical. Features grid goes 1-col to 2-col to 3-col. All sections use py-gsp-16 mobile / py-gsp-24 desktop.

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| sonner | ^2.0.7 | Already in package.json, shadcn component added |

## Known Gaps

- **Theme toggle**: No light/dark switcher (dark-first, no toggle planned for landing).
- **AtmosphericBg animation**: Static field only -- no drift/twinkle animation (matches spec: static sparkle layer).

---

# Build Log -- Screen 02: Changelog List

## Implementation Summary

Changelog list page at `/changelog` showing all posts in reverse-chronological order. File-based MDX content architecture with `gray-matter` for frontmatter parsing. Three sample entries based on real CHANGELOG.md content (v0.5.0, v0.4.0, v0.3.0). Centered content column, separated entries, tags as secondary badges, accessible feed markup.

## Files Created

| File | Purpose |
|------|---------|
| `src/app/changelog/page.tsx` | Changelog list page. Server component. Reads entries via `getChangelogEntries()`, renders as `role="feed"` with `<article>` elements, separators between entries, empty state fallback. |
| `src/lib/content.ts` | Content utility. Reads MDX frontmatter from `src/content/changelog/` using `gray-matter` and `fs.readFileSync`. Returns sorted entries (newest first). |
| `src/content/changelog/v0-5-0.mdx` | Sample entry: v0.5.0 -- plugin architecture, multi-runtime, composable skills |
| `src/content/changelog/v0-4-0.mdx` | Sample entry: v0.4.0 -- dual-diamond architecture |
| `src/content/changelog/v0-3-0.mdx` | Sample entry: v0.3.0 -- chunked exports, codebase-aware pipeline |

## Files Modified

None -- all new files.

## Component Map

| Design Component | Codebase File | Status |
|-----------------|---------------|--------|
| Page header (H1) | `src/app/changelog/page.tsx` | Complete |
| Post entry (article) | `src/app/changelog/page.tsx` | Complete |
| Date overline | `src/app/changelog/page.tsx` (time element) | Complete |
| Title link | `src/app/changelog/page.tsx` (h2 > a) | Complete |
| Excerpt | `src/app/changelog/page.tsx` (p) | Complete |
| Tags row | `src/app/changelog/page.tsx` (Badge) | Complete |
| Empty state | `src/app/changelog/page.tsx` (EmptyState) | Complete |
| Content reader | `src/lib/content.ts` | Complete |

## Patterns Applied

- **Server component**: Page reads filesystem at build/request time, no client JS needed.
- **Token-only styling**: All spacing uses `px-gsp-*`/`pt-gsp-*`/`my-gsp-*`, colors via `text-foreground`/`text-muted-foreground`/`text-primary`. No magic numbers.
- **Transition tokens**: Hover color transitions use `--gsp-motion-normal` duration and `--gsp-motion-easing` timing via inline style.
- **Accessible feed**: `role="feed"` on list, `aria-posinset`/`aria-setsize` on articles, `<time datetime>` on dates, `aria-hidden` on separators, `role="list"` on tag rows.
- **Content architecture**: Simple file-based approach with `gray-matter` for frontmatter. MDX body is not rendered on list page (that's for screen 03). Entries sorted by date descending.
- **Empty state**: Diamond glyph + message + outline button linking to GitHub.

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| gray-matter | ^4.0.3 | Frontmatter parsing for MDX content files |

## Known Gaps

- **Changelog post page**: `/changelog/[slug]` route not yet implemented (screen 03).
- **Pagination**: No pagination -- all entries rendered on a single page. Fine for current volume.
- **RSS feed**: No RSS/Atom feed for changelog entries.

## Screen Status

| # | Screen | Status | Notes |
|---|--------|--------|-------|
| -- | Root layout | complete | Nav shell, footer shell, fonts, tokens |
| 01 | Landing (Home) | complete | All 8 sections implemented |
| 02 | Changelog list | complete | All states, 3 sample entries, empty state |
| 03 | Changelog post | complete | Dynamic route, MDX rendering, 404 state |

---

# Build Log -- Screen 03: Changelog Post

## Implementation Summary

Individual changelog post page at `/changelog/[slug]`. Server-side MDX compilation using `@mdx-js/mdx` `compile` + `run` functions. Custom components map for prose styling. Static generation via `generateStaticParams()`. Breadcrumb navigation, tag badges, semantic article markup. 404 page with diamond glyph.

## Files Created

| File | Purpose |
|------|---------|
| `src/app/changelog/[slug]/page.tsx` | Dynamic post page. Async server component. Compiles MDX body via `@mdx-js/mdx`, renders with custom components map. `generateStaticParams` for SSG, `generateMetadata` for per-post meta. |
| `src/app/changelog/[slug]/not-found.tsx` | 404 state. Diamond glyph, "Post not found" heading, back link. |
| `src/components/mdx-components.tsx` | Custom MDX components map. Styles all prose elements (h2, h3, p, a, strong, ul, ol, li, blockquote, code, pre, hr) per design spec. |

## Files Modified

| File | Changes |
|------|---------|
| `src/lib/content.ts` | Added `ChangelogPost` interface (extends `ChangelogEntry` with `content` field), `getChangelogSlugs()` for static params, `getChangelogPost(slug)` for individual post retrieval with MDX body. |
| `package.json` | Added `@mdx-js/mdx` as explicit dependency (was transitive before). |

## Component Map

| Design Component | Codebase File | Status |
|-----------------|---------------|--------|
| Back link (breadcrumb) | `src/app/changelog/[slug]/page.tsx` | Complete |
| Date overline | `src/app/changelog/[slug]/page.tsx` (time element) | Complete |
| Post title (h1) | `src/app/changelog/[slug]/page.tsx` | Complete |
| Tags row | `src/app/changelog/[slug]/page.tsx` (Badge) | Complete |
| Prose body | `src/components/mdx-components.tsx` | Complete |
| Code blocks | `src/components/mdx-components.tsx` (pre/code) | Complete |
| Blockquote accent | `src/components/mdx-components.tsx` | Complete (mauve border) |
| 404 state | `src/app/changelog/[slug]/not-found.tsx` | Complete |

## Patterns Applied

- **Server-side MDX compilation**: Uses `@mdx-js/mdx` `compile` (to function-body format) then `run` with `react/jsx-runtime`. No client JS needed for MDX rendering.
- **Static generation**: `generateStaticParams` returns all slugs from content directory. All posts pre-rendered at build time.
- **Token-only styling**: All prose classes use GSP typography utilities (`text-h2`, `text-body`, `text-overline`), spacing tokens (`mt-gsp-8`, `mb-gsp-6`), and color tokens (`text-foreground`, `text-muted-foreground`).
- **Expression palette**: Blockquote left border uses `var(--gsp-mauve)` from the expression palette.
- **Accessibility**: `<article aria-labelledby="post-title">`, `<nav aria-label="Breadcrumb">`, `<time datetime>`, `tabindex="0"` and `aria-label` on scrollable code blocks, `aria-hidden` on separators.
- **Transition tokens**: Back links use `--gsp-motion-normal` and `--gsp-motion-easing` for hover transitions.

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| @mdx-js/mdx | ^3.1.1 | Server-side MDX compilation (compile + run) |

## Known Gaps

- **Syntax highlighting**: Code blocks render with terminal styling but no language-aware syntax highlighting. Shiki is installed but not integrated with MDX compilation.
- **Table of contents**: No auto-generated TOC from headings.
- **Previous/next navigation**: No inter-post navigation links.
