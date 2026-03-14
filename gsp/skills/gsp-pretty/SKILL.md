---
name: pretty
description: "Surprise ASCII art in the terminal"
disable-model-invocation: true
allowed-tools:
  - Read
  - Bash
  - Agent
---
<context>
Easter egg command. Instantly renders a surprise piece of ASCII/Unicode terminal art. Context-aware — riffs on what the user is working on.

Not part of the main design pipeline. Just for fun.
</context>

<objective>
Surprise the user with a piece of terminal art that's relevant to their current context.

**Input:** None explicit — you gather context yourself
**Output:** Rendered art in the terminal
**Agent:** `gsp-ascii-artist`
</objective>

<process>
## Step 1: Gather context clues

Before spawning the artist, quickly gather signal about what the user is working on. Check 2-3 of these (pick whichever are most likely to yield something interesting):

- `git log --oneline -5` — recent commit messages
- The project's `package.json` name/description, or `README.md` first lines
- `git diff --stat` — what files are being touched right now
- The current branch name
- The current date/time and day of week

Don't overthink it — spend 10 seconds gathering, not 10 minutes. You just need a seed for the artist.

## Step 2: Create surprise art

Spawn the `gsp-ascii-artist` agent with this prompt, filling in the context you found:

> Freestyle a single piece of terminal art. Medium size (5-15 lines). Render it via `node -e` so the user sees it directly in their terminal.
>
> **Context from the user's session:**
> [INSERT 2-3 bullet points of what you found — project name, recent work, current date, etc.]
>
> **Direction:** Use that context as inspiration, not as a label. Do NOT make art about GSP, branding, or the tool itself. Be witty, culturally aware, and open-minded. The art should feel like a clever aside from someone who's been watching what you're building — not a logo for it.
>
> Some vibes to riff on (pick one or invent your own):
> - A tiny scene with a punchline (visual wit)
> - A metaphor for what the user is working on right now
> - Something seasonal or timely for today's date
> - A tribute to a classic (art, music, film, code) that connects to the context
> - An abstract mood piece — rain, neon, space, dawn
> - A visual one-liner that makes someone smile
> - Something completely unexpected
>
> IMPORTANT: Only create ONE piece. Render it with `node -e` so it displays in the terminal. Then return the console.log() code snippet so the user can reuse it.

## Step 3: Done

No iteration needed. If the user wants more control, point them to `/gsp:art`.
</process>
