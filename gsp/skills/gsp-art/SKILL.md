---
name: gsp-art
description: "Craft ASCII art interactively — you direct, the artist creates"
user-invocable: true
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---
<context>
Interactive terminal art studio. You describe what you want, you create it, and iterate until it's perfect.

Not part of the main design pipeline. Just for fun.
</context>

<objective>
Create terminal art with the user in the loop — gather intent, create, iterate.

**Input:** User's vision (subject, mood, size, usage)
**Output:** Rendered art in the terminal + reusable code snippet
</objective>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
</rules>

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

Read `${CLAUDE_SKILL_DIR}/terminal-art.md` for the full ANSI/Unicode reference if needed.

Create 2-3 options for the user. For each option:

1. **Pick a technique** — gradient bars (`░▒▓█`), scatter/splatter, block text, box frames, dividers, shadow/depth, or negative space
2. **Draft in plain text first** — get the layout right without color
3. **Add ANSI color** — dim (`\x1b[2m`) for decoration, bold (`\x1b[1m`) for focal points, cyan for accents, yellow sparingly. Avoid red/green (semantic meaning)
4. **Test via `node -e`** — render in the actual terminal to verify alignment and color
5. **Deliver as a `console.log()` template literal** ready to reuse

**Constraints:** max 80 columns wide, max 25 lines tall, no emoji, always reset ANSI (`\x1b[0m`), must be readable without color, respect `NO_COLOR`.

## Step 3: Show and iterate

Present the options to the user. Let them pick a favorite, request tweaks, or ask for a completely new direction. Repeat Step 2 as needed until the user is happy.
</process>
