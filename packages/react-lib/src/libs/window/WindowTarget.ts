/**
 * Window 및 WindowProxy 의 인터섹션 타입
 */
export type WindowLike = Window | WindowProxy;

/**
 * 대상이 WindowLike 인지 확인합니다.
 * 객체 내부에 postMessage 함수를 가지고 있는지 확인합니다.
 * @param target 대상
 * @returns WindowLike 타입 가드
 */
export const isPostableWindow = (target: unknown): target is WindowLike => {
  return (
    target !== null &&
    target !== undefined &&
    typeof target === "object" &&
    "postMessage" in target &&
    typeof target.postMessage === "function"
  );
};

/**
 * 대상이 Window 인지 여부를 결정합니다.
 *
 * @param target 대상
 * @returns 대상 Window 객체. window 가 아니라고 판단되면 null 을 반환합니다.
 */
export const resolveTargetWindow = (
  target: unknown | null | undefined
): Window | null => {
  // 대상이 없으면 null 반환
  if (!target) return null;
  // 현재 창 자체가 Window 객체인지 확인합니다.
  if (target instanceof Window) return target;
  if (isPostableWindow(target)) return target;
  return null;
};
