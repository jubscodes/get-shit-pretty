#!/usr/bin/env bash
# GSP Benchmark — snapshot and compare token budget across versions
# Run from repo root: bash dev/scripts/benchmark.sh [capture|compare|trend]

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LIB_ROOT="$ROOT"
cd "$ROOT" || exit 1

BENCH_DIR="$ROOT/dev/benchmarks"
SKIP_TESTS=false

# ── Shared scoring lib ──────────────────────────────

source "$ROOT/dev/scripts/lib-scoring.sh"

# ── Helpers ─────────────────────────────────────────

get_version() {
  cat "$ROOT/VERSION" 2>/dev/null | tr -d '[:space:]'
}

get_branch() {
  git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null
}

get_commit() {
  git -C "$ROOT" rev-parse --short HEAD 2>/dev/null
}

latest_snapshot() {
  find "$BENCH_DIR" -maxdepth 1 -name '*.json' ! -name '*.release.json' 2>/dev/null | sort -V | tail -1
}

release_snapshot() {
  find "$BENCH_DIR" -maxdepth 1 -name '*.release.json' 2>/dev/null | sort -V | tail -1
}

previous_snapshot() {
  find "$BENCH_DIR" -maxdepth 1 -name '*.json' 2>/dev/null | sort -V | tail -2 | head -1
}

# ── Test Results ────────────────────────────────────

capture_tests() {
  if [[ "$SKIP_TESTS" == "true" ]]; then
    echo "0|0|0"
    return
  fi

  local output
  output=$(bash "$ROOT/dev/scripts/audit-tests.sh" 2>&1)

  local pass=0 warn=0 fail=0

  # Strip ANSI codes, parse summary line (macOS-compatible)
  local clean
  # SC2001 false positive: bash parameter expansion cannot express this regex
  # shellcheck disable=SC2001
  clean=$(echo "$output" | sed $'s/\033\[[0-9;]*m//g')
  local summary
  summary=$(echo "$clean" | grep "PASS.*WARN.*FAIL" || true)
  if [[ -n "$summary" ]]; then
    pass=$(echo "$summary" | awk '{for(i=1;i<=NF;i++) if($(i+1)=="PASS") print $i}')
    warn=$(echo "$summary" | awk '{for(i=1;i<=NF;i++) if($(i+1)=="WARN") print $i}')
    fail=$(echo "$summary" | awk '{for(i=1;i<=NF;i++) if($(i+1)=="FAIL") print $i}')
  fi

  echo "$pass|$warn|$fail"
}

# ── Capture ─────────────────────────────────────────

