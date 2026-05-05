# Visual Effects Reference — CSS Recipes

Production-ready CSS and Tailwind snippets for visual polish. Adapt values to the brand's tokens.

---

## Depth & Shadows

### Layered shadows

```css
/* Subtle — cards, inputs */
shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.06);

/* Medium — elevated cards, dropdowns */
shadow-md: 0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.08);

/* Dramatic — modals, floating elements */
shadow-lg: 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12);
```

### Glow effects

```css
/* Primary color glow — CTAs, active states */
box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3), 0 0 40px rgba(var(--color-primary-rgb), 0.1);

/* Ambient glow — hero accents */
box-shadow: 0 0 80px 40px rgba(var(--color-accent-rgb), 0.15);
```

### Glassmorphism

```css
backdrop-filter: blur(16px) saturate(180%);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.12);
/* Tailwind: backdrop-blur-xl backdrop-saturate-[180%] bg-white/[0.08] border border-white/[0.12] */
```

`@supports not (backdrop-filter: blur(1px))` — use solid bg with 90% opacity as fallback.

---

## Backgrounds & Texture

### Gradient backgrounds

```css
/* Linear sweep — hero backgrounds */
background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

/* Radial orb — decorative accent behind content */
background: radial-gradient(circle at 30% 20%, rgba(var(--color-accent-rgb), 0.25) 0%, transparent 60%);

/* Mesh gradient — layer 2-3 radial gradients */
background:
  radial-gradient(at 20% 80%, rgba(var(--color-primary-rgb), 0.2) 0%, transparent 50%),
  radial-gradient(at 80% 20%, rgba(var(--color-accent-rgb), 0.15) 0%, transparent 50%),
  radial-gradient(at 50% 50%, rgba(var(--color-secondary-rgb), 0.1) 0%, transparent 60%);
```

### Noise/grain texture

```css
/* SVG noise overlay — tactile surfaces */
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
```

### Grid/dot overlay

```css
/* Dot grid — tech/modern aesthetic, 3% opacity */
background-image: radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px);
background-size: 24px 24px;
```

---

## Motion & Animation

### Entrance animations

```css
/* Fade up — default content entrance */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up { animation: fade-up 0.5s ease-out forwards; }

/* Stagger children — add delay per child */
.stagger > :nth-child(1) { animation-delay: 0ms; }
.stagger > :nth-child(2) { animation-delay: 80ms; }
.stagger > :nth-child(3) { animation-delay: 160ms; }
/* ... increment by 80ms */
```

### Hover transitions

```css
/* Lift + shadow shift — cards */
transition: transform 0.2s ease, box-shadow 0.2s ease;
&:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

/* Scale + brighten — buttons */
transition: transform 0.15s ease, filter 0.15s ease;
&:hover { transform: scale(1.02); filter: brightness(1.1); }

/* Border glow — inputs, cards */
transition: box-shadow 0.2s ease;
&:hover { box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2); }
```

### Scroll-triggered reveals

```js
// Intersection Observer — add .visible class on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.1 }
);
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

### Loading states

```css
/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
```

---

## Typography Effects

### Gradient text

```css
background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
/* Tailwind: bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent */
```

### Text glow

```css
text-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3);
```

---

## Component Polish

### Card hover

```css
/* Lift + shadow + subtle border */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(var(--color-primary-rgb), 0.1);
}
```

### Button state progression

```css
/* Rest → Hover → Active → Focus */
.btn {
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}
.btn:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); filter: brightness(1.05); }
.btn:active { box-shadow: var(--shadow-sm); transform: translateY(0); filter: brightness(0.95); }
.btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

### Image treatments

```css
/* Rounded + shadow — product images */
border-radius: var(--radius-lg); box-shadow: var(--shadow-md);

/* Hover zoom — gallery, cards */
.img-wrapper { overflow: hidden; border-radius: var(--radius-md); }
.img-wrapper img { transition: transform 0.3s ease; }
.img-wrapper:hover img { transform: scale(1.05); }

/* Gradient overlay — text over images */
background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
```

