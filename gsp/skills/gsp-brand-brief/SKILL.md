---
name: gsp-brand-brief
description: Define your brand — who, why, and what it should feel like — use when: create a brand, define our brand identity, who are we, what's our brand
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
---
<context>
Phase 0 of the GSP branding diamond. Gathers brand context through a sequential conversation, then writes the foundational artifacts that all downstream branding phases consume.

Works two ways:
1. **Routed** — `/gsp-start` detects "new brand" intent and invokes this skill
2. **Direct** — user runs `/gsp-brand-brief` directly

This skill handles **new brands only**. For existing brands (evolve mode), `/gsp-start` routes to `/gsp-brand-audit` directly.
</context>

<objective>
Through a sequential one-question-at-a-time conversation, gather brand context and write foundational artifacts.

**Input:** Brand name (from args or asked)
**Output:** `.design/branding/{name}/` with BRIEF.md, STATE.md, config.json, ROADMAP.md
**Next:** `/gsp-brand-research`
</objective>

<rules>
- Always use `AskUserQuestion` for user-facing questions — never raw text prompts.
- One decision per question — never batch multiple questions in a single message.
- Never infer the user's name from package metadata, git config, or file paths — those are authors, not the current user.
</rules>

<questioning_principles>
**One decision per question.** Every question must be its own `AskUserQuestion` call. Ask one thing, wait for the answer, use it to inform the next question.

**Never re-ask what the user already answered.** If you need to validate, confirm: "I see X from earlier — still accurate?"

**Inference over interrogation.** Don't ask what you can infer. "Fintech for Gen Z" → mobile-first, modern, trustworthy. State inferences, let them correct.

**Concrete options over open-ended.** "More like Stripe's clean approach or Duolingo's playful style?" beats "What style do you want?" Use `AskUserQuestion` with 2-3 options when the option space is known.

**Adapt and skip.** If an early answer reveals enough, skip later questions. Follow up on surprises before moving on. The sequence is a guide, not a script.

**Know when you have enough.** A brand brief is complete when you can answer:
- [ ] Who is this for and what do they need?
- [ ] What does the brand feel like?
- [ ] What are the hard constraints?
</questioning_principles>

<process>
## Step 1: Resolve context and create structure

Check if a brand name was passed via invocation args. If not, ask:

1. Ask for brand name (kebab-case, e.g., "acme-corp") — `AskUserQuestion`

Validate: lowercase alphanumeric + hyphens only. Check `.design/branding/{name}/` doesn't already exist. If it does, use `AskUserQuestion`: **Overwrite** / **Pick a different name**.

Accept an optional `e2e` flag from the invoking skill. Default to `false`.

Create directory structure:
```bash
mkdir -p .design/branding/{name}/{discover,strategy,identity,patterns}
```

## Step 2: Business & People

Sequential `AskUserQuestion` calls. Ask one, wait, adapt, ask the next. Skip anything you can already infer.

2. What's the company name, and what industry/stage? (open-ended `AskUserQuestion`)
3. What problem does it solve, and for whom? (open-ended — use the answer to start inferring persona)
4. What's the business model? (use `AskUserQuestion` with options if you can infer likely models from industry, otherwise open-ended)
5. Who are the main competitors? (2-3 names — open-ended)
6. Present an inferred primary persona — a concrete profile (name, role, frustration, aspiration) based on answers so far. Personas should feel like real people — dig into the emotional layer. Use `AskUserQuestion`: **Looks right** / **Adjust** / **Add a secondary persona**

## Step 3: Brand Essence

Before presenting personality options, **internally synthesize** promise (what should someone feel?) and point of view (what does this brand disagree with?) from prior answers. Don't ask these directly — use them to ground personality options.

7. Brand personality direction — use `AskUserQuestion` with 2-3 concrete personality directions. **Each option must explain WHY it fits this brand's audience and problem** — not just a style label:
    - Each option: **Label** (3 adjectives) / **Description** (why this personality fits their specific audience and competitive position — reference the persona by name, the problem, or the gap) / **Preview** (example sentence in that voice, using their product context)
    - **Surprise me** — craft an unexpected direction inspired by the user's industry and personas
    - Note: this is a high-level direction only. Brand strategy phase will deepen this into archetype + voice — don't over-refine here.
