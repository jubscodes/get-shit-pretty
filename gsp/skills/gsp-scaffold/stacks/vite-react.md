# Stack init — Vite + React

Loaded on demand by `gsp-scaffold/SKILL.md` Step 3 when `tech_stack` is Vite + React. All commands run in `APP_PATH` (`cd {APP_PATH} && ...`). Only create what's missing.

```bash
# Only if no vite.config exists
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
```

For PostCSS config and Tailwind v4 source scoping, see `postcss-and-tailwind.md`.
