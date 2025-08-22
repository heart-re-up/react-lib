import { RefObject, useCallback, useEffect } from "react";
import { useFocus, UseFocusReturn } from "../useFocus";
import {
  useFocusableElements,
  UseFocusableElementsReturn,
} from "../useFocusableElements";

export type UseFocusTrapProps = {
  disabled?: boolean;
  autoFocus?: boolean;
  containerRef: RefObject<HTMLElement | null>;
};

export type UseFocusTrapReturn = UseFocusReturn & UseFocusableElementsReturn;

export const useFocusTrap = (
  options: UseFocusTrapProps
): UseFocusTrapReturn => {
  const { disabled = false, autoFocus = true, containerRef } = options;

  // useFocusableElements 훅 사용
  // 포커스 할 요소만 필터링
  const { focusableElements } = useFocusableElements({
    containerRef,
    observeChange: !disabled, // disabled가 false일 때 true로 설정
    debounceObserving: 200,
  });

  // useFocus 훅 사용
  // 요소를 제공해서 포커스 명령을 사용할 수 있도록 한다.
  const {
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  } = useFocus({
    focusableElements,
  });

  // Tab 키 핸들러
  const handleKeyDown = useCallback(
    (event: Event) => {
      const keyEvent = event as KeyboardEvent;

      if (keyEvent.key !== "Tab") return;

      // 현재 포커스된 요소가 이 컨테이너 내부에 있는지 확인
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement || !containerRef.current?.contains(activeElement)) {
        return; // 이 컨테이너와 관련 없는 이벤트는 무시
      }

      // ✅ 즉시 전파 차단 - 더 바깥쪽 트랩으로 전파되지 않도록
      keyEvent.preventDefault();
      keyEvent.stopPropagation();

      if (focusableElements.length === 0) return;

      if (keyEvent.shiftKey) {
        focusPrev();
      } else {
        focusNext();
      }
    },
    [focusableElements.length, focusNext, focusPrev, containerRef]
  );

  // 키보드 이벤트 처리
  useEffect(() => {
    if (disabled || !containerRef.current) return;
    const container = containerRef.current;
    container.addEventListener("keydown", handleKeyDown, {
      capture: false,
      passive: false,
    });
    // 정리
    return () => {
      container.removeEventListener("keydown", handleKeyDown, {
        capture: false,
      });
    };
  }, [disabled, containerRef, handleKeyDown]);

  // 자동 포커스 처리
  useEffect(() => {
    if (disabled || !autoFocus || !containerRef.current) return;

    requestAnimationFrame(() => {
      focusFirst();
    });
  }, [disabled, autoFocus, containerRef, focusFirst]);

  return {
    focusableElements,
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  };
};
