import { useLocalStorage } from "@heart-re-up/react-lib/hooks/useLocalStorage";

export function DemoBasic() {
  const [name, setName, removeName, flushName] = useLocalStorage(
    "demo-name",
    ""
  );
  const [count, setCount, removeCount] = useLocalStorage("demo-count", 0);
  const [user, setUser, removeUser] = useLocalStorage("demo-user", {
    name: "",
    email: "",
    age: 0,
  });

  const handleUserUpdate = (
    field: keyof typeof user,
    value: string | number
  ) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 localStorage 동기화</h3>
        <p className="text-gray-600 mb-6">
          값이 자동으로 localStorage에 저장되고, 페이지 새로고침 후에도
          유지됩니다.
        </p>
      </div>

      {/* 문자열 저장 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">문자열 데이터</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 (localStorage 키: "demo-name")
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => flushName()}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              즉시 저장
            </button>
            <button
              onClick={removeName}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
          <div className="text-sm text-gray-600">
            현재 값: <strong>{name || "(비어있음)"}</strong>
          </div>
        </div>
      </div>

      {/* 숫자 저장 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">숫자 데이터</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카운터 (localStorage 키: "demo-count")
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCount((prev) => prev - 1)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                aria-label="카운터 1 감소"
              >
                -1
              </button>
              <span className="text-xl font-bold text-blue-600 min-w-[3rem] text-center">
                {count}
              </span>
              <button
                onClick={() => setCount((prev) => prev + 1)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                aria-label="카운터 1 증가"
              >
                +1
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCount(0)}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              리셋
            </button>
            <button
              onClick={removeCount}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 객체 저장 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">객체 데이터</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleUserUpdate("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleUserUpdate("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                나이
              </label>
              <input
                type="number"
                value={user.age}
                onChange={(e) =>
                  handleUserUpdate("age", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="나이 입력"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              저장된 사용자 정보:
            </h5>
            <pre className="text-sm text-gray-600 bg-white p-2 rounded border">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() =>
                setUser({ name: "홍길동", email: "hong@example.com", age: 30 })
              }
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              샘플 데이터
            </button>
            <button
              onClick={removeUser}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-700 mb-2">
          💡 localStorage 동작 확인
        </h4>
        <ul className="text-sm text-yellow-600 space-y-1">
          <li>
            • 개발자 도구 → Application → Local Storage에서 실제 저장된 값 확인
          </li>
          <li>• 페이지를 새로고침해도 데이터가 유지됨</li>
          <li>• JSON 직렬화/역직렬화가 자동으로 처리됨</li>
          <li>• 디바운싱으로 성능 최적화 (기본 200ms 지연)</li>
        </ul>
      </div>
    </div>
  );
}
