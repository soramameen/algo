import { useEffect, useMemo, useState } from "react";
import { algorithms } from "./data/algorithms";
import type { AlgorithmSpec, StepAction } from "./types";
import RobotPathfindingVisualizer from "./components/RobotPathfindingVisualizer";

const DEFAULT_INTERVAL_MS = 900;

type AppliedInputs = {
  values: number[];
  targetValue?: number;
};

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

function createDraftValues(values: number[]) {
  return values.map((value) => String(value));
}

function getDefaultInputs(algorithm: AlgorithmSpec): AppliedInputs {
  return {
    values: [...algorithm.initialValues],
    targetValue: algorithm.targetValue
  };
}

function parsePositiveInteger(value: string) {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);

  return parsed > 0 ? parsed : null;
}

function validateInputs(
  algorithm: AlgorithmSpec,
  draftValues: string[],
  draftTargetValue: string
): { values: number[]; targetValue?: number } | { error: string } {
  const values = draftValues
    .map((value) => parsePositiveInteger(value))
    .filter((value): value is number => value !== null);

  if (draftValues.length === 0 || values.length !== draftValues.length) {
    return { error: "入力配列は1つ以上の正の整数を入力してください" };
  }

  if (algorithm.targetValue === undefined) {
    return { values };
  }

  const targetValue = parsePositiveInteger(draftTargetValue);

  if (targetValue === null) {
    return { error: "探索値は正の整数を入力してください" };
  }

  return {
    values,
    targetValue
  };
}

function App() {
  const [selectedContentId, setSelectedContentId] = useState<AlgorithmSpec["id"] | "robot-pathfinding">("bubble-sort");
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);

  const selectedAlgorithm = useMemo(
    () => algorithms.find((algorithm) => algorithm.id === selectedContentId) ?? algorithms[0],
    [selectedContentId]
  );

  const [draftValues, setDraftValues] = useState(() => createDraftValues(selectedAlgorithm.initialValues));
  const [draftTargetValue, setDraftTargetValue] = useState(() => String(selectedAlgorithm.targetValue ?? ""));
  const [appliedInputs, setAppliedInputs] = useState<AppliedInputs>(() => getDefaultInputs(selectedAlgorithm));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = useMemo(
    () => selectedAlgorithm.createSteps(appliedInputs.values, appliedInputs.targetValue),
    [appliedInputs.targetValue, appliedInputs.values, selectedAlgorithm]
  );

  useEffect(() => {
    const defaults = getDefaultInputs(selectedAlgorithm);

    setDraftValues(createDraftValues(defaults.values));
    setDraftTargetValue(String(defaults.targetValue ?? ""));
    setAppliedInputs(defaults);
    setErrorMessage(null);
    setStepIndex(0);
    setIsPlaying(false);
  }, [selectedContentId]);

  useEffect(() => {
    if (!isPlaying || selectedContentId === "robot-pathfinding") {
      return undefined;
    }

    const lastStepIndex = steps.length - 1;
    const timerId = window.setInterval(() => {
      setStepIndex((current) => (current >= lastStepIndex ? current : current + 1));
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [intervalMs, isPlaying, steps.length]);

  useEffect(() => {
    if (stepIndex >= steps.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, stepIndex, steps.length]);

  const step = steps[stepIndex];
  const complexity = step.complexity ?? selectedAlgorithm.complexity;
  const maxValue = Math.max(...step.values, 1);
  const visualization = selectedAlgorithm.visualization;
  const cells = step.slots ?? step.values.map((value) => value);
  const displayTargetValue = selectedAlgorithm.targetValue !== undefined ? appliedInputs.targetValue : undefined;

  const handleApply = () => {
    const result = validateInputs(selectedAlgorithm, draftValues, draftTargetValue);

    if ("error" in result) {
      setErrorMessage(result.error);
      return;
    }

    setAppliedInputs(result);
    setErrorMessage(null);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    const defaults = getDefaultInputs(selectedAlgorithm);

    setDraftValues(createDraftValues(defaults.values));
    setDraftTargetValue(String(defaults.targetValue ?? ""));
    setAppliedInputs(defaults);
    setErrorMessage(null);
    setStepIndex(0);
    setIsPlaying(false);
  };

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
              className={algorithm.id === selectedContentId ? "algorithm-card active" : "algorithm-card"}
              onClick={() => setSelectedContentId(algorithm.id)}
            >
              <span>{algorithm.name}</span>
              <small>{algorithm.summary}</small>
            </button>
          ))}
          <button
            type="button"
            className={selectedContentId === "robot-pathfinding" ? "algorithm-card active" : "algorithm-card"}
            onClick={() => setSelectedContentId("robot-pathfinding")}
          >
            <span>Robot Pathfinding</span>
            <small>BFSでグリッド上の最短経路を探索します。</small>
          </button>
        </nav>
      </aside>

      <main className="stage">
        {selectedContentId === "robot-pathfinding" ? (
          <RobotPathfindingVisualizer />
        ) : (
          <>
        <section className="hero">
          <div>
            <p className="eyebrow">Now Visualizing</p>
            <h2>{selectedAlgorithm.name}</h2>
            <p>{selectedAlgorithm.description}</p>
            {displayTargetValue !== undefined ? (
              <p className="target-chip">探す値: {displayTargetValue}</p>
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

        {selectedAlgorithm.isEditable ? (
          <section className="editor-panel" aria-label={`${selectedAlgorithm.name} editor`}>
            <fieldset className="input-editor">
              <legend>入力配列</legend>
              <div className="input-grid">
                {draftValues.map((value, index) => (
                  <div key={`${selectedAlgorithm.id}-${index}`} className="input-row">
                    <label className="input-field">
                      <span>入力値 {index + 1}</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        aria-label={`入力値 ${index + 1}`}
                        value={value}
                        onChange={(event) => {
                          setDraftValues((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? event.target.value : item
                            )
                          );
                          setErrorMessage(null);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="input-row-button"
                      onClick={() => {
                        setDraftValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
                        setErrorMessage(null);
                      }}
                      disabled={draftValues.length === 1}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>

            {selectedAlgorithm.targetValue !== undefined ? (
              <label className="target-editor">
                <span>探索値</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={draftTargetValue}
                  onChange={(event) => {
                    setDraftTargetValue(event.target.value);
                    setErrorMessage(null);
                  }}
                />
              </label>
            ) : null}

            <div className="editor-actions">
              <button
                type="button"
                className="input-row-button"
                onClick={() => {
                  setDraftValues((current) => [...current, String(current.length + 1)]);
                  setErrorMessage(null);
                }}
              >
                要素を追加
              </button>
              <button type="button" className="input-row-button primary" onClick={handleApply}>
                Apply
              </button>
              <button type="button" className="input-row-button secondary" onClick={handleReset}>
                サンプルに戻す
              </button>
            </div>

            {errorMessage ? <p className="editor-error">{errorMessage}</p> : null}
          </section>
        ) : null}

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
              style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(96px, 1fr))` }}
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
              Step {stepIndex + 1} / {steps.length}
            </p>
            <p className="status-tag">{actionLabels[step.action]}</p>
            <p className="status-complexity">計算量 {complexity}</p>
            <p className="status-message">{step.message}</p>
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
