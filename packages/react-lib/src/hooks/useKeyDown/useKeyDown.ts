import { useEventListener, ElementTarget } from "../useEventListener";

type UseKeyDownOptions<T extends EventTarget> = {
  disabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  element?: ElementTarget<T>;
};

export function useKeyDown<T extends EventTarget>(
  targetKeys: string[],
  callback?: (event: KeyboardEvent, key: string) => void,
  options: UseKeyDownOptions<T> = {}
) {
  const {
    disabled = false,
    preventDefault = false,
    stopPropagation = false,
    element,
  } = options;

  const handleKeydown = (event: KeyboardEvent | Event) => {
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
  };

  useEventListener("keydown", handleKeydown, element, { capture: false });
}
