import { useEffect, useMemo, useState } from "react";
import {
  createRobotPathfindingSteps,
  ROBOT_GRID_ROWS,
  ROBOT_GRID_COLS,
  ROBOT_WALLS,
  ROBOT_START,
  ROBOT_GOAL,
} from "../algorithms/robot-pathfinding";
import type { Point, RobotPhase } from "../algorithms/robot-pathfinding";

const PHASE_LABELS: Record<RobotPhase, string> = {
  search: "Searching",
  path: "Tracing Path",
  move: "Moving",
  done: "Complete",
};

const SPEED_OPTIONS = [
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 900, label: "900ms" },
];

const toKey = (p: Point): string => `${p.row},${p.col}`;

const WALL_KEYS = new Set(ROBOT_WALLS.map(toKey));

type CellState =
  | "wall"
  | "robot"
  | "current"
  | "path"
  | "frontier"
  | "visited"
  | "start"
  | "goal"
  | "empty";

function getCellClass(
  row: number,
  col: number,
  isRobot: boolean,
  isCurrent: boolean,
  pathSet: Set<string>,
  frontierSet: Set<string>,
  visitedSet: Set<string>
): string {
  const key = toKey({ row, col });
  const isStart = row === ROBOT_START.row && col === ROBOT_START.col;
  const isGoal = row === ROBOT_GOAL.row && col === ROBOT_GOAL.col;

  let state: CellState = "empty";

  if (WALL_KEYS.has(key)) {
    state = "wall";
  } else if (isRobot) {
    state = "robot";
  } else if (isCurrent) {
    state = "current";
  } else if (pathSet.has(key)) {
    state = "path";
  } else if (frontierSet.has(key)) {
    state = "frontier";
  } else if (visitedSet.has(key)) {
    state = "visited";
  } else if (isStart) {
    state = "start";
  } else if (isGoal) {
    state = "goal";
  }

  return `robot-pathfinding-cell robot-pathfinding-cell-${state}`;
}

export default function RobotPathfindingVisualizer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalMs, setIntervalMs] = useState(500);

  const steps = useMemo(() => createRobotPathfindingSteps(), []);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const lastStepIndex = steps.length - 1;
    const timerId = window.setInterval(() => {
      setStepIndex((current) =>
        current >= lastStepIndex ? current : current + 1
      );
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [intervalMs, isPlaying, steps.length]);

  useEffect(() => {
    if (stepIndex >= steps.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, stepIndex, steps.length]);

  const step = steps[stepIndex];
  const phaseLabel = PHASE_LABELS[step.phase];
  const robot = step.robot;

  const frontierSet = useMemo(
    () => new Set(step.frontier.map(toKey)),
    [step.frontier]
  );
  const visitedSet = useMemo(
    () => new Set(step.visited.map(toKey)),
    [step.visited]
  );
  const pathSet = useMemo(
    () => new Set(step.path.map(toKey)),
    [step.path]
  );

  const handlePlay = () => {
    if (stepIndex >= steps.length - 1) return;
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="robot-pathfinding-container"
      data-testid="robot-pathfinding"
    >
      <div className="robot-pathfinding-header">
        <h2
          className="robot-pathfinding-title"
          data-testid="robot-pathfinding-title"
        >
          Robot Pathfinding
        </h2>
        <p className="robot-pathfinding-description">
          BFSでグリッドを幅優先に探索し、最短経路を見つけます。
        </p>
        <p className="robot-pathfinding-description">
          探索後に経路を復元し、ロボットがゴールまで移動します。
        </p>
      </div>

      <div className="robot-pathfinding-controls">
        <button
          type="button"
          onClick={isPlaying ? handlePause : handlePlay}
          data-testid="robot-pathfinding-play-pause"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          data-testid="robot-pathfinding-reset"
        >
          Reset
        </button>
        <label>
          Speed
          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            data-testid="robot-pathfinding-speed"
          >
            {SPEED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="robot-pathfinding-status-bar">
        <span
          className="robot-pathfinding-phase"
          data-testid="robot-pathfinding-phase"
        >
          {phaseLabel}
        </span>
        <span
          className="robot-pathfinding-message"
          data-testid="robot-pathfinding-status"
        >
          {step.message}
        </span>
        <span className="robot-pathfinding-step-counter">
          Step {stepIndex + 1} / {steps.length}
        </span>
      </div>

      <div
        className="robot-pathfinding-grid"
        data-testid="robot-pathfinding-grid"
      >
        {Array.from(
          { length: ROBOT_GRID_ROWS * ROBOT_GRID_COLS },
          (_, idx) => {
            const row = Math.floor(idx / ROBOT_GRID_COLS);
            const col = idx % ROBOT_GRID_COLS;
            const isStart =
              row === ROBOT_START.row && col === ROBOT_START.col;
            const isGoal =
              row === ROBOT_GOAL.row && col === ROBOT_GOAL.col;
            const isRobot = robot.row === row && robot.col === col;
            const isCurrent =
              step.current !== null &&
              step.current.row === row &&
              step.current.col === col;

            return (
              <div
                key={`${row}-${col}`}
                className={getCellClass(
                  row,
                  col,
                  isRobot,
                  isCurrent,
                  pathSet,
                  frontierSet,
                  visitedSet
                )}
                data-row={row}
                data-col={col}
              >
                {isStart ? (
                  <span className="robot-pathfinding-marker">S</span>
                ) : null}
                {isGoal ? (
                  <span className="robot-pathfinding-marker">G</span>
                ) : null}
              </div>
            );
          }
        )}
      </div>

      <div
        className="robot-pathfinding-legend"
        data-testid="robot-pathfinding-legend"
      >
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-wall" />
          Wall
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-visited" />
          Visited
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-frontier" />
          Frontier
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-current" />
          Current
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-path" />
          Path
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-robot" />
          Robot
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-start" />
          Start
        </span>
        <span className="robot-pathfinding-legend-item">
          <span className="robot-pathfinding-legend-swatch robot-pathfinding-cell-goal" />
          Goal
        </span>
      </div>
    </div>
  );
}
