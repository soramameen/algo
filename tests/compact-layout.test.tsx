import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("compact layout at 375px viewport", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all critical UI elements at 375px viewport", () => {
    vi.useFakeTimers();

    render(<App />);

    expect(screen.getByRole("button", { name: /Bubble Sort/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Linear Search/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Array/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "最初から" })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 \/ /)).toBeInTheDocument();
  });

  it("switches algorithms and renders correct visualization at 375px", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    expect(container.querySelectorAll(".bar-card")).toHaveLength(8);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));

    expect(container.querySelectorAll(".search-card")).toHaveLength(8);
    expect(screen.getByText("探す値: 27")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Array/ }));

    expect(container.querySelectorAll(".cell-card")).toHaveLength(5);
    expect(screen.getByText("計算量 O(1)")).toBeInTheDocument();
  });

  it("plays through linear search steps correctly at 375px", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));
    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByLabelText("value 44, index 0")).toHaveClass("active");

    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(900);
      });
    }

    expect(screen.getByLabelText("value 27, index 4")).toHaveClass("matched");
    expect(screen.getByText("27 が見つかりました。探索を終了します。")).toBeInTheDocument();
  });

  it("reset button stops playback and returns to first step at 375px", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));
    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900 * 3);
    });

    expect(screen.getByText(/Step 4 \/ 7/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "最初から" }));

    expect(screen.getByText(/Step 1 \/ 7/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
  });

  it("uses CSS variable for cell min-width to support compact grid", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Array/ }));

    const cellsEl = container.querySelector(".cells") as HTMLElement;
    expect(cellsEl).toBeTruthy();
    expect(cellsEl.style.gridTemplateColumns).toContain("var(--cell-min-width");
  });

  it("animates array operations correctly at 375px viewport", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Array/ }));
    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900 * 4);
    });

    expect(screen.getByLabelText("index 5, value 9")).toHaveClass("shifted");

    act(() => {
      vi.advanceTimersByTime(900 * 11);
    });

    expect(screen.getByText("計算量 O(n)")).toBeInTheDocument();
    expect(screen.getByLabelText("index 5, empty")).toHaveClass("empty");
  });
});
