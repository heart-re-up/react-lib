import { useCallback, useRef } from "react";
import { useEventListener } from "../useEventListener";

export type ExtendedFocusOptions = FocusOptions & {
  /**
   * 사용자 상호작용으로 인한 호출인지 여부
   * true: 현재 실제 포커스된 요소 기준으로 동작
   * false/undefined: 마지막 기억된 인덱스 기준으로 동작
   */
  userInteraction?: boolean;
};

export type UseFocusOptions = {
  /**
   * 포커스 가능한 요소들의 배열
   */
  focusableElements: HTMLElement[];
};

export type UseFocusReturn = {
  /**
   * 특정 인덱스의 요소에 포커스
   */
  focusIndex: (index: number, options?: FocusOptions) => void;
  /**
   * 첫 번째 포커스 가능한 요소에 포커스
   */
  focusFirst: (options?: FocusOptions) => void;
  /**
   * 마지막 포커스 가능한 요소에 포커스
   */
  focusLast: (options?: FocusOptions) => void;
  /**
   * 다음 요소에 포커스 (순환)
   */
  focusNext: (options?: ExtendedFocusOptions) => void;
  /**
   * 이전 요소에 포커스 (순환)
   */
  focusPrev: (options?: ExtendedFocusOptions) => void;
  /**
   * 현재 포커스된 요소의 인덱스 반환 (-1이면 포커스된 요소가 없음)
   */
  getCurrentFocusIndex: () => number;
};

export const useFocus = (options: UseFocusOptions): UseFocusReturn => {
  const { focusableElements } = options;

  // 마지막으로 포커스된 인덱스를 기억하는 ref
  const lastFocusedIndexRef = useRef<number>(-1);

  // focusableElements 내 요소에 대한 사용자 직접 포커스 감지
  const handleFocusIn = useCallback(
    (event: Event) => {
      if (event.target instanceof HTMLElement) {
        const index = focusableElements.indexOf(event.target);
        if (index !== -1) {
          // 사용자가 직접 포커스한 요소가 배열에 있으면 인덱스 업데이트
          lastFocusedIndexRef.current = index;
        }
      }
    },
    [focusableElements]
  );

  useEventListener("focusin", handleFocusIn);

  // 현재 포커스 인덱스를 실시간으로 계산하는 함수
  const getCurrentFocusIndex = useCallback(() => {
    if (typeof document === "undefined") return -1;

    const activeElement = document.activeElement;

    // activeElement 유효성 검사
    if (!activeElement || !(activeElement instanceof HTMLElement)) {
      return -1;
    }

    const index = focusableElements.indexOf(activeElement);

    return index;
  }, [focusableElements]);

  const focusIndex = useCallback(
    (index: number, focusOptions?: FocusOptions) => {
      if (index >= 0 && index < focusableElements.length) {
        focusableElements[index].focus(focusOptions);
        lastFocusedIndexRef.current = index; // 마지막 포커스된 인덱스 저장
      }
    },
    [focusableElements]
  );

  const focusFirst = useCallback(
    (focusOptions?: FocusOptions) => {
      if (focusableElements.length > 0) {
        focusableElements[0].focus(focusOptions);
      }
    },
    [focusableElements]
  );

  const focusLast = useCallback(
    (focusOptions?: FocusOptions) => {
      focusIndex(focusableElements.length - 1, focusOptions);
    },
    [focusIndex, focusableElements]
  );

  const focusNext = useCallback(
    (focusOptions?: ExtendedFocusOptions) => {
      if (focusableElements.length === 0) return;

      const { userInteraction, ...standardFocusOptions } = focusOptions || {};

      // userInteraction에 따라 현재 인덱스 결정
      const currentIndex = userInteraction
        ? lastFocusedIndexRef.current // 제어 버튼: 기억된 인덱스 기준
        : getCurrentFocusIndex(); // 사용자 상호작용: 실제 포커스된 요소 기준

      let nextIndex: number;
      if (currentIndex === -1) {
        // 현재 포커스된 요소가 배열에 없으면 첫 번째로
        nextIndex = 0;
      } else if (currentIndex >= focusableElements.length - 1) {
        // 마지막 요소면 첫 번째로 순환
        nextIndex = 0;
      } else {
        // 다음 요소로
        nextIndex = currentIndex + 1;
      }

      focusIndex(nextIndex, standardFocusOptions);
    },
    [focusIndex, focusableElements, getCurrentFocusIndex]
  );

  const focusPrev = useCallback(
    (focusOptions?: ExtendedFocusOptions) => {
      if (focusableElements.length === 0) return;

      const { userInteraction, ...standardFocusOptions } = focusOptions || {};

      // userInteraction에 따라 현재 인덱스 결정
      const currentIndex = userInteraction
        ? lastFocusedIndexRef.current // 제어 버튼: 기억된 인덱스 기준
        : getCurrentFocusIndex(); // 사용자 상호작용: 실제 포커스된 요소 기준

      let prevIndex: number;
      if (currentIndex === -1) {
        // 현재 포커스된 요소가 배열에 없으면 마지막으로
        prevIndex = focusableElements.length - 1;
      } else if (currentIndex <= 0) {
        // 첫 번째 요소면 마지막으로 순환
        prevIndex = focusableElements.length - 1;
      } else {
        // 이전 요소로
        prevIndex = currentIndex - 1;
      }

      focusIndex(prevIndex, standardFocusOptions);
    },
    [focusIndex, focusableElements, getCurrentFocusIndex]
  );

  return {
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  };
};
