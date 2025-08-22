import { useToggle } from "@heart-re-up/react-lib/hooks/useToggle";

export function DemoBasic() {
  const [isOn, toggle, setIsOn] = useToggle(false);
  const [isDarkMode, toggleDarkMode, setDarkMode] = useToggle(true);
  const [isVisible, toggleVisible, setVisible] = useToggle(false);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 토글 동작</h3>
        <p className="text-gray-600 mb-6">
          useToggle은 불린 상태와 토글 함수, 직접 설정 함수를 제공합니다.
        </p>
      </div>

      {/* 기본 토글 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">스위치 토글</h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOn ? "bg-blue-600" : "bg-gray-200"
            }`}
            aria-label={`스위치 ${isOn ? "켜짐" : "꺼짐"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOn ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">
            상태: <strong>{isOn ? "ON" : "OFF"}</strong>
          </span>
        </div>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => setIsOn(true)}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            강제 ON
          </button>
          <button
            onClick={() => setIsOn(false)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            강제 OFF
          </button>
        </div>
      </div>

      {/* 다크모드 토글 */}
      <div
        className={`border rounded-lg p-6 transition-colors ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        }`}
      >
        <h4
          className={`font-medium mb-4 ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          다크모드 토글
        </h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isDarkMode ? "🌞 라이트 모드" : "🌙 다크 모드"}
          </button>
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            현재: <strong>{isDarkMode ? "다크" : "라이트"}</strong> 모드
          </span>
        </div>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => setDarkMode(true)}
            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
          >
            다크 모드로
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className="px-3 py-1 bg-white text-gray-700 text-sm rounded border hover:bg-gray-50"
          >
            라이트 모드로
          </button>
        </div>
      </div>

      {/* 가시성 토글 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">콘텐츠 가시성 토글</h4>
        <div className="space-y-4">
          <button
            onClick={toggleVisible}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isVisible ? "숨기기" : "보이기"}
          </button>

          {isVisible && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
              <h5 className="font-medium text-blue-800 mb-2">
                🎉 보이는 콘텐츠!
              </h5>
              <p className="text-blue-600 text-sm">
                이 콘텐츠는 토글 상태에 따라 보이거나 숨겨집니다. useToggle을
                사용하면 이런 조건부 렌더링을 쉽게 구현할 수 있습니다.
              </p>
            </div>
          )}

          <div className="space-x-2">
            <button
              onClick={() => setVisible(true)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              강제 보이기
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              강제 숨기기
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-700 mb-2">
          💡 useToggle의 장점
        </h4>
        <ul className="text-sm text-yellow-600 space-y-1">
          <li>
            • <code>useState</code>보다 간결한 불린 상태 관리
          </li>
          <li>• 토글 함수가 자동으로 최적화됨 (useCallback 적용)</li>
          <li>• 직접 설정 함수도 함께 제공</li>
          <li>• 모달, 드롭다운, 사이드바 등에 완벽</li>
        </ul>
      </div>
    </div>
  );
}
