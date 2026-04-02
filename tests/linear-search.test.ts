import { describe, expect, it } from "vitest";
import { createLinearSearchSteps } from "../src/algorithms/linear-search";

describe("createLinearSearchSteps", () => {
  it("finds the target and marks the matching index", () => {
    const steps = createLinearSearchSteps([44, 12, 31, 18, 27], 27);

    expect(steps.at(-1)?.action).toBe("found");
    expect(steps.at(-1)?.matchedIndices).toEqual([4]);
    expect(steps.at(-1)?.message).toBe("27 が見つかりました。探索を終了します。");
  });

  it("inspects items from left to right", () => {
    const steps = createLinearSearchSteps([9, 3, 7], 7);
    const inspectedIndices = steps
      .filter((step) => step.action === "inspect" && step.activeIndices.length > 0)
      .map((step) => step.activeIndices[0]);

    expect(inspectedIndices).toEqual([0, 1, 2]);
  });

  it("finishes without a match when the target is absent", () => {
    const steps = createLinearSearchSteps([9, 3, 7], 8);

    expect(steps.at(-1)?.action).toBe("settled");
    expect(steps.at(-1)?.matchedIndices).toEqual([]);
    expect(steps.at(-1)?.message).toBe("8 は見つかりませんでした。");
  });
});
