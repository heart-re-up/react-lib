import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useDebounce } from "../useDebounce";

export type UseLocalStorageProps = { debounceDelay?: number };
export type UseLocalStorageReturns<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void,
  () => void,
];

/**
 * localStorage와 동기화되는 상태를 관리하는 Hook
 *
 * React 19의 useSyncExternalStore를 사용하여 외부 스토어(localStorage)와
 * 정확하게 동기화되며, Concurrent 렌더링을 지원합니다.
 * JSON 직렬화/역직렬화를 자동으로 처리하고, 다중 탭 동기화를 제공합니다.
 *
 * 성능 최적화를 위해 쓰기 작업은 디바운싱되며, 읽기는 메모리 캐시를 활용합니다.
 *
 * @template T - 저장할 값의 타입
 * @param key - localStorage 키
 * @param initialValue - 초기값 (localStorage에 값이 없을 때 사용)
 * @param options - 옵션 설정
 * @param options.debounceDelay - localStorage 쓰기 디바운스 지연 시간 (ms, 기본값: 200)
 * @returns 반환 값 배열
 * @returns [0] - 현재 값
 * @returns [1] - 값을 설정하는 함수
 * @returns [2] - localStorage에서 값을 제거하는 함수
 * @returns [3] - 대기 중인 쓰기 작업을 즉시 실행하는 함수
 *
 * @example
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 *
 * // 사용자 정보 저장
 * setUser({ id: 1, name: 'John' });
 *
 * // 사용자 정보 제거
 * removeUser();
 *
 * @example
 * // 디바운스 지연 시간 커스터마이징
 * const [text, setText, , flush] = useLocalStorage('text', '', { debounceDelay: 500 });
 *
 * // 즉시 저장이 필요한 경우
 * setText('important data');
 * flush(); // 대기 중인 저장 작업 즉시 실행
 *
 * @example
 * // 실시간 입력에 최적화
 * const [searchQuery, setSearchQuery] = useLocalStorage('search', '', { debounceDelay: 1000 });
 *
 * // 타이핑 중에는 메모리만 업데이트, 1초 후 localStorage에 저장
 * <input onChange={(e) => setSearchQuery(e.target.value)} />
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageProps = {}
): UseLocalStorageReturns<T> => {
  const { debounceDelay = 200 } = options;

  // 참조 안정성을 위한 캐시
  const lastReadValueRef = useRef<{ raw: string | null; parsed: T } | null>(
    null
  );

  // 같은 탭에서의 강제 업데이트를 위한 콜백 저장소
  const listenersRef = useRef<Set<() => void>>(new Set());

  // 메모리 상의 현재 값 (즉시 반영)
  const memoryValueRef = useRef<T | null>(null);

  // localStorage에서 값을 읽는 함수 (getSnapshot)
  const getSnapshot = useCallback((): T => {
    // 메모리에 최신 값이 있으면 우선 반환 (즉시 반영)
    if (memoryValueRef.current !== null) {
      return memoryValueRef.current;
    }

    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const rawValue = window.localStorage.getItem(key);

      // 캐시된 값과 동일하면 같은 참조 반환 (참조 안정성 보장)
      if (
        lastReadValueRef.current &&
        lastReadValueRef.current.raw === rawValue
      ) {
        return lastReadValueRef.current.parsed;
      }

      // 새로운 값이거나 첫 읽기인 경우
      const parsedValue = rawValue ? JSON.parse(rawValue) : initialValue;

      // 캐시 업데이트
      lastReadValueRef.current = { raw: rawValue, parsed: parsedValue };

      return parsedValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);

      // 에러 시 초기값 반환 및 캐시
      lastReadValueRef.current = { raw: null, parsed: initialValue };
      return initialValue;
    }
  }, [key, initialValue]);

  // 서버 렌더링용 스냅샷 (getServerSnapshot)
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  // localStorage 변경 이벤트 구독 (subscribe)
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") {
        return () => {}; // 서버 환경에서는 빈 unsubscribe 함수 반환
      }

      // 콜백을 리스너 집합에 추가 (같은 탭 내 업데이트용)
      listenersRef.current.add(callback);

      const handleStorageChange = (e: StorageEvent) => {
        // 해당 키가 변경되었을 때만 콜백 호출
        if (e.key === key) {
          // 외부 탭에서 변경된 경우, 메모리 캐시 무효화
          memoryValueRef.current = null;
          lastReadValueRef.current = null;
          callback();
        }
      };

      // localStorage 변경 이벤트 리스너 등록 (다른 탭에서의 변경)
      window.addEventListener("storage", handleStorageChange);

      // 구독 해제 함수 반환
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        listenersRef.current.delete(callback);
      };
    },
    [key]
  );

  // 실제 localStorage에 저장하는 함수
  const performSave = useCallback(
    (valueToSave: T) => {
      if (typeof window === "undefined") return;

      try {
        const serializedValue = JSON.stringify(valueToSave);
        window.localStorage.setItem(key, serializedValue);

        // 저장 완료 후 캐시 업데이트
        lastReadValueRef.current = {
          raw: serializedValue,
          parsed: valueToSave,
        };
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // useDebounce를 사용한 디바운스된 저장 함수
  const debouncedSave = useDebounce(performSave, debounceDelay);

  // useSyncExternalStore로 외부 store(localStorage) 동기화
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // localStorage에 값을 저장하는 함수
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // 함수형 업데이트 지원
        const currentValue = getSnapshot();
        const valueToStore =
          value instanceof Function ? value(currentValue) : value;

        // 메모리에 즉시 저장 (UI 반응성 보장)
        memoryValueRef.current = valueToStore;

        // 리스너들에게 즉시 알림 (리렌더링)
        listenersRef.current.forEach((listener) => {
          try {
            listener();
          } catch (error) {
            console.warn("Error in localStorage listener:", error);
          }
        });

        // localStorage 저장은 디바운스 (useDebounce 활용)
        if (typeof window !== "undefined") {
          debouncedSave(valueToStore);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, getSnapshot, debouncedSave]
  );

  // localStorage에서 값을 제거하는 함수
  const removeValue = useCallback(() => {
    try {
      // 메모리에서 즉시 제거
      memoryValueRef.current = initialValue;

      // 리스너들에게 즉시 알림
      listenersRef.current.forEach((listener) => {
        try {
          listener();
        } catch (error) {
          console.warn("Error in localStorage listener:", error);
        }
      });

      if (typeof window !== "undefined") {
        // 대기 중인 저장 작업 취소
        debouncedSave.clear();

        // localStorage에서 즉시 제거 (remove는 디바운스 하지 않음)
        window.localStorage.removeItem(key);

        // 캐시 초기화
        lastReadValueRef.current = { raw: null, parsed: initialValue };
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, debouncedSave]);

  // 대기 중인 저장 작업을 즉시 실행하는 함수 (flush)
  const flush = useCallback(() => {
    debouncedSave.clear();
    // 메모리에 있는 현재 값을 즉시 저장
    if (memoryValueRef.current !== null) {
      performSave(memoryValueRef.current);
    }
  }, [debouncedSave, performSave]);

  // 컴포넌트 언마운트 시 대기 중인 저장 작업 실행
  useEffect(() => {
    return () => {
      flush();
    };
  }, [flush]);

  return [storedValue, setValue, removeValue, flush];
};
