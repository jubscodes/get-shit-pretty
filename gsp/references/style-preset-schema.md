# Style Preset YAML Schema

Template for brand-derived style preset files (`{brand-name}.yml`). All values must trace to foundation chunks.

```yaml
name: {brand-slug}
description: {one-line brand aesthetic summary}
tags: [5-8 fuzzy-match tags for style discovery]
source: brand  # marks this as brand-derived, not a GSP preset

tokens:
  color:
    primary: "{hex}"        # from foundations/color-system.md
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

  typography:
    font-family-primary: "{font stack}"  # from foundations/typography.md
    font-family-mono: "{font stack}"
    font-weight-heading: {number}
    font-weight-body: {number}
    font-size-base: "{px}"
    line-height-base: {number}

  shape:
    border-radius-sm: "{px}"  # from foundations/border-radius.md
    border-radius-md: "{px}"
    border-radius-lg: "{px}"
    border-width: "{px}"
    border-color: "{hex}"

  elevation:
    shadow-sm: "{value}"  # from foundations/elevation.md
    shadow-md: "{value}"
    shadow-lg: "{value}"
    shadow-xl: "{value}"

  spacing:
    base: {number}  # from foundations/spacing.md
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

compatibility: []  # leave empty for brand styles
clashes: []
```
