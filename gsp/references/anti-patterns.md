# AI Design Anti-Patterns

Convergence patterns that make AI-generated UI look AI-generated. Each entry: what it looks like, why it fails, what to do instead.

---

## Typography

**Inter/Roboto as default** — instantly signals "AI made this." Use Geist, Outfit, Cabinet Grotesk, Satoshi, or a brand-specific typeface.

**Hierarchy only through size** — creates monotone pages. Combine weight, color, spacing, and opacity to build clear typographic layers.

**Missing letter-spacing** — large type looks loose, small caps look cramped. Apply negative tracking on display sizes, positive on small text and all-caps.

**Proportional numbers in data tables** — columns won't align. Use `font-variant-numeric: tabular-nums` or a monospace face for numeric data.

**Orphaned words on last lines** — single words dangling below headings look unfinished. Use `text-wrap: balance` for headings, `text-wrap: pretty` for body.

**All-caps overuse** — screaming text flattens hierarchy. Reserve caps for overlines, labels, and navigation items only.

**Serif fonts in software UI** — serif faces fight functional interfaces. Sans-serif only for dashboards, tools, and product UI.

**Same weight everywhere** — 400 regular on every element is invisible hierarchy. Introduce medium (500) and semibold (600) to create contrast.

---

## Color

**Pure #000000** — harsh and unnatural on screens. Use off-black: `zinc-950`, `slate-900`, or a hue-tinted dark.

**Oversaturated accents above 80% chroma** — vibrate against neutrals and fail accessibility. Desaturate until the accent blends with the surrounding palette.

**AI purple/blue gradient aesthetic** — the single most recognizable AI fingerprint. Use neutral bases with one singular, considered accent color.

**Multiple accent colors** — fragments attention and looks undesigned. One accent, period. Use shade variations of that accent for states.

**Mixing warm and cool grays** — creates visual tension. Pick one temperature for your neutral scale and commit.

**Inconsistent shadow direction** — suggests multiple light sources, breaks spatial logic. Establish a single top-left or top-center light source.

**Random dark sections in a light page** — jarring breaks in visual continuity. Commit to one mode or use subtle shade shifts (e.g., `gray-50` to `gray-100`).

---

## Layout

**Centered-everything bias** — the laziest composition. Use split screen, left-aligned sections, asymmetric white-space when variance serves the brand.

**Generic 3-column equal card rows** — screams template. Use 2-column zig-zag, asymmetric grid, horizontal scroll, or masonry instead.

**`h-screen` for full-height sections** — breaks on mobile when the address bar hides/shows. Use `min-h-[100dvh]` with dynamic viewport units.

**No max-width container** — text lines stretch to 200+ characters on wide screens. Add `max-w-7xl mx-auto` or equivalent.

**Cards for everything** — elevation without purpose is noise. Use `border-t`, `divide-y`, or negative space for grouping. Cards only when elevation communicates hierarchy.

**Equal top/bottom padding** — bottom padding looks visually shorter due to optical illusion. Make bottom ~10-20% larger for balance.

**Complex flexbox percentage math** — fragile and hard to maintain. Use CSS Grid for reliable multi-column layouts.

**Buttons not bottom-aligned in card groups** — CTAs at different vertical positions look broken. Pin actions to the card bottom so they form a clean horizontal line.

**Inconsistent vertical rhythm** — side-by-side elements with misaligned baselines, titles, or images. Align shared elements across columns.

---

## Surfaces & Depth

**Generic `box-shadow` with untinted black** — looks pasted on. Tint shadows to match or complement the background hue.

**Flat design with zero texture** — sterile and lifeless. Add subtle noise, grain, or micro-patterns for tactile quality.

**Generic card borders everywhere** — monotonous elevation. Vary treatment: some borderless, some elevated, some with subtle background shifts.

**Inconsistent elevation** — random shadow sizes break spatial logic. Establish a z-layer system: flat, subtle, elevated, floating, overlay.

**Perfectly even gradients** — look synthetic. Break with radial gradients, noise overlays, or mesh gradients for organic depth.

---

## Content

**Lorem Ipsum placeholder text** — signals incomplete thinking. Write real draft copy, always. Even rough copy is better than Latin.

**Generic names: "John Doe", "Jane Smith"** — lazy and culturally flat. Invent creative, diverse, realistic names that feel like real people.

