# Imagery Style

> Phase: identity | Brand: get-shit-pretty | Generated: 2026-03-08

---

## Design Philosophy

GSP imagery is engineered, not illustrated. The visual language treats the terminal as a design medium and engineering artifacts as aesthetic objects. Screenshots are heroes. Diagrams are storytelling. ASCII art is signature. Nothing is stock.

This traces directly to the Creator archetype: "Don't hide the machinery. The pipeline phases, the chunk format, the agent architecture -- these are the brand." And the brand prism physique: "Engineering as aesthetic."

---

## Photography

**Rule: No stock photography. Ever.**

GSP does not use photographs of people, objects, or environments. The brand lives in a terminal. Its imagery is what that terminal produces.

If a human element is needed (contributor profiles, team), use:
- Monochrome portraits with high contrast
- Cropped tight, true black backgrounds
- No lifestyle photography, no "developer at desk" imagery

---

## Screenshots as Heroes

Terminal output is the primary visual content. Screenshots of GSP in action -- command results, pipeline progress, before/after brand output -- serve as hero images across all touchpoints.

**Screenshot treatment:**
- True black terminal background (no macOS window chrome, no browser frames)
- JetBrains Mono at readable size
- Burnt orange (#FF6B35) for accent/highlighted elements in output
- Syntax highlighting uses the brand palette: orange accent, off-white text, gray secondary
- Living diamond states visible in status lines

**Screenshot composition:**
- Full-width terminal captures for hero contexts
- Cropped/focused captures for feature callouts
- Side-by-side before/after for transformation storytelling (Magician archetype)

---

## Terminal Art as Brand Artifact

The install experience (`npx get-shit-pretty`) produces ASCII art that is a genuine brand artifact -- not decoration, but identity. Three signature techniques appear in the install sequence and should be treated as reusable brand elements:

### The Sparkle Field

Scattered `✧`, `.`, and `·` characters at varied positions create atmosphere around a focal element. The scatter feels hand-placed, not algorithmic. This is the "child's imagination" half of the TE principle -- wonder expressed through the simplest possible marks.

```
      ✧    .              ·    ✧
 .         ·    ✧              .
```

**Rules:**
- Use `✧` (the brand sparkle), `.`, and `·` only. Not `*` (reads as glob/wildcard in CLI context).
- Dim opacity (text-tertiary or ANSI dim). The sparkle is ambient, not competing.
- Asymmetric placement. Never gridded. The irregularity is the charm.
- Use around moments of reveal or completion -- the Magician's atmosphere.

### The Density Ramp

`░▒▓█` -- four Unicode block characters of increasing density. Void to solid. The pipeline's journey from nothing to shipped, compressed into four glyphs. Mirrored symmetrically: `░▒▓█ {content} █▓▒░`.

```
   ░▒▓█  GET SHIT PRETTY  █▓▒░
```

**Rules:**
- Always in burnt orange. The density ramp IS the brand color emerging from void.
- Symmetrical: opening ramp and closing ramp mirror each other.
- Use for hero moments only: install, major completions, launch. Not for routine output.
- The content between the ramps is bold white. The ramp frames; it doesn't compete.

### Box-Drawing Structures

`┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼` -- Unicode box-drawing characters provide architectural structure. Trees, borders, frames, dividers. These are the neubrutalist thick borders, translated to terminal.

```
  ◆ strategy complete — 6 chunks written
    ├── archetype.md
    ├── brand-prism.md
    └── brand-platform.md
```

**Rules:**
- Use Unicode box-drawing, not ASCII approximations (`+`, `-`, `|`).
- Consistent character width (monospace only).
- Burnt orange for emphasis lines when color is available.
- Must remain legible in plain text (no color dependency for meaning).

---

## ASCII Art and Box-Drawing Characters

ASCII art is a genuine design element, not a retro gimmick. The block letter banner in the install sequence, the sparkle field, the density ramp -- these are GSP's equivalent of a logo animation. They work in the medium where the brand lives.

**Use cases:**
- Install and onboarding experiences
- Section dividers in documentation
- Pipeline flow diagrams
- Architecture maps
- README banners (ASCII, not PNG)
- The logo system itself

**Style rules:**
- Prefer crafted compositions over generated ASCII art. Each piece should feel deliberate.
- Color is always brand-palette: burnt orange for accent, dim white for atmosphere, semantic colors for status.
- Test rendering in multiple terminal emulators (iTerm2, Terminal.app, Windows Terminal, VS Code integrated terminal).

---

## Diagrams Over Illustrations

When explaining concepts, flows, or architecture -- diagram it. Never illustrate it.

**Diagram style:**
- Monochrome with burnt orange accent for emphasis paths
- Clean geometric lines (2px stroke in vector, box-drawing in text)
- Node-and-edge style for architecture
- Flowchart style for processes
- No rounded corners, no shadows, no 3D effects
- Labels in JetBrains Mono

**Tools:** Mermaid diagrams (for docs), SVG (for web), ASCII (for terminal/README).

---

## Texture and Pattern

### Dot Grid

Engineering graph paper reference. Dots at regular intervals, extremely low opacity.

- Dot size: 1px
- Grid spacing: 24px
- Opacity: 2-4% white on black
- Use: Background texture on landing pages, documentation, presentations
- Never use on terminal output or CLI contexts

### Syntax Highlighting as Texture

Code blocks and terminal output provide visual texture through syntax coloring. The brand palette applies:

| Token Type | Color |
|------------|-------|
| Keywords | `#FF6B35` (accent) |
| Strings | `#FBBF24` (warning/warm) |
| Comments | `#666666` (text-tertiary) |
| Functions | `#E0E0E0` (text-primary) |
| Numbers | `#60A5FA` (info/cool) |

---

## Iconography

If icons are needed (navigation, feature callouts, status indicators), follow:

- **Style:** Monoline, geometric, consistent 1.5px stroke weight
- **Grid:** 24px base grid, 2px padding
- **Corners:** Square (no border-radius). Neubrutalist.
- **Color:** Monochrome (text-primary or text-secondary). Accent sparingly.
- **Source:** Lucide or Phosphor icon sets (open source, geometric, monoline)
- **Custom icons:** Match the above specs exactly

Prefer text labels and diamond symbols over icons. The brand communicates through type, not pictograms.

---

## What GSP Visuals Look Like vs. Never Look Like

| GSP looks like | GSP never looks like |
|----------------|---------------------|
| Terminal screenshot with orange highlights | Stock photo of a developer |
| `░▒▓█` density ramp in burnt orange | Gradient mesh background |
| Sparkle field with `✧` and `·` | Confetti animation |
| ASCII pipeline diagram | 3D isometric illustration |
| Dot grid texture at 3% opacity | Blurred bokeh background |
| Box-drawing character dividers | Rounded pill buttons with shadows |
| Monochrome diagram with one orange accent | Multi-color illustration with characters |
| Code block as hero image | Abstract blob shapes |
| Before/after terminal output | Glassmorphic card stack |
| JetBrains Mono heading on true black | Script font on a light pastel |

---

## Related

- [Color System](./color-system.md)
- [Brand Applications](./brand-applications.md)
- [Logo Directions](./logo-directions.md)
