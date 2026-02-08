---
name: prepare-codex-context
description: Antigravity の成果物を Codex 用コンテキストに正規化して docs/for-codex/ に集約する
---

# /prepare-codex-context - Codex コンテキスト準備ワークフロー

## 目的

Antigravity のリサーチ・ブラウジング・実装成果を `docs/for-codex/` に構造化して、
Codex が探索ではなく判断に集中できる状態を作る。

## Step 1: 入力成果物を収集

- 要件整理メモ
- `docs/research/{topic}.md`
- ブラウジング Artifact（録画/スクリーンショット/メモ）
- 実装差分・テスト結果（Gate 2 の場合）

## Step 2: 固定マッピングで出力

- Browser 系 Artifact → `docs/for-codex/browser-evidence.md`
- 要件/制約/ドラフト計画 → `docs/for-codex/plan-context.md`
- 変更ファイル/挙動差分/テスト結果 → `docs/for-codex/implementation-context.md`
- 採用/却下/保留の判断理由 → `docs/for-codex/decision-log.md`

## Step 3: manifest を更新

`docs/for-codex/manifest.md` に必須キーを設定：

- `task_id`
- `generated_at`
- `source_commit`
- `read_order`
- `coverage`
- `known_gaps`

## Step 4: 鮮度と整合性を確認

- 必須キーが存在する
- `source_commit` が現在のコミットと整合する（差異があれば理由を明記）
- `known_gaps` が空なら `none` を明記

## Step 5: Codex へ引き渡し

Gate 1（計画レビュー）の例：

```bash
CODEX_MODE=plan-review \
bash .agent/skills/codex-system/scripts/ask_codex.sh \
  --mode design \
  --question "Review and decompose the implementation plan from docs/for-codex."
```

Gate 2（実装レビュー）の例：

```bash
CODEX_MODE=implementation-review \
bash .agent/skills/codex-system/scripts/review.sh
```
