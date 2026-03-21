# UX Patterns

> Phase: research | Project: gsp-app | Generated: 2026-03-19

---

## Landing Page Patterns for Developer Tools

### Hero Section

The Evil Martians study of 100+ dev tool landing pages (2025) found that centered hero composition dominates. Bold headline, supporting description, dual CTAs, and a visual element (product screenshot, code snippet, or abstract illustration) placed below the text. This pattern "looks stable, feels trustworthy, and works well."

**For GSP specifically:** The hero visual should be a TerminalMock showing GSP output -- this follows the "static product UI" pattern that Linear uses, which is faster to implement than animated demos and immediately communicates what the tool does. The dual CTA pattern (primary: `npm install`, secondary: GitHub) is standard across dev tool sites.

**Hero headline sizing:** 2025-2026 trend is oversized type (4xl-6xl) with `text-balance` and `tracking-tighter`. Tailwind CSS uses `text-6xl` on desktop scaling to `text-4xl` on mobile. This aligns with GSP's Instrument Sans display type.

Source: [Evil Martians: 100 Dev Tool Landing Pages](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025)

### Eyebrow / Announcement Bar

Most successful dev tool pages use a small "eyebrow" text above the hero headline to announce recent releases, version numbers, or funding milestones. This is a lightweight signal of momentum. GSP could use "v0.5.0 -- Now with design system scanning" or similar.

Source: Evil Martians study

### Feature Presentation

Six effective layout patterns identified:

1. **Chess layout** -- Alternating image/text blocks (left/right). Simple, adds visual rhythm. Dust uses this well.
2. **Icon + text grid** -- Effective for SDKs with many features. PlayAI pattern. Matches GSP's planned 3-column feature grid.
3. **Bento blocks** -- Mixed-size card grid. Decent uses this. More visually dynamic but harder to maintain.
4. **Step-by-step** -- Numbered sequence showing workflow. Bun demonstrates essential commands. Could work for GSP's "how it works" section.
5. **Tabbed features** -- Group by persona or category. Useful when serving Dev and Des personas with different messages.
6. **Code snippets** -- Standard for libraries/SDKs. Tailwind CSS leads here. GSP should show terminal output, not code.

**Recommended for GSP:** Icon + text grid for features (matches scope), with a chess-layout "what is GSP" section (prose left, terminal right). The PipelineViz gets its own full-width section.

### Social Proof Approaches

The study found nearly all dev tool landing pages use curated testimonials -- manually selected, not auto-pulled. For GSP (pre-launch, no testimonials yet), the meta signal "This site was designed by GSP" functions as social proof through demonstration. Other early-stage alternatives:

- GitHub stars count (once available)
- "Built for" persona badges (developers, designers)
- The pipeline visualization itself as proof of process

### Install-CTA Patterns

Developer tools consistently use the install command as the primary CTA, not a generic "Get started" button. Examples:

- **Bun:** `curl -fsSL https://bun.sh/install | bash` prominently displayed
- **Tailwind:** "Get started" links to installation docs rather than showing the command
- **shadcn/ui:** "New Project" button for CLI init

**For GSP:** Show `npx get-shit-pretty` or `npm install -g get-shit-pretty` as the primary CTA with click-to-copy. The copyable command IS the conversion action for dev tools.

---

## Changelog / Blog Patterns

### List View

Reverse-chronological is universal. Key patterns from SaaS changelog analysis:

- **Date as overline** -- Small, muted, above the title. Not inline with title.
- **Version number as badge** -- Pill-shaped, muted color. Links to specific version.
- **Category tags** -- "Feature", "Fix", "Enhancement" as colored badges. GitHub's changelog standard.
- **Excerpt truncation** -- 1-2 lines of body text, no "read more" link (the whole card is clickable).
- **Progressive disclosure** -- Technical details hidden unless expanded. Not needed for GSP's scope.

**Best example:** Linear's changelog uses large date headers grouping multiple entries, with each entry having a title, brief description, and optional image. Clean, scannable.

Source: [SaaS Changelog UI Examples](https://www.saasframe.io/categories/changelog), [Usersnap Changelog Examples](https://usersnap.com/blog/changelog-examples/)

### Post View

Standard blog post layout patterns:

- **Centered reading column** -- 6-8 cols, max-width 720px for prose. GSP scope confirms this.
- **Metadata block** -- Date + tags above title, or date above title with tags below.
- **Code blocks** -- Terminal-style with copy button. No border-radius for terminal aesthetic.
- **Typography** -- Tailwind Typography plugin (`prose` class) is the standard for MDX content styling.

---

## Navigation Patterns

### Minimal Sites (2-3 pages)

For sites with few pages, the dominant pattern is:

- **Logo left, links right** -- Horizontal, single row. No dropdown menus needed.
- **Sticky on scroll** -- `position: sticky` with backdrop blur and border-bottom. Tailwind uses `bg-white/80 backdrop-blur-sm border-b`.
- **Mobile** -- For 2-3 links, a simple horizontal row works down to 375px. Hamburger only if 4+ links or long labels. GSP has Home + Changelog + GitHub -- could stay horizontal on mobile.
- **Search not needed** -- For minimal sites, skip search. Link to docs when they exist.

**GSP nav items:** Logo | Changelog | GitHub icon. Possibly a version badge. No hamburger needed for this scope.

### Footer

Evil Martians found effective final CTAs use "separate backgrounds, motivating copy, and single-goal buttons." For GSP:

- Repeated install command
- GitHub + npm links
- "Designed by GSP" mark
- Minimal -- not a sitemap footer

Source: [Modern Footer UX Patterns](https://www.eleken.co/blog-posts/footer-ux)

---

## Information Architecture

### Dev Tool Site Organization

The standard IA for developer tool sites:

```
Landing Page (marketing)
  |-- Docs (technical, separate project for GSP)
  |-- Blog / Changelog (trust signal)
  |-- GitHub (external)
```

For GSP's current scope (no docs), the IA is flat:

```
/ .............. Landing page
/changelog ...... Blog/changelog list
/changelog/[slug] Individual post
```

This matches the scope document. Keep it flat. Docs will be a separate future project.

### Landing Page Section Flow

Based on Evil Martians' analysis, the optimal flow for a dev tool like GSP:

1. **Hero** -- What is this? (headline + TerminalMock + CTA)
2. **What is GSP** -- How does it work? (prose + visual)
3. **Pipeline Viz** -- The process (interactive dual diamond)
4. **Features** -- What can it do? (card grid)
5. **Meta Signal** -- Proof it works (this site was designed by GSP)
6. **Final CTA** -- Ready to try? (install command + GitHub)

This maps directly to the scope's section list. The flow moves from "understand" to "believe" to "act."

---

## Onboarding: Landing Page as Funnel

The landing page IS the onboarding for a CLI tool. The visitor journey:

1. **Awareness** -- "What is this tool?" (hero headline)
2. **Understanding** -- "How does it work?" (pipeline viz, feature grid)
3. **Credibility** -- "Does it actually work?" (meta signal, the site itself)
4. **Action** -- "How do I get it?" (install command)

Every section should advance the visitor one step. No dead ends, no tangents. The copy should answer exactly one question per section.

Source: [Landing Page Structure That Converts](https://toimi.pro/blog/landing-page-design-structure-conversion/)

---

## Related

- [Scope](../brief/scope.md)
- [Competitor UX](./competitor-ux.md)
- [Content Strategy](./content-strategy.md)
