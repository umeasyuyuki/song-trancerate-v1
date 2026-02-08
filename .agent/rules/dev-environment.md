# Development Environment Rule

開発環境に関するルール。

## 推奨ツール

### Python プロジェクト

| ツール | 用途 |
|--------|------|
| **uv** | パッケージ管理 |
| **ruff** | リンター＆フォーマッター |
| **pytest** | テストフレームワーク |
| **mypy** | 型チェック |

### JavaScript/TypeScript プロジェクト

| ツール | 用途 |
|--------|------|
| **pnpm** | パッケージ管理 |
| **ESLint** | リンター |
| **Prettier** | フォーマッター |
| **Vitest** | テストフレームワーク |

## 環境構成

### macOS (Apple Silicon)

```
macOS (zsh)
    │
    ├── Google Antigravity
    │
    └── Homebrew
            │
            ├── Node.js (/opt/homebrew/bin/node)
            ├── Codex CLI (/opt/homebrew/bin/codex)
            └── 開発ツール
```

## パス設定

必要なら環境変数で上書き：

```bash
NODE_PATH="$(which node)" \
CODEX_PATH="$(which codex)" \
CODEX_MODE=plan-review \
bash .agent/skills/codex-system/scripts/ask_codex.sh \
  --mode design \
  --question "Sanity check"
```

## 依存検証

Skill 検証を使う場合は `PyYAML` を使える状態にする。

```bash
python3 -c "import yaml"
```

## 注意事項

- Apple Silicon は `/opt/homebrew` が標準
- スクリプトに実行権限が必要
- 改行コードは LF を使用
