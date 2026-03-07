# UI/UX Design

## Project: {PROJECT_NAME}
**Date:** {DATE}

---

> This phase produces screen chunks (`screen-{NN}-{name}.md`) + shared chunks in `design/shared/` + INDEX.md in the `design/` directory.

## Chunk Mapping

### Screen Chunks (`design/`)

| Chunk File | Content |
|-----------|---------|
| `screen-{NN}-{name}.md` | One per screen — layout, components, states, interactions, accessibility |

Naming: `screen-{NN}-{kebab-case-name}.md` (e.g., `screen-01-home.md`, `screen-03-user-profile.md`)

### Shared Chunks (`design/shared/`)

| Chunk File | Content |
|-----------|---------|
| `shared/personas.md` | User personas — demographics, goals, pain points, usage context |
| `shared/information-architecture.md` | Content hierarchy and grouping |
| `shared/navigation.md` | Nav pattern, items, responsive behavior |
| `shared/micro-interactions.md` | Trigger → animation → duration → easing table |
| `shared/responsive.md` | Mobile, tablet, desktop breakpoint adaptations |
| `shared/component-plan.md` | Reuse / Refactor / New (shared) / New (local) — omit when target is `figma` |

## Content Reference

Each chunk follows the format in `references/chunk-format.md`. Below is the structural reference for what each chunk should contain:

### screen-{NN}-{name}.md
- **Purpose:** what this screen does
- **User flow:** position in the flow
- **Layout:** wireframe-level description
- **Components used:** from brand design system
- **States:** Default, Empty, Loading, Error
- **Interactions:** gestures, transitions
- **Accessibility:** VoiceOver order, focus management

### shared/personas.md
- 2-3 personas each with: Name, Demographics, Goals, Pain points, Usage context

### shared/information-architecture.md
- Hierarchy and navigation structure
- Content grouping rationale

### shared/navigation.md
- **Type:** Tab bar / Sidebar / Hamburger / etc.
- **Primary nav:** items
- **Secondary nav:** items
- Responsive behavior

### shared/micro-interactions.md
- Table: Trigger, Animation, Duration, Easing
- Gesture definitions

### shared/responsive.md
- **Mobile:** behavior
- **Tablet:** behavior
- **Desktop:** behavior

### shared/component-plan.md
- **Reuse (as-is):** Component, Source, Screens Used
- **Refactor (needs changes):** Component, Source, Changes Needed, Screens Used
- **New (shared):** Component, Purpose, Screens Used
- **New (local):** Component, Screen, Purpose
