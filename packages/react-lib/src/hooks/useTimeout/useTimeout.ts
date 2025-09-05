import { useCallback, useRef } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";

export type UseTimeoutProps = {
  /** 타임아웃 이후 실행될 액션 */
  action: () => void;
  /** millisecond */
  delay?: number;
  onCanceled?: () => void;
  onStart?: () => void;
  onCompleted?: () => void;
};
export type UseTimeoutReturns = {
  cancel: () => void;
  start: () => void;
};
export const useTimeout = (props: UseTimeoutProps): UseTimeoutReturns => {
  const { action, delay, onStart, onCompleted, onCanceled } = props;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const actionRef = useRef(action);
  const delayRef = useRef(delay);

  const onStartRef = useRefLatest(onStart);
  const onCompletedRef = useRefLatest(onCompleted);
  const onCanceledRef = useRefLatest(onCanceled);

  if (timeoutRef.current !== null && delayRef.current !== delay) {
    throw new Error(
      [
        "useTimeout:",
        "delay is not allowed to change after start",
        `current delay: ${delayRef.current}`,
        `new delay: ${delay}`,
      ].join("\n")
    );
  }

  // 항상 최신 action을 참조하도록 업데이트
  actionRef.current = action;
  delayRef.current = delay;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // clearInterval -> clearTimeout 수정
      timeoutRef.current = null;
      onCanceledRef.current?.();
    }
  }, [onCanceledRef]);

  const start = useCallback(() => {
    cancel();
    timeoutRef.current = setTimeout(() => {
      actionRef.current(); // 최신 action 실행
      onCompletedRef.current?.();
    }, delay);
    onStartRef.current?.();
  }, [cancel, delay, onCompletedRef, onStartRef]); // action 의존성 제거

  return { cancel, start };
};
