# Skill change evaluation rubric

Six dimensions. Each scored **PASS / CONCERNS / FAIL**. Score against the AFTER file using BEFORE and the parent SKILL.md as context.

## 1. Role + execution mode preservation

Does the agent still know what it is and when to apply different modes?

- `<role>` block intact — agent identity, persona, mandate
- Execution modes (e.g. revision, foundations vs screen vs component) still distinguishable
- Custom-input handling (references, fixes, brand context) preserved

**Concerns flag:** mode disambiguation softened, role drift, lost handling for an input the parent skill still passes.

## 2. Methodology completeness

Every numbered step / decision point / phase still present?

- Numbered steps (Step 0, Steps 1-N, Step 9, etc.) preserved in count and order
- Conditional branches (if-then logic) preserved
- Per-step inputs and outputs still specified

**Concerns flag:** a step removed, a conditional collapsed, an input/output left implicit.

## 3. Constraints + rules preservation

Are binding rules still binding?

- "Always" / "never" lists preserved
- Auto-fail conditions (e.g., "constraint violation = automatic Fail") still explicit
- Validation gates and quality bars unchanged
- Severity language (Critical, Important) still used consistently

**Concerns flag:** a constraint dropped, severity softened (must → should), validation gate weakened.

## 4. Output specification clarity

Can the agent still produce the expected deliverables without ambiguity?

- File names and paths specified
- Per-file content requirements clear
- Cross-references between deliverables intact
- INDEX.md / index file structure preserved
- Line targets, formatting hints, schema references all present

**Concerns flag:** a deliverable's structure became implicit, a path got vague, schema dropped without recoverable description.

## 5. Distilled references actionable

Compressed reference lists (HIG, anti-patterns, scoring rubrics) still cue the right behavior?

- Each compressed bullet still triggers a recognizable agent action
- Score-1 / Score-5 anchors paired (or both removed; never one without the other)
- Examples retained where they were the only signal for a category
- Pointers to full references (`Read references/X.md`) still valid paths

**Concerns flag:** asymmetric removal (kept fail cues, lost success cues), example removal that leaves a category unanchored, a pointer to a renamed/moved file.

## 6. Quality standards preservation

Explicit must-haves still present?

- Final-gate checklists (4 states, accessibility, responsive, etc.)
- Output quality bars (line targets, "every X needs Y" rules)
- Cross-cutting requirements (no Lorem Ipsum, real copy, etc.)

**Concerns flag:** a quality bar dropped silently, a checklist item lost.

---

## Verdict definitions

- **PASS** — All 6 dimensions PASS. The change is a net improvement; merge with confidence.
- **CONCERNS** — One or more dimensions flagged but with surgical restoration possible. Specify the exact text to restore (typically a single bullet, sentence, or rubric anchor). Recommendation: apply restoration, then merge.
- **FAIL** — Substantive content lost that can't be quickly restored. Revert the affected section before merging. Note: FAIL is rare — most "concerns" are restorable with a 1-2 line change.

## Findings format

For each non-PASS dimension:

```
**Dimension N: {name}**
> Quoted BEFORE text that was lost
Recommendation: restore as `{exact text to insert}` after line `{landmark}` in AFTER, OR leave (substance was redundant with X), OR discuss (judgment call).
```

## Net assessment

One paragraph at the end of the report. Pattern: state the change's intent, whether it landed, and whether the agent's ability to do its job is preserved or improved. Be direct: "ship it", "ship after restoring X", "revert and redesign".
