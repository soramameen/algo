import { describe, expect, it } from "vitest";
import { createBubbleSortSteps } from "../src/algorithms/bubble-sort";

describe("createBubbleSortSteps", () => {
  it("returns the sorted values on the final step", () => {
    const steps = createBubbleSortSteps([5, 1, 4, 2]);

    expect(steps.at(-1)?.values).toEqual([1, 2, 4, 5]);
    expect(steps.at(-1)?.message).toBe("ソート完了です。");
    expect(steps.at(-1)?.matchedIndices).toEqual([]);
  });

  it("records swap actions when adjacent items are out of order", () => {
    const steps = createBubbleSortSteps([3, 2, 1]);

    expect(steps.some((step) => step.action === "swap")).toBe(true);
  });
});
