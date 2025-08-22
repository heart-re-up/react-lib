import { useCallback, useEffect, useRef, useState } from "react";

export type UseCountdownOptions = {
  /** 보고 간격 (milliseconds) - 기본값: 1000ms */
  reportInterval?: number;
  /** 계산 프레임 (fps) - 30, 60, 120 중 선택. 높을수록 정밀하지만 계산 비용 증가 - 기본값: 60fps */
  computeFrame?: 30 | 60 | 120;
  /** 자동 시작 여부 - 기본값: false */
  autoStart?: boolean;
};

export type UseCountdownProps = {
  /** 카운트다운 총 시간 (milliseconds) */
  duration: number;
  /** 카운트다운 옵션 */
  options?: UseCountdownOptions;
  /** 카운트다운 완료 시 호출되는 함수 */
  onComplete?: () => void;
};

export type UseCountdownReturns = {
  /** 카운트다운 시작 */
  start: () => void;
  /** 카운트다운 정지 */
  stop: () => void;
  /** 카운트다운 리셋 */
  reset: () => void;
  /** 실행 중 여부 */
  isRunning: boolean;
  /** 남은 시간 (milliseconds) */
  remainingTime: number;
  /** 진행률 (0-1) */
  progress: number;
};

// 기본 옵션 설정
const DEFAULT_OPTIONS: Required<UseCountdownOptions> = {
  reportInterval: 1000,
  computeFrame: 30,
  autoStart: false,
};

