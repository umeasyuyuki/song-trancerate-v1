---
name: codex-system
description: Use this skill when Antigravity needs Codex for deep reasoning tasks: plan review and task decomposition (Gate 1), implementation review and test-strategy audit (Gate 2), root-cause debugging, or architecture trade-off analysis. Trigger on intents like design decision, risk assessment, regression concerns, complex bugs, or explicit requests to consult Codex.
---

# Codex System Skill

設計判断・デバッグ・レビューを Codex CLI に委譲する。

## 実行モード

- `CODEX_MODE=plan-review`
  - Gate 1: 計画レビューとタスク分解
- `CODEX_MODE=implementation-review`
  - Gate 2: 実装レビューとテスト戦略監査
- `CODEX_MODE=ad-hoc`
  - 単発の深掘り調査

## 使い方

### Gate 1（計画）

```bash
CODEX_MODE=plan-review \
bash .agent/skills/codex-system/scripts/ask_codex.sh \
  --mode design \
  --question "Review and decompose the implementation plan from docs/for-codex."
```

### Gate 2（実装）

```bash
CODEX_MODE=implementation-review \
bash .agent/skills/codex-system/scripts/review.sh
```

### 高リスク変更で推論強度を引き上げる

```bash
CODEX_MODE=implementation-review \
bash .agent/skills/codex-system/scripts/review.sh --high-risk
```

## コンテキスト方針

1. `docs/for-codex/` を最優先で読む
2. 矛盾・不足・高リスク時のみコード全体を掘る
3. 重要判断は `docs/for-codex/decision-log.md` と `docs/DESIGN.md` に反映する

## 結果の活用

- Codex 応答は `logs/codex-responses/` に保存
- 必要に応じて `docs/DESIGN.md` に昇格
- ユーザーには日本語で要約報告

## 安全性

- Codex は `--sandbox read-only` で実行
- 実装・ファイル編集は Antigravity が担当
