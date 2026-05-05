# Skill change evaluation rubric

Seven dimensions. Each scored **PASS / CONCERNS / FAIL**. Score against the AFTER file using BEFORE and the parent SKILL.md as context.

**Order matters.** Intent achievement (Dimension 1) is scored FIRST — if the change didn't land its stated goal, the rest of the rubric is moot. Preservation dimensions (2-7) only matter if the intent was achieved.

## 1. Intent achievement

Did the change land its stated goal?

The orchestrator passes the change's stated intent (from commit message, PR description, or user input) to every evaluator. Examples of intent:

- "Trim file by 30-40%" → check actual delta vs target
- "Extract X to a sibling for reuse" → check sibling is created correctly and referenced from AFTER
- "Make agent more deterministic about Y" → check the new rule/cue actually constrains Y better than BEFORE
- "Fix bug where agent does Z" → check the AFTER would no longer reproduce Z given the same input

Score:
- **PASS** — intent achieved cleanly; no obvious gap between goal and result
- **CONCERNS** — intent partially achieved; specific gap (e.g., trim claimed -30%, actual -8%; or extraction left dangling references)
- **FAIL** — intent not achieved or change works against the stated goal

**Concerns flag:** delta below target, extraction incomplete, new rule still permits the bad behavior, side-effect changes that weren't part of the intent.

If intent is unclear or absent: report "Intent not provided — skipping Dimension 1, scoring 2-7 as defensive eval only."

## 2. Role + execution mode preservation

Does the agent still know what it is and when to apply different modes?

- `<role>` block intact — agent identity, persona, mandate
- Execution modes (e.g. revision, foundations vs screen vs component) still distinguishable
- Custom-input handling (references, fixes, brand context) preserved

**Concerns flag:** mode disambiguation softened, role drift, lost handling for an input the parent skill still passes.

## 3. Methodology completeness

Every numbered step / decision point / phase still present?

- Numbered steps (Step 0, Steps 1-N, Step 9, etc.) preserved in count and order
- Conditional branches (if-then logic) preserved
- Per-step inputs and outputs still specified

**Concerns flag:** a step removed, a conditional collapsed, an input/output left implicit.

## 4. Constraints + rules preservation

Are binding rules still binding?

- "Always" / "never" lists preserved
- Auto-fail conditions (e.g., "constraint violation = automatic Fail") still explicit
- Validation gates and quality bars unchanged
- Severity language (Critical, Important) still used consistently

**Concerns flag:** a constraint dropped, severity softened (must → should), validation gate weakened.

## 5. Output specification clarity

Can the agent still produce the expected deliverables without ambiguity?

- File names and paths specified
- Per-file content requirements clear
- Cross-references between deliverables intact
- INDEX.md / index file structure preserved
- Line targets, formatting hints, schema references all present

**Concerns flag:** a deliverable's structure became implicit, a path got vague, schema dropped without recoverable description.

## 6. Distilled references actionable

Compressed reference lists (HIG, anti-patterns, scoring rubrics) still cue the right behavior?

- Each compressed bullet still triggers a recognizable agent action
- Score-1 / Score-5 anchors paired (or both removed; never one without the other)
- Examples retained where they were the only signal for a category
- Pointers to full references (`Read references/X.md`) still valid paths

**Concerns flag:** asymmetric removal (kept fail cues, lost success cues), example removal that leaves a category unanchored, a pointer to a renamed/moved file.

## 7. Quality standards preservation

Explicit must-haves still present?

- Final-gate checklists (4 states, accessibility, responsive, etc.)
- Output quality bars (line targets, "every X needs Y" rules)
- Cross-cutting requirements (no Lorem Ipsum, real copy, etc.)

**Concerns flag:** a quality bar dropped silently, a checklist item lost.

---

## Verdict definitions

- **PASS** — All 7 dimensions PASS (or 6 PASS with Dimension 1 skipped due to no intent provided). The change is a net improvement; merge with confidence.
- **CONCERNS** — One or more dimensions flagged but with surgical restoration possible. Specify the exact text to restore (typically a single bullet, sentence, or rubric anchor). Recommendation: apply restoration, then merge.
- **FAIL** — Either Dimension 1 is FAIL (intent not achieved), OR substantive content lost that can't be quickly restored. Revert the affected section before merging. Note: FAIL is rare for Dimensions 2-7 — most "concerns" are restorable with a 1-2 line change. Dimension 1 FAIL means redesigning the change itself.

## Findings format

For each non-PASS dimension:

```
**Dimension N: {name}**
> Quoted BEFORE text that was lost
Recommendation: restore as `{exact text to insert}` after line `{landmark}` in AFTER, OR leave (substance was redundant with X), OR discuss (judgment call).
```

## Net assessment

One paragraph at the end of the report. Pattern: state the change's intent, whether it landed, and whether the agent's ability to do its job is preserved or improved. Be direct: "ship it", "ship after restoring X", "revert and redesign".
