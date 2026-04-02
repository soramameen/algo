import type { AlgorithmStep } from "../types";

const clone = (values: number[]) => [...values];

export function createBubbleSortSteps(input: number[]): AlgorithmStep[] {
  const values = clone(input);
  const steps: AlgorithmStep[] = [
    {
      values: clone(values),
      activeIndices: [],
      sortedIndices: [],
      matchedIndices: [],
      action: "compare",
      message: "初期状態です。左から順に比較を始めます。"
    }
  ];

  const sortedIndices = new Set<number>();

  for (let pass = 0; pass < values.length - 1; pass += 1) {
    for (let index = 0; index < values.length - 1 - pass; index += 1) {
      steps.push({
        values: clone(values),
        activeIndices: [index, index + 1],
        sortedIndices: [...sortedIndices].sort((left, right) => left - right),
        matchedIndices: [],
        action: "compare",
        message: `${values[index]} と ${values[index + 1]} を比較します。`
      });

      if (values[index] > values[index + 1]) {
        [values[index], values[index + 1]] = [values[index + 1], values[index]];

        steps.push({
          values: clone(values),
          activeIndices: [index, index + 1],
          sortedIndices: [...sortedIndices].sort((left, right) => left - right),
          matchedIndices: [],
          action: "swap",
          message: "順序が逆なので入れ替えます。"
        });
      }
    }

    sortedIndices.add(values.length - 1 - pass);

    steps.push({
      values: clone(values),
      activeIndices: [],
      sortedIndices: [...sortedIndices].sort((left, right) => left - right),
      matchedIndices: [],
      action: "settled",
      message: `${values.length - pass} 番目に大きい値が確定しました。`
    });
  }

  if (values.length > 0) {
    sortedIndices.add(0);
  }

  steps.push({
    values: clone(values),
    activeIndices: [],
    sortedIndices: [...sortedIndices].sort((left, right) => left - right),
    matchedIndices: [],
    action: "settled",
    message: "ソート完了です。"
  });

  return steps;
}
