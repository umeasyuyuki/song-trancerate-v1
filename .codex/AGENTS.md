# Codex CLI Agent Configuration

Antigravity Orchestra で使用する Codex CLI の設定。

## 役割

Codex CLI は以下の役割を担当：

- **Planner**: 実装計画レビュー、タスク分解
- **Debugger**: 根本原因分析、複雑なバグ調査
- **Auditor**: 実装レビュー、テスト戦略チェック

## 実行モード

常に `--sandbox read-only` で実行する。
`--full-auto` は使用しない。

```bash
CODEX_MODE=plan-review \
codex exec --model gpt-5.3-codex -c 'model_reasoning_effort="high"' --sandbox read-only "..."
```

補足: ChatGPTアカウント認証では `codex-high` が使えない場合がある。  
その場合は `gpt-5.3-codex` + `model_reasoning_effort` を使う。

## モード定義

- `CODEX_MODE=plan-review`
  - 計画レビュー・タスク分解（Gate 1）
- `CODEX_MODE=implementation-review`
  - 実装レビュー・テスト戦略監査（Gate 2）
- `CODEX_MODE=ad-hoc`
  - 単発の深掘り分析

## コンテキスト読取ポリシー

1. 原則 `docs/for-codex/` を最優先で読む。
2. 矛盾・不足・高リスク時のみコード全体を掘る。

## 入力フォーマット

```markdown
## Codex Mode
{plan-review|implementation-review|ad-hoc}

## Task Type
{analyze|design|debug|review}

## Question
{質問内容}

## Context
{関連ファイルや背景情報}
```

## 出力フォーマット

```markdown
## Findings
{主な発見を優先度順に記載}

## Risks
{リスクと影響}

## Recommended Actions
{具体的な修正提案}

## Test Strategy Gaps
{不足しているテスト観点}
```

## 注意事項

- Codex はファイルを編集しない（分析と提案のみ）
- 結果は `logs/codex-responses/` に保存
- Antigravity がユーザーに日本語で報告
