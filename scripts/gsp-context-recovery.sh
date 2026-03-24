#!/usr/bin/env bash
# GSP Context Recovery — re-inject active project/brand state after context compaction
# Called by SessionStart hook (compact matcher) in gsp/hooks/hooks.json
# Output target: 15-25 lines max to minimize context consumption

DESIGN_DIR=".design"

# Silent exit if no .design/ directory
[[ -d "$DESIGN_DIR" ]] || exit 0

OUTPUT=""

# Extract phase names by status from a STATE.md phase table
# Table format: | # | Phase | Status | Started | Completed |
# Usage: extract_phases <file> <status>
extract_phases() {
  awk -F'|' -v status="$2" '{
    gsub(/^[ \t]+|[ \t]+$/, "", $4)
    if ($4 == status) {
      gsub(/^[ \t]+|[ \t]+$/, "", $3)
      printf "%s, ", $3
    }
  }' "$1" 2>/dev/null | sed 's/, $//'
}

# Collect brand state
brand_count=0
for state in "$DESIGN_DIR"/branding/*/STATE.md; do
  [[ -f "$state" ]] || continue
  brand_dir=$(basename "$(dirname "$state")")
  [[ "$brand_dir" == "_"* ]] && continue
  brand_count=$((brand_count + 1))
  [[ $brand_count -gt 2 ]] && continue
  phase=$(grep -m1 '^\*\*Current Phase:\*\*' "$state" | sed 's/.*Current Phase:\*\*[[:space:]]*//')
  pretty=$(grep -m1 '^\*\*Prettiness Level:\*\*' "$state" | sed 's/.*Prettiness Level:\*\*[[:space:]]*//')
  completed=$(extract_phases "$state" "complete")
  current=$(extract_phases "$state" "in-progress")
  OUTPUT+="Brand: $brand_dir | Phase: $phase | $pretty"$'\n'
  [[ -n "$completed" ]] && OUTPUT+="  completed: $completed"$'\n'
  [[ -n "$current" ]] && OUTPUT+="  current: $current"$'\n'
done
[[ $brand_count -gt 2 ]] && OUTPUT+="  (+$((brand_count - 2)) more brands)"$'\n'

# Collect project state
proj_count=0
for state in "$DESIGN_DIR"/projects/*/STATE.md; do
  [[ -f "$state" ]] || continue
  proj_dir=$(basename "$(dirname "$state")")
  proj_count=$((proj_count + 1))
  [[ $proj_count -gt 2 ]] && continue
  brand_ref=$(grep -m1 '^brand:' "$DESIGN_DIR/projects/$proj_dir/brand.ref" 2>/dev/null | sed 's/^brand:[[:space:]]*//')
  phase=$(grep -m1 '^\*\*Current Phase:\*\*' "$state" | sed 's/.*Current Phase:\*\*[[:space:]]*//')
  pretty=$(grep -m1 '^\*\*Prettiness Level:\*\*' "$state" | sed 's/.*Prettiness Level:\*\*[[:space:]]*//')
  completed=$(extract_phases "$state" "complete")
  current=$(extract_phases "$state" "in-progress")
  brand_info=""
  [[ -n "$brand_ref" ]] && brand_info=" | Brand: $brand_ref"
  OUTPUT+="Project: $proj_dir$brand_info | Phase: $phase | $pretty"$'\n'
  [[ -n "$completed" ]] && OUTPUT+="  completed: $completed"$'\n'
  [[ -n "$current" ]] && OUTPUT+="  current: $current"$'\n'
done
[[ $proj_count -gt 2 ]] && OUTPUT+="  (+$((proj_count - 2)) more projects)"$'\n'

# Silent exit if nothing found
[[ -z "$OUTPUT" ]] && exit 0

echo "GSP Context Recovery"
echo "────────────────────"
printf "%s" "$OUTPUT"
echo "────────────────────"
echo "Resume: /gsp:start to pick up where you left off"
