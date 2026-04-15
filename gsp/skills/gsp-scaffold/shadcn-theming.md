# shadcn/ui Theming Reference

Agent reference for building and fixing shadcn/ui themes. Source: https://ui.shadcn.com/docs/theming

---

## How theming works

shadcn uses **CSS custom properties** as semantic tokens. Components reference tokens like `bg-primary` or `text-muted-foreground` — never raw colors. Tokens are defined in `:root` (light) and `.dark` (dark), then aliased into Tailwind via `@theme inline`.

```
CSS custom property (:root / .dark)
        ↓
@theme inline alias (--color-primary: var(--primary))
        ↓
Tailwind utility (bg-primary, text-primary-foreground)
        ↓
Component (Button, Card, etc.)
```

Changing a token in `:root`/`.dark` immediately affects every component that uses it. Never hardcode colors in components.

---

## Full token reference

All tokens are OKLCH values (`oklch(L C H)`). No `hsl()` wrapper.

### Surface tokens (background / foreground pairs)

| Token | Controls | Used by |
|-------|----------|---------|
| `--background` / `--foreground` | Default app background and text | Page shell, body |
| `--card` / `--card-foreground` | Elevated surfaces | `Card`, panels |
| `--popover` / `--popover-foreground` | Floating surfaces | `Popover`, `DropdownMenu`, `ContextMenu` |
| `--muted` / `--muted-foreground` | Subtle surfaces and subdued text | Descriptions, placeholders, helper text, empty states |

**Convention:** the base token is the surface color; `-foreground` is the text/icon color sitting on it. The `background` suffix is omitted from the surface token — `primary` is the surface, `primary-foreground` is the text on it.

### Semantic action tokens

| Token | Controls | Used by |
|-------|----------|---------|
| `--primary` / `--primary-foreground` | High-emphasis brand actions | Default `Button`, selected states, active accents |
| `--secondary` / `--secondary-foreground` | Lower-emphasis filled actions | Secondary buttons, supporting UI |
| `--accent` / `--accent-foreground` | Hover, focus, and active states | Ghost buttons, menu highlights, hovered rows |
| `--destructive` | Destructive actions and errors | Destructive `Button`, invalid states |

### Form and border tokens

| Token | Controls | Used by |
|-------|----------|---------|
| `--border` | Default borders and separators | Cards, menus, tables, separators |
| `--input` | Form control borders | `Input`, `Textarea`, `Select`, outline controls |
| `--ring` | Focus rings | Buttons, inputs, checkboxes, focusable elements |

### Chart tokens

| Token | Controls |
|-------|----------|
| `--chart-1` … `--chart-5` | Default chart palette |

**Chart token rules (Recharts v3):**
- Reference as `fill="var(--chart-1)"` or `fill="var(--color-chart-1)"` — **no `hsl()` wrapper**
- Must appear in both `:root` AND `.dark` blocks
- Use in `chartConfig` as `color: "var(--chart-1)"`

### Sidebar tokens

| Token | Controls |
|-------|----------|
| `--sidebar` / `--sidebar-foreground` | Sidebar surface and default text |
| `--sidebar-primary` / `--sidebar-primary-foreground` | Active items, icon tiles, badges |
| `--sidebar-accent` / `--sidebar-accent-foreground` | Hover states, open items |
| `--sidebar-border` | Sidebar borders and separators |
| `--sidebar-ring` | Focus rings inside sidebar |

**Sidebar width:** set via inline style on `<SidebarProvider>`, not as a global CSS token:
```tsx
<SidebarProvider style={{ "--sidebar-width": "19rem" } as React.CSSProperties}>
```

### Radius tokens

`--radius` is the single source of truth. All other radius values derive from it:

```css
@theme inline {
  --radius-sm:  calc(var(--radius) * 0.6);
  --radius-md:  calc(var(--radius) * 0.8);
  --radius-lg:  var(--radius);             /* base */
  --radius-xl:  calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}
```

