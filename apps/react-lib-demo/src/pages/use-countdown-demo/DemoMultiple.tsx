import { useCountdown } from "@heart-re-up/react-lib/hooks/useCountdown";
import { Badge, Button, Card, Flex, Progress, Text } from "@radix-ui/themes";
import { random } from "lodash-es";
import { useState } from "react";

type CountdownItem = {
  id: string;
  duration: number;
  label: string;
  color: "blue" | "green" | "orange" | "red" | "purple";
};

const CountdownCard = ({
  item,
  onComplete,
}: {
  item: CountdownItem;
  onComplete: (id: string) => void;
}) => {
  const { start, stop, reset, isRunning, remainingTime, progress } =
    useCountdown({
      duration: item.duration,
      options: {
        reportInterval: 500,
        computeFrame: 60,
      },
      onComplete: () => onComplete(item.id),
    });

  const formatTime = (time: number) => {
    const seconds = Math.ceil(time / 1000);
    return `${seconds}s`;
  };

  return (
    <Card style={{ minWidth: "200px" }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="3" weight="bold">
            {item.label}
          </Text>
          <Badge color={item.color} variant="soft">
            {item.duration / 1000}초
          </Badge>
        </Flex>

        <Flex direction="column" gap="2" align="center">
          <Text size="5" weight="bold">
            {formatTime(remainingTime)}
          </Text>

          <Progress
            value={progress * 100}
            max={100}
            size="2"
            color={item.color}
            style={{ width: "100%" }}
          />
        </Flex>

        <Flex gap="1" justify="center">
          <Button
            size="1"
            onClick={start}
            disabled={isRunning}
            color={item.color}
          >
            시작
          </Button>
          <Button size="1" variant="soft" onClick={stop} disabled={!isRunning}>
            정지
          </Button>
          <Button size="1" variant="outline" onClick={reset}>
            리셋
          </Button>
        </Flex>

        {isRunning && (
          <Badge
            color={item.color}
            variant="surface"
            style={{ alignSelf: "center" }}
          >
            실행중
          </Badge>
        )}
      </Flex>
    </Card>
  );
};

export default function DemoMultiple() {
  const [countdowns, setCountdowns] = useState<CountdownItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const colors: CountdownItem["color"][] = [
    "blue",
    "green",
    "orange",
    "red",
    "purple",
  ];

  const addCountdown = () => {
    const duration = random(5000, 30000); // 5-30초
    const id = Math.random().toString(36).substr(2, 9);
    const label = `타이머 ${countdowns.length + 1}`;
    const color = colors[countdowns.length % colors.length];

    setCountdowns((prev) => [...prev, { id, duration, label, color }]);
  };

  const removeCountdown = (id: string) => {
    setCountdowns((prev) => prev.filter((item) => item.id !== id));
    setCompletedIds((prev) => prev.filter((completedId) => completedId !== id));
  };

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => [...prev, id]);
  };

  const clearAll = () => {
    setCountdowns([]);
    setCompletedIds([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">다중 카운트다운</h3>
        <p className="text-gray-600 mb-4">
          여러 개의 카운트다운을 동시에 실행할 수 있습니다. 각각 독립적으로
          동작합니다.
        </p>
      </div>

      <Flex justify="between" align="center">
        <Text size="3" weight="medium">
          활성 타이머: {countdowns.length}개
        </Text>
        <Flex gap="2">
          <Button onClick={addCountdown} size="2">
            타이머 추가
          </Button>
          {countdowns.length > 0 && (
            <Button onClick={clearAll} variant="soft" color="red" size="2">
              모두 제거
            </Button>
          )}
        </Flex>
      </Flex>

      {completedIds.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <Flex gap="2" align="center">
            <Text size="2" weight="medium">
              완료된 타이머:
            </Text>
            <Flex gap="1" wrap="wrap">
              {completedIds.map((id) => {
                const item = countdowns.find((c) => c.id === id);
                return item ? (
                  <Badge key={id} color="green" variant="solid">
                    {item.label} ✓
                  </Badge>
                ) : null;
              })}
            </Flex>
          </Flex>
        </div>
      )}

      {countdowns.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <Text size="3" color="gray" mb="2">
            아직 타이머가 없습니다
          </Text>
          <Text size="2" color="gray">
            "타이머 추가" 버튼을 클릭해서 새로운 카운트다운을 만들어보세요
          </Text>
        </div>
      ) : (
        <Flex gap="3" wrap="wrap">
          {countdowns.map((item) => (
            <Flex key={item.id} direction="column" gap="2">
              <CountdownCard item={item} onComplete={handleComplete} />
              <Button
                size="1"
                variant="ghost"
                color="red"
                onClick={() => removeCountdown(item.id)}
              >
                제거
              </Button>
            </Flex>
          ))}
        </Flex>
      )}

      {countdowns.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <Text size="2" color="blue" align="center">
            💡 팁: 각 타이머는 독립적으로 동작하며, 브라우저 탭 전환 시에도
            정확한 시간을 유지합니다.
          </Text>
        </div>
      )}
    </div>
  );
}
