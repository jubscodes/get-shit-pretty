# Output modes policy

Single source of truth for **project-pipeline** output adaptation. Pipeline skills and agent methodologies cite this file instead of duplicating rules.

**Scope:** This policy applies to the **project pipeline only** — `gsp-project-brief`, `gsp-project-research`, `gsp-project-design`, `gsp-project-critique`, `gsp-project-build`, `gsp-project-review`. The **brand pipeline always runs at full fidelity** (brand outputs are reused across many projects; the brand is the foundation, not the variable).

**Read by:** project-pipeline skills, project-pipeline agent methodologies, `scripts/check-artifact-size.sh` (SubagentStop hook).

---

## Three modes

| Mode | Persistence | When to use |
|---|---|---|
| `chat` | Phase brief returned in conversation. Only `STATE.md` updated. No phase chunks land on disk. | One-off questions, exploration, brainstorming a feature shape. User has not committed to building. |
| `compact` *(default)* | One file per phase (`{phase}/PHASE.md`) with H2 sections matching the chunk vocabulary. | Focused refactors, single-component features, small new screens. The 80% case. |
| `full` | Today's chunk-per-axis structure (5–13 files per phase). | New multi-screen app, brand-defining work, large pivots, anything where pivot-resilience matters. |

**Default for new projects:** `compact`. Declared at `/gsp-start` and stored in `config.json` `preferences.project_size`.

---

## Per-phase output by mode

The chunk *vocabulary* is preserved across all modes — only the **file partitioning** changes. A designer reading any mode sees the same H2 headers (Personas, IA, Component Spec, Microcopy, Accessibility, Visual Design, UX Flows, Responsive, Micro-interactions).

### Brief

| Mode | Files | Sections |
|---|---|---|
| `chat` | none (brief lives in conversation) | scope, target adaptations, install manifest, gap analysis, file references |
| `compact` | `brief/PHASE.md` (≤300 lines) | same H2 sections |
| `full` | 5 files: `scope.md`, `target-adaptations.md`, `install-manifest.md`, `gap-analysis.md`, `file-references.md` + `INDEX.md` | one file per concern |

### Research

| Mode | Files | Sections |
|---|---|---|
| `chat` | none | recommendations only, returned to chat |
| `compact` | `research/PHASE.md` (≤400 lines) | UX patterns, competitor UX, technical research, accessibility patterns, content strategy, reference specs, recommendations |
| `full` | 7 files + INDEX | one per concern |

### Design

| Mode | Files | Sections |
|---|---|---|
| `chat` | none | high-level shape returned to chat |
| `compact` | `design/PHASE.md` per screen + `design/SHARED.md` | per-screen H2s for component-spec, visual-design, ux-flows, microcopy, accessibility; shared = personas, IA, nav, micro-interactions, responsive, component-plan |
| `full` | `screen-NN-name.md` × N + `shared/` folder (6 files) + INDEX | today's structure |

### Critique

| Mode | Files | Sections |
|---|---|---|
| `chat` | none | top-3 blockers + verdict to chat |
| `compact` | `critique/PHASE.md` (≤300 lines) | critique + heuristics score, prioritized fixes, strengths, alternative directions, accessibility audit, accessibility fixes |
| `full` | 6 files + INDEX | today's structure |

### Build

Build phase persists code, not planning. Mode affects only the **build log** verbosity:

| Mode | Build logs |
|---|---|
| `chat` | summary log only |
| `compact` | one `build/BUILD-LOG.md` consolidated across foundations/components/screens |
| `full` | per-execution log (today: foundations.md, component-*.md, screen-*.md) |

### Review

| Mode | Files | Sections |
|---|---|---|
| `chat` | verdict + top issues to chat | n/a |
| `compact` | `review/PHASE.md` | acceptance report + issues |
| `full` | acceptance-report.md, issues.md, INDEX | today |

---

## Skip-if-not-present doctrine

**Applies in all modes.** Empty sections pollute the artifact. If a section has no real content for this project, omit it — do not pad to look thorough.

Examples of legitimate skips:

