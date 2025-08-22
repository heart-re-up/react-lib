import { ElementTarget } from "./useEventListener";

export const resolveTargetElement = (element: ElementTarget): EventTarget => {
  // Window 이벤트 리스너 (명시적으로 element가 undefined인 경우)
  if (element === undefined || element === null) {
    return window;
  }
  // RefObject인지 확인
  else if (element && typeof element === "object" && "current" in element) {
    // Element 이벤트 리스너 (element.current가 존재하는 경우)
    if (element.current) {
      return element.current;
    }
    // Element ref가 제공되었지만 current가 null인 경우 - 경고 출력
    else {
      throw new Error("Element ref is provided but ref.current is null.");
    }
  }
  // 직접 전달된 EventTarget (HTMLElement, Document, Window 등)
  else if (element && typeof element === "object") {
    return element;
  } else {
    throw new Error("Invalid element provided to resolveTargetElement");
  }
};
