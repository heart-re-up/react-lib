import { useState } from "react";
import { useVisibilityChange } from "./useVisibilityChange";
import { isVisible } from "./utils";

/**
 * 윈도우의 가시성 상태를 관리하는 훅
 *
 * useVisiblityChange 의 사이트 이펙트 버전
 *
 * @returns
 */
export const useVisibilityState = (): boolean => {
  const [visible, setVisible] = useState(isVisible());
  useVisibilityChange(setVisible);
  return visible;
};
