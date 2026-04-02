import { createBubbleSortSteps } from "../algorithms/bubble-sort";
import type { AlgorithmSpec } from "../types";

const initialValues = [44, 12, 31, 18, 27, 9, 53, 21];

export const algorithms: AlgorithmSpec[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    summary: "隣り合う要素を比較して、大きい値を右へ押し出していくソートです。",
    description:
      "各パスで最大値が末尾へ移動していく様子を、棒グラフとステータスメッセージで追跡します。",
    initialValues,
    steps: createBubbleSortSteps(initialValues)
  }
];
