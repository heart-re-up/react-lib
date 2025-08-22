import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";

type UsePreventScrollOptions = {
  prevent?: boolean;
  target?: HTMLElement; // 기본값: document.body
  restoreScrollPosition?: boolean;
};

// 스크롤 방지를 위한 CSS 클래스명
const SCROLL_LOCK_CLASS = "scroll-lock-active";
const SCROLL_LOCK_FIXED_CLASS = "scroll-lock-fixed";

// 스타일이 한 번만 주입되도록 플래그
let stylesInjected = false;

// 필요한 CSS 스타일 주입
const injectStyles = () => {
  // 스타일을 주입할 수 없는 경우 아무것도 안함
  if (stylesInjected || typeof document === "undefined") return;

  const style = document.createElement("style");
  style.id = "scroll-lock-styles";
  style.textContent = `
    .${SCROLL_LOCK_CLASS} {
      overflow: hidden !important;
    }
    .${SCROLL_LOCK_FIXED_CLASS} {
      position: fixed !important;
      width: 100% !important;
      left: 0 !important;
      right: 0 !important;
    }
  `;

  document.head.appendChild(style);
  stylesInjected = true;
};

export function usePreventScroll(options: UsePreventScrollOptions = {}) {
  const { prevent = true, target, restoreScrollPosition = false } = options;

  // 스크롤 위치를 ref로 관리 (restoreScrollPosition이 true일 때만 사용)
  const scrollPositionRef = useRef<number>(0);

  useIsomorphicLayoutEffect(() => {
    if (!prevent) return;

    // 필요한 스타일 주입
    injectStyles();

    const targetElement = target || document.body;

    // 스크롤 위치 복원이 필요한 경우에만 현재 위치 저장
    if (restoreScrollPosition) {
      scrollPositionRef.current = window.pageYOffset;
    }

    // 스크롤 방지 클래스 적용
    targetElement.classList.add(SCROLL_LOCK_CLASS);

    // 스크롤 위치 고정 (restoreScrollPosition이 true일 때만)
    if (restoreScrollPosition) {
      targetElement.classList.add(SCROLL_LOCK_FIXED_CLASS);
      targetElement.style.top = `-${scrollPositionRef.current}px`;
    }

    // 정리 함수
    return () => {
      // 클래스 제거
      targetElement.classList.remove(SCROLL_LOCK_CLASS);

      if (restoreScrollPosition) {
        targetElement.classList.remove(SCROLL_LOCK_FIXED_CLASS);
        targetElement.style.top = "";

        // 스크롤 위치 복원
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, [prevent, target, restoreScrollPosition]);
}
