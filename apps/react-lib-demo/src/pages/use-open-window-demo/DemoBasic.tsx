import {
  useOpenWindow,
  WindowFeatures,
} from "@heart-re-up/react-lib/hooks/useOpenWindow";
import {
  Badge,
  Button,
  Card,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import WindowFeatureSettings from "./components/WindowFeatureSettings";
import { isEqual } from "lodash-es";
import { Link } from "react-router";

export default function DemoBasic() {
  const [url, setUrl] = useState("https://react.dev");
  const [target, setTarget] = useState("_blank");
  const [openedWindows, setOpenedWindows] = useState<string[]>([]);
  const [windowFeatures, setWindowFeatures] = useState<WindowFeatures>({
    noopener: true,
  });
  const { open, close } = useOpenWindow({
    url,
    target,
    windowFeatures,
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: "I understand",
    onClose: () => {
      console.log("window closed");
    },
  });

  const handleOpenWindow = () => {
    open();
    const timestamp = new Date().toLocaleTimeString("ko-KR");
    setOpenedWindows((prev) => [
      `${timestamp}: ${url} (${target})`,
      ...prev.slice(0, 4),
    ]);
  };

  const handleWindowFeaturesChange = useCallback(
    (features: WindowFeatures) => {
      if (isEqual(windowFeatures, features)) return;
      setWindowFeatures(features);
    },
    [windowFeatures, setWindowFeatures]
  );

  const predefinedUrls = [
    { label: "React 공식 사이트", url: "https://react.dev" },
    { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Stack Overflow", url: "https://stackoverflow.com" },
    { label: "Google", url: "https://google.com" },
  ];

  const targetOptions = [
    { label: "_blank (새 탭/창)", value: "_blank" },
    { label: "_self (현재 창)", value: "_self" },
    { label: "_parent (부모 프레임)", value: "_parent" },
    { label: "_top (최상위 프레임)", value: "_top" },
    { label: "custom_window (커스텀 이름)", value: "custom_window" },
  ];

  const clearHistory = () => setOpenedWindows([]);

  return (
    <Card style={{ overflow: "unset" }}>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          기본 창 열기 기능
        </Text>

        <Text size="2" color="gray">
          <code style={{ whiteSpace: "pre" }}>
            {`const { open, close } = useOpenWindow({
  url: "${url}", 
  target: "${target}", 
  windowFeatures: {
${Object.keys(windowFeatures)
  .filter((key) => windowFeatures[key as keyof WindowFeatures] !== undefined)
  .map(
    (key, index) =>
      `${index > 0 ? "\n" : ""}    ${key}: ${JSON.stringify(windowFeatures[key as keyof WindowFeatures])}`
  )
  .join(", ")}
  },` +
              (!windowFeatures.noopener
                ? `\n  NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: "I understand" // noopener가 falsy 일 때 필수`
                : "") +
              `\n});`}
          </code>
        </Text>

        <Flex direction="column" gap="4" style={{ position: "relative" }}>
          {/* URL 입력 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🌐 열고 싶은 URL:
              </Text>
              <TextField.Root
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  미리 정의된 URL:
                </Text>
                <Flex gap="2" wrap="wrap">
                  {predefinedUrls.map((item, index) => (
                    <Button
                      key={index}
                      variant="soft"
                      size="1"
                      onClick={() => setUrl(item.url)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Card>

          <Card variant="surface">
            <WindowFeatureSettings
              defaultValue={windowFeatures}
              onChange={handleWindowFeaturesChange}
            />
          </Card>

          {/* Target 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎯 Target 설정:
              </Text>
              <Flex gap="2" wrap="wrap">
                {targetOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={target === option.value ? "solid" : "outline"}
                    size="2"
                    onClick={() => setTarget(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </Flex>
              <Text size="2" color="gray">
                현재 선택: <Badge color="blue">{target}</Badge>
              </Text>
            </Flex>
          </Card>

          {/* 창 열기 버튼 */}
          <Card
            variant="surface"
            style={{
              position: "sticky",
              bottom: "20px",
              backgroundColor: "var(--color-panel-solid)",
              border: "2px solid var(--accent-9)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              borderRadius: "12px",
            }}
          >
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🚀 창 제어:
              </Text>
              <Flex gap="2" align="center" wrap="wrap">
                <Button onClick={handleOpenWindow} size="2">
                  새 창 열기
                </Button>
                <Button onClick={close} variant="soft" size="2">
                  창 닫기
                </Button>
                {openedWindows.length > 0 && (
                  <Button onClick={clearHistory} variant="ghost" size="2">
                    기록 지우기
                  </Button>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* 열린 창 기록 */}
          {openedWindows.length > 0 && (
            <Card variant="surface">
              <Flex direction="column" gap="3">
                <Text size="2" weight="medium">
                  📋 열린 창 기록 ({openedWindows.length}개):
                </Text>
                <div
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    backgroundColor: "var(--gray-2)",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {openedWindows.map((record, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "4px",
                        color: "var(--gray-11)",
                        borderLeft:
                          index === 0 ? "3px solid var(--blue-9)" : "none",
                        paddingLeft: index === 0 ? "8px" : "0",
                      }}
                    >
                      {record}
                    </div>
                  ))}
                </div>
              </Flex>
            </Card>
          )}

          {/* 보안 정보 */}
          <Card variant="surface" style={{ backgroundColor: "var(--green-2)" }}>
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="green">
                🔒 보안 설정:
              </Text>
              <Text size="2" color="green">
                • <strong>noopener: true</strong> - 새 창에서 원본 창에 접근
                불가
              </Text>
              <Text size="2" color="green">
                • <strong>noreferrer: true</strong> - Referer 헤더 전송 안함
              </Text>
              <Text size="2" color="green">
                • 이 설정으로 Reverse Tabnabbing 공격을 방지합니다
              </Text>
            </Flex>
          </Card>

          {/* 사용 팁 */}
          <Card variant="surface">
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                💡 사용 팁:
              </Text>
              <Text size="2" color="gray">
                • 대부분의 경우 _blank target을 사용하여 새 탭에서 열립니다
              </Text>
              <Text size="2" color="gray">
                • 브라우저의 팝업 차단 설정에 따라 동작이 달라질 수 있습니다
              </Text>
              <Text size="2" color="gray">
                • close() 함수는 같은 스크립트에서 열린 창만 닫을 수 있습니다
              </Text>
              <Text size="2" color="gray">
                • 보안을 위해 항상 noopener와 noreferrer를 사용하는 것을
                권장합니다
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
