import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for manual playback before advancing steps", () => {
    vi.useFakeTimers();

    render(<App />);

    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 \//)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Step 1 \//)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "再生" }));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByRole("button", { name: "一時停止" })).toBeInTheDocument();
    expect(screen.getByText(/Step 2 \//)).toBeInTheDocument();
  });

  it("does not autoplay when switching algorithms", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));

    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 \//)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Step 1 \//)).toBeInTheDocument();
  });
});
