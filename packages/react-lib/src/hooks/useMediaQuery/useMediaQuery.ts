import { useState, useEffect } from "react";

/**
 * CSS 미디어 쿼리의 매치 상태를 추적하는 Hook
 *
 * 미디어 쿼리가 매치되는지 여부를 실시간으로 추적하고,
 * 화면 크기나 기기 특성이 변경될 때 자동으로 업데이트됩니다.
 *
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리가 매치되는지 여부 (boolean)
 *
 * @example
 * // 반응형 디자인
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1025px)');
 *
 * return (
 *   <div>
 *     {isMobile && <MobileLayout />}
 *     {isTablet && <TabletLayout />}
 *     {isDesktop && <DesktopLayout />}
 *   </div>
 * );
 *
 * @example
 * // 다크 모드 감지
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * useEffect(() => {
 *   document.body.className = prefersDark ? 'dark-theme' : 'light-theme';
 * }, [prefersDark]);
 *
 * @example
 * // 고해상도 디스플레이 감지
 * const isHighDPI = useMediaQuery('(min-resolution: 2dppx)');
 *
 * return (
 *   <img
 *     src={isHighDPI ? 'image@2x.png' : 'image.png'}
 *     alt="Responsive image"
 *   />
 * );
 *
 * @example
 * // 인쇄 모드 감지
 * const isPrint = useMediaQuery('print');
 *
 * return (
 *   <div>
 *     <h1>Content</h1>
 *     {!isPrint && <Navigation />}
 *   </div>
 * );
 */
export const useMediaQuery = (query: string): boolean => {
  // SSR 환경에서는 기본값 false 반환
  const getMatches = (query: string): boolean => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    // SSR 환경에서는 실행하지 않음
    if (typeof window === "undefined") {
      return;
    }

    const matchMedia = window.matchMedia(query);

    // 현재 상태로 업데이트 (hydration 시 정확한 값 보장)
    setMatches(matchMedia.matches);

    // 미디어 쿼리 변경 감지 함수
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    matchMedia.addEventListener("change", handleChange);

    // 정리 함수
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};
