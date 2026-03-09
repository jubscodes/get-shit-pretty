# Alternative Directions

> Phase: critique | Project: gsp-cli | Generated: 2026-03-08

---

## Direction A: Unified Runtime Renderer

**Core idea:** Eliminate the Type A/Type B split entirely. Move all screen rendering into a single Node.js runtime module that agents call as a tool.

Instead of agents emitting literal ANSI escape codes (brittle, no color tier detection, no width adaptation), every screen would be rendered by a shared `gsp-render` CLI utility. Agents would call it with structured data:

```
gsp-render progress --brand acme-corp --state '{"discover":"complete","strategy":"active"}'
```

The renderer handles color tier detection, terminal width, responsive breakpoints, and NO_COLOR compliance in one place. Agents focus on data gathering and decision-making, not string formatting.

**What this solves:**
- C1 (color consistency gap) disappears -- one renderer, one color detection path
- Responsive behavior becomes reliable instead of agent-dependent
- NO_COLOR compliance is guaranteed, not aspirational
- Adding a new color theme or adjusting spacing is a single-file change

**What this costs:**
- Agents lose the ability to render screens without invoking a tool (latency)
- The renderer becomes a dependency that must be installed and maintained
- Screen 05's embedding-in-12-commands pattern would need rethinking
- More moving parts in the install chain

**When to consider this:** If agent-rendered ANSI output proves unreliable in practice (agents hallucinating escape codes, inconsistent rendering across Claude/Gemini/Codex), this direction becomes compelling. It trades design flexibility for rendering reliability.

---

## Direction B: Minimal Chrome, Maximum Content

**Core idea:** Strip the design system down to its structural essentials. No banner, no sparkle field, no density ramp, no progress bars. Keep only the diamond state system, the pipeline flow, and the AskUserQuestion routing.

The current design has 15 components. This direction would use 6: Brand Mark, Pipeline Flow, Phase Block, Status Message, Divider, Key-Value. Every screen would be 5-15 lines maximum.

Screen 01 becomes:
```
  /gsp: ◇◇  v0.4.2

  ✓ installed for Claude Code (20 commands, 8 agents)
  → /gsp:start
```

Screen 03 becomes:
```
  /gsp: ◆◈

  acme-corp     ◆ complete
  acme-website  ◆◆◆◈◇◇ 50%  → /gsp:project-critique
```

Screen 05 becomes:
```
  ◆ strategy complete
  → 5 chunks written to strategy/
```

**What this solves:**
- I2 (dashboard density) is eliminated -- everything is compact by default
- Screen reader experience improves dramatically (less decorative noise)
- Narrow terminal support becomes trivial (nothing exceeds 50 chars)
- Agent rendering reliability increases (simpler output, less to get wrong)
- Faster perceived performance (less output to render)

**What this costs:**
- The "personality" of the tool diminishes. The sparkle field, density ramp, and progress bars are what make GSP feel crafted rather than utilitarian
- The onboarding moment (Screen 01) loses its impact -- first impressions become forgettable
- The tagline rotation disappears
- The design becomes harder to differentiate from generic CLI tools

**When to consider this:** If user testing reveals that developers skip past the decorative elements and go straight to the actionable content, the decoration is wasted work. This direction optimizes for the Alex persona (get in, orient, get out) at the expense of the emotional design that serves Jordan (feel guided and supported).

---

## Recommendation

Neither direction should be adopted wholesale. The current design sits at a good point on the decoration/utility spectrum. However:

- Borrow from Direction A for the color consistency fix: create a shared `getColors()` utility that agents can reference, even if it is not a full runtime renderer. This addresses the most critical fix (C1) without the architectural overhead.
- Borrow from Direction B for Screen 03's completed-item collapse (I2): use the compact single-line format for completed items, reserving full pipeline flows for in-progress work.

---

## Related

- [Critique](./critique.md)
- [Prioritized Fixes](./prioritized-fixes.md)
