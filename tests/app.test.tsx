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
      gridTemplateColumns: "repeat(5, minmax(96px, 1fr))"
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

  it("disables previous and next buttons at the start and end of the steps", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));

    const previousButton = screen.getByRole("button", { name: "前へ" });
    const nextButton = screen.getByRole("button", { name: "次へ" });
    const seek = screen.getByLabelText("シーク");

    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.change(seek, { target: { value: "6" } });

    expect(screen.getByText("Step 7 / 7")).toBeInTheDocument();
    expect(previousButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("stops autoplay on manual step controls and resumes from the current position", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));
    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText("Step 2 / 7")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "次へ" }));

    expect(screen.getByText("Step 3 / 7")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByText("Step 3 / 7")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("シーク"), { target: { value: "5" } });

    expect(screen.getByText("Step 6 / 7")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText("Step 7 / 7")).toBeInTheDocument();
    expect(screen.getByText("27 が見つかりました。探索を終了します。")).toBeInTheDocument();
  });
});
