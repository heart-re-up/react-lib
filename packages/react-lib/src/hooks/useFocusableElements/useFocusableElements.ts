import { RefObject, useCallback, useEffect, useState } from "react";
import { getFocusableElements } from "../useFocusTrap/useFocusTrap.util";
import { useMutationObserver } from "../useMutationObserver";

export type UseFocusableElementsProps = {
  /**
   * 포커스 가능한 요소를 찾을 컨테이너 요소 ref
   */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * 포커스 가능한 요소 변경 감지 여부
   */
  observeChange?: boolean;
  /**
   * MutationObserver 디바운스 지연 시간 (ms)
   */
  debounceObserving?: number;
};

export type UseFocusableElementsReturn = {
  /**
   * 현재 포커스 가능한 요소들
   */
  focusableElements: HTMLElement[];
};

export const useFocusableElements = (
  options: UseFocusableElementsProps
): UseFocusableElementsReturn => {
  const {
    containerRef,
    observeChange = false,
    debounceObserving: debounceDelay = 200,
  } = options;
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  // 포커스 가능한 요소들을 업데이트하는 함수
  const updateFocusableElements = useCallback(() => {
    console.log("updateFocusableElements called");

    if (!containerRef.current) {
      setFocusableElements([]);
      return;
    }

    const elements = getFocusableElements(containerRef.current);
    console.log("Found focusable elements:", elements.length);
    setFocusableElements(elements);
  }, [containerRef]);

  // MutationObserver 콜백
  const handleMutation = useCallback(
    (mutations: MutationRecord[]) => {
      console.log(
        "Mutations detected:",
        mutations.map((m) => ({
          type: m.type,
          target: m.target,
          attributeName: m.attributeName,
          addedNodes: m.addedNodes.length,
          removedNodes: m.removedNodes.length,
        }))
      );

      updateFocusableElements();
    },
    [updateFocusableElements]
  );

  // MutationObserver로 DOM 변경 감지
  useMutationObserver({
    targetRef: containerRef,
    callback: handleMutation,
    options: {
      childList: true,
      subtree: true,
      attributes: false, // 임시로 속성 변경 감지 비활성화
    },
    disabled: !observeChange,
    debounceDelay,
  });

  // 최초에 초기 포커스 가능한 요소들 설정 - observeChange와 관계없이 실행
  useEffect(() => {
    if (!containerRef.current) return;
    updateFocusableElements();
  }, [containerRef, updateFocusableElements]);

  // observeChange가 활성화된 경우에만 변화 감지를 위한 추가 호출
  useEffect(() => {
    if (!observeChange || !containerRef.current) return;
    updateFocusableElements();
  }, [observeChange, containerRef, updateFocusableElements]);

  return {
    focusableElements,
  };
};
