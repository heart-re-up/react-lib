import { useOpenWindow } from "@heart-re-up/react-lib/hooks/useOpenWindow";
import { WindowFeatures } from "@heart-re-up/react-lib/hooks/useOpenWindow/useOpenWindow.type";
import {
  Badge,
  Button,
  Card,
  Flex,
  Select,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

interface DemoScenario {
  name: string;
  description: string;
  url: string;
  features: WindowFeatures;
  dangerousMode?: boolean;
}

export default function DemoFeatures() {
  const [selectedScenario, setSelectedScenario] =
    useState<string>("social-share");
  const [customUrl, setCustomUrl] = useState("");
  const [testResults, setTestResults] = useState<string[]>([]);

  const scenarios: Record<string, DemoScenario> = {
    "social-share": {
      name: "소셜 미디어 공유",
      description: "소셜 미디어 공유를 위한 작은 팝업 창",
      url: "https://twitter.com/intent/tweet?text=Hello%20World",
      features: {
        popup: true,
        width: 550,
        height: 420,
        left: 200,
        top: 200,
        noopener: true,
        noreferrer: true,
        scrollbars: true,
        resizable: false,
      },
    },
    "oauth-login": {
      name: "OAuth 로그인",
      description: "OAuth 인증을 위한 중간 크기 팝업",
      url: "https://accounts.google.com/oauth/authorize",
      features: {
        popup: true,
        width: 500,
        height: 600,
        left: 150,
        top: 100,
        noopener: false,
        noreferrer: false,
        scrollbars: true,
        resizable: true,
        toolbar: false,
        menubar: false,
        status: false,
      },
      dangerousMode: true,
    },
    "help-documentation": {
      name: "도움말/문서",
      description: "도움말이나 문서를 위한 새 탭",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/open",
      features: {
        popup: false,
        noopener: true,
        noreferrer: true,
      },
    },
    "print-preview": {
      name: "인쇄 미리보기",
      description: "인쇄를 위한 최소한의 팝업",
      url: "about:blank",
      features: {
        popup: true,
        width: 800,
        height: 600,
        toolbar: false,
        menubar: false,
        scrollbars: true,
        resizable: true,
        status: false,
        noopener: true,
      },
    },
    "image-gallery": {
      name: "이미지 갤러리",
      description: "이미지 뷰어를 위한 큰 팝업",
      url: "https://picsum.photos/800/600",
      features: {
        popup: true,
        width: 900,
        height: 700,
        left: 100,
        top: 50,
        scrollbars: false,
        resizable: true,
        toolbar: false,
        menubar: false,
        status: false,
        noopener: true,
        noreferrer: true,
      },
    },
    "external-tool": {
      name: "외부 도구",
      description: "외부 도구나 서비스를 위한 전체 크기 창",
      url: "https://codepen.io/pen/",
      features: {
        popup: false,
        width: window.screen.availWidth * 0.8,
        height: window.screen.availHeight * 0.8,
        left: window.screen.availWidth * 0.1,
        top: window.screen.availHeight * 0.1,
        noopener: true,
        noreferrer: true,
        scrollbars: true,
        resizable: true,
      },
    },
  };

  const currentScenario = scenarios[selectedScenario];
  const finalUrl = customUrl || currentScenario.url;

  const { open, close } = useOpenWindow({
    url: finalUrl,
    target: "_blank",
    windowFeatures: currentScenario.features,
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN:
      currentScenario.dangerousMode || false,
  });

  const handleOpenWindow = () => {
    try {
      open();
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      setTestResults((prev) => [
        `${timestamp}: [${currentScenario.name}] 창 열기 성공`,
        `URL: ${finalUrl}`,
        `Features: ${Object.entries(currentScenario.features)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${value}`)
          .join(", ")}`,
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      setTestResults((prev) => [
        `${timestamp}: [${currentScenario.name}] 오류 - ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
        ...prev.slice(0, 9),
      ]);
    }
  };

  const clearResults = () => setTestResults([]);

  const getFeatureDescription = (features: WindowFeatures) => {
    const descriptions: string[] = [];

    if (features.popup) descriptions.push("팝업 창");
    if (features.width && features.height) {
      descriptions.push(`크기: ${features.width}×${features.height}`);
    }
    if (features.left !== undefined && features.top !== undefined) {
      descriptions.push(`위치: (${features.left}, ${features.top})`);
    }
    if (features.noopener) descriptions.push("보안: noopener");
    if (features.noreferrer) descriptions.push("보안: noreferrer");
    if (features.resizable === false) descriptions.push("크기 조절 불가");
    if (features.scrollbars === false) descriptions.push("스크롤바 없음");

    return descriptions.join(", ") || "기본 설정";
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          실제 사용 사례별 창 열기
        </Text>

        <Text size="2" color="gray">
          다양한 실제 사용 사례에 맞는 WindowFeatures 설정을 테스트해볼 수
          있습니다.
        </Text>

        <Flex direction="column" gap="4">
          {/* 시나리오 선택 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎯 사용 사례 선택:
              </Text>
              <Select.Root
                value={selectedScenario}
                onValueChange={setSelectedScenario}
              >
                <Select.Trigger style={{ width: "100%" }} />
                <Select.Content>
                  {Object.entries(scenarios).map(([key, scenario]) => (
                    <Select.Item key={key} value={key}>
                      {scenario.name} - {scenario.description}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Card>

          {/* 선택된 시나리오 정보 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                📋 선택된 시나리오: {currentScenario.name}
              </Text>
              <Text size="2" color="gray">
                {currentScenario.description}
              </Text>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  기본 URL:
                </Text>
                <div
                  style={{
                    backgroundColor: "var(--gray-3)",
                    padding: "8px",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    wordBreak: "break-all",
                  }}
                >
                  {currentScenario.url}
                </div>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  커스텀 URL (선택사항):
                </Text>
                <TextField.Root
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="기본 URL 대신 사용할 URL을 입력하세요..."
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  WindowFeatures 설정:
                </Text>
                <Badge color="blue" variant="soft">
                  {getFeatureDescription(currentScenario.features)}
                </Badge>
              </Flex>

              {currentScenario.dangerousMode && (
                <Card
                  variant="surface"
                  style={{ backgroundColor: "var(--red-2)" }}
                >
                  <Text size="2" color="red">
                    ⚠️ 이 시나리오는 보안상 위험한 설정을 포함합니다 (noopener:
                    false). OAuth 로그인 등 특별한 경우에만 사용하세요.
                  </Text>
                </Card>
              )}
            </Flex>
          </Card>

          {/* 상세 기능 설정 표시 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                ⚙️ 상세 기능 설정:
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                {Object.entries(currentScenario.features).map(
                  ([key, value]) => (
                    <Flex key={key} align="center" gap="2">
                      <Switch checked={Boolean(value)} disabled />
                      <Text size="2">
                        {key}: {String(value)}
                      </Text>
                    </Flex>
                  )
                )}
              </div>
            </Flex>
          </Card>

          {/* 테스트 버튼 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🚀 테스트 실행:
              </Text>
              <Flex gap="2" align="center" wrap="wrap">
                <Button onClick={handleOpenWindow} size="2">
                  {currentScenario.name} 창 열기
                </Button>
                <Button onClick={close} variant="soft" size="2">
                  창 닫기
                </Button>
                {testResults.length > 0 && (
                  <Button onClick={clearResults} variant="ghost" size="2">
                    결과 지우기
                  </Button>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* 테스트 결과 */}
          {testResults.length > 0 && (
            <Card variant="surface">
              <Flex direction="column" gap="3">
                <Text size="2" weight="medium">
                  📊 테스트 결과 ({testResults.length}개):
                </Text>
                <div
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    backgroundColor: "var(--gray-2)",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "4px",
                        color: result.includes("오류")
                          ? "var(--red-11)"
                          : "var(--gray-11)",
                        borderLeft:
                          index === 0 ? "3px solid var(--green-9)" : "none",
                        paddingLeft: index === 0 ? "8px" : "0",
                      }}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </Flex>
            </Card>
          )}

          {/* 사용 사례별 가이드 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                💡 사용 사례별 가이드:
              </Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray">
                  • <strong>소셜 미디어 공유:</strong> 작은 팝업, 크기 조절
                  불가, 보안 설정 활성화
                </Text>
                <Text size="2" color="gray">
                  • <strong>OAuth 로그인:</strong> 중간 크기 팝업, 부모 창과
                  통신 필요시 noopener: false
                </Text>
                <Text size="2" color="gray">
                  • <strong>도움말/문서:</strong> 새 탭으로 열기, 보안 설정
                  활성화
                </Text>
                <Text size="2" color="gray">
                  • <strong>인쇄 미리보기:</strong> 최소한의 UI, 스크롤 가능
                </Text>
                <Text size="2" color="gray">
                  • <strong>이미지 갤러리:</strong> 큰 팝업, 스크롤바 없음, 크기
                  조절 가능
                </Text>
                <Text size="2" color="gray">
                  • <strong>외부 도구:</strong> 큰 창 또는 새 탭, 모든 기능
                  활성화
                </Text>
              </Flex>
            </Flex>
          </Card>

          {/* 브라우저별 차이점 */}
          <Card
            variant="surface"
            style={{ backgroundColor: "var(--yellow-2)" }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="orange">
                🌐 브라우저별 차이점:
              </Text>
              <Text size="2" color="orange">
                • Chrome: 팝업 차단기가 활성화되어 있으면 사용자 상호작용 없이는
                팝업이 열리지 않음
              </Text>
              <Text size="2" color="orange">
                • Firefox: 일부 WindowFeatures가 무시될 수 있음
              </Text>
              <Text size="2" color="orange">
                • Safari: 팝업 차단 설정이 엄격함
              </Text>
              <Text size="2" color="orange">
                • 모바일 브라우저: 대부분의 WindowFeatures가 무시됨
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
