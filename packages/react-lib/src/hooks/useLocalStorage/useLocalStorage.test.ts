import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should initialize with initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    const [value] = result.current;

    expect(value).toBe("initial");
  });

  it("should initialize with value from localStorage when available", () => {
    localStorageMock.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    const [value] = result.current;

    expect(value).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      const [, setValue, , flush] = result.current;
      setValue("new-value");
      // flush를 호출하여 즉시 localStorage에 저장
      flush();
    });

    const [value] = result.current;
    expect(value).toBe("new-value");
    expect(localStorageMock.getItem("test-key")).toBe(
      JSON.stringify("new-value")
    );
  });

  it("should work with function updater", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 10));

    act(() => {
      const [, setValue, , flush] = result.current;
      setValue((prev) => prev + 5);
      // flush를 호출하여 즉시 localStorage에 저장
      flush();
    });

    const [value] = result.current;
    expect(value).toBe(15);
    expect(localStorageMock.getItem("test-key")).toBe(JSON.stringify(15));
  });

  it("should handle JSON parsing errors gracefully", () => {
    localStorageMock.setItem("test-key", "invalid-json");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    const [value] = result.current;

    expect(value).toBe("default");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
