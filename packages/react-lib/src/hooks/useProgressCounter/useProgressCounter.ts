import { useCallback, useEffect, useMemo, useState } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";

export type UseProgressCounterProps = {
  onChangeCount?: (count: number) => void;
  onChangeProgress?: (progress: boolean) => void;
};

export type UseProgressCounterReturns = {
  count: number;
  progress: boolean;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useProgressCounter = (
  props?: UseProgressCounterProps
): UseProgressCounterReturns => {
  const { onChangeCount, onChangeProgress } = props || {};
  const onChangeCountRef = useRefLatest(onChangeCount);
  const onChangeProgressRef = useRefLatest(onChangeProgress);
  const [count, setCount] = useState(0);
  const progress = useMemo(() => count > 0, [count]);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, 0));
  }, [setCount]);

  const reset = useCallback(() => {
    setCount(0);
  }, [setCount]);

  useEffect(() => {
    onChangeCountRef.current?.(count);
    onChangeProgressRef.current?.(progress);
  }, [count, progress, onChangeCountRef, onChangeProgressRef]);

  return useMemo(
    () => ({
      count,
      progress,
      increment,
      decrement,
      reset,
    }),
    [count, progress, increment, decrement, reset]
  );
};
