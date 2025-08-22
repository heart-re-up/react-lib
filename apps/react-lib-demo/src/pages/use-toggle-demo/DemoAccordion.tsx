import { useToggle } from "@heart-re-up/react-lib/hooks/useToggle";

export function DemoAccordion() {
  const [section1Open, toggleSection1] = useToggle(false);
  const [section2Open, toggleSection2] = useToggle(true);
  const [section3Open, toggleSection3] = useToggle(false);
  const [section4Open, toggleSection4] = useToggle(false);

  const accordionItems = [
    {
      id: 1,
      title: "useToggle이란 무엇인가요?",
      content:
        "useToggle은 불린 상태를 쉽게 관리할 수 있는 React 훅입니다. 토글 함수와 직접 설정 함수를 제공하여 모달, 드롭다운, 아코디언 등의 UI 컴포넌트에서 유용하게 사용할 수 있습니다.",
      isOpen: section1Open,
      toggle: toggleSection1,
    },
    {
      id: 2,
      title: "어떤 경우에 사용하나요?",
      content:
        "모달 창 열기/닫기, 사이드바 토글, 드롭다운 메뉴, 아코디언, 탭 전환, 다크모드 토글 등 불린 상태가 필요한 모든 곳에서 사용할 수 있습니다. useState보다 더 간결하고 의미가 명확합니다.",
      isOpen: section2Open,
      toggle: toggleSection2,
    },
    {
      id: 3,
      title: "성능상 이점이 있나요?",
      content:
        "네, useToggle은 내부적으로 useCallback을 사용하여 토글 함수를 최적화합니다. 이로 인해 불필요한 리렌더링을 방지하고 성능을 향상시킵니다. 특히 자식 컴포넌트에 콜백을 전달할 때 유용합니다.",
      isOpen: section3Open,
      toggle: toggleSection3,
    },
    {
      id: 4,
      title: "다른 상태 관리 훅과의 차이점은?",
      content:
        "useState(false)와 비교했을 때, useToggle은 토글 로직이 내장되어 있어 더 간결합니다. 또한 타입스크립트에서 더 명확한 타입 추론을 제공하며, 토글 전용 최적화가 적용되어 있습니다.",
      isOpen: section4Open,
      toggle: toggleSection4,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">아코디언 컴포넌트</h3>
        <p className="text-gray-600 mb-6">
          useToggle을 사용하여 구현한 아코디언입니다. 각 섹션이 독립적으로
          토글됩니다.
        </p>
      </div>

      <div className="space-y-2">
        {accordionItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={item.toggle}
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {item.isOpen && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 mb-4">아코디언 제어</h4>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleSection1}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                section1Open
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              섹션 1
            </button>
            <button
              onClick={toggleSection2}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                section2Open
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              섹션 2
            </button>
            <button
              onClick={toggleSection3}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                section3Open
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              섹션 3
            </button>
            <button
              onClick={toggleSection4}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                section4Open
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              섹션 4
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">전체 제어:</p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  toggleSection1();
                  toggleSection2();
                  toggleSection3();
                  toggleSection4();
                }}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                모두 토글
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-700 mb-2">
          🎨 아코디언 구현 팁
        </h4>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• 각 섹션마다 독립적인 useToggle 사용</li>
          <li>• CSS 트랜지션으로 부드러운 애니메이션 추가</li>
          <li>• 키보드 접근성 고려 (Enter, Space 키)</li>
          <li>• 초기 상태를 다르게 설정하여 UX 개선</li>
        </ul>
      </div>
    </div>
  );
}
