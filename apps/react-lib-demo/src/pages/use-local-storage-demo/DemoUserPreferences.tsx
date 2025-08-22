import { useLocalStorage } from "@heart-re-up/react-lib/hooks/useLocalStorage";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "ko" | "en" | "ja";
  fontSize: "small" | "medium" | "large";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  layout: {
    sidebar: boolean;
    compactMode: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  theme: "light",
  language: "ko",
  fontSize: "medium",
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  layout: {
    sidebar: true,
    compactMode: false,
  },
};

export function DemoUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    "user-preferences",
    defaultPreferences
  );

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotification = (
    type: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const updateLayout = (
    type: keyof UserPreferences["layout"],
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        [type]: value,
      },
    }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">사용자 설정 관리</h3>
        <p className="text-gray-600 mb-6">
          복잡한 사용자 설정을 localStorage에 저장하고 관리하는 예제입니다.
        </p>
      </div>

      {/* 테마 설정 */}
      <div
        className={`border rounded-lg p-6 transition-colors ${
          preferences.theme === "dark"
            ? "bg-gray-800 border-gray-600 text-white"
            : "bg-white border-gray-200"
        }`}
      >
        <h4
          className={`font-medium mb-4 ${
            preferences.theme === "dark" ? "text-white" : "text-gray-700"
          }`}
        >
          테마 설정
        </h4>
        <div className="space-y-2">
          {(["light", "dark", "system"] as const).map((theme) => (
            <label key={theme} className="flex items-center">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={preferences.theme === theme}
                onChange={(e) =>
                  updatePreference("theme", e.target.value as any)
                }
                className="mr-2"
              />
              <span
                className={`text-sm ${
                  preferences.theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {theme === "light"
                  ? "라이트 모드"
                  : theme === "dark"
                    ? "다크 모드"
                    : "시스템 설정"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 언어 및 폰트 설정 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">언어 설정</h4>
          <select
            value={preferences.language}
            onChange={(e) =>
              updatePreference("language", e.target.value as any)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="언어 선택"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">폰트 크기</h4>
          <div className="space-y-2">
            {(["small", "medium", "large"] as const).map((size) => (
              <label key={size} className="flex items-center">
                <input
                  type="radio"
                  name="fontSize"
                  value={size}
                  checked={preferences.fontSize === size}
                  onChange={(e) =>
                    updatePreference("fontSize", e.target.value as any)
                  }
                  className="mr-2"
                />
                <span
                  className={`${
                    size === "small"
                      ? "text-sm"
                      : size === "medium"
                        ? "text-base"
                        : "text-lg"
                  }`}
                >
                  {size === "small"
                    ? "작게"
                    : size === "medium"
                      ? "보통"
                      : "크게"}{" "}
                  ({size})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">알림 설정</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-600">이메일 알림</span>
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => updateNotification("email", e.target.checked)}
              className="ml-2"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-600">푸시 알림</span>
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => updateNotification("push", e.target.checked)}
              className="ml-2"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-600">SMS 알림</span>
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => updateNotification("sms", e.target.checked)}
              className="ml-2"
            />
          </label>
        </div>
      </div>

      {/* 레이아웃 설정 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">레이아웃 설정</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-600">사이드바 표시</span>
            <input
              type="checkbox"
              checked={preferences.layout.sidebar}
              onChange={(e) => updateLayout("sidebar", e.target.checked)}
              className="ml-2"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-600">컴팩트 모드</span>
            <input
              type="checkbox"
              checked={preferences.layout.compactMode}
              onChange={(e) => updateLayout("compactMode", e.target.checked)}
              className="ml-2"
            />
          </label>
        </div>
      </div>

      {/* 현재 설정 미리보기 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">현재 설정 (JSON)</h4>
        <pre className="text-sm text-gray-600 bg-white p-4 rounded border overflow-x-auto">
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>

      {/* 제어 버튼 */}
      <div className="flex space-x-4">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          기본값으로 리셋
        </button>
        <button
          onClick={removePreferences}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          모든 설정 삭제
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-700 mb-2">⚙️ 설정 관리 패턴</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• 중첩된 객체 구조로 복잡한 설정 관리</li>
          <li>• 타입스크립트로 설정 구조 안전성 보장</li>
          <li>• 부분 업데이트로 성능 최적화</li>
          <li>• 기본값 제공으로 초기 사용자 경험 개선</li>
        </ul>
      </div>
    </div>
  );
}
