# GSP Prompt Audit Report

Generated: 2026-03-23
Scope: all (27 skills, 14 agents, 12 prompts)
Automated baseline: 4 PASS, 3 WARN, 0 FAIL (P1: 6 files over line budget; P4: 10 cross-file duplicate patterns; P7: 2 agents with vague directives)

## Executive summary

- Files analyzed: 53
- Total issues: 78
- Dead weight: 12 instances
- Contradictions: 3 instances
- One-off patches: 4 instances
- Vague directives: 8 instances
- Repetition: 51 instances

The largest category by far is **repetition** — the same instructions appearing in skills, their spawned agents, and the system prompts those agents reference. This triples context consumption without improving output. The second issue is **dead weight** in the form of "Quality Standards" sections on agents that largely restate what the methodology already implies.

---

## Per-file findings

### gsp-typescale/SKILL.md (651 lines)

**Dead weight** (2 items)
- Line ~43: "Scales are deterministic — same inputs always produce the same output" — Mathematical computation is inherently deterministic. This adds nothing.
- Line ~46: "When loading from a style preset, extract only typography-related tokens" — The skill's process steps already specify exactly what to extract. This rule restates the process.

**One-off patches** (1 item)
- Line ~45: "Fluid type clamp() must always use rem-based min/max — never pure vw (breaks zoom per WCAG 1.4.4)" — Useful but oddly specific for a rules section. Better as an inline note in Step 3.5 where clamp() is actually calculated.

**Vague directives** (0 items)

**Repetition** (3 items)
- Lines ~293-420: The entire `typography.md` output template (~130 lines of markdown scaffolding with placeholder values) is embedded inline. This is documentation format, not instruction. The chunk-format.md reference already specifies the format. The agent would produce correct output from the table in Step 3 + the format reference.
- Lines ~423-558: The entire `tailwind.typography.css` output template (~135 lines) is embedded. Same issue — this is a template, not an instruction. The agent knows CSS and Tailwind syntax.
- Lines ~560-621: The entire `typescale.css` vanilla output template (~60 lines). Same.

