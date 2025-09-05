import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Communicator from "./components/Communicator";

export function DemoPopup() {
  const closeWindow = () => {
    window.close();
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        이것은 WindowMessageEvent Popup(팝업 창) 데모입니다. 이 창은 opener 창과
        양방향으로 메시지를 주고받을 수 있습니다. window.opener를 통해 부모 창과
        1:1 통신을 합니다.
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
            <Text size="2">
              <strong>WindowMessageEvent 지원:</strong> 예
            </Text>
          </Flex>
          <Box mt="3">
            <Button onClick={closeWindow} size="2" color="red" variant="soft">
              창 닫기
            </Button>
          </Box>
        </Card>

        <Communicator
          targetWindow="opener"
          targetOrigin={window.location.origin}
          name="Popup"
        />
      </Flex>

      {/* 사용 팁 */}
      <Box
        mt="6"
        p="4"
        style={{ backgroundColor: "var(--yellow-2)", borderRadius: "6px" }}
      >
        <Heading size="3" mb="2">
          💡 WindowMessageEvent vs BroadcastChannel
        </Heading>
        <Text size="2" as="p" mb="2">
          • WindowMessageEvent: 특정 창을 지정해서 1:1 통신
        </Text>
        <Text size="2" as="p" mb="2">
          • BroadcastChannel: 채널명만으로 자동 연결, 모든 창에 브로드캐스트
        </Text>
        <Text size="2" as="p" mb="2">
          • 발신자 식별 및 신뢰할 수 있는 출처 검증 기능 제공
        </Text>
        <Text size="2" as="p">
          • 브라우저 개발자 도구의 콘솔에서 메시지 전송/수신 로그를 확인할 수
          있습니다.
        </Text>
      </Box>
    </Box>
  );
}
