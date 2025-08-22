import { Ref } from "react";

/**
 * ref에 값을 설정하는 유틸리티 함수
 * @param ref - React ref (RefObject 또는 RefCallback)
 * @param value - 설정할 값
 */
export function setRef<T>(ref: Ref<T>, value: T): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as any).current = value;
  }
}
