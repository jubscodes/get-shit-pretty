# Design Critique -- Nielsen's 10 Heuristics

> Phase: critique | Project: gsp-cli | Generated: 2026-03-08

---

## Overall Score: 38/50

A well-considered CLI design system with genuine personality and strong internal consistency. The diamond state system is clever and the progressive disclosure across screen states is thoughtful. The primary gaps are around error recovery, flexibility for power users, and a Type A/Type B implementation split that creates a subtle but real consistency risk.

---

## 1. Visibility of System Status -- 5/5

This is the design's strongest heuristic. The diamond state system (`◇ pending`, `◈ active`, `◆ complete`) communicates pipeline position at a glance across every screen. The Brand Mark header (`/gsp: ◆◈`) gives instant global status. Screen 03's progress bars and phase tables provide granular detail. Screen 05's completion lines confirm what just happened before routing forward.

**Example:** The Brand Mark diamonds update across Screens 2-4, so users always know their global position without asking. The `→ next:` command suggestion on Screen 03 removes guesswork about what to do next.

No issues found.

## 2. Match Between System and Real World -- 4/5

The design uses approachable language ("looks like a fresh start," "how pretty are we?," "fully pretty.") that avoids design jargon in the UI chrome itself. Phase names like "discover," "strategy," "verbal" are professional without being intimidating.

**Minor issue:** The density ramp (`░▒▓█`) is a Unicode art convention that most developers will parse, but it has no semantic meaning. It is purely decorative weight. Jordan (the design-curious persona) may find it confusing -- is it a loading bar? A progress indicator? It reads as "something is happening" when nothing is.

**Fix:** This is cosmetic. The ramp works as texture. If it confuses anyone, the surrounding text resolves it. No change needed, but consider adding a single-pixel gap (space) between the ramp and the text to reinforce that it is decorative framing, not a data visualization.

## 3. User Control and Freedom -- 3/5

Every phase transition (Screen 05) offers three options: Continue, View Progress, Done. This is clean routing. Screen 04's state-aware AskUserQuestion options are well-tailored. However:

**Problem A:** There is no "undo" or "go back" option anywhere. If a user accidentally advances past a phase, or wants to re-run a phase with different inputs, the design does not surface how to do that. The commands exist (`/gsp:brand-strategy` can presumably be re-run), but the UI never tells the user this is possible.

**Problem B:** Screen 05's critique loop state ("critical issues found, revising designs") offers "Override and continue" -- good. But there is no equivalent escape hatch for other phases. What if the user is mid-phase in brand-identity and wants to abandon it and restart? The transition screen only appears at completion.

**Fix A:** Add a fourth option to Screen 05's AskUserQuestion: "Re-run this phase" with description "start {phase} over with fresh inputs." Alternatively, add a note in Screen 02 (Help) that phases are re-runnable.

**Fix B:** Document in Screen 02's help reference that any phase command can be re-run to overwrite previous output. One line under the Flow section: "any phase can be re-run -- it overwrites the previous output."

## 4. Consistency and Standards -- 4/5

The component reuse matrix is strong: 11 of 15 brand components, shared styling spec, consistent indentation (2-space base, 4-space nested), consistent color roles. The Header-Content-Action block structure repeats cleanly across all five screens.

**Issue:** The Type A/Type B split creates a subtle inconsistency risk. Screen 01 uses JS runtime color constants with `getColorTier()` detection. Screens 2-5 hardcode truecolor ANSI sequences and assume the agent will output them literally. If a user has a 256-color terminal, Screen 01 will gracefully degrade to `\x1b[38;5;202m` for accent, but Screens 2-5 will still emit `\x1b[38;2;255;107;53m` -- which may render incorrectly or not at all on that terminal.

**Fix:** Add a note to the Type B agent rendering instructions: "If the user's terminal does not support truecolor (check COLORTERM env var), fall back to 256-color ANSI codes." Provide a 256-color fallback table in the shared component spec, mirroring Screen 01's `COLOR256` constants. Agents can check `$COLORTERM` before rendering.

## 5. Error Prevention -- 3/5

Screen 01 handles errors well: skipped runtimes use dim `✗` (not red), partial installs use warning yellow, and the quiet mode strips decorative content. The critique loop in Screen 05 prevents shipping broken designs.

**Problem A:** Screen 03 (Progress Dashboard) has no guidance when data is corrupt or inconsistent. If `STATE.md` has a phase marked complete but the phase directory is empty (no chunks), the dashboard would show `◆` with `0` chunks. This is misleading -- the user thinks the phase is done when it produced nothing.

**Problem B:** Screen 04's codebase detection ("scanning your codebase in the background") does not explain what happens if the scan fails or finds nothing useful. The message just appears and then the AskUserQuestion fires. The user may wonder if the scan mattered.

**Fix A:** In Screen 03, add a validation rule: if a phase is marked complete but has 0 chunks, show a warning status: `◆! discover    0 chunks (may need re-run)` in warning color. Or use `◈` with a note.

**Fix B:** In Screen 04, if the codebase scan produces no useful findings, do not show the "scanning" message at all. Only show it when `package.json` or equivalent exists AND the scan will inform the AskUserQuestion options.

## 6. Recognition Rather than Recall -- 5/5

Excellent. The `→ next: /gsp:brand-verbal` pattern on Screens 03-04 tells users exactly what command to run next. Screen 04's AskUserQuestion options are context-specific (they change based on pipeline state). Screen 02 is a complete command reference. The pipeline flow visualization on Screen 03 shows all phases with their states, so users never need to remember what comes after "strategy."

No issues found.

