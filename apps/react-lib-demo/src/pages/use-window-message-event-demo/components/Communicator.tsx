import { useWindowMessageEvent } from "@heart-re-up/react-lib/hooks/useWindowMessageEvent";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Kbd,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

type MessageData = {
  type: string;
  content: string;
  from: string;
};

export default function Communicator({
  targetWindow,
  targetOrigin,
  name,
}: {
  targetWindow: WindowProxy | "opener" | null;
  targetOrigin: string;
  name: string;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<MessageData[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageData[]>([]);

  const { postMessage } = useWindowMessageEvent({
    targetWindow,
    targetOrigin,
    onMessage: (event) => {
      console.log("메시지 수신:", event.data);
      setReceivedMessages((prev) => [...prev, event.data]);
    },
    onError: (error) => {
      console.error("메시지 통신 오류:", error);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageData: MessageData = {
      type: "demo",
      content: inputMessage.trim(),
      from: name,
    };

    postMessage(messageData);
    console.log("메시지 전송:", messageData);
    setSentMessages((prev) => [...prev, messageData]);
    setInputMessage("");
  };

  const clearMessages = () => {
    setReceivedMessages([]);
    setSentMessages([]);
  };

  const isDisabled =
    targetWindow === null ||
    (targetWindow === "opener" && !window.opener) ||
    !inputMessage.trim();

  return (
    <Box>
      {/* 메시지 전송 */}
      <Card>
        <Heading size="3" mb="3">
          메시지 보내기
        </Heading>
        <Text size="2" color="gray" mb="3" as="p">
          {targetWindow === "opener"
            ? "opener 창으로 메시지를 전송합니다."
            : "연결된 창으로 메시지를 전송합니다."}
        </Text>
        <Flex gap="2" align="end">
          <Box flexGrow="1">
            <TextField.Root
              placeholder="전송할 메시지를 입력하세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
                  handleSendMessage();
                }
              }}
            />
          </Box>
          <Button onClick={handleSendMessage} disabled={isDisabled} size="2">
            <Kbd>Enter</Kbd>
          </Button>
        </Flex>
        {targetWindow === "opener" && !window.opener && (
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
              {sentMessages.map(({ content, from }, index) => (
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
                      {content}
                    </Text>
                    <Text size="1" color="gray">
                      {from}
                    </Text>
                  </Flex>
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
              {receivedMessages.map(({ content, from }, index) => (
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
                      {content}
                    </Text>
                    <Text size="1" color="gray">
                      {from}
                    </Text>
                  </Flex>
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
          disabled={sentMessages.length === 0 && receivedMessages.length === 0}
        >
          메시지 기록 초기화
        </Button>
      </Flex>
    </Box>
  );
}
