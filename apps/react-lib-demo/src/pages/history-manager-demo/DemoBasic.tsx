import { Card, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { ModalController } from "./components/ModalController";

export function DemoBasic() {
  const [navigationLog, setNavigationLog] = useState<string[]>([]);

  const handleNavigationLog = (message: string) => {
    setNavigationLog((prev) => [message, ...prev.slice(0, 9)]);
  };

  const clearLog = () => {
    setNavigationLog([]);
  };

  return (
    <Flex direction="column" gap="4">
      <Text size="3" weight="medium">
        기본 사용법 - 3개 모달 히스토리 관리 (onEnter/onExit)
      </Text>

      {/* 모달 컨트롤러 */}
      <ModalController onNavigationLog={handleNavigationLog} />

      {/* 사용 팁 */}
      <Card variant="surface">
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            💡 사용 팁
          </Text>
          <Text size="2" color="gray">
            • 각 모달은 독립적인 affinity를 가집니다 (modal-1, modal-2, modal-3)
          </Text>
          <Text size="2" color="gray">
            • onEnter: 모달이 히스토리에 진입할 때 호출됩니다
          </Text>
          <Text size="2" color="gray">
            • onExit: 모달이 히스토리에서 나갈 때 호출됩니다
          </Text>
          <Text size="2" color="gray">
            • 브라우저 뒤로가기로 가장 최근 모달을 닫을 수 있습니다
          </Text>
          <Text size="2" color="gray">
            • seal을 하면 모든 모달의 히스토리가 봉인됩니다
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
