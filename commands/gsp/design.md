---
name: gsp:design
description: Design UI/UX screens, flows, and interaction patterns
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - Grep
  - Glob
---
<context>
Phase 4 of the GSP design pipeline. Uses the UI/UX Pattern Master prompt to design core screens following Apple HIG and the project's design system.
</context>

<objective>
Design core UI/UX screens and interaction flows.

**Input:** `.design/system/SYSTEM.md` + `.design/BRIEF.md`
**Output:** `.design/screens/SCREENS.md`
**Agent:** `gsp-ui-designer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/03-ui-ux-pattern-master.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/design.md
@/Users/jubs/.claude/get-shit-pretty/references/apple-hig-patterns.md
</execution_context>

<process>
## Step 1: Load context

Read:
- `.design/BRIEF.md` — app type, audience, goals
- `.design/system/SYSTEM.md` — design system to use
- `.design/brand/IDENTITY.md` — brand personality
- `.design/config.json` — get `implementation_target`

If SYSTEM.md doesn't exist, tell the user to run `/gsp:system` first.

## Step 2: Scan codebase for existing components

When `implementation_target` is `shadcn`, `rn-reusables`, `existing`, or `code` (anything except `figma`):

Scan the codebase for existing layouts and components:
- Look for `components/`, `src/components/`, `components/ui/`, `lib/components/`
- Look for shadcn `components/ui/` or RN Reusables `components/ui/`
- Look for Expo `app/` layouts, Next.js `app/` layouts, or other layout files
- Look for page/screen files to understand existing structure

Build an **Existing Components** inventory summarizing what's already built and reusable.

Pass this inventory to the agent so screen designs can reference existing components.

## Step 3: Spawn UI designer

Spawn the `gsp-ui-designer` agent with:
- All prior artifacts
- The UI/UX Pattern Master prompt (03)
- The design output template
- The Apple HIG patterns reference
- The `implementation_target` value
- The existing components inventory (if gathered in Step 2)

The agent should deliver:
1. User personas with goals and pain points
2. Information architecture
3. Navigation pattern and gesture definitions
4. 8 core screens with wireframes, components, interactions
5. All states: empty, error, loading
6. Accessibility specs (WCAG, VoiceOver, Dynamic Type)
7. Micro-interactions and animations
8. Responsive behavior across breakpoints
9. **Component Plan** (when target is not `figma`)
10. Designer's notes

## Step 4: Write output

Write screens to `.design/screens/SCREENS.md`.

## Step 5: Update state

Update `.design/STATE.md`:
- Set Phase 4 (Design) status to `complete`
- Record completion date

## Step 6: Route next

Display screen summary (screen count, key flows) and end with:

**When `implementation_target` is `skip`:**
"Run `/gsp:review` for design critique and accessibility audit."

**Otherwise:**
"Run `/gsp:spec` to generate implementation specifications."
</process>
