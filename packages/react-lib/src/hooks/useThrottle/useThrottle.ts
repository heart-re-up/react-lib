import { useCallback, useRef } from "react";

/**
 * 이벤트를 주기적으로 제한(throttle)하여 연속 호출 시에도 지정된 주기마다 한 번씩만 실행합니다.
 *
 * @template T - 콜백 함수의 타입
 * @param {T} callback - 주기적으로 실행할 함수 (필수)
 * @param {number} [throttleInMillis=1000] - 호출 제한 주기 (밀리초 단위, 기본값: 1000ms)
 * @returns {T} - 제한된(throttled) 함수
 *
 * @example
 * const throttledFunction = useThrottle((value) => {
 *   console.log("Throttled value:", value);
 * }, 500);
 *
 * // 사용 예제
 * throttledFunction("Hello");
 * throttledFunction("World"); // 이전 호출이 끝날 때까지 무시됩니다.
 * => Hello
 */
export const useThrottle = <T extends (...args: never[]) => unknown>(
  callback?: T,
  throttleInMillis: number = 1000
): T => {
  const executable = useRef(true);
  return useCallback(
    (...args: Parameters<T>) => {
      if (!executable.current) {
        return;
      }
      callback?.(...args);
      executable.current = false;
      setTimeout(() => (executable.current = true), throttleInMillis);
    },
    [callback, throttleInMillis]
  ) as T;
};
