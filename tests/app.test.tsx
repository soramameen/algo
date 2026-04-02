import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App playback", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not auto-play on initial render", () => {
    vi.useFakeTimers();

    render(<App />);

    expect(screen.getByText(/Step\s+1\s+\/\s+52/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/Step\s+1\s+\/\s+52/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
  });

  it("starts playback only after pressing play", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(screen.getByText(/Step\s+2\s+\/\s+52/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "一時停止" })).toBeInTheDocument();
  });
});
