# Stack init — Next.js + shadcn

Loaded on demand by `gsp-scaffold/SKILL.md` Step 3 when `tech_stack` is Next.js + shadcn. All shell commands run in `APP_PATH` (`cd {APP_PATH} && ...`). Only create what's missing — check before overwriting.

## Greenfield

First, try `create-next-app`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

**If `create-next-app` fails** (e.g., directory has existing files — common when the project lives inside an existing repo), fall back to manual setup:

1. Install deps directly:
```bash
npm install --save-dev next react react-dom typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss
```

2. Create config files (only if they don't exist):
   - `next.config.mjs` — minimal Next.js config
   - `tsconfig.json` — standard Next.js TypeScript config with `@/*` path alias pointing to `./src/*`
   - `postcss.config.mjs` — see `postcss-and-tailwind.md`

3. Create minimal app structure:
   - `src/app/layout.tsx` — root layout with metadata
   - `src/app/page.tsx` — placeholder page
   - `src/app/globals.css` — Tailwind import (see `postcss-and-tailwind.md` for v4 source scoping)

4. Run `npx next build` to verify the base stack compiles before proceeding.

Then initialize shadcn:
```bash
npx shadcn@latest init -d
```

## Existing

```bash
# Only init shadcn if components.json doesn't exist
npx shadcn@latest init -d
```
