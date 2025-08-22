import { useEventListener } from "@heart-re-up/react-lib/hooks/useEventListener";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoCustom() {
  const [customEventData, setCustomEventData] = useState<any>(null);
  const [eventCount, setEventCount] = useState(0);
  const [lastEventTime, setLastEventTime] = useState<string>("");
  const [customEventName, setCustomEventName] = useState("myCustomEvent");
  const [customEventPayload, setCustomEventPayload] = useState(
    "Hello from custom event!"
  );

  // 커스텀 이벤트 리스너 등록
  useEventListener(customEventName, (event) => {
    const customEvent = event as CustomEvent;
    setCustomEventData(customEvent.detail);
    setEventCount((prev) => prev + 1);
    setLastEventTime(new Date().toLocaleTimeString("ko-KR"));
  });

  // 다양한 커스텀 이벤트들 등록
  useEventListener("userAction", (event) => {
    const customEvent = event as CustomEvent;
    setCustomEventData({
      type: "userAction",
      ...customEvent.detail,
    });
    setEventCount((prev) => prev + 1);
    setLastEventTime(new Date().toLocaleTimeString("ko-KR"));
  });

  useEventListener("dataUpdate", (event) => {
    const customEvent = event as CustomEvent;
    setCustomEventData({
      type: "dataUpdate",
      ...customEvent.detail,
    });
    setEventCount((prev) => prev + 1);
    setLastEventTime(new Date().toLocaleTimeString("ko-KR"));
  });

  useEventListener("notificationEvent", (event) => {
    const customEvent = event as CustomEvent;
    setCustomEventData({
      type: "notification",
      ...customEvent.detail,
    });
    setEventCount((prev) => prev + 1);
    setLastEventTime(new Date().toLocaleTimeString("ko-KR"));
  });

  // 커스텀 이벤트 발생 함수들
  const dispatchCustomEvent = () => {
    const event = new CustomEvent(customEventName, {
      detail: {
        message: customEventPayload,
        timestamp: new Date().toISOString(),
        source: "manual-dispatch",
      },
    });
    window.dispatchEvent(event);
  };

  const dispatchUserAction = () => {
    const event = new CustomEvent("userAction", {
      detail: {
        action: "button-click",
        userId: Math.floor(Math.random() * 1000),
        metadata: {
          browser: navigator.userAgent.split(" ")[0],
          timestamp: Date.now(),
        },
      },
    });
    window.dispatchEvent(event);
  };

  const dispatchDataUpdate = () => {
    const event = new CustomEvent("dataUpdate", {
      detail: {
        entityType: "user",
        entityId: Math.floor(Math.random() * 100),
        changes: {
          status: Math.random() > 0.5 ? "active" : "inactive",
          lastSeen: new Date().toISOString(),
        },
        version: "1.2.3",
      },
    });
    window.dispatchEvent(event);
  };

  const dispatchNotification = () => {
    const notifications = [
      { level: "info", message: "새로운 업데이트가 있습니다." },
      { level: "warning", message: "시스템 점검이 예정되어 있습니다." },
      { level: "success", message: "작업이 성공적으로 완료되었습니다." },
      { level: "error", message: "오류가 발생했습니다. 다시 시도해주세요." },
    ];

    const notification =
      notifications[Math.floor(Math.random() * notifications.length)];

    const event = new CustomEvent("notificationEvent", {
      detail: {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      },
    });
    window.dispatchEvent(event);
  };

  const clearEventData = () => {
    setCustomEventData(null);
    setEventCount(0);
    setLastEventTime("");
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            커스텀 이벤트 리스너
          </Text>
          <Button onClick={clearEventData} variant="soft" size="1">
            초기화
          </Button>
        </Flex>

        <Text size="2" color="gray">
          {`useEventListener('customEventName', handler); // 커스텀 이벤트 처리`}
        </Text>

        <Flex direction="column" gap="4">
          {/* 이벤트 상태 표시 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                📊 이벤트 상태
              </Text>
              <Flex gap="2" wrap="wrap">
                <Badge color="blue" variant="soft">
                  총 이벤트: {eventCount}개
                </Badge>
                <Badge color="green" variant="soft">
                  마지막 이벤트: {lastEventTime || "없음"}
                </Badge>
              </Flex>

              {customEventData && (
                <Card
                  style={{ backgroundColor: "var(--blue-2)", padding: "12px" }}
                >
                  <Text size="2" weight="medium" color="blue">
                    📨 마지막 이벤트 데이터:
                  </Text>
                  <pre
                    style={{
                      fontSize: "12px",
                      margin: "8px 0 0 0",
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {JSON.stringify(customEventData, null, 2)}
                  </pre>
                </Card>
              )}
            </Flex>
          </Card>

          {/* 커스텀 이벤트 생성 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🛠️ 커스텀 이벤트 생성
              </Text>

              <Flex direction="column" gap="2">
                <Text size="2">이벤트 이름:</Text>
                <TextField.Root
                  value={customEventName}
                  onChange={(e) => setCustomEventName(e.target.value)}
                  placeholder="커스텀 이벤트 이름"
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2">이벤트 데이터:</Text>
                <TextField.Root
                  value={customEventPayload}
                  onChange={(e) => setCustomEventPayload(e.target.value)}
                  placeholder="이벤트와 함께 전달할 데이터"
                />
              </Flex>

              <Button onClick={dispatchCustomEvent}>
                🚀 커스텀 이벤트 발생
              </Button>
            </Flex>
          </Card>

          {/* 미리 정의된 이벤트들 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎯 미리 정의된 이벤트들
              </Text>

              <Flex gap="2" wrap="wrap">
                <Button onClick={dispatchUserAction} variant="soft" size="2">
                  👤 사용자 액션
                </Button>
                <Button onClick={dispatchDataUpdate} variant="soft" size="2">
                  📊 데이터 업데이트
                </Button>
                <Button onClick={dispatchNotification} variant="soft" size="2">
                  🔔 알림 이벤트
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 커스텀 이벤트 활용법:
            </Text>
            <Text size="2" color="gray">
              • 컴포넌트 간 통신: 부모-자식 관계가 아닌 컴포넌트들 간에 데이터
              전달
            </Text>
            <Text size="2" color="gray">
              • 글로벌 상태 변경 알림: 로그인, 테마 변경, 언어 변경 등
            </Text>
            <Text size="2" color="gray">
              • 비즈니스 로직 이벤트: 주문 완료, 결제 성공, 에러 발생 등
            </Text>
            <Text size="2" color="gray">
              • 써드파티 라이브러리와의 연동: 외부 라이브러리의 이벤트 처리
            </Text>
            <Text size="2" color="gray">
              • 위의 버튼들을 클릭해서 다양한 커스텀 이벤트를 테스트해보세요
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}
