# Delegation Triggers Rule

タスクの自動振り分けルール。

## 判断原則

キーワード一致だけでなく、ユーザー意図で判断する。

- 設計判断・比較・リスク評価が主目的なら Codex へ委譲
- 実装作業・単純編集が主目的なら Antigravity が直接実行
- 実装前後の品質ゲートは Codex を必須化

## 意図ベースの判定

### Gate 1（計画レビュー）を使う

- 実装計画の妥当性を確認したい
- タスク分解や順序を最適化したい
- 依存関係やリスクを洗い出したい

### Gate 2（実装レビュー）を使う

- 実装完了後の回帰を確認したい
- セキュリティ/パフォーマンス/テスト不足を監査したい

### ad-hoc を使う

- 複雑バグの原因分析
- 局所的なトレードオフ判断

## キーワード補助（サブシグナル）

- 設計系: 設計、アーキテクチャ、approach、trade-off
- デバッグ系: エラー、バグ、原因、not working
- レビュー系: レビュー、チェック、verify

## 実行前ガード

`CODEX_MODE` が `plan-review` または `implementation-review` の場合：

1. `/prepare-codex-context` を実行
2. `docs/for-codex/manifest.md` の必須キーを確認
3. `requirements_questions_asked >= 3` と `requirements_confirmed = yes` を確認
4. 曖昧点が残る場合は質問数 4 以上を推奨
5. `conversation_language`, `ui_language`, `readme_language` が日本語優先ポリシーを示す値（`ja-priority` など）であることを確認
6. その後に Codex へ委譲

## 透明性

委譲時は以下をユーザーに明示する：

- なぜ委譲するか
- どの Gate を使うか
- 期待する出力（計画分解 or 実装監査）
