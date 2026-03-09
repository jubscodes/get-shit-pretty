# Screen 01: Onboarding Splash

> Phase: design | Project: gsp-cli | Generated: 2026-03-08

---

## Purpose

First impression. Appears after `npx get-shit-pretty` completes installation. Rewards the user's decision to install. Confirms what was installed. Points to the next step.

**Type:** A (Runtime JavaScript in `bin/install.js`)
**Tone:** Confident + warm
**Density:** Low (15-20 lines)

## Components Used

- **Banner** — Sparkle field + density ramp + brand mark at `◇◇` + rotating tagline
- **Brand Mark** — `/gsp: ◇◇` inside banner, fresh-install state
- **Status Message** — `✓` for installed items, `✗` for skipped runtimes
- **Tree** — Box-drawing file listing of installed files

## Rendered Output (80 columns, truecolor)

```
                                                              ← 2 blank lines above


  [dim]        *    .              ·    *[/dim]
  [dim]   .         ·    *              .[/dim]

       [accent]░▒▓█[/accent] [bold] GET SHIT PRETTY [/bold] [accent]█▓▒░[/accent]

  [dim]   ·    *              .         *[/dim]
  [dim]        ·    *    .         ·[/dim]

  [bold][accent]/gsp:[/accent][/bold] [tertiary]◇◇[/tertiary]  [dim]v0.4.2[/dim]
  [dim]stop shipping defaults. start shipping taste.[/dim]


                                                              ← 2 blank lines


  [success]✓[/success] [primary]commands installed — 20 files[/primary]
  [success]✓[/success] [primary]agents installed — 8 files[/primary]
  [success]✓[/success] [primary]prompts, templates, references bundled[/primary]
  [success]✓[/success] [primary]statusline configured[/primary]
  [dim]✗[/dim] [secondary]opencode — not detected, skipped[/secondary]

  [secondary]installed to [primary]~/.claude/[/secondary][/primary]
  [tertiary]├── [secondary]commands/gsp/[/tertiary][/secondary]      [secondary]20 commands[/secondary]
  [tertiary]├── [secondary]agents/[/tertiary][/secondary]             [secondary]8 agents[/secondary]
  [tertiary]├── [secondary]get-shit-pretty/[/tertiary][/secondary]    [secondary]prompts, templates, references[/secondary]
  [tertiary]├── [secondary]hooks/[/tertiary][/secondary]              [secondary]statusline[/secondary]
  [tertiary]└── [secondary]settings.json[/tertiary][/secondary]       [secondary]updated[/secondary]


  [bold]Get started:[/bold]
    [accent]/gsp:start[/accent]     [secondary]start here — brand, project, or both[/secondary]
    [accent]/gsp:help[/accent]      [secondary]all commands[/secondary]

```

### Color annotations (ANSI codes for each token)

| Annotation | ANSI Code |
|------------|-----------|
| `[accent]` | `\x1b[38;2;255;107;53m` |
| `[primary]` | `\x1b[38;2;224;224;224m` |
| `[secondary]` | `\x1b[38;2;160;160;160m` |
| `[tertiary]` | `\x1b[38;2;102;102;102m` |
| `[success]` | `\x1b[38;2;34;197;94m` |
| `[dim]` | `\x1b[2m` |
| `[bold]` | `\x1b[1m` |
| `[/...]` (all closing) | `\x1b[0m` |

## Color Tier Detection

```javascript
function getColorTier() {
  // NO_COLOR takes absolute precedence (no-color.org standard)
  if (process.env.NO_COLOR !== undefined) return 'none';

  // Non-TTY output (piped) — strip all color
  if (!process.stdout.isTTY) return 'none';

  // FORCE_COLOR overrides detection
  if (process.env.FORCE_COLOR !== undefined) {
    const level = parseInt(process.env.FORCE_COLOR, 10);
    if (level >= 3) return 'truecolor';
    if (level >= 2) return '256';
    if (level >= 1) return '16';
    return 'none';
  }

  // Explicit truecolor support
  if (process.env.COLORTERM === 'truecolor' || process.env.COLORTERM === '24bit') return 'truecolor';

  // 256-color detection
  if (process.env.TERM === 'xterm-256color' || process.stdout.hasColors?.(256)) return '256';

  // Fallback to basic 16-color
  return '16';
}
```

### Color Constants by Tier

```javascript
// Truecolor (RGB)
const TRUECOLOR = {
  accent:        '\x1b[38;2;255;107;53m',
  textPrimary:   '\x1b[38;2;224;224;224m',
  textSecondary: '\x1b[38;2;160;160;160m',
  textTertiary:  '\x1b[38;2;102;102;102m',
  success:       '\x1b[38;2;34;197;94m',
  warning:       '\x1b[38;2;251;191;36m',
  error:         '\x1b[38;2;239;68;68m',
  info:          '\x1b[38;2;96;165;250m',
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// 256-color fallback
const COLOR256 = {
  accent:        '\x1b[38;5;202m',   // closest to #FF6B35
  textPrimary:   '\x1b[38;5;253m',   // closest to #E0E0E0
  textSecondary: '\x1b[38;5;247m',   // closest to #A0A0A0
  textTertiary:  '\x1b[38;5;241m',   // closest to #666666
  success:       '\x1b[38;5;35m',    // closest to #22C55E
  warning:       '\x1b[38;5;220m',   // closest to #FBBF24
  error:         '\x1b[38;5;196m',   // closest to #EF4444
  info:          '\x1b[38;5;69m',    // closest to #60A5FA
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// 16-color fallback
const COLOR16 = {
  accent:        '\x1b[33m',         // yellow (closest warm tone)
  textPrimary:   '\x1b[37m',         // white
  textSecondary: '\x1b[37m',         // white (no bright variant needed)
  textTertiary:  '\x1b[90m',         // bright black (gray)
  success:       '\x1b[32m',         // green
  warning:       '\x1b[33m',         // yellow
  error:         '\x1b[31m',         // red
  info:          '\x1b[36m',         // cyan
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
};

// No color (NO_COLOR or piped)
const NOCOLOR = {
  accent: '', textPrimary: '', textSecondary: '', textTertiary: '',
  success: '', warning: '', error: '', info: '',
  bold: '', dim: '', reset: '',
};

function getColors() {
  const tier = getColorTier();
  if (tier === 'truecolor') return TRUECOLOR;
  if (tier === '256') return COLOR256;
  if (tier === '16') return COLOR16;
  return NOCOLOR;
}
```

