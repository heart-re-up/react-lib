import { Card, Separator } from "@radix-ui/themes";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React Library Demo
        </h1>
        <p className="text-lg text-gray-600">
          @heart-re-up/react-lib 라이브러리의 다양한 기능을 체험해보세요.
        </p>
        <Separator className="bg-gray-200 h-[1px] my-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/debounce" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useDebounce
            </h3>
            <p className="text-gray-600 text-sm">
              값의 변경을 지연시켜 성능을 최적화하는 훅입니다. 검색 입력이나 API
              호출 최적화에 유용합니다.
            </p>
          </Card>
        </Link>

        <Link to="/toggle" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useToggle
            </h3>
            <p className="text-gray-600 text-sm">
              불린 상태를 쉽게 토글할 수 있는 훅입니다. 모달, 드롭다운, 사이드바
              등의 상태 관리에 활용됩니다.
            </p>
          </Card>
        </Link>

        <Link to="/localStorage" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useLocalStorage
            </h3>
            <p className="text-gray-600 text-sm">
              로컬스토리지와 React 상태를 동기화하는 훅입니다. 사용자 설정이나
              임시 데이터 저장에 유용합니다.
            </p>
          </Card>
        </Link>

        <Link to="/progress-counter" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useProgressCounter
            </h3>
            <p className="text-gray-600 text-sm">
              동시 실행되는 비동기 작업들의 개수를 카운트하고, 현재 진행 중인
              비동기 작업이 있는지 여부를 제공합니다.
            </p>
          </Card>
        </Link>

        <Link to="/countdown" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useCountdown
            </h3>
            <p className="text-gray-600 text-sm">
              정확한 카운트다운 기능을 제공하는 훅입니다. 브라우저 탭 전환이나
              백그라운드 실행 시에도 정확한 시간을 유지합니다.
            </p>
          </Card>
        </Link>

        <Link to="/copy-to-clipboard" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useCopyToClipboard
            </h3>
            <p className="text-gray-600 text-sm">
              다양한 형태의 데이터를 클립보드에 복사할 수 있는 훅입니다. 텍스트,
              이미지, HTML 등을 지원합니다.
            </p>
          </Card>
        </Link>

        <Link to="/download" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useDownload
            </h3>
            <p className="text-gray-600 text-sm">
              다양한 형태의 데이터를 파일로 다운로드할 수 있는 훅입니다. 텍스트,
              이미지, JSON 등을 지원합니다.
            </p>
          </Card>
        </Link>

        <Link to="/event-listener" className="group">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
              useEventListener
            </h3>
            <p className="text-gray-600 text-sm">
              다양한 DOM 요소와 글로벌 이벤트를 쉽게 처리할 수 있는 훅입니다.
              자동으로 이벤트 리스너를 등록하고 정리합니다.
            </p>
          </Card>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-violet-50 rounded-lg border border-violet-200">
        <h2 className="text-2xl font-semibold text-violet-900 mb-4">
          시작하기
        </h2>
        <p className="text-violet-700 mb-4">
          왼쪽 사이드바에서 원하는 훅을 선택하거나 검색 기능을 사용해서 다양한
          훅들의 데모를 확인해보세요.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            TypeScript 지원
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            테스트 완료
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            트리 쉐이킹 최적화
          </span>
        </div>
      </div>
    </div>
  );
}
