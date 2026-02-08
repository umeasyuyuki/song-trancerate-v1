---
name: plan
description: 要件を実装ステップに分解し、Gate 1 で計画品質を検証する
---

# /plan - 実装計画ワークフロー

## Step 1: 要件の明確化（Antigravity）

- 何を実装するか
- 制約・条件
- 優先度

## Step 2: ドラフト計画作成（Antigravity）

- 実装ステップ
- 依存関係
- 検証基準

## Step 3: Codex コンテキスト準備（Antigravity）

`/prepare-codex-context` で `docs/for-codex/` を更新。

## Step 4: Gate 1 計画レビュー（Codex CLI）

```bash
CODEX_MODE=plan-review \
bash .agent/skills/codex-system/scripts/ask_codex.sh \
  --mode design \
  --question "Review and decompose the implementation plan from docs/for-codex."
```

## Step 5: 計画確定（Antigravity）

- Codex提案を反映
- ユーザー承認を取得

## Step 6: 設計ドキュメント更新（Antigravity）

確定計画を `docs/DESIGN.md` に記録。
