import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  /** 교차 영역을 계산할 때 사용할 루트 요소 */
  root?: Element | null;
  /** 루트의 마진. CSS margin 속성과 유사한 값 */
  rootMargin?: string;
  /** 콜백이 실행되는 대상 요소의 가시성 퍼센티지 */
  threshold?: number | number[];
  /** 한 번만 감지할지 여부 */
  once?: boolean;
  /** 초기 교차 상태 */
  initialIsIntersecting?: boolean;
}

export interface UseIntersectionObserverResult {
  /** 요소가 교차 중인지 여부 */
  isIntersecting: boolean;
  /** IntersectionObserverEntry 객체 */
  entry?: IntersectionObserverEntry;
  /** 감지할 요소에 연결할 ref */
  ref: React.RefObject<Element>;
}

/**
 * Intersection Observer API를 사용하여 요소가 뷰포트와 교차하는지 감지하는 훅
 *
 * @param options Intersection Observer 옵션
 * @returns 교차 상태 정보와 ref
 *
 * @example
 * // 기본 사용법
 * const { isIntersecting, ref } = useIntersectionObserver();
 *
 * return (
 *   <div>
 *     <div style={{ height: '100vh' }}>Scroll down</div>
 *     <div ref={ref}>
 *       {isIntersecting ? 'Visible!' : 'Not visible'}
 *     </div>
 *   </div>
 * );
 *
 * @example
 * // Lazy loading 이미지
 * const LazyImage = ({ src, alt }) => {
 *   const { isIntersecting, ref } = useIntersectionObserver({
 *     threshold: 0.1,
 *     once: true
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting ? (
 *         <img src={src} alt={alt} />
 *       ) : (
 *         <div>Loading...</div>
 *       )}
 *     </div>
 *   );
 * };
 *
 * @example
 * // 무한 스크롤
 * const InfiniteScroll = () => {
 *   const [items, setItems] = useState(initialItems);
 *   const { isIntersecting, ref } = useIntersectionObserver({
 *     threshold: 1.0
 *   });
 *
 *   useEffect(() => {
 *     if (isIntersecting) {
 *       loadMoreItems().then(newItems => {
 *         setItems(prev => [...prev, ...newItems]);
 *       });
 *     }
 *   }, [isIntersecting]);
 *
 *   return (
 *     <div>
 *       {items.map(item => <div key={item.id}>{item.content}</div>)}
 *       <div ref={ref}>Loading more...</div>
 *     </div>
 *   );
 * };
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult => {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
    initialIsIntersecting = false,
  } = options;

  const ref = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Intersection Observer가 지원되지 않는 경우
    if (!window.IntersectionObserver) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        // once 옵션이 true이고 교차가 발생했으면 관찰 중단
        if (once && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [root, rootMargin, threshold, once]);

  return {
    isIntersecting,
    entry,
    ref: ref as React.RefObject<Element>,
  };
};