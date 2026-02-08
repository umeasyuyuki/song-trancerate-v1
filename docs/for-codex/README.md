# For Codex Context

This directory is the handoff layer from Antigravity to Codex.

## Reading policy

- Codex should read this directory first.
- Codex should inspect broader code only when this directory is inconsistent, incomplete, or risk is high.

## Required files

- `manifest.md`
- `decision-log.md`
- `docs/reports/{task_id}.md` (learning report)

## Recommended files

- `browser-evidence.md`
- `plan-context.md`
- `implementation-context.md`

## Update checklist before Codex gates

1. Refresh `manifest.md` fields (`task_id`, `generated_at`, `source_commit`, `read_order`, `coverage`, `known_gaps`).
2. Update only the files needed for the current gate.
3. Keep rejected options and rationale in `decision-log.md`.
4. Append progress to `docs/reports/{task_id}.md` (same file through the task).
5. If context is stale, regenerate before calling `ask_codex.sh`.

## Persona settings

- `persona_name`: user-facing agent persona
- `humor_level`: `off|light|on` (default `light`)
- `learner_mode`: `on|off` (default `on`)
