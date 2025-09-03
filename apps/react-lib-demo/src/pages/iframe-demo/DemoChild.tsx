import { useRuntimeContextRequired } from "@heart-re-up/react-lib/hooks/useWindowContext";
import { useWindowEventMessage } from "@heart-re-up/react-lib/hooks/useWindowEventMessage";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";

interface MessageData {
  type: string;
  content: string;
  timestamp: string;
}

export default function DemoChild() {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [outgoingMessage, setOutgoingMessage] = useState(
    "Hello from iframe child!"
  );
  const [isConnected, setIsConnected] = useState(false);

  // iframe 또는 open 에 의해서 열린 경우에만 실행 가능하게 함.
  useRuntimeContextRequired({
    requiredContexts: ["iframe", "child"],
    throwOnViolation: true,
    onViolation(error) {
      console.error(error);
    },
  });

  // 로그 추가 함수
  const addLog = useCallback(
    (message: string, type: "info" | "success" | "error" = "info") => {
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "📝";
      setMessageHistory((prev) => [
        `[${timestamp}] ${emoji} ${message}`,
        ...prev.slice(0, 19), // 최대 20개 메시지 유지
      ]);
    },
    []
  );

  // 메시지 수신 핸들러
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      addLog(
        `부모로부터 메시지 수신: ${JSON.stringify(event.data)}`,
        "success"
      );

      // 연결 확인 메시지 처리
      if (typeof event.data === "object" && event.data !== null) {
        const data = event.data as MessageData;
        if (data.type === "connection-check") {
          setIsConnected(true);
          addLog("부모와 연결이 확인되었습니다!", "success");
        }
      }
    },
    [addLog]
  );

  // useWindowEventMessage 훅 사용
  const { postMessage } = useWindowEventMessage({
    targetWindow: window.parent, // 부모 윈도우로 메시지 전송
    targetOrigin: "http://localhost:3000", // 부모의 origin
    trustedOrigins: ["http://localhost:3000"], // 같은 origin에서만 메시지 수신
    onMessage: (e) => {
      console.log("부모로부터 메시지 수신:", e);
      handleMessage(e);
    },
    onError: (error) => {
      console.error("메시지 통신 오류:", error);
    },
  });

  // 메시지 전송 함수
  const sendMessage = useCallback(() => {
    if (!outgoingMessage.trim()) {
      addLog("메시지가 비어있습니다!", "error");
      return;
    }

    const messageData: MessageData = {
      type: "child-message",
      content: outgoingMessage,
      timestamp: new Date().toISOString(),
    };

    postMessage(messageData);
    addLog(`부모에게 메시지 전송: "${outgoingMessage}"`, "info");
    setOutgoingMessage(""); // 전송 후 입력 필드 초기화
  }, [outgoingMessage, postMessage, addLog]);

  // Enter 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.nativeEvent.isComposing) {
        // 한글 조합 중인 경우 무시함
        return;
      }
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  // 로그 지우기
  const clearLogs = useCallback(() => {
    setMessageHistory([]);
    addLog("로그가 초기화되었습니다.", "info");
  }, [addLog]);

  // 연결 테스트
  const testConnection = useCallback(() => {
    const testMessage: MessageData = {
      type: "connection-test",
      content: "연결 테스트 메시지입니다.",
      timestamp: new Date().toISOString(),
    };

    postMessage(testMessage);
    addLog("연결 테스트 메시지 전송", "info");
  }, [postMessage, addLog]);

  useEffect(() => {
    const initMessage: MessageData = {
      type: "child-ready",
      content: "Iframe child가 준비되었습니다!",
      timestamp: new Date().toISOString(),
    };
    postMessage(initMessage);
    addLog("부모에게 준비 완료 메시지 전송", "info");
  }, [addLog, postMessage]);

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            🖼️ Iframe Child - 자식 페이지
          </Text>
          <Badge color={isConnected ? "green" : "orange"}>
            {isConnected ? "연결됨" : "연결 대기중"}
          </Badge>
        </Flex>

        <Text size="2" weight="bold">
          {window.location.href}
        </Text>

        <Text size="2" color="gray">
          이 페이지는 부모 창의 iframe에서 실행되며, useWindowEventMessage를
          통해 부모와 통신합니다.
        </Text>

        {/* 컨트롤 패널 */}
        <Card variant="surface">
          <Flex direction="column" gap="3">
            <Text size="2" weight="medium">
              📤 메시지 전송
            </Text>

            <Flex gap="3" align="end">
              <Flex direction="column" gap="1" style={{ flex: 1 }}>
                <Text size="2">부모에게 보낼 메시지:</Text>
                <TextField.Root
                  value={outgoingMessage}
                  onChange={(e) => setOutgoingMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                />
              </Flex>
              <Button onClick={sendMessage} disabled={!outgoingMessage.trim()}>
                전송
              </Button>
            </Flex>

            <Flex gap="2" wrap="wrap">
              <Button onClick={testConnection} variant="soft">
                🔗 연결 테스트
              </Button>
              <Button onClick={clearLogs} variant="outline" size="2">
                로그 지우기
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* 메시지 로그 */}
        <Card>
          <Flex direction="column" gap="3">
            <Text size="3" weight="bold">
              📋 통신 로그 ({messageHistory.length})
            </Text>

            <div
              style={{
                height: "300px",
                overflowY: "auto",
                backgroundColor: "var(--gray-2)",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            >
              {messageHistory.length === 0 ? (
                <Text size="2" color="gray">
                  통신 로그가 여기에 표시됩니다.
                </Text>
              ) : (
                messageHistory.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      padding: "8px",
                      backgroundColor: log.includes("❌")
                        ? "var(--red-2)"
                        : log.includes("✅")
                          ? "var(--green-2)"
                          : "var(--blue-2)",
                      borderRadius: "4px",
                      borderLeft: `3px solid ${
                        log.includes("❌")
                          ? "var(--red-9)"
                          : log.includes("✅")
                            ? "var(--green-9)"
                            : "var(--blue-9)"
                      }`,
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </Flex>
        </Card>

        {/* 사용 가이드 */}
        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 사용 방법:
            </Text>
            <Text size="2" color="gray">
              1. 이 페이지는 부모 창의 iframe에서 실행됩니다
            </Text>
            <Text size="2" color="gray">
              2. 자동으로 부모에게 준비 완료 메시지를 전송합니다
            </Text>
            <Text size="2" color="gray">
              3. 메시지를 입력하고 전송 버튼을 클릭하여 부모와 통신하세요
            </Text>
            <Text size="2" color="gray">
              4. 부모로부터 받은 메시지는 로그에 자동으로 표시됩니다
            </Text>
          </Flex>

          <Card
            variant="surface"
            style={{ backgroundColor: "var(--green-2)", marginTop: "12px" }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="green">
                🎯 기술적 세부사항:
              </Text>
              <Text size="2" color="green">
                • <strong>targetWindow</strong>: "parent" (부모 윈도우)
              </Text>
              <Text size="2" color="green">
                • <strong>targetOrigin</strong>: 현재 origin과 동일
              </Text>
              <Text size="2" color="green">
                • <strong>trustedOrigins</strong>: 현재 origin만 신뢰
              </Text>
              <Text size="2" color="green">
                • <strong>통신 방식</strong>: useWindowEventMessage 훅 사용
              </Text>
            </Flex>
          </Card>
        </Card>
      </Flex>
    </Card>
  );
}
