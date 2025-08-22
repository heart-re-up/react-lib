import { useCallback, useMemo } from "react";
import {
  useProgressCounter,
  UseProgressCounterProps,
  UseProgressCounterReturns,
} from "../useProgressCounter";

export type UseProgressCounterAsyncProps = UseProgressCounterProps & {};

export type UseProgressCounterAsyncReturns = {
  progressCounterWith: <T>(operation: () => Promise<T>) => Promise<T>;
} & UseProgressCounterReturns;

export const useProgressCounterAsync = (
  props?: UseProgressCounterAsyncProps
): UseProgressCounterAsyncReturns => {
  const { count, progress, increment, decrement, reset } =
    useProgressCounter(props);
  const progressCounterWith = useCallback(
    async <T>(operation: () => Promise<T>) => {
      increment();
      try {
        return await operation();
      } finally {
        decrement();
      }
    },
    [increment, decrement]
  );

  return useMemo(
    () => ({
      count,
      progress,
      increment,
      decrement,
      reset,
      progressCounterWith,
    }),
    [count, progress, increment, decrement, reset, progressCounterWith]
  );
};
