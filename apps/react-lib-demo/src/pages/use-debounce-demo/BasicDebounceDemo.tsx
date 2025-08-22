import { useDebounce } from "@heart-re-up/react-lib/hooks/useDebounce";
import { useState } from "react";

export function BasicDebounceDemo() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [callCount, setCallCount] = useState(0);

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedValue(value);
    setCallCount((prev) => prev + 1);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdate(value);
  };

  const handleClear = () => {
    debouncedUpdate.clear();
    setInputValue("");
    setDebouncedValue("");
    setCallCount(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 디바운스 동작</h3>
        <p className="text-gray-600 mb-4">
          입력을 멈춘 후 500ms 뒤에 값이 업데이트됩니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            입력값
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="여기에 입력해보세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">실시간 값</h4>
            <div className="text-sm text-gray-600">
              {inputValue || "(비어있음)"}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">디바운스된 값</h4>
            <div className="text-sm text-blue-600">
              {debouncedValue || "(비어있음)"}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-700 mb-2">함수 호출 횟수</h4>
          <div className="text-2xl font-bold text-green-600">{callCount}</div>
        </div>

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          초기화 (디바운스 취소)
        </button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-700 mb-2">💡 사용 팁</h4>
        <ul className="text-sm text-yellow-600 space-y-1">
          <li>• 빠르게 타이핑하면 마지막 입력만 처리됩니다</li>
          <li>• clear() 메서드로 대기 중인 호출을 취소할 수 있습니다</li>
          <li>• 검색, API 호출 등에서 성능 최적화에 유용합니다</li>
        </ul>
      </div>
    </div>
  );
}
