import {
  findTargetWindow,
  WindowTarget,
} from "@heart-re-up/react-lib/libs/window";
import {
  Badge,
  Button,
  Card,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

export default function DemoBasic() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<WindowTarget>("parent");
  const [testMessage, setTestMessage] = useState("Hello from parent!");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // iframe 로드 상태 확인
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeLoaded(true);
      addResult("✅ iframe이 로드되었습니다.");
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  // 메시지 수신 리스너
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow) {
        addResult(`📨 iframe에서 메시지 수신: ${JSON.stringify(event.data)}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 결과 로그 추가
  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("ko-KR");
    setTestResults((prev) => [
      `[${timestamp}] ${message}`,
      ...prev.slice(0, 9),
    ]);
  };

  // findTargetWindow 테스트
  const testFindTargetWindow = () => {
    try {
      addResult(`🔍 findTargetWindow("${selectedTarget}") 테스트 시작...`);

      // frame: 형식인지 확인
      if (selectedTarget.toString().startsWith("frame:")) {
        const frameName = selectedTarget.toString().slice(6);
        addResult(`🎯 프레임 이름으로 검색: "${frameName}"`);

        // window.frames에서 직접 확인
        const frameExists = frameName in window.frames;
        addResult(
          `📋 window.frames["${frameName}"] 존재 여부: ${frameExists ? "✅" : "❌"}`
        );
      }

      const targetWindow = findTargetWindow(selectedTarget);

      if (targetWindow) {
        addResult(`✅ 타겟 윈도우를 찾았습니다: ${selectedTarget}`);

        // 윈도우 정보 추가 표시
        try {
          addResult(
            `📍 윈도우 타입: ${targetWindow === window ? "현재 윈도우" : "다른 윈도우"}`
          );
          addResult(
            `📍 윈도우 이름: ${(targetWindow as any).name || "이름 없음"}`
          );
        } catch (e) {
          addResult(`📍 윈도우 정보 접근 제한됨 (보안 정책)`);
        }

        // 메시지 전송 테스트
        const message = {
          type: "test-message",
          source: "parent",
          target: selectedTarget,
          data: testMessage,
          timestamp: new Date().toISOString(),
        };

        targetWindow.postMessage(message, "*");
        addResult(`📤 메시지 전송 완료: "${testMessage}"`);
      } else {
        addResult(`❌ 타겟 윈도우를 찾을 수 없습니다: ${selectedTarget}`);

        // frame: 형식일 때 추가 디버깅 정보
        if (selectedTarget.toString().startsWith("frame:")) {
          addResult(`🔍 사용 가능한 프레임 목록:`);
          try {
            const frameNames = Object.keys(window.frames);
            if (frameNames.length > 0) {
              frameNames.forEach((name) => {
                addResult(`  - ${name}`);
              });
            } else {
              addResult(`  (사용 가능한 프레임 없음)`);
            }
          } catch (e) {
            addResult(`  (프레임 목록 접근 불가)`);
          }
        }
      }
    } catch (error) {
      addResult(
        `❌ 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    }
  };

  // iframe에 직접 메시지 전송
  const sendDirectMessage = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      addResult("❌ iframe이 로드되지 않았습니다.");
      return;
    }

    const message = {
      type: "direct-message",
      data: testMessage,
      timestamp: new Date().toISOString(),
    };

    iframe.contentWindow.postMessage(message, "*");
    addResult(`📤 iframe에 직접 메시지 전송: "${testMessage}"`);
  };

  // 로그 지우기
  const clearResults = () => setTestResults([]);

  const targetOptions: {
    value: WindowTarget;
    label: string;
    description: string;
  }[] = [
    { value: "self", label: "self", description: "현재 윈도우" },
    { value: "parent", label: "parent", description: "부모 윈도우" },
    { value: "top", label: "top", description: "최상위 윈도우" },
    { value: "opener", label: "opener", description: "창을 연 윈도우" },
    {
      value: "frame:test-frame",
      label: "frame:test-frame",
      description: "특정 프레임 (name='test-frame')",
    },
    {
      value: "frame:sample-frame",
      label: "frame:sample-frame",
      description: "특정 프레임 (name='sample-frame')",
    },
  ];

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          🖼️ Iframe & findTargetWindow 테스트
        </Text>

        <Text size="2" color="gray">
          WindowTarget.ts의 findTargetWindow 함수를 사용하여 다양한 윈도우
          타겟을 찾고 메시지를 전송해보세요.
        </Text>

        {/* 컨트롤 패널 */}
        <Card variant="surface">
          <Flex direction="column" gap="3">
            <Text size="2" weight="medium">
              🎯 테스트 설정
            </Text>

            <Flex gap="3" align="center" wrap="wrap">
              <Flex direction="column" gap="1">
                <Text size="2">타겟 윈도우:</Text>
                <Select.Root
                  value={selectedTarget.toString()}
                  onValueChange={(value) =>
                    setSelectedTarget(value as WindowTarget)
                  }
                >
                  <Select.Trigger style={{ width: "200px" }} />
                  <Select.Content>
                    {targetOptions.map((option) => (
                      <Select.Item
                        key={option.value.toString()}
                        value={option.value.toString()}
                      >
                        {option.label} - {option.description}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="1" style={{ flex: 1 }}>
                <Text size="2">테스트 메시지:</Text>
                <TextField.Root
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="전송할 메시지를 입력하세요..."
                />
              </Flex>
            </Flex>

            <Flex gap="2" wrap="wrap">
              <Button onClick={testFindTargetWindow} disabled={!iframeLoaded}>
                🔍 findTargetWindow 테스트
              </Button>
              <Button
                onClick={sendDirectMessage}
                disabled={!iframeLoaded}
                variant="soft"
              >
                📤 iframe 직접 전송
              </Button>
              <Button onClick={clearResults} variant="outline" size="2">
                로그 지우기
              </Button>
            </Flex>
          </Flex>
        </Card>

        <Flex gap="4" style={{ height: "500px" }}>
          {/* Iframe */}
          <Card style={{ flex: 1 }}>
            <Flex direction="column" gap="3" style={{ height: "100%" }}>
              <Flex justify="between" align="center">
                <Text size="3" weight="bold">
                  테스트 Iframe
                </Text>
                <Badge color={iframeLoaded ? "green" : "orange"}>
                  {iframeLoaded ? "로드됨" : "로딩중"}
                </Badge>
              </Flex>

              <iframe
                ref={iframeRef}
                src="/src/iframe/index.html"
                style={{
                  width: "100%",
                  height: "400px",
                  border: "2px solid var(--gray-6)",
                  borderRadius: "8px",
                }}
                title="Test Iframe"
                name="test-frame"
              />
            </Flex>
          </Card>

          {/* 테스트 결과 로그 */}
          <Card style={{ flex: 1 }}>
            <Flex direction="column" gap="3" style={{ height: "100%" }}>
              <Flex justify="between" align="center">
                <Text size="3" weight="bold">
                  테스트 결과 ({testResults.length})
                </Text>
              </Flex>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  backgroundColor: "var(--gray-2)",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                {testResults.length === 0 ? (
                  <Text size="2" color="gray">
                    테스트 결과가 여기에 표시됩니다.
                  </Text>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "8px",
                        padding: "8px",
                        backgroundColor: result.includes("❌")
                          ? "var(--red-2)"
                          : result.includes("✅")
                            ? "var(--green-2)"
                            : "var(--blue-2)",
                        borderRadius: "4px",
                        borderLeft: `3px solid ${
                          result.includes("❌")
                            ? "var(--red-9)"
                            : result.includes("✅")
                              ? "var(--green-9)"
                              : "var(--blue-9)"
                        }`,
                      }}
                    >
                      {result}
                    </div>
                  ))
                )}
              </div>
            </Flex>
          </Card>
        </Flex>

        {/* 사용 가이드 */}
        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 사용 방법:
            </Text>
            <Text size="2" color="gray">
              1. 타겟 윈도우를 선택하세요 (self, parent, top, opener,
              frame:NAME)
            </Text>
            <Text size="2" color="gray">
              2. 전송할 메시지를 입력하세요
            </Text>
            <Text size="2" color="gray">
              3. "findTargetWindow 테스트" 버튼을 클릭하여 WindowTarget 기능을
              테스트하세요
            </Text>
            <Text size="2" color="gray">
              4. 오른쪽 로그에서 결과를 확인하세요
            </Text>
          </Flex>

          <Card
            variant="surface"
            style={{ backgroundColor: "var(--blue-2)", marginTop: "12px" }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="blue">
                🎯 WindowTarget 타입 설명:
              </Text>
              <Text size="2" color="blue">
                • <strong>"self"</strong>: 현재 윈도우
              </Text>
              <Text size="2" color="blue">
                • <strong>"parent"</strong>: 부모 윈도우 (iframe의 부모)
              </Text>
              <Text size="2" color="blue">
                • <strong>"top"</strong>: 최상위 윈도우
              </Text>
              <Text size="2" color="blue">
                • <strong>"opener"</strong>: 현재 창을 연 윈도우
              </Text>
              <Text size="2" color="blue">
                • <strong>"frame:NAME"</strong>: 특정 이름의 프레임 (예:
                "frame:test-frame")
              </Text>
            </Flex>
          </Card>
        </Card>
      </Flex>
    </Card>
  );
}
