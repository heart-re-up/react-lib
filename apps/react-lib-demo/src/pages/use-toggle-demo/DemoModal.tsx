import { useToggle } from "@heart-re-up/react-lib/hooks/useToggle";

export function DemoModal() {
  const [isModalOpen, toggleModal, setModalOpen] = useToggle(false);
  const [isConfirmOpen, toggleConfirm, setConfirmOpen] = useToggle(false);
  const [isInfoOpen, toggleInfo] = useToggle(false);

  const handleConfirmAction = () => {
    alert("확인되었습니다!");
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">모달 제어</h3>
        <p className="text-gray-600 mb-6">
          useToggle을 사용하여 다양한 종류의 모달을 쉽게 관리할 수 있습니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* 기본 모달 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">기본 모달</h4>
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            모달 열기
          </button>
        </div>

        {/* 확인 모달 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">확인 모달</h4>
          <button
            onClick={toggleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            삭제 확인
          </button>
        </div>

        {/* 정보 모달 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-700 mb-4">정보 모달</h4>
          <button
            onClick={toggleInfo}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            정보 보기
          </button>
        </div>
      </div>

      {/* 기본 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">기본 모달</h3>
            <p className="text-gray-600 mb-6">
              이것은 useToggle로 관리되는 기본 모달입니다. 토글 함수 하나로 쉽게
              열고 닫을 수 있습니다.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                강제 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600">삭제 확인</h3>
            </div>
            <p className="text-gray-600 mb-6">
              정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={toggleConfirm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정보 모달 */}
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-600">정보</h3>
            </div>
            <div className="space-y-3 text-gray-600 mb-6">
              <p>useToggle 훅의 특징:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>간단한 불린 상태 관리</li>
                <li>토글, 직접 설정 함수 제공</li>
                <li>성능 최적화된 콜백</li>
                <li>타입스크립트 완벽 지원</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={toggleInfo}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-700 mb-2">🎯 모달 관리 패턴</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>
            • <code>toggle()</code>: 현재 상태를 반전
          </li>
          <li>
            • <code>setOpen(false)</code>: 강제로 닫기
          </li>
          <li>
            • <code>setOpen(true)</code>: 강제로 열기
          </li>
          <li>• 여러 모달을 독립적으로 관리 가능</li>
        </ul>
      </div>
    </div>
  );
}
