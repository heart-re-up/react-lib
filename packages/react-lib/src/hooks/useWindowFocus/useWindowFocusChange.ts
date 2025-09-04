import { useEventListener } from "../useEventListener";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import { useCallback } from "react";

export type UseWindowFocusChangeProps = (
  focused: boolean,
  e: FocusEvent
) => void;

export type UseWindowFocusChangeReturns = void;

/**
 * 윈도우 포커스 상태가 변경될 때 호출되는 이벤트 핸들러를 등록하고,
 * 현재 윈도우의 포커스 상태를 반환하는 훅
 * @param props - 이벤트 핸들러 콜백 함수
 * @returns 현재 윈도우의 포커스 상태
 */
export const useWindowFocusChange = (
  callback?: UseWindowFocusChangeProps
): UseWindowFocusChangeReturns => {
  const callbackRef = useRefLatest(callback);
  const handleFocus = useCallback((e: FocusEvent) => {
    callbackRef.current?.(true, e);
  }, [callbackRef]);
  const handleBlur = useCallback((e: FocusEvent) => {
    callbackRef.current?.(false, e);
  }, [callbackRef]);

  useEventListener("focus", handleFocus);
  useEventListener("blur", handleBlur);
};
