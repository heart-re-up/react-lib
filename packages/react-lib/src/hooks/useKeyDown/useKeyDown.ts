import { useCallback } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
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

  const callbackRef = useRefLatest(callback);

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
        callbackRef.current?.(keyboardEvent, keyboardEvent.key);
      }
    },
    [disabled, preventDefault, stopPropagation, targetKeys, callbackRef]
  );

  return useEventListener("keydown", handleKeydown, element, {
    capture: false,
  });
};
