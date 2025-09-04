import { RefObject, useEffect, useRef, useState, useCallback } from "react";
import { useRefLatest } from "../useCallbackRef/useCallbackRef";
import { useDebounce } from "../useDebounce";

export type UseResizeObserverProps = {
  /**
   * 관찰할 요소의 ref
   */
  targetRef: RefObject<Element | null>;
  /**
   * ResizeObserver 콜백 함수 (선택적)
   */
  callback?: ResizeObserverCallback;
  /**
   * ResizeObserver 옵션
   */
  options?: ResizeObserverOptions;
  /**
   * 훅 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 디바운스 딜레이 (ms)
   */
  debounceDelay?: number;
};

export type UseResizeObserverReturns = {
  /**
   * 현재 요소의 크기
   */
  size: { width: number; height: number } | null;
  /**
   * 마지막 ResizeObserverEntry
   */
  entry: ResizeObserverEntry | null;
  /**
   * 수동으로 관찰 중단하는 함수
   */
  disconnect: () => void;
};

/**
 * ResizeObserver를 쉽게 사용할 수 있는 훅
 * @param options 옵션 객체
 */
export function useResizeObserver({
  targetRef,
  callback,
  options,
  disabled = false,
  debounceDelay = 0,
}: UseResizeObserverProps): UseResizeObserverReturns {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );
  const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);

  const callbackRef = useRefLatest(callback);

  // 내부 핸들러 (상태 업데이트 + 사용자 콜백)
  const handleResize: ResizeObserverCallback = useCallback((entries, observer) => {
    const [currentEntry] = entries;

    if (currentEntry) {
      const { width, height } = currentEntry.contentRect;
      setSize({ width, height });
      setEntry(currentEntry);
    }

    // 사용자 정의 콜백 실행
    callbackRef.current?.(entries, observer);
  }, []);

  // useDebounce 훅 사용
  const debouncedHandleResize = useDebounce(handleResize, debounceDelay);

  useEffect(() => {
    if (disabled || !targetRef.current) return;

    const target = targetRef.current;

    // 디바운스 여부에 따라 콜백 선택
    const finalCallback =
      debounceDelay > 0 ? debouncedHandleResize : handleResize;

    // ResizeObserver 생성
    observerRef.current = new ResizeObserver(finalCallback);

    // 관찰 시작
    observerRef.current.observe(target, options);

    // 정리
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // useDebounce의 clear 메서드 호출
      if (debounceDelay > 0) {
        debouncedHandleResize.clear();
      }
    };
  }, [
    targetRef,
    options,
    disabled,
    debounceDelay,
    debouncedHandleResize,
    handleResize,
  ]);

  // 수동으로 관찰 중단하는 함수
  const disconnect = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // useDebounce의 clear 메서드 호출
    if (debounceDelay > 0) {
      debouncedHandleResize.clear();
    }
  };

  return {
    size,
    entry,
    disconnect,
  };
}
