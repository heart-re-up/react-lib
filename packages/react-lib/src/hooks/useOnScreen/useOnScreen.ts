import { useIntersectionObserver } from "../useIntersectionObserver";
import type { UseIntersectionObserverOptions } from "../useIntersectionObserver";

export interface UseOnScreenOptions
  extends Omit<UseIntersectionObserverOptions, "threshold"> {
  /** 요소가 화면에 얼마나 보여야 하는지 (0-1, 기본값: 0.1) */
  threshold?: number;
}

export interface UseOnScreenResult {
  /** 요소가 화면에 보이는지 여부 */
  isVisible: boolean;
  /** 감지할 요소에 연결할 ref */
  ref: React.RefObject<Element>;
}

/**
 * 요소가 화면에 보이는지 감지하는 간단한 훅
 *
 * useIntersectionObserver를 기반으로 한 더 간단한 API를 제공합니다.
 *
 * @param options 옵션 설정
 * @returns 가시성 상태와 ref
 *
 * @example
 * // 기본 사용법
 * const { isVisible, ref } = useOnScreen();
 *
 * return (
 *   <div>
 *     <div style={{ height: '100vh' }}>Scroll down</div>
 *     <div ref={ref} className={isVisible ? 'visible' : 'hidden'}>
 *       {isVisible ? 'I am visible!' : 'I am hidden'}
 *     </div>
 *   </div>
 * );
 *
 * @example
 * // 애니메이션과 함께
 * const { isVisible, ref } = useOnScreen({
 *   threshold: 0.5,
 *   once: true
 * });
 *
 * return (
 *   <div
 *     ref={ref}
 *     className={`transition-opacity duration-1000 ${
 *       isVisible ? 'opacity-100' : 'opacity-0'
 *     }`}
 *   >
 *     Fade in when visible
 *   </div>
 * );
 *
 * @example
 * // 카운터 애니메이션
 * const CounterOnScreen = ({ target }) => {
 *   const [count, setCount] = useState(0);
 *   const { isVisible, ref } = useOnScreen({ threshold: 0.8 });
 *
 *   useEffect(() => {
 *     if (!isVisible) return;
 *
 *     const interval = setInterval(() => {
 *       setCount(prev => {
 *         if (prev >= target) {
 *           clearInterval(interval);
 *           return target;
 *         }
 *         return prev + 1;
 *       });
 *     }, 50);
 *
 *     return () => clearInterval(interval);
 *   }, [isVisible, target]);
 *
 *   return (
 *     <div ref={ref} className="text-4xl font-bold">
 *       {count}
 *     </div>
 *   );
 * };
 */
export const useOnScreen = (
  options: UseOnScreenOptions = {}
): UseOnScreenResult => {
  const { threshold = 0.1, ...intersectionOptions } = options;

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold,
    ...intersectionOptions,
  });

  return {
    isVisible: isIntersecting,
    ref,
  };
};