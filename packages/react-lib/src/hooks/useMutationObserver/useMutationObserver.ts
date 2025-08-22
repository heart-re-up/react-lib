import { RefObject, useCallback, useEffect, useRef } from "react";
import { useDebounce } from "../useDebounce";

export type UseMutationObserverProps = {
  /**
   * 관찰할 요소의 ref
   */
  targetRef: RefObject<Element | null>;
  /**
   * MutationObserver 콜백 함수
   */
  callback: MutationCallback;
  /**
   * MutationObserver 옵션
   */
  options?: MutationObserverInit;
  /**
   * 훅 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 디바운스 딜레이 (ms)
   * 실시간 데이터 업데이트가 빈번한 경우 성능 최적화에 유용
   */
  debounceDelay?: number;
};

export type UseMutationObserverReturns = {
  disconnect: () => void;
};

/**
 * MutationObserver를 쉽게 사용할 수 있는 훅
 * 각 요소마다 개별 Observer를 생성하여 독립적인 옵션 사용 가능
 */
export const useMutationObserver = ({
  targetRef,
  callback,
  options = {
    childList: true,
    subtree: true,
  },
  disabled = false,
  debounceDelay = 0,
}: UseMutationObserverProps): UseMutationObserverReturns => {
  const observerRef = useRef<MutationObserver | null>(null);

  // 내부 핸들러 (useCallback으로 메모이제이션)
  const handleMutation: MutationCallback = useCallback(
    (mutations, observer) => {
      callback(mutations, observer);
    },
    [callback]
  );

  // useDebounce 훅 사용
  const debouncedCallback = useDebounce(handleMutation, debounceDelay);

  useEffect(() => {
    if (disabled || !targetRef.current) return;

    const target = targetRef.current;

    // 디바운스 여부에 따라 콜백 선택
    const finalCallback =
      debounceDelay > 0 ? debouncedCallback : handleMutation;

    // MutationObserver 생성
    observerRef.current = new MutationObserver(finalCallback);

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
        debouncedCallback.clear();
      }
    };
  }, [
    targetRef,
    options,
    disabled,
    debounceDelay,
    debouncedCallback,
    handleMutation,
  ]);

  // 수동으로 관찰 중단하는 함수
  const disconnect = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // useDebounce의 clear 메서드 호출
    if (debounceDelay > 0) {
      debouncedCallback.clear();
    }
  };

  return { disconnect };
};
