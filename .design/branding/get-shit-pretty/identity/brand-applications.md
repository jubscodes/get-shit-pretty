# Brand Applications

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Terminal Output (Primary Touchpoint)

The terminal is where GSP lives. Every CLI interaction is a brand moment.

### Install Experience

The install sequence (`npx get-shit-pretty`) is the brand's first impression. It deploys three visual moments in sequence. The current implementation is a strong starting point -- the sparkle field and dual diamond display already demonstrate the "engineering as aesthetic" principle. Below: what exists now, what's working, and where the art can better match the identity system.

---

### Moment 1: Block Letter Banner

**Current:**
```
   ██████╗ ███████╗██████╗        ← all cyan
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██████╔╝
  ██║   ██║╚════██║██╔═══╝
  ╚██████╔╝███████║██║
   ╚═════╝ ╚══════╝╚═╝

  Get Shit Pretty v0.4.1
  {random tagline}
```

**What's working:** Block letters command attention. The tagline rotation adds personality -- different quip each install. Version number is useful context.

**What doesn't match the identity:**

1. **Color: cyan, not orange.** The brand accent is burnt orange (#FF6B35). Cyan has no strategic meaning in the GSP color system. The banner should be the brand's color -- the first thing the user sees should declare "this is GSP" through color alone.
   - Fix: Use 24-bit ANSI (`\x1b[38;2;255;107;53m`) for burnt orange. Fall back to yellow (`\x1b[33m`) for terminals without truecolor support.

2. **Generic block letter style.** The "GSP" letterforms are standard Unicode block characters. They're functional but could carry more of the brand's identity.
   - Option A: Incorporate the living diamonds into the banner composition. Place `◇◇` after or below the block letters as part of the lockup, so the very first screen shows the full brand mark.
   - Option B: Use a lighter-weight ASCII style that feels more precise/crafted and less "npm package default." Thinner strokes, more air. The Creator archetype demands craft even in ASCII.
   - Option C: Replace the block letters entirely with the `/gsp:` wordmark at large scale using a different ASCII art technique -- the command syntax IS the brand, so why spell out "GSP" in blocks when `/gsp:` is more ownable?

3. **The tagline line uses generic `dim`.** The taglines themselves are excellent (irreverent, sharp, on-brand voice). But dim white on black is low contrast. A subtle burnt orange or the text-secondary gray would give them more presence without competing with the banner.

**Recommended banner:**
```
  ┌─────────────────────────────────────┐
  │                                     │
  │   /gsp: ◇◇                         │  ← burnt orange, JetBrains Mono
  │                                     │
  │   Get Shit Pretty v0.4.1           │  ← bold white
  │   {tagline}                         │  ← dim / text-secondary
  │                                     │
  └─────────────────────────────────────┘
```

Or if block letters are preferred, shift them to burnt orange and append the diamond lockup:

```
   ██████╗ ███████╗██████╗              ← burnt orange
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██████╔╝
  ██║   ██║╚════██║██╔═══╝
  ╚██████╔╝███████║██║       ◇◇        ← diamonds as part of the mark
   ╚═════╝ ╚══════╝╚═╝

  Get Shit Pretty v0.4.1
  {tagline}
```

---

### Moment 2: Sparkle Onboarding

**Current:**
```
        *    .              ·    *       ← dim white
   .         ·    *              .

       ░▒▓█  GET SHIT PRETTY  █▓▒░     ← magenta gradient blocks

   ·    *              .         *
        ·    *    .         ·

  Design system for your AI agent.      ← dim
  Research first, then pixels.          ← dim

  ◇ Brand     discover → strategy → identity    ← magenta diamond
  ◇ Project   brief → design → build → review   ← cyan diamond
```

**What's working:**
- The sparkle scatter field is genuinely good. It creates atmosphere without being heavy. Stars and dots at varied positions feel hand-placed, not algorithmic. This is the "child's imagination" half of the TE principle.
- The `░▒▓█` density ramp is a strong concept -- void to solid mirrors the pipeline's journey from nothing to shipped. The symmetrical `█▓▒░` reversal closes the composition.
- The dual diamond pipeline display is the best element. It previews the living mark system in its first functional context.

**What doesn't match the identity:**

1. **Magenta gradient blocks, not orange.** Same issue as the banner -- `░▒▓█` should be burnt orange. The gradient ramp from void to solid in brand orange would read as "heat emerging from darkness," which IS the brand prism physique.
   - Fix: `\x1b[38;2;255;107;53m` for the `░▒▓█` blocks.

2. **Magenta brand diamond, not orange.** The `◇ Brand` diamond is magenta. In the identity system, brand moments are burnt orange. The project diamond in cyan at least evokes a cooler secondary, but magenta has no role in the GSP palette.
   - Fix: Brand diamond in burnt orange. Project diamond could stay cyan (as a cool complement) or shift to text-secondary for neutrality. Orange vs. gray creates clearer hierarchy than magenta vs. cyan.

3. **Scatter characters could use the brand sparkle.** The verbal identity specifies `✧` as the brand's emoji/sparkle character ("emoji sparingly, ✧"). Replacing `*` with `✧` in the scatter field would make it distinctly GSP rather than generic terminal art.
   - Mix: `✧`, `.`, and `·` for the scatter. Drop bare `*` -- it reads as glob/wildcard in a CLI context.

4. **Description lines are functional, not manifesto.** "Design system for your AI agent" and "Research first, then pixels" are accurate but don't use the brand's sharpest voice. This is a manifesto moment -- the user just installed. Hit them with the real line.
   - Replace with manifesto voice. Options:
     - "GSD gets shit done. GSP gets shit pretty."
     - "Brief to build. In your terminal."
     - "Your product deserves a brand."
   - Or keep one functional line and pair it with the tagline: "Design engineering system. / {rotating tagline}"

5. **The pipeline arrows could use box-drawing.** `discover → strategy → identity` works, but `discover ─ strategy ─ identity` or `discover > strategy > identity` would feel more terminal-native and avoid the Unicode arrow which renders inconsistently across terminals.

**Recommended sparkle onboarding:**
```
  {dim}      ✧    .              ·    ✧{/dim}
  {dim} .         ·    ✧              .{/dim}

     {orange}░▒▓█{/orange} {bold} GET SHIT PRETTY {/bold} {orange}█▓▒░{/orange}

  {dim}      ·    ✧    .         ·{/dim}
  {dim} ✧         .              ✧    .{/dim}

  {dim}GSD gets shit done. GSP gets shit pretty.{/dim}

  {orange}◇{/orange} {bold}Brand{/bold}     {dim}discover > strategy > identity{/dim}
  {secondary}◇{/secondary} {bold}Project{/bold}   {dim}brief > design > build > review{/dim}
```

---

### Moment 3: Get Started Commands

**Current:** Yellow header, cyan commands. This is fine. Yellow for callout headers and cyan for command references are reasonable terminal conventions. No changes needed here -- it's utilitarian, not a brand moment.

---

### Pipeline Progress

The living diamond mark appears in statusline and progress output:
```
  /gsp: ◈◇  branding in progress — strategy phase
  /gsp: ◆◈  project in progress — build phase
  /gsp: ◆◆  complete
```

Diamonds in burnt orange. Status text in text-secondary. Phase name in text-primary.

### Phase Completion

```
  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    ├── positioning.md
    └── brand-platform.md
```

Box-drawing characters for tree structures. Filled diamond in burnt orange. File names in text-primary. Clean, dense, informative.

### Error States

```
  ✗ positioning.md failed validation
    brief.md missing required field: audience
    run /gsp:doctor for diagnostics
```

Error mark in red (semantic error color). Warm mentor tone. State what happened, state what to do. No drama.

---

## README (GitHub / npm)

### Structure

1. ASCII banner (matching updated install art -- burnt orange when rendered, monochrome in plain markdown)
2. One-line description: `Design engineering system for Claude Code, OpenCode, Gemini, and Codex.`
3. Living diamond badge showing current version state
4. Terminal screenshot as hero image (dark, no window chrome)
5. Quick start code block
6. Pipeline diagram using box-drawing characters

### Visual Treatment

- No PNG/SVG banner images. The ASCII art IS the banner. It renders natively in monospace.
- Code blocks dominate. The README is terminal-native content.
- Minimal markdown formatting beyond headers, code blocks, and tables.
- Fixed tagline in README (manifesto mode), rotating taglines in install output only.

---

## Landing Page / Website

### Hero

- True black background, full bleed
- Display XL headline in JetBrains Mono: the manifesto tagline
- Terminal screenshot below -- real GSP output, not a mockup
- Dot grid texture at 3% opacity behind the screenshot
- Living diamond animation: `◇◇` then `◈◇` then `◆◇` then `◆◈` then `◆◆` cycling

### Layout

- Single column, vertically stacked sections
- 2-3px burnt orange borders separating sections (neubrutalist structure)
- No cards with shadows. Flat surfaces, declared borders.
- JetBrains Mono headings, Inter body
- Before/after transformation sections: show brief input and brand output

### Anti-patterns

- No gradient hero backgrounds
- No floating glassmorphic panels
- No "trusted by" logo bars
- No generic feature grids with icons
- Not Linear. Not another dark SaaS template.

---

## Social Media

### GitHub Profile / Organization

- Avatar: `◇◇` symbol on true black, rendered as vector
- Header: the sparkle composition (`░▒▓█ GET SHIT PRETTY █▓▒░`) in burnt orange on black
- Bio: One manifesto line. Link to docs.

### Twitter/X

- Avatar: `◇◇` in burnt orange on black
- Header: sparkle composition, burnt orange
- Posts: Terminal screenshots, before/after transformations, pipeline progress moments
- No stock imagery, no memes, no engagement-bait graphics

---

## Documentation

- True black sidebar, surface-1 content area
- JetBrains Mono for all headings and code
- Inter for explanatory prose
- Box-drawing character dividers between sections
- Pipeline phase indicator in navigation: `◆◆◇◇◇◇◇` with filled diamonds showing position
- Syntax-highlighted code blocks using brand palette

---

## npm Package Page

- Package name: `get-shit-pretty`
- Description: the one-liner
- README renders the ASCII banner natively in monospace
- Keywords: `design-system`, `brand`, `cli`, `terminal`, `ai-agent`

---

## CLI Statusline

Persistent brand touchpoint -- always visible while GSP is active:
```
  /gsp: ◆◈ get-shit-pretty | identity phase | 4/6 chunks
```

Living diamonds + project name + current phase + progress. Dense. Functional. Brand.

---

## ANSI Color Reference for Implementation

For terminals with truecolor (24-bit) support:

| Brand Token | ANSI Escape | Fallback (8-color) |
|-------------|-------------|-------------------|
| Burnt orange | `\x1b[38;2;255;107;53m` | `\x1b[33m` (yellow) |
| Text primary | `\x1b[38;2;224;224;224m` | `\x1b[37m` (white) |
| Text secondary | `\x1b[38;2;160;160;160m` | `\x1b[2;37m` (dim white) |
| Text tertiary | `\x1b[38;2;102;102;102m` | `\x1b[2;37m` (dim white) |
| Success | `\x1b[38;2;34;197;94m` | `\x1b[32m` (green) |
| Error | `\x1b[38;2;239;68;68m` | `\x1b[31m` (red) |
| Info | `\x1b[38;2;96;165;250m` | `\x1b[36m` (cyan) |

Detect truecolor support via `COLORTERM=truecolor` or `COLORTERM=24bit` environment variable. Fall back gracefully.

---

## Related

- [Logo Directions](./logo-directions.md)
- [Color System](./color-system.md)
- [Imagery Style](./imagery-style.md)
