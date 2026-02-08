---
name: checkpoint
description: セッション状態と Codex 連携コンテキストを保存し、次回再開できるようにする
---

# /checkpoint - セッション永続化ワークフロー

## 使用方法

```
/checkpoint              # 基本: 会話履歴とタスク状態を保存
/checkpoint --full       # 完全: git履歴・ファイル変更も含めて保存
```

## Step 1: 状態の収集（Antigravity）

以下の情報を収集：

- 現在のタスク状態
- 完了した作業
- 未完了の作業
- 重要な決定事項
- `docs/for-codex/` の最終更新状況
- `docs/reports/{task_id}.md` の最終更新状況

## Step 2: チェックポイントファイル作成

`docs/checkpoints/{timestamp}.md` に保存。

## Step 3: for-codex スナップショット記録

チェックポイントに以下を記録：

- `docs/for-codex/manifest.md` の `task_id`, `generated_at`, `source_commit`, `report_path`
- 次回再開時に再生成が必要なファイル

## Step 4: 学習レポートの再開ポイント記録

- 最後に追記した見出し
- 次に追記すべきフェーズ

## Step 5: --full オプション時の追加処理

- `git status` の結果
- 変更ファイルの diff 概要
- 実行環境情報

## Step 6: 確認

チェックポイント保存を確認し、ユーザーに報告。
