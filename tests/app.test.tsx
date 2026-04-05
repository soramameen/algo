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
    expect(screen.getByRole("group", { name: "入力配列" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  });

  it("applies edited bubble sort inputs and resets playback", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "再生" }));
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByText("44 と 12 を比較します。")).toBeInTheDocument();

    const firstInput = screen.getByLabelText("入力値 1");
    const secondInput = screen.getByLabelText("入力値 2");

    fireEvent.change(firstInput, { target: { value: "5" } });
    fireEvent.change(secondInput, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
    expect(screen.getByText("初期状態です。左から順に比較を始めます。")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll(".bar-value"), (node) => node.textContent)).toEqual([
      "5",
      "1",
      "31",
      "18",
      "27",
      "9",
      "53",
      "21"
    ]);
  });

  it("switches to linear search cards and shows the target", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));

    expect(screen.getByText("探す値: 27")).toBeInTheDocument();
    expect(container.querySelectorAll(".search-card")).toHaveLength(8);
    expect(screen.getByLabelText("value 44, index 0")).toHaveClass("search-card");
    expect(screen.getByRole("spinbutton", { name: "探索値" })).toBeInTheDocument();
  });

  it("applies edited linear search inputs and target", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Linear Search/ }));
    fireEvent.change(screen.getByLabelText("入力値 1"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("入力値 2"), { target: { value: "3" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "探索値" }), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByText("探す値: 3")).toBeInTheDocument();
    expect(screen.getByLabelText("value 8, index 0")).toBeInTheDocument();
    expect(screen.getByLabelText("value 3, index 1")).toBeInTheDocument();
    expect(screen.getByText("3 を左から順に探します。")).toBeInTheDocument();
  });

  it("shows validation errors without replacing the last applied visualization", () => {
    vi.useFakeTimers();

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "再生" }));
    act(() => {
      vi.advanceTimersByTime(900);
    });

    fireEvent.change(screen.getByLabelText("入力値 1"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByText("入力配列は1つ以上の正の整数を入力してください")).toBeInTheDocument();
    expect(screen.getByText("44 と 12 を比較します。")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll(".bar-value"), (node) => node.textContent)).toEqual([
      "44",
      "12",
      "31",
      "18",
      "27",
      "9",
      "53",
      "21"
    ]);
  });

  it("resets the editor to the default sample", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.change(screen.getByLabelText("入力値 1"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "サンプルに戻す" }));

    expect(screen.getByLabelText("入力値 1")).toHaveValue(44);
  });

  it("hides editing controls for array", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Array/ }));

    expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "入力配列" })).not.toBeInTheDocument();
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

  it("sticky header keeps playback controls visible at top of stage", () => {
    render(<App />);

    const hero = document.querySelector(".hero");

    expect(hero).toBeInTheDocument();
    expect(hero).toHaveAttribute("data-sticky");
    expect(hero).toContainElement(screen.getByRole("button", { name: "再生" }));
    expect(hero).toContainElement(screen.getByRole("button", { name: "最初から" }));
  });
});
