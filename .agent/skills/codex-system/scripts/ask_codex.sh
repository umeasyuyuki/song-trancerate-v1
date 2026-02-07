#!/usr/bin/env bash
# Codex CLI consultation script (macOS)
# Usage:
#   bash ./ask_codex.sh --mode analyze --question "Your question" [--context "optional"]

set -euo pipefail

MODE=""
QUESTION=""
CONTEXT=""

usage() {
  cat <<'EOF'
Usage:
  bash ./ask_codex.sh --mode <analyze|design|debug|review> --question "<text>" [--context "<text>"]

Options:
  -m, --mode      Task type (required)
  -q, --question  Main question for Codex (required)
  -c, --context   Additional context text (optional)
  -h, --help      Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--mode)
      MODE="${2:-}"
      shift 2
      ;;
    -q|--question)
      QUESTION="${2:-}"
      shift 2
      ;;
    -c|--context)
      CONTEXT="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$MODE" || -z "$QUESTION" ]]; then
  echo "Both --mode and --question are required." >&2
  usage
  exit 1
fi

case "$MODE" in
  analyze|design|debug|review) ;;
  *)
    echo "Invalid mode: $MODE" >&2
    usage
    exit 1
    ;;
esac

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../../../.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$PROJECT_ROOT/logs/codex-responses"
OUTPUT_FILE="$OUTPUT_DIR/$MODE-$TIMESTAMP.md"

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

PROMPT="$(cat <<EOF
## Task Type: $MODE

## Question
$QUESTION

## Context
$CONTEXT

## Instructions
- Analyze thoroughly before responding
- Provide structured output with clear sections
- Include trade-offs and alternatives where applicable
- Respond in English for reasoning accuracy
EOF
)"

echo "=== Consulting Codex CLI ($MODE) ==="
echo "Question: $QUESTION"
echo

pushd "$PROJECT_ROOT" >/dev/null
if RESULT="$(printf '%s\n' "$PROMPT" | "$CODEX_PATH" exec --model gpt-5.2-codex --sandbox read-only --full-auto --skip-git-repo-check 2>/dev/null)"; then
  if [[ -n "$RESULT" ]]; then
    printf '%s\n' "$RESULT" > "$OUTPUT_FILE"
    echo "=== Codex Response ==="
    printf '%s\n' "$RESULT"
    echo
    echo "Response saved to: $OUTPUT_FILE"
  else
    echo "No response from Codex. Check Codex CLI installation and authentication." >&2
    exit 1
  fi
else
  echo "Failed to execute Codex CLI." >&2
  exit 1
fi
popd >/dev/null
