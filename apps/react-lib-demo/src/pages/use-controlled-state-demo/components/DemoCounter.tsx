import { useControlledState } from "@heart-re-up/react-lib/hooks/useControlledState";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useRenderCount } from "@heart-re-up/react-lib/hooks/useRenderCount";
import { useEffect } from "react";

interface DemoCounterProps {
  /** 제어 모드에서 사용할 값 */
  value?: number;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: number) => void;
  /** 비제어 모드에서 사용할 기본값 */
  defaultValue?: number;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 증감 단위 */
  step?: number;
  /** 라벨 */
  label?: string;
}

/**
 * useControlledState를 활용한 재사용 가능한 Counter 컴포넌트
 * - 제어/비제어 모드를 자동으로 감지
 * - 최소/최대값 제한 지원
 */
export function DemoCounter({
  value,
  onChange,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
}: DemoCounterProps) {
  const [count, setCount] = useControlledState({
    value,
    onChange,
    defaultValue,
  });

  const rendercount = useRenderCount();

  const increment = () => {
    const newValue = Math.min(count + step, max);
    setCount(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(count - step, min);
    console.log("DemoCounter decrement:", { count, step, min, newValue });
    setCount(newValue);
  };

  const reset = () => {
    setCount(defaultValue);
  };

  useEffect(() => {
    console.log("DemoCounter commit...");
  }, []);

  return (
    <Flex direction="column" gap="3">
      {label && (
        <Text size="2" weight="medium">
          {label}
        </Text>
      )}

      <Text size="1" color="gray" mb="2">
        컴포넌트 내부 렌더 카운트: {rendercount}
      </Text>

      <Flex align="center" gap="3">
        <Button
          size="2"
          variant="soft"
          onClick={decrement}
          disabled={count <= min}
        >
          -
        </Button>

        <Text
          size="4"
          weight="bold"
          style={{ minWidth: "3rem", textAlign: "center" }}
        >
          {count}
        </Text>

        <Button
          size="2"
          variant="soft"
          onClick={increment}
          disabled={count >= max}
        >
          +
        </Button>

        <Button size="1" variant="outline" color="gray" onClick={reset}>
          초기화
        </Button>
      </Flex>

      {(min !== -Infinity || max !== Infinity) && (
        <Text size="1" color="gray">
          범위: {min === -Infinity ? "∞" : min} ~ {max === Infinity ? "∞" : max}
        </Text>
      )}
    </Flex>
  );
}
