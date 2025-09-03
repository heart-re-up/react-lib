import { useState } from "react";
import { hasDocumentFocus } from "./useWindowFocus.util";
import { useWindowFocusChange } from "./useWindowFocusChange";

/**
 * 윈도우 포커스 상태를 관리하는 훅
 *
 * useWindowFocusChange 의 사이트 이펙트 버전
 *
 * @returns
 */
export const useWindowFocusState = (): boolean => {
  const [focused, setFocused] = useState(hasDocumentFocus());
  useWindowFocusChange(setFocused);
  return focused;
};
