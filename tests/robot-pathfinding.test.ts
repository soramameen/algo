import { describe, expect, it } from "vitest";
import {
  createRobotPathfindingSteps,
  getRobotPathfindingPath,
  ROBOT_EXPECTED_PATH,
  ROBOT_START,
  ROBOT_GOAL,
  type Point,
} from "../src/algorithms/robot-pathfinding";

const eq = (a: Point, b: Point): boolean => a.row === b.row && a.col === b.col;

describe("Robot Pathfinding logic", () => {
  const steps = createRobotPathfindingSteps();

  it("full path matches expected path exactly", () => {
    expect(getRobotPathfindingPath()).toEqual(ROBOT_EXPECTED_PATH);
  });

  it("shortest path is 14 moves / 15 cells", () => {
    expect(ROBOT_EXPECTED_PATH).toHaveLength(15);
  });

  it("initial step has fixed values", () => {
    expect(steps[0]).toEqual({
      phase: "search",
      current: null,
      frontier: [],
      visited: [ROBOT_START],
      path: [],
      robot: ROBOT_START,
      message: "探索を開始します",
    });
  });

  it("first exploration step has fixed current, frontier, visited, message", () => {
    const step = steps[1];
    expect(step.phase).toBe("search");
    expect(step.current).toEqual({ row: 0, col: 0 });
    expect(step.frontier).toEqual([]);
    expect(step.visited).toEqual([ROBOT_START]);
    expect(step.message).toBe("候補を順に調べています");
  });

  it("goal discovery step has fixed phase, current, message", () => {
    const goalStep = steps.find((s) => s.message === "ゴールを発見しました")!;
    expect(goalStep.phase).toBe("search");
    expect(goalStep.current).toEqual(ROBOT_GOAL);
    expect(goalStep.message).toBe("ゴールを発見しました");
  });

  it("path start step has path = [start]", () => {
    const pathStart = steps.find((s) => s.phase === "path")!;
    expect(pathStart.path).toEqual([ROBOT_START]);
  });

  it("path complete step has full path", () => {
    const pathSteps = steps.filter((s) => s.phase === "path");
    const lastPath = pathSteps[pathSteps.length - 1];
    expect(lastPath.path).toEqual(ROBOT_EXPECTED_PATH);
  });

  it("move start step has robot = start", () => {
    const moveStart = steps.find((s) => s.phase === "move")!;
    expect(moveStart.robot).toEqual(ROBOT_START);
  });

  it("done step has phase=done, robot=goal, path=full path", () => {
    const done = steps[steps.length - 1];
    expect(done.phase).toBe("done");
    expect(done.robot).toEqual(ROBOT_GOAL);
    expect(done.path).toEqual(ROBOT_EXPECTED_PATH);
  });

  it("frontier excludes current and all frontier elements are in visited", () => {
    const searchSteps = steps.filter(
      (s) => s.phase === "search" && s.current !== null
    );
    for (const step of searchSteps) {
      expect(step.frontier.some((f) => eq(f, step.current!))).toBe(false);
      for (const f of step.frontier) {
        expect(step.visited.some((v) => eq(v, f))).toBe(true);
      }
    }
  });
});
