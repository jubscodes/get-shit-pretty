# Brand Feedback Loop (Step 4)

If the user requests adjustments during foundation review:

1. **Apply to project codebase first** — directly or via a quick builder re-run
2. **Ask:** "Should this change also update the brand system? (Other projects using this brand would inherit it.)"
3. **If yes**, spawn a `gsp-brand-engineer` agent **synchronously** (NOT `run_in_background` — Step 4.5 reads the brand `.yml` from disk; updated values must be committed before components begin):
   - Pass: the specific changes made (what tokens/values changed, old → new)
   - Pass: `{BRAND_PATH}/patterns/{brand-name}.yml` and relevant identity chunks
   - Agent updates the `.yml` preset, foundation chunks, and STYLE.md if applicable
   - Agent writes to `{BRAND_PATH}/` — the brand source of truth
4. **Wait for brand sync to complete**, then continue to Step 4.5
