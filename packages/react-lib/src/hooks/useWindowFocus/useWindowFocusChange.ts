import { useEventListener } from "../useEventListener";

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
  useEventListener("focus", (e: FocusEvent) => callback?.(true, e));
  useEventListener("blur", (e: FocusEvent) => callback?.(false, e));
};
