---
name: gsp-visuals
description: "Define visual direction — imagery, 3D, video, textures, and surface treatments"
user-invocable: true
allowed-tools:
  - Read
  - Write
  - AskUserQuestion
  - Glob
  - Grep
  - WebSearch
---
<context>
Composable visual direction skill. Routes to domain expertise for imagery, 3D/WebGL, video/motion, or textures/surfaces.
</context>

<objective>
Define visual direction for a specific domain. Reads the domain framework from `domains/` and follows it.

**Input:** Domain flag (`--imagery`, `--3d`, `--video`, `--textures`) + optional `--enrich`
**Output:** Domain-specific chunk file
**Agent:** None — inline skill with structured questioning
</objective>

<execution_context>
@${CLAUDE_SKILL_DIR}/chunk-format.md
</execution_context>

<rules>
- Always use `AskUserQuestion` for user interaction — never prompt via plain text
- One decision per question — never batch multiple questions in a single message
- Route to exactly one domain per invocation
</rules>

<process>
## Step 0: Parse flags

Map invocation to domain file:
| Flag | Domain file |
|------|-------------|
| `--imagery` | `imagery.md` |
| `--3d` | `3d.md` |
| `--video` | `video.md` |
| `--textures` | `textures.md` |

Check for `--enrich` flag (passes through to domain workflow).

## Step 1: Pick domain (if no flag)

If no domain flag was provided, use `AskUserQuestion`:
- **Imagery** — "photography, illustration, iconography, image treatments"
- **3D / WebGL** — "render style, materials, lighting, interactive scenes"
- **Video / Motion** — "editing style, pacing, transitions, motion graphics"
- **Textures / Surfaces** — "patterns, grain, gradients, background CSS recipes"

## Step 2: Resolve brand/project context

Check what's available:
1. **Within a brand** — read `{BRAND_PATH}/BRIEF.md`, `{BRAND_PATH}/strategy/archetype.md`, `{BRAND_PATH}/identity/color-system.md` if they exist. Use brand personality to drive direction.
2. **Within a project** — read `{PROJECT_PATH}/brand.ref` -> resolve brand -> load above.
3. **Standalone** — no brand context. The domain's interactive mode will gather input.

Resolve `{BRAND_PATH}` and `{PROJECT_PATH}` by checking for `.design/` in the workspace via Glob.

## Step 3: Load domain and execute

Read `${CLAUDE_SKILL_DIR}/domains/{domain}.md` and follow its complete framework:
- If `--enrich`: follow the domain's enrich-mode workflow
- Otherwise: follow the domain's interactive-mode questions, then its direction framework

## Step 4: Write output and complete

Resolve output path from domain file's **Output filename**:
- Within a brand: `{BRAND_PATH}/identity/{filename}`
- Within a project: `{PROJECT_PATH}/references/{filename}`
- Standalone: display output, offer to save

Write chunk following `chunk-format.md` format. Update STATE.md if it exists.

Display the domain's completion summary, then show its completion options via `AskUserQuestion`.
</process>
