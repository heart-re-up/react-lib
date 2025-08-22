import { useState } from "react";
import { useInterval } from "@heart-re-up/react-lib/hooks/useInterval";

const UseIntervalDemoPage = () => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState<number | null>(1000);
  const [time, setTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);

  // 카운터
  useInterval(() => {
    setCount(count + 1);
  }, delay);

  // 실시간 시계
  useInterval(() => {
    setTime(new Date());
  }, 1000);

  // 프로그레스 바
  useInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        setIsProgressRunning(false);
        return 0;
      }
      return prev + 1;
    });
  }, isProgressRunning ? 50 : null);

  const handleDelayChange = (newDelay: number | null) => {
    setDelay(newDelay);
  };

  const resetCount = () => {
    setCount(0);
  };

  const startProgress = () => {
    setProgress(0);
    setIsProgressRunning(true);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">useInterval</h1>
        <p className="mt-2 text-gray-600">
          React에서 setInterval을 안전하게 사용할 수 있게 해주는 훅입니다.
        </p>
      </div>

      {/* 카운터 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">카운터 데모</h2>
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">{count}</div>
            <p className="text-gray-600 mb-4">
              현재 간격: {delay ? `${delay}ms` : "정지됨"}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={() => handleDelayChange(100)}
                className={`px-3 py-1 rounded ${
                  delay === 100
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                } transition-colors`}
              >
                빠름 (100ms)
              </button>
              <button
                onClick={() => handleDelayChange(500)}
                className={`px-3 py-1 rounded ${
                  delay === 500
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                } transition-colors`}
              >
                보통 (500ms)
              </button>
              <button
                onClick={() => handleDelayChange(1000)}
                className={`px-3 py-1 rounded ${
                  delay === 1000
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                } transition-colors`}
              >
                느림 (1000ms)
              </button>
              <button
                onClick={() => handleDelayChange(null)}
                className={`px-3 py-1 rounded ${
                  delay === null
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-600 border border-red-600"
                } transition-colors`}
              >
                정지
              </button>
            </div>
            <button
              onClick={resetCount}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              리셋
            </button>
          </div>
        </div>
      </div>

      {/* 실시간 시계 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">실시간 시계</h2>
        <div className="p-6 bg-green-50 rounded-lg text-center">
          <div className="text-2xl font-mono text-green-600 mb-2">
            {time.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-600">
            {time.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 프로그레스 바 데모 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">프로그레스 바</h2>
        <div className="p-6 bg-purple-50 rounded-lg">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-purple-700">진행률</span>
              <span className="text-purple-700">{progress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={startProgress}
              disabled={isProgressRunning}
              className={`px-4 py-2 rounded transition-colors ${
                isProgressRunning
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isProgressRunning ? "진행 중..." : "시작"}
            </button>
          </div>
        </div>
      </div>

      {/* 코드 예제 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">코드 예제</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm text-gray-800">
{`import { useInterval } from '@heart-re-up/react-lib/hooks/useInterval';

const Timer = () => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);

  useInterval(() => {
    setCount(count + 1);
  }, delay);

  return (
    <div>
      <h1>{count}</h1>
      <input
        value={delay}
        onChange={(e) => setDelay(Number(e.target.value))}
      />
      <button onClick={() => setDelay(null)}>
        Stop
      </button>
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
            <h3 className="font-semibold text-green-800 mb-2">안전한 Cleanup</h3>
            <p className="text-green-700 text-sm">
              컴포넌트가 언마운트되면 자동으로 interval을 정리합니다.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">최신 콜백 참조</h3>
            <p className="text-blue-700 text-sm">
              리렌더링되어도 항상 최신 콜백 함수를 실행합니다.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">동적 제어</h3>
            <p className="text-purple-700 text-sm">
              delay를 null로 설정하면 interval을 일시 정지할 수 있습니다.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">성능 최적화</h3>
            <p className="text-orange-700 text-sm">
              불필요한 interval 재설정을 방지하여 성능을 최적화합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseIntervalDemoPage;