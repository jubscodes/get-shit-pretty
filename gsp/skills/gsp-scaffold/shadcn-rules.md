# shadcn/ui Rules — Tier 1: Install & Config

Rules for the scaffold phase. The foundations agent reads this to set up a correct shadcn/ui installation.

---

## Installation

```bash
npx shadcn@latest init -d
```

The `-d` flag uses defaults. For existing projects with a different style, omit `-d` and answer the prompts.

After init, capture project context:

```bash
npx shadcn@latest info --json
```

Key fields from the JSON:

| Field | Use |
|-------|-----|
| `aliases` | Import prefix (`@/`, `~/`) — use consistently in all generated code |
| `tailwindVersion` | `"v4"` uses `@theme inline`; `"v3"` uses `tailwind.config.js` |
| `tailwindCssFile` | Where CSS custom properties go — write tokens here |
| `style` | Component visual treatment (nova, vega, etc.) — do NOT assume `default` |
| `iconLibrary` | `lucide-react` or `@tabler/icons-react` — use the right import |
| `resolvedPaths` | Exact destinations for components, utils, hooks |
| `isRSC` | Whether `"use client"` directives are needed |

---

## globals.css pattern

### Tailwind v4

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  /* Insert OKLCH custom properties from bin/theme-css.js output here */
}

.dark {
  /* Insert .dark overrides from bin/theme-css.js output here */
}
```

### Tailwind v3

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Insert HSL custom properties here */
  }
  .dark {
    /* Insert .dark overrides here */
  }
}
```

---

## Token injection

Run `bin/theme-css.js` with the brand's `.yml` preset to generate CSS:

```bash
node bin/theme-css.js .design/branding/{brand}/patterns/{brand}.yml --stdout
```

Paste the `:root { }` and `.dark { }` blocks into `globals.css` at the marked location.

**Format:** v0.8.0+ uses OKLCH (`oklch(L C H)`). shadcn/ui v2+ accepts OKLCH natively.

---

## Component install

```bash
# Install individual components
npx shadcn@latest add button card input

# Install all at once (preferred — from install-manifest.md)
npx shadcn@latest add button card dialog popover select tooltip ...
```

**If a batch install fails:** parse the error, remove the failing component(s), retry with the rest. Log failures.

Known registry gaps:
- `visually-hidden` — implement as a simple CSS utility instead

---

## Critical rules

1. **Never overwrite components.json** — shadcn init writes it; subsequent adds read it
2. **Check for existing files before overwriting** — `globals.css` may already have Tailwind imports
3. **Tailwind v4 source scoping** — if the repo has non-source files with CSS class names (`.design/`, `gsp/`), add `source("../")` to the `@import "tailwindcss"` line to limit scanning
4. **Import alias consistency** — all generated code must use the alias from `shadcn info` (`@/` or `~/`), never relative paths to component files
5. **Never hardcode colors** — use `bg-primary`, `text-muted-foreground`, `border-border`, etc. — never `bg-blue-500`

---

## Dark mode setup

shadcn uses class-based dark mode. In `tailwind.config.js` (v3):

```js
module.exports = {
  darkMode: ["class"],
  // ...
}
```

In v4 with `@custom-variant dark` — no config needed; the variant is declared in CSS.

The root layout needs a `ThemeProvider` if the project requires user-togglable dark mode. For dark-by-default or light-only, skip the provider and set the class on `<html>` directly.
