#!/usr/bin/env bash
# GSP Token Budget Analyzer
# Measures per-skill token consumption and flags high-context skills
# Run from repo root: bash dev/scripts/token-budget.sh

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# ── Constants ────────────────────────────────────────

YELLOW_THRESH=500
RED_THRESH=1000
AGENT_WEIGHT=500
FORK_WEIGHT=300

# ANSI colors
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ──────────────────────────────────────────

resolve_path() {
  cd "$(dirname "$1")" 2>/dev/null && echo "$(pwd)/$(basename "$1")" || echo ""
}

color_for_score() {
  local score=$1
  if (( score < YELLOW_THRESH )); then
    echo -e "${GREEN}✓${RESET}"
  elif (( score < RED_THRESH )); then
    echo -e "${YELLOW}!${RESET}"
  else
    echo -e "${RED}✗${RESET}"
  fi
}

icon_for_score() {
  local score=$1
  if (( score < YELLOW_THRESH )); then
    echo "✓"
  elif (( score < RED_THRESH )); then
    echo "!"
  else
    echo "✗"
  fi
}

# ── Skill Scoring ────────────────────────────────────

score_skill() {
  local skill_dir="$1"
  local skill_name=$(basename "$skill_dir")
  local skill_md="$skill_dir/SKILL.md"

  # 1. Body lines
  local body_lines=0
  if [[ -f "$skill_md" ]]; then
    body_lines=$(wc -l < "$skill_md" | tr -d ' ')
  fi

  # 2. Execution context lines from @ references
  local exec_context_lines=0
  if [[ -f "$skill_md" ]]; then
    # Extract everything between <execution_context> and </execution_context>
    local exec_block=$(sed -n '/<execution_context>/,/<\/execution_context>/p' "$skill_md")
    if [[ -n "$exec_block" ]]; then
      # Find all @${CLAUDE_SKILL_DIR}/... references
      while IFS= read -r ref_line; do
        # Match lines with @ references
        if [[ "$ref_line" =~ @\$\{CLAUDE_SKILL_DIR\}(.*) ]]; then
          local ref_path="${BASH_REMATCH[1]}"
          # Replace ${CLAUDE_SKILL_DIR} with the actual skill directory
          local resolved_ref="$skill_dir$ref_path"

          if [[ -f "$resolved_ref" ]]; then
            local ref_lines=$(wc -l < "$resolved_ref" | tr -d ' ')
            exec_context_lines=$((exec_context_lines + ref_lines))
          fi
        fi
      done <<< "$exec_block"
    fi
  fi

  # 3. Agent spawns (unique agent names from gsp/agents/ that appear in SKILL.md)
  # Only count agents that are actually spawned (in objective or step sections with backticks or Agent:)
  local agent_spawns=0
  if [[ -f "$skill_md" ]]; then
    # Get list of agent files that exist
    local agent_names
    agent_names=()
    for agent_file in "$ROOT/gsp/agents/gsp-"*.md; do
      if [[ -f "$agent_file" ]]; then
        local agent_name
        agent_name=$(basename "$agent_file" .md)
        agent_names+=("$agent_name")
      fi
    done

    # Count unique agents spawned (referenced in objective or with "Agent:" prefix)
    # Look for: `gsp-agent-name` or **Agent:** gsp-agent-name or **Agent 1:** gsp-agent-name
    local found_agents
    found_agents=()
    for agent in "${agent_names[@]:-}"; do
      # Check for backtick references (e.g., `gsp-project-critic`)
      if grep -q "\`$agent\`" "$skill_md" 2>/dev/null; then
        found_agents+=("$agent")
      # Check for Agent: prefix (e.g., **Agent:** `gsp-...` or Agent X: gsp-...)
      elif grep -q "Agent.*:.*$agent\|Agent[0-9].*:.*$agent" "$skill_md" 2>/dev/null; then
        found_agents+=("$agent")
      fi
    done

    # Remove duplicates and count
    local unique_agents
    unique_agents=()
    for agent in "${found_agents[@]:-}"; do
      if [[ ! " ${unique_agents[@]:-} " =~ " ${agent} " ]]; then
        unique_agents+=("$agent")
      fi
    done
    agent_spawns=${#unique_agents[@]:-0}
  fi

  # 4. Context fork
  local context_fork=0
  if [[ -f "$skill_md" ]] && grep -q "context: fork" "$skill_md"; then
    context_fork=1
  fi

  # 5. Methodology lines
  local methodology_lines=0
  local methodology_dir="$skill_dir/methodology"
  if [[ -d "$methodology_dir" ]]; then
    for method_file in "$methodology_dir"/*.md; do
      if [[ -f "$method_file" ]]; then
        local method_lines=$(wc -l < "$method_file" | tr -d ' ')
        methodology_lines=$((methodology_lines + method_lines))
      fi
    done
  fi

  # 6. Domain count (for reporting, not scoring)
  local domain_count=0
  local domain_dir="$skill_dir/domains"
  if [[ -d "$domain_dir" ]]; then
    domain_count=$(find "$domain_dir" -maxdepth 1 -name "*.md" -type f | wc -l | tr -d ' ')
  fi

  # Calculate score
  local agent_score=$((agent_spawns * AGENT_WEIGHT))
  local fork_score=$((context_fork * FORK_WEIGHT))
  local score=$((body_lines + exec_context_lines + agent_score + fork_score + methodology_lines))

  # Output result
  echo "$score|$skill_name|$body_lines|$exec_context_lines|$agent_spawns|$context_fork|$methodology_lines|$domain_count"
}

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

      # Extract score for total
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

    # Construct detail string
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

    local icon=$(icon_for_score "$score")
    printf "  %s %-35s %4d  (%s)\n" "$icon" "$skill_name" "$score" "$details"
  done

  echo ""
  echo "  $skill_count skills scored · total weight: $total_score"
  echo ""

  # ── Pipeline Paths ───────────────────────────────────────
  echo "── Pipeline Paths ───────────────────────────────────────"

  # Define pipeline paths as associative arrays
  # Order matters for display, so use indexed arrays with ordered paths
  declare -a path_names=(
    "brand diamond"
    "project diamond"
    "quick flow"
    "full e2e"
  )

  declare -a path_skills=(
    "gsp-start gsp-brand-brief gsp-brand-research gsp-brand-strategy gsp-brand-identity gsp-brand-guidelines"
    "gsp-project-brief gsp-project-research gsp-project-design gsp-project-critique gsp-project-build gsp-project-review"
    "gsp-start gsp-style gsp-project-brief"
    "gsp-start gsp-brand-brief gsp-brand-research gsp-brand-strategy gsp-brand-identity gsp-brand-guidelines gsp-project-brief gsp-project-research gsp-project-design gsp-project-critique gsp-project-build gsp-project-review"
  )

  # Score each path
  for i in "${!path_names[@]}"; do
    local path_name="${path_names[$i]}"
    local skills_str="${path_skills[$i]}"
    local path_score=0
    local path_count=0
    local heaviest_skill=""
    local heaviest_score=0

    # Parse and score each skill in the path
    for skill_name in $skills_str; do
      local skill_dir="$ROOT/gsp/skills/$skill_name"
      if [[ -d "$skill_dir" ]]; then
        path_count=$((path_count + 1))
        result=$(score_skill "$skill_dir")

        # Extract score
        local score="${result%%|*}"
        path_score=$((path_score + score))

        # Track heaviest skill
        if (( score > heaviest_score )); then
          heaviest_score=$score
          heaviest_skill=$skill_name
        fi
      fi
    done

    # Determine color based on average score per skill
    local avg_score=0
    if (( path_count > 0 )); then
      avg_score=$((path_score / path_count))
    fi

    local color=""
    if (( avg_score < YELLOW_THRESH )); then
      color=$GREEN
    elif (( avg_score < RED_THRESH )); then
      color=$YELLOW
    else
      color=$RED
    fi

    # Print path with color
    printf "  ${color}%-25s${RESET} %5d  (%d skills, heaviest: %s at %d)\n" \
      "$path_name" "$path_score" "$path_count" "$heaviest_skill" "$heaviest_score"
  done

  echo ""
}

main "$@"
