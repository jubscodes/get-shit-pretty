#!/usr/bin/env bash
# GSP Integrity Test Suite
# Run from repo root: bash dev/scripts/audit-tests.sh [suite]
# Suites: all, versions, contracts, installer, runtime, templates
# Exit code: number of failures

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

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
  V_PLUGIN=$(node -e "process.stdout.write(require('./.claude-plugin/plugin.json').version)" 2>/dev/null)

  # V1: All three version sources agree
  if [[ "$V_FILE" == "$V_PKG" && "$V_PKG" == "$V_PLUGIN" ]]; then
    pass "V1 Version agreement ($V_FILE)"
  else
    fail "V1 Version mismatch" "VERSION=$V_FILE package.json=$V_PKG plugin.json=$V_PLUGIN"
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
    pass "V3 VERSION file is clean"
  else
    warn "V3 VERSION file" "Has extra lines beyond version string"
  fi
fi

# ── C: Contract Checks ──────────────────────────────

if should_run contracts; then
  header "Contracts"

  # C3: Every skill that spawns agents references valid agents
  BAD_SKILL_REFS=()
  for skill in gsp/skills/gsp-*/SKILL.md; do
    agents=$(grep -oE 'gsp-[a-z][-a-z]*' "$skill" | grep -v 'gsp-start\|gsp-help\|gsp-doctor\|gsp-progress\|gsp-update\|gsp-pretty\|gsp-art\|gsp-brand-\|gsp-project-\|gsp-add-\|gsp-launch\|gsp-style' | sort -u)
    for agent in $agents; do
      if [[ ! -f "gsp/agents/${agent}.md" ]]; then
        BAD_SKILL_REFS+=("$(basename "$(dirname "$skill")"):${agent}")
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

  # C8: Claude-only field usage matches known set (canary)
  EXPECTED_CLAUDE_ONLY="gsp-builder.md gsp-codebase-scanner.md gsp-reviewer.md"
  ACTUAL_CLAUDE_ONLY=$(grep -rlE '^(memory|background|hooks|isolation|skills|mcpServers):' gsp/agents/ 2>/dev/null | xargs -I{} basename {} | sort -u | tr '\n' ' ' | sed 's/ $//')
  if [[ "$ACTUAL_CLAUDE_ONLY" == "$EXPECTED_CLAUDE_ONLY" ]]; then
    pass "C8 Claude-only field usage matches known set ($ACTUAL_CLAUDE_ONLY)"
  else
    warn "C8 Claude-only field set changed" "Expected: $EXPECTED_CLAUDE_ONLY Got: $ACTUAL_CLAUDE_ONLY — verify converters handle new fields"
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
  if [[ "$AGENT_COUNT" -ge 14 ]]; then
    pass "I3 Agents exist ($AGENT_COUNT)"
  else
    warn "I3 Low agent count" "Expected ≥14, found $AGENT_COUNT"
  fi

  # I5: Bundle directories exist
  BUNDLE_OK=true
  for dir in gsp/prompts gsp/templates gsp/references; do
    if [[ ! -d "$dir" ]]; then
      BUNDLE_OK=false
      fail "I5 Missing bundle dir" "$dir"
    fi
  done
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
fi

# ── R: Runtime Compatibility ────────────────────────

if should_run runtime; then
  header "Runtime Compatibility"

  BASELINE="dev/skills/runtime-compat/references/baseline.md"

  if [[ ! -f "$BASELINE" ]]; then
    fail "R0 Baseline missing" "$BASELINE not found — run /runtime-compat to generate"
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
  BRAND_PHASES="discover strategy identity system"
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

  # T5: Chunk format reference exists and is non-empty
  CHUNK_REF="gsp/references/chunk-format.md"
  if [[ -f "$CHUNK_REF" && -s "$CHUNK_REF" ]]; then
    pass "T5 Chunk format reference exists"
  else
    fail "T5 Chunk format reference" "Missing or empty: $CHUNK_REF"
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
