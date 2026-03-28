# Token Mapping Reference

Deterministic mapping from GSP style preset `.yml` tokens to target CSS variable systems. The builder reads the `.yml` and generates the right output for the detected stack — no separate `tokens.json` or `token-mapping.md` needed.

## Source: `.yml` Token Structure

Every preset (and every brand `.yml`) has this structure:

```yaml
tokens:
  color:
    primary: "#hex"        # Brand primary
    secondary: "#hex"      # Brand secondary
    accent: "#hex"         # Brand accent
    background: "#hex"     # Page background
    surface: "#hex"        # Card/panel fill
    on-primary: "#hex"     # Text on primary
    on-background: "#hex"  # Text on background
    error: "#hex"
    success: "#hex"
    warning: "#hex"
    info: "#hex"
    muted: "#hex"          # Subtle text, borders (optional)

  typography:
    font-family-primary: "stack"
    font-family-mono: "stack"
    font-family-display: "stack"     # optional
    font-family-secondary: "stack"   # optional
    font-weight-heading: N
    font-weight-body: N
    font-size-base: "Npx"
    line-height-base: N

  shape:
    border-radius-sm: "Npx"
    border-radius-md: "Npx"
    border-radius-lg: "Npx"
    border-width: "Npx"
    border-color: "#hex"

  elevation:
    shadow-sm: "css-shadow"
    shadow-md: "css-shadow"
    shadow-lg: "css-shadow"
    shadow-xl: "css-shadow"

  spacing:
    base: N
    scale: [N, N, ...]

  motion:
    duration-fast: "Nms"
    duration-normal: "Nms"
    easing: "css-easing"

dark_mode:
  color:
    background: "#hex"
    surface: "#hex"
    on-background: "#hex"
    border-color: "#hex"   # optional
    muted: "#hex"          # optional
```

---

## Target: shadcn/ui

shadcn uses HSL CSS variables in `:root` and `.dark`. The mapping is deterministic — every `.yml` token has exactly one shadcn variable.

### Color mapping

| `.yml` token | shadcn CSS variable | Notes |
|---|---|---|
| `color.background` | `--background` | Page background |
| `color.on-background` | `--foreground` | Primary text |
| `color.surface` | `--card` | Card background |
| `color.on-background` | `--card-foreground` | Card text (same as foreground) |
| `color.surface` | `--popover` | Popover bg (same as card) |
| `color.on-background` | `--popover-foreground` | Popover text |
| `color.primary` | `--primary` | Primary actions |
| `color.on-primary` | `--primary-foreground` | Text on primary |
| `color.secondary` | `--secondary` | Secondary actions |
| `color.on-primary` | `--secondary-foreground` | Text on secondary (derive from contrast) |
| `color.muted` | `--muted` | Muted backgrounds |
| `color.muted` | `--muted-foreground` | Muted text (use muted or derive darker) |
| `color.accent` | `--accent` | Accent highlights |
| `color.on-primary` | `--accent-foreground` | Text on accent (derive from contrast) |
| `color.error` | `--destructive` | Destructive actions |
| `color.on-primary` | `--destructive-foreground` | Text on destructive |
| `shape.border-color` | `--border` | Default borders |
| `shape.border-color` | `--input` | Input borders |
| `color.primary` | `--ring` | Focus ring |
| `color.surface` | `--sidebar-background` | Sidebar bg |
| `color.on-background` | `--sidebar-foreground` | Sidebar text |
| `color.primary` | `--sidebar-primary` | Sidebar active |
| `color.on-primary` | `--sidebar-primary-foreground` | Sidebar active text |
| `color.accent` | `--sidebar-accent` | Sidebar accent |
| `color.on-background` | `--sidebar-accent-foreground` | Sidebar accent text |
| `shape.border-color` | `--sidebar-border` | Sidebar borders |
| `color.primary` | `--sidebar-ring` | Sidebar focus ring |
| | `--chart-1` through `--chart-5` | Derive from primary, secondary, accent, info, success |

### Shape mapping

| `.yml` token | shadcn CSS variable |
|---|---|
| `shape.border-radius-lg` | `--radius` |

shadcn derives `--radius` down: `calc(var(--radius) - 2px)` for md, `calc(var(--radius) - 4px)` for sm.

### Typography

shadcn doesn't use CSS variables for fonts — set in `tailwind.config` `fontFamily` extend:

