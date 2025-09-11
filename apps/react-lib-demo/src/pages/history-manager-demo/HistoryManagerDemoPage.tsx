import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Button, Card, Flex, Tabs, Text } from "@radix-ui/themes";
import { Link } from "react-router";
import { DemoBasic } from "./DemoBasic";
import { DemoNested } from "./DemoNested";
import { DemoPageTransition } from "./DemoPageTransition";
import { relations } from "./relations";

export default function HistoryManagerDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="History Manager"
        description="브라우저 히스토리를 활용한 모달 및 네비게이션 상태 관리 서비스입니다. 뒤로가기/앞으로가기와 자연스럽게 통합되며, affinity 그룹과 seal 기능을 통해 복잡한 네비게이션 플로우를 관리할 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="nested">중첩 모달</Tabs.Trigger>
          <Tabs.Trigger value="transition">페이지 전환</Tabs.Trigger>
          <Tabs.Trigger value="real-page">실제 페이지 이동</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="nested">
            <DemoNested />
          </Tabs.Content>
          <Tabs.Content value="transition">
            <DemoPageTransition />
          </Tabs.Content>
          <Tabs.Content value="real-page">
            <Card>
              <Flex direction="column" gap="4">
                <Text size="3" weight="medium">
                  실제 페이지 이동 테스트
                </Text>
                <Text size="2" color="gray">
                  React Router를 통한 실제 페이지 이동과 히스토리 관리를
                  테스트합니다. 각 페이지는 독립적인 모달 관리자를 가지고
                  있습니다.
                </Text>

                <Flex gap="3" wrap="wrap">
                  <Link to="/history-manager/page-a">
                    <Button size="3">페이지 A로 이동</Button>
                  </Link>
                  <Link to="/history-manager/page-b">
                    <Button size="3">페이지 B로 이동</Button>
                  </Link>
                  <Link to="/history-manager/page-c">
                    <Button size="3">페이지 C로 이동</Button>
                  </Link>
                </Flex>

                <Card variant="surface">
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="medium">
                      🎯 실제 페이지 이동 시나리오
                    </Text>
                    <Text size="2" color="gray">
                      • 각 페이지에서 모달을 열고 다른 페이지로 이동해보세요
                    </Text>
                    <Text size="2" color="gray">
                      • 브라우저 뒤로가기/앞으로가기로 탐색해보세요
                    </Text>
                    <Text size="2" color="gray">
                      • 모달 봉인(seal) 기능을 테스트해보세요
                    </Text>
                    <Text size="2" color="gray">
                      • URL이 실제로 변경되며 새로고침해도 페이지가 유지됩니다
                    </Text>
                  </Flex>
                </Card>
              </Flex>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
