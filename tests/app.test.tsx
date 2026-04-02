import { fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts paused and only advances after pressing play", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 \/ \d+/)).toHaveTextContent("Step 1 /");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Step 1 \/ \d+/)).toHaveTextContent("Step 1 /");

    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText(/Step 2 \/ \d+/)).toHaveTextContent("Step 2 /");
  });

  it("shows a legend and explicit labels for value and index", () => {
    render(<App />);

    expect(screen.getByLabelText("凡例")).toHaveTextContent("上 = 値");
    expect(screen.getByLabelText("凡例")).toHaveTextContent("下 = index");
    expect(screen.getAllByLabelText(/値 \d+, index \d+/)).toHaveLength(8);
  });
});
