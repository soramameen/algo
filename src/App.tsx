import { useEffect, useMemo, useState } from "react";
import { algorithms } from "./data/algorithms";
import type { AlgorithmSpec, StepAction } from "./types";

const DEFAULT_INTERVAL_MS = 900;

const actionLabels: Record<StepAction, string> = {
  compare: "Compare",
  swap: "Swap",
  inspect: "Inspect",
  found: "Found",
  settled: "Settled",
  access: "Access",
  insert: "Insert",
  delete: "Delete"
};

function getBarStateClass(isActive: boolean, isSorted: boolean, isMatched: boolean) {
  return ["bar-card", isActive ? "active" : "", isSorted ? "sorted" : "", isMatched ? "matched" : ""]
    .filter(Boolean)
    .join(" ");
}

function getSearchCardClass(isActive: boolean, isMatched: boolean) {
  return ["search-card", isActive ? "active" : "", isMatched ? "matched" : ""].filter(Boolean).join(" ");
}

function getCellClass(
  isActive: boolean,
  isShifted: boolean,
  isWritten: boolean,
  isEmpty: boolean
) {
  return [
    "cell-card",
    isActive ? "active" : "",
    isShifted ? "shifted" : "",
    isWritten ? "written" : "",
    isEmpty ? "empty" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function App() {
  const [selectedId, setSelectedId] = useState<AlgorithmSpec["id"]>("bubble-sort");
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);

  const selectedAlgorithm = useMemo(
    () => algorithms.find((algorithm) => algorithm.id === selectedId) ?? algorithms[0],
    [selectedId]
  );

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [selectedId]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const lastStepIndex = selectedAlgorithm.steps.length - 1;
    const timerId = window.setInterval(() => {
      setStepIndex((current) => (current >= lastStepIndex ? current : current + 1));
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [intervalMs, isPlaying, selectedAlgorithm.steps.length]);

  useEffect(() => {
    if (stepIndex >= selectedAlgorithm.steps.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, selectedAlgorithm.steps.length, stepIndex]);

  const step = selectedAlgorithm.steps[stepIndex];
  const complexity = step.complexity ?? selectedAlgorithm.complexity;
  const maxValue = Math.max(...step.values);
  const visualization = selectedAlgorithm.visualization;
  const cells = step.slots ?? step.values.map((value) => value);

  return (
    <div className="shell">
      <aside className="sidebar">
        <p className="eyebrow">Algorithm Visualizer</p>
        <h1>アルゴリズムを動きで理解する</h1>
        <p className="lead">
          アルゴリズムごとに合う表現で、状態変化を視覚的に追えるようにします。
        </p>

        <nav className="algorithm-list" aria-label="アルゴリズム一覧">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              type="button"
              className={algorithm.id === selectedAlgorithm.id ? "algorithm-card active" : "algorithm-card"}
              onClick={() => setSelectedId(algorithm.id)}
            >
              <span>{algorithm.name}</span>
              <small>{algorithm.summary}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="stage">
        <section className="hero">
          <div>
            <p className="eyebrow">Now Visualizing</p>
            <h2>{selectedAlgorithm.name}</h2>
            <p>{selectedAlgorithm.description}</p>
            {selectedAlgorithm.targetValue !== undefined ? (
              <p className="target-chip">探す値: {selectedAlgorithm.targetValue}</p>
            ) : null}
          </div>

          <div className="controls">
            <button type="button" onClick={() => setIsPlaying((current) => !current)}>
              {isPlaying ? "一時停止" : "再生"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStepIndex(0);
                setIsPlaying(false);
              }}
            >
              最初から
            </button>
            <label>
              速度
              <select
                value={intervalMs}
                onChange={(event) => setIntervalMs(Number(event.target.value))}
              >
                <option value={1200}>ゆっくり</option>
                <option value={900}>標準</option>
                <option value={500}>速い</option>
              </select>
            </label>
          </div>
        </section>

        <section className="visualizer" aria-label={`${selectedAlgorithm.name} visualization`}>
          {visualization === "cards" ? (
            <div className="search-cards">
              {step.values.map((value, index) => {
                const isActive = step.activeIndices.includes(index);
                const isMatched = step.matchedIndices.includes(index);

                return (
                  <article
                    key={`${index}-${value}`}
                    className={getSearchCardClass(isActive, isMatched)}
                    aria-label={`value ${value}, index ${index}`}
                  >
                    <span className="search-value">{value}</span>
                    <span className="search-index">index {index}</span>
                  </article>
                );
              })}
            </div>
          ) : visualization === "cells" ? (
            <div
              className="cells"
              style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
            >
              {cells.map((cell, index) => {
                const isActive = step.activeIndices.includes(index);
                const isShifted = step.shiftedIndices?.includes(index) ?? false;
                const isWritten = step.writtenIndices?.includes(index) ?? false;
                const isEmpty = cell === null;

                return (
                  <article
                    key={`${index}-${cell ?? "empty"}`}
                    className={getCellClass(isActive, isShifted, isWritten, isEmpty)}
                    aria-label={isEmpty ? `index ${index}, empty` : `index ${index}, value ${cell}`}
                  >
                    <span className="cell-index">index {index}</span>
                    <span className="cell-value">{isEmpty ? "empty" : cell}</span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              className="bars"
              style={{ gridTemplateColumns: `repeat(${step.values.length}, minmax(0, 1fr))` }}
            >
              {step.values.map((value, index) => {
                const isActive = step.activeIndices.includes(index);
                const isSorted = step.sortedIndices.includes(index);
                const isMatched = step.matchedIndices.includes(index);
                const heightRatio = Math.max((value / maxValue) * 100, 12);

                return (
                  <article
                    key={`${index}-${value}`}
                    className={getBarStateClass(isActive, isSorted, isMatched)}
                  >
                    <span className="bar-value">{value}</span>
                    <div className="bar-track" aria-hidden="true">
                      <div className="bar" style={{ height: `${heightRatio}%` }} />
                    </div>
                    <span className="bar-index">index {index}</span>
                  </article>
                );
              })}
            </div>
          )}

          <div className="status-panel">
            <p className="status-label">
              Step {stepIndex + 1} / {selectedAlgorithm.steps.length}
            </p>
            <p className="status-tag">{actionLabels[step.action]}</p>
            <p className="status-complexity">計算量 {complexity}</p>
            <p className="status-message">{step.message}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
