---
name: lorem-and-placeholder-copy
tier: flag-only
severity: high
category: copy
brand-override:
  mute-when: []  # no brand allows lorem ipsum in prod
references:
  - https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/
---

# Symptom

Lorem ipsum, generic names ("John Doe"), "Click here", "Acme Inc", `example@email.com` — placeholder copy that survived from scaffolding into production code.

# Detection

Scope: `.tsx`, `.jsx`, `.mdx`, `.md`. EXCLUDES files matching:
- `*.stories.*`
- `*.test.*`, `*.spec.*`
- `_*` (Storybook docs prefix)
- `*.fixture.*`

Regex (case-insensitive):

```regex
(lorem ipsum|Lorem\b|John Doe|Jane Doe|jane@example\.|john@example\.|Click here|Acme( Inc| Corp)?|Foo Bar|placeholder text|Sample text|user@example\.)
```

```bash
grep -niE '(lorem ipsum|Lorem\b|John Doe|Jane Doe|jane@example\.|john@example\.|Click here|Acme( Inc| Corp)?|Foo Bar)' "$file"
```

# Why this is flag-only

Copy can't be mechanically rewritten. The replacement depends on:
- Brand voice (`STYLE.md` voice constraints)
- The actual product (what should "John Doe" be replaced with? Real placeholder names? A demo user with character?)
- Context (button label vs. body text vs. avatar name)

# Fix (manual or via brand-strategy skill)

For each finding, the user (or `gsp-brand-strategy` voice guidelines) should:

1. Determine the role of the placeholder (CTA, demo data, microcopy, etc.)
2. Replace with brand-appropriate copy
3. If demo data — consider extracting to a `lib/demo-data.ts` so it's at least clearly fixture-shaped

Polish reports findings as:

```
- {file}:{line} — "{matched text}" — placeholder copy
  context: {30 chars before/after}
  classification: {cta|demo-data|microcopy|body|other}
```

The `classification` is heuristic based on surrounding JSX (e.g., inside `<Button>` → cta; inside `<Avatar>` `alt=` → demo-data; in body text → body).

# Edge cases (do not fire)

- **Storybook / test files** — already excluded
- **Comments** — `// John Doe is a placeholder` — code comments aren't user-visible. Detection should exclude lines starting with `//` or inside `/* */` blocks.
- **String literals in lib/ utilities clearly named as fixtures** — `export const FIXTURE_USER = "John Doe"` — too ambiguous to auto-skip; flag and let user decide.
- **i18n keys** — `t("john_doe_demo_label")` — the key is conventional, not user-facing copy.
