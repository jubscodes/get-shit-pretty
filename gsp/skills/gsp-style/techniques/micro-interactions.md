# Micro-Interactions

> Small, specific UI responses to user actions — hover, click, scroll, focus. The invisible details that make an interface feel alive and polished.

Last verified: 2026-03-04

---

## Visual Characteristics

- Subtle motion responses tied to specific user input
- State-transition feedback: hover, active, focus, loading, success/error
- Timing precision in the 80-300ms range
- Natural easing curves that match human expectation
- 75% of customer-facing apps will incorporate micro-interactions as standard (Gartner, 2025)

---

## Timing Guidelines

| Interaction | Duration | Rationale |
|-------------|----------|-----------|
| Button press feedback | 80-120ms | Must feel instant — finger-to-response |
| Hover feedback | 100-150ms | Quick enough to feel responsive, slow enough to perceive |
| State transitions | 200-300ms | Visible change without feeling sluggish |
| Page transitions | 300-500ms | Enough time for spatial orientation |
| Micro-interaction (general) | 120-220ms | UX research sweet spot (NN/g, Material Design) |

---

## CSS Implementation

### Button Hover Lift

```css
.micro-button {
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}
.micro-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.micro-button:active {
  transform: translateY(0px) scale(0.98);
  transition-duration: 0.08s;
}
```

### Card Hover

```css
.micro-card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.micro-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
```

### Checkbox Tick Animation

```css
.checkmark path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
.checkbox:checked + .checkmark path {
  stroke-dashoffset: 0;
}
```

### Toggle Switch

```css
.toggle-thumb {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle:checked .toggle-thumb {
  transform: translateX(24px);
}
```

### Skeleton Shimmer (Loading)

```css
.skeleton {
  background: linear-gradient(90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.06) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

### Interactive Cursor

```css
.cursor-follower {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid currentColor;
  transition: width 0.2s ease, height 0.2s ease;
  pointer-events: none;
}
.cursor-follower.hovering-link {
  width: 64px;
  height: 64px;
  mix-blend-mode: difference;
}
```

### Easing Reference

| Feel | Cubic-Bezier | Use |
|------|-------------|-----|
| Snappy | `cubic-bezier(0.2, 0, 0, 1)` | General UI transitions |
| Bouncy | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Toggles, playful elements |
| Smooth exit | `cubic-bezier(0.16, 1, 0.3, 1)` | Elements leaving viewport |
| Elastic | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | Attention-grabbing moments |
| Linear | `linear` | Progress bars, continuous motion |

---

## Implementation Guide

### Step-by-step

1. Identify every interactive element: buttons, cards, inputs, toggles, links
2. Define the interaction trigger: hover, click/tap, focus, scroll, state change
3. Choose the appropriate timing from the guidelines table above
4. Select an easing curve matching the desired feel (snappy for UI, bouncy for playful)
5. Animate only `transform` and `opacity` — avoid `width`, `height`, `top`, `left`
6. Add `:active` state for press feedback (scale down or translate)
7. Test on both mouse (hover) and touch (tap) — touch devices skip hover

### Progressive Enhancement

```css
/* Baseline: instant state changes */
.micro-button {
  /* No transition — works in all browsers */
}

/* Enhanced: smooth transitions when motion is acceptable */
@media (prefers-reduced-motion: no-preference) {
  .micro-button {
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  }
}
```

### Framework Notes

#### React + Framer Motion

```tsx
import { motion } from 'framer-motion';

export function MicroButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
    >
      {children}
    </motion.button>
  );
}
```

#### React + Tailwind CSS

```tsx
export function MicroCard({ children }) {
  return (
    <div className="transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.98] active:duration-75 rounded-2xl bg-white p-6 shadow-md">
      {children}
    </div>
  );
}
```

#### React Native

```tsx
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