**Recommendation:** Cut ~325 lines of output templates. Replace with brief output specs (5-10 lines each describing what the file should contain, referencing Step 3's calculated values). Net reduction: ~300 lines.

---

### gsp-style/SKILL.md (544 lines)

**Dead weight** (1 item)
- Line ~40: "Presets are the source of truth — expand tokens deterministically, don't improvise values" — The process already says to read YAML presets and expand them. "Don't improvise" is default behavior when a data source is specified.

**Repetition** (4 items)
- Lines ~226-443: The entire W3C token expansion templates (~220 lines of JSON scaffolding). Every JSON structure is fully specified with placeholder interpolation. The design-tokens.md reference already defines the W3C format. The skill could specify the mapping table (preset key -> W3C path) in ~30 lines instead.
- Lines ~60-127: The `--list` output template (~70 lines of ASCII display format). This is a formatting template that could be generated from INDEX.yml data without prescribing exact ASCII layout.
- Line ~41: "Foundation chunks follow `references/chunk-format.md` format exactly" — also stated in the execution_context which already loads chunk-format.md.
- Lines ~452-505: INDEX.md output template duplicates the pattern used in every other skill.

**Recommendation:** Cut ~280 lines of JSON/display templates. Replace with mapping tables and reference to design-tokens.md. Net reduction: ~250 lines.

---

### gsp-start/SKILL.md (418 lines)

**Dead weight** (1 item)
- Line ~56: "One message per round — ask a cohesive set of related questions, not one at a time." — Under the `<questioning_principles>` section. The model already batches related questions by default. The preceding principle "Progressive disclosure" covers this.

**Vague directives** (1 item)
- Line ~53: "Concrete options over open-ended" — The principle itself is good, but "More like Stripe's clean approach or Duolingo's playful style?" is an example that only works for consumer apps. For B2B SaaS or developer tools, these references don't apply. The principle would benefit from diverse examples.

**Repetition** (2 items)
- Lines ~49-57: The entire `<questioning_principles>` block (9 lines) — these are general conversation guidelines that could live in a shared reference. They don't change between skills. Currently only in gsp-start, but the behavior they describe should (and does) apply to all interactive skills.
- Lines ~88-93: Unicode display conventions (diamonds, dividers, etc.) are specified here and also in gsp-progress. Two sources of truth for the same visual language.

**One-off patches** (1 item)
- Line ~46: "Never infer the user's name from package metadata, git config, or file paths — those are authors, not the current user." — Classic one-off patch. Someone's name was inferred from package.json once. Legitimate fix but very narrow scope.

**Recommendation:** Cut ~15 lines. The file is long primarily because it handles 5 distinct greeting states + 3 flows (brand, project, quick). This complexity is warranted — the issue is more about the templates it loads than its own length. Net reduction: ~15 lines.

---

### gsp-accessibility/SKILL.md (348 lines)

**Dead weight** (1 item)
- Line ~41: "Foundation chunks follow `references/chunk-format.md` format" — Already loaded in execution_context.

**Repetition** (3 items)
- Lines ~88-111: The contrast ratio formula and WCAG thresholds table are fully specified inline. The accessibility-auditor agent and the WCAG checklist reference both contain this information. For quick-check mode (inline, no agent), a simplified version would suffice.
- Lines ~127-191: The token audit checks (5.1-5.6) partially duplicate what the accessibility-auditor agent already knows about contrast and touch targets. Since token audit runs inline (no agent), some duplication is necessary — but the WCAG thresholds could reference the checklist rather than re-specifying.
- Lines ~289-330: The accessibility statement template is fully specified inline (~40 lines). This could be a template file in templates/.

**Recommendation:** Cut ~60 lines by referencing WCAG checklist for thresholds and extracting the statement template. Net reduction: ~50 lines.

---

### gsp-doctor/SKILL.md (326 lines)

**Dead weight** (2 items)
- Line ~323: "Read-only — do NOT modify any files" — The skill has no Write tool in its allowed-tools list. The constraint is already enforced structurally.
- Line ~324: "No agents — run all checks directly, this is deterministic pattern matching" — The skill has no Agent tool in its allowed-tools list. Already enforced.

**One-off patches** (1 item)
- Line ~223: "If version is older than current (0.5.0)" — Hardcoded version number. Should reference VERSION file or be a variable.

**Repetition** (1 item)
- Line ~325: "Be specific — every issue names the exact file and suggests the exact command to fix it" — The entire diagnostic output format already shows this pattern. The rule restates what the display format demonstrates.

**Recommendation:** Cut ~8 lines. The file's length is justified by the breadth of diagnostic checks (B1-B4, P1-P10, I1, X1). Net reduction: ~8 lines.

---

### gsp-pattern-architect.md (251 lines — agent)

**Dead weight** (1 item)
- Line ~92: "All colors must include contrast ratios against common backgrounds" — Already implied by the WCAG and accessibility focus throughout the methodology. The color-system.md chunk template explicitly includes contrast ratios.

**Repetition** (5 items)
- Lines ~46-53: The system strategy descriptions (GENERATE/EXTEND/REFACTOR) are a condensed version of what the skill (gsp-brand-patterns) already specifies in its Step 2. The agent receives this as context from the skill — it's duplicated.
- Lines ~56-89: The three-tier component strategy (Token mapping / Override specs / Brand-distinctive) is fully specified in both the agent and passed as context from the skill. ~34 lines duplicated.
- Lines ~92-97: "Quality Standards" section — 6 bullet points. Of these, "Token mapping must target the actual library's theming API" and "Custom components need: states, anatomy, usage rules, accessibility spec, code hints" are restated from the methodology above. "Tokens must be valid JSON following W3C format" is enforced by the design-tokens reference already loaded.
- Lines ~132-194: The `{brand-name}.yml` YAML schema (~62 lines) is a complete template. Could be a template file.
- Lines ~196-211: The `{brand-name}.md` style prompt requirements (~16 lines) describe the expected structure. Useful but partially overlaps with the style preset `.md` files provided as format references.

**Recommendation:** Cut ~80 lines by removing duplicated strategy descriptions (agent receives them from skill context), condensing Quality Standards to only genuinely unique constraints, and extracting the YAML schema to a template. Net reduction: ~70 lines.

---

### gsp-accessibility-auditor.md (73 lines — agent, P7 flagged)

**Vague directives** (1 item)
- Line ~18: "Accessibility is not optional polish — it's a core quality requirement. Be thorough and specific." — The first sentence is a value statement (dead weight). "Be thorough and specific" is vague — the methodology already specifies exactly what to check. P7 flagged this.

**Repetition** (2 items)
- Lines ~33-35: Contrast requirements (4.5:1, 3:1, etc.) are specified here AND in the accessibility skill's WCAG checklist reference AND in prompt 08. Triple-sourced.
- Lines ~37-41: Quality Standards section. "Check every color combination" and "Verify every interactive element has keyboard access" restate the methodology's audit process steps 1-6.

**Recommendation:** Cut ~12 lines. Remove the vague motivational statement, consolidate contrast ratios to reference only. Net reduction: ~10 lines.

---

### gsp-reviewer.md (90 lines — agent, P7 flagged)

**Vague directives** (1 item)
- Line ~19: "You are the final quality gate before a project ships. You review real code, not specs. Be thorough but fair." — "Be thorough but fair" is vague. What does "fair" mean? Not flagging false positives? Acknowledging good work? The methodology doesn't clarify. P7 flagged this.

**Repetition** (3 items)
- Lines ~52-56: Quality Standards section. "Every designed screen must have a corresponding implementation check" restates Review Step 4 (screen coverage). "Token audit must catch magic numbers" restates Step 6. "Issues must reference actual codebase file paths" restates the clear instruction passed by the skill.
- Lines ~26-27: "Read BUILD-LOG.md" and "Run git diff" — The skill already instructs the agent to do exactly this. The agent receives BUILD-LOG and git diff content as inputs.
- Lines ~44-49: "How to Investigate" section — "Use Grep to search for hardcoded values", "Use Glob to find component files", "Use Bash to run git diff" — These are tool usage instructions that are unnecessary. The agent has these tools and knows how to use them.

**Recommendation:** Cut ~20 lines. Remove tool usage instructions, condense Quality Standards to unique items only. Net reduction: ~18 lines.

---

### gsp-brand-strategist.md (77 lines — agent)

**Dead weight** (1 item)
- Line ~16: "Write for both human review and agent consumption by downstream phases." — This is stated in the skill's rules ("Artifacts must balance human readability with agent consumption") AND in the agent. Double-stated.

**Repetition** (2 items)
- Lines ~38-43: Quality Standards. "Every output must be specific to this brand — swap in a competitor's name and it should break" duplicates the skill's rule: "Quality gate: if you could swap in a competitor's name and it still works, it's too generic." Same instruction, different wording.
- Lines ~30-36: Methodology steps 1-6 are a compressed version of what the skill's process Steps 2-6 already instruct. The agent receives the skill's confirmed decisions — the methodology steps are redundant.

**Recommendation:** Cut ~12 lines. Net reduction: ~10 lines.

---

### gsp-identity-designer.md (81 lines — agent)

**Dead weight** (1 item)
- Line ~17: "Write for both human review and agent consumption by downstream phases." — Same as brand-strategist. Duplicated from skill rules.

**Repetition** (2 items)
- Lines ~43-47: Quality Standards. "Every visual decision traces to strategy" is restated from the skill rule "Every visual decision must trace to strategy." "Logo directions must be genuinely different concepts" restates methodology Step 2. "Color system must pass WCAG AA contrast" is implicit in the methodology and the loaded prompts.
- Lines ~32-39: Methodology steps 1-8 compress what the skill already specifies. The agent receives confirmed direction + all inputs.

**Recommendation:** Cut ~10 lines. Net reduction: ~8 lines.

---

### gsp-researcher.md (80 lines — agent)

**Dead weight** (1 item)
- Line ~15: "Be specific and opinionated — 'Use X because Y' not 'Options are X, Y, Z.'" — This is good guidance but duplicates the Quality Standards line ~43: "Recommendations must be specific to this brand's personas, not generic."

**Repetition** (2 items)
- Line ~17: "Your output feeds brand strategy. Write for both human review and agent consumption." — Same pattern as other agents. Duplicated from skill rules.
- Lines ~33-39: Source Priority hierarchy (5 levels) — Useful and unique to this agent. NOT a repetition issue. Keep.

**Recommendation:** Cut ~5 lines. Net reduction: ~4 lines.

---

### gsp-designer.md (149 lines — agent)

**Dead weight** (1 item)
- Line ~17: "Design for real users with real goals. Every screen should solve a specific problem." — Generic design platitude. The methodology already specifies persona-driven design with specific user flows.

**Repetition** (2 items)
- Lines ~39-46: Quality Standards. "Every screen needs all 4 states" restates methodology Step 4 which already says "Detail 8 core screens with... empty/error/loading states". "Navigation must follow Apple HIG" restates the role definition. "Touch targets >= 44x44pt" restates the WCAG checklist.
- Lines ~53-55: Screen chunk naming convention "screen-{NN}-{kebab-case-name}.md" is specified here AND in the skill (gsp-project-design Step 3). The agent receives this from the skill.

**Recommendation:** Cut ~12 lines. Net reduction: ~10 lines.

---

### gsp-builder.md (139 lines — agent)

**Dead weight** (1 item)
- Line ~30: "Write real, production-ready code directly in the codebase. Not pseudocode. Not 'implementation left as exercise.' Actual files that run." — The role already says "editing real source files, creating real components, wiring real routes. Not specs. Not docs. Real code." Same instruction twice in 8 lines.

**Repetition** (2 items)
- Lines ~82-89: Quality Standards. "Code must compile and run" restates the checkpoint system. "Every interactive element needs keyboard support" and "Every component needs ARIA attributes" restate the methodology Step 5. "All spacing/color/type values come from tokens (no magic numbers)" restates Step 2 (foundations).
- Lines ~37-43: The `foundations` execution mode description duplicates the instructions the skill passes in Step 3 ("Build token integration, global styles, and layout primitives ONLY...").

**Recommendation:** Cut ~15 lines. Net reduction: ~12 lines.

---

### gsp-scoper.md (106 lines — agent)

**Repetition** (3 items)
- Lines ~33-39: Quality Standards. These 6 items largely restate the methodology. "Every screen must have a clear purpose and priority level" = methodology Step 2. "Install manifest must be copy-paste ready" = methodology Step 7.
- Lines ~85-104: The exports/INDEX.md update instructions (~20 lines) duplicate what the skill (gsp-project-brief) specifies in its Step 3. The agent AND the skill both specify how to update exports/INDEX.md. Only one should.
- Lines ~14-18: The role description restates the skill's context section nearly verbatim.

**Recommendation:** Cut ~25 lines. Remove duplicated INDEX.md update instructions (let skill handle it OR let agent handle it, not both). Net reduction: ~22 lines.

---

### gsp-project-researcher.md (105 lines — agent)

**Repetition** (3 items)
- Lines ~36-39: "Research Depth Standards" — "Don't summarize — analyze" is good but unique guidance. The rest ("Every pattern must include a source", "Competitor analysis must be specific") restates the methodology more tersely.
- Lines ~84-104: The exports/INDEX.md update instructions (~20 lines) duplicate the skill's Step 2.5. Same issue as gsp-scoper.
- Lines ~59-62: Cross-references section duplicates what the skill specifies about output structure.

**Recommendation:** Cut ~25 lines. Remove duplicated exports update. Net reduction: ~22 lines.

---

### gsp-campaign-director.md (100 lines — agent)

**Repetition** (2 items)
- Lines ~40-46: Quality Standards. "All copy must be final-draft quality (not placeholder)" is a useful unique constraint. But "Visual direction must reference brand identity" restates the role. "Consistent messaging hierarchy across all channels" restates methodology Step 1.
- Lines ~80-99: The exports/INDEX.md update instructions (~20 lines) duplicate the skill's output format.

**Recommendation:** Cut ~22 lines. Net reduction: ~20 lines.

---

### gsp-critic.md (64 lines — agent)

**Dead weight** (1 item)
- Line ~18: "Be constructive, specific, and actionable. Every criticism must include a concrete fix." — "Constructive" is vague and subjective. The methodology already specifies that every score needs an example and alternatives must be proposed.

**Repetition** (1 item)
- Lines ~41-44: Quality Standards. "Every score needs a specific example" restates methodology Step 1. "Fixes must be actionable" restates the role. "Balance criticism with recognition" could be unique but is somewhat vague.

**Recommendation:** Cut ~6 lines. Net reduction: ~5 lines.

---

### gsp-brand-auditor.md (73 lines — agent)

**Dead weight** (1 item)
- Line ~15: "Write for both human review and agent consumption." — Same pattern, fourth occurrence.

**Repetition** (1 item)
- Lines ~34-37: Quality Standards. "Every assessment must be specific" restates methodology throughout. "Evolution map rationale must connect to personas" restates methodology Step 5.

**Recommendation:** Cut ~6 lines. Net reduction: ~5 lines.

---

### gsp-ascii-artist.md (66 lines — agent)

**One-off patches** (1 item)
- Line ~48: "Use magenta for brand accents (GSP's color)" — Per user memory, GSP's accent is orange (#FF6B35), not magenta. This is incorrect and should be updated. However, since the art "should NOT be GSP-branded" per user memory, the entire color strategy section's reference to "brand accents" is questionable.

**Recommendation:** Update magenta reference or remove brand-specific color guidance given the user's directive that art should not be GSP-branded. Net change: ~2 lines.

---

### Prompts (12 files, 542 lines total)

The prompts are the shortest and leanest files in the system. Most issues are repetition with their corresponding agents.

**01-design-system-architect.md (65 lines)**
- Repetition: Lines ~10-60 contain the full GENERATE/EXTEND/REFACTOR strategy descriptions. These are also in gsp-pattern-architect.md (agent) AND gsp-brand-patterns/SKILL.md (skill). Triple-sourced. The agent loads this prompt via execution_context, so the prompt content enters the agent's context alongside the agent's own duplicate.

**02-brand-identity-creator.md (29 lines)**
- Repetition: "Act as Creative Director at Pentagram" role + expected output list duplicates the agent's role and output sections. When the agent loads this prompt, it receives the same instructions twice.

**03-ui-ux-pattern-master.md (43 lines)**
- Repetition: Role and methodology duplicates gsp-designer agent. "Detail 8 core screens" = agent methodology Step 4.

**04-marketing-asset-factory.md (27 lines)**
- Repetition: Role duplicates gsp-campaign-director agent role.

**05-implementation-spec-expert.md (42 lines)**
- Repetition: Implementation target descriptions duplicate gsp-builder agent's target-specific behavior.

**06-design-critique-partner.md (30 lines)**
- Repetition: "Score 1-5 with examples" duplicates gsp-critic agent scoring guide.

**07-design-trend-synthesizer.md (30 lines)**
- This prompt is NOT loaded by any agent or skill. It appears orphaned — no execution_context references it.

**08-accessibility-auditor.md (38 lines)**
- Repetition: "Act as Apple Accessibility Specialist" role + WCAG categories duplicate gsp-accessibility-auditor agent.

**09-design-to-code-translator.md (63 lines)**
- Contains unique "Visual Quality" section with 5 specific craft checks (background treatment, shadow depth, entrance motion, typography hierarchy, state polish). This is the only place these checks live. Valuable and non-duplicated.
- Repetition: The rest of the file (role, methodology) duplicates the builder agent.

**10-project-scoper.md (51 lines)**
- Repetition: Implementation target descriptions duplicate gsp-scoper agent methodology.

**11-deliverable-reviewer.md (67 lines)**
- Repetition: Review methodology duplicates gsp-reviewer agent methodology.

**12-project-researcher.md (57 lines)**
- Repetition: Research methodology duplicates gsp-project-researcher agent methodology.

---

### Low-priority skills (skimmed)

**gsp-palette (263 lines)** — Clean. One minor repetition: "Foundation chunks follow references/chunk-format.md" restated from execution_context.

**gsp-scaffold (247 lines)** — Clean. No agents, inline-only. Length justified by per-target setup instructions.

**gsp-help (121 lines)** — Clean. Static reference display.

**gsp-pretty (62 lines)** — Clean. Minimal.

**gsp-progress (185 lines)** — Repetition: display conventions (diamonds, dividers) overlap with gsp-start.

**gsp-update (111 lines)** — Clean.

**gsp-add-reference (97 lines)** — Clean.

**gsp-design-system (153 lines)** — Clean. One minor issue: hardcoded output file list could diverge from templates.

**get-shit-pretty (54 lines)** — Plugin entry point. Clean.

---

## Cross-file findings

### Skill -> Agent duplication

For each skill that spawns an agent, the following categories of instructions appear in BOTH the skill AND the agent:

| Skill | Agent | Duplicated content | ~Lines wasted |
|-------|-------|--------------------|---------------|
| gsp-brand-patterns | gsp-pattern-architect | System strategy (GENERATE/EXTEND/REFACTOR), 3-tier component strategy, output file list | ~50 |
| gsp-brand-strategy | gsp-brand-strategist | Quality gate ("swap competitor name"), methodology steps | ~12 |
| gsp-brand-identity | gsp-identity-designer | "Every visual decision traces to strategy", methodology steps | ~10 |
| gsp-brand-research | gsp-researcher | Research methodology, output chunks | ~8 |
| gsp-brand-audit | gsp-brand-auditor | Audit methodology, output chunks | ~6 |
| gsp-project-brief | gsp-scoper | Output chunk list, exports/INDEX.md update | ~22 |
| gsp-project-design | gsp-designer | Screen naming convention, component plan, output structure | ~15 |
| gsp-project-research | gsp-project-researcher | Research output structure, exports/INDEX.md update | ~22 |
| gsp-project-critique | gsp-critic | Critique output structure | ~5 |
| gsp-project-build | gsp-builder | Foundations mode instructions, checkpoint process | ~15 |
| gsp-project-review | gsp-reviewer | Review methodology, "review real code" instruction | ~18 |
| gsp-launch | gsp-campaign-director | Output chunks, exports/INDEX.md update | ~20 |

**Total duplicated lines: ~203**

**Root cause:** Skills describe what the agent should do AND agents describe what they do. When the skill spawns the agent with instructions, the agent receives both its own definition AND the skill's instructions — doubling the guidance.

**Fix pattern:** Skills should specify WHAT to produce (output paths, input context). Agents should specify HOW to produce it (methodology, quality standards). Currently both specify both.

### Agent -> Prompt duplication

Every agent that loads a system prompt receives the prompt's role description and methodology alongside its own. The overlap per pair:

| Agent | Prompt | Overlap |
|-------|--------|---------|
| gsp-pattern-architect | 01-design-system-architect | Role + full strategy descriptions (~40 lines) |
| gsp-identity-designer | 02-brand-identity-creator | Role + expected output (~15 lines) |
| gsp-designer | 03-ui-ux-pattern-master | Role + screen design methodology (~20 lines) |
| gsp-campaign-director | 04-marketing-asset-factory | Role + campaign methodology (~15 lines) |
| gsp-builder | 09-design-to-code-translator | Role + translation methodology (~25 lines) |
| gsp-scoper | 10-project-scoper | Role + scoping methodology (~20 lines) |
| gsp-reviewer | 11-deliverable-reviewer | Role + review methodology (~30 lines) |
| gsp-accessibility-auditor | 08-accessibility-auditor | Role + WCAG audit methodology (~20 lines) |
| gsp-project-researcher | 12-project-researcher | Role + research methodology (~25 lines) |
| gsp-critic | 06-design-critique-partner | Role + heuristics methodology (~15 lines) |

**Total duplicated lines: ~225**

**Note:** Prompts were originally designed as standalone resources (designprompts.dev). The agents evolved to contain the same information in more detail. Now the prompts are loaded as execution_context by the skills and passed to agents, creating a three-layer duplication: prompt -> agent -> skill instructions.

### Global patterns (instructions in 3+ files)

| Pattern | Files | Count | Recommendation |
|---------|-------|-------|----------------|
| "Always use AskUserQuestion for user interaction" | 9 skills | 9 | Move to a shared reference or trust the tool name |
| "Artifacts must balance human readability with agent consumption" | 4 skills | 4 | Move to shared reference |
| "Write for both human review and agent consumption" | 4 agents | 4 | Same concept as above — consolidate |
| "path provided by the skill that spawned you" | 13 agents | 13 | Structural pattern, acceptable |
| "Each chunk follows references/chunk-format.md" | 14 agents + 10 templates | 24 | Excessive — the reference is already loaded |
| "Foundation chunks follow references/chunk-format.md format exactly" | 3 skills | 3 | Already loaded via execution_context |
| "Render phase transition (see references/phase-transitions.md)" | 12 skills | 12 | Acceptable — routing instruction |
| "Act as [prestigious role]" | 12 agents + 10 prompts | 22 | Duplicated between agent and its prompt |
| "Quality Standards" sections | 12 agents | 12 | ~50% of content restates methodology |
| WCAG contrast ratios (4.5:1, 3:1) | 3 files | 3 | Consolidate to WCAG checklist reference |
| System strategy (GENERATE/EXTEND/REFACTOR) | 3 files | 3 | Consolidate — currently in skill, agent, AND prompt |
| "Resolve brand/project" boilerplate | 14 skills | 14 | Acceptable — necessary per-skill routing |

---

## Summary

| File | Lines | Dead | Contradict | One-off | Vague | Repeat | Suggested cut |
|------|-------|------|-----------|---------|-------|--------|---------------|
| gsp-typescale (skill) | 651 | 2 | 0 | 1 | 0 | 3 | ~300 |
| gsp-style (skill) | 544 | 1 | 0 | 0 | 0 | 4 | ~250 |
| gsp-start (skill) | 418 | 1 | 0 | 1 | 1 | 2 | ~15 |
| gsp-accessibility (skill) | 348 | 1 | 0 | 0 | 0 | 3 | ~50 |
| gsp-doctor (skill) | 326 | 2 | 0 | 1 | 0 | 1 | ~8 |
| gsp-pattern-architect (agent) | 251 | 1 | 0 | 0 | 0 | 5 | ~70 |
| gsp-designer (agent) | 149 | 1 | 0 | 0 | 0 | 2 | ~10 |
| gsp-builder (agent) | 139 | 1 | 0 | 0 | 0 | 2 | ~12 |
| gsp-scoper (agent) | 106 | 0 | 0 | 0 | 0 | 3 | ~22 |
| gsp-project-researcher (agent) | 105 | 0 | 0 | 0 | 0 | 3 | ~22 |
| gsp-campaign-director (agent) | 100 | 0 | 0 | 0 | 0 | 2 | ~20 |
| gsp-reviewer (agent) | 90 | 0 | 0 | 0 | 1 | 3 | ~18 |
| gsp-identity-designer (agent) | 81 | 1 | 0 | 0 | 0 | 2 | ~8 |
| gsp-researcher (agent) | 80 | 1 | 0 | 0 | 0 | 2 | ~4 |
| gsp-brand-strategist (agent) | 77 | 1 | 0 | 0 | 0 | 2 | ~10 |
| gsp-brand-auditor (agent) | 73 | 1 | 0 | 0 | 0 | 1 | ~5 |
| gsp-accessibility-auditor (agent) | 73 | 0 | 0 | 0 | 1 | 2 | ~10 |
| gsp-ascii-artist (agent) | 66 | 0 | 0 | 1 | 0 | 0 | ~2 |
| gsp-critic (agent) | 64 | 1 | 0 | 0 | 0 | 1 | ~5 |
| 12 prompts (combined) | 542 | 0 | 0 | 0 | 0 | 12 | ~225 |
| 18 other skills (combined) | 2488 | 0 | 0 | 0 | 0 | 3 | ~5 |
| **TOTALS** | **6771** | **12** | **0** | **4** | **3** | **51** | **~1071** |

Note: Contradictions found: 0 formal contradictions. 3 tension points exist (noted inline) but none where both instructions can't be satisfied simultaneously.

Vague directives from P7: 2 (gsp-accessibility-auditor "Be thorough and specific", gsp-reviewer "Be thorough but fair"). Additional vague items found during semantic analysis: 6 more (total 8 including the P7 hits).

**Total potential reduction: ~1,071 lines (15.8% of corpus)**

---

## Top 5 highest-impact changes

### 1. Extract output templates from gsp-typescale and gsp-style (~550 lines saved)
**Impact: HIGH** — These two skills alone account for 51% of the recommended cuts. The inline CSS/JSON templates consume massive context but add no behavioral value — the models know CSS, JSON, and Tailwind syntax. Replace with concise output specs (10-15 lines each) that describe the structure and reference the design-tokens.md and chunk-format.md references.

### 2. Resolve the prompt duplication layer (~225 lines saved)
**Impact: HIGH** — Every agent receives its system prompt AND has its own role/methodology that overlaps. Two approaches:
- **Option A:** Make prompts minimal (role only, 5-10 lines) and let agents own methodology. Prompts become "Act as X" one-liners.
- **Option B:** Make agents minimal (inputs/output only) and let prompts own methodology. Agents become routing headers.
Option A is recommended since agents already have richer, more specific methodology than the prompts.

### 3. Deduplicate skill->agent instructions (~200 lines saved)
**Impact: HIGH** — Especially for gsp-pattern-architect (50 lines duplicated), gsp-scoper (22), gsp-project-researcher (22), gsp-campaign-director (20). Apply the fix pattern: skills specify WHAT (inputs, output paths), agents specify HOW (methodology). Remove methodology from skills and output specs from agents where they overlap.

### 4. Consolidate "Quality Standards" sections across agents (~60 lines saved)
**Impact: MEDIUM** — 12 agents have Quality Standards sections. ~50% of their content restates the methodology in the same file. Cut to genuinely unique constraints only (typically 1-2 bullets per agent).

### 5. Remove dead-weight motivational statements (~20 lines saved)
**Impact: LOW but symbolic** — "Write for both human review and agent consumption" (4 agents), "Be thorough and specific" (2 agents), "Design for real users with real goals" (1 agent). These waste tokens on every invocation without changing behavior. Cutting them signals "every word earns its place."

### Orphaned file: 07-design-trend-synthesizer.md
This prompt is not referenced by any skill's execution_context or any agent. It appears to be unused. Verify and either wire it in or remove it.
