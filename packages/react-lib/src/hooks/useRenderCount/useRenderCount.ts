import { useEffect, useRef } from "react";

/**
 * 컴포넌트의 렌더링 횟수를 추적하는 훅
 * React Strict Mode를 고려하여 실제 커밋된 렌더링만 카운트
 */
export const useRenderCount = (): number => {
  const commitCount = useRef(-1);

  // 실제 커밋된 렌더링만 카운트 (Strict Mode 고려)
  useEffect(() => {
    commitCount.current += 1;
  });

  return commitCount.current < 0 ? 0 : commitCount.current;
};
