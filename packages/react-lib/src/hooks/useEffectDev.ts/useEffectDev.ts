import { useEffect } from "react";

export const useEffectDev = (
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void => {
  useEffect(
    () => {
      if (process.env.NODE_ENV !== "production") {
        return effect();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effect, ...(deps || [])]
  );
};
