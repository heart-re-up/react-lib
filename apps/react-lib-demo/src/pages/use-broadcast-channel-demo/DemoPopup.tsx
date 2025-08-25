import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Communicator from "./components/Communicator";

export function DemoPopup() {
  const closeWindow = () => {
    window.close();
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        이것은 BroadcastChannel Popup(팝업 창) 데모입니다. 이 창은 자동으로
        "demo-channel"에 연결되어 다른 모든 창과 메시지를 주고받을 수 있습니다.
        별도의 연결 설정 없이 즉시 통신이 가능합니다.
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
              <strong>채널명:</strong> demo-channel
            </Text>
            <Text size="2">
              <strong>Origin:</strong> {window.location.origin}
            </Text>
            <Text size="2">
              <strong>BroadcastChannel 지원:</strong>{" "}
              {typeof BroadcastChannel !== "undefined" ? "예" : "아니오"}
            </Text>
          </Flex>
          <Box mt="3">
            <Button onClick={closeWindow} size="2" color="red" variant="soft">
              창 닫기
            </Button>
          </Box>
        </Card>

        <Communicator name="Popup" channelName="demo-channel" />
      </Flex>

      {/* 사용 팁 */}
      <Box
        mt="6"
        p="4"
        style={{ backgroundColor: "var(--yellow-2)", borderRadius: "6px" }}
      >
        <Heading size="3" mb="2">
          💡 BroadcastChannel vs PostMessage
        </Heading>
        <Text size="2" as="p" mb="2">
          • BroadcastChannel: 채널명만으로 자동 연결, 모든 창에 브로드캐스트
        </Text>
        <Text size="2" as="p" mb="2">
          • PostMessage: 특정 창을 지정해야 하고, 1:1 통신
        </Text>
        <Text size="2" as="p" mb="2">
          • 창이 닫혀도 다른 창들은 계속 통신 가능
        </Text>
        <Text size="2" as="p">
          • 브라우저 개발자 도구의 콘솔에서 메시지 전송/수신 로그를 확인할 수
          있습니다.
        </Text>
      </Box>
    </Box>
  );
}
