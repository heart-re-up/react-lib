import { useEffect, useRef, useState } from "react";

export interface UseFetchOptions<T> {
  /** 초기 데이터 */
  initialData?: T;
  /** 자동으로 fetch를 실행할지 여부 (기본값: true) */
  auto?: boolean;
  /** 의존성 배열. 변경 시 자동으로 다시 fetch */
  deps?: React.DependencyList;
  /** 응답 데이터 변환 함수 */
  transform?: (data: unknown) => T;
  /** 에러 핸들러 */
  onError?: (error: Error) => void;
  /** 성공 핸들러 */
  onSuccess?: (data: T) => void;
}

export interface UseFetchResult<T> {
  /** 응답 데이터 */
  data: T | null;
  /** 에러 객체 */
  error: Error | null;
  /** 로딩 상태 */
  loading: boolean;
  /** 수동으로 fetch를 실행하는 함수 */
  refetch: () => Promise<void>;
  /** 요청을 취소하는 함수 */
  cancel: () => void;
}

/**
 * fetch API를 사용한 간단한 데이터 페칭 훅
 *
 * @param url 요청할 URL
 * @param options fetch 옵션 및 훅 옵션
 * @returns fetch 결과 상태와 제어 함수들
 *
 * @example
 * // 기본 사용법
 * const { data, loading, error } = useFetch('/api/users');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!data) return <div>No data</div>;
 *
 * return (
 *   <ul>
 *     {data.map(user => (
 *       <li key={user.id}>{user.name}</li>
 *     ))}
 *   </ul>
 * );
 *
 * @example
 * // 수동 fetch
 * const { data, loading, refetch } = useFetch('/api/data', {
 *   auto: false
 * });
 *
 * return (
 *   <div>
 *     <button onClick={refetch} disabled={loading}>
 *       {loading ? 'Loading...' : 'Fetch Data'}
 *     </button>
 *     {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
 *   </div>
 * );
 *
 * @example
 * // 의존성과 함께 사용
 * const [userId, setUserId] = useState(1);
 * const { data: user, loading } = useFetch(`/api/users/${userId}`, {
 *   deps: [userId],
 *   transform: (data) => data.user,
 *   onError: (error) => console.error('Failed to fetch user:', error)
 * });
 */
export const useFetch = <T = unknown>(
  url: string,
  options: UseFetchOptions<T> & RequestInit = {}
): UseFetchResult<T> => {
  const {
    initialData = null,
    auto = true,
    deps = [],
    transform,
    onError,
    onSuccess,
    ...fetchOptions
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();

      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseData = await response.json();

      // 데이터 변환
      if (transform) {
        responseData = transform(responseData);
      }

      setData(responseData);
      onSuccess?.(responseData);
    } catch (err) {
      // 요청이 취소된 경우는 에러로 처리하지 않음
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const cancel = (): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // 자동 fetch 및 의존성 변경 시 다시 fetch
  useEffect(() => {
    if (auto) {
      fetchData();
    }

    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, auto, ...deps]);

  // 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
    cancel,
  };
};