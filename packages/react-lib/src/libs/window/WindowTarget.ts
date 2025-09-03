export type WindowLike = Window | WindowProxy;

export const isPostableWindow = (target: object): target is WindowLike => {
  return (
    target !== null &&
    target !== undefined &&
    typeof target === "object" &&
    "postMessage" in target &&
    typeof target.postMessage === "function"
  );
};

export const findTargetWindow = (
  target: object | null | undefined
): Window | null => {
  // 대상이 없으면 null 반환
  if (!target) return null;
  // 현재 창 자체가 Window 객체인지 확인합니다.
  if (target instanceof Window) return target;
  if (isPostableWindow(target)) return target;
  return null;
};