---

## Advanced Interactions

### Spotlight border cards

Mouse-tracking radial gradient on a pseudo-element, creating a glowing border that follows the cursor.

```css
.card { position: relative; border-radius: var(--radius-md); }
.card::before {
  content: ''; position: absolute; inset: -1px; border-radius: inherit;
  background: radial-gradient(600px circle at var(--x) var(--y),
    rgba(var(--color-primary-rgb), 0.3), transparent 40%);
  z-index: -1;
}
```
```js
card.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--x', `${e.clientX - r.left}px`);
  card.style.setProperty('--y', `${e.clientY - r.top}px`);
});
```

**When to use:** Feature grids, pricing cards, portfolio tiles — anywhere cards need subtle life on hover.

### Parallax tilt cards

3D tilt effect tracking cursor position within the card bounds.

```css
.tilt-card {
  perspective: 800px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}
```
```js
card.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
});
card.addEventListener('mouseleave', () => card.style.transform = 'none');
```

**When to use:** Product showcases, testimonial cards, image galleries where depth reinforces premium feel.

### Magnetic buttons

Element pulls toward cursor proximity using Framer Motion spring physics.

```tsx
const x = useMotionValue(0);
const y = useMotionValue(0);
function handleMouse(e: React.MouseEvent) {
  const r = e.currentTarget.getBoundingClientRect();
  x.set((e.clientX - r.left - r.width / 2) * 0.3);
  y.set((e.clientY - r.top - r.height / 2) * 0.3);
}
<motion.button style={{ x, y }} onMouseMove={handleMouse}
  onMouseLeave={() => { x.set(0); y.set(0); }}
  transition={{ type: "spring", stiffness: 150, damping: 15 }} />
```

**Performance:** CRITICAL — use `useMotionValue`, never `useState` for continuous animation. useState triggers re-renders every frame.
**When to use:** Primary CTAs, nav icons, floating action buttons — sparingly, max 2-3 per viewport.

### Staggered orchestration

Cascade reveal for groups of elements entering the viewport.

```tsx
// Framer Motion — container orchestration
<motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }}
  initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(item => (
    <motion.div key={item.id}
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} />
  ))}
</motion.div>
```
```css
/* CSS-only alternative */
.stagger-item { animation: fade-up 0.5s ease-out both;
  animation-delay: calc(var(--index) * 80ms); }
```

**When to use:** Feature lists, card grids, any repeated group entering on scroll. Limit to 6-8 items per stagger group.

### Spring physics defaults

Standard spring configurations for interactive elements. Never use linear easing for UI motion.

```tsx
// Interactive elements (buttons, toggles, cards)
transition={{ type: "spring", stiffness: 100, damping: 20 }}

// Snappy micro-interactions (checkboxes, switches)
transition={{ type: "spring", stiffness: 300, damping: 25 }}

// Gentle layout shifts (expanding panels, modals)
transition={{ type: "spring", stiffness: 60, damping: 18 }}
```

**Performance:** Spring physics self-resolve — no need to specify duration. Overdamped (damping > 2√stiffness) prevents oscillation.
**When to use:** Every animated element. Springs feel organic; linear/ease-in-out feel mechanical.

### Scroll-driven reveals

Native CSS scroll-driven animations or IntersectionObserver class toggling for entrance effects.

```css
/* CSS scroll-driven (modern browsers) */
@keyframes reveal { from { opacity: 0; translate: 0 30px; } }
.scroll-reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```
```css
/* IO fallback — toggle class */
.reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```

**Performance:** CSS `animation-timeline: view()` is compositor-driven — zero JS cost. Use IO fallback for Safari < 18.
**When to use:** Default entrance pattern for all below-fold content. Prefer CSS scroll-driven where supported.

### Sticky scroll stacking

