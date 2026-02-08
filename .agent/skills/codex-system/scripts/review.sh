#!/usr/bin/env bash
# Codex CLI review wrapper (macOS)
# Usage:
#   bash ./review.sh [ask_codex options]

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ASK_SCRIPT="$SCRIPT_DIR/ask_codex.sh"

if [[ ! -x "$ASK_SCRIPT" ]]; then
  echo "ask_codex.sh not found or not executable: $ASK_SCRIPT" >&2
  exit 1
fi

has_arg() {
  local needle="$1"
  shift
  for arg in "$@"; do
    if [[ "$arg" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

ARGS=("$@")

if ! has_arg "--mode" "${ARGS[@]}" && ! has_arg "--task-type" "${ARGS[@]}" && ! has_arg "-m" "${ARGS[@]}"; then
  ARGS=(--mode review "${ARGS[@]}")
fi

if ! has_arg "--codex-mode" "${ARGS[@]}"; then
  ARGS=(--codex-mode "${CODEX_MODE:-implementation-review}" "${ARGS[@]}")
fi

if ! has_arg "--question" "${ARGS[@]}" && ! has_arg "-q" "${ARGS[@]}"; then
  ARGS+=(--question "Review the recent changes in this project. Check for: 1) code quality issues 2) security concerns 3) performance problems 4) best practice violations. Provide prioritized findings and specific recommendations.")
fi

exec bash "$ASK_SCRIPT" "${ARGS[@]}"
