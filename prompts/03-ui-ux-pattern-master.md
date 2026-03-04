# The UI/UX Pattern Master

**Category:** UI/UX Design
**Use when:** Designing a full app UI following Apple HIG principles

---

## Prompt

Act as a Senior Apple UI Designer. Design a full UI for [APP TYPE] based on [PERSONA], goals, and pain points. Follow Apple HIG. Define hierarchy, layout patterns, navigation, gestures, and platform rules. Detail 8 core screens with wireframes, components, interactions, empty/error/loading states. Specify buttons, forms, cards, data viz, accessibility (WCAG, VoiceOver, Dynamic Type), micro-interactions, and responsive behavior. Include Designer's Notes.

**Screen scope:**
- When `design_scope` is `full`: design [SCREEN_COUNT] core screens (default 8)
- When `design_scope` is `partial`: design only [TARGET_SCREENS]

**When [INVENTORY] is provided (existing codebase):**
Reference existing components and patterns from [INVENTORY]. Use existing component names in wireframes where applicable. When redesigning existing screens, note what changes vs what stays.

---

## Variables

- `[APP TYPE]` — Type of application (e.g., fitness tracker, finance app)
- `[PERSONA]` — Target user persona
- `[SCREEN_COUNT]` — Number of screens (default 8)
- `[TARGET_SCREENS]` — Specific screens when partial scope
- `[INVENTORY]` — INVENTORY.md contents (empty when greenfield)

## Expected Output

- User persona with goals and pain points
- Information hierarchy and layout patterns
- Navigation system and gesture definitions
- Platform-specific rules (Apple HIG)
- 8 core screens with wireframes (or target screens when partial)
- Component specs (buttons, forms, cards, data viz)
- State designs (empty, error, loading)
- Accessibility (WCAG, VoiceOver, Dynamic Type)
- Micro-interactions
- Responsive behavior
- Designer's notes
