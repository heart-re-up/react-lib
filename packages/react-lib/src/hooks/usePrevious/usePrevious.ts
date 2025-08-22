import { useRef } from "react";

/**
 * 이전 값을 추적하는 Hook
 *
 * 컴포넌트가 리렌더링될 때 이전 렌더링에서의 값을 기억합니다.
 * 값 비교, 변화 감지, 이전 상태 복원 등에 유용합니다.
 *
 * @template T - 추적할 값의 타입
 * @param value - 추적할 현재 값
 * @returns 이전 값 (첫 번째 렌더링에서는 undefined)
 *
 * @example
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {prevCount}</p>
 *       <button onClick={() => setCount(count + 1)}>+</button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // 값 변화 감지
 * function UserProfile({ userId }) {
 *   const prevUserId = usePrevious(userId);
 *
 *   useEffect(() => {
 *     if (prevUserId !== undefined && prevUserId !== userId) {
 *       console.log(`User changed from ${prevUserId} to ${userId}`);
 *       // 사용자 변경 시 로직 실행
 *     }
 *   }, [userId, prevUserId]);
 * }
 *
 * @example
 * // 이전 상태와 비교
 * function AnimatedComponent({ isVisible }) {
 *   const prevVisible = usePrevious(isVisible);
 *
 *   const shouldAnimate = prevVisible !== undefined && prevVisible !== isVisible;
 *
 *   return (
 *     <div className={shouldAnimate ? 'animate' : ''}>
 *       {isVisible ? 'Visible' : 'Hidden'}
 *     </div>
 *   );
 * }
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const currentRef = useRef<T>(value);
  const previousRef = useRef<T | undefined>(undefined);

  // 값이 실제로 변경되었을 때만 이전값 업데이트
  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
};
