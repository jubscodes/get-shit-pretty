# Skill change evaluation rubric

Eight dimensions. Each scored **PASS / CONCERNS / FAIL / N/A**. Score against the AFTER file using BEFORE (if any) and the parent SKILL.md as context.

**Applies to any change** — additions, modifications, refactors, trims, rewrites.

**For new files** (no BEFORE): score Dimensions 1-2 only. Mark Dimensions 3-8 as N/A — there's no prior state to regress against.

**Order matters.** Intent dimensions (1 + 2) are scored FIRST — they answer "is this change worth shipping at all?" Preservation dimensions (3-8) only matter if both intents are coherent.

Two distinct intents:
- **Change intent** (Dimension 1) — what THIS PR/commit was trying to do
- **Skill intent** (Dimension 2) — what the SKILL itself is supposed to do (per its frontmatter description + context + objective)

## 1. Change intent achievement

Did the change land its stated goal?

The orchestrator passes the change's stated intent (from PR description, commit message, or user input) to every evaluator. Examples:

- "Trim file by 30-40%" → check actual delta vs target
- "Extract X to a sibling for reuse" → check sibling is created correctly and referenced from AFTER
- "Make agent more deterministic about Y" → check the new rule/cue actually constrains Y better than BEFORE
- "Fix bug where agent does Z" → check AFTER would no longer reproduce Z given the same input

Score:
- **PASS** — intent achieved cleanly; no obvious gap between goal and result
- **CONCERNS** — intent partially achieved; specific gap (e.g., trim claimed -30%, actual -8%; or extraction left dangling references)
- **FAIL** — intent not achieved or change works against the stated goal

**Concerns flag:** delta below target, extraction incomplete, new rule still permits the bad behavior, side-effect changes that weren't part of the intent.

If intent is unclear or absent: report "Change intent not provided — skipping Dimension 1, scoring 2-8 as defensive eval only."

## 2. Skill intent coherence

Does the skill body (and any modified methodology/sibling) still deliver on what the SKILL.md frontmatter `description:` + `<context>` + `<objective>` promise?

This is a **drift check** — separate from change intent. A change can land its goal (Dim 1 = PASS) but still drift the skill away from its stated purpose (Dim 2 = FAIL). Example: a perf trim that achieves -34% lines but accidentally drops a step that the description promised the skill performs.

### Method

**Step A — extract the skill's intent.** Read SKILL.md (parent or self):
- `description:` (frontmatter) — one-line statement of purpose
- `<context>` block — extended purpose, when to use, integration with pipeline
- `<objective>` block — input → output contract, agent responsibilities

Compose a one-sentence **skill intent statement** from these.

**Step B — check coherence in AFTER.**
- Does the AFTER file (or AFTER methodology + parent SKILL.md as a pair) deliver on the skill intent statement?
- If the file under eval IS the SKILL.md itself: did the description/context/objective change? If yes, was the change intentional and does it match the body change? If no, did the body drift from the unchanged description?
- If the file is methodology/sibling: parent SKILL.md description is unchanged — does the modified methodology still implement what the description promises?

**Step C — check for drift across BEFORE → AFTER.**
- BEFORE: was the skill already coherent? (If not, the issue predates the change — note it but don't blame the change.)
- AFTER: did this change improve, preserve, or degrade coherence?

Score:
- **PASS** — AFTER body delivers on the skill intent; description/context/objective unchanged or coherently updated
- **CONCERNS** — minor drift (e.g., description mentions a feature the body now treats as optional, or vice versa)
- **FAIL** — significant drift (description promises X, body now does Y; or description was edited without matching body changes)

**Concerns flag:** description references a removed step; body adds a major behavior absent from description; objective output contract no longer matches what AFTER produces; trigger phrases in description no longer match when the skill should fire.

## 3. Role + execution mode preservation

## 2. Role + execution mode preservation

Does the agent still know what it is and when to apply different modes?

- `<role>` block intact — agent identity, persona, mandate
- Execution modes (e.g. revision, foundations vs screen vs component) still distinguishable
- Custom-input handling (references, fixes, brand context) preserved

**Concerns flag:** mode disambiguation softened, role drift, lost handling for an input the parent skill still passes.

## 4. Methodology completeness

Every numbered step / decision point / phase still present?

- Numbered steps (Step 0, Steps 1-N, Step 9, etc.) preserved in count and order
- Conditional branches (if-then logic) preserved
- Per-step inputs and outputs still specified

**Concerns flag:** a step removed, a conditional collapsed, an input/output left implicit.

## 5. Constraints + rules preservation

Are binding rules still binding?

- "Always" / "never" lists preserved
- Auto-fail conditions (e.g., "constraint violation = automatic Fail") still explicit
- Validation gates and quality bars unchanged
- Severity language (Critical, Important) still used consistently

**Concerns flag:** a constraint dropped, severity softened (must → should), validation gate weakened.

## 6. Output specification clarity

Can the agent still produce the expected deliverables without ambiguity?

- File names and paths specified
- Per-file content requirements clear
- Cross-references between deliverables intact
- INDEX.md / index file structure preserved
- Line targets, formatting hints, schema references all present

**Concerns flag:** a deliverable's structure became implicit, a path got vague, schema dropped without recoverable description.

## 7. Distilled references actionable

Compressed reference lists (HIG, anti-patterns, scoring rubrics) still cue the right behavior?

- Each compressed bullet still triggers a recognizable agent action
- Score-1 / Score-5 anchors paired (or both removed; never one without the other)
- Examples retained where they were the only signal for a category
- Pointers to full references (`Read references/X.md`) still valid paths

**Concerns flag:** asymmetric removal (kept fail cues, lost success cues), example removal that leaves a category unanchored, a pointer to a renamed/moved file.

## 8. Quality standards preservation

Explicit must-haves still present?

- Final-gate checklists (4 states, accessibility, responsive, etc.)
- Output quality bars (line targets, "every X needs Y" rules)
- Cross-cutting requirements (no Lorem Ipsum, real copy, etc.)

**Concerns flag:** a quality bar dropped silently, a checklist item lost.

---

## Verdict definitions

- **PASS** — All 8 dimensions PASS (or 7 PASS with Dimension 1 skipped due to no change intent provided). The change is a net improvement; merge with confidence.
- **CONCERNS** — One or more dimensions flagged but with surgical restoration possible. Specify the exact text to restore (typically a single bullet, sentence, or rubric anchor). Recommendation: apply restoration, then merge.
- **FAIL** — Either Dimension 1 is FAIL (change intent not achieved), Dimension 2 is FAIL (skill drifted from its stated purpose), OR substantive content lost in 3-8 that can't be quickly restored. Revert the affected section before merging.

**Distinct FAIL semantics:**
- Dim 1 FAIL → redesign the change itself (intent unmet)
- Dim 2 FAIL → align skill description ↔ body (either revert body or update description coherently)
- Dims 3-8 FAIL → revert the cut that lost substance

Most concerns are restorable with a 1-2 line change. FAIL is rare and consequential.

## Findings format

For each non-PASS dimension:

```
**Dimension N: {name}**
> Quoted BEFORE text that was lost
Recommendation: restore as `{exact text to insert}` after line `{landmark}` in AFTER, OR leave (substance was redundant with X), OR discuss (judgment call).
```

## Net assessment

One paragraph at the end of the report. Pattern: state the change's intent, whether it landed, and whether the agent's ability to do its job is preserved or improved. Be direct: "ship it", "ship after restoring X", "revert and redesign".
