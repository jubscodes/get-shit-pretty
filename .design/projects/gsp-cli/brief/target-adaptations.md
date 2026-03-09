# Target Adaptations

> Phase: brief | Project: gsp-cli | Generated: 2026-03-08

---

## Brand System → CLI Adaptations

The brand system defines components as markdown specs with rendered examples. This project translates those specs into two output types:

### Type A: Runtime JS (installer)

**Screen 1 (Onboarding Splash)** lives in `bin/install.js` — actual JavaScript that runs. The Banner component spec includes a JavaScript implementation snippet. Adaptation:

- Extract color constants from tokens.json into a shared module or inline constants
- Implement `banner()`, `statusMessage()`, `tree()` functions following component specs
- Add terminal width detection (`process.stdout.columns`) for responsive behavior
- Add color tier detection (`COLORTERM`, `TERM`) for graceful degradation

### Type B: Agent Output Templates (command files)

**Screens 2-5** live in markdown command files that instruct AI agents what to render. These are not code — they're output specifications. Adaptation:

- Replace emoji status indicators with diamond symbols (◆/◈/◇)
- Replace generic formatting with brand heading hierarchy (H1 bold+accent, H2 bold)
- Add component rendering instructions that agents can follow
- Include token references so agents use correct colors when outputting ANSI

### Key Adaptation: Agents Can't Run JS

Screens 2-5 are rendered by AI agents (Claude, etc.) following command file instructions. The agents output ANSI-styled text directly. This means:

- Component specs must be translated into **copy-pasteable output templates** with ANSI escape codes inline
- Agents need clear "render this exactly" blocks, not abstract API calls
- Responsive behavior (terminal width) is limited — agents can detect width but complex layout logic is impractical
- Fallback tiers are less critical — most modern terminals support truecolor

### No Shared Runtime Module

Since only `bin/install.js` runs as actual JS, and all other screens are agent-rendered, there's no need for a shared component library module. The installer gets its own inline rendering functions. Agent-rendered screens get output templates in their command files.

---

## Token Mapping

Tokens from `tokens.json` map to ANSI codes for agent output:

| Token Path | ANSI Code | Use In |
|------------|-----------|--------|
| `color.accent` | `\x1b[38;2;255;107;53m` | Headers, brand mark, accent text |
| `color.text-primary` | `\x1b[38;2;224;224;224m` | Body text, completed phase names |
| `color.text-secondary` | `\x1b[38;2;160;160;160m` | Labels, descriptions, file names |
| `color.text-tertiary` | `\x1b[38;2;102;102;102m` | Connectors, decorative, pending items |
| `color.success` | `\x1b[38;2;34;197;94m` | Completion markers |
| `typography.bold` | `\x1b[1m` | Headers, emphasis |
| `typography.dim` | `\x1b[2m` | Secondary, decorative |
| `typography.reset` | `\x1b[0m` | After every styled span |
