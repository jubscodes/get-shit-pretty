---
name: gsp-pretty
description: "Surprise ASCII art in the terminal"
user-invocable: true
allowed-tools:
  - Read
  - Bash
  - Write
---
<context>
Easter egg command. Instantly renders a surprise piece of ASCII/Unicode terminal art. Context-aware — riffs on what the user is working on.

Not part of the main design pipeline. Just for fun.
</context>

<objective>
Surprise the user with a piece of terminal art that's relevant to their current context.

**Input:** None explicit — you gather context yourself
**Output:** Rendered art in the terminal
</objective>

<process>
## Step 1: Gather context clues

Quickly gather signal about what the user is working on. Check 2-3 of these (pick whichever are most likely to yield something interesting):

- `git log --oneline -5` — recent commit messages
- The project's `package.json` name/description, or `README.md` first lines
- `git diff --stat` — what files are being touched right now
- The current branch name
- The current date/time and day of week

Don't overthink it — spend 10 seconds gathering, not 10 minutes. You just need a seed.

## Step 2: Create surprise art

Read `${CLAUDE_SKILL_DIR}/../gsp-art/terminal-art.md` for the full ANSI/Unicode reference if needed.

Freestyle a single piece of terminal art. Medium size (5-15 lines).

**Creative direction:** Use the context as inspiration, not as a label. Do NOT make art about GSP, branding, or the tool itself. Be witty, culturally aware, and open-minded. The art should feel like a clever aside from someone who's been watching what you're building — not a logo for it.

**Vibes to riff on** (pick one or invent your own):
- A tiny scene with a punchline (visual wit)
- A metaphor for what the user is working on right now
- Something seasonal or timely for today's date
- A tribute to a classic (art, music, film, code) that connects to the context
- An abstract mood piece — rain, neon, space, dawn
- A visual one-liner that makes someone smile
- Something completely unexpected

**Process:**
1. Pick a technique — gradient bars, scatter/splatter, block text, box frames, shadow/depth, negative space
2. Draft in plain text first, then add ANSI color (dim for decoration, bold for focal, cyan accents, yellow sparingly, avoid red/green)
3. Test via `node -e` so the user sees it directly in their terminal
4. Provide the `console.log()` code snippet so the user can reuse it

**Constraints:** max 80 columns wide, max 25 lines tall, no emoji, always reset ANSI (`\x1b[0m`), readable without color, respect `NO_COLOR`.

## Step 3: Done

No iteration needed. If the user wants more control, point them to `/gsp-art`.
</process>