Change `--radius` in `:root` to shift the entire radius scale.

---

## Minimal globals.css structure (Tailwind v4)

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";          /* NOT tw-animate-css */

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Color aliases — do NOT put actual values here */
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
  /* Radius scale */
  --radius-sm:  calc(var(--radius) * 0.6);
  --radius-md:  calc(var(--radius) * 0.8);
  --radius-lg:  var(--radius);
  --radius-xl:  calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  /* Fonts (literal values, not var() self-references) */
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* … all tokens … */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* … all dark overrides … chart tokens MUST be here too … */
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

---

## Adding custom tokens

To add a new semantic token (e.g. `warning`):

```css
/* 1. Define values in :root and .dark */
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
```

**Tailwind v4** — alias in `@theme inline`:

```css
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

**Tailwind v3** — register in `tailwind.config.js` instead:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        warning: "oklch(var(--warning) / <alpha-value>)",
        "warning-foreground": "oklch(var(--warning-foreground) / <alpha-value>)",
      },
    },
  },
}
```

Check `tailwindVersion` from `npx shadcn@latest info` to know which to use. Always edit the file at `tailwindCssFile` from the same output — never create a new CSS file.

Now use `bg-warning` and `text-warning-foreground` in components.

---

## Changing the theme via preset

The fastest way to change the full theme is via `apply`:

```bash
# Apply a preset to an existing project (overwrites detected components, fonts, CSS vars)
npx shadcn@latest apply --preset a2r6bw
npx shadcn@latest apply nova              # shorthand for named preset

# Preserve existing components — update config and CSS only
npx shadcn@latest init --preset nova --force --no-reinstall
```

Named presets: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`

Preset codes (e.g. `a2r6bw`) come from `ui.shadcn.com/create`. Pass them directly — never decode them manually.

---

## Dark mode setup (Next.js)

```bash
npm install next-themes
```

```tsx
// components/theme-provider.tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- `attribute="class"` — sets `.dark` class on `<html>`
- `suppressHydrationWarning` — required to avoid SSR/client mismatch on theme class
- For dark-by-default or light-only apps, skip `ThemeProvider` and hardcode `<html className="dark">` or leave it unset

---

## Common theming bugs and fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Colors look washed out / all grey | `components.json` has `cssVariables: false` | Re-init with `cssVariables: true` (must delete + reinstall components) |
| Dark mode colors not applying | `.dark` block missing from `globals.css` | Add `.dark { }` block with all dark overrides |
| Chart colors ignore dark mode | Chart tokens only in `:root`, not `.dark` | Add `--chart-1` … `--chart-5` to `.dark` block |
| `bg-primary` renders nothing | Token missing from `@theme inline` | Add `--color-primary: var(--primary)` to `@theme inline` |
| Sidebar wrong color | Using old `--sidebar-background` token name | Rename to `--sidebar` (shadcn v2 token rename) |
| Font not applying | `--font-sans: var(--font-sans)` self-reference | Use literal value: `--font-sans: "Inter", sans-serif` |
| Tailwind v4 `hsl()` not resolving | Tokens are OKLCH but wrapped in `hsl()` | Remove `hsl()` wrapper — write `oklch(L C H)` directly |
| Animations missing / broken | Using `tw-animate-css` | Switch to `@import "shadcn/tailwind.css"` |
| `shadcn add` overwrites custom tokens | Components installed after token injection | Install all components first, then write tokens |
| Radius not scaling | `--radius-sm` etc. hardcoded instead of derived | Use `calc(var(--radius) * N)` in `@theme inline` |
| Buttons missing pointer cursor | Tailwind v4 changed button cursor default | Add cursor rule to `@layer base` (see template above) |

---

## Base color options

`tailwind.baseColor` in `components.json` controls the default neutral values generated at init. Options: **Neutral**, **Stone**, **Zinc**, **Mauve**, **Olive**, **Mist**, **Taupe**.

This is set once at init and should not be changed — changing it requires deleting and reinstalling all components.
