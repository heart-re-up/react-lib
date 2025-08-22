import { useDebounce } from "../../../../packages/react-lib/src/hooks/useDebounce";
import { Card } from "@radix-ui/themes";
import { useCallback, useState } from "react";
// import * as Separator from '@radix-ui/react-separator';

// 가짜 API 함수
const searchAPI = (query: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults = [
        "Apple",
        "Banana",
        "Cherry",
        "Date",
        "Elderberry",
        "Fig",
        "Grape",
        "Honeydew",
      ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      resolve(mockResults);
    }, 300);
  });
};

export default function UseDebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  // 검색 함수
  const performSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      setIsLoading(true);
      setSearchCount((prev) => prev + 1);
      setDebouncedSearchTerm(query);

      try {
        const searchResults = await searchAPI(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setDebouncedSearchTerm("");
      setIsLoading(false);
    }
  }, []);

  // 디바운스된 검색 함수
  const debouncedSearch = useDebounce(performSearch, 500);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">useDebounce</h2>
        <p className="text-muted-foreground">
          함수 호출을 지연시켜 API 호출 횟수를 줄이고 성능을 최적화합니다.
          입력을 멈춘 후 500ms 후에 검색이 실행됩니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">실시간 검색</h3>
            <p className="text-sm text-muted-foreground">
              과일 이름을 검색해보세요. 디바운스가 적용되어 입력이 완료된 후에만
              검색됩니다.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium mb-2"
              >
                검색어
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  debouncedSearch(value);
                }}
                placeholder="과일 이름을 입력하세요..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">현재 입력값:</div>
                <code className="bg-muted px-2 py-1 rounded block">
                  {searchTerm || "(없음)"}
                </code>
              </div>
              <div className="space-y-1">
                <div className="font-medium">디바운스된 값:</div>
                <code className="bg-muted px-2 py-1 rounded block">
                  {debouncedSearchTerm || "(없음)"}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                API 호출 횟수:{" "}
                <span className="font-medium">{searchCount}</span>
              </div>
              <button
                onClick={() => {
                  debouncedSearch.clear();
                  setIsLoading(false);
                }}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                검색 취소
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium">검색 결과</h3>
            <p className="text-sm text-muted-foreground">
              디바운스된 검색어로 API를 호출한 결과입니다.
            </p>
          </div>
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">검색 중...</span>
              </div>
            ) : (
              <div>
                {results.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {results.length}개의 결과를 찾았습니다:
                    </div>
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-secondary rounded-md text-sm"
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : debouncedSearchTerm ? (
                  <div className="text-center py-8 text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    검색어를 입력해주세요.
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="pb-4">
          <h3 className="text-lg font-medium">성능 비교</h3>
          <p className="text-sm text-muted-foreground">
            함수 디바운스가 없다면 매 키 입력마다 API가 호출되어 불필요한 요청이
            발생합니다. clear() 메서드로 대기 중인 호출을 취소할 수도 있습니다.
          </p>
        </div>
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-600">
                ✅ 디바운스 적용 (현재)
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 입력 완료 후에만 함수 호출</li>
                <li>• 서버 부하 감소</li>
                <li>• 네트워크 트래픽 절약</li>
                <li>• 취소 기능으로 더 정밀한 제어</li>
                <li>• 사용자 경험 향상</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-600">
                ❌ 디바운스 미적용
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 매 키 입력마다 함수 호출</li>
                <li>• 불필요한 서버 부하</li>
                <li>• 네트워크 자원 낭비</li>
                <li>• 취소 기능 없음</li>
                <li>• 느린 응답 시간</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
