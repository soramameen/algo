import { createArraySteps } from "../algorithms/array";
import { createBubbleSortSteps } from "../algorithms/bubble-sort";
import { createLinearSearchSteps } from "../algorithms/linear-search";
import type { AlgorithmSpec } from "../types";

const initialValues = [44, 12, 31, 18, 27, 9, 53, 21];
const searchTarget = 27;

export const algorithms: AlgorithmSpec[] = [
  {
    id: "bubble-sort",
    visualization: "bars",
    name: "Bubble Sort",
    summary: "隣り合う要素を比較して、大きい値を右へ押し出していくソートです。",
    description:
      "各パスで最大値が末尾へ移動していく様子を、棒グラフとステータスメッセージで追跡します。",
    initialValues,
    complexity: "O(n^2)",
    steps: createBubbleSortSteps(initialValues)
  },
  {
    id: "linear-search",
    visualization: "cards",
    name: "Linear Search",
    summary: "左から順にカードを確認して、目的の要素を見つける探索です。",
    description:
      "カードを左から1枚ずつ確認し、目的の値に到達した瞬間を強調します。",
    initialValues,
    targetValue: searchTarget,
    complexity: "O(n)",
    steps: createLinearSearchSteps(initialValues, searchTarget)
  },
  {
    id: "array",
    visualization: "cells",
    name: "Array",
    summary: "配列の参照・挿入・削除の流れを、セル列で最小限に確認します。",
    description:
      "index を直接たどる access と、末尾から詰める insert / delete の動きをセル単位で追います。",
    initialValues: [12, 27, 18, 44, 9],
    complexity: "O(1) / O(n)",
    steps: createArraySteps([12, 27, 18, 44, 9])
  }
];
