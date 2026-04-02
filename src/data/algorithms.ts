import { createBubbleSortSteps } from "../algorithms/bubble-sort";
import { createLinearSearchSteps } from "../algorithms/linear-search";
import type { AlgorithmSpec } from "../types";

const initialValues = [44, 12, 31, 18, 27, 9, 53, 21];
const searchTarget = 27;

export const algorithms: AlgorithmSpec[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    summary: "隣り合う要素を比較して、大きい値を右へ押し出していくソートです。",
    description:
      "各パスで最大値が末尾へ移動していく様子を、棒グラフとステータスメッセージで追跡します。",
    visualization: "bars",
    timeComplexity: "平均・最悪 O(n^2)",
    initialValues,
    steps: createBubbleSortSteps(initialValues)
  },
  {
    id: "linear-search",
    name: "Linear Search",
    summary: "左から順にカードを確認して、目的の要素を見つける探索です。",
    description:
      "カードを左から1枚ずつ確認し、目的の値に到達した瞬間を強調します。",
    visualization: "cards",
    timeComplexity: "最悪 O(n)",
    initialValues,
    targetValue: searchTarget,
    steps: createLinearSearchSteps(initialValues, searchTarget)
  }
];