## Terminal Width Detection

```javascript
const columns = process.stdout.columns || 80;
```

### Centering Logic

The Banner density ramp (`░▒▓█ GET SHIT PRETTY █▓▒░`) is 30 characters wide. Center it within the terminal:

```javascript
function center(text, width) {
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '');
  const pad = Math.max(0, Math.floor((width - stripped.length) / 2));
  return ' '.repeat(pad) + text;
}
```

## States

### Default (installed successfully)

As rendered above. All `✓` status messages, file tree, next steps.

### Partial Install (some runtimes skipped)

Skipped runtimes show as dim `✗` with neutral explanation:

```
  ✗ opencode — not detected, skipped
  ✗ gemini — not detected, skipped
```

Note: skipped runtimes are NOT errors. Use dim `✗` (text-tertiary), not red.

### Quiet Mode (`--quiet` or `-q`)

Suppress the Banner and onboarding message. Show only:

```
  ✓ commands installed — 20 files
  ✓ agents installed — 8 files
  ✓ prompts, templates, references bundled
  ✓ statusline configured

  Done! GSP installed for Claude Code.
```

### Error State

If a critical install step fails:

```
  ✓ commands installed — 20 files
  ✗ agents — directory not created
  ✓ prompts, templates, references bundled

  Installation incomplete! Failed: agents
```

The error message uses `warning` color (yellow), not `error` (red), because partial installs are recoverable.

## Responsive Behavior

### Wide Terminal (>100 cols)

No change to content. Banner centers with more padding. Max content width stays at 50 chars for the banner, 60 chars for status messages.

### Standard Terminal (60-100 cols)

Default layout as shown.

### Narrow Terminal (<60 cols)

Banner still renders (density ramp is 30 chars). Status messages may wrap but each starts on its own line. Tree connectors remain.

### Very Narrow Terminal (<40 cols)

Suppress sparkle field lines. Banner still renders. Tree labels may truncate.

## Sparkle Field Randomization

The sparkle field consists of 2 lines above and 2 lines below the density ramp. Characters (`*`, `.`, `·`) are placed at random positions within a 34-char field, with 4-8 characters per line.

```javascript
function sparkleLine(width) {
  const chars = ['*', '.', '·'];
  const line = Array(width).fill(' ');
  const count = 4 + Math.floor(Math.random() * 5); // 4-8 sparkles
  for (let i = 0; i < count; i++) {
    const pos = Math.floor(Math.random() * width);
    line[pos] = chars[Math.floor(Math.random() * chars.length)];
  }
  return line.join('');
}
```

## Tagline Rotation

One tagline selected at random per install run. Existing taglines:

1. "opinionated design systems, packaged for agents."
2. "because 'looks like AI made it' is becoming a genre."
3. "strategy first. pixels second. ship it pretty."
4. "teach your agent what good design looks like."
5. "design systems that agents can actually follow."
6. "your codebase called. it wants a design system."
7. "stop shipping defaults. start shipping taste."
8. "same system, different themes, different products."

All taglines render in dim text, under the brand mark.

## Accessibility

### NO_COLOR

When `NO_COLOR` is set, all ANSI codes are suppressed. The output still renders with Unicode symbols (`✓`, `✗`, `◇`, `├──`, `└──`), sparkle field characters, and the density ramp text. The structure remains readable without color.

### Screen Reader Considerations

- The sparkle field is decorative noise. It renders as scattered punctuation — tolerable but not meaningful.
- Status messages use distinct symbols (`✓` vs `✗`) that differ in shape, not just color.
- The density ramp (`░▒▓█`) will read as block characters. The text "GET SHIT PRETTY" between them is the meaningful content.

## Implementation Notes (Type A)

This screen is implemented as modifications to `bin/install.js`. Key changes from current code:

1. **Replace color constants** — `cyan`, `green`, `yellow`, `magenta` become `accent`, `textPrimary`, `textSecondary`, `textTertiary`, `success`, `warning`
2. **Add `getColorTier()` and `getColors()`** — tier detection at top of file
3. **Replace banner** — Current ASCII art banner becomes density ramp + sparkle field
4. **Replace status emoji** — Current `${green}+${reset}` becomes `${c.success}✓${c.reset}`
5. **Add file tree** — After status messages, show tree of installed paths
6. **Replace onboarding block** — Current `finishInstall()` onboarding becomes the branded next-step block
7. **Keep interactive prompts unchanged** — Readline prompts for runtime/location selection retain current styling (they appear before the splash)

The `c` variable holds the color constants returned by `getColors()`. All existing `console.log` calls update to use `c.accent` instead of `cyan`, etc.

---

## Related

- [Component Plan](./shared/component-plan.md)
- [Screen 04 - Start Greeting](./screen-04-start-greeting.md)
