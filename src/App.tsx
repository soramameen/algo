import { useEffect, useMemo, useState } from "react";
import { algorithms } from "./data/algorithms";
import type { AlgorithmSpec, StepAction } from "./types";

const DEFAULT_INTERVAL_MS = 900;

const actionLabels: Record<StepAction, string> = {
  compare: "Compare",
  swap: "Swap",
  inspect: "Inspect",
  found: "Found",
  settled: "Settled"
};

function getBarStateClass(isActive: boolean, isSorted: boolean, isMatched: boolean) {
  return ["bar-card", isActive ? "active" : "", isSorted ? "sorted" : "", isMatched ? "matched" : ""]
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

    if (stepIndex >= selectedAlgorithm.steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setStepIndex((current) => current + 1);
    }, intervalMs);

    return () => window.clearTimeout(timerId);
  }, [intervalMs, isPlaying, selectedAlgorithm.steps.length, stepIndex]);

  const step = selectedAlgorithm.steps[stepIndex];
  const maxValue = Math.max(...step.values);
  const isSearchAlgorithm = selectedAlgorithm.id === "linear-search";

  return (
    <div className="shell">
      <aside className="sidebar">
        <p className="eyebrow">Algorithm Visualizer</p>
        <h1>アルゴリズムを動きで理解する</h1>
        <p className="lead">
          ソートと探索を同じ土台で見比べながら、状態変化を視覚的に追えるようにします。
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
          <div
            className="bars"
            style={{ gridTemplateColumns: `repeat(${step.values.length}, minmax(0, 1fr))` }}
          >
            {step.values.map((value, index) => {
              const isActive = step.activeIndices.includes(index);
              const isSorted = step.sortedIndices.includes(index);
              const isMatched = step.matchedIndices.includes(index);
              const heightRatio = isSearchAlgorithm ? 56 : Math.max((value / maxValue) * 100, 12);

              return (
                <article
                  key={`${index}-${value}`}
                  className={getBarStateClass(isActive, isSorted, isMatched)}
                >
                  <span className="bar-value">{value}</span>
                  <div className="bar-track" aria-hidden="true">
                    <div className="bar" style={{ height: `${heightRatio}%` }} />
                  </div>
                  <span className="bar-index">{index + 1}</span>
                </article>
              );
            })}
          </div>

          <div className="status-panel">
            <p className="status-label">
              Step {stepIndex + 1} / {selectedAlgorithm.steps.length}
            </p>
            <p className="status-tag">{actionLabels[step.action]}</p>
            <p className="status-message">{step.message}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
