#!/usr/bin/env bash
# Fail if package.json has any production dependencies.
# GSP npm package must ship zero prod deps (installer uses Node builtins only).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

count=$(node -e "
  const pkg = require('./package.json');
  const deps = pkg.dependencies || {};
  console.log(Object.keys(deps).length);
")

if [ "$count" -ne 0 ]; then
  echo "✗ package.json has $count production dependency/dependencies. GSP must ship zero. Move to devDependencies." >&2
  node -e "console.log(Object.keys(require('./package.json').dependencies || {}))" >&2
  exit 1
fi

echo "✓ Zero production dependencies"