export function MicroButton({ title, onPress }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={onPress}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
```

### Common Pitfalls

1. **Hover-only interactions**: touch devices don't have hover. Always pair hover effects with active/tap states for mobile parity.
2. **Animating layout properties**: `width`, `height`, `top`, `left`, `margin`, `padding` trigger layout recalculation. Stick to `transform` and `opacity`.
3. **Too slow**: micro-interactions above 300ms feel sluggish. The "micro" means fast — 100-200ms for most.
4. **Too many at once**: if every element bounces, glows, and scales simultaneously, the UI feels chaotic. Apply micro-interactions selectively to primary interactive elements.
5. **No active/press state**: a button that hovers but doesn't respond to click feels broken. Always include `:active` feedback.

---

## Examples Gallery

| Site | What They Do Well | Screenshot Description |
|------|-------------------|----------------------|
| Stripe | Precise hover states on pricing cards — subtle lift, shadow expansion, gradient border glow | Pricing page with elevated hovered card |
| Linear | Toggle, checkbox, and dropdown animations with spring physics — every element feels tactile | Settings panel with bouncy toggle switches |
| Vercel | Skeleton shimmer loading states and smooth page transitions | Dashboard with skeleton placeholders resolving to content |
| Apple | iOS-quality button press feedback (scale 0.97) and page transition choreography on web | Product page with precise interaction states |
| Awwwards — Locomotive Scroll | Custom cursor interactions, magnetic buttons, and parallax micro-effects | Agency site with cursor that morphs over interactive elements |

---

## Accessibility

- **Reduced motion**: wrap all transitions in `@media (prefers-reduced-motion: no-preference)`. For `reduce`: instant state changes, no animation.
- **Focus indicators**: animated focus rings must still meet 3:1 contrast ratio. Use `outline` (not `box-shadow`) for reliable focus visibility.
- **Timing**: ensure animations complete before the next interaction is expected — don't delay functionality behind animation.
- **Touch targets**: hover-lift effects can visually move elements. Ensure tap targets remain at least 44x44px regardless of visual position.
- **Loading states**: skeleton shimmer should eventually resolve. Add `aria-busy="true"` to loading containers.

---

## Performance

- **Transform + opacity only**: these are GPU-composited and stay off the main thread
- **`will-change` sparingly**: apply to elements that will animate, not globally. Remove after animation completes for long-lived elements.
- **Frame budget**: 16ms per frame at 60fps. Micro-interactions at 100-200ms use 6-12 frames — keep each frame under budget.
- **Batch transitions**: if multiple elements animate simultaneously, ensure total compositing cost stays low. Profile with Chrome DevTools Performance panel.
- **Mobile**: reduce hover animations (they don't apply anyway) and ensure tap feedback runs at 60fps.

---

## When to Use / When to Avoid

### Use When
- Every interactive element benefits from some micro-interaction
- Loading states, form validation feedback, navigation transitions
- Success/error confirmation animations
- Hover states on cards, buttons, and links

### Avoid When
- Decorative-only motion with no functional purpose
- Dense data displays where motion adds cognitive load
- High-frequency actions (typing, scrolling) where animation would create lag
- Accessibility-critical interfaces where motion could trigger vestibular disorders

---

## Design Tokens

```json
{
  "micro": {
    "duration-instant": "80ms",
    "duration-fast": "120ms",
    "duration-normal": "200ms",
    "duration-slow": "300ms",
    "duration-page": "400ms",
    "ease-snappy": "cubic-bezier(0.2, 0, 0, 1)",
    "ease-bouncy": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "ease-smooth-exit": "cubic-bezier(0.16, 1, 0.3, 1)",
    "ease-elastic": "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    "hover-lift": "-2px",
    "hover-shadow": "0 4px 12px rgba(0,0,0,0.15)",
    "active-scale": "0.98",
    "card-lift": "-4px",
    "card-shadow": "0 12px 24px rgba(0,0,0,0.1)"
  }
}
```

---

## Related

- [Kinetic Typography](./kinetic-typography.md) — complementary animation system for text
- [Bento Grid](./bento-grid.md) — card hover and entrance animations pair well
- [Claymorphism](./claymorphism.md) — tactile squish feedback enhances the clay feel
