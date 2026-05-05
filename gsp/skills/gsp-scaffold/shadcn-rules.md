# shadcn/ui Rules — Tier 1: Install & Config

Rules for the scaffold phase. The foundations agent reads this to set up a correct shadcn/ui installation.

---

## Installation

```bash
npx shadcn@latest init -d
```

The `-d` flag uses defaults — it forces **Next.js + nova preset**. For other frameworks (Vite, React Router, Remix) or to pick a different preset, omit `-d` and answer the prompts, or use the `-t` / `-p` flags:

```bash
npx shadcn@latest init -t vite              # scaffold for Vite
npx shadcn@latest init -t next -p lyra      # Next.js with lyra preset
npx shadcn@latest init --monorepo           # monorepo scaffold (prompts for framework)
npx shadcn@latest init -t next --monorepo   # Next.js monorepo
npx shadcn@latest init                      # interactive — choose framework + style
```

Templates: `next`, `vite`, `start`, `react-router`, `astro` (all support `--monorepo`), `laravel` (no monorepo).

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
| `style` | Component visual treatment (`new-york`, `base-nova`, etc.) — do NOT assume `default` (deprecated) |
| `iconLibrary` | `lucide-react` or `@tabler/icons-react` — use the right import |
| `resolvedPaths` | Exact destinations for components, utils, hooks |
| `isRSC` | Whether `"use client"` directives are needed |

---

## globals.css pattern

### Tailwind v4

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

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
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  /* Brand tokens installed here by /gsp-brand-apply (runs `shadcn apply --only theme`) */
}