**Fake round numbers: 99.99%, $100.00, 50%** — obviously fake data. Use organic numbers: 47.2%, $99.00, 73%.

**AI copywriting cliches: "Elevate", "Seamless", "Unleash", "Next-Gen", "Delve"** — immediately identifiable as AI slop. Use concrete, specific verbs that describe what actually happens.

**"Oops!" error messages** — infantilizing and unhelpful. Be direct: "Connection failed. Try again."

**Exclamation marks in success messages** — "Saved!" feels insecure. Be confident and quiet: "Changes saved."

**Startup name slop: "Acme", "Nexus", "SmartFlow"** — generic placeholder branding. Invent contextual brand names with personality.

**Broken Unsplash URLs** — AI hallucinates image URLs that 404. Use `picsum.photos/seed/{name}/800/600` or SVG placeholders.

**Same avatar for multiple users** — destroys the illusion of real data. Unique asset per person.

**Title Case On Every Header** — looks like a newspaper from 2003. Use sentence case for modern UI.

---

## Motion

**Linear easing on everything** — mechanical and robotic. Use `cubic-bezier(0.16, 1, 0.3, 1)` or spring physics: `type: "spring", stiffness: 100, damping: 20`.

**Animating `top`/`left`/`width`/`height`** — triggers layout reflow, causes jank. Use `transform` and `opacity` only (GPU-accelerated).

**Instant transitions with zero duration** — feels broken. 200-300ms minimum for interactive element state changes.

**No `prefers-reduced-motion` respect** — accessibility violation. Always wrap animations in `@media (prefers-reduced-motion: no-preference)`.

**`window.addEventListener('scroll')` for scroll effects** — fires on every frame, kills performance. Use `IntersectionObserver` or CSS scroll-driven animations.

**Everything mounts simultaneously** — wall of content appearing at once has zero visual hierarchy. Stagger with `animation-delay` cascade or `staggerChildren`.

**Custom mouse cursors** — outdated gimmick that hurts performance and accessibility. Use native cursors.

---

## Components

**Default shadcn/ui without customization** — recognizable on sight. Customize radii, colors, shadows, and spacing to match the brand.

**Pill-shaped badges for everything** — visual clutter. Try square badges, flags, or plain styled text labels.

**3-card testimonial carousel with dots** — the most generic social proof pattern. Use masonry wall, embedded posts, or a single rotating quote.

**Modal for every interaction** — breaks flow and adds clicks. Use inline editing, slide-over panels, or expandable sections.

**Sun/moon dark mode toggle** — overdone and takes up prime real estate. Use dropdown, system preference detection, or integrate into settings.

**Generic circular spinner for loading** — tells user nothing about what's coming. Use skeleton loaders matching the actual layout shape.

**Accordion FAQ section** — feels like a support page from 2015. Use side-by-side list, searchable help, or inline progressive disclosure.

**4-column footer link farm** — nobody reads these. Simplify to main paths and legal links.

**Generic SVG user avatars** — the gray circle person. Use creative photo placeholders or styled initial letters.

---

## Code Quality

**Div soup** — inaccessible and unreadable. Use semantic HTML: `nav`, `main`, `article`, `aside`, `section`.

**Inline styles mixed with utility classes** — inconsistent styling strategy. Pick one approach per project.

**Hardcoded pixel widths** — breaks on every screen size. Use relative units: `%`, `rem`, `max-width`.

**Arbitrary `z-index: 9999`** — z-index arms race. Establish a clean z-index scale in the theme config.

**Missing alt text on meaningful images** — accessibility failure. Describe content for screen readers; use `alt=""` only for decorative images.

**Missing meta tags** — invisible to search and social. Include `title`, `description`, `og:image` at minimum.

**Commented-out dead code** — debug artifacts that signal carelessness. Remove all dead code before delivery.

**Import hallucinations** — AI invents packages that don't exist. Verify every import resolves to a real dependency in `package.json`.

**Emoji in UI code and markup** — unprofessional in product interfaces. Use quality icon sets: Phosphor, Heroicons, Lucide, or Radix Icons.

---

## How to Use

This reference is loaded by designer, builder, and critic agents. When generating or evaluating design:

1. **Designer** — avoid these patterns when creating screen specs
2. **Builder** — check implemented code against this list before marking a screen complete
3. **Critic** — flag any anti-patterns found as issues in `prioritized-fixes.md`
