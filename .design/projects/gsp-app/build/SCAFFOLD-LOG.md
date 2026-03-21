# Scaffold Log

> Phase: build (scaffold) | Project: gsp-app | Generated: 2026-03-20

## Stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | Next.js | 16.2.0 |
| CSS | Tailwind CSS | 4.2.2 |
| Components | shadcn/ui | 4.1.0 |
| Language | TypeScript | 5.9.3 |

## Commands Run

| # | Command | Status |
|---|---------|--------|
| 1 | `npm install --save-dev next react react-dom typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss` | success |
| 2 | `npx next build` (initial verification) | success |
| 3 | `npx shadcn@latest init -d` | success |
| 4 | `npx shadcn@latest add navigation-menu sheet separator scroll-area card badge tooltip` | success |
| 5 | `npx shadcn@latest add visually-hidden` | failed (not in registry) |
| 6 | `npm install @next/mdx @mdx-js/loader @mdx-js/react shiki sonner` | success |
| 7 | `npx next build` (final verification) | success |

## Components Installed

| Component | Source |
|-----------|--------|
| button | shadcn (via init) |
| navigation-menu | shadcn |
| sheet | shadcn |
| separator | shadcn |
| scroll-area | shadcn |
| card | shadcn |
| badge | shadcn |
| tooltip | shadcn |

## Dependencies Added

### devDependencies
- next, react, react-dom, typescript
- @types/node, @types/react, @types/react-dom
- tailwindcss, @tailwindcss/postcss, postcss

### dependencies
- @base-ui/react, class-variance-authority, clsx, lucide-react
- shadcn, tailwind-merge, tw-animate-css
- @next/mdx, @mdx-js/loader, @mdx-js/react
- shiki, sonner

## Config Files Created

| File | Purpose |
|------|---------|
| next.config.mjs | Next.js config |
| tsconfig.json | TypeScript config (updated by Next.js on first build) |
| postcss.config.mjs | PostCSS with @tailwindcss/postcss plugin |
| components.json | shadcn/ui config |
| src/app/globals.css | Tailwind v4 + shadcn theme tokens |
| src/app/layout.tsx | Root layout with Geist font |
| src/app/page.tsx | Placeholder home page |
| src/lib/utils.ts | cn() utility |
| src/components/ui/*.tsx | 8 shadcn components |

## Build Verification

- **Command:** `npx next build`
- **Result:** pass
- **Output:** Compiled successfully in 1306ms, 2 static routes (/, /_not-found)

## Issues

- `visually-hidden` component not available in shadcn registry (base-nova style). Can be implemented as a simple utility component during foundations phase.
- `create-next-app` could not run at repo root due to existing files — set up Next.js manually (config files + src/ structure) instead.
- Tailwind v4 auto-source detection picked up markdown files in `.design/` and `gsp/` containing CSS class names, causing build failure. Fixed by scoping source to `src/` via `@import "tailwindcss" source("../")` (shadcn init then overwrote this with its own config).