.dark {
  /* Dark-mode overrides installed here by /gsp-brand-apply */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  button:not(:disabled), [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

**Note:** `shadcn/tailwind.css` ships with the shadcn CLI — no separate npm install needed. Do **not** use `tw-animate-css`; that's a different package with different animation primitives.

### Google Fonts (optional)

If the preset uses a Google Font (check `typography.font-family-primary`), add the import **before** the Tailwind import:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import "tailwindcss";
@import "shadcn/tailwind.css";
```

Then set font vars with literal values in `@theme inline` (not `var()` self-references):

```css
@theme inline {
  /* … existing color/radius vars … */
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

`theme-css.js` emits `--font-sans` / `--font-mono` / `--font-display` from the preset's `typography` block. These values are wired into `@theme inline` when the theme is installed via `/gsp-brand-apply`.

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

**Order matters** — run component installs first, then apply the brand theme. This prevents `shadcn add` from appending its own `cssVars` after your custom OKLCH values.

**Step 1 — Install all components first:**

```bash
npx shadcn@latest add button card dialog popover select tooltip ...
```

**Step 2 — Apply the brand theme:**

Brand tokens are installed via `/gsp-brand-apply`, which runs `shadcn apply --only theme` against the `{brand}.theme.json` registry artifact produced by `gsp-brand-guidelines`. This replaces any `:root`/`.dark` blocks the shadcn CLI wrote with OKLCH brand values. The `@theme inline` block stays untouched — it only contains `var()` aliases and radius/font values, not actual color values.

**Format:** OKLCH (`oklch(L C H)`). shadcn/ui v2+ accepts OKLCH natively. No `hsl()` wrapper needed.

---

## Project context

Always run this first — it tells you exactly what the project has:

```bash
npx shadcn@latest info --json
```

Key fields to check before writing any code:

| Field | Use |
|-------|-----|
| `base` | `"radix"` or `"base"` — determines component APIs (asChild vs render, ToggleGroup type prop, Slider value shape, etc.) |
| `tailwindVersion` | `"v4"` uses `@theme inline`; `"v3"` uses `tailwind.config.js` |
| `tailwindCssFile` | The exact CSS file to edit — never create a new one |
| `iconLibrary` | `lucide-react` or `@tabler/icons-react` — never assume lucide |
| `aliases` | Import prefix — use consistently, never relative paths to UI files |
| `isRSC` | When `true`, components with hooks/event handlers need `"use client"` |
| `packageManager` | Use for non-shadcn dep installs (`pnpm add date-fns` vs `npm install date-fns`) |

---

## Presets

Three formats for `--preset`:

```bash
npx shadcn@latest init --preset nova           # named preset
npx shadcn@latest init --preset a2r6bw         # opaque code from ui.shadcn.com
npx shadcn@latest init --preset "https://..."  # full URL
```

**Never decode or fetch preset codes manually.** They are opaque — pass them directly to the CLI.

### Applying a preset to an existing project

```bash
npx shadcn@latest apply --preset a2r6bw   # overwrite all detected component files
npx shadcn@latest apply a2r6bw            # shorthand
```

### Switching presets

Ask the user which strategy before running:

| Strategy | Command | When |
|----------|---------|------|
| **Overwrite** | `npx shadcn@latest apply --preset <code>` | User hasn't customized components |
| **Merge** | `npx shadcn@latest init --preset <code> --force --no-reinstall`, then smart merge per component | User has customized components |
| **Skip** | `npx shadcn@latest init --preset <code> --force --no-reinstall` | Update config/CSS only, leave components |

Named presets: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`

---

## Component install

```bash
# Install individual components
npx shadcn@latest add button card input

# Install all at once (preferred — from install-manifest.md)
npx shadcn@latest add button card dialog popover select tooltip ...

# Preview all files that would be written (no changes)
npx shadcn@latest add button --dry-run

# Preview diff for a specific file before updating
npx shadcn@latest add button --diff button.tsx

# Preview CSS changes
npx shadcn@latest add button --diff globals.css

# View component source without installing
npx shadcn@latest add button --view button.tsx

# Overwrite existing files
npx shadcn@latest add button --overwrite

# Install from a community registry
npx shadcn@latest add @shadcnblocks/sidebar-07
```

**Always use `--dry-run` or `--diff` before overwriting existing components.** Never fetch raw component source from GitHub — the CLI handles registry resolution, paths, and CSS diffing.

### Get component docs before building or fixing

```bash
npx shadcn@latest docs button dialog select
```

Returns live documentation and example URLs. Fetch those URLs to get the actual API and usage patterns. Run this before implementing or debugging any component.

### Before building a custom component

Run `npx shadcn@latest search {name}` — a registry version may already exist:

```bash
npx shadcn@latest search sidebar
npx shadcn@latest search @tailark -q "stats"
```

### Post-install import check (community registries)

After installing from a community registry (e.g. `@bundui`, `@magicui`, `@shadcnblocks`), check added non-UI files for hardcoded import paths like `@/components/ui/...`. These may not match the project's actual aliases. Use `npx shadcn@latest info` to get the correct `ui` alias and rewrite imports accordingly. The CLI rewrites its own UI files — third-party files may use default paths.

### Registry gate

When the user asks to add a block or component without specifying a registry, ask which registry to use. Never default to one silently. When the user specifies a registry, always use exactly that one.

**If a batch install fails:** parse the error, remove the failing component(s), retry with the rest. Log failures.

**`registryDependencies` are installed automatically** — complex components pull their own deps in one step.

Known registry gaps:
- `visually-hidden` — implement as a simple CSS utility instead

---

## Blocks

Blocks are pre-built page sections — install them the same way as components:

```bash
npx shadcn@latest add sidebar-07        # install a specific block
npx shadcn@latest add sidebar-07 --diff # preview changes before installing
npx shadcn@latest add sidebar-07 --overwrite  # force overwrite existing files
```

**Always check for a block before building from scratch.** Run `npx shadcn@latest search {name}` first.

### Block categories

| Category | Slugs | Page target |
|----------|-------|-------------|
| Sidebar | `sidebar-01` … `sidebar-16` | `app/dashboard/page.tsx` |
| Login | `login-01` … `login-05` | `app/login/page.tsx` |
| Signup | `signup-01` … `signup-05` | `app/signup/page.tsx` |

Each block installs two things: a **page.tsx** at the fixed route above, and one or more component files. The page path is fixed — the agent cannot change it without manual refactoring.

### Sidebar blocks (01–16)

All 16 sidebar blocks share the same structural shell:

```tsx
<SidebarProvider style={{ "--sidebar-width": "19rem" } as React.CSSProperties}>
  <AppSidebar />
  <SidebarInset>
    <header>
      <SidebarTrigger />
      <Breadcrumb />
    </header>
    {/* page content */}
  </SidebarInset>
</SidebarProvider>
```

Key props:
- `collapsible` — `"icon"` | `"offcanvas"` | `"none"`
- `variant` — default | `"inset"` | `"floating"`
- `useSidebar()` hook — exposes `isMobile` for responsive dropdown positioning
- `--sidebar-width` goes on `<SidebarProvider>` as an inline style, **not** in global CSS

`registryDependencies` (sidebar, breadcrumb, card, etc.) install automatically with the block.

### Login blocks (01–05)

UI-only. What agents must add manually:
- Form handling (`react-hook-form` + `zod` + server actions)
- OAuth provider wiring — buttons render as plain `<Button variant="outline">` shells
- Error states and redirect logic

The blocks use the `field` primitive (`<Field>`, `<FieldLabel>`, `<FieldGroup>`, `<FieldDescription>`) — **not** a plain `<label>`. See the Form Field API section in builder rules.

### Signup blocks (01–05)

Parallel structure to login blocks — same UI-only caveat. Add form handling and validation.

### Community registries

```bash
# Search community registries
npx shadcn@latest search dashboard

# Install from a community registry
npx shadcn@latest add @shadcnblocks/dashboard

# Preview registry item before installing
npx shadcn@latest add @shadcnblocks/dashboard --diff
```

148 community registries are available via `@namespace/item` syntax. Always check with `--diff` before installing community items — they may conflict with existing components.

---

## base vs radix

Check `base` from `npx shadcn@latest info` before writing any component code. The two primitives have different APIs:

| Area | radix | base |
|------|-------|------|
| Custom trigger | `asChild` prop | `render` prop |
| Button as link | `<Button asChild><a>` | `<Button render={<a />} nativeButton={false}>` |
| Select items | Inline JSX only | Requires `items` prop on root + JSX |
| Select placeholder | `<SelectValue placeholder="…">` | `{ value: null }` item in items array |
| ToggleGroup single | `type="single"` + string `defaultValue` | No `type` prop + array `defaultValue` |
| ToggleGroup multi | `type="multiple"` | `multiple` boolean prop |
| Slider | Array always (`defaultValue={[50]}`) | Plain number for single thumb (`defaultValue={50}`) |
| Accordion | `type="single"/"multiple"` + `collapsible` + string `defaultValue` | `multiple` boolean + array `defaultValue` |

**Trigger composition:**

```tsx
// radix
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>

// base
<DialogTrigger render={<Button />}>Open</DialogTrigger>
```

For full API differences with code examples, read `${CLAUDE_SKILL_DIR}/shadcn-theming.md` or run `npx shadcn@latest docs <component>`.

---

## Critical rules

1. **Never overwrite components.json** — shadcn init writes it; subsequent adds read it. The `style`, `tailwind.baseColor`, and `tailwind.cssVariables` fields are immutable after init — changing them requires deleting all installed components and reinstalling
2. **Check for existing files before overwriting** — `globals.css` may already have Tailwind imports
3. **Tailwind v4 source scoping** — if the repo has non-source files with CSS class names (`.design/`, `gsp/`), add `source("../")` to the `@import "tailwindcss"` line to limit scanning
4. **Import alias consistency** — all generated code must use the alias from `shadcn info` (`@/` or `~/`), never relative paths to component files
5. **Never hardcode colors** — use `bg-primary`, `text-muted-foreground`, `border-border`, etc. — never `bg-blue-500`
6. **Install components before applying the brand theme** — run `shadcn add` first; then install the brand theme via `/gsp-brand-apply`. Reversing this order risks shadcn appending its own vars after yours

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
