# Development Environment Rule

開発環境に関するルール。

## 推奨ツール

### Python プロジェクト

| ツール | 用途 |
|--------|------|
| **uv** | パッケージ管理（pip より高速） |
| **ruff** | リンター＆フォーマッター |
| **pytest** | テストフレームワーク |
| **mypy** | 型チェック |

### JavaScript/TypeScript プロジェクト

| ツール | 用途 |
|--------|------|
| **pnpm** | パッケージ管理（npm より高速） |
| **ESLint** | リンター |
| **Prettier** | フォーマッター |
| **Vitest** | テストフレームワーク |

## 環境構成

### macOS (Apple Silicon)

```
macOS (zsh)
    │
    ├── Google Antigravity (エディタ)
    │
    └── Homebrew
            │
            ├── Node.js (/opt/homebrew/bin/node)
            ├── Codex CLI (/opt/homebrew/bin/codex)
            └── 開発ツール
```

### パス設定

Codex CLI を呼び出すスクリプトでは、macOS のローカルパスを使用：

```bash
NODE_PATH=/opt/homebrew/bin/node
CODEX_PATH=/opt/homebrew/bin/codex
```

必要なら環境変数で上書き：

```bash
NODE_PATH="$(which node)" CODEX_PATH="$(which codex)" bash .agent/skills/codex-system/scripts/ask_codex.sh --mode analyze --question "Sanity check"
```

## 環境変数

機密情報は `.env` ファイルで管理し、Git にコミットしない。

```bash
# .env（Git にコミットしない）
OPENAI_API_KEY=sk-xxxxx
DATABASE_URL=postgresql://...
```

```bash
# .env.example（Git にコミット）
OPENAI_API_KEY=your-api-key-here
DATABASE_URL=your-database-url-here
```

## 依存関係の管理

### Python

```bash
# uv を使用
uv pip install package-name
uv pip freeze > requirements.txt
```

### Node.js

```bash
# pnpm を使用
pnpm add package-name
pnpm add -D dev-package-name
```

## 注意事項

- Homebrew のインストール先は Apple Silicon で `/opt/homebrew`、Intel Mac で `/usr/local`
- 実行権限が必要なスクリプトは `chmod +x` を付与する
- 改行コードは LF を使用する
