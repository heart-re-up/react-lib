import { useCallback } from "react";

/**
 * 여러 이벤트 핸들러 함수를 하나로 결합하는 훅
 * @param handlers 결합할 이벤트 핸들러 배열
 * @returns 모든 핸들러를 순차적으로 실행하는 단일 핸들러 함수
 */
export const useForkEvent = <E>(
  ...handlers: Array<((event: E) => void) | undefined>
): ((event: E) => void) => {
  return useCallback((event: E) => {
    handlers.forEach((handler) => {
      if (typeof handler === "function") {
        handler(event);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, handlers);
};
