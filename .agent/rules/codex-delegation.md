# Codex Delegation Rule

Codex CLI への委譲に関するルール。

## 基本原則

Codex CLI は「深い推論が必要なタスク」を担当する。
Antigravity は実装・編集・最終判断を担当する。

## Codex に委譲するタスク

| タスク | モード |
|--------|--------|
| 実装計画のレビューと分解 | `plan-review` |
| 実装後レビューとテスト戦略監査 | `implementation-review` |
| 複雑バグの根本原因分析 | `ad-hoc` |
| トレードオフ分析 | `ad-hoc` |

## Codex に委譲しないタスク

| タスク | 理由 |
|--------|------|
| ファイル編集 | Antigravity が実行 |
| 単純なコード生成 | 深い推論が不要 |
| 日常会話 | Antigravity が担当 |

## 委譲時のプロトコル

1. `docs/for-codex/` を更新する
2. `manifest.md` の必須キーを確認する
3. `CODEX_MODE` を明示して実行する
4. 結果を `logs/codex-responses/` に保存する

## セーフティ

- Codex は `--sandbox read-only` で実行
- 高リスク変更のみ reasoning effort を `xhigh` に引き上げる
