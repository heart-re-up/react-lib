import { useEventListener } from "@heart-re-up/react-lib/hooks/useEventListener";
import {
  toMouse,
  useOpenWindow,
} from "@heart-re-up/react-lib/hooks/useOpenWindow";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useRef, useState } from "react";
import Communicator from "./components/Communicator";

export function DemoOpener() {
  const [isOpenWindow, setIsOpenWindow] = useState(false);
  const [targetWindow, setTargetWindow] = useState<WindowProxy | null>(null);
  const mousePoint = useRef<MouseEvent>(null);

  useEventListener("mousemove", (event) => {
    mousePoint.current = event;
  });

  const { open, close } = useOpenWindow({
    url: `${window.location.origin}${window.location.pathname}?tab=popup`,
    target: "window-event-message",
    windowFeatures: {
      popup: true,
      width: 800,
      height: 600,
    },
    NOOPENNER_MUST_BE_TRUE_FOR_CROSS_ORIGIN_WINDOW_OPEN: "I understand",
    onError: (error) => {
      console.error("창 열기 오류:", error);
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
    },
    onClose: () => {
      console.log("window closed");
      setIsOpenWindow(false);
      setTargetWindow(null);
    },
  });

  const handleOpenWindow = () => {
    const features = {
      popup: true,
      width: 800,
      height: 600,
    };
    const w = open(
      mousePoint.current ? toMouse(features, mousePoint.current) : features
    );
    if (w) {
      setTargetWindow(w);
      setIsOpenWindow(true);
    }
  };

  const handleCloseWindow = () => {
    close();
    setIsOpenWindow(false);
    setTargetWindow(null);
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        이것은 WindowEventMessage Opener(메인 창) 데모입니다. 특정 윈도우와
        1:1로 메시지를 주고받을 수 있습니다. 팝업 창을 열고 양방향으로 메시지를
        주고받아보세요.
      </Text>

      <Flex direction="column" gap="4">
        {/* 새 창 열기 */}
        <Card>
          <Heading size="3" mb="3">
            새 창 열기
          </Heading>
          <Text size="2" color="gray" mb="3" as="p">
            WindowEventMessage는 특정 윈도우를 지정해서 1:1 통신을 합니다. 새
            창을 열어서 연결을 확인해보세요.
          </Text>
          <Button onClick={handleOpenWindow} size="2" disabled={isOpenWindow}>
            새 창 열기 (WindowEventMessage 연결)
          </Button>
          {isOpenWindow && (
            <Button onClick={handleCloseWindow} size="2">
              창 닫기
            </Button>
          )}
        </Card>

        {isOpenWindow && targetWindow && (
          <Communicator
            targetWindow={targetWindow}
            targetOrigin={window.location.origin}
            name="Opener"
          />
        )}
      </Flex>

      {/* 사용 팁 */}
      <Box
        mt="6"
        p="4"
        style={{ backgroundColor: "var(--yellow-2)", borderRadius: "6px" }}
      >
        <Heading size="3" mb="2">
          💡 WindowEventMessage 특징
        </Heading>
        <Text size="2" as="p" mb="2">
          • 특정 윈도우를 지정해서 1:1 통신을 합니다.
        </Text>
        <Text size="2" as="p" mb="2">
          • 발신자 식별 및 신뢰할 수 있는 출처 검증 기능을 제공합니다.
        </Text>
        <Text size="2" as="p" mb="2">
          • 자신이 보낸 메시지는 자동으로 필터링되어 수신되지 않습니다.
        </Text>
        <Text size="2" as="p">
          • 브라우저 개발자 도구의 콘솔에서 메시지 전송/수신 로그를 확인할 수
          있습니다.
        </Text>
      </Box>
    </Box>
  );
}
