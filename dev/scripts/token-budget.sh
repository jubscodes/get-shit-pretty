#!/usr/bin/env bash
# GSP Token Budget Analyzer
# Measures per-skill token consumption and flags high-context skills
# Run from repo root: bash dev/scripts/token-budget.sh

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LIB_ROOT="$ROOT"
cd "$ROOT" || exit 1

# ── Shared scoring lib ──────────────────────────────

source "$ROOT/dev/scripts/lib-scoring.sh"

# ── Main ─────────────────────────────────────────────

main() {
  echo -e "\n${BOLD}Token Budget Analysis${RESET}\n"
  echo "── Per-Skill Scores ──────────────────────────────────────"

  # Collect all skill scores
  local results=()
  local total_score=0
  local skill_count=0

  for skill_dir in "$ROOT/gsp/skills/gsp-"*/; do
    if [[ -d "$skill_dir" ]]; then
      skill_count=$((skill_count + 1))
      result=$(score_skill "$skill_dir")
      results+=("$result")

      local score="${result%%|*}"
      total_score=$((total_score + score))
    fi
  done

  # Sort results by score descending
  local sorted_results=()
  while IFS= read -r line; do
    sorted_results+=("$line")
  done < <(printf '%s\n' "${results[@]}" | sort -t'|' -k1 -nr)

  # Print results
  for result in "${sorted_results[@]}"; do
    IFS='|' read -r score skill_name body_lines exec_context_lines agent_spawns context_fork methodology_lines domain_count <<< "$result"

    local details="$body_lines body"

    if (( exec_context_lines > 0 )); then
      details="$details + $exec_context_lines exec"
    fi

    if (( agent_spawns > 0 )); then
      details="$details + ${AGENT_WEIGHT}x$agent_spawns agent"
    fi

    if (( context_fork > 0 )); then
      details="$details + ${FORK_WEIGHT}x$context_fork fork"
    fi

    if (( methodology_lines > 0 )); then
      details="$details + $methodology_lines methodology"
    fi

    local icon
    icon=$(risk_icon "$score")
    printf "  %s %-35s %4d  (%s)\n" "$icon" "$skill_name" "$score" "$details"
  done

  echo ""
  echo "  $skill_count skills scored · total weight: $total_score"
  echo ""

  # ── Pipeline Paths ───────────────────────────────────────
  echo "── Pipeline Paths ───────────────────────────────────────"

  for i in "${!PIPELINE_NAMES[@]}"; do
    local path_name="${PIPELINE_DISPLAY[$i]}"
    local skills_str="${PIPELINE_SKILLS[$i]}"
    local path_score=0
    local path_count=0
    local heaviest_skill=""
    local heaviest_score=0

    for skill_name in $skills_str; do
      local skill_dir="$ROOT/gsp/skills/$skill_name"
      if [[ -d "$skill_dir" ]]; then
        path_count=$((path_count + 1))
        result=$(score_skill "$skill_dir")

        local score="${result%%|*}"
        path_score=$((path_score + score))

        if (( score > heaviest_score )); then
          heaviest_score=$score
          heaviest_skill=$skill_name
        fi
      fi
    done

    local color
    color=$(risk_color $((path_count > 0 ? path_score / path_count : 0)))
    printf "  ${color}%-25s${RESET} %5d  (%d skills, heaviest: %s at %d)\n" \
      "$path_name" "$path_score" "$path_count" "$heaviest_skill" "$heaviest_score"
  done

  echo ""
}

main "$@"
