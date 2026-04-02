import { fireEvent, render, screen, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
});
