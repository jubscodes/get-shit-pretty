# WCAG 2.2 AA Quick Reference

**Standard:** Web Content Accessibility Guidelines 2.2
**Conformance Level:** AA (target for most projects)

---

## 1. Perceivable

### 1.1 Text Alternatives
- [ ] All non-text content has text alternatives (alt text, labels)
- [ ] Decorative images use empty alt (`alt=""`) or CSS background

### 1.2 Time-Based Media
- [ ] Captions for all prerecorded audio/video
- [ ] Audio descriptions for prerecorded video
- [ ] Captions for live audio

### 1.3 Adaptable
- [ ] Content structure conveyed through proper markup (headings, lists, tables)
- [ ] Meaningful reading order preserved
- [ ] Instructions don't rely solely on shape, size, position, or color

### 1.4 Distinguishable
- [ ] Color is not the only means of conveying information
- [ ] **Text contrast:** >= 4.5:1 (normal text), >= 3:1 (large text >= 18pt / bold >= 14pt)
- [ ] **Non-text contrast:** >= 3:1 for UI components and graphics
- [ ] Text resizable to 200% without loss of content
- [ ] No images of text (except logos)
- [ ] Content reflows at 320px width (no horizontal scroll)
- [ ] Text spacing adjustable (line height 1.5x, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em)

## 2. Operable

### 2.1 Keyboard Accessible
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Character key shortcuts can be turned off or remapped

### 2.2 Enough Time
- [ ] Time limits adjustable, extendable, or removable
- [ ] Auto-updating content can be paused, stopped, or hidden

### 2.3 Seizures and Physical Reactions
- [ ] No content flashes more than 3 times per second
- [ ] Motion animation can be disabled (prefers-reduced-motion)

### 2.4 Navigable
- [ ] Skip navigation link present
- [ ] Pages have descriptive titles
- [ ] Focus order is logical and meaningful
- [ ] Link purpose clear from text (or context)
- [ ] Multiple ways to find pages (nav, search, sitemap)
- [ ] Headings and labels are descriptive
- [ ] **Focus visible:** Clear, visible focus indicators on all interactive elements
- [ ] Focus indicators have >= 3:1 contrast and >= 2px outline
- [ ] **SC 2.4.11 Focus Not Obscured (AA):** Focused element is not entirely hidden by author-created content (sticky headers, overlays, drawers)

### 2.5 Input Modalities
- [ ] Pointer gestures have single-pointer alternatives
- [ ] Pointer actions can be cancelled (up-event or undo)
- [ ] Labels match accessible names
- [ ] Motion-triggered functions have alternatives
- [ ] **Touch targets:** >= 24x24 CSS pixels (44x44 recommended for mobile)
- [ ] No accidental activation from dragging
- [ ] **SC 2.5.8 Target Size (AA):** Interactive targets are at least 24x24 CSS px, or have sufficient spacing from adjacent targets

## 3. Understandable

### 3.1 Readable
- [ ] Page language declared (`lang` attribute)
- [ ] Language of parts identified when different from page

### 3.2 Predictable
- [ ] No unexpected context changes on focus
- [ ] No unexpected context changes on input (without warning)
- [ ] Navigation consistent across pages
- [ ] Components identified consistently
- [ ] **SC 3.2.6 Consistent Help (A):** Help mechanisms (chat, phone, FAQ) appear in the same relative order across pages

### 3.3 Input Assistance
- [ ] Errors identified and described in text
- [ ] Labels and instructions provided for inputs
- [ ] Error suggestions offered when known
- [ ] Submissions reversible, checked, or confirmed
- [ ] **SC 3.3.7 Redundant Entry (A):** Don't require re-entering previously provided info (auto-populate or allow selection)
- [ ] **SC 3.3.8 Accessible Authentication (AA):** No cognitive function test for login — allow paste, password managers, and alternative verification

## 4. Robust

### 4.1 Compatible
- [ ] Valid HTML markup (no duplicate IDs, proper nesting)
- [ ] Name, role, value available for all UI components
- [ ] Status messages conveyed via ARIA roles (no focus change needed)

## 5. Token-Specific Checks

### 5.1 Contrast Pairs
- [ ] Every semantic foreground/background token pair meets AA contrast ratio
- [ ] Interactive state pairs (hover, active, disabled) meet contrast requirements
- [ ] Error/success/warning colors meet 3:1 non-text contrast against their backgrounds
- [ ] Placeholder text meets 4.5:1 (or 3:1 for large text) against input backgrounds

### 5.2 Focus Ring
- [ ] Focus ring token provides >= 3:1 contrast against adjacent background
- [ ] Focus ring is >= 2px solid (not dotted/dashed which can be hard to perceive)
- [ ] Focus ring offset doesn't cause ring to overlap with element content

### 5.3 Dark Mode Re-verification
- [ ] All semantic pairs re-verified in dark mode token set
- [ ] Dark mode doesn't just invert — verify actual contrast ratios
- [ ] System-level color-scheme media query respected

### 5.4 Touch Targets
- [ ] Button/link token sizing defaults to >= 44px height for touch
- [ ] Icon-only interactive elements have >= 24x24 px target area
- [ ] Spacing tokens between adjacent targets prevent accidental activation

### 5.5 Typography Minimums
- [ ] Body text token >= 16px (1rem)
- [ ] Caption/small text token >= 12px
- [ ] Line-height tokens >= 1.5 for body text
- [ ] Letter-spacing tokens don't reduce from browser defaults

## 6. APCA Reference (Informational)

The Accessible Perceptual Contrast Algorithm (APCA) is a next-generation contrast model. APCA values (Lc) are directional — polarity matters.

| Use Case | Minimum Lc |
|----------|-----------|
| Body text (16px+) | Lc 75 |
| Large text (24px+ / 18px bold) | Lc 60 |
| Sub-text, placeholders | Lc 90 |
| Non-text UI, icons | Lc 60 |
| Decorative, disabled | Lc 30 |

APCA is informational — WCAG 2.x ratios remain the conformance standard. Use APCA as a supplementary check for perceptual accuracy, especially in dark mode.

---

## Testing Tools
- **Contrast:** WebAIM Contrast Checker, Stark (Figma)
- **APCA:** APCA Contrast Calculator (myndex.com/APCA)
- **Screen reader:** VoiceOver (Mac/iOS), NVDA (Windows), TalkBack (Android)
- **Keyboard:** Tab through entire interface
- **Automated:** axe DevTools, Lighthouse, WAVE
- **Zoom:** Test at 200% and 400% zoom

## Common Failures
1. Missing alt text on informative images
2. Insufficient color contrast
3. No visible focus indicators
4. Missing form labels
5. Non-descriptive link text ("click here")
6. Missing skip navigation
7. Improper heading hierarchy
8. Auto-playing media without controls
9. Touch targets too small on mobile
10. Color-only error indication
