# Scope

> Phase: brief | Project: gsp-app | Generated: 2026-03-19

---

## Screen List

### 1. Landing Page (P0)

- **User goal:** Understand what GSP is, see proof it works, install it
- **Flow position:** Entry point -- organic search, social links, README links
- **Key sections:**
  - **Hero** -- Display 1 headline (Instrument Sans), one-line value prop, primary CTA (`npm install`), secondary CTA (GitHub). Expression palette atmospheric gradient behind hero area (lavender/rose at 10-12% opacity on void)
  - **What is GSP** -- Two-column or stacked explanation: left side prose, right side terminal mockup showing GSP output. Overline labels, body text, muted metadata
  - **Pipeline Visualization** -- Web adaptation of the brand's pipeline-flow component. Dual diamond: Branding (discover > strategy > identity > system) + Project (brief > research > design > critique > build > review). Interactive or animated phase nodes with diamond states
  - **Features** -- Three-column card grid (4+4+4 on desktop, stacked on mobile). Each card: icon/glyph, h3 title, body-sm description. Border-only cards, surface background
  - **Social Proof / Meta Signal** -- "This site was designed by GSP" callout. Could show the actual brand tokens being used, or a before/after
  - **CTA Footer** -- Repeated install command, GitHub link, npm badge

### 2. Changelog / Blog (P0)

- **User goal:** See what shipped, read about updates, understand momentum
- **Flow position:** Linked from nav, README, release announcements
- **Key sections:**
  - **List view** -- Reverse-chronological list of posts. Each entry: date (overline), title (h2), excerpt (body-sm), tags (badge/pill). Centered content column (6-8 cols)
  - **Post view** -- Single post with markdown-rendered content. Title (h1), date + tags metadata, prose body, code blocks (terminal-style, no radius). Centered reading column (6-8 cols)

### 3. Shared Layout (P0)

- **Navigation** -- Monospace nav links (body-sm, muted, hover accent). Logo/brand mark left, links right. Mobile: hamburger or minimal menu. Sticky on scroll
- **Footer** -- Minimal: npm link, GitHub link, "Designed by GSP" mark. Muted text, border-top divider
- **Theme provider** -- Dark mode primary. CSS custom properties from brand system. Font loading (JetBrains Mono + Instrument Sans via Google Fonts or next/font)
- **Responsive behavior** -- Mobile-first. 4-col mobile, 8-col tablet, 12-col desktop. Max width 1200px

---

## Component Scope

### From shadcn/ui (install and adapt)

| Component | Usage | Adaptation needed |
|-----------|-------|-------------------|
| Button | Hero CTA, footer CTA, post navigation | Amber accent, 2px radius, monospace text |
| Card | Feature cards, blog post cards | Border-only (no shadow), surface bg, 4px radius |
| Badge | Tags on blog posts, version labels | Pill shape (radius-full), muted colors |
| Navigation Menu | Desktop nav | Monospace, sharp, muted-to-accent hover |
| Sheet | Mobile nav drawer | Surface-elevated bg, border |
| Separator | Section dividers, footer border | Border color, 1px |
| Scroll Area | Code block overflow | Minimal, muted scrollbar |

### Custom Components (project-specific)

| Component | Description | Brand reference |
|-----------|-------------|-----------------|
| PipelineViz | Web adaptation of pipeline-flow. Horizontal connected nodes with diamond states, animated transitions | `system/components/pipeline-flow.md` |
| TerminalMock | Fake terminal window showing GSP output. Monospace, void bg, no-radius, subtle border | Derived from code-block pattern in token-mapping |
| InstallCommand | Copyable `npm install` block with click-to-copy | Code block pattern + button |
| PostLayout | MDX-rendered blog post with styled prose | Typography foundations |
| AtmosphericBg | Expression palette gradient overlay for hero | `system/components/web/token-mapping.md` expression section |

---

## Project Boundaries

### In scope

- Landing page (all sections listed above)
- Changelog/blog (list + post views)
- Shared layout (nav, footer, theme, responsive)
- CSS custom properties from brand system
- Tailwind v4 configuration with brand tokens
- shadcn/ui component installation and theming
- Markdown/MDX content pipeline for blog posts
- Font loading and optimization
- WCAG 2.2 AA compliance
- Meta tags and Open Graph for social sharing

### Out of scope

- Authentication / user accounts
- Search functionality
- Comments or interactive features on posts
- Analytics integration (add later)
- Documentation pages (separate future project)
- Light mode toggle (dark is primary; light mode CSS exists in brand but is not P0)
- CMS or admin interface (content is markdown in repo)
- Internationalization
- E-commerce or payment

---

## Issue Framing

This project maps to one PR with three bounded issues:

### Issue 1: Foundation (blocking)

Next.js App Router scaffold, Tailwind v4 config, CSS custom properties, font loading, shadcn/ui init, shared layout (nav + footer + theme). No content yet -- just the shell that renders dark void with correct tokens.

**Acceptance:** `app/` directory exists, `next dev` serves a page with correct fonts, colors, and responsive grid.

### Issue 2: Landing Page

Hero, what-is-GSP section, pipeline visualization, features grid, meta signal, CTA footer. All custom components built here.

**Acceptance:** Landing page renders all sections with correct brand tokens. Pipeline visualization shows both diamonds. Responsive down to mobile.

### Issue 3: Changelog / Blog

MDX content pipeline, list view, post view, tags/badges. First post: "Designed by GSP" launch post.

**Acceptance:** `/changelog` lists posts. Individual post renders styled markdown with code blocks. Tags filter or display correctly.

---

## Success Criteria

1. **Visual fidelity:** Every token on the rendered site traces to the v2 brand system. No arbitrary colors, spacing, or font choices
2. **The meta test:** A visitor can inspect the CSS and see the same tokens defined in the brand system files
3. **Performance:** Lighthouse performance score 90+. Core Web Vitals pass. Fonts do not cause layout shift
4. **Accessibility:** WCAG 2.2 AA -- all text meets contrast ratios documented in color-system.md. Keyboard navigable. Screen reader tested
5. **Responsive:** Usable at 320px through 1536px+. No horizontal scroll. Touch targets 44px minimum on mobile
6. **Content:** At least one changelog post ships with the site

---

## Dependencies

- **Content:** Markdown files in `app/` or `content/` directory. No external CMS
- **Fonts:** Google Fonts (JetBrains Mono, Instrument Sans) or bundled via `next/font/google`
- **Images:** Minimal -- brand is typographic. Open Graph image needed for social sharing
- **Data:** No API. Blog posts are static MDX. No database
- **Deployment:** Vercel (assumed, given Next.js). Not in scope for this PR but should be deployment-ready

---

## Related

- [BRIEF.md](../BRIEF.md)
- [Brand System: Token Mapping](../../../branding/get-shit-pretty-v2/system/components/web/token-mapping.md)
- [Brand System: Pipeline Flow](../../../branding/get-shit-pretty-v2/system/components/pipeline-flow.md)
- [Brand Strategy: Messaging](../../../branding/get-shit-pretty-v2/strategy/messaging.md)