8. What should the brand NEVER feel like? (use `AskUserQuestion` with 2-3 anti-directions inferred from their personality pick, plus open-ended option)
9. Brands admired or styles to avoid? (open-ended `AskUserQuestion`)
10. Visual direction — raw aesthetic feeling. Use `AskUserQuestion` (open-ended):
    > "What should it look and feel like visually? You can share image or website links, describe a mood ('editorial and dark', 'warm brutalist', 'cinematographic with beautiful stills'), drop adjective clusters ('rounded, clean, airy'), or even describe a scene or texture. The weirder and more specific the better — this is what prevents a bland brand."
    - Synthesize the answer into a `visual_direction` block in the brief: mood words, reference aesthetics, texture/atmosphere descriptors, any specific anti-patterns (e.g., "never stock-photo corporate"). This block directly informs color, typography, and imagery choices downstream.

## Step 4: Constraints & confirmation

11. Any non-negotiables or constraints? (timeline, budget, must-haves) — open-ended `AskUserQuestion`
12. State your understanding back — but lead with *feeling*, not facts. Format:

    > "Here's what I'm hearing: [2-sentence factual summary].
    > The feeling this brand should leave: **[emotional compass — one evocative sentence capturing the brand's energy, not its category]**."

    The emotional compass is the hardest line to write and the most important. It should make the user feel something when they read it. Not "a fintech tool that simplifies investing" but "the brand that makes financial confidence feel earned, not given." Synthesize it from the personality direction, the persona aspiration, the brand POV, and the visual direction. It should be specific enough to be wrong — vague sentences aren't compasses.

    Use `AskUserQuestion`:
    - **Looks good** — "That's accurate, let's go"
    - **Adjust the feeling** — "The compass is off — let me reframe it"
    - **Adjust something else** — "Facts are right but I want to change something"

If "Adjust" — ask what to change, update your understanding, re-confirm. Don't re-ask everything.

## Step 5: Write artifacts and register brand

Read templates at write time from `${CLAUDE_SKILL_DIR}/../../templates/branding/` and write:

1. `.design/branding/{name}/BRIEF.md` from `brief.md` template
   - Populate all sections from conversation answers
   - Synthesize brand promise, POV, and personality (these are inferred, not asked directly)
   - Write the confirmed emotional compass as `brand_heartbeat` in the Emotional Compass section
   - Set `brand_mode` to `new`
   - Set evolve-only sections (Existing Brand State, Evolution Scope) to "N/A — new brand"

2. `.design/branding/{name}/STATE.md` from `state.md` template
   - Phase 0 (Audit): `skipped`
   - All other phases: `pending`

3. `.design/branding/{name}/config.json` from `config.json` template
   - Set `brand.name`, `brand.created` (ISO date)
   - Set `brand_mode: "new"`
   - Set `e2e` flag from Step 1

4. `.design/branding/{name}/ROADMAP.md` from `roadmap.md` template

5. Write/update `.design/CLAUDE.md` — register the brand as started. If the file doesn't exist, read `${CLAUDE_SKILL_DIR}/../../templates/design-claude.md` first. Append under `## Brands`:

```markdown
### {brand-name} · in progress · {DATE}
"{brand_heartbeat}"
next: gsp-brand-research · .design/branding/{brand-name}/
```

## Step 6: Route

Use `AskUserQuestion` — always offer Continue / Stop here / What happens next:

- **Continue to research** — "Start market and competitor research" → invoke `/gsp-brand-research` via Skill tool
- **Stop here** — "I'll come back later" → confirm files are saved, show how to resume with `/gsp-start`
- **What happens next?** — "Explain the research phase" → explain what brand-research does (market landscape, competitive audit, trend analysis, mood board direction) and how it uses the brief

If `e2e: true`, mention that after the full branding diamond completes, it will auto-transition to project setup.

## Step 7: e2e transition (only when `e2e: true` and branding diamond is complete)

After all four brand phases complete (brand-research → brand-strategy → brand-identity → brand-guidelines), scaffold the project directory before invoking `/gsp-project-brief`:

1. Derive `{project-slug}` from the brand name: lowercase, spaces and underscores replaced with hyphens.

2. Create the project directory:
```bash
mkdir -p .design/projects/{project-slug}/
```

3. Read templates at write time from `${CLAUDE_SKILL_DIR}/../../templates/projects/` and write:
   - `.design/projects/{project-slug}/config.json` from `config.json` template — set `project.name` (title-cased from project-slug) and `project.created` (ISO date)
   - `.design/projects/{project-slug}/STATE.md` from `state.md` template — fill in project name and brand name

4. Write `.design/projects/{project-slug}/brand.ref` containing the brand directory name (e.g. `{brand-name}`), so the project knows which brand it belongs to.

5. Display:
```
  brand complete — {brand-name}
  now let's scope your project.
```

6. Invoke `/gsp-project-brief` via Skill tool, passing `{project-slug}` so Step 0 resolves the existing directory rather than prompting for one.
</process>
