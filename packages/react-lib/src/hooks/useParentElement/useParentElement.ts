import { RefObject, useCallback, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import { useMutationObserver } from "../useMutationObserver";

export type UseParentElementOptions = {
  /**
   * 변화를 감지할지 여부 (기본값: true)
   */
  observeChanges?: boolean;
};

export type UseParentElementReturns = {
  /**
   * 부모 요소
   */
  parentElement: HTMLElement | null;
};

/**
 * 제공된 요소의 부모를 ref 에 bind 하는 훅 입니다.
 *
 * @param elementRef 대상 요소의 ref
 * @param options 옵션
 * @returns 부모 요소의 ref
 */
export function useParentElement(
  elementRef: RefObject<HTMLElement | null>,
  options: UseParentElementOptions = {}
): UseParentElementReturns {
  const isServer = typeof window === "undefined";
  const { observeChanges = true } = options;
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLElement | null>(isServer ? null : document.body);

  const updateParent = useCallback(() => {
    console.log("updateParent in useCallback in useRefParentElement");
    const element = elementRef.current;
    const newParent = element?.parentElement || null;
    // 실제로 부모가 변경된 경우만 상태 업데이트
    if (parentRef.current !== newParent) {
      parentRef.current = newParent;
      setParentElement(newParent);
    }
  }, [elementRef]);

  // DOM 변화 감지 (observeChanges가 true이고 브라우저 환경일 때만)
  useMutationObserver({
    targetRef: bodyRef, // body 전체 감시
    callback: updateParent,
    options: {
      childList: true,
      subtree: true,
    },
    disabled: isServer || !observeChanges,
  });

  // 초기 부모 요소 설정
  useIsomorphicLayoutEffect(() => {
    updateParent();
  }, [updateParent]);

  return {
    parentElement,
  };
}
