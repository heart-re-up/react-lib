import { useRenderCount } from "@heart-re-up/react-lib/hooks/useRenderCount";
import { Badge, Box, Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { useState } from "react";
import { DemoCounter } from "./components/DemoCounter";
import { DemoInput } from "./components/DemoInput";

export function DemoBasic() {
  const renderCount = useRenderCount();

  // 제어 컴포넌트용 상태들 (부모가 관리)
  const [controlledInputValue, setControlledInputValue] =
    useState("제어된 입력");
  const [controlledCounterValue, setControlledCounterValue] = useState(5);

  const resetAll = () => {
    setControlledInputValue("");
    setControlledCounterValue(0);
  };

  return (
    <Box>
      <Flex direction="column" gap="4" mb="4">
        <Text size="3" weight="medium">
          제어 vs 비제어 컴포넌트 렌더링 비교
        </Text>
        <Flex align="center" gap="2">
          <Badge color="red" variant="soft">
            전체 컴포넌트 렌더링 카운트: {renderCount}회
          </Badge>
          <Button size="1" variant="soft" color="gray" onClick={resetAll}>
            제어 컴포넌트 초기화
          </Button>
        </Flex>
      </Flex>

      <Grid columns="2" gap="4">
        {/* 제어 컴포넌트 섹션 */}
        <Card>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="2">
              <Badge color="green" variant="soft">
                제어 컴포넌트
              </Badge>
              <Text size="2" color="gray">
                부모가 상태 관리 → 부모 리렌더링 발생
              </Text>
            </Flex>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" mb="2" as="div">
                  제어 Input
                </Text>
                <DemoInput
                  placeholder="입력하면 부모가 리렌더링됩니다"
                  value={controlledInputValue}
                  onChange={setControlledInputValue}
                />
                <Text size="1" color="gray" mt="1" as="div">
                  현재 값: "{controlledInputValue}"
                </Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="2" as="div">
                  제어 Counter
                </Text>
                <DemoCounter
                  value={controlledCounterValue}
                  onChange={setControlledCounterValue}
                  min={0}
                  max={10}
                />
                <Text size="1" color="gray" mt="1" as="div">
                  현재 값: {controlledCounterValue}
                </Text>
              </Box>
            </Flex>

            <Box p="2" className="bg-green-50 rounded">
              <Text size="1" color="green">
                💡 입력할 때마다 부모 컴포넌트가 리렌더링되어 위의 렌더링
                카운트가 증가합니다.
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* 비제어 컴포넌트 섹션 */}
        <Card>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="2">
              <Badge color="blue" variant="soft">
                비제어 컴포넌트
              </Badge>
              <Text size="2" color="gray">
                컴포넌트가 자체 상태 관리 → 부모 리렌더링 없음
              </Text>
            </Flex>

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" mb="2" as="div">
                  비제어 Input
                </Text>
                <DemoInput
                  placeholder="입력해도 부모는 리렌더링되지 않습니다"
                  defaultValue="비제어 기본값"
                />
                <Text size="1" color="gray" mt="1" as="div">
                  부모는 값을 모릅니다 (내부에서만 관리)
                </Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="2" as="div">
                  비제어 Counter
                </Text>
                <DemoCounter defaultValue={3} min={0} max={10} />
                <Text size="1" color="gray" mt="1" as="div">
                  부모는 값을 모릅니다 (내부에서만 관리)
                </Text>
              </Box>
            </Flex>

            <Box p="2" className="bg-blue-50 rounded">
              <Text size="1" color="blue">
                💡 입력해도 부모 컴포넌트는 리렌더링되지 않아 위의 렌더링
                카운트가 증가하지 않습니다.
              </Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* 설명 */}
      <Card mt="4">
        <Flex direction="column" gap="3">
          <Text size="2" weight="medium">
            🎯 렌더링 성능 비교 실험
          </Text>
          <Flex direction="column" gap="2">
            <Text size="2">
              1.{" "}
              <Text weight="medium" color="green">
                제어 컴포넌트
              </Text>
              에 입력하면 부모 컴포넌트의 렌더링 카운트가 증가합니다.
            </Text>
            <Text size="2">
              2.{" "}
              <Text weight="medium" color="blue">
                비제어 컴포넌트
              </Text>
              에 입력해도 부모 컴포넌트는 리렌더링되지 않습니다.
            </Text>
            <Text size="2">
              3. <Text weight="medium">useControlledState</Text>를 사용하면
              동일한 컴포넌트로 두 패턴을 모두 지원할 수 있습니다.
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
