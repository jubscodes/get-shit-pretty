#!/usr/bin/env bash
# GSP Shared Scoring Library
# Sourced by token-budget.sh and benchmark.sh
# Do not run directly.

# ── Constants ────────────────────────────────────────

YELLOW_THRESH=500
RED_THRESH=1000
AGENT_WEIGHT=500
FORK_WEIGHT=300

# ── ANSI Colors ─────────────────────────────────────

GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── Scoring Helpers ─────────────────────────────────

risk_icon() {
  local score=$1
  if (( score >= RED_THRESH )); then echo "✗"
  elif (( score >= YELLOW_THRESH )); then echo "!"
  else echo "✓"
  fi
}

risk_color() {
  local score=$1
  if (( score >= RED_THRESH )); then echo -e "$RED"
  elif (( score >= YELLOW_THRESH )); then echo -e "$YELLOW"
  else echo -e "$GREEN"
  fi
}

# ── Agent Name Cache ────────────────────────────────
# Built once, reused by score_skill(). Caller must set LIB_ROOT before sourcing.

_AGENT_NAMES=()
_AGENT_NAMES_LOADED=false

_load_agent_names() {
  if [[ "$_AGENT_NAMES_LOADED" == "true" ]]; then return; fi
  local root="${LIB_ROOT:-$ROOT}"
  for agent_file in "$root/gsp/agents/gsp-"*.md; do
    if [[ -f "$agent_file" ]]; then
      _AGENT_NAMES+=("$(basename "$agent_file" .md)")
    fi
  done
  _AGENT_NAMES_LOADED=true
}

# ── Skill Scoring ───────────────────────────────────
# Output: score|skill_name|body|exec|agents|fork|methodology|domain_count

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
    local exec_block=$(sed -n '/<execution_context>/,/<\/execution_context>/p' "$skill_md")
    if [[ -n "$exec_block" ]]; then
      while IFS= read -r ref_line; do
        if [[ "$ref_line" =~ @\$\{CLAUDE_SKILL_DIR\}(.*) ]]; then
          local ref_path="${BASH_REMATCH[1]}"
          # Strip inline comments (e.g. " (index only — ...)")
          ref_path="${ref_path%% (*}"
          ref_path="${ref_path%% }"
          local resolved_ref="$skill_dir$ref_path"
          if [[ -f "$resolved_ref" ]]; then
            local ref_lines=$(wc -l < "$resolved_ref" | tr -d ' ')
            exec_context_lines=$((exec_context_lines + ref_lines))
          fi
        fi
      done <<< "$exec_block"
    fi
  fi

  # 3. Agent spawns
  _load_agent_names
  local agent_spawns=0
  if [[ -f "$skill_md" ]]; then
    local found_agents=()
    for agent in "${_AGENT_NAMES[@]:-}"; do
      if grep -q "\`$agent\`" "$skill_md" 2>/dev/null; then
        found_agents+=("$agent")
      elif grep -q "Agent.*:.*$agent\|Agent[0-9].*:.*$agent" "$skill_md" 2>/dev/null; then
        found_agents+=("$agent")
      fi
    done

    local unique_agents=()
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
        methodology_lines=$((methodology_lines + $(wc -l < "$method_file" | tr -d ' ')))
      fi
    done
  fi

  # 6. Domain count
  local domain_count=0
  local domain_dir="$skill_dir/domains"
  if [[ -d "$domain_dir" ]]; then
    domain_count=$(find "$domain_dir" -maxdepth 1 -name "*.md" -type f | wc -l | tr -d ' ')
  fi

  # Calculate score
  local score=$((body_lines + exec_context_lines + (agent_spawns * AGENT_WEIGHT) + (context_fork * FORK_WEIGHT) + methodology_lines))

  echo "$score|$skill_name|$body_lines|$exec_context_lines|$agent_spawns|$context_fork|$methodology_lines|$domain_count"
}

# ── Pipeline Definitions ────────────────────────────

PIPELINE_NAMES=(
  "brand_diamond"
  "project_diamond"
  "quick_flow"
  "full_e2e"
)

PIPELINE_DISPLAY=(
  "brand diamond"
  "project diamond"
  "quick flow"
  "full e2e"
)

PIPELINE_SKILLS=(
  "gsp-start gsp-brand-brief gsp-brand-research gsp-brand-strategy gsp-brand-identity gsp-brand-guidelines"
  "gsp-project-brief gsp-project-research gsp-project-design gsp-project-critique gsp-project-build gsp-project-review"
  "gsp-start gsp-style gsp-project-brief"
  "gsp-start gsp-brand-brief gsp-brand-research gsp-brand-strategy gsp-brand-identity gsp-brand-guidelines gsp-project-brief gsp-project-research gsp-project-design gsp-project-critique gsp-project-build gsp-project-review"
)
