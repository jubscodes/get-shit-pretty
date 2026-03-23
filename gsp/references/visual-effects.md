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

## Accessibility

All visual effects must degrade gracefully:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Glow/shadow: ensure text contrast meets WCAG AA without effects
- Backdrop-blur: `@supports not (backdrop-filter: blur(1px))` solid bg fallback
- Gradient text: test contrast ratio of gradient endpoints, not just midpoint
- Hover transforms: keep magnitude small (2-4px translate, 1.02-1.05 scale) to avoid disorientation
