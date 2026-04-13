# shadcn/ui Rules — Tier 2: Component Composition

Rules for the build phase. The builder agent reads this to compose shadcn components correctly.

---

## The `cn()` helper

All conditional class merging uses `cn()` from `@/lib/utils`:

```ts
import { cn } from "@/lib/utils"

// Correct
<Button className={cn("mt-4", isActive && "ring-2 ring-ring")} />

// Wrong — never string-concatenate classes
<Button className={"mt-4" + (isActive ? " ring-2 ring-ring" : "")} />
```

`cn` is `clsx` + `tailwind-merge`. It handles class deduplication and Tailwind conflict resolution automatically.

---

## Semantic color tokens — always use these

| Instead of | Use |
|------------|-----|
| `bg-white` / `bg-black` | `bg-background` |
| `text-gray-900` | `text-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `bg-gray-100` | `bg-muted` |
| `bg-gray-50` | `bg-secondary` |
| `border-gray-200` | `border-border` |
| `ring-blue-500` | `ring-ring` |
| raw hex/rgb | Never — always a token |

shadcn components use these tokens internally. Using them in custom code makes dark mode automatic.

---

## Slot pattern (asChild)

Use `asChild` to merge props into a child component without an extra DOM node:

```tsx
// Button as a link
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>

// Never add an <a> inside <Button> without asChild
```

---

## Variants with `cva`

For custom components that need multiple variants, use `cva` (class-variance-authority):

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      elevated: {
        true: "shadow-lg",
        false: "shadow-sm",
      },
    },
    defaultVariants: {
      size: "md",
      elevated: false,
    },
  }
)

interface CardProps extends VariantProps<typeof cardVariants> {
  className?: string
}
```

---

## Composing shadcn primitives

shadcn components are composed from their sub-parts:

```tsx
// Card with all sub-parts
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Rule:** never nest card-level markup inside `<Card>` without using `CardHeader`/`CardContent`/`CardFooter` — it breaks the spacing contract.

---

## Dialog / Sheet

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

`DialogDescription` is required for accessibility — the dialog announces it to screen readers. Omitting it triggers a console warning.

---

## Form + react-hook-form

shadcn Form wraps react-hook-form. Always use the `<Form>` components for labeled inputs — never raw `<input>`:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" {...field} />
          </FormControl>
          <FormDescription>We'll never share your email.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

`FormMessage` renders validation errors automatically from react-hook-form's state.

---

## Sizing utilities

| Instead of | Use |
|------------|-----|
| `w-6 h-6` | `size-6` (when width === height) |
| `space-y-4` | `gap-4` (prefer `flex`/`grid` with `gap`) |
| `mr-2` on icon | `gap-2` on parent flex container |

---

## Server Components (RSC)

Check `isRSC` from `npx shadcn@latest info --json`. If true:
- shadcn components work as Server Components by default
- Only add `"use client"` when a component uses `useState`, `useEffect`, event handlers, or browser APIs
- Prefer `onClick` on leaf elements rather than wrapping entire sections in `"use client"`

```tsx
// Correct — only the interactive button is a client component
// page.tsx (Server Component)
import { SubmitButton } from "./submit-button" // "use client"

// Wrong — entire section becomes client component unnecessarily
"use client"
export function Section() { ... }
```

---

## Icon imports

Use the icon library from `shadcn info`:

```tsx
// lucide-react (default for most styles)
import { ChevronRight, Settings, User } from "lucide-react"

// @tabler/icons-react (some styles)
import { IconChevronRight, IconSettings } from "@tabler/icons-react"
```

Never import from both in the same project — check `iconLibrary` once and use it everywhere.

---

## Customization rules

1. **Override via className** — always add `className` on top of the component's defaults, never fork the component file unless strictly necessary
2. **CSS variables over arbitrary values** — `text-[#FF0000]` is a code smell; use a token instead
3. **Brand effects go in globals.css as utilities** — create `.shadow-brand`, `.glow-accent` etc. as CSS utilities; use them as Tailwind class names
4. **Never edit generated component files for visual tweaks** — only edit for structural/API changes. Token changes in globals.css automatically propagate
