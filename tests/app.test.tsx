import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the bubble sort bars on first load", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    expect(screen.getByRole("button", { name: /Bubble Sort/ })).toHaveClass("active");
    expect(container.querySelectorAll(".bar-card")).toHaveLength(8);
  });

  it("switches to linear search cards and shows the target", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));

    expect(screen.getByText("探す値: 27")).toBeInTheDocument();
    expect(container.querySelectorAll(".search-card")).toHaveLength(8);
    expect(screen.getByLabelText("value 44, index 0")).toHaveClass("search-card");
  });

  it("switches to array cells and shows the access complexity", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Array/ }));

    expect(screen.getByText("計算量 O(1)")).toBeInTheDocument();
    expect(container.querySelectorAll(".cell-card")).toHaveLength(5);
    expect(container.querySelector(".cells")).toHaveStyle({
      gridTemplateColumns: "repeat(5, minmax(var(--cell-min-width, 96px), 1fr))"
    });
    expect(screen.getByLabelText("index 2, value 18")).toBeInTheDocument();
  });

  it("marks the current and matched cards while linear search advances", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));
    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByLabelText("value 44, index 0")).toHaveClass("active");

    for (let index = 0; index < 5; index += 1) {
      act(() => {
        vi.advanceTimersByTime(900);
      });
    }

    expect(screen.getByText("27 が見つかりました。探索を終了します。")).toBeInTheDocument();
    expect(screen.getByLabelText("value 27, index 4")).toHaveClass("matched");
  });

  it("animates array insert and delete operations", () => {
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