Sections with `position: sticky` that stack as user scrolls, creating a layered card deck effect.

```css
.stack-section {
  position: sticky;
  top: calc(var(--index) * 40px);
  height: 80vh;
  border-radius: var(--radius-lg);
  transition: scale 0.3s ease;
}
.stack-section:not(:last-child) { scale: calc(1 - var(--index) * 0.02); }
```

**Performance:** Use `will-change: transform` on sticky elements. Limit to 4-6 stacking sections.
**When to use:** Case studies, feature deep-dives, storytelling sequences where layered reveal adds narrative weight.

### Horizontal scroll hijack

Vertical scroll input translates to horizontal gallery panning.

```css
.h-scroll-wrapper { overflow-x: scroll; scroll-snap-type: x mandatory; }
.h-scroll-wrapper > * {
  scroll-snap-align: start; flex-shrink: 0; width: 80vw;
}
```
```js
// Alternative: translateX driven by scrollY
const x = useTransform(scrollY, [sectionTop, sectionBottom],
  ['0%', `-${(items.length - 1) * 100}%`]);
```

**Performance:** CSS `scroll-snap` is GPU-composited. JS transform approach needs `useMotionValue` for frame budgets.
**When to use:** Image galleries, timelines, portfolio showcases — when horizontal layout serves content better than vertical.

### Text mask reveal

Large typography with media showing through the text shape.

```css
.text-mask {
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 900;
  background: url('video-or-gradient.mp4') center/cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Performance:** `background-clip: text` with video is paint-heavy — limit to one instance per page.
**When to use:** Hero headlines, section dividers, brand moments where type IS the visual.

### Kinetic marquee

Infinite horizontal text scroll, with hover pause or direction reversal.

```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee-inner {
  display: inline-flex; gap: 2rem;
  animation: scroll-x 20s linear infinite;
}
.marquee:hover .marquee-inner { animation-direction: reverse; }
@keyframes scroll-x { to { transform: translateX(-50%); } }
```

**Performance:** Duplicate content so the strip is 2× viewport width. `translateX` is compositor-only.
**When to use:** Logo walls, social proof tickers, decorative text bands between sections.

### Directional hover

Detect which side the cursor enters and animate a fill from that direction.

```js
function getDirection(e, el) {
  const { top, left, width, height } = el.getBoundingClientRect();
  const x = (e.clientX - left - width / 2) / width;
  const y = (e.clientY - top - height / 2) / height;
  return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90) % 4;
}
// Set CSS custom property: --enter-from: top|right|bottom|left
```
```css
.dir-hover::before {
  transition: transform 0.3s ease;
  transform: translateY(calc(var(--dir-y, 0) * 100%)) translateX(calc(var(--dir-x, 0) * 100%));
}
.dir-hover:hover::before { transform: translate(0, 0); }
```

**When to use:** Nav links, card overlays, image hover reveals — adds spatial awareness to interactions.

### Liquid glass refraction

Beyond basic glassmorphism — simulating realistic glass edge refraction and depth.

```css
.liquid-glass {
  backdrop-filter: blur(20px) saturate(200%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),   /* top edge highlight */
    inset 0 -1px 0 rgba(0, 0, 0, 0.05),        /* bottom edge shadow */
    0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: var(--radius-lg);
}
```

**Performance:** `backdrop-filter` triggers compositing — avoid stacking multiple blurred layers.
**When to use:** Floating toolbars, modal overlays, nav bars over dynamic backgrounds — upgrade from flat glassmorphism.

---

## Accessibility

Canonical motion + effects accessibility guidance lives in `${CLAUDE_SKILL_DIR}/../gsp-accessibility/motion-effects.md` — owned by `gsp-accessibility`. Builder must read it before applying any effect from this reference. Covers `prefers-reduced-motion`, contrast on glow/shadow/gradient text, backdrop-filter fallbacks, and hover-transform magnitudes.
