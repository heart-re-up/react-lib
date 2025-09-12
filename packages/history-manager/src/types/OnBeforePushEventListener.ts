/**
 * 원본 history 의 push 이벤트 발생 전 이벤트 리스너 타입
 */
export type OnBeforePushEventListener = (
  data: unknown,
  url?: string | URL | null
) => void;

/**
 * 원본 history 의 push 이벤트 발생 전 이벤트 리스너 이벤트 핸들러 인터페이스
 */
export interface OnBeforePushEventHandler {
  addOnBeforePushEventListener(listener: OnBeforePushEventListener): void;
  removeOnBeforePushEventListener(listener: OnBeforePushEventListener): void;
}
