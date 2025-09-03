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

export function DemoPopup() {
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<
    WindowMessage<MessageData>[]
  >([]);
  const [sentMessages, setSentMessages] = useState<
    WindowMessage<MessageData>[]
  >([]);
  const { postMessage } = useWindowEventMessage({
    targetWindow: "opener",
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
      from: "Popup 창",
    };

    const sentMessage = postMessage(messageData);
    console.log("메시지 전송:", sentMessage);

    setSentMessages((prev) => [...prev, sentMessage]);
    setInputMessage("");
  };

  const clearMessages = () => {
    setReceivedMessages([]);
    setSentMessages([]);
  };

  const closeWindow = () => {
    window.close();
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        이것은 Popup(팝업 창) 데모입니다. 이 창은 opener 창과 양방향으로
        메시지를 주고받을 수 있습니다. window.opener를 통해 부모 창과
        통신합니다.
      </Text>

      <Flex direction="column" gap="4">
        {/* 창 정보 */}
        <Card>
          <Heading size="3" mb="3">
            창 정보
          </Heading>
          <Flex direction="column" gap="2">
            <Text size="2">
              <strong>창 타입:</strong> Popup (자식 창)
            </Text>
            <Text size="2">
              <strong>Opener 존재:</strong> {window.opener ? "예" : "아니오"}
            </Text>
            <Text size="2">
              <strong>Origin:</strong> {window.location.origin}
            </Text>
          </Flex>
          <Box mt="3">
            <Button onClick={closeWindow} size="2" color="red" variant="soft">
              창 닫기
            </Button>
          </Box>
        </Card>

        {/* 메시지 전송 */}
        <Card>
          <Heading size="3" mb="3">
            Opener에게 메시지 보내기
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
              disabled={!inputMessage.trim() || !window.opener}
              size="2"
            >
              전송
            </Button>
          </Flex>
          {!window.opener && (
            <Text size="1" color="red" mt="2" as="p">
              ⚠️ Opener 창이 없습니다. 이 창을 직접 열었거나 opener가 닫힌 것
              같습니다.
            </Text>
          )}
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
            <Heading size="3">Opener로부터 수신한 메시지</Heading>
            <Text size="1" color="gray">
              {receivedMessages.length}개
            </Text>
          </Flex>
          <Box>
            {receivedMessages.length === 0 ? (
              <Text size="2" color="gray">
                아직 수신한 메시지가 없습니다. Opener 창에서 메시지를
                보내보세요.
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
          💡 Popup 창 사용 팁
        </Heading>
        <Text size="2" as="p" mb="2">
          • 이 창은 window.opener를 통해 부모 창과 통신합니다.
        </Text>
        <Text size="2" as="p" mb="2">
          • 부모 창이 닫히면 더 이상 메시지를 보낼 수 없습니다.
        </Text>
        <Text size="2" as="p">
          • 브라우저 개발자 도구의 콘솔에서 메시지 전송/수신 로그를 확인할 수
          있습니다.
        </Text>
      </Box>
    </Box>
  );
}
