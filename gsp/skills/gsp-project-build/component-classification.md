# Component Classification (Step 4.5)

## Build component manifest

Read ALL design chunks from `{PROJECT_PATH}/design/` — every `screen-{NN}-{name}.md`. Also read:
- `{PROJECT_PATH}/brief/scope.md` (feature map)
- `{PROJECT_PATH}/brief/target-adaptations.md` (component adaptations)
- `{BRAND_PATH}/patterns/components/token-mapping.md` (if exists)

Extract every component referenced across all screens. Deduplicate. Build a manifest:

```
COMPONENT_MANIFEST = [
  { name: "Button", source: "shadcn", classification: "library-default", screens: [01, 03, 05] },
  { name: "Card", source: "shadcn", classification: "library-customize", screens: [01, 02, 04], overrides: "custom radius + shadow from STYLE.md" },
  { name: "PricingTier", source: "custom", classification: "custom", screens: [03] },
  ...
]
```

## Classify each component

| Category | Criteria | Action |
|----------|----------|--------|
| `library-default` | Exists in target library, no brand overrides needed | Install as-is |
| `library-customize` | Exists in target library, STYLE.md or token-mapping requires overrides | Install then customize |
| `custom` | No library match, or design requires bespoke component | Build from scratch |
| `existing` | Already in codebase (from scaffold or prior project) | Skip — already available |

## Partition into agent groups

Group components to minimize conflicts:
1. No two agents install the same library component
2. Group related variants together (Card + CardHeader + CardContent + CardFooter → same agent)
3. Balance work across agents (aim for 3-6 components per agent)
4. If total components ≤ 5, use a single agent (no need to parallelize)
