# Technical Research

> Phase: research | Project: gsp-cli | Generated: 2026-03-08

---

## ANSI Escape Codes in Node.js (Screen 1)

### Direct ANSI vs. Libraries

Screen 1 (install.js) is runtime JavaScript. The current implementation uses raw ANSI codes (`\x1b[36m` etc.), which is the right approach for a zero-dependency installer. Adding chalk or picocolors as dependencies is unnecessary complexity for an install script.

**Best practice:** Define color constants as named variables at the top of the file, mapping token names to ANSI codes. This is what the current install.js does, but with generic color names (cyan, green) instead of brand tokens (accent, text-primary).

```javascript
// Current (generic)
const cyan = '\x1b[36m';
// Target (brand tokens)
const accent = '\x1b[38;2;255;107;53m';       // #FF6B35
const textPrimary = '\x1b[38;2;224;224;224m';  // #E0E0E0
const textSecondary = '\x1b[38;2;160;160;160m'; // #A0A0A0
```

**Reset discipline:** Every styled span must end with `\x1b[0m`. The current code already does this. Failing to reset causes color bleed into subsequent output.

Source: Node.js console color guides (medium.com/@dulthiwanka2015, dustinpfister.github.io).

---

## Terminal Capability Detection

### Color Tier Detection

The brand system defines three color tiers. Detection logic for install.js:

```javascript
function getColorTier() {
  if (process.env.NO_COLOR !== undefined) return 'none';
  if (!process.stdout.isTTY) return 'none';
  if (process.env.COLORTERM === 'truecolor' || process.env.COLORTERM === '24bit') return 'truecolor';
  if (process.env.TERM === 'xterm-256color' || process.stdout.hasColors?.(256)) return '256';
  return '16';
}
```

**Node.js built-in:** `process.stdout.hasColors(count)` (available since Node 12) provides native color depth detection. This is more reliable than manual env var checking for edge cases. Source: Node.js TTY docs (nodejs.org/api/tty.html).

**Priority chain:** NO_COLOR > FORCE_COLOR > COLORTERM > TERM > hasColors() > fallback to 16-color.

### TTY Detection

```javascript
const isTTY = process.stdout.isTTY === true;
```

When output is piped (not a TTY), strip all ANSI codes and render plain text. This is critical for `npx get-shit-pretty 2>&1 | tee install.log` workflows. Source: clig.dev guidelines.

### Terminal Width

```javascript
const columns = process.stdout.columns || 80;
```

Use 80 as the default when columns is unavailable (piped output). The Pipeline Flow component has a compact variant for < 60 columns. The Banner component should center within the available width.

---

## Unicode Support

### Diamond Characters

The diamond state system uses: `◇` (U+25C7), `◈` (U+25C8), `◆` (U+25C6). These are in the Geometric Shapes Unicode block, well-supported across:

- macOS Terminal, iTerm2: full support
- VS Code integrated terminal: full support
- Windows Terminal: full support
- Windows Console Host (legacy): partial -- may render as boxes

The `figures` npm package (github.com/sindresorhus/figures) provides fallback characters for legacy terminals, but GSP's target audience (developers using Claude Code / AI coding tools) overwhelmingly use modern terminals. Diamond support is safe to assume.

### Box-Drawing Characters

`─`, `│`, `├`, `└`, `┌`, `┐`, `┘`, `┤`, `┬`, `┴`, `┼` are in the Box Drawing Unicode block (U+2500-U+257F). Universal support across modern terminals. These are used in the Tree, Summary Box, and Divider components.

Source: cross-platform-terminal-characters (github.com/ehmicky/cross-platform-terminal-characters).

---

## Type A vs. Type B Implementation

### Type A: Runtime JavaScript (Screen 1)

The installer runs as actual Node.js. This means:

- **Functions are possible:** `banner()`, `statusMessage()`, `tree()` can be implemented as functions
- **Animation is possible:** The Banner's sparkle ramp can use `setTimeout` or `readline` cursor control
- **Dynamic layout is possible:** Read terminal width, center content, wrap lines
- **Color detection is possible:** Runtime env var checking for tier degradation

**Key constraint:** The installer must work with Node.js >= 18 (current LTS baseline). `process.stdout.hasColors()` is available. ESM is available but the current file uses CommonJS (`require`), which should be maintained for consistency.

### Type B: Agent Output Templates (Screens 2-5)

Agents output pre-formatted ANSI text following markdown instructions. This means:

- **No functions:** Agents cannot call JavaScript. They output literal strings.
- **No animation:** Output is a single render pass.
- **Limited layout:** Agents can be told to check terminal width via tool use, but complex responsive logic is impractical.
- **Truecolor only:** Agent-rendered output targets modern terminals. The 3-tier degradation is less critical here, since the agent cannot dynamically detect capabilities.

**Key insight:** Agent output templates should include the exact ANSI escape codes to use. Do not describe colors abstractly ("use the accent color") -- provide the literal escape sequence (`\x1b[38;2;255;107;53m`). Agents are instruction-followers, not token-resolvers.

---

## Performance Considerations

### Terminal Output Speed

Console.log in Node.js is synchronous and blocks the event loop. For Screen 1's install output, this is fine -- the output is brief. For any future animated components, use `process.stdout.write()` to avoid the newline overhead of console.log.

### ANSI Stripping for Piped Output

When `!process.stdout.isTTY`, strip ANSI codes from all output. A simple regex:

```javascript
const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');
```

This ensures `npx get-shit-pretty | cat` produces clean text. Source: ansi-regex npm package pattern.

---

## Cross-Platform Terminal Differences

| Terminal | Truecolor | Unicode | Box Drawing | Notes |
|----------|-----------|---------|-------------|-------|
| macOS Terminal | Yes | Yes | Yes | Default on Mac |
| iTerm2 | Yes | Yes | Yes | Power user default |
| VS Code Terminal | Yes | Yes | Yes | Most common for target audience |
| Windows Terminal | Yes | Yes | Yes | Modern Windows default |
| Console Host | 256 only | Partial | Yes | Legacy Windows, rare for target |
| tmux | Yes* | Yes | Yes | *Requires `set -g default-terminal "tmux-256color"` |

GSP's target audience (developers using AI coding tools) skews heavily toward VS Code Terminal, iTerm2, and macOS Terminal. Truecolor support is safe to assume as the default tier.

---

## Related

- [Reference Specs](./reference-specs.md) -- component specs that implement these patterns
- [Accessibility Patterns](./accessibility-patterns.md) -- constraints on color and animation
- [Recommendations](./recommendations.md) -- technical approach recommendations
