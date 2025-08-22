import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a debounced function", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 500));

    expect(typeof result.current).toBe("function");
    expect(typeof result.current.clear).toBe("function");
  });

  it("should debounce function calls", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 500));

    // Call the debounced function multiple times
    act(() => {
      result.current("first");
      result.current("second");
      result.current("third");
    });

    // Function should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Function should be called once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third");
  });

  it("should reset timer on rapid calls", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 500));

    // First call
    act(() => {
      result.current("first");
    });

    // Advance time partially
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Second call before first completes
    act(() => {
      result.current("second");
    });

    // Advance remaining time from first call
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Function should not be called yet (timer was reset)
    expect(mockFn).not.toHaveBeenCalled();

    // Advance full delay time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Function should be called with second arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("second");
  });

  it("should clear pending calls", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 500));

    // Call the debounced function
    act(() => {
      result.current("test");
    });

    // Clear before delay completes
    act(() => {
      result.current.clear();
    });

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Function should not be called
    expect(mockFn).not.toHaveBeenCalled();
  });

  it("should work with different function signatures", () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 300));

    act(() => {
      result.current("arg1", "arg2", { key: "value" });
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", { key: "value" });
  });

  it("should update function reference without breaking debounce", () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ fn, delay }) => useDebounce(fn, delay),
      { initialProps: { fn: mockFn1, delay: 500 } }
    );

    // Call with first function
    act(() => {
      result.current("test");
    });

    // Update function reference
    rerender({ fn: mockFn2, delay: 500 });

    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should call the updated function
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith("test");
  });
});
