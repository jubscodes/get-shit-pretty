---
name: add-reference
description: Add reference material to a project
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - AskUserQuestion
---
<context>
Adds reference material (screenshots, wireframes, brand guidelines, competitor examples, design specs, URLs) to a project's `references/` directory for use by all downstream agents.

References are loaded by design, build, and research commands and passed to their agents as additional context.
</context>

<objective>
Add reference material to a project for downstream agents to consume.

**Input:** User-provided files, URLs, or descriptions
**Output:** `{project}/references/` with organized reference files + `references/INDEX.md`
</objective>

<process>
## Step 0: Resolve project

Scan `.design/projects/` for project directories. If only one project exists, use it. If multiple, ask the user which project to work on.

Set `PROJECT_PATH` = `.design/projects/{project}`

## Step 1: Ensure references directory

```bash
mkdir -p {PROJECT_PATH}/references
```

## Step 2: Determine reference type

If the user provided a file path, URL, or description in the command invocation, use that. Otherwise, ask:

Use `AskUserQuestion` with options:
- **Screenshot or image** — "Add a screenshot, mockup, or wireframe"
- **URL** — "Save a webpage or design reference from a URL"
- **Competitor example** — "Document a competitor's approach"
- **Brand guidelines** — "Add existing brand guidelines or style guide"
- **Design spec** — "Add a design specification or requirements doc"
- **Other** — "Add any other reference material"

## Step 3: Process reference

**For file paths (images, PDFs, documents):**
1. Verify the file exists
2. Copy to `{PROJECT_PATH}/references/` with a descriptive name
3. If it's an image, read it to generate a text description
4. Write a companion `.md` file with metadata (source, date added, description, relevant screens/phases)

**For URLs:**
1. Fetch the URL content
2. Write a summary to `{PROJECT_PATH}/references/url-{kebab-name}.md` with:
   - Source URL
   - Date captured
   - Key takeaways
   - Relevant screens/phases
   - Screenshots or key quotes

**For descriptions/notes:**
1. Write to `{PROJECT_PATH}/references/note-{kebab-name}.md` with:
   - Description
   - Date added
   - Relevant screens/phases

## Step 4: Update index

Write or update `{PROJECT_PATH}/references/INDEX.md`:

```markdown
# Project References
> Project: {name} | Last updated: {DATE}

## References

| # | Reference | Type | File | Added | Relevant To |
|---|-----------|------|------|-------|-------------|
| 1 | {description} | {screenshot/url/note/guideline} | [{filename}](./{filename}) | {DATE} | {screens/phases} |
```

## Step 5: Confirm

Display what was added and which phases will use it:
- Research agents scan references for competitive context
- Design agents use references as visual/functional inspiration
- Build agents reference implementation examples
- Review agents check against reference expectations

"Reference added. It will be available to all downstream phases."
</process>
