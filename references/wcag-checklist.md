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
- [ ] **Text contrast:** ≥ 4.5:1 (normal text), ≥ 3:1 (large text ≥ 18pt / bold ≥ 14pt)
- [ ] **Non-text contrast:** ≥ 3:1 for UI components and graphics
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
- [ ] Focus indicators have ≥ 3:1 contrast and ≥ 2px outline

### 2.5 Input Modalities
- [ ] Pointer gestures have single-pointer alternatives
- [ ] Pointer actions can be cancelled (up-event or undo)
- [ ] Labels match accessible names
- [ ] Motion-triggered functions have alternatives
- [ ] **Touch targets:** ≥ 24x24 CSS pixels (44x44 recommended for mobile)
- [ ] No accidental activation from dragging

## 3. Understandable

### 3.1 Readable
- [ ] Page language declared (`lang` attribute)
- [ ] Language of parts identified when different from page

### 3.2 Predictable
- [ ] No unexpected context changes on focus
- [ ] No unexpected context changes on input (without warning)
- [ ] Navigation consistent across pages
- [ ] Components identified consistently

### 3.3 Input Assistance
- [ ] Errors identified and described in text
- [ ] Labels and instructions provided for inputs
- [ ] Error suggestions offered when known
- [ ] Submissions reversible, checked, or confirmed
- [ ] Redundant entry: don't require re-entering previously provided info

## 4. Robust

### 4.1 Compatible
- [ ] Valid HTML markup (no duplicate IDs, proper nesting)
- [ ] Name, role, value available for all UI components
- [ ] Status messages conveyed via ARIA roles (no focus change needed)

---

## Testing Tools
- **Contrast:** WebAIM Contrast Checker, Stark (Figma)
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
