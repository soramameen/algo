# 最初のアルゴリズム表示までのデプロイ戦略

## Summary
React + TypeScript で、GitHub Pages に自動デプロイする静的サイトとして初期版を作る。最初は Bubble Sort だけを可視化し、UI は日本語、操作は自動再生中心にする。共通化は必要最小限に留め、まずは素直に実装し、後でリファクタリングする前提で進める。

## プレゼン
結論から言うと、先に配信の土台を固めて、最初の Bubble Sort が見えた瞬間にそのまま本番へ流すのが最短です。
この手の可視化サイトは、機能追加よりも「見える・触れる・壊れていない」を早く回す方が価値が高いので、初回から GitHub Pages + GitHub Actions で自動デプロイにします。

やることは3段階です。

1. まず空の土台を deploy 可能にする
2. 次に Bubble Sort を「表示だけできる」状態まで持っていく
3. 最後に本番公開して、以後は PR ベースで改善する

## 具体的な流れ
- Day 0
  - React/TS の初期化
  - GitHub Pages 用の base path 設定
  - Actions の `test + build` ワークフロー作成
  - Pages deploy の導線を作成
- Day 1
  - Bubble Sort の step generator をテスト先行で実装
  - 配列バーの描画を実装
  - まずは固定入力で表示確認
- Day 2
  - autoplay / pause / reset を追加
  - 見た目を整える
  - main へマージして Pages に公開

## 運用ルール
- `main` を公開用ブランチにする
- 作業は feature branch で行い、PR で `test + build` を通す
- merge 後に GitHub Pages へ自動デプロイする
- TDD は step generator から始め、次に playback 状態を固める
- 初期は「壊れないこと」と「見えること」を優先する

## 前提
- 公開先は GitHub Pages
- サーバーは置かない
- 初期アルゴリズムは Bubble Sort のみ
- 共通コンポーネント化は後回し
- 自動デプロイは `main` への push をトリガーにする
