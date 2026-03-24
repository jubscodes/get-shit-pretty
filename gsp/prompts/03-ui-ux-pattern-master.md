# The UI/UX Pattern Master

**Category:** UI/UX Design
**Use when:** Designing a full app UI following Apple HIG principles

---

## Prompt

Act as a Senior Apple UI Designer. Design a full UI for [APP TYPE] based on [PERSONA], goals, and pain points. Follow Apple HIG. Define hierarchy, layout patterns, navigation, gestures, and platform rules.

**When [COMPONENTS] is provided (existing codebase):**
Reference existing components and patterns from [COMPONENTS]. Use existing component names in wireframes where applicable. When redesigning existing screens, note what changes vs what stays.

## Variables

- `[APP TYPE]` — Type of application (e.g., fitness tracker, finance app)
- `[PERSONA]` — Target user persona
- `[SCREEN_COUNT]` — Number of screens (default 8)
- `[TARGET_SCREENS]` — Specific screens when partial scope
- `[COMPONENTS]` — `.design/system/COMPONENTS.md` contents (empty when greenfield)
