import { useEffect, useRef } from "react";

/**
 * React에서 setInterval을 안전하게 사용할 수 있게 해주는 훅
 *
 * Dan Abramov의 블로그 글을 기반으로 구현된 훅으로,
 * 컴포넌트가 리렌더링되어도 interval이 재설정되지 않으며,
 * 최신 콜백 함수를 항상 참조합니다.
 *
 * @param callback 주기적으로 실행할 콜백 함수
 * @param delay 실행 간격 (밀리초). null이면 interval을 중지합니다.
 *
 * @example
 * const [count, setCount] = useState(0);
 * const [delay, setDelay] = useState(1000);
 *
 * useInterval(() => {
 *   setCount(count + 1);
 * }, delay);
 *
 * return (
 *   <div>
 *     <h1>{count}</h1>
 *     <input
 *       value={delay}
 *       onChange={(e) => setDelay(Number(e.target.value))}
 *     />
 *     <button onClick={() => setDelay(null)}>Stop</button>
 *   </div>
 * );
 *
 * @example
 * // 실시간 시계
 * const [time, setTime] = useState(new Date());
 *
 * useInterval(() => {
 *   setTime(new Date());
 * }, 1000);
 *
 * return <div>{time.toLocaleTimeString()}</div>;
 *
 * @example
 * // API 폴링
 * const [data, setData] = useState(null);
 * const [isPolling, setIsPolling] = useState(true);
 *
 * useInterval(async () => {
 *   const response = await fetch('/api/status');
 *   const result = await response.json();
 *   setData(result);
 * }, isPolling ? 5000 : null);
 */
export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  const savedCallback = useRef<() => void | undefined>(undefined);

  // 최신 콜백을 저장
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // interval 설정
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};