## 7. Flexibility and Efficiency of Use -- 3/5

The design is optimized for the guided flow (Screen 04 routing into phase commands into Screen 05 transitions). This works well for Jordan (the novice). But Alex (the power user) may find the three-option AskUserQuestion at every phase transition slow.

**Problem A:** There is no way to skip the transition screen and chain phases. An experienced user who knows they want to run discover-strategy-verbal in sequence must click through three transition screens.

**Problem B:** Screen 02 (Help) is 50-60 lines long. For a user who already knows the commands and just needs a quick reminder of the directory structure, that is a lot of scrolling. There is no shortcut to jump to a specific section.

**Fix A:** Consider documenting a "fast mode" pattern: if the user runs `/gsp:brand-strategy` directly (without going through the transition screen), it should just work without requiring them to go through `/gsp:start` first. The design already supports this implicitly, but it is never communicated.

**Fix B:** Consider splitting Screen 02 into sub-commands or adding section anchors: `/gsp:help branding` could show only the branding section. This is a v2 enhancement, not a launch blocker.

## 8. Aesthetic and Minimalist Design -- 4/5

The design shows good restraint. Screen 05 is particularly well-edited: completion line, file tree, divider, routing. Nothing extra. Screen 01's sparkle field adds personality without overwhelming. The color palette (burnt orange accent on dark terminal) is distinctive and readable.

**Issue:** Screen 03 (Progress Dashboard) is the densest screen and could overwhelm when multiple brands and projects exist. The pipeline flow line for a 6-phase project is 73 characters wide (`◆ brief ─── ◆ research ─── ◆ design ─── ◆ critique ─── ◈ build ─── ◇ review`). Add a second brand and a second project, and the screen could hit 80+ lines. The table repeats information already visible in the pipeline flow (the diamond status per phase).

**Fix:** When a brand or project is 100% complete, collapse it to the compact format used in Screen 04's State 3 (single line: `acme-corp ◆ complete`). Only show the full pipeline flow + table for in-progress items. This reduces noise significantly for users deep into the pipeline.

## 9. Help Users Recognize, Diagnose, and Recover from Errors -- 3/5

Screen 01's error state is good but minimal. Screen 05's critique loop handles design-level errors. But:

**Problem A:** Screen 03 (Progress Dashboard) empty state says "no brands or projects found. run /gsp:start to begin." -- good. But what if `.design/` exists but is malformed? What if `config.json` is missing or corrupted? The design does not specify a "partial data" error state.

**Problem B:** No screen addresses the case where an agent fails mid-phase. If `/gsp:brand-strategy` crashes after writing 2 of 5 expected chunks, the user is left with a partial phase directory and no guidance on how to recover.

**Fix A:** Add a "data integrity" variant to Screen 03: if config.json is missing or unparseable, show `acme-corp  (config missing -- run /gsp:doctor)` instead of crashing.

**Fix B:** Add guidance to Screen 05's rendering instructions: if the phase directory exists but has fewer chunks than expected, show the completion line with `◈` (active, not complete) and a note: "partial output -- consider re-running this phase." This pairs well with the re-run fix from Heuristic 3.

## 10. Help and Documentation -- 4/5

Screen 02 is a comprehensive command reference with directory structure. The Flow section shows the pipeline visually. Version and URL footer provide escape hatches.

**Issue:** There is no inline help for what each phase actually produces. The command descriptions are action-oriented ("define positioning and personality") but do not tell the user what artifacts they will get. A user wondering "what does brand-strategy actually create?" has to run it to find out.

**Fix:** Add a one-line artifact hint to each command description in Screen 02, or create a `/gsp:help phases` sub-view that shows each phase with its expected outputs. Example: `/gsp:brand-strategy` -- "define positioning and personality (creates archetype, positioning, personality, audience, competitive chunks)".

---

## Visual Design Assessment

### Hierarchy

Strong. The 4-tier typography system (H1 bold+accent, H2 bold, primary body, secondary labels) creates clear scanning paths. The Brand Mark as persistent header element anchors every screen. The burnt orange accent draws the eye to interactive elements (command names, active phases, next actions).

### Typography and Color

The color palette is well-chosen for dark terminals. The accent (#FF6B35) has sufficient contrast against dark backgrounds. The 4-tier text luminance (224, 160, 102, dim) creates readable depth without muddying. The 16-color fallback mapping accent to yellow is the weakest link -- yellow on dark is readable but loses the brand warmth.

### Spacing

Consistent and breathing. The 2-space/4-space indent system with 1-line/2-line group separators gives the output room without wasting vertical space. Screen 01's 2-blank-line padding above and below the banner creates appropriate ceremony for a first impression.

---

## Strategic Alignment

The design serves both personas well. Alex gets fast re-orientation through diamond states and `→ next:` suggestions. Jordan gets guided routing through AskUserQuestion at every decision point. The progressive density (low for Screens 1/4/5, medium for 3, high for 2) matches the user's intent at each touchpoint: reward at install, orient at start, work during phases, reference when stuck.

The main strategic gap is the power-user efficiency story (Heuristic 7). The design optimizes for the guided path but does not explicitly support the "I know what I'm doing, get out of my way" workflow.

---

## Related

- [Screen 01 - Onboarding Splash](../design/screen-01-onboarding-splash.md)
- [Screen 02 - Help Reference](../design/screen-02-help-reference.md)
- [Screen 03 - Progress Dashboard](../design/screen-03-progress-dashboard.md)
- [Screen 04 - Start Greeting](../design/screen-04-start-greeting.md)
- [Screen 05 - Phase Transitions](../design/screen-05-phase-transitions.md)
