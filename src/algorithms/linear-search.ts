import type { AlgorithmStep } from "../types";

const clone = (values: number[]) => [...values];

export function createLinearSearchSteps(input: number[], targetValue: number): AlgorithmStep[] {
  const values = clone(input);
  const steps: AlgorithmStep[] = [
    {
      values,
      activeIndices: [],
      sortedIndices: [],
      matchedIndices: [],
      action: "inspect",
      message: `${targetValue} を左から順に探します。`
    }
  ];

  for (let index = 0; index < values.length; index += 1) {
    steps.push({
      values,
      activeIndices: [index],
      sortedIndices: [],
      matchedIndices: [],
      action: "inspect",
      message: `${index + 1} 番目の ${values[index]} を確認します。`
    });

    if (values[index] === targetValue) {
      steps.push({
        values,
        activeIndices: [],
        sortedIndices: [],
        matchedIndices: [index],
        action: "found",
        message: `${targetValue} が見つかりました。探索を終了します。`
      });

      return steps;
    }
  }

  steps.push({
    values,
    activeIndices: [],
    sortedIndices: [],
    matchedIndices: [],
    action: "settled",
    message: `${targetValue} は見つかりませんでした。`
  });

  return steps;
}