| Section | Skip when |
|---|---|
| `competitor-ux` | scope is a refactor of existing code — no competitors to study |
| `personas` | scope is a developer-tool feature where personas are flat ("the developer using this") |
| `responsive` | feature is desktop-only or platform-fixed |
| `microcopy` | feature has no user-facing strings |
| `accessibility-audit` | scope is non-UI (e.g., build configuration, infra) |
| `alternative-directions` | scope is constrained by an external decision the user already locked |
| `reference-specs` | scope is internal — no external references add signal |

**Hard rule:** if a chunk would have fewer than ~20 lines of unique, project-specific content, omit it entirely. Do not write `_Nothing meaningful for this project._` — just leave it out and let `INDEX.md` (full mode) or section absence (compact mode) tell the reader.

Cite this rule by name: **"skip-if-not-present per policies/output-modes.md."**

---

## Mode is the user's choice, declared once

- **Declared at:** `/gsp-start` (or directly editable in `config.json`)
- **Field:** `preferences.project_size` ∈ `"chat" | "compact" | "full"`
- **Default:** `compact`
- **No auto-detection.** Briefs precede screen enumeration; heuristic detection at brief-time is structurally unreliable (per #211 verification). User-declared is the only honest answer.

### Upgrading mid-pipeline

If the user pivots from a focused refactor into a larger scope mid-pipeline, they can:

1. Edit `config.json` to upgrade `project_size`
2. Re-run the phase that needs expansion — the agent will re-emit at the new mode
3. Existing compact-mode `PHASE.md` files are preserved as the synthesis input

A future `/gsp-resize` skill may automate step 2; not required for v1.

---

## Interaction with existing scope axes

The project config carries several orthogonal scope axes already. `project_size` is a fourth, and its interaction is defined here:

| Axis | Values | Interaction with `project_size` |
|---|---|---|
| `design_scope` | `tokens`, `partial`, `full` | Orthogonal. `tokens` skips brief/research/design regardless of size. `partial` and `full` honor size mode. |
| `implementation_target` | `code`, `figma` | Orthogonal. Figma builds inherit the mode for the design phase output. |
| `codebase_type` | `greenfield`, `existing` | Soft signal only. A greenfield project at `compact` mode still gets the compact structure — but the user should consider `full` for greenfield since pivot-resilience matters more there. |
| `repo_type` | `single`, `monorepo` | Orthogonal. |

**Conflict resolution:** if a higher-level gate (e.g., `design_scope: tokens`) bypasses a phase, `project_size` has no effect on that phase. Explicit gates always win.

---

## Enforcement

Prompt-level guidance alone is unreliable — agents have historically padded chunks despite "skip if irrelevant" guidance (per #211 issue body).

Therefore: a **`SubagentStop` hook** (`scripts/check-artifact-size.sh`) runs after each project-pipeline agent completes. The hook:

1. Reads `project_size` from `.design/projects/{slug}/config.json` (or fallback to `preferences.project_size` in the parent config)
2. Counts files emitted in the relevant phase directory
3. Compares against the mode's budget (see per-phase table above)
4. If over budget: blocks completion, requires the agent to consolidate

The hook is the only reliable enforcement layer. Skill body + agent methodology + this policy provide the contract; the hook enforces it.

---

## What this policy does **not** cover

- **Brand pipeline** — always full fidelity. See `gsp/skills/gsp-brand-guidelines/` for the brand artifact contract.
- **Expertise skill outputs** (`gsp-style`, `gsp-color`, `gsp-typography`, etc.) — these are knowledge-owner skills, not pipeline phases. Their outputs are not mode-adaptive.
- **The `.design/CLAUDE.md` registry** — unchanged.
- **Token volume of agent **inputs**** — this policy targets durable artifacts on disk, not agent prompt size. See `dev/scripts/token-budget.sh` for input-side budgeting.

---

## Issue link

This policy was authored for issue [#211](https://github.com/jubscodes/get-shit-pretty/issues/211) — *"perf: planning theater — chunk-per-axis design produces 7-8× planning-to-code ratio on focused projects."*
