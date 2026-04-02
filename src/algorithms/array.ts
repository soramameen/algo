import type { AlgorithmStep } from "../types";

type CellSnapshot = Array<number | null>;

const cloneSlots = (slots: CellSnapshot) => [...slots];

const compactSlots = (slots: CellSnapshot) => slots.filter((value): value is number => value !== null);

function createStep(
  slots: CellSnapshot,
  action: AlgorithmStep["action"],
  message: string,
  options: Partial<
    Pick<
      AlgorithmStep,
    "activeIndices" | "shiftedIndices" | "writtenIndices" | "complexity"
    >
  > = {}
): AlgorithmStep {
  const activeIndices = options.activeIndices ?? [];

  return {
    values: compactSlots(slots),
    slots: cloneSlots(slots),
    sortedIndices: [],
    matchedIndices: [],
    action,
    message,
    activeIndices,
    shiftedIndices: options.shiftedIndices,
    writtenIndices: options.writtenIndices,
    complexity: options.complexity
  };
}

export function createArraySteps(input: number[]): AlgorithmStep[] {
  const initialValues = [...input];
  const steps: AlgorithmStep[] = [];

  const accessSlots: CellSnapshot = [...initialValues];
  const accessIndex = 2;

  steps.push(
    createStep(accessSlots, "access", `初期状態です。index ${accessIndex} を参照します。`, {
      complexity: "O(1)"
    })
  );
  steps.push(
    createStep(accessSlots, "access", `index ${accessIndex} の ${accessSlots[accessIndex]} を読み取ります。`, {
      activeIndices: [accessIndex],
      complexity: "O(1)"
    })
  );
  steps.push(
    createStep(accessSlots, "access", `${accessSlots[accessIndex]} を取得しました。`, {
      complexity: "O(1)"
    })
  );

  const insertIndex = 2;
  const insertValue = 31;
  const insertSlots: CellSnapshot = [...initialValues, null];

  steps.push(
    createStep(insertSlots, "insert", `index ${insertIndex} に ${insertValue} を挿入します。末尾から順に詰めます。`, {
      complexity: "O(n)"
    })
  );

  for (let sourceIndex = insertSlots.length - 2; sourceIndex >= insertIndex; sourceIndex -= 1) {
    const targetIndex = sourceIndex + 1;
    const movedValue = insertSlots[sourceIndex];

    if (movedValue === null) {
      continue;
    }

    insertSlots[targetIndex] = movedValue;
    steps.push(
      createStep(insertSlots, "insert", `index ${sourceIndex} の ${movedValue} を index ${targetIndex} に移動します。`, {
        activeIndices: [sourceIndex, targetIndex],
        shiftedIndices: [targetIndex],
        complexity: "O(n)"
      })
    );
  }

  insertSlots[insertIndex] = insertValue;
  steps.push(
    createStep(insertSlots, "insert", `index ${insertIndex} に ${insertValue} を書き込みます。`, {
      activeIndices: [insertIndex],
      writtenIndices: [insertIndex],
      complexity: "O(n)"
    })
  );
  steps.push(
    createStep(insertSlots, "settled", "挿入が完了しました。", {
      complexity: "O(n)"
    })
  );

  const deleteIndex = 1;
  const deleteSlots: CellSnapshot = [...insertSlots];

  steps.push(
    createStep(deleteSlots, "delete", `index ${deleteIndex} の ${deleteSlots[deleteIndex]} を削除します。後続要素を左へ詰めます。`, {
      complexity: "O(n)"
    })
  );

  for (let sourceIndex = deleteIndex + 1; sourceIndex < deleteSlots.length; sourceIndex += 1) {
    const targetIndex = sourceIndex - 1;
    const movedValue = deleteSlots[sourceIndex];

    if (movedValue === null) {
      continue;
    }

    deleteSlots[targetIndex] = movedValue;
    steps.push(
      createStep(deleteSlots, "delete", `index ${sourceIndex} の ${movedValue} を index ${targetIndex} に移動します。`, {
        activeIndices: [sourceIndex, targetIndex],
        shiftedIndices: [targetIndex],
        complexity: "O(n)"
      })
    );
  }

  deleteSlots[deleteSlots.length - 1] = null;
  steps.push(
    createStep(deleteSlots, "delete", "末尾を空セルとして開放します。", {
      writtenIndices: [deleteSlots.length - 1],
      complexity: "O(n)"
    })
  );
  steps.push(
    createStep(deleteSlots, "settled", "削除が完了しました。", {
      complexity: "O(n)"
    })
  );

  return steps;
}
