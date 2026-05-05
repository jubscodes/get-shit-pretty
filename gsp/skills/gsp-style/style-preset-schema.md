# Style Preset YAML Schema

Template for brand-derived style preset files (`{brand-name}.yml`). All token values must trace to foundation chunks. See any preset in `styles/` for a complete example.

Token names map 1:1 to shadcn/ui CSS variables — no translation layer. `theme-css.js` (in `gsp-brand-guidelines/bin/`) reads this file and outputs a ready-to-paste `:root`/`.dark` block.

**Value formats:**
- Solid colors: `"#RRGGBB"` hex — theme-css.js converts to OKLCH
- Alpha colors (translucent presets): `"oklch(L% C H / A)"` — passed through as-is
- Shadows, borders, font stacks: raw CSS strings

```yaml
name: {brand-slug}
description: {one-line brand aesthetic summary}
tags: [5-8 fuzzy-match tags for style discovery]
source: brand  # marks this as brand-derived, not a GSP preset

tokens:
  color:
    # Core — map directly to shadcn/ui :root CSS vars
    background: "{hex}"           # --background
    foreground: "{hex}"           # --foreground (primary text)
    card: "{hex}"                 # --card (panel/card fill; use oklch/alpha for translucent)
    card-foreground: "{hex}"      # --card-foreground
    popover: "{hex}"              # --popover (usually same as card)
    popover-foreground: "{hex}"   # --popover-foreground
    primary: "{hex}"              # --primary
    primary-foreground: "{hex}"   # --primary-foreground
    secondary: "{hex}"            # --secondary
    secondary-foreground: "{hex}" # --secondary-foreground
    accent: "{hex}"               # --accent
    accent-foreground: "{hex}"    # --accent-foreground
    muted: "{hex}"                # --muted
    muted-foreground: "{hex}"     # --muted-foreground
    destructive: "{hex}"          # --destructive (replaces legacy error)
    border: "{hex}"               # --border (absorbs legacy shape.border-color)
    input: "{hex}"                # --input (usually same as border)
    ring: "{hex}"                 # --ring (focus ring, usually same as primary)

    # Sidebar — explicit for full design control
    sidebar: "{hex}"                       # --sidebar (shadcn uses --sidebar, not --sidebar-background)
    sidebar-foreground: "{hex}"            # --sidebar-foreground
    sidebar-primary: "{hex}"               # --sidebar-primary
    sidebar-primary-foreground: "{hex}"    # --sidebar-primary-foreground
    sidebar-accent: "{hex}"                # --sidebar-accent
    sidebar-accent-foreground: "{hex}"     # --sidebar-accent-foreground
    sidebar-border: "{hex}"                # --sidebar-border
    sidebar-ring: "{hex}"                  # --sidebar-ring

    # Chart — 5 intentional data-viz colors (distinct, accessible at small sizes)
    chart-1: "{hex}"   # --chart-1
    chart-2: "{hex}"   # --chart-2
    chart-3: "{hex}"   # --chart-3
    chart-4: "{hex}"   # --chart-4
    chart-5: "{hex}"   # --chart-5

    # Extras — generate as custom properties (--success, --warning, --info)
    success: "{hex}"
    warning: "{hex}"
    info: "{hex}"

  typography:
    font-family-primary: "{font stack}"  # from identity/typography.md
    font-family-mono: "{font stack}"
    font-weight-heading: {number}
    font-weight-body: {number}
    font-size-base: "{px}"
    line-height-base: {number}

  shape:
    # border-radius-lg → --radius; sm/md used in pattern references
    border-radius-sm: "{px}"
    border-radius-md: "{px}"
    border-radius-lg: "{px}"
    border-width: "{px}"
    # Note: border-color removed — use color.border above

  elevation:
    shadow-sm: "{value}"
    shadow-md: "{value}"
    shadow-lg: "{value}"
    shadow-xl: "{value}"

  spacing:
    base: {number}
    scale: [{values}]

  motion:
    duration-fast: "{ms}"
    duration-normal: "{ms}"
    easing: "{value}"

dark_mode:
  color:
    # Only list tokens that differ from light mode
    background: "{hex}"
    foreground: "{hex}"
    card: "{hex}"
    card-foreground: "{hex}"
    muted: "{hex}"
    muted-foreground: "{hex}"
    border: "{hex}"
    input: "{hex}"
    sidebar: "{hex}"
    sidebar-border: "{hex}"
    # chart-1 through chart-5 only if they change in dark mode
    # primary/accent/destructive only if they change in dark mode

intensity:
  variance: {1-10}    # layout creativity — 1=strict grid, 10=experimental
  motion: {1-10}      # animation energy — 1=instant/none, 10=cinematic
  density: {1-10}     # content packing — 1=airy/spacious, 10=dense/compact

patterns:
  card:
    border: "{spec}"
    shadow: "{spec}"
    radius: "{spec}"
    background: "{spec}"
    padding: "{spec}"
  button-primary:
    background: "{spec}"
    border: "{spec}"
    text: "{spec}"
    radius: "{spec}"
  button-secondary:
    background: "{spec}"
    border: "{spec}"
    text: "{spec}"
    radius: "{spec}"
  input:
    border: "{spec}"
    radius: "{spec}"
    background: "{spec}"
    focus: "{spec}"
  badge:
    shape: "{spec}"
    text: "{spec}"
  nav:
    style: "{spec}"
    links: "{spec}"
  layout:
    archetype: "{name}"  # centered, asymmetric-grid, sidebar, dashboard, editorial
    max-width: "{class}"
    section-spacing: "{spec}"
    grid-gap: "{spec}"
    surfaces: "{spec}"   # background treatments (grid, dots, gradient, clean)
    decoration: "{spec}" # decorative elements (shapes, lines, labels)

constraints:
  never:
    - "{thing to never do — hard boundary}"
  always:
    - "{thing to always do — non-negotiable}"

effects:
  interaction-vocabulary: [{named-techniques}]
  hover:
    card: "{technique + spec}"
    button: "{technique + spec}"
  active:
    button: "{technique + spec}"
  focus:
    general: "{technique + spec}"
  transition: "{duration + easing spec}"

compatibility: []  # leave empty for brand styles
clashes: []        # leave empty for brand styles
```
