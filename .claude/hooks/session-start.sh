#!/bin/bash
# Installs dependencies so cloud sessions can lint, test and build right away.
set -euo pipefail

# Only run in Claude Code on the web; local machines manage their own deps.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
npm install --no-audit --no-fund
