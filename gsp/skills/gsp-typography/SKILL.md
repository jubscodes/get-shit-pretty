---
name: gsp-typography
description: "Design type systems — scale, pairing, fluid type, vertical rhythm"
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
  - Grep
  - WebSearch
---
<context>
Typography skill — thin router. Domain expertise lives in `domains/` files, reference material in `references/`.

This is a standalone composable skill. It works two ways:
1. **Standalone** — user runs `/gsp-typography` directly for type scale generation, font pairing, or full system design
2. **As a building block** — the creative-director invokes `/gsp-typography --enrich` to add technical precision to creative typeface choices

Visual companion: https://typescale.com/ — users can preview ratios interactively there, then feed the values here.
</context>

<objective>
Build a production-ready typography system — scale, pairing, fluid type, vertical rhythm, and font loading strategy.

**Input:** Font families + ratio, `--enrich`, `--list-ratios`, `--preview`, `--from-style`, or interactive
**Output:** `typography.md` foundation chunk + CSS file (Tailwind or vanilla)
**Agent:** None — inline skill, mathematical scale generation
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- All sizes include px, rem, AND fluid clamp() values for headings
- CSS output defaults to Tailwind v4 / shadcn format unless `--vanilla` is passed
- Foundation chunks follow `chunk-format.md` format exactly
</rules>

<process>
## Step 0: Parse mode

| Input | Mode | Domain |
|-------|------|--------|
| `"Inter" --ratio 1.25` | Direct scale | `domains/scale.md` |
| `--from-style cyberpunk` | From style preset | `domains/scale.md` |
| `--list-ratios` | List ratios | `domains/scale.md` |
| `--preview "Inter" --ratio 1.25` | Preview scale | `domains/scale.md` |
| `--enrich` | Enrich existing typography | `domains/pairing.md` |
| *(no args)* | Interactive full system | `domains/system.md` |

## Step 1: Load domain

Read the domain file from `${CLAUDE_SKILL_DIR}/domains/{domain}.md`.

For scale modes, also read `${CLAUDE_SKILL_DIR}/references/typography-scales.md`.

## Step 2: Follow domain framework

Execute the loaded domain's workflow. The domain file contains all rules, formulas, tables, and output specifications.

## Step 3: Write output

Write `typography.md` + optional CSS file to the resolved output path. Display scale summary and offer next steps.
</process>
