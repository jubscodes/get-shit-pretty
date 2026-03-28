# Style Preset YAML Schema

Template for brand-derived style preset files (`{brand-name}.yml`). All token values must trace to foundation chunks. See any preset in `styles/` for a complete example.

```yaml
name: {brand-slug}
description: {one-line brand aesthetic summary}
tags: [5-8 fuzzy-match tags for style discovery]
source: brand  # marks this as brand-derived, not a GSP preset

tokens:
  color:
    primary: "{hex}"        # from identity/color-system.md
    secondary: "{hex}"
    accent: "{hex}"
    background: "{hex}"
    surface: "{hex}"
    on-primary: "{hex}"
    on-background: "{hex}"
    error: "{hex}"
    success: "{hex}"
    warning: "{hex}"
    info: "{hex}"
    muted: "{hex}"

  typography:
    font-family-primary: "{font stack}"  # from identity/typography.md
    font-family-mono: "{font stack}"
    font-weight-heading: {number}
    font-weight-body: {number}
    font-size-base: "{px}"
    line-height-base: {number}

  shape:
    border-radius-sm: "{px}"  # from patterns/component specs
    border-radius-md: "{px}"
    border-radius-lg: "{px}"
    border-width: "{px}"
    border-color: "{hex}"

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
    background: "{hex}"
    surface: "{hex}"
    on-background: "{hex}"
    border-color: "{hex}"
    muted: "{hex}"

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
