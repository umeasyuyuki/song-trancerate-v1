---
name: startproject
description: マルチエージェント協調でプロジェクトを開始し、2段階Codexゲートと学習レポート更新で品質と理解を両立する
---

# /startproject - プロジェクト開始ワークフロー

## 概要

このワークフローは 7 フェーズで構成される。
Antigravity が実装を主導し、Codex は Gate 1 / Gate 2 で判断と監査を担当する。
同時に `docs/reports/{task_id}.md` を同一ファイルで追記して理解負債を防ぐ。

## Phase 1: リサーチ（Antigravity）

1. プロジェクト構造を分析
2. 既存コードパターンを把握
3. 関連ライブラリを調査
4. 結果を `docs/research/{feature}.md` に保存
5. `/update-learning-report` で要件整理前ログを追記

## Phase 2: 要件整理とドラフト計画（Antigravity）

- 目的、スコープ、制約、成功基準を整理
- 実装計画のドラフトを作成
- `docs/reports/{task_id}.md` に判断理由を追記

## Phase 3: Codex コンテキスト準備（Antigravity）

- `/prepare-codex-context` を実行して `docs/for-codex/` を更新
- `manifest.md` の必須キーを埋める（`report_path`, `humor_level`, `learner_mode` を含む）

## Phase 4: Gate 1 - 計画レビュー（Codex CLI）

`CODEX_MODE=plan-review` で Codex に委譲：

- 計画の妥当性
- リスク分析
- タスク分解
- 実装順序

既定 reasoning effort は `high`。
結果要約を `docs/reports/{task_id}.md` に追記。

## Phase 5: 実装とタスク実行（Antigravity）

- Gate 1 で修正した計画を実装
- テストを実行し、結果を記録
- 実装内容を `docs/reports/{task_id}.md` に追記

## Phase 6: 実装コンテキスト更新（Antigravity）

- `docs/for-codex/implementation-context.md` を更新
- `docs/for-codex/decision-log.md` に採用/却下を追記
- `manifest.md` を再更新

## Phase 7: Gate 2 - 実装レビュー（Codex CLI）

`CODEX_MODE=implementation-review` で Codex レビューを実施：

- バグ/回帰
- セキュリティ懸念
- パフォーマンス問題
- テスト戦略の不足

高リスク変更時のみ `xhigh` を使用。
最終結果を `docs/reports/{task_id}.md` に追記して完了。
