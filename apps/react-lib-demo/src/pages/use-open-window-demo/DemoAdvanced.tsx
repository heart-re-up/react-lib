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

export default function DemoAdvanced() {
  const [url, setUrl] = useState("https://example.com");
  const [windowFeatures, setWindowFeatures] = useState<WindowFeatures>({
    popup: true,
    width: 800,
    height: 600,
    left: 100,
    top: 100,
    noopener: true,
    noreferrer: true,
  });
  const [dangerousMode, setDangerousMode] = useState(false);
  const [openLog, setOpenLog] = useState<string[]>([]);

  const { open, close } = useOpenWindow({
    url,
    target: "_blank",
    windowFeatures,
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: dangerousMode,
  });

  const handleOpenWindow = () => {
    try {
      open();
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      const featuresString = formatWindowFeatures(windowFeatures);
      setOpenLog((prev) => [
        `${timestamp}: 창 열기 성공 - ${url}`,
        `Features: ${featuresString || "(기본값)"}`,
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
    setWindowFeatures({});
  };

  const setPresetFeatures = (preset: "popup" | "fullscreen" | "minimal") => {
    switch (preset) {
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

  const clearLog = () => setOpenLog([]);

  const featuresString = formatWindowFeatures(windowFeatures);

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          고급 창 제어 기능
        </Text>

        <Text size="2" color="gray">
          WindowFeatures 옵션을 사용하여 새 창의 크기, 위치, 기능을 세밀하게
          제어할 수 있습니다.
        </Text>

        <Flex direction="column" gap="4">
          {/* URL 및 위험 모드 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🌐 기본 설정:
              </Text>
              <Flex direction="column" gap="2">
                <Text size="2">URL:</Text>
                <TextField.Root
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
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
          </Card>

          {/* 프리셋 설정 */}
          <Card variant="surface">
            <Flex direction="column" gap="3">
              <Text size="2" weight="medium">
                🎛️ 프리셋 설정:
              </Text>
              <Flex gap="2" wrap="wrap">
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
                  모두 지우기
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
                  <Text size="2">noopener - 원본 창 접근 차단 (보안)</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Switch
                    checked={windowFeatures.noreferrer || false}
                    onCheckedChange={(checked) =>
                      updateFeature("noreferrer", checked)
                    }
                  />
                  <Text size="2">noreferrer - Referer 헤더 차단 (보안)</Text>
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
                  고급 설정으로 창 열기
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
                  📋 실행 로그:
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

          {/* 브라우저 호환성 정보 */}
          <Card
            variant="surface"
            style={{ backgroundColor: "var(--orange-2)" }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="orange">
                ⚠️ 브라우저 호환성 주의사항:
              </Text>
              <Text size="2" color="orange">
                • 현대 브라우저에서는 popup=true일 때만 레거시 기능들이
                작동합니다
              </Text>
              <Text size="2" color="orange">
                • 브라우저의 팝업 차단 설정이 활성화되어 있으면 창이 열리지 않을
                수 있습니다
              </Text>
              <Text size="2" color="orange">
                • 일부 기능은 사용자 상호작용(클릭 등) 없이는 작동하지 않습니다
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Card>
  );
}
