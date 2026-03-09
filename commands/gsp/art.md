---
name: gsp:art
description: "Craft ASCII art interactively — you direct, the artist creates"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
  - Agent
---
<context>
Interactive terminal art studio. You describe what you want, the ASCII artist creates it, and you iterate until it's perfect.

Not part of the main design pipeline. Just for fun.
</context>

<objective>
Create terminal art with the user in the loop — gather intent, create, iterate.

**Input:** User's vision (subject, mood, size, usage)
**Output:** Rendered art in the terminal + reusable code snippet
**Agent:** `gsp-ascii-artist`
</objective>

<process>
## Step 1: Gather intent

Ask the user what they want to render (subject — text, image, or concept).

Then use `AskUserQuestion` for mood:
- **Bold** — "High contrast, strong lines, maximum impact"
- **Minimal** — "Clean, sparse, breathing room"
- **Playful** — "Fun, quirky, unexpected"
- **Retro** — "8-bit nostalgia, old-school terminal vibes"

Then use `AskUserQuestion` for size:
- **Small** — "1-5 lines — compact accent"
- **Medium** — "5-15 lines — solid presence"
- **Large** — "15-25 lines — full showpiece"

Optionally ask about usage (one-off fun, splash screen, CLI output, embedded in code) if it's not obvious from context.

## Step 2: Create the art

Spawn the `gsp-ascii-artist` agent with the user's request. Ask for 2-3 options so the user can pick.

The agent will:
1. Draft the art
2. Test each option via `node -e` in the terminal
3. Return all rendered results and reusable code

## Step 3: Show and iterate

Present the options to the user. Let them pick a favorite, request tweaks, or ask for a completely new direction. Re-spawn the agent as needed until the user is happy.
</process>
