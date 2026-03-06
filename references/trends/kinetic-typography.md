# Kinetic Typography

> Text that moves — scroll-triggered animations, character-level effects, and responsive text transforms that make typography the hero element.

Last verified: 2026-03-04

---

## Visual Characteristics

- Text as the primary visual element, not decoration
- Scroll-triggered reveals and staggered animations
- Character and word-level motion with precise timing
- Marquee/horizontal scroll text for atmosphere
- Scale and emphasis transitions for key messages
- Requires JavaScript for character splitting and scroll detection

---

## CSS Implementation

### Scroll-Reveal (Word by Word)

```css
.kinetic-word {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.kinetic-word.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger: 60ms per word */
.kinetic-word:nth-child(1) { transition-delay: 0ms; }
.kinetic-word:nth-child(2) { transition-delay: 60ms; }
.kinetic-word:nth-child(3) { transition-delay: 120ms; }
```

### Character Split + Stagger

```css
.kinetic-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
  animation: char-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes char-reveal {
  to { opacity: 1; transform: translateY(0); }
}

.kinetic-char { animation-delay: calc(var(--char-index) * 30ms); }
```

### Horizontal Scroll Text (Marquee)

```css
.kinetic-marquee {
  display: flex;
  white-space: nowrap;
  animation: scroll-x 20s linear infinite;
}

@keyframes scroll-x {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### Animation Timing Reference

| Effect | Duration | Easing | Stagger |
|--------|----------|--------|---------|
| Word reveal | 400ms | `ease-out` | 60ms/word |
| Char reveal | 500ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 30ms/char |
| Line slide-up | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 100ms/line |
| Marquee | 15-25s | `linear` | N/A |
| Scale emphasis | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | N/A |

---

## Implementation Guide

### Step-by-step

1. Choose your effect type: word reveal, character split, line slide, or marquee
2. For word/character effects: split text into `<span>` elements using JavaScript
3. Set `--char-index` or `--word-index` CSS custom property on each span for stagger timing
4. Use `IntersectionObserver` to trigger animations when elements enter the viewport
5. Apply animation class (`.visible`) when the element intersects
6. For marquee: duplicate the text content to create a seamless loop
7. Set `aria-hidden="true"` on duplicate marquee content

### Progressive Enhancement

```css
/* Baseline: all text visible immediately */
.kinetic-word,
.kinetic-char {
  opacity: 1;
  transform: none;
}

/* Enhanced: only animate when JS is available */
.js-loaded .kinetic-word,
.js-loaded .kinetic-char {
  opacity: 0;
  transform: translateY(20px);
}
```

Add `js-loaded` class to `<html>` via JavaScript on load to enable animations only when JS is available.

### Framework Notes

#### React + Framer Motion

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function KineticHeading({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <h2 ref={ref} className="text-5xl font-bold">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}
```

#### GSAP ScrollTrigger

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Word-by-word reveal on scroll
gsap.from('.kinetic-word', {
  y: 20,
  opacity: 0,
  stagger: 0.06,
  duration: 0.4,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.kinetic-container',
    start: 'top 80%',
    toggleActions: 'play none none none',
  }
});
```

#### CSS Scroll-Driven Animations (New Spec)

```css
/* Native CSS scroll-linked animation — Chrome 115+ */
.kinetic-word {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 50%;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

#### React Native

Kinetic typography is achievable with `react-native-reanimated` for scroll-linked animations. Character splitting requires manual `<Text>` wrapping. No CSS `animation-timeline` equivalent exists — use `useAnimatedScrollHandler` from Reanimated.

### Common Pitfalls

1. **Text inaccessible without JS**: always ensure text is visible by default. Apply animation styles only after JS loads. Never set `opacity: 0` in base CSS for content text.
2. **Excessive DOM nodes**: character-level splitting creates one `<span>` per character. A 500-character paragraph becomes 500+ DOM nodes. Limit character splitting to headings and short phrases.
3. **Replay fatigue**: scroll-triggered animations that replay every time the user scrolls past create annoyance. Use `{ once: true }` with IntersectionObserver.
4. **Marquee without duplication**: a single-copy marquee shows a gap. Duplicate the content and use `translateX(-50%)` for seamless looping.
5. **Missing reduced-motion support**: kinetic typography is the most motion-heavy trend — always provide a complete `prefers-reduced-motion` fallback.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Apple (product pages) | Word-by-word scroll reveal with scale emphasis on key specs ("A17 Pro") | iPhone page with staggered text revealing performance numbers |
| Locomotive | Scroll-driven character reveal with split animations and parallax text layers | Agency homepage with large kinetic headings |
| Awwwards — Aristide Benoist | Award-winning character-by-character reveal with custom easing per letter | Portfolio with immersive typographic scroll experience |
| Stripe | Subtle word-level fade-in on scroll with precise stagger timing | Features page with clean staggered text reveals |
| Awwwards — Rejouice | Full-page kinetic typography as the primary navigation and storytelling device | Single-page experience driven entirely by animated text |

---

## Accessibility

- **Content visibility**: text must be readable without JavaScript. Never hide content behind `opacity: 0` in base CSS.
- **Reduced motion**: replace all animation with instant visibility for `prefers-reduced-motion: reduce`
  - Stop marquee animations
  - Remove character-level stagger — show full text immediately
  - Replace slide/scale with simple opacity fade (200ms max)
- **Screen readers**: ensure `aria-hidden="true"` on duplicate marquee text. Use `aria-label` on animated containers if text is fragmented across many spans.
- **Focus order**: character-split text should not create individual tab stops. Use `tabindex="-1"` on internal spans.

---

## Performance

- **DOM cost**: character splitting creates N DOM nodes per character. Keep to headings and short phrases — never split body paragraphs
- **GSAP vs CSS**: GSAP ScrollTrigger adds ~25KB (minified). CSS scroll-driven animations are zero-JS but limited to Chrome 115+
- **Animate only `transform` and `opacity`**: these are GPU-composited. Avoid animating `font-size`, `letter-spacing`, or `width`
- **IntersectionObserver**: more performant than scroll event listeners for triggering reveals
- **Marquee**: uses `transform: translateX()` — GPU-composited, low cost even on mobile

---

## When to Use / When to Avoid

### Use When
- Hero sections, section intros with key messages
- Single impactful phrases or headlines
- Scroll-driven storytelling and narrative pages
- Marketing/landing pages where typography is the hero

### Avoid When
- Body text, paragraphs, or long-form content
- Navigation elements, form labels
- Frequently revisited pages where animation becomes annoying
- Content that needs to be immediately readable (alerts, errors, CTAs)

---

## Design Tokens

```json
{
  "kinetic": {
    "word-reveal-duration": "400ms",
    "word-reveal-stagger": "60ms",
    "word-reveal-easing": "ease-out",
    "char-reveal-duration": "500ms",
    "char-reveal-stagger": "30ms",
    "char-reveal-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
    "line-slide-duration": "600ms",
    "line-slide-stagger": "100ms",
    "marquee-duration": "20s",
    "scale-emphasis-duration": "300ms",
    "scale-emphasis-easing": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "reduced-motion-duration": "200ms"
  }
}
```

---

## Related

- [Neubrutalism](./neubrutalism.md) — great pairing for bold, expressive text effects
- [Micro-Interactions](./micro-interactions.md) — complementary animation system for non-text elements
