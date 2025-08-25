import { useOpenWindow } from "@heart-re-up/react-lib/hooks/useOpenWindow";
import { formatWindowFeatures } from "@heart-re-up/react-lib/hooks/useOpenWindow/useOpenWindow.util";
import { WindowFeatures } from "@heart-re-up/react-lib/hooks/useOpenWindow/useOpenWindow.type";
import {
  Badge,
  Button,
  Card,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

export default function DemoUnified() {
  const [url, setUrl] = useState("https://react.dev");
  const [target, setTarget] = useState("_blank");
  const [customTarget, setCustomTarget] = useState("custom_window");
  const [windowFeatures, setWindowFeatures] = useState<WindowFeatures>({
    noopener: true,
    noreferrer: true,
  });
  const [dangerousMode, setDangerousMode] = useState(false);
  const [openLog, setOpenLog] = useState<string[]>([]);

  const { open, close } = useOpenWindow({
    url,
    target: target === "custom" ? customTarget : target,
    windowFeatures,
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: dangerousMode,
  });

  const handleOpenWindow = () => {
    try {
      open();
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      const finalTarget = target === "custom" ? customTarget : target;
      const featuresString = formatWindowFeatures(windowFeatures);
      setOpenLog((prev) => [
        `${timestamp}: 창 열기 성공 - ${url} (${finalTarget})`,
        featuresString ? `Features: ${featuresString}` : "Features: (기본값)",
        ...prev.slice(0, 8),
      ]);
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      setOpenLog((prev) => [
        `${timestamp}: 오류 - ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        ...prev.slice(0, 8),
      ]);
    }
  };

  const updateFeature = <K extends keyof WindowFeatures>(
    key: K,
    value: WindowFeatures[K]
  ) => {
    setWindowFeatures((prev) => ({ ...prev, [key]: value }));
  };

  const clearFeatures = () => {
    setWindowFeatures({
      noopener: true,
      noreferrer: true,
    });
  };

  const setPresetFeatures = (
    preset: "basic" | "popup" | "fullscreen" | "minimal"
  ) => {
    switch (preset) {
      case "basic":
        setWindowFeatures({
          noopener: true,
          noreferrer: true,
        });
        break;
      case "popup":
        setWindowFeatures({
          popup: true,
          width: 600,
          height: 400,
          left: 200,
          top: 200,
          noopener: true,
          noreferrer: true,
        });
        break;
      case "fullscreen":
        setWindowFeatures({
          popup: false,
          width: window.screen.availWidth,
          height: window.screen.availHeight,
          left: 0,
          top: 0,
          noopener: true,
          noreferrer: true,
        });
        break;
      case "minimal":
        setWindowFeatures({
          popup: true,
          width: 400,
          height: 300,
          noopener: true,
          noreferrer: true,
        });
        break;
    }
  };

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
    { label: "커스텀 이름", value: "custom" },
  ];

  const clearLog = () => setOpenLog([]);
  const featuresString = formatWindowFeatures(windowFeatures);

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          useOpenWindow 통합 데모
        </Text>

        <Text size="2" color="gray">
          기본 기능부터 고급 WindowFeatures까지 모든 옵션을 테스트할 수
          있습니다.
        </Text>

        <Flex direction="column" gap="4">
          {/* URL 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🌐 URL 설정:
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

              {target === "custom" && (
                <Flex direction="column" gap="2">
                  <Text size="2">커스텀 타겟 이름:</Text>
                  <TextField.Root
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder="my_window"
                  />
                </Flex>
              )}

              <Text size="2" color="gray">
                현재 선택:{" "}
                <Badge color="blue">
                  {target === "custom" ? customTarget : target}
                </Badge>
              </Text>
            </Flex>
          </Card>

          {/* 프리셋 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎛️ 프리셋 설정:
              </Text>
              <Flex gap="2" wrap="wrap">
                <Button
                  onClick={() => setPresetFeatures("basic")}
                  variant="soft"
                  size="2"
                >
                  기본 설정
                </Button>
                <Button
                  onClick={() => setPresetFeatures("popup")}
                  variant="soft"
                  size="2"
                >
                  팝업 창
                </Button>
                <Button
                  onClick={() => setPresetFeatures("fullscreen")}
                  variant="soft"
                  size="2"
                >
                  전체화면
                </Button>
                <Button
                  onClick={() => setPresetFeatures("minimal")}
                  variant="soft"
                  size="2"
                >
                  최소 창
                </Button>
                <Button onClick={clearFeatures} variant="outline" size="2">
                  초기화
                </Button>
              </Flex>
            </Flex>
          </Card>

          {/* 창 크기 및 위치 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                📐 창 크기 및 위치:
              </Text>
              <Flex gap="4" wrap="wrap">
                <Flex direction="column" gap="2" style={{ minWidth: "120px" }}>
                  <Text size="2">너비 (width):</Text>
                  <TextField.Root
                    type="number"
                    value={windowFeatures.width?.toString() || ""}
                    onChange={(e) =>
                      updateFeature(
                        "width",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="800"
                  />
                </Flex>

                <Flex direction="column" gap="2" style={{ minWidth: "120px" }}>
                  <Text size="2">높이 (height):</Text>
                  <TextField.Root
                    type="number"
                    value={windowFeatures.height?.toString() || ""}
                    onChange={(e) =>
                      updateFeature(
                        "height",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="600"
                  />
                </Flex>

                <Flex direction="column" gap="2" style={{ minWidth: "120px" }}>
                  <Text size="2">X 위치 (left):</Text>
                  <TextField.Root
                    type="number"
                    value={windowFeatures.left?.toString() || ""}
                    onChange={(e) =>
                      updateFeature(
                        "left",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="100"
                  />
                </Flex>

                <Flex direction="column" gap="2" style={{ minWidth: "120px" }}>
                  <Text size="2">Y 위치 (top):</Text>
                  <TextField.Root
                    type="number"
                    value={windowFeatures.top?.toString() || ""}
                    onChange={(e) =>
                      updateFeature(
                        "top",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="100"
                  />
                </Flex>
              </Flex>
            </Flex>
          </Card>

          {/* 보안 및 기능 옵션 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🔒 보안 및 기능 옵션:
              </Text>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.popup || false}
                    onCheckedChange={(checked) =>
                      updateFeature("popup", checked)
                    }
                  />
                  <Text size="2">popup - 팝업 창으로 열기</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.noopener || false}
                    onCheckedChange={(checked) =>
                      updateFeature("noopener", checked)
                    }
                  />
                  <Text size="2">noopener - 원본 창 접근 차단 (보안 권장)</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.noreferrer || false}
                    onCheckedChange={(checked) =>
                      updateFeature("noreferrer", checked)
                    }
                  />
                  <Text size="2">
                    noreferrer - Referer 헤더 차단 (보안 권장)
                  </Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.resizable || false}
                    onCheckedChange={(checked) =>
                      updateFeature("resizable", checked)
                    }
                  />
                  <Text size="2">resizable - 창 크기 조절 가능</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.scrollbars || false}
                    onCheckedChange={(checked) =>
                      updateFeature("scrollbars", checked)
                    }
                  />
                  <Text size="2">scrollbars - 스크롤바 표시</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Text size="2">위험 모드:</Text>
                  <Switch
                    checked={dangerousMode}
                    onCheckedChange={setDangerousMode}
                  />
                  <Text size="2" color={dangerousMode ? "red" : "gray"}>
                    {dangerousMode ? "활성화 (보안 위험)" : "비활성화"}
                  </Text>
                </Flex>

                {dangerousMode && (
                  <Card
                    variant="surface"
                    style={{ backgroundColor: "var(--red-2)" }}
                  >
                    <Text size="2" color="red">
                      ⚠️ 위험 모드가 활성화되었습니다. noopener가 false일 때
                      Reverse Tabnabbing 공격에 취약해집니다!
                    </Text>
                  </Card>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* 생성된 Features 문자열 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🔧 생성된 WindowFeatures 문자열:
              </Text>
              <div
                style={{
                  backgroundColor: "var(--gray-3)",
                  padding: "12px",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  wordBreak: "break-all",
                  minHeight: "40px",
                }}
              >
                {featuresString || "(기본값 - 빈 문자열)"}
              </div>
            </Flex>
          </Card>

          {/* 창 제어 버튼 */}
          <Card variant="surface">
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
                {openLog.length > 0 && (
                  <Button onClick={clearLog} variant="ghost" size="2">
                    로그 지우기
                  </Button>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* 실행 로그 */}
          {openLog.length > 0 && (
            <Card variant="surface">
              <Flex direction="column" gap="3">
                <Text size="2" weight="medium">
                  📋 실행 로그 ({openLog.length}개):
                </Text>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: "var(--gray-2)",
                    padding: "8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {openLog.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "4px",
                        color: log.includes("오류")
                          ? "var(--red-11)"
                          : "var(--gray-11)",
                        borderLeft:
                          index === 0 ? "3px solid var(--blue-9)" : "none",
                        paddingLeft: index === 0 ? "8px" : "0",
                      }}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </Flex>
            </Card>
          )}

          {/* 사용 팁 및 주의사항 */}
          <Card variant="surface" style={{ backgroundColor: "var(--blue-2)" }}>
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="blue">
                💡 사용 팁 및 주의사항:
              </Text>
              <Text size="2" color="blue">
                • 보안을 위해 항상 noopener와 noreferrer를 활성화하는 것을
                권장합니다
              </Text>
              <Text size="2" color="blue">
                • 브라우저의 팝업 차단 설정에 따라 동작이 달라질 수 있습니다
              </Text>
              <Text size="2" color="blue">
                • close() 함수는 같은 스크립트에서 열린 창만 닫을 수 있습니다
              </Text>
              <Text size="2" color="blue">
                • 현대 브라우저에서는 popup=true일 때만 레거시 기능들이
                작동합니다
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
