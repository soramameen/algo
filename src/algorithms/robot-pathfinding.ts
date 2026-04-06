export type Point = {
  row: number;
  col: number;
};

export type RobotPhase = "search" | "path" | "move" | "done";

export type RobotPathfindingStep = {
  phase: RobotPhase;
  current: Point | null;
  frontier: Point[];
  visited: Point[];
  path: Point[];
  robot: Point;
  message: string;
};

export const ROBOT_GRID_ROWS = 8;
export const ROBOT_GRID_COLS = 8;

export const ROBOT_START: Point = { row: 0, col: 0 };
export const ROBOT_GOAL: Point = { row: 7, col: 7 };

export const ROBOT_WALLS: Point[] = [
  { row: 0, col: 3 },
  { row: 1, col: 1 },
  { row: 1, col: 3 },
  { row: 1, col: 5 },
  { row: 2, col: 5 },
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 3, col: 3 },
  { row: 4, col: 5 },
  { row: 5, col: 1 },
  { row: 5, col: 5 },
  { row: 6, col: 3 }
];

export const ROBOT_EXPECTED_PATH: Point[] = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: 2 },
  { row: 1, col: 2 },
  { row: 2, col: 2 },
  { row: 2, col: 3 },
  { row: 2, col: 4 },
  { row: 3, col: 4 },
  { row: 3, col: 5 },
  { row: 3, col: 6 },
  { row: 3, col: 7 },
  { row: 4, col: 7 },
  { row: 5, col: 7 },
  { row: 6, col: 7 },
  { row: 7, col: 7 }
];

const DIRECTIONS: Point[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: -1, col: 0 }
];

const toKey = (p: Point): string => `${p.row},${p.col}`;

const eq = (a: Point, b: Point): boolean => a.row === b.row && a.col === b.col;

const parseKey = (k: string): Point => {
  const parts = k.split(",");
  return { row: Number(parts[0]), col: Number(parts[1]) };
};

function reconstructPath(parent: Map<string, string>): Point[] {
  const path: Point[] = [];
  let currentKey = toKey(ROBOT_GOAL);
  while (currentKey !== undefined) {
    path.unshift(parseKey(currentKey));
    const p = parent.get(currentKey);
    if (p === undefined) break;
    currentKey = p;
  }
  return path;
}

function isValidCell(p: Point, wallSet: Set<string>): boolean {
  return (
    p.row >= 0 &&
    p.row < ROBOT_GRID_ROWS &&
    p.col >= 0 &&
    p.col < ROBOT_GRID_COLS &&
    !wallSet.has(toKey(p))
  );
}

export function getRobotPathfindingPath(): Point[] {
  const wallSet = new Set(ROBOT_WALLS.map(toKey));
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: Point[] = [ROBOT_START];
  visited.add(toKey(ROBOT_START));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (eq(current, ROBOT_GOAL)) {
      const path = reconstructPath(parent);
      return path;
    }

    for (const dir of DIRECTIONS) {
      const neighbor: Point = { row: current.row + dir.row, col: current.col + dir.col };
      const nk = toKey(neighbor);
      if (isValidCell(neighbor, wallSet) && !visited.has(nk)) {
        visited.add(nk);
        parent.set(nk, toKey(current));
        queue.push(neighbor);
      }
    }
  }

  throw new Error("No path found");
}

export function createRobotPathfindingSteps(): RobotPathfindingStep[] {
  const steps: RobotPathfindingStep[] = [];
  const wallSet = new Set(ROBOT_WALLS.map(toKey));
  const visitedSet = new Set<string>();
  const visitedOrder: Point[] = [];
  const parent = new Map<string, string>();
  const queue: Point[] = [ROBOT_START];

  visitedSet.add(toKey(ROBOT_START));
  visitedOrder.push(ROBOT_START);

  // Initial step
  steps.push({
    phase: "search",
    current: null,
    frontier: [],
    visited: [...visitedOrder],
    path: [],
    robot: ROBOT_START,
    message: "探索を開始します"
  });

  // BFS exploration
  while (queue.length > 0) {
    const current = queue.shift()!;
    const frontierSnapshot = [...queue];

    // Exploration step
    steps.push({
      phase: "search",
      current,
      frontier: frontierSnapshot,
      visited: [...visitedOrder],
      path: [],
      robot: ROBOT_START,
      message: "候補を順に調べています"
    });

    if (eq(current, ROBOT_GOAL)) {
      // Goal discovery step
      steps.push({
        phase: "search",
        current: ROBOT_GOAL,
        frontier: frontierSnapshot,
        visited: [...visitedOrder],
        path: [],
        robot: ROBOT_START,
        message: "ゴールを発見しました"
      });
      break;
    }

    // Process neighbors
    for (const dir of DIRECTIONS) {
      const neighbor: Point = { row: current.row + dir.row, col: current.col + dir.col };
      const nk = toKey(neighbor);
      if (isValidCell(neighbor, wallSet) && !visitedSet.has(nk)) {
        visitedSet.add(nk);
        visitedOrder.push(neighbor);
        parent.set(nk, toKey(current));
        queue.push(neighbor);
      }
    }
  }

  // Reconstruct path
  const fullPath = reconstructPath(parent);

  const finalVisited = [...visitedOrder];

  // Path start step
  steps.push({
    phase: "path",
    current: null,
    frontier: [],
    visited: finalVisited,
    path: [fullPath[0]],
    robot: ROBOT_START,
    message: "最短経路を復元しています"
  });

  // Path progress steps
  for (let i = 1; i < fullPath.length; i++) {
    steps.push({
      phase: "path",
      current: null,
      frontier: [],
      visited: finalVisited,
      path: fullPath.slice(0, i + 1),
      robot: ROBOT_START,
      message: "最短経路を復元しています"
    });
  }

  // Move start step
  steps.push({
    phase: "move",
    current: null,
    frontier: [],
    visited: finalVisited,
    path: fullPath,
    robot: ROBOT_START,
    message: "ロボットがゴールへ移動しています"
  });

  // Move progress steps
  for (let i = 1; i < fullPath.length; i++) {
    steps.push({
      phase: "move",
      current: null,
      frontier: [],
      visited: finalVisited,
      path: fullPath,
      robot: fullPath[i],
      message: "ロボットがゴールへ移動しています"
    });
  }

  // Done step
  steps.push({
    phase: "done",
    current: null,
    frontier: [],
    visited: finalVisited,
    path: fullPath,
    robot: ROBOT_GOAL,
    message: "ゴールに到達しました"
  });

  return steps;
}
