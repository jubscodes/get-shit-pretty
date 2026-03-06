---
name: gsp:brand-identity
description: Visual identity — logo system, color, typography, imagery
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - WebSearch
  - WebFetch
---
<context>
Phase 4 of the GSP branding diamond. Creates the brand's visual identity — logo system, color, typography, imagery — all grounded in brand strategy and verbal identity.
</context>

<objective>
Create the brand's visual identity.

**Input:** Strategy + verbal chunks (selective)
**Output:** `.design/branding/{brand}/identity/` (6 chunks + palettes.json + INDEX.md)
**Agent:** `gsp-identity-designer`
</objective>

<execution_context>
@/Users/jubs/.claude/get-shit-pretty/prompts/02-brand-identity-creator.md
@/Users/jubs/.claude/get-shit-pretty/templates/phases/identity.md
</execution_context>

<process>
## Step 1: Find brand

Scan `.design/branding/` for brand directories. If only one brand exists, use it. If multiple, ask the user which brand to work on.

Read `.design/branding/{brand}/BRIEF.md` — company, audience, inspiration.

## Step 1.5: Load upstream chunks

**Strategy (selective):**
Read `.design/branding/{brand}/strategy/INDEX.md`. If it exists, load: `brand-prism.md`, `archetype.md`, `positioning.md`, `brand-platform.md`.
Fallback: read `.design/branding/{brand}/strategy/STRATEGY.md` (legacy monolith). Log: "⚠️ Legacy strategy format detected."

If neither exists, tell the user to run `/gsp:brand-strategy` first.

**Verbal (selective):**
Read `.design/branding/{brand}/verbal/INDEX.md`. If it exists, load: `brand-voice.md`, `tone-spectrum.md`.
Fallback: read `.design/branding/{brand}/verbal/VERBAL.md` (legacy monolith). Log: "⚠️ Legacy verbal format detected."

Proceed without verbal if not yet complete.

## Step 2: Spawn identity designer

Spawn the `gsp-identity-designer` agent with:
- The BRIEF.md content
- Selected strategy chunks (or STRATEGY.md fallback)
- Selected verbal chunks (or VERBAL.md fallback)
- The Brand Identity Creator prompt (02)
- The identity output template
- **Output path:** `.design/branding/{brand}/identity/`

The agent writes chunks directly to the identity directory:
1. `logo-directions.md`
2. `color-system.md`
3. `typography.md`
4. `imagery-style.md`
5. `brand-applications.md`
6. `brand-book.md`
7. `palettes.json`
8. `INDEX.md`

## Step 3: Update state

Update `.design/branding/{brand}/STATE.md`:
- Set Phase 4 (Identity) status to `complete`
- Record completion date
- Set Prettiness Level to 80%

## Step 4: Route next

Display identity summary and end with:
"Visual identity is complete! Run `/gsp:brand-system` to build the design system for this brand."
</process>
