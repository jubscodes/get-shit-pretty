# Block Patterns Reference — Section Compositions

Common page section patterns with structural guidance. Blocks are composed patterns — not individual components.

Adapt layout, visual effects, and imagery to the brand's tokens and style prompt.

---

## Hero Sections

### Centered hero
Full-width container, centered text stack: overline → headline (4xl–6xl) → subhead → CTA group. Optional: background gradient, decorative orbs, or ambient effects behind text. Max-width on text (640–720px) for readability.

### Split hero (text + media)
Two-column (50/50 or 60/40). Text column: headline + body + CTAs. Media column: image, illustration, mockup, or video. On mobile: stack vertically, text first. Use the wider column for the primary content.

### Hero with background media
Full-bleed image or video. Dark gradient overlay (bottom → top, 70% → transparent) for text legibility. Text positioned bottom-left or centered. Ensure WCAG AA contrast with overlay.

### Typography-dominant hero
Oversized display text (6xl–8xl) as the visual centerpiece. Minimal or no imagery. Relies on type scale contrast, letter-spacing, and weight variation. Works best with distinctive brand typography.

---

## Feature Sections

### Bento grid
Asymmetric grid with mixed card sizes (1×1, 2×1, 1×2). 2-4 column grid with gap. Each cell: icon/image + heading + short text. Visually interesting through size variation, not decoration. On mobile: single column, uniform cards.

### Alternating image/text
Rows alternate: image left / text right, then text left / image right. Creates visual rhythm on scroll. Images should be consistent in style (all photos, all illustrations, all screenshots). On mobile: stack, image above text.

### Icon feature row
3-4 items in a row. Each: icon (40-48px) + heading + 1-2 lines of text. Icons should be from a single family (Lucide, Phosphor). Keep text short. On mobile: 2-column grid or single column.

---

## Social Proof

### Testimonial cards
2-3 cards in a row. Each: quote text + attribution (name, title, company) + avatar. Use quotation marks or pull-quote styling. Optionally add star ratings. On mobile: single column or horizontal scroll.

### Logo wall
Grid of client/partner logos. Grayscale by default, color on hover. 4-6 per row. Even spacing. All logos similar visual weight (normalize sizing). On mobile: 3 per row, smaller.

### Stats row
3-4 big numbers with labels. Large display font for numbers, small text for label. Optional: count-up animation on scroll via Intersection Observer. On mobile: 2×2 grid.

---

## Pricing

### Tier cards
2-3 cards side by side. Recommended tier: visually elevated (scale, border, badge, shadow). Each: tier name, price, feature list with check/x icons, CTA button. Monthly/annual toggle above. On mobile: stack vertically, recommended first.

### Comparison table
Full-width table with features as rows, tiers as columns. Check/x/value in cells. Sticky header. Recommended column highlighted. On mobile: convert to accordion or stacked cards per tier.

---

## Call to Action

### CTA banner
Full-width section with contrasting background (brand primary or gradient). Centered text: headline + supporting text + 1-2 buttons. Keep copy tight — one sentence max. High visual contrast from surrounding sections.

### Inline CTA
Within content flow. Card or highlighted region with lighter visual weight than full banner. Text + single button. Use when you need a mid-page conversion point without breaking reading flow.

---

## Footer

### Rich footer
4-column layout: brand/description, navigation links (2-3 columns), newsletter signup. Below: social icons + legal links + copyright. Divider line between content and legal. On mobile: stack columns, accordion for link groups.

### Minimal footer
Single row: logo + horizontal link list + copyright. Centered or space-between. Use for apps or simple sites where footer navigation is unnecessary.

---

## Responsive Patterns

| Block | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Split hero | Side by side | Side by side (narrower) | Stacked, text first |
| Bento grid | 3-4 columns | 2 columns | 1 column |
| Alternating | Image/text rows | Image/text rows | Stacked, image above |
| Icon features | 3-4 per row | 2 per row | 1 per row |
| Testimonials | 3 cards | 2 cards | 1 card or scroll |
| Pricing cards | Side by side | Side by side | Stacked |
| Rich footer | 4 columns | 2×2 grid | Stacked |

---

## Advanced Compositions

### Bento 2.0

Asymmetric grid where every cell is alive — each tile runs a perpetual micro-animation (pulse, float, shimmer, or infinite mini-carousel). Cells are self-contained components with their own animation loops, creating ambient motion across the grid. Mixed sizes: 1×1 through 2×2, 3-4 column grid.
**Responsive:** Collapse to 2-col then 1-col. Animations persist at all breakpoints — they're per-tile, not layout-dependent.

### Split-screen scroll

Viewport divided into two vertical halves that scroll in opposite directions. Left pane scrolls content upward while right pane scrolls downward (or vice versa), creating a parallax tension effect. Content in each half is independent — typically images vs. text, or two complementary narratives.
**Responsive:** Stack vertically with normal unified scroll direction. No split on viewports < 768px.

### Curtain reveal

Hero section that splits down the center like a curtain as the user scrolls, revealing the next section behind it. Each half translates outward (left half → left, right half → right) tied to scroll position. Content behind is fixed-position until fully revealed.
**Responsive:** Replace curtain split with a simple crossfade on mobile — the split effect requires sufficient viewport width to read.

### Sticky scroll sequence

Image or video frames tied to scroll position, advancing one frame per scroll increment (like Apple product pages). A tall scroll container (300-500vh) drives a fixed-position media element through a sequence of states. Text callouts appear at keyframe positions.
**Responsive:** Replace scroll-tied frames with auto-playing video or animated sequence. Maintain text callouts as overlay cards.

### Accordion image slider

5-7 narrow vertical strips displayed side by side, each showing a slice of its full image. On hover, the targeted strip expands to full width while others compress. Creates an explorable gallery in a single viewport-height section.
**Responsive:** Convert to standard horizontal carousel with snap points on mobile. Hover-expand doesn't translate to touch.

### Mega menu reveal

Full-viewport-width dropdown panel triggered by nav hover or click. Content organized in 3-5 columns with staggered fade-in (80ms per column). Includes category headers, link lists, optional featured image or CTA card. Overlay dims page content behind.
**Responsive:** Replace with full-screen slide-in panel from the side. Stagger animation applies to rows instead of columns.

### Dynamic island

Pill-shaped floating UI component that morphs shape and content contextually — expanding to show notifications, progress bars, media controls, or status updates. Uses `border-radius` transitions and `layout` animation (Framer Motion `layoutId`) for smooth shape-shifting.
**Responsive:** Same behavior at all breakpoints. Adjust max-width and font size. Pin to top or bottom of viewport on mobile.

### Command palette

`⌘K` / `Ctrl+K` triggered search overlay with fuzzy matching, keyboard navigation (arrow keys + enter), and grouped results (pages, actions, settings). Modal with input field, scrollable results list, and keyboard shortcut hints. Escape or click-outside to dismiss.
**Responsive:** Full-screen takeover on mobile with larger touch targets. Input auto-focused. Results fill available height.
