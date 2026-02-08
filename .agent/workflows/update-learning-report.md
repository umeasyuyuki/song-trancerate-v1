---
name: update-learning-report
description: タスク進行中の学習レポートを docs/reports/{task_id}.md に追記して理解負債を防ぐ
---

# /update-learning-report - 学習レポート更新ワークフロー

## 目的

駆け出しエンジニアでも追える形で、同一レポートに進捗と判断理由を蓄積する。

## Step 1: 対象レポートを決定

- `task_id` を決定
- レポートパスを `docs/reports/{task_id}.md` に固定

## Step 2: レポート初期化（初回のみ）

- ファイルが存在しなければ `docs/reports/TEMPLATE.md` をコピーして作成

## Step 3: マイルストーンごとに追記

以下のタイミングで同一ファイルへ追記する：

1. 要件整理完了時
2. Gate 1 完了時
3. 実装完了時
4. Gate 2 完了時

## Step 4: 追記フォーマット

各追記ブロックには以下を含める：

- `日時`
- `フェーズ`
- `何をしたか`
- `なぜそうしたか`
- `初心者向けメモ`
- `次にやること`

## Step 5: manifest 連携

`docs/for-codex/manifest.md` の `report_path` を更新して同期を保つ。
