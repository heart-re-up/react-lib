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
  const { ref: mutationRef } = useMutationObserver({
    callback: updateParent,
    options: {
      childList: true,
      subtree: true,
    },
  });

  // body 에서 전체 변화를 관찰하여 대상 요소의 부모 변화를 감지한다.
  // 서버이거나 관찰 비활성 시에는 수행하지 않는다.
  useIsomorphicLayoutEffect(() => {
    if (isServer || !observeChanges) return;
    if (document?.body) {
      mutationRef(document.body);
    }
  }, [isServer, observeChanges, mutationRef]);

  // 초기 부모 요소 설정
  useIsomorphicLayoutEffect(() => {
    updateParent();
  }, [updateParent]);

  return {
    parentElement,
  };
}
