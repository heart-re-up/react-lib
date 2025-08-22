import { useCountdown } from "@heart-re-up/react-lib/hooks/useCountdown";
import { Button, Flex, Progress, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoBasic() {
  const [duration, setDuration] = useState(10000); // 10초

  const { start, stop, reset, isRunning, remainingTime, progress } =
    useCountdown({
      duration,
      onComplete: () => {
        alert("카운트다운 완료!");
      },
    });

  const formatTime = (time: number) => {
    const seconds = Math.ceil(time / 1000);
    return `${seconds}초`;
  };

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning) {
      setDuration(newDuration);
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 카운트다운</h3>
        <p className="text-gray-600 mb-4">
          간단한 카운트다운 기능을 사용해보세요. 다양한 시간으로 설정할 수
          있습니다.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">코드 예시</h4>
        <code className="text-sm text-gray-600 bg-white p-2 rounded block">
          {`const { start, stop, reset, isRunning, remainingTime, progress } = useCountdown({ duration: ${duration}, onComplete: () => alert("완료!") });`}
        </code>
      </div>

      <Flex direction="column" gap="4" align="center">
        <Text size="6" weight="bold">
          {formatTime(remainingTime)}
        </Text>

        <Progress
          value={progress * 100}
          max={100}
          size="3"
          style={{ width: "200px" }}
        />

        <Text size="2" color="gray">
          진행률: {(progress * 100).toFixed(1)}%
        </Text>
      </Flex>

      <Flex gap="2" justify="center" wrap="wrap">
        <Button onClick={start} disabled={isRunning}>
          시작
        </Button>
        <Button onClick={stop} disabled={!isRunning} color="orange">
          정지
        </Button>
        <Button onClick={reset} color="red">
          리셋
        </Button>
      </Flex>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">시간 설정</h4>
        <Flex gap="2" justify="center" wrap="wrap">
          <Button
            variant="soft"
            size="1"
            onClick={() => handleDurationChange(5000)}
            disabled={isRunning}
          >
            5초
          </Button>
          <Button
            variant="soft"
            size="1"
            onClick={() => handleDurationChange(10000)}
            disabled={isRunning}
          >
            10초
          </Button>
          <Button
            variant="soft"
            size="1"
            onClick={() => handleDurationChange(30000)}
            disabled={isRunning}
          >
            30초
          </Button>
          <Button
            variant="soft"
            size="1"
            onClick={() => handleDurationChange(60000)}
            disabled={isRunning}
          >
            1분
          </Button>
        </Flex>
      </div>

      {isRunning && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <Text size="2" color="blue" align="center">
            ⏰ 카운트다운이 실행 중입니다. 브라우저 탭을 바꿔도 정확한 시간이
            유지됩니다.
          </Text>
        </div>
      )}
    </div>
  );
}
