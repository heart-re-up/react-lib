import { useState } from "react";
import { useClickOutside } from "@heart-re-up/react-lib/hooks/useClickOutside";

const UseClickOutsideDemoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const modalRef = useClickOutside<HTMLDivElement>(() => {
    setIsModalOpen(false);
    setClickCount((prev) => prev + 1);
  });

  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => setIsDropdownOpen(false),
    isDropdownOpen // 드롭다운이 열려있을 때만 활성화
  );

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">useClickOutside</h1>
        <p className="mt-2 text-gray-600">
          지정된 요소 외부를 클릭했을 때 콜백을 실행하는 훅입니다.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>외부 클릭 횟수:</strong> {clickCount}회
          </p>
        </div>
      </div>

      {/* 모달 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">모달 데모</h2>
        <p className="text-gray-600">모달 외부를 클릭하면 모달이 닫힙니다.</p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          모달 열기
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">모달 제목</h3>
              <p className="text-gray-600 mb-6">
                이 모달 외부를 클릭하면 모달이 닫힙니다. 모달 내부를 클릭해도 닫히지 않습니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => alert("모달 내부 버튼 클릭!")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  내부 버튼
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 드롭다운 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">드롭다운 데모</h2>
        <p className="text-gray-600">드롭다운 외부를 클릭하면 드롭다운이 닫힙니다.</p>
        
        <div className="relative inline-block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            드롭다운 토글
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
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
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    alert("옵션 1 선택");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  옵션 1
                </button>
                <button
                  onClick={() => {
                    alert("옵션 2 선택");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  옵션 2
                </button>
                <button
                  onClick={() => {
                    alert("옵션 3 선택");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  옵션 3
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 코드 예제 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">코드 예제</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm text-gray-800">
{`import { useClickOutside } from '@heart-re-up/react-lib/hooks/useClickOutside';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      {isOpen && (
        <div className="modal-overlay">
          <div ref={ref} className="modal">
            <p>Modal Content</p>
          </div>
        </div>
      )}
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* 특징 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">주요 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">터치 이벤트 지원</h3>
            <p className="text-green-700 text-sm">
              모바일 기기의 터치 이벤트도 지원합니다.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">조건부 활성화</h3>
            <p className="text-blue-700 text-sm">
              enabled 옵션으로 훅을 조건부로 활성화할 수 있습니다.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">타입 안전성</h3>
            <p className="text-purple-700 text-sm">
              TypeScript 제네릭으로 요소 타입을 지정할 수 있습니다.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">빠른 반응성</h3>
            <p className="text-orange-700 text-sm">
              mousedown/touchstart 이벤트로 빠른 반응성을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseClickOutsideDemoPage;