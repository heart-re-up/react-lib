import { useCountdown } from "@heart-re-up/react-lib/hooks/useCountdown";
import { Button, Flex, Progress, Select, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoCustom() {
  const [reportInterval, setReportInterval] = useState(1000);
  const [computeFrame, setComputeFrame] = useState<30 | 60 | 120>(60);
  const [completedCount, setCompletedCount] = useState(0);

  const { start, stop, reset, isRunning, remainingTime, progress } =
    useCountdown({
      duration: 15000, // 15초
      options: {
        reportInterval,
        computeFrame,
        autoStart: false,
      },
      onComplete: () => {
        setCompletedCount((prev) => prev + 1);
      },
    });

  const formatTime = (time: number) => {
    const totalSeconds = Math.ceil(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}초`;
  };

  const handleReportIntervalChange = (value: string) => {
    if (!isRunning) {
      setReportInterval(Number(value));
    }
  };

  const handleComputeFrameChange = (value: string) => {
    if (!isRunning) {
      setComputeFrame(Number(value) as 30 | 60 | 120);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">커스텀 옵션 카운트다운</h3>
        <p className="text-gray-600 mb-4">
          다양한 옵션으로 카운트다운의 동작을 커스터마이징할 수 있습니다.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">설정 옵션</h4>
        <Flex gap="4" wrap="wrap" align="center">
          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
              보고 간격
            </Text>
            <Select.Root
              value={reportInterval.toString()}
              onValueChange={handleReportIntervalChange}
              disabled={isRunning}
            >
              <Select.Trigger style={{ width: "120px" }} />
              <Select.Content>
                <Select.Item value="100">100ms</Select.Item>
                <Select.Item value="500">500ms</Select.Item>
                <Select.Item value="1000">1초</Select.Item>
                <Select.Item value="2000">2초</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
              계산 프레임
            </Text>
            <Select.Root
              value={computeFrame.toString()}
              onValueChange={handleComputeFrameChange}
              disabled={isRunning}
            >
              <Select.Trigger style={{ width: "120px" }} />
              <Select.Content>
                <Select.Item value="30">30fps</Select.Item>
                <Select.Item value="60">60fps</Select.Item>
                <Select.Item value="120">120fps</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
              완료 횟수
            </Text>
            <Text size="3" weight="bold" color="green">
              {completedCount}회
            </Text>
          </Flex>
        </Flex>
      </div>

      <Flex direction="column" gap="4" align="center">
        <Text size="7" weight="bold">
          {formatTime(remainingTime)}
        </Text>

        <Progress
          value={progress * 100}
          max={100}
          size="3"
          style={{ width: "300px" }}
          color="orange"
        />

        <Text size="2" color="gray">
          진행률: {(progress * 100).toFixed(1)}% | 업데이트 간격:{" "}
          {reportInterval}ms | 계산 프레임: {computeFrame}fps
        </Text>
      </Flex>

      <Flex gap="2" justify="center" wrap="wrap">
        <Button onClick={start} disabled={isRunning} color="green">
          시작
        </Button>
        <Button onClick={stop} disabled={!isRunning} color="orange">
          정지
        </Button>
        <Button onClick={reset} color="red">
          리셋
        </Button>
        <Button
          onClick={() => setCompletedCount(0)}
          variant="soft"
          color="gray"
        >
          카운터 리셋
        </Button>
      </Flex>

      {isRunning && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <Flex direction="column" gap="1">
            <Text size="2" color="blue" align="center">
              🔧 설정: {reportInterval}ms 간격으로 UI 업데이트, {computeFrame}
              fps로 시간 계산
            </Text>
            <Text size="1" color="gray" align="center">
              실행 중에는 옵션을 변경할 수 없습니다.
            </Text>
          </Flex>
        </div>
      )}

      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-orange-700 mb-2">⚙️ 옵션 설명</h4>
        <ul className="text-sm text-orange-600 space-y-1">
          <li>
            • <strong>보고 간격</strong>: UI 업데이트 주기 (낮을수록 부드러움)
          </li>
          <li>
            • <strong>계산 프레임</strong>: 시간 계산 정확도 (높을수록 정확함)
          </li>
          <li>
            • <strong>완료 횟수</strong>: 카운트다운 완료된 총 횟수
          </li>
        </ul>
      </div>
    </div>
  );
}