export const useCountdown = (props: UseCountdownProps): UseCountdownReturns => {
  const { duration, options, onComplete } = props;

  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  // 종료 시간을 저장하여 정확한 시간 계산
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentRemainingTimeRef = useRef<number>(duration);
  const lastUIUpdateTimeRef = useRef<number>(0);
  const nextUIUpdateTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // 옵션을 ref로 저장하여 실행 중 변경 방지
  const optionsRef = useRef<Required<UseCountdownOptions>>({
    ...DEFAULT_OPTIONS,
    ...options,
  });
  const previousOptionsRef = useRef(options);

  // 옵션 변경 감지 및 실행 중 변경 시 에러 발생
  useEffect(() => {
    const hasOptionsChanged =
      JSON.stringify(previousOptionsRef.current) !== JSON.stringify(options);

    if (hasOptionsChanged) {
      if (isRunningRef.current) {
        throw new Error(
          "useCountdown: 카운트다운 실행 중에는 옵션을 변경할 수 없습니다. 먼저 stop()을 호출하세요."
        );
      }

      // 실행 중이 아닐 때만 옵션 업데이트
      optionsRef.current = { ...DEFAULT_OPTIONS, ...options };
      previousOptionsRef.current = options;
    }
  }, [options]);

  const stop = useCallback(() => {
    console.debug("⏹️ useCountdown Stop:", {
      remainingTime: currentRemainingTimeRef.current
        ? `${Math.round(currentRemainingTimeRef.current / 1000)}s`
        : "N/A",
      wasRunning: isRunningRef.current,
    });

    isRunningRef.current = false;
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
  }, []);

  // 화면 이탈/복귀 감지를 위한 visibility 이벤트
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      console.debug("👁️ useCountdown: Tab hidden");
      return;
    }

    if (!isRunningRef.current || !endTimeRef.current) return;

    // 화면 복귀 시 현재 시간 기준으로 남은 시간 재계산
    const now = Date.now();
    const newRemainingTime = Math.max(0, endTimeRef.current - now);
    const previousRemainingTime = currentRemainingTimeRef.current;
    const timeDrift = Math.abs(newRemainingTime - previousRemainingTime);

    console.debug("👁️ useCountdown: Tab visible - Time recalculation:", {
      now: new Date(now).toISOString(),
      endTime: new Date(endTimeRef.current).toISOString(),
      previousRemainingTime: `${Math.round(previousRemainingTime / 1000)}s`,
      newRemainingTime: `${Math.round(newRemainingTime / 1000)}s`,
      timeDrift: `${timeDrift}ms`,
      driftSignificant: timeDrift > 1000 ? "YES" : "NO",
    });

    // ref와 UI 모두 업데이트
    currentRemainingTimeRef.current = newRemainingTime;
    setRemainingTime(newRemainingTime);

    if (newRemainingTime <= 0) {
      console.debug("⏰ useCountdown: Completed during tab switch");
      isRunningRef.current = false;
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      endTimeRef.current = null;
      onComplete?.();
    }
  }, [onComplete]);

  // 정확한 시간 계산 함수 (computeFrame 간격으로 실행)
  const updateCountdown = useCallback(() => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const newRemainingTime = Math.max(0, endTimeRef.current - now);

    // ref에 현재 남은 시간 저장 (UI 업데이트와 분리)
    currentRemainingTimeRef.current = newRemainingTime;

    // 카운트다운 완료 체크
    if (newRemainingTime <= 0) {
      console.debug("🎯 useCountdown Complete:", {
        endTime: new Date(endTimeRef.current).toISOString(),
        actualEndTime: new Date(now).toISOString(),
        completionAccuracy: `${now - endTimeRef.current}ms ${now > endTimeRef.current ? "late" : "early"}`,
      });

      setRemainingTime(0);
      isRunningRef.current = false;
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      endTimeRef.current = null;
      onComplete?.();
      return;
    }

    // UI 업데이트 시간 체크 (reportInterval 간격)
    if (now >= nextUIUpdateTimeRef.current) {
      const expectedInterval = optionsRef.current.reportInterval;
      const actualInterval = now - lastUIUpdateTimeRef.current;
      const delta = actualInterval - expectedInterval;
      const adjustedNextInterval = Math.max(
        optionsRef.current.reportInterval - delta,
        100
      );

      console.debug("🕐 useCountdown UI Update:", {
        now: new Date(now).toISOString(),
        expectedInterval: `${expectedInterval}ms`,
        actualInterval: `${actualInterval}ms`,
        delta: `${delta}ms (${delta > 0 ? "late" : "early"})`,
        nextInterval: `${adjustedNextInterval}ms`,
        adjustment: `${optionsRef.current.reportInterval - adjustedNextInterval}ms`,
        remainingTime: `${Math.round(newRemainingTime / 1000)}s`,
      });

      // UI 업데이트 (setState 호출)
      setRemainingTime(newRemainingTime);

      lastUIUpdateTimeRef.current = now;
      // delta를 고려하여 다음 UI 업데이트 시간 조절
      nextUIUpdateTimeRef.current = now + adjustedNextInterval;
    }
  }, [onComplete]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    const now = Date.now();
    const endTime = now + remainingTime;
    const checkInterval = 1000 / optionsRef.current.computeFrame;

    console.debug("🚀 useCountdown Start:", {
      startTime: new Date(now).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: `${Math.round(remainingTime / 1000)}s`,
      reportInterval: `${optionsRef.current.reportInterval}ms`,
      computeFrame: `${optionsRef.current.computeFrame}fps`,
      checkInterval: `${checkInterval.toFixed(2)}ms`,
      options: optionsRef.current,
    });

    endTimeRef.current = endTime;
    currentRemainingTimeRef.current = remainingTime;
    lastUIUpdateTimeRef.current = now;
    nextUIUpdateTimeRef.current = now + optionsRef.current.reportInterval;

    isRunningRef.current = true;
    setIsRunning(true);

    // 지정된 프레임 간격으로 체크
    intervalRef.current = setInterval(updateCountdown, checkInterval);
  }, [remainingTime, updateCountdown]);

  const reset = useCallback(() => {
    stop();
    currentRemainingTimeRef.current = duration;
    setRemainingTime(duration);
  }, [duration, stop]);

  // 컴포넌트 마운트 시 자동 시작
  useEffect(() => {
    if (optionsRef.current.autoStart) {
      start();
    }
  }, [start]);

  // 화면 이탈/복귀 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = duration > 0 ? (duration - remainingTime) / duration : 0;

  return {
    start,
    stop,
    reset,
    isRunning,
    remainingTime,
    progress,
  };
};
