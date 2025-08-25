import { useEventListener } from "../useEventListener";
import { isVisible } from "./utils";

export type UseVisibilityChangeProps = (visible: boolean) => void;

export type UseVisibilityChangeReturns = void;

/**
 * 윈도우의 가시성 상태가 변경될 때 호출되는 이벤트 핸들러를 등록하고,
 * 현재 윈도우의 가시성 상태를 반환하는 훅
 * @param callback - 이벤트 핸들러 콜백 함수
 * @returns 현재 윈도우의 가시성 상태
 */
export const useVisibilityChange = (
  callback?: UseVisibilityChangeProps
): UseVisibilityChangeReturns => {
  callback?.(isVisible()); // 초기 상태 반환
  useEventListener("visibilitychange", () => {
    callback?.(isVisible());
  });
};
