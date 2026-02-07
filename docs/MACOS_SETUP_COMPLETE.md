# macOS版 Antigravity Orchestra 完全セットアップ手順（非エンジニア向け）

この手順は、**macOS（Apple Silicon）** で  
**Antigravity + Codex CLI を使った Orchestra 環境**を最初から作るための完全版です。

対象:

- ターミナル操作に慣れていない人
- 「まず動く状態」に最短で到達したい人
- このテンプレートをそのまま使いたい人

---

## 0. 先に確認すること

### 必要なもの

1. Mac（Apple Silicon 推奨）
2. インターネット接続
3. ChatGPT Plus または Pro（Codex 利用のため）
4. Google Antigravity を起動できること

### 1行ずつ実行する場所

このガイドの `bash` コマンドは、**macOSのターミナル**（Terminal.app）で実行します。

---

## 1. 初期セットアップ（初回のみ）

### 1-1. Homebrew を入れる

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

確認:

```bash
brew --version
```

### 1-2. Node.js を入れる

```bash
brew install node
```

確認:

```bash
node --version
which node
```

`which node` が `/opt/homebrew/bin/node` ならOK（Apple Silicon標準）。

### 1-3. Codex CLI を入れる

```bash
npm i -g @openai/codex
```

確認:

```bash
codex --version
which codex
```

`which codex` が `/opt/homebrew/bin/codex` ならOK。

---

## 2. Orchestra テンプレートを配置する

### 2-1. プロジェクト用フォルダへ移動

```bash
mkdir -p ~/Projects
cd ~/Projects
```

### 2-2. テンプレートを取得

```bash
git clone https://github.com/Sora-bluesky/antigravity-orchestra.git my-project
cd my-project
```

### 2-3. 実行権限を付与（安全のため毎回やってOK）

```bash
chmod +x .agent/skills/codex-system/scripts/*.sh
```

---

## 3. このテンプレートの macOS 前提値を確認

このテンプレートは macOS 向けに最適化済みです。  
デフォルトは次のパスを使います。

```bash
NODE_PATH=/opt/homebrew/bin/node
CODEX_PATH=/opt/homebrew/bin/codex
```

ヘルプ表示テスト:

```bash
bash .agent/skills/codex-system/scripts/ask_codex.sh --help
```

---

## 4. Antigravity 側で開く

1. Antigravity を起動
2. `File -> Open Folder`
3. `~/Projects/my-project` を選択

---

## 5. 動作確認（最重要）

Antigravity のチャットに以下を入力:

```text
/startproject Hello World
```

成功の目安:

1. リポジトリ分析が始まる
2. 要件ヒアリングが出る
3. Codex 相談が走る
4. `docs/DESIGN.md` が更新される
5. `logs/codex-responses/` にログが追加される

---

## 6. うまく動かない時の対処

### A. `codex: command not found`

```bash
which codex
npm i -g @openai/codex
```

### B. `permission denied`（.shが実行できない）

```bash
chmod +x .agent/skills/codex-system/scripts/*.sh
```

### C. Node/Codex の場所が違う

現在値を確認:

```bash
which node
which codex
```

その場だけ上書き実行:

```bash
NODE_PATH="$(which node)" \
CODEX_PATH="$(which codex)" \
bash .agent/skills/codex-system/scripts/ask_codex.sh --mode analyze --question "Environment check"
```

### D. Codex の認証で止まる

`codex` コマンド実行時の案内に従って OAuth サインインを完了してください。

---

## 7. 日常運用の最短手順

毎回はこの3つだけでOKです。

```bash
cd ~/Projects/my-project
chmod +x .agent/skills/codex-system/scripts/*.sh
```

その後、Antigravity で `~/Projects/my-project` を開き、チャットで実行:

```text
/startproject 作りたい機能名
```

---

## 8. あなたの環境向けメモ

現在確認済みパス:

- Node: `/opt/homebrew/bin/node`
- Codex: `/opt/homebrew/bin/codex`

この値は本テンプレートの macOS デフォルト設定と一致しています。
