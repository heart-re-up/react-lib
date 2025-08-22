import { useEventListener } from "@heart-re-up/react-lib/hooks/useEventListener";
import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function DemoGlobal() {
  const [keyPressed, setKeyPressed] = useState<string>("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [scrollY, setScrollY] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [visibilityState, setVisibilityState] = useState(
    typeof document !== "undefined" ? document.visibilityState : "visible"
  );

  // 키보드 이벤트 리스너
  useEventListener("keydown", (event) => {
    const keyEvent = event as KeyboardEvent;
    setKeyPressed(`${keyEvent.key} (코드: ${keyEvent.code})`);

    // 3초 후 초기화
    setTimeout(() => setKeyPressed(""), 3000);
  });

  // 마우스 이동 이벤트 리스너 (throttle 효과를 위해 requestAnimationFrame 사용)
  useEventListener("mousemove", (event) => {
    const mouseEvent = event as MouseEvent;
    requestAnimationFrame(() => {
      setMousePosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    });
  });

  // 창 크기 변경 이벤트 리스너
  useEventListener("resize", () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  // 스크롤 이벤트 리스너
  useEventListener("scroll", () => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  });

  // 온라인/오프라인 상태 이벤트 리스너
  useEventListener("online", () => {
    setIsOnline(true);
  });

  useEventListener("offline", () => {
    setIsOnline(false);
  });

  // 페이지 가시성 변경 이벤트 리스너
  useEventListener("visibilitychange", () => {
    setVisibilityState(document.visibilityState);
  });

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text size="4" weight="bold">
          글로벌 이벤트 리스너
        </Text>

        <Text size="2" color="gray">
          {`useEventListener('eventName', handler); // window 객체에 자동 등록`}
        </Text>

        <Flex direction="column" gap="3">
          {/* 키보드 이벤트 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                ⌨️ 키보드 이벤트 (keydown):
              </Text>
              <Badge color={keyPressed ? "blue" : "gray"} variant="soft">
                {keyPressed || "키를 눌러보세요"}
              </Badge>
            </Flex>
          </Card>

          {/* 마우스 위치 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                🖱️ 마우스 위치 (mousemove):
              </Text>
              <Badge color="green" variant="soft">
                X: {mousePosition.x}px, Y: {mousePosition.y}px
              </Badge>
            </Flex>
          </Card>

          {/* 창 크기 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                📏 창 크기 (resize):
              </Text>
              <Badge color="orange" variant="soft">
                {windowSize.width} × {windowSize.height}px
              </Badge>
            </Flex>
          </Card>

          {/* 스크롤 위치 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                📜 스크롤 위치 (scroll):
              </Text>
              <Badge color="purple" variant="soft">
                {scrollY}px
              </Badge>
            </Flex>
          </Card>

          {/* 온라인 상태 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                🌐 네트워크 상태 (online/offline):
              </Text>
              <Badge color={isOnline ? "green" : "red"} variant="soft">
                {isOnline ? "온라인" : "오프라인"}
              </Badge>
            </Flex>
          </Card>

          {/* 페이지 가시성 */}
          <Card variant="surface">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                👁️ 페이지 상태 (visibilitychange):
              </Text>
              <Badge
                color={visibilityState === "visible" ? "green" : "gray"}
                variant="soft"
              >
                {visibilityState === "visible" ? "보임" : "숨김"}
              </Badge>
            </Flex>
          </Card>
        </Flex>

        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 테스트 방법:
            </Text>
            <Text size="2" color="gray">
              • 키보드의 아무 키나 눌러보세요
            </Text>
            <Text size="2" color="gray">
              • 마우스를 움직여보세요
            </Text>
            <Text size="2" color="gray">
              • 브라우저 창 크기를 조절해보세요
            </Text>
            <Text size="2" color="gray">
              • 페이지를 스크롤해보세요
            </Text>
            <Text size="2" color="gray">
              • 다른 탭으로 이동했다가 돌아와보세요 (가시성 변경)
            </Text>
            <Text size="2" color="gray">
              • 네트워크 연결을 끊었다가 다시 연결해보세요 (개발자 도구 &gt;
              Network &gt; 쓰로틀링 영역에서 오프라인 상태로 변경)
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}
