import { useBroadcastChannel } from "@heart-re-up/react-lib/hooks/useBroadcastChannel";
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
  channelName,
  name,
}: {
  channelName: string;
  name: string;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<MessageData[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageData[]>([]);

  const { postMessage } = useBroadcastChannel({
    channelName,
    onMessage: (event: MessageEvent) => {
      const message = event.data as MessageData;
      console.log("BroadcastChannel 메시지 수신:", message);
      setReceivedMessages((prev) => [...prev, message]);
    },
    onError: (error) => {
      console.error("BroadcastChannel 오류:", error);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageData: MessageData = {
      type: "demo",
      content: inputMessage.trim(),
      from: name,
    };

    const sentMessage = postMessage(messageData);
    console.log("BroadcastChannel 메시지 전송:", sentMessage);

    setSentMessages((prev) => [...prev, messageData]);
    setInputMessage("");
  };

  const clearMessages = () => {
    setReceivedMessages([]);
    setSentMessages([]);
  };

  return (
    <Box>
      {/* 메시지 전송 */}
      <Card>
        <Heading size="3" mb="3">
          메시지 브로드캐스트
        </Heading>
        <Text size="2" color="gray" mb="3" as="p">
          채널명이 "demo-channel"인 모든 탭/창으로 메시지를 전송합니다.
        </Text>
        <Flex gap="2" align="end">
          <Box flexGrow="1">
            <TextField.Root
              placeholder="브로드캐스트할 메시지를 입력하세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
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
            <Kbd>Enter</Kbd>
          </Button>
        </Flex>
      </Card>

      {/* 전송한 메시지 목록 */}
      <Card>
        <Flex justify="between" align="center" mb="3">
          <Heading size="3">브로드캐스트한 메시지</Heading>
          <Text size="1" color="gray">
            {sentMessages.length}개
          </Text>
        </Flex>
        <Box>
          {sentMessages.length === 0 ? (
            <Text size="2" color="gray">
              아직 브로드캐스트한 메시지가 없습니다.
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
          <Heading size="3">수신한 브로드캐스트</Heading>
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
                      {from} 에서 보냄
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
