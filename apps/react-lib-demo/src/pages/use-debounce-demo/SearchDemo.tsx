import { useDebounce } from "@heart-re-up/react-lib/hooks/useDebounce";
import { useMemo, useState } from "react";

// 모의 데이터
const mockData = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Ugli fruit",
  "Vanilla",
  "Watermelon",
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
];

export function SearchDemo() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCount, setSearchCount] = useState(0);

  const debouncedSearch = useDebounce((searchTerm: string) => {
    setSearchQuery(searchTerm);
    setSearchCount((prev) => prev + 1);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return mockData.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    setSearchCount(0);
    debouncedSearch.clear();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">실시간 검색</h3>
        <p className="text-gray-600 mb-4">
          검색어 입력을 멈춘 후 300ms 뒤에 검색이 실행됩니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            검색어
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="과일이나 기술을 검색해보세요..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">입력 중인 검색어</h4>
            <div className="text-sm text-gray-600">
              "{query}" {query && `(${query.length}자)`}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">실제 검색어</h4>
            <div className="text-sm text-blue-600">
              "{searchQuery}" {searchQuery && `(${searchQuery.length}자)`}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-700 mb-2">검색 실행 횟수</h4>
          <div className="text-2xl font-bold text-green-600">{searchCount}</div>
        </div>

        {searchQuery && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">
              검색 결과 ({filteredResults.length}개)
            </h4>
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredResults.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">검색 결과가 없습니다.</div>
            )}
          </div>
        )}

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          검색 초기화
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-700 mb-2">🔍 검색 최적화</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• 타이핑할 때마다 검색하지 않고 입력이 완료된 후 검색</li>
          <li>• API 호출 횟수를 크게 줄여 서버 부하 감소</li>
          <li>• 사용자 경험 향상 (불필요한 로딩 상태 제거)</li>
          <li>• 네트워크 비용 절약</li>
        </ul>
      </div>
    </div>
  );
}
