---
name: init
description: 新規プロジェクトにOrchestra環境をセットアップする
---

# /init - Orchestra環境初期化ワークフロー

## 概要

このワークフローは一度だけ実行し、必要なディレクトリとファイルを作成する。

## Step 1: ディレクトリ構造の確認

以下のディレクトリが存在するか確認：

```
.agent/
├── workflows/
├── skills/
│   ├── codex-system/scripts/
│   ├── design-tracker/
│   ├── research/
│   ├── update-design/
│   └── update-lib-docs/
└── rules/

.codex/

docs/
├── research/
└── libraries/

logs/
└── codex-responses/
```

## Step 2: 不足ディレクトリの作成

存在しないディレクトリを作成。

## Step 3: 設定ファイルの確認

以下のファイルが存在するか確認：

- `.agent/workflows/*.md` (6ファイル)
- `.agent/skills/*/SKILL.md` (5スキル)
- `.agent/rules/*.md` (8ファイル)
- `.codex/AGENTS.md`
- `docs/DESIGN.md`

## Step 4: 不足ファイルの作成

存在しないファイルをテンプレートから作成。

## Step 5: macOS 実行環境の確認

`scripts/ask_codex.sh` と `scripts/review.sh` が存在し、実行権限を持つか確認。

ユーザーに以下を確認：

```bash
which node
which codex
bash .agent/skills/codex-system/scripts/ask_codex.sh --help
```

デフォルトは Apple Silicon + Homebrew 前提：

```bash
NODE_PATH=/opt/homebrew/bin/node
CODEX_PATH=/opt/homebrew/bin/codex
```

## Step 6: 完了報告

セットアップ完了を報告し、次のステップを案内：

```
Orchestra環境のセットアップが完了しました。

次のステップ：
1. scripts/ask_codex.sh / review.sh の動作確認
2. /startproject で最初のプロジェクトを開始
```
