import { useRef } from "react";

/**
 * 렌더링 시 마지막 ref 값을 자동으로 업데이트하는 훅
 *
 * 매 렌더링마다 ref.current를 업데이트하지만, ref 자체는 재생성되지 않아 의존성 배열에서 안정적입니다.
 * 보통 콜백 함수를 매개변수로 수신할 때 매번 재생성되는 경우에 훅 반환 객체 및 함수 재생성 방지 목적으로 유용합니다.
 *
 * @param initialValue 관리할 초기 값
 * @returns 안정적인 ref 객체
 *
 * @example
 * ```typescript
 * const onMessageRef = useRefLatest(onMessage);
 *
 * // useEffect 의존성 배열에서 안정적
 * useEffect(() => {
 *   const handler = (event) => {
 *     onMessageRef.current?.(event);
 *   };
 *   // ...
 * }, [onMessageRef]); // onMessage가 바뀌어도 effect가 재실행되지 않음
 * ```
 */
export const useRefLatest = <T>(initialValue: T): React.RefObject<T> => {
  const callbackRef = useRef<T>(initialValue); // 초기 설정
  callbackRef.current = initialValue; // 렌더 호출마다 업데이트
  return callbackRef;
};
