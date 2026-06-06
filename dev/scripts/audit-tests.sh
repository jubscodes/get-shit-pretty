#!/usr/bin/env bash
# GSP Integrity Test Suite
# Run from repo root: bash dev/scripts/audit-tests.sh [suite]
# Suites: all, versions, contracts, installer, runtime, templates, unit, prompts, tokenbudget, references
# Exit code: number of failures

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 1

SUITE="${1:-all}"
PASS=0
FAIL=0
WARN=0
FAILURES=()
WARNINGS=()

# ── Helpers ──────────────────────────────────────────

pass() { PASS=$((PASS + 1)); printf "  \033[32m✓\033[0m %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); FAILURES+=("$1: $2"); printf "  \033[31m✗\033[0m %s — %s\n" "$1" "$2"; }
warn() { WARN=$((WARN + 1)); WARNINGS+=("$1: $2"); printf "  \033[33m!\033[0m %s — %s\n" "$1" "$2"; }
header() { printf "\n\033[1m%s\033[0m\n" "$1"; }
should_run() { [[ "$SUITE" == "all" || "$SUITE" == "$1" ]]; }

# ── V: Version Sync ─────────────────────────────────

if should_run versions; then
  header "Version Sync"

  V_FILE=$(cat VERSION 2>/dev/null | tr -d '[:space:]')
  V_PKG=$(node -e "process.stdout.write(require('./package.json').version)" 2>/dev/null)

  # V1: VERSION and package.json agree
  if [[ "$V_FILE" == "$V_PKG" ]]; then
    pass "V1 Version agreement ($V_FILE)"
  else
    fail "V1 Version mismatch" "VERSION=$V_FILE package.json=$V_PKG"
  fi

  # V2: CHANGELOG has entry for current version
  if [[ -f CHANGELOG.md ]] && grep -q "## $V_FILE\|## \[$V_FILE\]" CHANGELOG.md 2>/dev/null; then
    pass "V2 CHANGELOG covers $V_FILE"
  elif [[ -f CHANGELOG.md ]]; then
    warn "V2 CHANGELOG missing entry" "No section for $V_FILE in CHANGELOG.md"
  else
    warn "V2 CHANGELOG missing" "No CHANGELOG.md found"
  fi

  # V3: VERSION file has no trailing content
  if [[ $(wc -l < VERSION | tr -d ' ') -le 1 ]]; then
    pass "V3 VERSION file is single-line"
  else
    warn "V3 VERSION file has extra lines" "Has extra lines beyond version string"
  fi

  # V5: Template config versions match VERSION
  V5_OK=true
  for cfg in gsp/templates/branding/config.json gsp/templates/projects/config.json; do
    if [[ -f "$cfg" ]]; then
      V_CFG=$(node -e "process.stdout.write(require('./$cfg').version)" 2>/dev/null)
      if [[ "$V_CFG" != "$V_FILE" ]]; then
        V5_OK=false
        fail "V5 Template config version mismatch" "$cfg has $V_CFG, expected $V_FILE"
      fi
    fi
  done
  $V5_OK && pass "V5 Template config versions match ($V_FILE)"

  # V6: CLAUDE.md counts match filesystem
  ACTUAL_SKILLS=$(find gsp/skills -mindepth 2 -maxdepth 2 -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
  ACTUAL_AGENTS=$(find gsp/agents -maxdepth 1 -name 'gsp-*.md' 2>/dev/null | wc -l | tr -d ' ')
  V6_OK=true
  if [[ -f CLAUDE.md ]]; then
    # Check source table counts
    for pair in "skills:$ACTUAL_SKILLS" "agents:$ACTUAL_AGENTS"; do
      kind="${pair%%:*}"
      actual="${pair##*:}"
      # Match patterns like "38 skills", "15 subagents"
      if [[ "$kind" == "agents" ]]; then
        pat="$actual subagents\|$actual agents"
      else
        pat="$actual $kind"
      fi
      if ! grep -q "$pat" CLAUDE.md 2>/dev/null; then
        V6_OK=false
        fail "V6 CLAUDE.md $kind count stale" "Filesystem has $actual, CLAUDE.md doesn't match"
      fi
    done
    # Check installer table agent counts — "(N)" pattern
    INSTALLER_AGENT_COUNTS=$(grep -oE '\(([0-9]+)\)' CLAUDE.md | grep -oE '[0-9]+' | sort -u)
    for count in $INSTALLER_AGENT_COUNTS; do
      if [[ "$count" != "$ACTUAL_AGENTS" && "$count" != "$ACTUAL_SKILLS" ]]; then
        # Only flag if it looks like an agent count (appears in the installer table near "agents")
        if grep -q "agents.*($count)" CLAUDE.md 2>/dev/null; then
          V6_OK=false
          fail "V6 CLAUDE.md installer table agent count stale" "Says ($count), filesystem has $ACTUAL_AGENTS"
        fi
      fi
    done
  fi
  $V6_OK && pass "V6 CLAUDE.md counts match filesystem (skills=$ACTUAL_SKILLS agents=$ACTUAL_AGENTS)"

  # V4: Zero production dependencies
  DEP_COUNT=$(node -e "const d=require('./package.json').dependencies;process.stdout.write(String(d?Object.keys(d).length:0))" 2>/dev/null)
  if [[ "$DEP_COUNT" == "0" || -z "$DEP_COUNT" ]]; then
    pass "V4 No production dependencies in package.json"
  else
    fail "V4 Found $DEP_COUNT production dependencies" "All deps must be in devDependencies — the npm package ships only the installer and skill files"
  fi
fi

# ── C: Contract Checks ──────────────────────────────

if should_run contracts; then
  header "Contracts"

  # C3: Every skill that spawns agents references valid agents
  # Build set of known skill dir names to exclude from agent-reference matching
  SKILL_NAMES=""
  for d in gsp/skills/*/; do
    SKILL_NAMES="$SKILL_NAMES|$(basename "$d")"
  done
  SKILL_NAMES="${SKILL_NAMES#|}" # remove leading pipe

  BAD_SKILL_REFS=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    [[ "$dir" == "get-shit-pretty" ]] && continue
    # Match gsp-word patterns, exclude known skill names and their prefixes
    agents=$(grep -oE '\bgsp-[a-z][-a-z]*[a-z]\b' "$skill" | grep -vE "$SKILL_NAMES" | sort -u)
    # Filter out partial skill name prefixes (e.g. gsp-brand from gsp-brand-{phase})
    filtered=""
    for agent in $agents; do
      is_prefix=false
      for d in gsp/skills/*/; do
        sname=$(basename "$d")
        [[ "$sname" == "$agent"-* ]] && is_prefix=true && break
      done
      $is_prefix || filtered="$filtered $agent"
    done
    agents="$filtered"
    for agent in $agents; do
      if [[ ! -f "gsp/agents/${agent}.md" ]]; then
        BAD_SKILL_REFS+=("${dir}:${agent}")
      fi
    done
  done
  if [[ ${#BAD_SKILL_REFS[@]} -eq 0 ]]; then
    pass "C3 Skill→agent references valid"
  else
    fail "C3 Skills reference missing agents" "${BAD_SKILL_REFS[*]}"
  fi

  # C4: Agent tool lists use valid Claude tool names
  VALID_TOOLS="Read Write Edit Bash Glob Grep WebFetch WebSearch Agent NotebookEdit TodoWrite AskUserQuestion Skill"
  BAD_TOOLS=()
  for agent in gsp/agents/gsp-*.md; do
    tools_line=$(grep -E '^tools:' "$agent" | head -1 | sed 's/^tools:\s*//')
    if [[ -n "$tools_line" ]]; then
      IFS=', ' read -ra tool_list <<< "$tools_line"
      for tool in "${tool_list[@]}"; do
        tool=$(echo "$tool" | tr -d '[:space:]')
        [[ -z "$tool" ]] && continue
        if ! echo "$VALID_TOOLS" | grep -qw "$tool"; then
          BAD_TOOLS+=("$(basename "$agent"):${tool}")
        fi
      done
    fi
  done
  if [[ ${#BAD_TOOLS[@]} -eq 0 ]]; then
    pass "C4 Agent tool lists valid"
  else
    warn "C4 Unknown tools in agents" "${BAD_TOOLS[*]}"
  fi

  # C5: No orphan agents (every agent is spawned by at least one skill)
  ORPHANS=()
  for agent in gsp/agents/gsp-*.md; do
    agent_name=$(basename "$agent" .md)
    found=0
    grep -rlq "$agent_name" gsp/skills/ 2>/dev/null && found=1
    if [[ $found -eq 0 ]]; then
      ORPHANS+=("$agent_name")
    fi
  done
  if [[ ${#ORPHANS[@]} -eq 0 ]]; then
    pass "C5 No orphan agents"
  else
    warn "C5 Orphan agents" "${ORPHANS[*]}"
  fi

  # C6: Agent frontmatter has required fields
  MISSING_FIELDS=()
  for agent in gsp/agents/gsp-*.md; do
    name=$(basename "$agent")
    grep -q '^name:' "$agent" || MISSING_FIELDS+=("${name}:name")
    grep -q '^description:' "$agent" || MISSING_FIELDS+=("${name}:description")
    grep -q '^tools:' "$agent" || MISSING_FIELDS+=("${name}:tools")
  done
  if [[ ${#MISSING_FIELDS[@]} -eq 0 ]]; then
    pass "C6 Agent frontmatter complete"
  else
    fail "C6 Missing agent frontmatter" "${MISSING_FIELDS[*]}"
  fi

  # C7: Skill frontmatter has required fields
  MISSING_SKILL_FIELDS=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    grep -q '^name:' "$skill" || MISSING_SKILL_FIELDS+=("${dir}:name")
    grep -q '^description:' "$skill" || MISSING_SKILL_FIELDS+=("${dir}:description")
  done
  if [[ ${#MISSING_SKILL_FIELDS[@]} -eq 0 ]]; then
    pass "C7 Skill frontmatter complete"
  else
    fail "C7 Missing skill frontmatter" "${MISSING_SKILL_FIELDS[*]}"
  fi

  # C9: User-invocable skills have user-invocable: true
  MISSING_INVOCABLE=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    # Skip non-user-invocable utility skills
    [[ "$dir" == "get-shit-pretty" ]] && continue
    [[ "$dir" == "gsp-phase-transition" ]] && continue
    if ! grep -q '^user-invocable: true' "$skill"; then
      MISSING_INVOCABLE+=("$dir")
    fi
  done
  if [[ ${#MISSING_INVOCABLE[@]} -eq 0 ]]; then
    pass "C9 All skills have user-invocable: true"
  else
    fail "C9 Skills missing user-invocable: true" "${MISSING_INVOCABLE[*]}"
  fi

  # C10: Update skill references valid installer flags
  UPDATE_SKILL="gsp/skills/gsp-update/SKILL.md"
  if [[ -f "$UPDATE_SKILL" ]]; then
    C10_OK=true
    # Must reference all runtime flags the installer accepts
    for flag in --claude --opencode --gemini --codex --local --global --all; do
      if ! grep -q -- "$flag" "$UPDATE_SKILL"; then
        C10_OK=false
      fi
    done
    # Must NOT reference legacy bundle layout (get-shit-pretty/*)
    if grep -q 'get-shit-pretty/\*\|get-shit-pretty/  ' "$UPDATE_SKILL" 2>/dev/null; then
      # Allow legacy VERSION fallback path, but not as a "what gets replaced" item
      if grep -B2 'get-shit-pretty/' "$UPDATE_SKILL" | grep -q 'replaces\|update.*replaces\|clean install'; then
        C10_OK=false
      fi
    fi
    # Must reference current bundle dirs (templates/)
    if ! grep -q "templates/" "$UPDATE_SKILL"; then
      C10_OK=false
    fi
    if $C10_OK; then
      pass "C10 Update skill aligned with installer"
    else
      fail "C10 Update skill drifted from installer" "Check runtime flags, bundle layout, or directory references in gsp-update/SKILL.md"
    fi
  fi

  # C8: Claude-only field usage matches known set (canary)
  EXPECTED_CLAUDE_ONLY="gsp-project-builder.md gsp-project-reviewer.md"
  ACTUAL_CLAUDE_ONLY=$(grep -rlE '^(memory|background|hooks|isolation|skills|mcpServers):' gsp/agents/ 2>/dev/null | xargs -I{} basename {} | sort -u | tr '\n' ' ' | sed 's/ $//')
  if [[ "$ACTUAL_CLAUDE_ONLY" == "$EXPECTED_CLAUDE_ONLY" ]]; then
    pass "C8 Claude-only field usage matches known set ($ACTUAL_CLAUDE_ONLY)"
  else
    warn "C8 Claude-only field set changed" "Expected: $EXPECTED_CLAUDE_ONLY Got: $ACTUAL_CLAUDE_ONLY — verify converters handle new fields"
  fi

  # C11: skills must NOT declare model:/effort: (user controls model selection)
  C11_BAD=()
  for skill_dir in gsp/skills/*/; do
    skill_file="$skill_dir/SKILL.md"
    [[ -f "$skill_file" ]] || continue
    skill_name=$(basename "$skill_dir")
    if grep -q '^model:' "$skill_file" 2>/dev/null; then
      C11_BAD+=("$skill_name:model")
    fi
    if grep -q '^effort:' "$skill_file" 2>/dev/null; then
      C11_BAD+=("$skill_name:effort")
    fi
  done
  if [[ ${#C11_BAD[@]} -eq 0 ]]; then
    pass "C11 No model/effort in skill frontmatter"
  else
    fail "C11 Skills should not declare model/effort (user controls model selection)" "${C11_BAD[*]}"
  fi

  # C12: Skills with context: fork must not have AskUserQuestion in allowed-tools
  C12_BAD=()
  for skill_dir in gsp/skills/*/; do
    skill_file="$skill_dir/SKILL.md"
    [[ -f "$skill_file" ]] || continue
    skill_name=$(basename "$skill_dir")
    if grep -q '^context: fork' "$skill_file" 2>/dev/null; then
      if grep -q 'AskUserQuestion' "$skill_file" 2>/dev/null; then
        C12_BAD+=("$skill_name")
      fi
    fi
  done
  if [[ ${#C12_BAD[@]} -eq 0 ]]; then
    pass "C12 Forked skills have no AskUserQuestion"
  else
    fail "C12 Forked skills with AskUserQuestion" "${C12_BAD[*]}"
  fi

  # C13: Every brand .yml in the workspace has a sibling .theme.json
  # Skipped in fresh checkouts that have no brand artifacts.
  YML_COUNT=0
  MISSING=()
  while IFS= read -r yml; do
    YML_COUNT=$((YML_COUNT + 1))
    THEME="${yml%.yml}.theme.json"
    [ -f "$THEME" ] || MISSING+=("$yml")
  done < <(find .design/branding -path '*/patterns/*.yml' -type f 2>/dev/null)
  if [ "$YML_COUNT" -eq 0 ]; then
    pass "C13 Brand .theme.json sibling check (no brand artifacts present, skipped)"
  elif [ "${#MISSING[@]}" -eq 0 ]; then
    pass "C13 Brand .theme.json sibling check ($YML_COUNT brand(s) covered)"
  else
    fail "C13 Brand .theme.json sibling check" "missing for: ${MISSING[*]}"
  fi

  # C14: gsp-scaffold no longer references theme-css.js
  # Theme installation moved to gsp-brand-apply; scaffold should be brand-agnostic.
  if grep -qE "theme-css\.js" gsp/skills/gsp-scaffold/SKILL.md 2>/dev/null; then
    fail "C14 Scaffold theme-css separation" "gsp-scaffold/SKILL.md still references theme-css.js — theme install belongs to gsp-brand-apply now"
  else
    pass "C14 Scaffold theme-css separation"
  fi
fi

# ── I: Installer Checks ─────────────────────────────

if should_run installer; then
  header "Installer"

  # I1: Installer syntax is valid
  if node -c bin/install.js 2>/dev/null; then
    pass "I1 Installer syntax valid"
  else
    fail "I1 Installer syntax error" "node -c bin/install.js failed"
  fi

  # I2: Source skill count matches expectations
  SKILL_COUNT=$(find gsp/skills -maxdepth 1 -type d | tail -n +2 | wc -l | tr -d ' ')
  if [[ "$SKILL_COUNT" -ge 20 ]]; then
    pass "I2 Skills exist ($SKILL_COUNT)"
  else
    warn "I2 Low skill count" "Expected ≥20, found $SKILL_COUNT"
  fi

  # I3: Source agent count
  AGENT_COUNT=$(find gsp/agents -name 'gsp-*.md' -type f | wc -l | tr -d ' ')
  if [[ "$AGENT_COUNT" -ge 10 ]]; then
    pass "I3 Agents exist ($AGENT_COUNT)"
  else
    warn "I3 Low agent count" "Expected ≥10, found $AGENT_COUNT"
  fi

  # I5: Bundle directories exist
  BUNDLE_OK=true
  if [[ ! -d "gsp/templates" ]]; then
    BUNDLE_OK=false
    fail "I5 Missing bundle dir" "gsp/templates"
  fi
  $BUNDLE_OK && pass "I5 Bundle directories present"

  # I6: package.json files field — all entries exist
  PKG_FILES_OK=true
  while IFS= read -r entry; do
    if [[ ! -e "$entry" ]]; then
      PKG_FILES_OK=false
      fail "I6 package.json files entry missing" "$entry does not exist"
    fi
  done < <(node -e "require('./package.json').files.forEach(f => console.log(f))")
  $PKG_FILES_OK && pass "I6 package.json files entries exist"

  # I7: Codex skills dir uses .agents/skills/ not .codex/skills/
  if grep -q 'getCodexSkillsDir' bin/install.js; then
    # Verify the function returns .agents path
    if grep -A3 'function getCodexSkillsDir' bin/install.js | grep -q "'.agents'"; then
      pass "I7 Codex skills → .agents/skills/"
    else
      fail "I7 Codex skills path wrong" "getCodexSkillsDir doesn't use .agents"
    fi
  else
    fail "I7 Missing getCodexSkillsDir" "Function not found in installer"
  fi

  # I8: All tool mapping objects exist
  MAPS_OK=true
  for map in claudeToOpencodeTools claudeToGeminiTools claudeToCodexTools; do
    if ! grep -q "const $map" bin/install.js; then
      MAPS_OK=false
      fail "I8 Missing tool map" "$map not found"
    fi
  done
  $MAPS_OK && pass "I8 Tool mapping objects present"

  # I9: All conversion functions exist
  CONVERTERS=(
    convertClaudeToOpencodeAgent convertClaudeSkillToOpencode
    convertClaudeToGeminiAgent convertClaudeSkillToGemini
    convertClaudeSkillToCodex
  )
  CONV_OK=true
  for fn in "${CONVERTERS[@]}"; do
    if ! grep -q "function $fn" bin/install.js; then
      CONV_OK=false
      fail "I9 Missing converter" "$fn not found"
    fi
  done
  $CONV_OK && pass "I9 All conversion functions present"

  # I10: All body replacement functions exist
  REPLACERS=(applyOpencodeBodyReplacements applyGeminiBodyReplacements applyCodexBodyReplacements)
  REP_OK=true
  for fn in "${REPLACERS[@]}"; do
    if ! grep -q "function $fn" bin/install.js; then
      REP_OK=false
      fail "I10 Missing body replacer" "$fn not found"
    fi
  done
  $REP_OK && pass "I10 All body replacement functions present"

  # I11: Agent converters strip Claude-only single-line fields
  I11_OK=true
  for fn in convertClaudeToOpencodeAgent convertClaudeToGeminiAgent; do
    CONVERTER=$(grep -A80 "function $fn" bin/install.js)
    for field in memory: background: isolation:; do
      if ! echo "$CONVERTER" | grep -q "startsWith('$field')"; then
        I11_OK=false
      fi
    done
  done
  if $I11_OK; then
    pass "I11 Agent converters strip single-line Claude-only fields"
  else
    fail "I11 Missing single-line field stripping" "Converters must strip memory:, background:, isolation:"
  fi

  # I12: Agent converters strip Claude-only multi-line blocks
  I12_OK=true
  for fn in convertClaudeToOpencodeAgent convertClaudeToGeminiAgent; do
    CONVERTER=$(grep -A80 "function $fn" bin/install.js)
    for block in hooks: skills: mcpServers:; do
      if ! echo "$CONVERTER" | grep -q "startsWith('$block')"; then
        I12_OK=false
      fi
    done
    if ! echo "$CONVERTER" | grep -q 'inSkipBlock'; then
      I12_OK=false
    fi
  done
  if $I12_OK; then
    pass "I12 Agent converters strip multi-line Claude-only blocks"
  else
    fail "I12 Missing multi-line block stripping" "Converters must handle hooks:, skills:, mcpServers: with inSkipBlock"
  fi

  # I13: Body replacements handle Skill tool rename
  I13_OK=true
  for fn in applyOpencodeBodyReplacements applyGeminiBodyReplacements applyCodexBodyReplacements; do
    BODY_FN=$(grep -A30 "function $fn" bin/install.js)
    if ! echo "$BODY_FN" | grep -q 'Skill'; then
      I13_OK=false
    fi
  done
  if $I13_OK; then
    pass "I13 Body replacements handle Skill tool rename"
  else
    fail "I13 Missing Skill replacement" "All body replacement functions must rename Skill tool"
  fi

  # I14: No dead tool names in mappings
  I14_OK=true
  DEAD_TOOLS="Task"
  for dead in $DEAD_TOOLS; do
    if grep -E "claudeTo(Opencode|Gemini|Codex)Tools" bin/install.js | grep -q "'$dead'"; then
      I14_OK=false
    fi
  done
  if $I14_OK; then
    pass "I14 No dead tool names in mappings"
  else
    fail "I14 Dead tool names found" "Tool mappings contain removed tools ($DEAD_TOOLS)"
  fi
  # I15: Statusline VERSION detection matches installer write path
  SL_FILE="scripts/gsp-statusline.js"
  if [[ -f "$SL_FILE" ]]; then
    SL_OK=true
    # Installer writes VERSION to targetDir (e.g. ~/.claude/VERSION)
    # Statusline must check {runtimeDir}/VERSION (current) with fallback to {runtimeDir}/get-shit-pretty/VERSION (legacy)
    if ! grep -q "VERSION" "$SL_FILE"; then
      SL_OK=false
    fi
    # Must have fallback logic for legacy path
    if ! grep -q "get-shit-pretty" "$SL_FILE"; then
      SL_OK=false
    fi
    # Must detect which path exists (current vs legacy)
    if ! grep -q "existsSync" "$SL_FILE"; then
      SL_OK=false
    fi
    if $SL_OK; then
      pass "I15 Statusline VERSION detection has current + legacy fallback"
    else
      fail "I15 Statusline VERSION path" "scripts/gsp-statusline.js must detect VERSION at {runtimeDir}/VERSION with legacy fallback"
    fi
  else
    warn "I15 Statusline not found" "$SL_FILE missing"
  fi

  # I16: Skill execution_context refs point to existing source files
  BAD_REFS=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    # Extract @${CLAUDE_SKILL_DIR}/../../ refs from execution_context
    while IFS= read -r ref; do
      # Resolve: CLAUDE_SKILL_DIR = gsp/skills/<dir>, so ../../ = gsp/
      resolved=$(echo "$ref" | sed "s|\${CLAUDE_SKILL_DIR}/\.\./\.\./|gsp/|" | sed "s|\${CLAUDE_SKILL_DIR}/\.\./|gsp/skills/|" | sed "s|\${CLAUDE_SKILL_DIR}/|gsp/skills/${dir}/|")
      # Strip trailing description after space (e.g. "file.md (index only — ...)")
      resolved="${resolved%% (*}"
      # Skip dynamic refs with {} placeholders
      echo "$resolved" | grep -q '{' && continue
      if [[ ! -e "$resolved" ]]; then
        BAD_REFS+=("${dir}:${resolved}")
      fi
    done < <(grep -oE '@\$\{CLAUDE_SKILL_DIR\}[^ ]*' "$skill" | sed 's/^@//')
  done
  if [[ ${#BAD_REFS[@]} -eq 0 ]]; then
    pass "I16 Skill execution_context refs resolve to existing files"
  else
    fail "I16 Broken skill refs" "${BAD_REFS[*]}"
  fi

  # I17: Skills with sibling files (subdirs) — installer must copy them
  # Find skill dirs that have files beyond SKILL.md
  SKILLS_WITH_SIBLINGS=()
  for dir in gsp/skills/*/; do
    sibling_count=$(find "$dir" -not -name 'SKILL.md' -not -type d | wc -l | tr -d ' ')
    if [[ "$sibling_count" -gt 0 ]]; then
      SKILLS_WITH_SIBLINGS+=("$(basename "$dir"):${sibling_count}files")
    fi
  done
  if [[ ${#SKILLS_WITH_SIBLINGS[@]} -gt 0 ]]; then
    # Verify copyClaudeSkills handles subdirectories (not just SKILL.md)
    if grep -A40 'function copyClaudeSkills' bin/install.js | grep -q 'copyFileSync\|cpSync\|readdirSync.*entry\|recursive.*copy\|copyDir\|copySibling'; then
      pass "I17 Skills with siblings installed correctly (${SKILLS_WITH_SIBLINGS[*]})"
    else
      fail "I17 Skills with sibling files not fully copied" "copyClaudeSkills only copies SKILL.md — missing siblings: ${SKILLS_WITH_SIBLINGS[*]}"
    fi
  else
    pass "I17 No skills with sibling files"
  fi

  # I18: All source skill dirs (except get-shit-pretty) have gsp- prefix
  # Source dirs carry the prefix directly — installer copies as-is
  I18_BAD=()
  for dir in gsp/skills/*/; do
    name=$(basename "$dir")
    [[ "$name" == "get-shit-pretty" ]] && continue
    if [[ "$name" != gsp-* ]]; then
      I18_BAD+=("$name")
    fi
  done
  if [[ ${#I18_BAD[@]} -eq 0 ]]; then
    pass "I18 All source skill dirs have gsp- prefix"
  else
    fail "I18 Source skill dirs missing gsp- prefix" "${I18_BAD[*]}"
  fi

  # I19: Skill converters strip model: and effort: fields
  I19_OK=true
  for fn in convertClaudeSkillToOpencode convertClaudeSkillToGemini convertClaudeSkillToCodex; do
    CONVERTER=$(grep -A80 "function $fn" bin/install.js)
    for field in model: effort:; do
      if ! echo "$CONVERTER" | grep -q "startsWith('$field')"; then
        I19_OK=false
      fi
    done
  done
  if $I19_OK; then
    pass "I19 Skill converters strip model: and effort: fields"
  else
    fail "I19 Missing model/effort stripping" "All 3 skill converters must strip model: and effort:"
  fi

  # I20: bin/ scripts referenced by SKILL.md must ship to the installed location.
  # Guards the v0.9.0 publish blocker: when scripts lived at <repo>/bin/, paths like
  # ${CLAUDE_SKILL_DIR}/../../../bin/foo.js resolved correctly in the symlinked source repo
  # but escaped .claude/ entirely on a clean install. Test simulates a copy-mode install
  # and asserts the scripts land where each SKILL.md expects them.
  TMPINSTALL=$(mktemp -d /tmp/gsp-install-i20-XXXXXX)
  I20_MISSING=()
  if node -e "require('./bin/install.js').copyClaudeSkills('gsp/skills', '$TMPINSTALL/skills', '$TMPINSTALL/')" >/dev/null 2>&1; then
    # gsp-brand-apply: ${CLAUDE_SKILL_DIR}/bin/serve-preset.js
    [[ -f "$TMPINSTALL/skills/gsp-brand-apply/bin/serve-preset.js" ]] \
      || I20_MISSING+=("gsp-brand-apply/bin/serve-preset.js")
    # gsp-brand-guidelines: ${CLAUDE_SKILL_DIR}/bin/theme-css.js
    [[ -f "$TMPINSTALL/skills/gsp-brand-guidelines/bin/theme-css.js" ]] \
      || I20_MISSING+=("gsp-brand-guidelines/bin/theme-css.js")
    # gsp-brand-refine cross-skill: ${CLAUDE_SKILL_DIR}/../gsp-brand-guidelines/bin/theme-css.js
    [[ -f "$TMPINSTALL/skills/gsp-brand-refine/../gsp-brand-guidelines/bin/theme-css.js" ]] \
      || I20_MISSING+=("gsp-brand-refine cross-skill → gsp-brand-guidelines/bin/theme-css.js")
    if [[ ${#I20_MISSING[@]} -eq 0 ]]; then
      pass "I20 Bin scripts ship to installed skill paths (copy mode)"
    else
      fail "I20 Missing bin scripts at install location" "${I20_MISSING[*]}"
    fi
  else
    fail "I20 copyClaudeSkills sim failed" "could not simulate install"
  fi
  rm -rf "$TMPINSTALL"

  # I21: Cross-skill paths in pipeline skill bodies + methodology must use ${CLAUDE_SKILL_DIR}/ prefix
  # Catches the drift fixed in PR #200 (#188) — bare `skills/...` and `references/...` paths
  # don't resolve at agent runtime regardless of cwd. Allowlist: documentation comments
  # in `<context>` blocks (descriptive prose, not paths agents will execute).
  I21_BAD=()
  for f in gsp/skills/gsp-*/SKILL.md gsp/skills/gsp-*/methodology/*.md; do
    [[ -f "$f" ]] || continue
    # Find lines with bare `skills/gsp-` or `references/` paths that aren't preceded by ${CLAUDE_SKILL_DIR}/
    # Skip lines inside <context> blocks (descriptive) and lines with `dev/skills/` (dev-skill refs)
    # shellcheck disable=SC2016  # literal ${CLAUDE_SKILL_DIR} / `skills/` and literal $ in regex
    while IFS=: read -r ln content; do
      # Skip if line has ${CLAUDE_SKILL_DIR} earlier in the same line
      [[ "$content" == *'${CLAUDE_SKILL_DIR}'* ]] && continue
      # Skip descriptive prose
      [[ "$content" == *'Source layout reference'* ]] && continue
      [[ "$content" == *'gsp/skills/'* ]] && continue
      [[ "$content" == *'`skills/`'* ]] && continue
      # Skip project-output references (project's references/ dir, not skill cross-refs)
      [[ "$content" == *'project'*'references/'* ]] && continue
      [[ "$content" == *'{project}/references'* ]] && continue
      [[ "$content" == *'reference material in '* ]] && continue
      # Real bad refs (must point at a file, not just a dir)
      I21_BAD+=("$f:$ln")
    done < <(grep -nE '`(skills/gsp-[a-z\-]+/[^`]+\.md|references/[^`]+\.md)`' "$f" 2>/dev/null)
  done
  if [[ ${#I21_BAD[@]} -eq 0 ]]; then
    pass "I21 Cross-skill paths use \${CLAUDE_SKILL_DIR}/ prefix"
  else
    warn "I21 Bare cross-skill paths found" "${I21_BAD[*]:0:5}"
  fi

  # I22: Domain duplication heuristic — pipeline skills shouldn't redeclare expertise rules
  # Soft check: flag pipeline skill bodies that contain dense color/typography/a11y prose
  # (signals like "Inter/Roboto", "off-black not #000", "prefers-reduced-motion" inline)
  # without nearby cross-skill references to the canonical owner.
  # Informational warning; humans verify drift candidates.
  I22_CANDIDATES=()
  PIPELINE_SKILLS=(gsp-brand-research gsp-brand-strategy gsp-brand-identity gsp-brand-guidelines gsp-project-brief gsp-project-research gsp-project-design gsp-project-critique gsp-project-build gsp-project-review)
  for skill in "${PIPELINE_SKILLS[@]}"; do
    for f in "gsp/skills/$skill/SKILL.md" "gsp/skills/$skill"/methodology/*.md; do
      [[ -f "$f" ]] || continue
      # Heuristic markers — concrete domain rules typically owned by expertise
      DOMAIN_HITS=$(grep -cE 'Inter/Roboto|off-black not #000|prefers-reduced-motion|tabular-nums|tint shadows|text-wrap: balance' "$f" 2>/dev/null || echo 0)
      DOMAIN_HITS=${DOMAIN_HITS//[!0-9]/}
      [[ -z "$DOMAIN_HITS" ]] && DOMAIN_HITS=0
      if [[ "$DOMAIN_HITS" -ge 3 ]]; then
        # Check if file references the canonical owners
        EXPERTISE_REFS=$(grep -cE 'gsp-color|gsp-typography|gsp-accessibility|gsp-visuals' "$f" 2>/dev/null || echo 0)
        EXPERTISE_REFS=${EXPERTISE_REFS//[!0-9]/}
        [[ -z "$EXPERTISE_REFS" ]] && EXPERTISE_REFS=0
        if [[ "$EXPERTISE_REFS" -lt 2 ]]; then
          I22_CANDIDATES+=("$f ($DOMAIN_HITS domain markers, $EXPERTISE_REFS expertise refs)")
        fi
      fi
    done
  done
  if [[ ${#I22_CANDIDATES[@]} -eq 0 ]]; then
    pass "I22 No obvious domain-rule duplication in pipeline skills"
  else
    warn "I22 Domain duplication candidates" "${I22_CANDIDATES[*]:0:3}"
  fi

fi

# ── R: Runtime Compatibility ────────────────────────

if should_run runtime; then
  header "Runtime Compatibility"

  BASELINE="dev/skills/gspdev-runtime-compat/references/baseline.md"

  if [[ ! -f "$BASELINE" ]]; then
    fail "R0 Baseline missing" "$BASELINE not found — run /gspdev-runtime-compat to generate"
  else
    pass "R0 Baseline reference exists"

    # R1: Codex discovery path in installer matches baseline
    if grep -q '\.agents.*skills' bin/install.js && grep -q '\.agents/skills/' "$BASELINE"; then
      pass "R1 Codex discovery path matches baseline"
    else
      warn "R1 Codex discovery path" "Installer or baseline may be out of sync"
    fi

    # R2: OpenCode tool mapping — check key renames exist (mapping + body)
    OC_OK=true
    for pair in "AskUserQuestion.*question" "SlashCommand.*skill" "TodoWrite.*todowrite"; do
      if ! grep -q "$pair" bin/install.js; then
        OC_OK=false
      fi
    done
    # Also verify Skill replacement exists in body replacement function
    OC_BODY=$(grep -A30 "function applyOpencodeBodyReplacements" bin/install.js)
    if ! echo "$OC_BODY" | grep -q 'Skill'; then
      OC_OK=false
    fi
    if $OC_OK; then
      pass "R2 OpenCode tool mappings present (mapping + body)"
    else
      warn "R2 OpenCode tool mappings" "Missing expected tool renames or Skill body replacement"
    fi

    # R3: Gemini tool mapping — check key renames exist
    GEM_OK=true
    for pair in "Read.*read_file" "Bash.*run_shell_command" "WebSearch.*google_web_search"; do
      if ! grep -q "$pair" bin/install.js; then
        GEM_OK=false
      fi
    done
    if $GEM_OK; then
      pass "R3 Gemini tool mappings present"
    else
      warn "R3 Gemini tool mappings" "Missing expected tool renames"
    fi

    # R4: Codex tool mapping — check key renames exist
    CDX_OK=true
    for pair in "Bash.*shell" "Read.*'read'" "WebSearch.*web_search"; do
      if ! grep -q "$pair" bin/install.js; then
        CDX_OK=false
      fi
    done
    if $CDX_OK; then
      pass "R4 Codex tool mappings present"
    else
      warn "R4 Codex tool mappings" "Missing expected tool renames"
    fi

    # R5: Body replacements — command invocation syntax
    BR_OK=true
    # OpenCode: /gsp: → /gsp-
    grep -q '/gsp-' bin/install.js || BR_OK=false
    # Codex: /gsp: → $gsp-
    # shellcheck disable=SC2016  # literal $gsp- pattern to grep
    grep -q '\$gsp-' bin/install.js || BR_OK=false
    if $BR_OK; then
      pass "R5 Command invocation replacements present"
    else
      warn "R5 Command invocation" "Missing /gsp: → runtime syntax replacements"
    fi

    # R6: Config path replacements
    CP_OK=true
    grep -q '\.config/opencode' bin/install.js || CP_OK=false
    grep -q '\.gemini' bin/install.js || CP_OK=false
    grep -q '\.codex' bin/install.js || CP_OK=false
    if $CP_OK; then
      pass "R6 Config path replacements present"
    else
      warn "R6 Config path replacements" "Missing runtime config path mappings"
    fi

    # R7: SKILL_DIR variable replacement
    SD_OK=true
    grep -q 'CLAUDE_SKILL_DIR' bin/install.js || SD_OK=false
    grep -q 'SKILL_DIR' bin/install.js || SD_OK=false
    if $SD_OK; then
      pass "R7 SKILL_DIR variable replacements present"
    else
      warn "R7 SKILL_DIR" "Missing CLAUDE_SKILL_DIR → runtime variable replacements"
    fi

    # R8: Codex agents are skipped (not installed)
    if grep -q 'isCodex' bin/install.js; then
      # Check that agent installation has a Codex exclusion
      if grep -A2 'isCodex' bin/install.js | grep -q 'agent\|skip\|!isCodex' 2>/dev/null; then
        pass "R8 Codex skips agent installation"
      else
        warn "R8 Codex agent handling" "Verify Codex doesn't install agent .md files"
      fi
    else
      warn "R8 No isCodex check" "Installer may not handle Codex runtime"
    fi

    # R9: Skill tool replacement uses lookahead guard
    R9_OK=true
    for fn in applyOpencodeBodyReplacements applyGeminiBodyReplacements applyCodexBodyReplacements; do
      BODY_FN=$(grep -A30 "function $fn" bin/install.js)
      if echo "$BODY_FN" | grep -q 'Skill'; then
        if ! echo "$BODY_FN" | grep -q '(?='; then
          R9_OK=false
        fi
      fi
    done
    if $R9_OK; then
      pass "R9 Skill tool replacement uses lookahead guard"
    else
      warn "R9 Skill replacement guard" "Skill rename may corrupt SKILL.md/skills — add lookahead (?=)"
    fi
  fi
fi

# ── T: Template Coherence ───────────────────────────

if should_run templates; then
  header "Templates"

  # T1: Brand config has required fields
  BRAND_CFG="gsp/templates/branding/config.json"
  if [[ -f "$BRAND_CFG" ]]; then
    BC_OK=true
    for field in project_type version; do
      if ! grep -q "\"$field\"" "$BRAND_CFG"; then
        BC_OK=false
        fail "T1 Brand config missing field" "$field"
      fi
    done
    $BC_OK && pass "T1 Brand config has required fields"
  else
    fail "T1 Brand config missing" "$BRAND_CFG not found"
  fi

  # T2: Project config has required fields
  PROJ_CFG="gsp/templates/projects/config.json"
  if [[ -f "$PROJ_CFG" ]]; then
    PC_OK=true
    for field in project_type version; do
      if ! grep -q "\"$field\"" "$PROJ_CFG"; then
        PC_OK=false
        fail "T2 Project config missing field" "$field"
      fi
    done
    $PC_OK && pass "T2 Project config has required fields"
  else
    fail "T2 Project config missing" "$PROJ_CFG not found"
  fi

  # T3: Phase templates exist for all expected phases
  BRAND_PHASES="discover strategy identity patterns"
  PROJECT_PHASES="brief research design critique build review"
  PHASE_OK=true
  for phase in $BRAND_PHASES $PROJECT_PHASES; do
    if [[ ! -f "gsp/templates/phases/${phase}.md" ]]; then
      PHASE_OK=false
      warn "T3 Missing phase template" "gsp/templates/phases/${phase}.md"
    fi
  done
  $PHASE_OK && pass "T3 All phase templates present"

  # T4: Exports index has BEGIN/END markers for project phases
  EXPORTS="gsp/templates/exports-index.md"
  if [[ -f "$EXPORTS" ]]; then
    EX_OK=true
    for phase in $PROJECT_PHASES; do
      if ! grep -qi "BEGIN.*$phase\|$phase.*BEGIN" "$EXPORTS" 2>/dev/null; then
        # Try alternate marker patterns
        if ! grep -qi "$phase" "$EXPORTS" 2>/dev/null; then
          EX_OK=false
          warn "T4 Exports index missing phase" "$phase"
        fi
      fi
    done
    $EX_OK && pass "T4 Exports index covers all phases"
  else
    warn "T4 Exports index missing" "$EXPORTS not found"
  fi

  # T5: Chunk format reference exists in consuming skills (ubiquitous, duplicated)
  T5_FOUND=0
  for skill_dir in gsp/skills/gsp-color gsp/skills/gsp-typography gsp/skills/gsp-style; do
    [[ -f "$skill_dir/chunk-format.md" && -s "$skill_dir/chunk-format.md" ]] && ((T5_FOUND++))
  done
  if [[ $T5_FOUND -ge 3 ]]; then
    pass "T5 Chunk format reference exists (ubiquitous, in consuming skills)"
  else
    fail "T5 Chunk format reference" "Missing from consuming skills ($T5_FOUND/3 found)"
  fi

  # T6: State templates exist
  ST_OK=true
  for type in branding projects; do
    if [[ ! -f "gsp/templates/${type}/state.md" ]]; then
      ST_OK=false
      fail "T6 Missing state template" "gsp/templates/${type}/state.md"
    fi
  done
  $ST_OK && pass "T6 State templates present"

  # T7: Brief templates exist
  BR_OK=true
  for type in branding projects; do
    if [[ ! -f "gsp/templates/${type}/brief.md" ]]; then
      BR_OK=false
      fail "T7 Missing brief template" "gsp/templates/${type}/brief.md"
    fi
  done
  $BR_OK && pass "T7 Brief templates present"

  # T8: Style presets have required schema blocks
  STYLE_DIR="gsp/skills/gsp-style/styles"
  T8_MISSING=()
  for yml in "$STYLE_DIR"/*.yml; do
    [[ "$(basename "$yml")" == "INDEX.yml" ]] && continue
    name=$(basename "$yml" .yml)
    for block in "^intensity:" "^patterns:" "^constraints:" "^effects:"; do
      if ! grep -q "$block" "$yml" 2>/dev/null; then
        T8_MISSING+=("${name}:${block//^/}")
      fi
    done
  done
  if [[ ${#T8_MISSING[@]} -eq 0 ]]; then
    PRESET_COUNT=$(find "$STYLE_DIR" -maxdepth 1 -name '*.yml' ! -name 'INDEX*' 2>/dev/null | wc -l | tr -d ' ')
    pass "T8 All $PRESET_COUNT presets have intensity+patterns+constraints+effects"
  else
    fail "T8 Presets missing schema blocks" "${T8_MISSING[*]}"
  fi

  # T9: Style presets have valid intensity dials (1-10)
  T9_BAD=()
  for yml in "$STYLE_DIR"/*.yml; do
    [[ "$(basename "$yml")" == "INDEX.yml" ]] && continue
    name=$(basename "$yml" .yml)
    for dial in variance motion density; do
      val=$(grep -A3 "^intensity:" "$yml" | grep "$dial:" | awk '{print $2}' | tr -d '[:space:]')
      if [[ -n "$val" ]]; then
        if [[ "$val" -lt 1 || "$val" -gt 10 ]] 2>/dev/null; then
          T9_BAD+=("${name}:${dial}=${val}")
        fi
      else
        T9_BAD+=("${name}:${dial}=missing")
      fi
    done
  done
  if [[ ${#T9_BAD[@]} -eq 0 ]]; then
    pass "T9 All preset intensity dials are 1-10"
  else
    fail "T9 Invalid intensity dials" "${T9_BAD[*]}"
  fi

  # T10: Style presets have interaction-vocabulary in effects
  T10_MISSING=()
  for yml in "$STYLE_DIR"/*.yml; do
    [[ "$(basename "$yml")" == "INDEX.yml" ]] && continue
    name=$(basename "$yml" .yml)
    if ! grep -q "interaction-vocabulary:" "$yml" 2>/dev/null; then
      T10_MISSING+=("$name")
    fi
  done
  if [[ ${#T10_MISSING[@]} -eq 0 ]]; then
    pass "T10 All presets have interaction-vocabulary"
  else
    fail "T10 Presets missing interaction-vocabulary" "${T10_MISSING[*]}"
  fi

  # T11: Style presets have layout archetype
  T11_MISSING=()
  for yml in "$STYLE_DIR"/*.yml; do
    [[ "$(basename "$yml")" == "INDEX.yml" ]] && continue
    name=$(basename "$yml" .yml)
    if ! grep -q "archetype:" "$yml" 2>/dev/null; then
      T11_MISSING+=("$name")
    fi
  done
  if [[ ${#T11_MISSING[@]} -eq 0 ]]; then
    pass "T11 All presets have layout archetype"
  else
    fail "T11 Presets missing layout archetype" "${T11_MISSING[*]}"
  fi

  # T12: Style template exists
  SC_TEMPLATE="gsp/templates/phases/style.md"
  if [[ -f "$SC_TEMPLATE" && -s "$SC_TEMPLATE" ]]; then
    pass "T12 Style template exists"
  else
    fail "T12 Style template" "Missing or empty: $SC_TEMPLATE"
  fi

  # T13: Token mapping reference exists
  TM_REF="gsp/skills/gsp-brand-guidelines/token-mapping.md"
  if [[ -f "$TM_REF" && -s "$TM_REF" ]]; then
    pass "T13 Token mapping reference exists"
  else
    fail "T13 Token mapping reference" "Missing or empty: $TM_REF"
  fi
fi

# ── X: Cross-Reference Resolution ─────────────────────

if should_run references; then
  header "Cross-Reference Resolution"
  X_BROKEN=0
  X_CHECKED=0
  X_FILES=0
  # Skip refs containing template placeholders like {name}, {preset}, {path}
  is_placeholder() { [[ "$1" == *"/{"*"}"* ]]; }

  X_SOURCES=$(find gsp/skills gsp/agents -name "*.md" 2>/dev/null; echo gsp/hooks/hooks.json)

  for src in $X_SOURCES; do
    [[ -f "$src" ]] || continue
    X_FILES=$((X_FILES + 1))
    skill_dir=$(dirname "$src")

    # X1: ${CLAUDE_SKILL_DIR}/../<rel> → gsp/skills/<rel>
    # shellcheck disable=SC2016  # literal ${CLAUDE_SKILL_DIR} in regex
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      is_placeholder "$ref" && continue
      rel="${ref#\${CLAUDE_SKILL_DIR\}/../}"
      target="gsp/skills/$rel"
      X_CHECKED=$((X_CHECKED + 1))
      if [[ ! -e "$target" ]]; then
        fail "X1 broken cross-skill ref" "$src → $ref (expected $target)"
        X_BROKEN=$((X_BROKEN + 1))
      fi
    done < <(grep -ohE '\$\{CLAUDE_SKILL_DIR\}/\.\./[^./"`\$\) ][^"`\$\) ]*' "$src" 2>/dev/null | sort -u)

    # X2: ${CLAUDE_SKILL_DIR}/../../<rel> → gsp/<rel> OR repo root <rel>
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      is_placeholder "$ref" && continue
      rel="${ref#\${CLAUDE_SKILL_DIR\}/../../}"
      X_CHECKED=$((X_CHECKED + 1))
      if [[ ! -e "gsp/$rel" && ! -e "$rel" ]]; then
        fail "X2 broken root-level ref" "$src → $ref (expected gsp/$rel or $rel)"
        X_BROKEN=$((X_BROKEN + 1))
      fi
    done < <(grep -ohE '\$\{CLAUDE_SKILL_DIR\}/\.\./\.\./[^"`\$\) ]+' "$src" 2>/dev/null | sort -u)

    # X3: methodology/gsp-<name>.md → relative to skill_dir
    # Exclude lines containing ${CLAUDE_SKILL_DIR} — those are Pattern 1 refs that
    # happen to contain "methodology/" as a sub-path.
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      is_placeholder "$ref" && continue
      target="$skill_dir/$ref"
      X_CHECKED=$((X_CHECKED + 1))
      if [[ ! -e "$target" ]]; then
        fail "X3 broken methodology ref" "$src → $ref (expected $target)"
        X_BROKEN=$((X_BROKEN + 1))
      fi
    done < <(grep -v '\$\{CLAUDE_SKILL_DIR\}' "$src" 2>/dev/null | grep -ohE 'methodology/gsp-[a-z-]+\.md' | sort -u)

    # X4: SubagentStop matchers (hooks.json only) → gsp/agents/<matcher>.md
    if [[ "$src" == "gsp/hooks/hooks.json" ]]; then
      while IFS= read -r matcher; do
        [[ -z "$matcher" ]] && continue
        target="gsp/agents/$matcher.md"
        X_CHECKED=$((X_CHECKED + 1))
        if [[ ! -e "$target" ]]; then
          fail "X4 broken hook matcher" "$src → $matcher (expected $target)"
          X_BROKEN=$((X_BROKEN + 1))
        fi
      done < <(jq -r '.. | objects | select(.matcher) | .matcher' "$src" 2>/dev/null | grep -E '^gsp-' | sort -u)
    fi

    # X5: @<path> inside <execution_context> blocks (markdown only) → relative to skill_dir
    if [[ "$src" == *.md ]]; then
      while IFS= read -r ref; do
        [[ -z "$ref" ]] && continue
        is_placeholder "$ref" && continue
        target="$skill_dir/$ref"
        X_CHECKED=$((X_CHECKED + 1))
        if [[ ! -e "$target" ]]; then
          fail "X5 broken @-import" "$src → @$ref (expected $target)"
          X_BROKEN=$((X_BROKEN + 1))
        fi
      done < <(awk '/<execution_context>/,/<\/execution_context>/' "$src" 2>/dev/null \
        | grep -oE '@[^[:space:]\)\}]+\.(md|yml|json)' \
        | sed 's/^@//' | sort -u)
    fi
  done

  if [[ $X_BROKEN -eq 0 ]]; then
    pass "X cross-reference resolution ($X_CHECKED refs checked across $X_FILES source files)"
  fi
fi

# ── P: Prompt Quality ─────────────────────────────────

if should_run prompts; then
  header "Prompt Quality"

  # P1: Line count budgets — skills ≤300, agents ≤150, prompts ≤80
  P1_OVER=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    lines=$(wc -l < "$skill" | tr -d ' ')
    if [[ "$lines" -gt 300 ]]; then
      P1_OVER+=("$dir:${lines}L")
    fi
  done
  for agent in gsp/agents/gsp-*.md; do
    name=$(basename "$agent" .md)
    lines=$(wc -l < "$agent" | tr -d ' ')
    if [[ "$lines" -gt 150 ]]; then
      P1_OVER+=("$name:${lines}L")
    fi
  done
  if [[ ${#P1_OVER[@]} -eq 0 ]]; then
    pass "P1 All files within line budgets"
  else
    warn "P1 Files over line budget" "${P1_OVER[*]}"
  fi

  # P2: <rules> sections should only appear in skills, not agents or prompts
  P2_BAD=()
  for agent in gsp/agents/gsp-*.md; do
    if grep -q '<rules>' "$agent"; then
      P2_BAD+=("$(basename "$agent")")
    fi
  done
  # prompts removed — only check agents
  if [[ ${#P2_BAD[@]} -eq 0 ]]; then
    pass "P2 <rules> only in skills"
  else
    warn "P2 <rules> in non-skill files" "${P2_BAD[*]}"
  fi

  # P3: <rules> size budget — flag >30 lines
  P3_OVER=()
  for skill in gsp/skills/*/SKILL.md; do
    if grep -q '<rules>' "$skill"; then
      dir=$(basename "$(dirname "$skill")")
      rules_lines=$(sed -n '/<rules>/,/<\/rules>/p' "$skill" | wc -l | tr -d ' ')
      if [[ "$rules_lines" -gt 30 ]]; then
        P3_OVER+=("$dir:${rules_lines}L")
      fi
    fi
  done
  if [[ ${#P3_OVER[@]} -eq 0 ]]; then
    pass "P3 <rules> sections within budget (≤30 lines)"
  else
    warn "P3 Large <rules> sections" "${P3_OVER[*]}"
  fi

  # P4: Interactive skills must have UX contract rules
  # Every skill with AskUserQuestion in allowed-tools must include both:
  #   1. "One decision per question" (or "one question at a time")
  #   2. "Always use AskUserQuestion" (or "AskUserQuestion for user")
  P4_MISSING=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    [[ "$dir" == "get-shit-pretty" ]] && continue
    # Only check skills that have AskUserQuestion in allowed-tools (frontmatter section)
    if sed -n '/^allowed-tools:/,/^---/p' "$skill" | grep -q 'AskUserQuestion' 2>/dev/null; then
      HAS_ONE_Q=$(grep -ci 'one decision per question\|one.*question.*at a time' "$skill")
      HAS_ASK=$(grep -ci 'always use.*AskUserQuestion\|AskUserQuestion.*for user' "$skill")
      if [[ "$HAS_ONE_Q" -eq 0 || "$HAS_ASK" -eq 0 ]]; then
        P4_MISSING_TAG=""
        [[ "$HAS_ONE_Q" -eq 0 ]] && P4_MISSING_TAG="one-decision"
        [[ "$HAS_ASK" -eq 0 ]] && P4_MISSING_TAG="${P4_MISSING_TAG:+$P4_MISSING_TAG+}ask-rule"
        P4_MISSING+=("$dir:$P4_MISSING_TAG")
      fi
    fi
  done
  if [[ ${#P4_MISSING[@]} -eq 0 ]]; then
    pass "P4 All interactive skills have UX contract rules"
  else
    fail "P4 Interactive skills missing UX rules" "${P4_MISSING[*]}"
  fi

  # P5: Skill↔agent instruction overlap — shared non-trivial lines between paired files
  P5_OVERLAPS=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    [[ "$dir" == "get-shit-pretty" ]] && continue
    # Find agents this skill references
    for agent in gsp/agents/gsp-*.md; do
      agent_name=$(basename "$agent" .md)
      if grep -q "$agent_name" "$skill"; then
        # Count shared lines (>20 chars, not headers/formatting)
        shared=$(comm -12 \
          <(grep -x '.\{20,\}' "$skill" | grep -v '^#\|^---\|^$\|^```\|^|' | sort -u) \
          <(grep -x '.\{20,\}' "$agent" | grep -v '^#\|^---\|^$\|^```\|^|' | sort -u) \
          | wc -l | tr -d ' ')
        if [[ "$shared" -gt 3 ]]; then
          P5_OVERLAPS+=("$dir↔$agent_name:${shared}shared")
        fi
      fi
    done
  done
  if [[ ${#P5_OVERLAPS[@]} -eq 0 ]]; then
    pass "P5 No significant skill↔agent instruction overlap"
  else
    warn "P5 Skill↔agent overlap" "${P5_OVERLAPS[*]}"
  fi

  # P6: Verbosity ratio — rules/constraints vs process/methodology
  # Approximate: count lines in <rules> + lines with constraint keywords
  # vs total non-blank lines. Flag >40%
  P6_VERBOSE=()
  for skill in gsp/skills/*/SKILL.md; do
    dir=$(basename "$(dirname "$skill")")
    total=$(grep -cvE '^$|^---|^#|^```' "$skill" | tr -d '[:space:]')
    [[ -z "$total" || "$total" -lt 10 ]] && continue
    rules_count=$(grep -ciE 'must |never |always |do not |forbidden|required|shall not' "$skill" | tr -d '[:space:]')
    [[ -z "$rules_count" ]] && rules_count=0
    rules_section=$(sed -n '/<rules>/,/<\/rules>/p' "$skill" | wc -l | tr -d '[:space:]')
    [[ -z "$rules_section" ]] && rules_section=0
    constraint_lines=$((rules_count + rules_section))
    ratio=$((constraint_lines * 100 / total))
    if [[ "$ratio" -gt 40 ]]; then
      P6_VERBOSE+=("$dir:${ratio}%")
    fi
  done
  if [[ ${#P6_VERBOSE[@]} -eq 0 ]]; then
    pass "P6 No files with >40% constraint ratio"
  else
    warn "P6 High constraint ratio" "${P6_VERBOSE[*]}"
  fi

  # P7: Vague directive detection — known anti-patterns
  P7_VAGUE=()
  VAGUE_PATTERNS='be natural|use good tone|write clean|be helpful|ensure quality|be thorough|be creative|be professional|use best practices'
  for file in $(find gsp/skills -name 'SKILL.md' && find gsp/agents -name 'gsp-*.md'); do
    matches=$(grep -ciE "$VAGUE_PATTERNS" "$file" 2>/dev/null | tr -d '[:space:]')
    [[ -z "$matches" ]] && matches=0
    if [[ "$matches" -gt 0 ]]; then
      name=$(basename "$file" .md)
      [[ "$name" == "SKILL" ]] && name=$(basename "$(dirname "$file")")
      P7_VAGUE+=("$name:${matches}hits")
    fi
  done
  if [[ ${#P7_VAGUE[@]} -eq 0 ]]; then
    pass "P7 No vague directives detected"
  else
    warn "P7 Vague directives found" "${P7_VAGUE[*]}"
  fi
fi

# ── U: Unit Tests ──────────────────────────────────────

if should_run unit; then
  header "Unit Tests"
  if node --test dev/tests/installer.test.js 2>&1; then
    pass "U1 Installer unit tests"
  else
    fail "U1 Installer unit tests" "see output above"
  fi
  if node --test dev/tests/installer-integration.test.js 2>&1; then
    pass "U2 Installer integration tests"
  else
    fail "U2 Installer integration tests" "see output above"
  fi

  # U3: theme-css.js --registry produces valid registry-item.json
  TMPOUT=$(mktemp /tmp/gsp-registry-test-XXXXXX.json)
  THEME_CSS=gsp/skills/gsp-brand-guidelines/bin/theme-css.js
  if node "$THEME_CSS" gsp/skills/gsp-style/styles/saas.yml --registry --output "$TMPOUT" >/dev/null 2>&1; then
    if node -e "
      const j = require('$TMPOUT');
      const ok =
        j.\$schema === 'https://ui.shadcn.com/schema/registry-item.json' &&
        j.type === 'registry:theme' &&
        typeof j.name === 'string' &&
        j.cssVars && j.cssVars.light && j.cssVars.dark &&
        typeof j.cssVars.light.background === 'string' &&
        j.cssVars.light.background.startsWith('oklch(');
      process.exit(ok ? 0 : 1);
    " 2>/dev/null; then
      pass "U3 theme-css --registry produces valid registry-item.json"
    else
      fail "U3 theme-css --registry shape" "missing required fields or wrong types in $TMPOUT"
    fi
  else
    fail "U3 theme-css --registry exit" "node $THEME_CSS --registry failed"
  fi
  rm -f "$TMPOUT"

  # U4: serve-preset.js serves the file and exits on SIGTERM
  TMPJSON=$(mktemp).json
  # shellcheck disable=SC2016  # literal $schema key in shadcn registry JSON
  echo '{"$schema":"https://ui.shadcn.com/schema/registry-item.json","name":"smoke","type":"registry:theme","cssVars":{"light":{},"dark":{}}}' > "$TMPJSON"
  SERVE_PRESET=gsp/skills/gsp-brand-apply/bin/serve-preset.js
  node "$SERVE_PRESET" "$TMPJSON" > /tmp/gsp-serve-url-$$.txt 2>/dev/null &
  SERVER_PID=$!
  for _ in 1 2 3 4 5; do sleep 0.2; [ -s /tmp/gsp-serve-url-$$.txt ] && break; done
  URL=$(head -1 /tmp/gsp-serve-url-$$.txt 2>/dev/null)
  if [[ -n "$URL" && "$URL" == http* ]]; then
    BODY=$(curl -fsS "$URL" 2>/dev/null)
    if echo "$BODY" | grep -q '"name":"smoke"'; then
      pass "U4 serve-preset.js serves JSON over HTTP"
    else
      fail "U4 serve-preset response" "URL=$URL body did not contain expected marker"
    fi
  else
    fail "U4 serve-preset URL" "no http URL printed (got: '$URL')"
  fi
  kill "$SERVER_PID" 2>/dev/null
  wait "$SERVER_PID" 2>/dev/null
  rm -f "$TMPJSON" /tmp/gsp-serve-url-$$.txt
fi

# ── TB: Token Budget ───────────────────────────────────

if should_run tokenbudget; then
  header "Token Budget"

  if [[ -f dev/scripts/token-budget.sh ]]; then
    bash dev/scripts/token-budget.sh

    # Check for red-threshold skills
    RED_SKILLS=0
    for skill_dir in gsp/skills/*/; do
      [[ -f "$skill_dir/SKILL.md" ]] || continue
      body=$(wc -l < "$skill_dir/SKILL.md" | tr -d ' ')

      # Count unique agent references that match actual agent files
      spawns=0
      for agent_file in gsp/agents/gsp-*.md; do
        [[ -f "$agent_file" ]] || continue
        agent_name=$(basename "$agent_file" .md)
        if grep -q "$agent_name" "$skill_dir/SKILL.md" 2>/dev/null; then
          spawns=$((spawns + 1))
        fi
      done

      fork=0
      grep -q 'context:.*fork' "$skill_dir/SKILL.md" 2>/dev/null && fork=1

      meth=0
      if [[ -d "$skill_dir/methodology" ]]; then
        for mf in "$skill_dir"/methodology/*.md; do
          [[ -f "$mf" ]] && meth=$((meth + $(wc -l < "$mf" | tr -d ' ')))
        done
      fi

      score=$((body + (spawns * 500) + (fork * 300) + meth))
      [[ $score -ge 1000 ]] && RED_SKILLS=$((RED_SKILLS + 1))
    done

    if [[ $RED_SKILLS -eq 0 ]]; then
      pass "TB1 No skills above red threshold (1000)"
    else
      warn "TB1 Skills above red threshold" "$RED_SKILLS skill(s) score >= 1000"
    fi
  else
    fail "TB1 Token budget script missing" "dev/scripts/token-budget.sh not found"
  fi
fi

# ── H: Hooks & Settings ──────────────────────────────

if should_run hooks || should_run contracts || should_run all; then
  header "Hooks & Settings"

  HOOKS_JSON="gsp/hooks/hooks.json"
  SETTINGS_TEMPLATE="claude-settings.template.json"

  # H1: JSON validity of hooks.json and settings template
  for f in "$HOOKS_JSON" "$SETTINGS_TEMPLATE"; do
    if [[ ! -f "$f" ]]; then
      fail "H1 Missing JSON file" "$f"
      continue
    fi
    if node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" 2>/dev/null; then
      pass "H1 Valid JSON ($f)"
    else
      fail "H1 Invalid JSON" "$f does not parse"
    fi
  done

  # H2: every hook command's script path resolves
  # Parses .hooks.*.hooks[].command from both JSON files, extracts the
  # scripts/X.sh|dev/scripts/X.sh|.claude/hooks/X.js path, asserts it exists.
  H2_MISSING=0
  H2_CHECKED=0
  for f in "$HOOKS_JSON" "$SETTINGS_TEMPLATE"; do
    [[ -f "$f" ]] || continue
    # Extract command strings from the .hooks subtree only (not .statusLine etc).
    COMMANDS=$(node -e "
      const j = JSON.parse(require('fs').readFileSync('$f','utf8'));
      const out = new Set();
      function walk(o) {
        if (o && typeof o === 'object') {
          if (typeof o.command === 'string') out.add(o.command);
          for (const k in o) walk(o[k]);
        }
      }
      walk(j.hooks || {});
      for (const c of out) console.log(c);
    " 2>/dev/null)
    while IFS= read -r cmd; do
      [[ -z "$cmd" ]] && continue
      # Strip leading 'bash ' / 'node ' / 'sh ', then take first whitespace-delimited token.
      # Use awk for portable alternation (BSD sed differs from GNU sed on -E groups).
      stripped=$(echo "$cmd" | awk '{ if ($1 == "bash" || $1 == "node" || $1 == "sh") { print $2 } else { print $1 } }')
      # Resolve placeholder ${CLAUDE_PROJECT_ROOT}/ to repo root
      path="${stripped/\$\{CLAUDE_PROJECT_ROOT\}\//}"
      # Filter for paths we own (avoid e.g. /bin/sh)
      [[ "$path" =~ ^(scripts|dev/scripts|\.claude/hooks)/ ]] || continue
      H2_CHECKED=$((H2_CHECKED + 1))
      if [[ ! -f "$path" ]]; then
        fail "H2 Hook script missing" "$f references $path"
        H2_MISSING=$((H2_MISSING + 1))
      fi
    done <<< "$COMMANDS"
  done
  if [[ $H2_MISSING -eq 0 && $H2_CHECKED -gt 0 ]]; then
    pass "H2 All hook command paths resolve ($H2_CHECKED checked)"
  elif [[ $H2_CHECKED -eq 0 ]]; then
    warn "H2 No hook commands found to check" "(unexpected — verify parsing)"
  fi

  # H3: every gsp-* agent has a SubagentStop matcher (or is allowlisted)
  # Allowlist: agents that legitimately have no on-disk deliverables (none today).
  H3_ALLOWLIST=""
  H3_MISSING_AGENTS=()
  if [[ -f "$HOOKS_JSON" ]]; then
    MATCHERS=$(node -e "
      const j = JSON.parse(require('fs').readFileSync('$HOOKS_JSON','utf8'));
      const ms = new Set();
      for (const ev in (j.hooks || {})) {
        for (const entry of j.hooks[ev]) {
          if (entry.matcher) ms.add(entry.matcher);
        }
      }
      for (const m of ms) console.log(m);
    " 2>/dev/null)
    for af in gsp/agents/gsp-*.md; do
      [[ -f "$af" ]] || continue
      agent_name=$(basename "$af" .md)
      [[ " $H3_ALLOWLIST " == *" $agent_name "* ]] && continue
      if ! grep -qx "$agent_name" <<< "$MATCHERS"; then
        H3_MISSING_AGENTS+=("$agent_name")
      fi
    done
  fi
  if [[ ${#H3_MISSING_AGENTS[@]} -eq 0 ]]; then
    pass "H3 Every gsp-* agent has a SubagentStop matcher"
  else
    fail "H3 Agent without SubagentStop matcher" "${H3_MISSING_AGENTS[*]} (add to $HOOKS_JSON or allowlist)"
  fi

  # H4: no hardcoded .design/ paths in gsp/agents/gsp-*.md
  # Per CLAUDE.md "Must-never": agents must say "path provided by the skill"
  # Allowlist: gsp/agents/CLAUDE.md may document the rule + example paths
  H4_VIOLATORS=()
  for af in gsp/agents/gsp-*.md; do
    [[ -f "$af" ]] || continue
    if grep -qE '\.design/(branding|projects|system|.+/)' "$af"; then
      H4_VIOLATORS+=("$af")
    fi
  done
  if [[ ${#H4_VIOLATORS[@]} -eq 0 ]]; then
    pass "H4 No hardcoded .design/ paths in agent files"
  else
    fail "H4 Hardcoded .design/ path in agent" "${H4_VIOLATORS[*]} — use 'path provided by the skill that spawned you'"
  fi
fi

# ── Summary ──────────────────────────────────────────

header "Summary"
TOTAL=$((PASS + FAIL + WARN))
printf "\n  \033[32m%d PASS\033[0m · \033[33m%d WARN\033[0m · \033[31m%d FAIL\033[0m  (%d total)\n" "$PASS" "$WARN" "$FAIL" "$TOTAL"

if [[ $FAIL -gt 0 ]]; then
  printf "\n\033[31mFailures:\033[0m\n"
  for f in "${FAILURES[@]}"; do
    printf "  • %s\n" "$f"
  done
fi

if [[ $WARN -gt 0 ]]; then
  printf "\n\033[33mWarnings:\033[0m\n"
  for w in "${WARNINGS[@]}"; do
    printf "  • %s\n" "$w"
  done
fi

if [[ $FAIL -eq 0 && $WARN -eq 0 ]]; then
  printf "\n  GSP pipeline is clean.\n"
elif [[ $FAIL -eq 0 ]]; then
  printf "\n  GSP pipeline is healthy with minor issues.\n"
else
  printf "\n  GSP pipeline has issues that need fixing.\n"
fi

echo ""
exit "$FAIL"
