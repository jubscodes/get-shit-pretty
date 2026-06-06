# PostCSS + Tailwind v4 source scoping

Shared across all web stacks. Loaded on demand by `gsp-scaffold/SKILL.md` Step 3.

## PostCSS config

If using Tailwind and no `postcss.config.mjs` exists, create it.

Check the installed Tailwind version first (`node -e "console.log(require('tailwindcss/package.json').version)"`):

- **Tailwind v4:** Use `@tailwindcss/postcss` plugin
- **Tailwind v3:** Use `tailwindcss` and `autoprefixer` plugins

```javascript
// Tailwind v4
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

## Tailwind v4 source scoping

**Critical:** Tailwind v4 auto-detects source files for class scanning. In repos that contain non-source files with CSS class names (e.g., `.design/` markdown specs, `gsp/` skill files that mention Tailwind utilities), the scanner will try to resolve arbitrary strings as modules and fail the build.

When using the `@import "tailwindcss"` directive, scope the source to the app's source directory:

```css
@import "tailwindcss" source("../");
```

This limits scanning to `src/` and its siblings rather than the entire repo. Note that `shadcn init` may overwrite `globals.css` — if it does, verify its output still compiles. shadcn v4+ handles source scoping correctly in its own CSS output.
