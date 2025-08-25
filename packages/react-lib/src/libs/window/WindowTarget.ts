export type WindowLike = Window | WindowProxy;

export type WindowTarget =
  | Window
  | "opener"
  | "parent"
  | "top"
  | "self"
  | `frame:${string}`;

export const hasPrototypeOpener = (target: WindowTarget): target is Window => {
  if (typeof target !== "object") return false;
  if (target === null) return false;
  if (
    "opener" in target &&
    Object.getPrototypeOf(target.opener).constructor.name === "Window"
  ) {
    return true;
  }
  return false;
};

export const findTargetWindow = (
  target: WindowTarget | null | undefined
): Window | null => {
  // 대상이 없으면 null 반환
  if (!target) return null;
  // 현재 창 자체가 Window 객체인지 확인합니다.
  if (target instanceof Window) return target;
  // 프로토타입 체인을 통해 opener 속성이 있는 경우 Window 객체인지 확인합니다.
  if (hasPrototypeOpener(target)) return target as Window;
  // 여기서 부터는 브라우저 window 객체에 접근해서 획득해야 합니다.
  // 브라우저 환경이 아닌 경우 브라우저 window 객체에 접근할 수 없습니다.
  if (typeof window === "undefined") return null;
  if (target === "self") return window; // 코드가 실행중인 현재 윈도우
  if (target === "opener") return window.opener || null; // 부모 윈도우
  if (target === "parent") return window.parent || null; // 부모 윈도우
  if (target === "top") return window.top || null; // 최상위 윈도우

  // frames 중에서 특정 프레임 찾기
  if (typeof target === "string" && target.startsWith("frame:")) {
    const frameName = target.slice(6);
    return window.frames[frameName as keyof typeof window.frames] || null;
  }

  // 특정 프레임 찾기
  return window[target as keyof typeof window] || null;
};
