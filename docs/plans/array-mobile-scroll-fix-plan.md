# Array モバイル崩れ修正プラン

## Summary
既存の `Array` 可視化は、PC では見やすい一方で、スマホ幅では 1 行に並ぶセル列が潰れて読みにくくなっている。
この計画では `Array` のセル列だけを対象に、最小幅を維持したまま横スクロールできる表示へ調整する。

## Status
- 状態: ready for implementation
- 対象: `Array` の `cells` 表示のみ
- 既存の `bars` と `cards` には影響を入れない

## Goal
- スマホでも index と value を読める状態を維持する
- セルを無理に縮めず、横スクロールで全体を見られるようにする
- 既存の `Array` の step generator とテストは壊さない

## Scope
### In Scope
- `Array` のセル列に横スクロールを許可する
- セルの最小幅を定義する
- モバイルでの見え方を確認するテストを追加する
- 必要最小限の `App` 変更

### Out of Scope
- `access`, `insert`, `delete` のロジック変更
- step generator の見直し
- 入力フォーム追加
- 別ページ化

## Current State
- `Array` は [`/tmp/algo-array-visualization/src/App.tsx`](/tmp/algo-array-visualization/src/App.tsx) で `cells` レイアウトとして描画されている
- [`/tmp/algo-array-visualization/src/styles.css`](/tmp/algo-array-visualization/src/styles.css) の `.cells` は grid だが、横スクロールを許可していない
- 現在の実装は `repeat(..., minmax(0, 1fr))` で列を詰めるため、スマホ幅でセルが潰れる

## Implementation Path
1. `docs/plans/` にこの修正計画を追加する
2. `Array` のセル列に最小幅を設定する
3. `overflow-x: auto` を使って横スクロールできるようにする
4. 必要なら `App` 側の `gridTemplateColumns` を最小幅ベースに調整する
5. `tests/app.test.tsx` で `Array` のセル列が維持されることを確認する
6. `npm test` と `npm run build` を通す

## Verification
- モバイル幅でセルが潰れず、index と value が判読できる
- `Array` のセル列が横方向にスクロール可能
- `npm test` が通る
- `npm run build` が通る

## Risks
- 最小幅を大きくしすぎると、短い画面でスクロール量が増える
- `overflow-x` を付ける場所を誤ると、意図しない横はみ出しがページ全体に波及する
- `bars` と `cards` に同じ変更を広げると、既存レイアウトのバランスを壊す
