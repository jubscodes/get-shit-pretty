# Color Composition Strategies

**Use when:** Choosing a color approach for a brand system or project UI. The designer agent selects a strategy during identity/system phases. The critic agent checks adherence. The builder agent implements it.

---

## Strategies

### 60-30-10

Dominant (60%), secondary (30%), accent (10%) ratio. The most widely used composition rule. Creates visual hierarchy through proportional color weight.

- **60%** — background, large surfaces, dominant tone
- **30%** — content layer, secondary surfaces, text
- **10%** — CTAs, highlights, interactive states, emphasis

**When to use:** Professional products, marketing sites, dashboards. When you need clear hierarchy and a polished feel.

**Pitfall:** Under-using the 10% accent (common mistake — sites end up 70-28-2). The accent should feel present, not hidden.

**Examples:** Apple, most corporate sites, well-designed SaaS.

---

### Monochrome

Single hue at varying lightness and saturation levels. The entire palette is derived from one color. Creates cohesion and mood through tonal variation.

- **Base hue** — one color family (e.g., blue, gray, green)
- **Variation** — lightness and saturation shifts create hierarchy
- **Optional** — one contrasting accent for CTAs only

**When to use:** Tools, documentation, reading-heavy interfaces. When the content should dominate and the UI should disappear.

**Pitfall:** Can feel flat or lifeless without careful lightness differentiation. Needs strong typography to compensate.

**Examples:** Notion (warm gray), Linear (blue), Bear (red).

---

### Color Blocking

Large flat areas of solid color placed adjacent to each other. No gradients, no blending. Geometric, editorial, high-impact. Derived from De Stijl and Bauhaus.

- **Blocks** — full-width or large rectangular sections in solid colors
- **Contrast** — blocks are chosen for maximum contrast at boundaries
- **Content** — sits on top of blocks, adapts foreground color per block

**When to use:** Marketing sites, editorial, brand launches. When boldness and visual impact matter more than subtlety.

**Pitfall:** Can feel chaotic without clear grid structure. Needs strong typography and generous whitespace within blocks.

**Examples:** Mondrian, Stripe, Figma, early Apple marketing.

---

### Maximalist

Many colors, high saturation, dense application. Rejects minimalism. Energetic, playful, overwhelming by design. Color IS the content.

- **Palette** — 5+ saturated colors used simultaneously
- **Rules** — fewer constraints, more expression
- **Balance** — achieved through rhythm and repetition, not reduction

**When to use:** Events, festivals, creative tools, youth-oriented brands. When you want to signal energy, creativity, or rebellion against minimalism.

**Pitfall:** Accessibility is hard — contrast ratios need careful checking across many combinations. Can feel unprofessional if not executed with confidence.

**Examples:** Gumroad, Figma conference materials, festival posters.

---

### Duotone

Exactly two colors. Everything on the page is one color or the other. Extremely high contrast, graphic, immediately recognizable.

- **Color A** — typically the background/dominant
- **Color B** — text, icons, CTAs, all foreground elements
- **No middle ground** — no grays, no gradients, no third color

**When to use:** High-impact landing pages, album art, posters, brand moments. When you want stark, memorable, graphic impact.

**Pitfall:** Limited flexibility — hard to convey complex information hierarchy. Works better for impact than utility.

**Examples:** Spotify Wrapped, GitHub dark mode (near-duotone), classic punk zines.

---

### Neutral + Single Accent

Near-monochrome base (black/white/gray) with exactly one accent color. The accent carries all the semantic weight — action, status, emphasis. Everything else is neutral.

- **Neutral base** — grayscale or near-grayscale (can be warm or cool)
- **Single accent** — one hue for all interactive/emphasis elements
- **Discipline** — the accent appears ONLY where it means something

**When to use:** Developer tools, technical products, minimalist brands. When you want the interface to feel precise and intentional.

**Pitfall:** The accent can be under-used (feels like a monochrome site) or over-used (loses its signal value). The 10% target from 60-30-10 is a useful check.

**Examples:** Teenage Engineering (orange on white), Raycast, Things app.

---

### Gradient-Driven

Color transitions as the primary visual element. Gradients replace flat color as the dominant aesthetic. Atmospheric, modern, dimensional.

- **Linear/radial gradients** — as backgrounds, on elements, as brand marks
- **Mesh gradients** — multi-point color blending for organic feel
- **Motion** — gradients often animate subtly (shift, breathe, flow)

**When to use:** Consumer apps, creative tools, music/media. When you want warmth, atmosphere, and a sense of motion.

**Pitfall:** Gradients can feel dated if poorly executed (2010s web). Modern mesh gradients avoid this. Text legibility on gradient backgrounds requires careful contrast checking.

**Examples:** Instagram, Apple Music, mesh gradient trend (2022+).

---

### Inverted Sections

Alternating between light and dark (or color and neutral) full-width sections. Creates rhythm and visual pacing. Each section is a self-contained color context.

- **Alternation** — dark section → light section → dark section
- **Content adaptation** — text/element colors flip per section
- **Boundaries** — section edges create implicit dividers (no borders needed)

**When to use:** Long-form marketing pages, documentation, feature tours. When you need to visually separate content sections without explicit dividers.

**Pitfall:** Token system must support both modes cleanly. Each section needs its own foreground/background pair. Can feel disjointed if the palette isn't cohesive.

**Examples:** Stripe, Tailwind CSS docs, Vercel homepage.

---

### Terminal / ANSI

Limited palette mimicking terminal color constraints (8 or 16 colors from the ANSI standard). Raw, technical, deliberately constrained. The limitation IS the aesthetic.

- **Palette** — drawn from ANSI color codes (black, red, green, yellow, blue, magenta, cyan, white + bright variants)
- **Background** — typically black or near-black
- **Text-only** — color applied to text characters, not surfaces or fills
- **Glyphs** — Unicode block elements, box-drawing characters, shade blocks as visual texture

**When to use:** Developer tools, CLI products, hacker aesthetic. When you want to signal technical authenticity and terminal-native origins.

**Pitfall:** Can feel inaccessible to non-technical audiences. Needs careful contrast — ANSI colors weren't designed for readability. Works best when combined with modern type and spacing.

**Examples:** Vercel CLI, Warp terminal, Charm.sh, GSP terminal output.

---

## Choosing a Strategy

| Factor | Best strategies |
|--------|----------------|
| Professional/enterprise | 60-30-10, Monochrome, Neutral + accent |
| Developer tools | Neutral + accent, Terminal/ANSI, Monochrome |
| Marketing/launch | Color blocking, Inverted sections, Gradient-driven |
| Creative/expressive | Maximalist, Duotone, Color blocking |
| Content-heavy/reading | Monochrome, Neutral + accent, 60-30-10 |
| High impact/memorable | Duotone, Color blocking, Maximalist |

## Combining Strategies

Strategies can layer:
- **Neutral + accent** as the base system, with **60-30-10** to calibrate the accent ratio
- **Terminal/ANSI** for product UI, with **color blocking** for the marketing site
- **Monochrome** base with **inverted sections** for page rhythm
- **Gradient-driven** hero, with **neutral + accent** for the rest of the page

The brand system should declare which strategy (or combination) applies, and the critic should verify adherence.
