# Prioritized Fixes

> Phase: critique | Project: gsp-cli | Generated: 2026-03-08

---

## Critical (must fix before build)

### C1. Type A/B color consistency gap

**Screen:** All (systemic)
**Heuristic:** 4 (Consistency)

Screen 01 detects the terminal color tier and degrades gracefully. Screens 2-5 hardcode truecolor ANSI sequences. On a 256-color or 16-color terminal, Screen 01 will look correct while agent-rendered screens will emit unsupported escape codes that may render as garbage text or be silently ignored.

**Fix:** Add a Color Tier section to the Type B agent rendering instructions in [component-plan.md](../design/shared/component-plan.md). Instruct agents to check `$COLORTERM` before rendering and provide the `COLOR256` and `COLOR16` fallback tables from Screen 01's spec. Each screen spec's "Agent Rendering Instructions" section should reference this shared fallback.

### C2. No recovery path for mid-phase agent failures

**Screen:** [Screen 05](../design/screen-05-phase-transitions.md)
**Heuristic:** 9 (Error Recovery)

If an agent crashes mid-phase, the user has a partial phase directory with no completion screen, no routing, and no guidance. The design only specifies what happens at phase completion, not at phase failure.

**Fix:** Add a "Phase Interrupted" state to Screen 05's spec. When a phase command is re-run and the phase directory already has partial content, the agent should show: `◈ {phase} -- partial output found ({N} chunks). Re-running will overwrite.` followed by AskUserQuestion: "Continue (overwrite)" / "View existing output" / "Cancel". This makes re-running explicit and safe.

### C3. Progress dashboard shows misleading data for corrupt state

**Screen:** [Screen 03](../design/screen-03-progress-dashboard.md)
**Heuristic:** 5 (Error Prevention)

A phase marked complete in STATE.md with 0 chunks in the directory shows as `◆` with `0` chunks. The user believes work was done when it was not.

**Fix:** Add a validation rule to Screen 03's agent rendering instructions: if `status === 'complete'` and chunk count is 0, display `◆!` in warning color with a note "(empty -- may need re-run)". If `config.json` is missing or unparseable, show the instance name with "(config error -- run /gsp:doctor)" instead of crashing.

---

## Important (high priority, fix before launch)

### I1. No "re-run phase" option in transition routing

**Screen:** [Screen 05](../design/screen-05-phase-transitions.md)
**Heuristic:** 3 (User Control and Freedom)

Users cannot undo or redo a phase through the guided flow. They must know to manually run the phase command again.

**Fix:** Add a note to Screen 02's Flow section: "any phase can be re-run -- it overwrites previous output." Optionally, add a 4th AskUserQuestion option to Screen 05: "Re-run this phase" for users who are unsatisfied with the output.

### I2. Progress dashboard does not collapse completed items

**Screen:** [Screen 03](../design/screen-03-progress-dashboard.md)
**Heuristic:** 8 (Aesthetic/Minimalist)

When multiple brands and projects exist, all showing full pipeline flows + tables, the dashboard can exceed 80 lines. The table duplicates information already visible in the pipeline flow.

**Fix:** Collapse 100%-complete items to single-line format: `acme-corp ◆ complete (5/5, 11 chunks)`. Only show full pipeline flow + table for in-progress items. This is already demonstrated in [Screen 04 State 3](../design/screen-04-start-greeting.md) where complete brands show as `acme-corp ◆ complete`.

### I3. Help reference lacks artifact descriptions

**Screen:** [Screen 02](../design/screen-02-help-reference.md)
**Heuristic:** 10 (Help and Documentation)

Command descriptions tell users what a phase does ("define positioning and personality") but not what it produces. Users cannot preview what artifacts a phase will create without running it.

**Fix:** Add parenthetical artifact hints to high-value commands in Screen 02. Example: `/gsp:brand-strategy  define positioning and personality (5-6 chunks)`. Or add a separate section at the bottom of Screen 02 showing the expected output per phase. Keep it brief -- chunk counts, not full file lists.

### I4. No power-user fast path communicated

**Screen:** [Screen 04](../design/screen-04-start-greeting.md), [Screen 05](../design/screen-05-phase-transitions.md)
**Heuristic:** 7 (Flexibility)

Experienced users must click through AskUserQuestion at every transition. There is no documented way to chain phases or skip the routing.

**Fix:** Add a one-line note to Screen 02's Flow section: "run any phase command directly to skip routing." This communicates that `/gsp:brand-strategy` works without going through `/gsp:start`. No UI changes needed -- just documentation of existing capability.

---

## Polish (fix if time allows)

### P1. Sparkle field is static in the design spec

**Screen:** [Screen 01](../design/screen-01-onboarding-splash.md)

The design spec shows the `sparkleLine()` function for randomization, but the current implementation in `install.js` (line 1110-1116) uses hardcoded sparkle positions. The randomization function is specified but not yet implemented.

**Fix:** Replace the hardcoded sparkle lines in `finishInstall()` with calls to the `sparkleLine()` function from the design spec.

### P2. 16-color accent maps to yellow, same as warning

**Screen:** [Screen 01](../design/screen-01-onboarding-splash.md)

In the 16-color fallback, both `accent` and `warning` map to `\x1b[33m` (yellow). This means accent command names and warning messages are visually identical.

**Fix:** Map 16-color accent to `\x1b[33;1m` (bright yellow / bold yellow) and keep warning as plain `\x1b[33m`. This provides minimal differentiation on limited terminals.

### P3. Screen reader experience with density ramp

**Screen:** [Screen 01](../design/screen-01-onboarding-splash.md)

The density ramp (`░▒▓█ GET SHIT PRETTY █▓▒░`) reads as block characters to screen readers. The spec acknowledges this but offers no mitigation.

**Fix:** This is inherent to terminal output and largely unavoidable. The text content "GET SHIT PRETTY" between the blocks is the meaningful payload. No action needed unless accessibility testing reveals it as a real blocker.

### P4. Codebase scan message appears unconditionally

**Screen:** [Screen 04](../design/screen-04-start-greeting.md)

The "scanning your codebase in the background" info message shows whenever `package.json` exists, regardless of whether the scan produces useful information.

**Fix:** Only show the scanning message if the scan will influence the AskUserQuestion options or the Summary Box content. If the scan finds nothing actionable, suppress the message entirely.

---

## Related

- [Critique](./critique.md)
- [Component Plan](../design/shared/component-plan.md)
