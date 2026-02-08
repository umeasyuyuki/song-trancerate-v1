---
name: design-tracker
description: Use this skill to record working decisions during active tasks in docs/for-codex/decision-log.md, especially after browser research or Codex Gate outputs, before promoting final decisions to docs/DESIGN.md.
---

# Design Tracker Skill

作業中の設計判断を `docs/for-codex/decision-log.md` に記録する。

## いつ使うか

- ブラウジング結果から候補を比較したとき
- Gate 1 / Gate 2 の提案を採用・却下したとき
- 最終決定前に判断履歴を残したいとき

## 使わないとき

- 最終版の設計書を更新するとき（`update-design` を使う）

## 記録フォーマット

`docs/for-codex/decision-log.md` の表に追記：

- `id`
- `decision`
- `status (adopt/reject/hold)`
- `rationale`
- `impact`
- `owner`
- `date`
