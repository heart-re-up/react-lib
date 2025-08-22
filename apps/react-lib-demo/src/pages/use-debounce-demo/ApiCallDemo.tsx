import { useDebounce } from "@heart-re-up/react-lib/hooks/useDebounce";
import { useEffect, useState } from "react";

interface ApiResponse {
  id: number;
  title: string;
  body: string;
}

export function ApiCallDemo() {
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastCallTime, setLastCallTime] = useState<Date | null>(null);

  // API 호출 함수
  const fetchPost = async (id: string) => {
    if (!id || isNaN(Number(id))) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setApiCallCount((prev) => prev + 1);
    setLastCallTime(new Date());

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API 호출 실패");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // 디바운스된 API 호출
  const debouncedFetchPost = useDebounce(fetchPost, 800);

  // 입력값 변경 시 디바운스된 API 호출
  useEffect(() => {
    debouncedFetchPost(postId);
  }, [postId, debouncedFetchPost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostId(e.target.value);
  };

  const handleClear = () => {
    setPostId("");
    setData(null);
    setError(null);
    setApiCallCount(0);
    setLastCallTime(null);
    debouncedFetchPost.clear();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">API 호출 최적화</h3>
        <p className="text-gray-600 mb-4">
          포스트 ID 입력을 멈춘 후 800ms 뒤에 API를 호출합니다. (1-100 범위)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            포스트 ID (1-100)
          </label>
          <input
            type="number"
            value={postId}
            onChange={handleInputChange}
            placeholder="포스트 ID를 입력하세요..."
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">API 호출 횟수</h4>
            <div className="text-2xl font-bold text-blue-600">
              {apiCallCount}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-700 mb-2">
              마지막 호출 시간
            </h4>
            <div className="text-sm text-green-600">
              {lastCallTime ? lastCallTime.toLocaleTimeString() : "없음"}
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span className="text-yellow-600">API 호출 중...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-700 mb-2">오류 발생</h4>
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {data && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">API 응답 데이터</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">ID: </span>
                <span className="text-sm text-gray-800">{data.id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  제목:{" "}
                </span>
                <span className="text-sm text-gray-800">{data.title}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  내용:{" "}
                </span>
                <p className="text-sm text-gray-800 mt-1">{data.body}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-700 mb-2">🚀 API 최적화 효과</h4>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• 사용자가 빠르게 숫자를 바꿔도 마지막 값만 API 호출</li>
          <li>• 서버 부하 크게 감소 (호출 횟수 최소화)</li>
          <li>• 네트워크 비용 절약</li>
          <li>• 사용자 경험 개선 (불필요한 로딩 상태 제거)</li>
          <li>• Rate limiting 회피</li>
        </ul>
      </div>
    </div>
  );
}