cmd_capture() {
  local label="${1:-}"
  local version branch commit date
  version=$(get_version)
  branch=$(get_branch)
  commit=$(get_commit)
  date=$(date +%Y-%m-%d)

  mkdir -p "$BENCH_DIR"

  echo -e "${BOLD}Capturing benchmark...${RESET}\n"

  # Score all skills once — cache to temp file for pipeline/rate-limit reuse
  local cache_file
  cache_file=$(mktemp)
  # shellcheck disable=SC2064  # expand $cache_file at trap-set time so cleanup uses correct path
  trap "rm -f '$cache_file'" EXIT
  local skills_json=""
  local total_weight=0
  local skill_count=0
  local red_count=0
  local double_dispatch=""
  local dd_count=0

  for skill_dir in "$ROOT/gsp/skills/gsp-"*/; do
    if [[ -d "$skill_dir" ]]; then
      result=$(score_skill "$skill_dir")
      IFS='|' read -r score name body exec agents fork method _dc <<< "$result"

      echo "$result" >> "$cache_file"
      total_weight=$((total_weight + score))
      skill_count=$((skill_count + 1))
      if (( score >= RED_THRESH )); then
        red_count=$((red_count + 1))
      fi

      # Collect double-dispatch skills
      if (( fork > 0 )); then
        [[ -n "$double_dispatch" ]] && double_dispatch="$double_dispatch, "
        double_dispatch="$double_dispatch\"$name\""
        dd_count=$((dd_count + 1))
      fi

      local fork_cost=$((fork * FORK_WEIGHT))
      [[ -n "$skills_json" ]] && skills_json="$skills_json,"
      skills_json="$skills_json
    \"$name\": { \"score\": $score, \"body\": $body, \"exec\": $exec, \"agents\": $agents, \"fork\": $fork_cost, \"methodology\": $method }"
    fi
  done

  # Score pipelines from cache
  local pipelines_json=""
  for i in "${!PIPELINE_NAMES[@]}"; do
    local pname="${PIPELINE_NAMES[$i]}"
    local pskills="${PIPELINE_SKILLS[$i]}"
    local pscore=0
    local pcount=0
    local heaviest=""
    local heaviest_score=0

    for sname in $pskills; do
      local cached
      cached=$(grep "|${sname}|" "$cache_file" || true)
      if [[ -n "$cached" ]]; then
        local s="${cached%%|*}"
        pscore=$((pscore + s))
        pcount=$((pcount + 1))
        if (( s > heaviest_score )); then
          heaviest_score=$s
          heaviest=$sname
        fi
      fi
    done

    [[ -n "$pipelines_json" ]] && pipelines_json="$pipelines_json,"
    pipelines_json="$pipelines_json
    \"$pname\": { \"score\": $pscore, \"skills\": $pcount, \"heaviest\": \"$heaviest\", \"heaviest_score\": $heaviest_score }"
  done

  # API conversations from cache
  local api_convos=0
  for sname in ${PIPELINE_SKILLS[3]}; do
    local cached
    cached=$(grep "|${sname}|" "$cache_file" || true)
    if [[ -n "$cached" ]]; then
      IFS='|' read -r _ _ _ _ agents fork _ _ <<< "$cached"
      api_convos=$((api_convos + 1 + agents + fork))
    fi
  done

  # Count assets
  local num_skills num_agents num_presets num_methods
  num_skills=$(find "$ROOT/gsp/skills/gsp-"* -maxdepth 0 -type d 2>/dev/null | wc -l | tr -d ' ')
  num_agents=$(find "$ROOT/gsp/agents/gsp-"*.md -type f 2>/dev/null | wc -l | tr -d ' ')
  num_presets=$(find "$ROOT/gsp/skills/gsp-style/styles" -name "*.yml" -type f 2>/dev/null | wc -l | tr -d ' ')
  num_methods=$(find "$ROOT/gsp/skills" -path "*/methodology/*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

  # Test results
  if [[ "$SKIP_TESTS" == "true" ]]; then
    echo -e "  ${DIM}Skipping tests (--skip-tests)${RESET}"
  else
    echo -e "  Running audit tests..."
  fi
  local test_result
  test_result=$(capture_tests)
  IFS='|' read -r tpass twarn tfail <<< "$test_result"

  # Determine filename
  local filename
  if [[ -n "$label" ]]; then
    filename="${version}-${label}.json"
  else
    filename="${version}.json"
  fi

  if [[ -f "$BENCH_DIR/$filename" ]]; then
    echo -e "  ${YELLOW}!${RESET} Snapshot $filename already exists — overwriting"
  fi

  # Write JSON
  cat > "$BENCH_DIR/$filename" <<ENDJSON
{
  "version": "$version",
  "label": "$label",
  "date": "$date",
  "branch": "$branch",
  "commit": "$commit",
  "skills": {$skills_json
  },
  "pipelines": {$pipelines_json
  },
  "rate_limit": {
    "double_dispatch_skills": [$double_dispatch],
    "double_dispatch_count": $dd_count,
    "api_conversations_full_e2e": $api_convos
  },
  "tests": {
    "pass": $tpass,
    "warn": $twarn,
    "fail": $tfail
  },
  "counts": {
    "skills": $num_skills,
    "agents": $num_agents,
    "presets": $num_presets,
    "methodologies": $num_methods
  },
  "totals": {
    "weight": $total_weight,
    "skill_count": $skill_count,
    "red_zone": $red_count
  }
}
ENDJSON

  echo -e "\n  ${GREEN}✓${RESET} Snapshot saved: dev/benchmarks/$filename"
  echo -e "    version: $version  branch: $branch  commit: $commit"
  echo -e "    weight: $total_weight  skills: $skill_count  red: $red_count"
  if [[ "$SKIP_TESTS" != "true" ]]; then
    echo -e "    tests: $tpass pass · $twarn warn · $tfail fail"
  fi
}

# ── Release ─────────────────────────────────────────

cmd_release() {
  local version
  version=$(get_version)
  local filename="${version}.release.json"

  echo -e "${BOLD}Capturing release baseline...${RESET}\n"

  cmd_capture ""

  local src="$BENCH_DIR/${version}.json"
  local dst="$BENCH_DIR/$filename"

  if [[ -f "$src" ]]; then
    mv "$src" "$dst"
    echo -e "\n  ${GREEN}✓${RESET} Release baseline: dev/benchmarks/$filename"
    echo "    All future 'benchmark.sh compare' will use this as baseline A."
  fi
}

# ── Compare ─────────────────────────────────────────

cmd_compare() {
  local file_a="${1:-}"
  local file_b="${2:-}"

  # Default: release baseline vs latest capture
  if [[ -z "$file_a" ]]; then
    file_a=$(release_snapshot)
    file_b=$(latest_snapshot)
    if [[ -z "$file_a" ]] || [[ ! -f "$file_a" ]]; then
      file_a=$(previous_snapshot)
    fi
  elif [[ -z "$file_b" ]]; then
    file_b=$(latest_snapshot)
  fi

  # Resolve bare version names to paths
  [[ "$file_a" != /* ]] && [[ -f "$BENCH_DIR/$file_a" ]] && file_a="$BENCH_DIR/$file_a"
  [[ "$file_a" != /* ]] && [[ -f "$BENCH_DIR/${file_a}.json" ]] && file_a="$BENCH_DIR/${file_a}.json"
  [[ "$file_b" != /* ]] && [[ -f "$BENCH_DIR/$file_b" ]] && file_b="$BENCH_DIR/$file_b"
  [[ "$file_b" != /* ]] && [[ -f "$BENCH_DIR/${file_b}.json" ]] && file_b="$BENCH_DIR/${file_b}.json"

  if [[ ! -f "$file_a" ]] || [[ ! -f "$file_b" ]]; then
    echo -e "${RED}Error:${RESET} Need at least 2 snapshots to compare."
    echo "  Found: $(find "$BENCH_DIR" -maxdepth 1 -name '*.json' 2>/dev/null | wc -l | tr -d ' ') snapshot(s) in dev/benchmarks/"
    echo "  Run: bash dev/scripts/benchmark.sh capture"
    exit 1
  fi

  if [[ "$file_a" == "$file_b" ]]; then
    echo -e "${RED}Error:${RESET} Only one snapshot found. Capture another to compare."
    exit 1
  fi

  # Single Python call for all compare output
  python3 -c "
import json, sys, os

a = json.load(open('$file_a'))
b = json.load(open('$file_b'))

RED_T = $RED_THRESH
YEL_T = $YELLOW_THRESH

def label_for(d):
    v = d['version']
    l = d.get('label', '')
    return '%s-%s' % (v, l) if l else v

la = label_for(a)
lb = label_for(b)

def delta_s(d):
    if d > 0: return '+%d' % d
    if d < 0: return '%d' % d
    return chr(0x2014)  # em dash

# Header
print()
print('  GSP Benchmark %s %s %s' % (la, chr(0x2192), lb))
print('  ' + chr(0x2550) * 76)
print()

# Per-skill table
print('  Per-Skill Scores')
print('  A = %s  B = %s' % (la, lb))
print()
print('  %-28s %7s %7s %7s %6s %6s %6s %7s %6s' % ('Skill', 'A', 'B', 'Delta', 'Body', 'Exec', 'Agts', 'Method', 'Risk'))
print('  ' + chr(0x2500) * 28 + ' ' + (' '.join([chr(0x2500) * w for w in [7, 7, 7, 6, 6, 6, 7, 6]])))

sa = a['skills']
sb = b['skills']
all_skills = sorted(set(list(sa.keys()) + list(sb.keys())),
                    key=lambda s: sb.get(s, {}).get('score', 0), reverse=True)

for name in all_skills:
    da = sa.get(name, {})
    db = sb.get(name, {})
    sc_a = da.get('score', 0)
    sc_b = db.get('score', 0)
    delta = sc_b - sc_a
    body = db.get('body', 0)
    exc = db.get('exec', 0)
    agents = db.get('agents', 0)
    method = db.get('methodology', 0)
    fork = db.get('fork', 0)
    risk = chr(0x2717) if sc_b >= RED_T else ('!' if sc_b >= YEL_T else chr(0x2713))
    agts = '%d+F' % agents if fork > 0 else str(agents)
    meth = str(method) if method > 0 else chr(0x2014)
    print('  %-28s %7d %7d %7s %6d %6d %6s %7s %6s' % (
        name, sc_a, sc_b, delta_s(delta), body, exc, agts, meth, risk))

# Totals
wa = a['totals']['weight']; wb = b['totals']['weight']
ra = a['totals']['red_zone']; rb = b['totals']['red_zone']
print()
print('  Total weight: %d %s %d (%s)  Red-zone: %d %s %d' % (wa, chr(0x2192), wb, delta_s(wb - wa), ra, chr(0x2192), rb))
print()

# Pipelines
print('  Pipeline Paths')
print('  %-22s %7s %7s %7s' % ('Path', 'A', 'B', 'Delta'))
print('  ' + chr(0x2500) * 22 + ' ' + (' '.join([chr(0x2500) * 7] * 3)))

pa = a['pipelines']; pb = b['pipelines']
for key, disp in [('brand_diamond','brand diamond'),('project_diamond','project diamond'),('quick_flow','quick flow'),('full_e2e','full e2e')]:
    s_a = pa.get(key, {}).get('score', 0)
    s_b = pb.get(key, {}).get('score', 0)
    print('  %-22s %7d %7d %7s' % (disp, s_a, s_b, delta_s(s_b - s_a)))

# Rate limit
print()
print('  Rate Limit Risk')
rla = a.get('rate_limit', {}); rlb = b.get('rate_limit', {})
ca = rla.get('api_conversations_full_e2e', 0); cb = rlb.get('api_conversations_full_e2e', 0)
dda = rla.get('double_dispatch_count', 0); ddb = rlb.get('double_dispatch_count', 0)
print('    API conversations (full e2e): %d %s %d (%s)' % (ca, chr(0x2192), cb, delta_s(cb - ca)))
print('    Double-dispatch skills:       %d %s %d (%s)' % (dda, chr(0x2192), ddb, delta_s(ddb - dda)))
dd_skills = rlb.get('double_dispatch_skills', [])
if dd_skills:
    print('    Forked skills:                %s' % ', '.join(dd_skills))

# Tests
print()
print('  Tests')
ta = a.get('tests', {}); tb = b.get('tests', {})
print('    A: %d pass %s %d warn %s %d fail' % (ta.get('pass',0), chr(0xb7), ta.get('warn',0), chr(0xb7), ta.get('fail',0)))
print('    B: %d pass %s %d warn %s %d fail' % (tb.get('pass',0), chr(0xb7), tb.get('warn',0), chr(0xb7), tb.get('fail',0)))

print()
print('  ' + chr(0x2550) * 76)
print()
" 2>/dev/null
}

# ── Trend ───────────────────────────────────────────

cmd_trend() {
  local snapshots count
  snapshots=$(find "$BENCH_DIR" -maxdepth 1 -name '*.json' 2>/dev/null | sort -V)
  count=$(echo "$snapshots" | grep -c . 2>/dev/null || echo "0")

  if (( count == 0 )); then
    echo -e "${RED}Error:${RESET} No snapshots found. Run: bash dev/scripts/benchmark.sh capture"
    exit 1
  fi

  # Collect all file paths into a space-separated string for Python
  local file_list=""
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    file_list="$file_list $file"
  done <<< "$snapshots"

  python3 -c "
import json, os

files = '$file_list'.strip().split()
print()
print('  GSP Benchmark Trend')
print('  ' + chr(0x2550) * 64)
print()
print('  %-24s %8s %6s %6s %8s %8s %6s' % ('Snapshot', 'Weight', 'Skills', 'Red', 'E2E', 'Tests', 'APIs'))
print('  ' + chr(0x2500) * 24 + ' ' + (' '.join([chr(0x2500) * w for w in [8, 6, 6, 8, 8, 6]])))

for f in files:
    d = json.load(open(f))
    fname = os.path.basename(f).replace('.json', '')
    w = d['totals']['weight']
    sc = d['totals']['skill_count']
    red = d['totals']['red_zone']
    e2e = d['pipelines'].get('full_e2e', {}).get('score', 0)
    tp = d.get('tests', {}).get('pass', 0)
    tw = d.get('tests', {}).get('warn', 0)
    tf = d.get('tests', {}).get('fail', 0)
    tests = '%d/%d/%d' % (tp, tw, tf)
    apis = d.get('rate_limit', {}).get('api_conversations_full_e2e', 0)
    print('  %-24s %8d %6d %6d %8d %8s %6d' % (fname, w, sc, red, e2e, tests, apis))

print()
print('  Tests: pass/warn/fail')
print('  ' + chr(0x2550) * 64)
print()
" 2>/dev/null
}

# ── List ────────────────────────────────────────────

cmd_list() {
  local snapshots count
  snapshots=$(find "$BENCH_DIR" -maxdepth 1 -name '*.json' 2>/dev/null | sort -V)
  count=$(echo "$snapshots" | grep -c . 2>/dev/null || echo "0")

  if (( count == 0 )); then
    echo "  No snapshots. Run: bash dev/scripts/benchmark.sh capture"
    exit 0
  fi

  local file_list=""
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    file_list="$file_list $file"
  done <<< "$snapshots"

  python3 -c "
import json, os

files = '$file_list'.strip().split()
print()
print('  Snapshots (dev/benchmarks/)')
print()
for f in files:
    d = json.load(open(f))
    fname = os.path.basename(f)
    date = d['date']
    branch = d.get('branch', '')
    w = d['totals']['weight']
    red = d['totals']['red_zone']
    print('  %-28s  %s  branch: %-28s  weight: %d  red: %d' % (fname, date, branch, w, red))
print()
" 2>/dev/null
}

# ── Usage ───────────────────────────────────────────

usage() {
  echo ""
  echo -e "  ${BOLD}GSP Benchmark${RESET}"
  echo ""
  echo "  Usage:"
  echo "    benchmark.sh capture [label]         Snapshot current state"
  echo "    benchmark.sh capture --skip-tests    Quick capture without running tests"
  echo "    benchmark.sh release                 Snapshot as release baseline"
  echo "    benchmark.sh compare [v1] [v2]       Compare (default: release vs latest)"
  echo "    benchmark.sh trend                   Trajectory across all snapshots"
  echo "    benchmark.sh list                    List available snapshots"
  echo ""
  echo "  Workflow:"
  echo "    1. At release: benchmark.sh release       → saves release baseline"
  echo "    2. During dev: benchmark.sh capture        → snapshot current work"
  echo "    3. Before PR:  benchmark.sh compare        → diff against release"
  echo ""
}

# ── Main ────────────────────────────────────────────

# Parse global flags
args=()
for arg in "$@"; do
  case "$arg" in
    --skip-tests) SKIP_TESTS=true ;;
    *) args+=("$arg") ;;
  esac
done

case "${args[0]:-}" in
  capture) cmd_capture "${args[1]:-}" ;;
  release) cmd_release ;;
  compare) cmd_compare "${args[1]:-}" "${args[2]:-}" ;;
  trend)   cmd_trend ;;
  list)    cmd_list ;;
  *)       usage ;;
esac
