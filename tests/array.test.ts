import { describe, expect, it } from "vitest";
import { createArraySteps } from "../src/algorithms/array";

describe("createArraySteps", () => {
  it("creates access, insert, and delete steps with cell snapshots", () => {
    const steps = createArraySteps([12, 27, 18, 44, 9]);

    expect(steps[0]?.action).toBe("access");
    expect(steps[1]?.activeIndices).toEqual([2]);
    expect(steps[1]?.complexity).toBe("O(1)");
    expect(steps.at(-1)?.slots).toEqual([12, 31, 18, 44, 9, null]);
    expect(steps.at(-1)?.complexity).toBe("O(n)");
  });

  it("shifts the insertion target from the tail toward the index", () => {
    const steps = createArraySteps([12, 27, 18, 44, 9]);
    const insertShiftSnapshots = steps
      .filter((step) => step.action === "insert" && (step.shiftedIndices?.length ?? 0) > 0)
      .map((step) => step.slots);

    expect(insertShiftSnapshots).toEqual([
      [12, 27, 18, 44, 9, 9],
      [12, 27, 18, 44, 44, 9],
      [12, 27, 18, 18, 44, 9]
    ]);
  });

  it("compacts the tail after deletion", () => {
    const steps = createArraySteps([12, 27, 18, 44, 9]);
    const deleteSteps = steps.filter((step) => step.action === "delete");

    expect(deleteSteps.at(-1)?.slots).toEqual([12, 31, 18, 44, 9, null]);
    expect(deleteSteps.some((step) => step.writtenIndices?.includes(5))).toBe(true);
  });
});
