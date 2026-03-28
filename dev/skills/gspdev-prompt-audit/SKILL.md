---
name: gspdev-prompt-audit
description: AI-driven semantic analysis of GSP skills and agents — finds dead weight, contradictions, vagueness, and over-prompting that automated checks can't catch.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
  - Agent
argument-hint: "[scope] e.g. 'all', 'skills', 'agents', or a specific name like 'gsp-designer'"
---

<context>
GSP has 38 skills and 15 agents. Over time, rules accumulate to fix individual bad outputs, creating contradiction, repetition, and vagueness that makes the AI *worse*, not better.

This skill performs semantic analysis that automated tests (P1–P7 in `audit-tests.sh`) can't catch. It evaluates meaning, not just structure.

Principle: "Your AI setup should be getting simpler over time — addition by subtraction."

Source layout:
- `gsp/skills/*/SKILL.md` — 38 skills
- `gsp/agents/gsp-*.md` — 15 agents
</context>

<objective>
Analyze prompt files for semantic quality issues and produce a report with specific cut/rewrite recommendations. Output to `dev/reports/prompt-audit.md`.
</objective>

<process>

## Step 1: Parse scope

`$ARGUMENTS` determines what to analyze:
- **`all`** or empty — analyze everything (skills → agents → cross-file)
- **`skills`** — skills only
- **`agents`** — agents only
- **specific name** (e.g. `gsp-designer`) — analyze that one file + its paired skill/agent

## Step 2: Run automated baseline first

```bash
bash dev/scripts/audit-tests.sh prompts
```

Note the warnings — they provide structural context for the semantic analysis.

## Step 3: Per-file semantic analysis

For each file in scope, read it fully and evaluate against these 5 criteria:

### 3a: Dead weight
Instructions the model already follows without being told. Examples:
- "Write clean, maintainable code" — Claude does this by default
- "Be helpful and thorough" — core model behavior
- "Follow best practices" — too vague to add value
- "Ensure high quality output" — the model always tries to

**Test:** Would removing this instruction change the output? If no → dead weight.

### 3b: Contradictions
Rules that conflict within the same file or between a skill and its spawned agent. Examples:
- "Be concise" + "Explain every decision in detail"
- "Use bullet points" + later requiring paragraph-format output
- Skill says "keep output under 100 lines" but agent says "be thorough and complete"

**Test:** Can the model satisfy both instructions simultaneously? If not → contradiction.

### 3c: One-off patches
Rules that read like they were added to fix one specific bad output rather than a general pattern. Signs:
- Very specific ("don't use the word 'leverage'")
- Negative framing without positive replacement ("don't do X" without "do Y instead")
- Oddly specific edge cases that rarely apply

**Test:** Does this rule improve >50% of outputs, or just prevent one past mistake? If the latter → one-off patch.

### 3d: Vagueness
Instructions so ambiguous the model would interpret them differently every run. Examples:
- "Use a natural tone" — natural to whom?
- "Be creative" — in what dimension?
- "Make it professional" — what does professional look like here?

**Test:** If 10 different Claude instances read this instruction, would they all do the same thing? If not → vague.

### 3e: Repetition
Instructions covered by:
- Another rule in the same file
- The spawned agent's own instructions (for skills)
- A shared reference file already loaded
- The system prompt already loaded by the agent

**Test:** Is this instruction the *only* place this guidance exists? If not → repetition.

## Step 4: Cross-file analysis

### 4a: Skill → Agent duplication
For each skill that spawns an agent, compare:
- The skill's instructions to the agent (context it passes)
- The agent's own definition (what it already knows)

Flag instructions that appear in both — the agent receives them twice.

### 4b: Global patterns
Look for instructions that appear across 3+ files with slight variations. These should either be:
- Consolidated into a shared reference
- Removed entirely if they're default model behavior

## Step 5: Generate report

Write the report to `dev/reports/prompt-audit.md` with this structure:

```markdown
# GSP Prompt Audit Report

Generated: {date}
Scope: {scope}
Automated baseline: {P1-P7 summary}

## Executive summary

- Files analyzed: X
- Total issues: Y
- Dead weight: A instances
- Contradictions: B instances
- One-off patches: C instances
- Vague directives: D instances
- Repetition: E instances

## Per-file findings

### {filename} ({lines} lines)

**Dead weight** (X items)
- Line ~N: "{instruction}" — {reason this is dead weight}

**Contradictions** (X items)
- "{instruction A}" contradicts "{instruction B}" — {explanation}

**One-off patches** (X items)
- Line ~N: "{instruction}" — {why this looks like a one-off fix}

**Vague directives** (X items)
- Line ~N: "{instruction}" — {why this is too vague to act on}

**Repetition** (X items)
- Line ~N: "{instruction}" — also in {other file(s)}

**Recommendation:** {cut X lines, rewrite Y lines, net reduction: Z lines}

---

{repeat for each file}

## Cross-file findings

### Skill → Agent duplication
{list of duplicated instructions between skill/agent pairs}

### Global patterns
{instructions repeated across 3+ files}

## Summary

| File | Lines | Dead | Contradict | One-off | Vague | Repeat | Cut |
|------|-------|------|-----------|---------|-------|--------|-----|
| ... | ... | ... | ... | ... | ... | ... | ... |

**Total potential reduction: X lines ({Y}% of corpus)**
```

## Step 6: Prioritize

After the report, highlight the top 5 highest-impact changes — files where cutting dead weight would most improve output quality. Consider:
1. Files used most frequently in the pipeline (gsp-start, gsp-project-build, gsp-designer)
2. Files with the most issues per line
3. Files where contradictions exist (these actively hurt output)

</process>

<rules>
- **Read-only analysis** — do NOT modify any skill, agent, or prompt files. Only write the report.
- **Be specific** — every finding must quote the exact instruction and explain why it's an issue.
- **No false positives** — if an instruction is genuinely useful and unique, don't flag it. Only flag what you'd actually recommend cutting.
- **Context matters** — an instruction that seems vague in isolation may be clear in the context of the full file. Read the full file before judging.
- **Line numbers are approximate** — use "~N" since exact lines may shift. The quoted text is the anchor.
</rules>
