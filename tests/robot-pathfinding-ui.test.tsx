import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { createRobotPathfindingSteps } from "../src/algorithms/robot-pathfinding";

describe("Robot Pathfinding UI", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function selectRobot() {
    fireEvent.click(screen.getByRole("button", { name: /Robot Pathfinding/ }));
  }

  it("sidebar shows Robot Pathfinding", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /Robot Pathfinding/ })
    ).toBeInTheDocument();
  });

  it("selecting shows Robot Pathfinding title", () => {
    render(<App />);
    selectRobot();
    expect(screen.getByTestId("robot-pathfinding-title")).toHaveTextContent(
      "Robot Pathfinding"
    );
  });

  it("shows dedicated grid", () => {
    render(<App />);
    selectRobot();
    expect(screen.getByTestId("robot-pathfinding-grid")).toBeInTheDocument();
  });

  it("shows phase display", () => {
    render(<App />);
    selectRobot();
    expect(screen.getByTestId("robot-pathfinding-phase")).toBeInTheDocument();
  });

  it("shows legend", () => {
    render(<App />);
    selectRobot();
    expect(screen.getByTestId("robot-pathfinding-legend")).toBeInTheDocument();
  });

  it("shows S and G markers", () => {
    render(<App />);
    selectRobot();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
  });

  it("hides hero, controls, input editor, generic visualizer, status panel", () => {
    render(<App />);
    selectRobot();
    expect(screen.queryByText("Now Visualizing")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "再生" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "入力配列" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: /visualization/ })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/計算量/)).not.toBeInTheDocument();
  });

  it("Play advances phase or message", () => {
    vi.useFakeTimers();
    render(<App />);
    selectRobot();

    const before = screen.getByTestId("robot-pathfinding-status").textContent;
    fireEvent.click(screen.getByTestId("robot-pathfinding-play-pause"));
    act(() => {
      vi.advanceTimersByTime(600);
    });

    const after = screen.getByTestId("robot-pathfinding-status").textContent;
    expect(after).not.toBe(before);
  });

  it("Reset returns to initial phase, message, robot position", () => {
    vi.useFakeTimers();
    render(<App />);
    selectRobot();

    fireEvent.click(screen.getByTestId("robot-pathfinding-play-pause"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    fireEvent.click(screen.getByTestId("robot-pathfinding-reset"));
    expect(screen.getByTestId("robot-pathfinding-phase")).toHaveTextContent(
      "Searching"
    );
    expect(screen.getByTestId("robot-pathfinding-status")).toHaveTextContent(
      "探索を開始します"
    );
  });

  it("Reset preserves speed setting", () => {
    vi.useFakeTimers();
    render(<App />);
    selectRobot();

    fireEvent.change(screen.getByTestId("robot-pathfinding-speed"), {
      target: { value: "250" },
    });
    fireEvent.click(screen.getByTestId("robot-pathfinding-reset"));
    expect(screen.getByTestId("robot-pathfinding-speed")).toHaveValue("250");
  });

  it("Play at last step is no-op", () => {
    vi.useFakeTimers();
    render(<App />);
    selectRobot();

    const total = createRobotPathfindingSteps().length;
    fireEvent.click(screen.getByTestId("robot-pathfinding-play-pause"));
    act(() => {
      vi.advanceTimersByTime(total * 600);
    });

    expect(screen.getByTestId("robot-pathfinding-phase")).toHaveTextContent(
      "Complete"
    );
    fireEvent.click(screen.getByTestId("robot-pathfinding-play-pause"));
    expect(screen.getByTestId("robot-pathfinding-play-pause")).toHaveTextContent(
      "Play"
    );
  });
});
