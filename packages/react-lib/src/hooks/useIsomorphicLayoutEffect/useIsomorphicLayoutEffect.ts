import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect 를 사용하고자 할 때 SSR 환경을 지원하는 훅
 *
 * - useLayoutEffect: DOM 변경 후 브라우저 페인트 전에 동기적으로 실행
 *      - DOM 변경 -> useLayoutEffect 실행 -> 브라우저 페인트
 *      - 훅의 작업이 레이아웃에 영향을 주더라도 깜빡임(레이아웃 시프트) 없음
 * - useEffect: DOM 변경 후 브라우저 페인트 후에 비동기적으로 실행
 *      - DOM 변경 -> 브라우저 페인트 -> useEffect 실행
 *      - 훅의 작업이 레이아웃에 영향을 주는 경우 깜빡임(레이아웃 시프트) 발생 가능
 *
 * SSR 환경에서는 window 객체가 없으므로 useLayoutEffect 대신 useEffect 사용
 * (서버에서는 어차피 DOM 조작이 불가능하므로 동작상 차이 없음)
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
