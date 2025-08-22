import { RefObject, useEffect, useRef } from "react";
import { resolveTargetElement } from "./useEventListener.util";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";

// 사용 가능한 이벤트 대상 타입들
export type ElementTarget<T extends EventTarget = EventTarget> =
  | T // 직접 전달된 DOM 요소
  | RefObject<T | null> // React RefObject (null 허용)
  | undefined; // 제공되지 않는 경우 Window 가 대상

// 일반적으로 사용되는 표준 이벤트 이름들 (IDE 자동완성 지원)
// 주요 DOM 요소들과 글로벌 이벤트들을 포함
type StandardEventName =
  // 기본 글로벌 이벤트들
  | keyof GlobalEventHandlersEventMap
  | keyof WindowEventMap
  | keyof WindowEventHandlersEventMap
  | keyof DocumentEventMap
  | keyof ElementEventMap
  // HTML 요소 이벤트들
  | keyof HTMLElementEventMap
  | keyof HTMLBodyElementEventMap
  | keyof HTMLVideoElementEventMap
  | keyof HTMLMediaElementEventMap
  | keyof HTMLFrameSetElementEventMap
  // SVG와 수학 요소들
  | keyof SVGElementEventMap
  | keyof MathMLElementEventMap
  // Shadow DOM
  | keyof ShadowRootEventMap;

export function useEventListener<T extends EventTarget = EventTarget>(
  eventName: StandardEventName | (string & {}), // 표준 이벤트 + 커스텀 이벤트 모두 지원
  handler: (event: Event) => void,
  element?: ElementTarget<T>,
  options?: boolean | AddEventListenerOptions
) {
  // 핸들러를 저장하는 ref
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // 이벤트 리스너를 등록할 대상 요소 정의
    let targetElement: EventTarget | null;

    try {
      targetElement = resolveTargetElement(element);
    } catch (error) {
      console.error(error);
      return;
    }

    // 대상 요소가 addEventListener를 지원하지 않는 경우 - 경고 출력
    if (!(targetElement && targetElement.addEventListener)) {
      console.warn(
        `useEventListener: Target element does not support addEventListener. ` +
          `Event listener for "${String(eventName)}" will not be registered.`
      );
      return;
    }

    // 이벤트 리스너 등록
    const eventListener = (event: Event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    // 정리 시 이벤트 리스너 제거
    return () => {
      targetElement!.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}