```js
fontFamily: {
  sans: [/* from typography.font-family-primary */],
  mono: [/* from typography.font-family-mono */],
}
```

### Dark mode

| `.yml` dark_mode token | shadcn CSS variable (`.dark` scope) |
|---|---|
| `dark_mode.color.background` | `--background` |
| `dark_mode.color.on-background` | `--foreground` |
| `dark_mode.color.surface` | `--card`, `--popover` |
| `dark_mode.color.border-color` | `--border`, `--input` |
| `dark_mode.color.muted` | `--muted`, `--muted-foreground` |

Tokens not listed in `dark_mode` inherit their light-mode value.

### Color format conversion

shadcn expects HSL channel values (no `hsl()` wrapper): `210 40% 98%`

**Conversion:** hex → HSL → extract H S% L% as space-separated string.

```
#1E40AF → hsl(221, 72%, 40%) → "221 72% 40%"
```

### Complete output example

Given `professional.yml`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 210 40% 98%;
    --card-foreground: 222 47% 11%;
    --popover: 210 40% 98%;
    --popover-foreground: 222 47% 11%;
    --primary: 221 72% 40%;
    --primary-foreground: 0 0% 100%;
    --secondary: 215 16% 47%;
    --secondary-foreground: 0 0% 100%;
    --muted: 213 27% 84%;
    --muted-foreground: 215 16% 47%;
    --accent: 199 89% 48%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 221 72% 40%;
    --radius: 0.75rem;
    --chart-1: 221 72% 40%;
    --chart-2: 215 16% 47%;
    --chart-3: 199 89% 48%;
    --chart-4: 217 91% 60%;
    --chart-5: 142 71% 45%;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 96%;
    --card: 217 33% 17%;
    --card-foreground: 210 40% 96%;
    --popover: 217 33% 17%;
    --popover-foreground: 210 40% 96%;
    --border: 217 19% 27%;
    --input: 217 19% 27%;
    --muted: 215 20% 65%;
    --muted-foreground: 215 20% 65%;
  }
}
```

---

## Target: Tailwind (no component library)

For codebases using Tailwind without shadcn, map directly to `tailwind.config` `extend`:

```js
theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      background: "var(--color-background)",
      surface: "var(--color-surface)",
      foreground: "var(--color-foreground)",
      muted: "var(--color-muted)",
      error: "var(--color-error)",
      success: "var(--color-success)",
      warning: "var(--color-warning)",
    },
    fontFamily: {
      sans: [/* typography.font-family-primary */],
      mono: [/* typography.font-family-mono */],
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
    },
    boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      xl: "var(--shadow-xl)",
    },
  }
}
```

CSS variables use hex directly (no HSL conversion needed):

```css
:root {
  --color-primary: #1E40AF;
  --color-secondary: #475569;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-foreground: #0F172A;
  --color-muted: #94A3B8;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
}
```

---

## Target: Vanilla CSS

For non-Tailwind codebases, generate a CSS custom property system with semantic class recipes:

```css
:root {
  /* Brand */
  --color-primary: #1E40AF;
  --color-secondary: #475569;
  --color-accent: #0EA5E9;
  --color-bg: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-text: #0F172A;
  --color-muted: #94A3B8;
  --color-border: #E2E8F0;

  /* Semantic */
  --color-error: #DC2626;
  --color-success: #16A34A;
  --color-warning: #D97706;

  /* Shape */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --border-width: 1px;

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Typography */
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: SF Mono, Menlo, monospace;
  --font-weight-heading: 600;
  --font-weight-body: 400;
  --font-size-base: 16px;
  --line-height-base: 1.6;
}
```

---

## Layered resolution

The builder resolves tokens in this order (last wins):

1. **Preset `.yml`** — base tokens from the style preset (e.g., `professional.yml`)
2. **Brand `.yml`** — overrides from branding process (e.g., `acme.yml` with `style_base: professional`)
3. **Dark mode** — `dark_mode.color.*` overrides for `.dark` scope

If only a preset exists (quick project), step 2 is skipped. The builder generates CSS from whatever `.yml` it receives.

## When to generate extended files

| Scenario | Files produced |
|----------|---------------|
| Quick project (`/gsp-style`) | Preset `.yml` (base) → CSS vars generated at build time |
| Full branding (customized) | Brand `.yml` (inherits preset) + `STYLE.md` |
| Full branding (unchanged from preset) | Only `STYLE.md` (brand `.yml` not needed if identical to preset) |
