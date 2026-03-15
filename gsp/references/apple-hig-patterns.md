# Apple Human Interface Guidelines — Key Patterns

**Source:** Apple HIG (developer.apple.com/design/human-interface-guidelines)

---

## Core Principles

### Clarity
- Text is legible at every size
- Icons are precise and lucid
- Adornments are subtle and appropriate
- A sharpened focus on functionality motivates the design

### Deference
- Fluid motion and a crisp, beautiful interface help people understand and interact with content
- Content typically fills the entire screen
- Translucency and blurring hint at more content

### Depth
- Distinct visual layers and realistic motion impart vitality
- Hierarchy and positioning convey relationships
- Transitions provide a sense of depth

## Navigation Patterns

### Tab Bar (iOS)
- 3-5 tabs maximum
- Always visible at bottom
- Icons + labels
- Badge for notifications
- Active state clearly distinct

### Sidebar (iPadOS/macOS)
- Primary navigation in left column
- Collapsible on iPadOS
- Supports sections and disclosure groups
- Selection state clearly visible

### Navigation Bar
- Title centered or left-aligned
- Back button with previous title
- Right side for actions (max 2-3)
- Large titles collapse on scroll

## Layout

### Safe Areas
- Respect safe area insets (notch, home indicator, Dynamic Island)
- Content extends edge-to-edge under bars

### Spacing
- Standard margins: 16pt (compact), 20pt (regular)
- Minimum touch target: 44x44pt
- Group related elements; separate unrelated ones

### Typography
- **SF Pro** (iOS/macOS) / **SF Compact** (watchOS)
- Dynamic Type support required
- 11 text styles: Large Title → Caption 2
- Bold Text accessibility setting

## Components

### Buttons
- System styles: Filled, Tinted, Gray, Plain
- Minimum 44pt touch target
- Clear hierarchy: primary (filled) → secondary (tinted) → tertiary (plain)

### Lists / Tables
- Inset grouped style (default for settings/forms)
- Plain style for content lists
- Swipe actions (leading/trailing)
- Pull to refresh

### Sheets & Modals
- Sheet: partial screen overlay (default for secondary tasks)
- Full-screen modal: immersive tasks requiring completion
- Alert: critical information requiring action
- Confirmation dialog: destructive action verification

### Search
- Search bar in navigation bar
- Suggestions and recent searches
- Scope bar for filtering categories
- Token-based filters

## Color

### System Colors
- Use semantic colors (`.label`, `.secondaryLabel`, `.systemBackground`)
- Adapt automatically to light/dark mode
- Accent color for brand identity
- Avoid hard-coded colors

### Dark Mode
- True black backgrounds for OLED (#000000)
- Elevated surfaces slightly lighter
- Reduced vibrancy
- All content must remain legible

## Accessibility

### VoiceOver
- Every element needs an accessibility label
- Group related elements with `accessibilityElement(children: .combine)`
- Custom actions for complex interactions
- Proper trait annotations (`.button`, `.header`, `.image`)

### Dynamic Type
- Support all 12 text sizes
- Layout must adapt (no truncation)
- Minimum: support up to xxxLarge
- Images scale with text when appropriate

### Reduce Motion
- Respect `prefers-reduced-motion`
- Replace animations with dissolves
- Disable parallax and bouncing effects

## Gestures

| Gesture | Use |
|---------|-----|
| Tap | Primary action |
| Long press | Context menu |
| Swipe | Navigation, actions |
| Pinch | Zoom |
| Rotate | Rotation |
| Pan | Scrolling, moving |
| Edge swipe | Back navigation |

## Key Rules
1. Never override system back gesture
2. Always support Dynamic Type
3. Use SF Symbols for iconography
4. Respect user privacy preferences
5. Support both light and dark mode
6. Provide haptic feedback for significant actions
7. Use standard system controls when possible
8. Make touch targets at least 44x44pt
