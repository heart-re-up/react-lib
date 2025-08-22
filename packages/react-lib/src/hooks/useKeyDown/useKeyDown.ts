import { useCallback } from "react";
import { ElementTarget, useEventListener } from "../useEventListener";

export type UseKeyDownOptions<T extends EventTarget> = {
  disabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  element?: ElementTarget<T>;
};

export const useKeyDown = <T extends EventTarget>(
  targetKeys: string[],
  callback?: (event: KeyboardEvent, key: string) => void,
  options?: UseKeyDownOptions<T>
): void => {
  const {
    disabled = false,
    preventDefault = false,
    stopPropagation = false,
    element,
  } = options ?? {};

  const handleKeydown = useCallback(
    (event: KeyboardEvent | Event): void => {
      if (disabled) return;

      const keyboardEvent = event as KeyboardEvent;

      if (targetKeys.includes(keyboardEvent.key)) {
        if (preventDefault) {
          keyboardEvent.preventDefault();
        }
        if (stopPropagation) {
          keyboardEvent.stopPropagation();
        }
        callback?.(keyboardEvent, keyboardEvent.key);
      }
    },
    [disabled, preventDefault, stopPropagation, targetKeys, callback]
  );

  return useEventListener("keydown", handleKeydown, element, {
    capture: false,
  });
};
