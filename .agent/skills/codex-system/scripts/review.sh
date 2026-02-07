#!/usr/bin/env bash
# Codex CLI review script (macOS)
# Usage:
#   bash ./review.sh

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$PROJECT_ROOT/logs/codex-responses"
OUTPUT_FILE="$OUTPUT_DIR/review-$TIMESTAMP.md"

# Defaults optimized for Apple Silicon macOS + Homebrew.
NODE_PATH="${NODE_PATH:-/opt/homebrew/bin/node}"
CODEX_PATH="${CODEX_PATH:-/opt/homebrew/bin/codex}"

if [[ ! -x "$CODEX_PATH" ]]; then
  echo "Codex CLI not found at: $CODEX_PATH" >&2
  echo "Update CODEX_PATH or install Codex CLI." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
export PATH="$(dirname "$NODE_PATH"):$PATH"

echo "=== Starting Codex Review ==="
echo

pushd "$PROJECT_ROOT" >/dev/null
if RESULT="$("$CODEX_PATH" exec --model gpt-5.2-codex --sandbox read-only --full-auto --skip-git-repo-check "Review the recent changes in this project. Check for: 1) Code quality issues 2) Security concerns 3) Performance problems 4) Best practice violations. Provide specific recommendations." 2>/dev/null)"; then
  if [[ -n "$RESULT" ]]; then
    printf '%s\n' "$RESULT" > "$OUTPUT_FILE"
    echo "=== Review Results ==="
    printf '%s\n' "$RESULT"
    echo
    echo "Review saved to: $OUTPUT_FILE"
  else
    echo "No response from Codex. Check Codex CLI installation and authentication." >&2
    exit 1
  fi
else
  echo "Failed to execute Codex CLI review." >&2
  exit 1
fi
popd >/dev/null
