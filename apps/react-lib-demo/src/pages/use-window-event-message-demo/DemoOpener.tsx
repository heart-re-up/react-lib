import { useOpenWindow } from "@heart-re-up/react-lib/hooks/useOpenWindow";
import { useWindowEventMessage } from "@heart-re-up/react-lib/hooks/useWindowEventMessage";
import { WindowMessage } from "@heart-re-up/react-lib/libs/window";
import {
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

interface MessageData {
  type: string;
  content: string;
  from: string;
}

export function DemoOpener() {
  const [targetWindow, setTargetWindow] = useState<WindowProxy | null>(null);

  const [inputMessage, setInputMessage] = useState("");

  const [receivedMessages, setReceivedMessages] = useState<
    WindowMessage<MessageData>[]
  >([]);

  const [sentMessages, setSentMessages] = useState<
    WindowMessage<MessageData>[]
  >([]);

  const { open } = useOpenWindow({
    url: `${window.location.origin}${window.location.pathname}?tab=popup`,
    target: "_blank",
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
  });

  const { postMessage } = useWindowEventMessage({
    targetWindow: targetWindow,
    targetOrigin: window.location.origin,
    onMessage: (message) => {
      console.log("메시지 수신:", message);
      setReceivedMessages((prev) => [
        ...prev,
        message as WindowMessage<MessageData>,
      ]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageData: MessageData = {
      type: "demo",
      content: inputMessage.trim(),
      from: "Opener 창",
    };

    const sentMessage = postMessage(messageData);
    console.log("메시지 전송:", sentMessage);

    setSentMessages((prev) => [...prev, sentMessage]);
    setInputMessage("");
  };

  const openNewWindow = () => {
    const w = open();
    if (w) {
      setTargetWindow(w);
    }
  };

  const clearMessages = () => {
    setReceivedMessages([]);
    setSentMessages([]);
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        이것은 Opener(메인 창) 데모입니다. 팝업 창을 열고 양방향으로 메시지를
        주고받을 수 있습니다. 팝업 창은 ?tab=popup 파라미터로 자동으로 Popup
        탭이 선택됩니다.
      </Text>

      <Flex direction="column" gap="4">
        {/* 새 창 열기 */}
        <Card>
          <Heading size="3" mb="3">
            1. 새 창 열기
          </Heading>
          <Text size="2" color="gray" mb="3" as="p">
            먼저 새 창을 열어서 두 개의 윈도우를 준비합니다.
          </Text>
          <Button onClick={openNewWindow} size="2">
            새 창 열기
          </Button>
        </Card>

        {/* 메시지 전송 */}
        <Card>
          <Heading size="3" mb="3">
            2. 메시지 보내기
          </Heading>
          <Flex gap="2" align="end">
            <Box flexGrow="1">
              <TextField.Root
                placeholder="전송할 메시지를 입력하세요"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.nativeEvent.isComposing === false
                  ) {
                    handleSendMessage();
                  }
                }}
              />
            </Box>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              size="2"
            >
              전송
            </Button>
          </Flex>
        </Card>

        {/* 전송한 메시지 목록 */}
        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">전송한 메시지</Heading>
            <Text size="1" color="gray">
              {sentMessages.length}개
            </Text>
          </Flex>
          <Box>
            {sentMessages.length === 0 ? (
              <Text size="2" color="gray">
                아직 전송한 메시지가 없습니다.
              </Text>
            ) : (
              <Flex direction="column" gap="2">
                {sentMessages.map((message, index) => (
                  <Box
                    key={index}
                    p="3"
                    style={{
                      backgroundColor: "var(--gray-2)",
                      borderRadius: "6px",
                    }}
                  >
                    <Flex justify="between" align="start" mb="2">
                      <Text size="2" weight="medium">
                        {message.payload.content}
                      </Text>
                      <Text size="1" color="gray">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </Flex>
                    <Code size="1">
                      sender: {message.sender.substring(0, 8)}...
                    </Code>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </Card>

        {/* 수신한 메시지 목록 */}
        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading size="3">수신한 메시지</Heading>
            <Text size="1" color="gray">
              {receivedMessages.length}개
            </Text>
          </Flex>
          <Box>
            {receivedMessages.length === 0 ? (
              <Text size="2" color="gray">
                아직 수신한 메시지가 없습니다. 다른 창에서 메시지를 보내보세요.
              </Text>
            ) : (
              <Flex direction="column" gap="2">
                {receivedMessages.map((message, index) => (
                  <Box
                    key={index}
                    p="3"
                    style={{
                      backgroundColor: "var(--blue-2)",
                      borderRadius: "6px",
                    }}
                  >
                    <Flex justify="between" align="start" mb="2">
                      <Text size="2" weight="medium">
                        {message.payload.content}
                      </Text>
                      <Text size="1" color="gray">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </Flex>
                    <Code size="1">
                      sender: {message.sender.substring(0, 8)}... | from:{" "}
                      {message.payload.from}
                    </Code>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </Card>

        {/* 초기화 버튼 */}
        <Flex justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={clearMessages}
            disabled={
              sentMessages.length === 0 && receivedMessages.length === 0
            }
          >
            메시지 기록 초기화
          </Button>
        </Flex>
      </Flex>

      {/* 사용 팁 */}
      <Box
        mt="6"
        p="4"
        style={{ backgroundColor: "var(--yellow-2)", borderRadius: "6px" }}
      >
        <Heading size="3" mb="2">
          💡 사용 팁
        </Heading>
        <Text size="2" as="p" mb="2">
          • 같은 origin(도메인)의 윈도우들 간에만 메시지가 전달됩니다.
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
