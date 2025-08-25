import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoAccordion } from "./DemoAccordion";
import { DemoBasic } from "./DemoBasic";
import { DemoModal } from "./DemoModal";
import { relations } from "./relations";

export default function UseToggleDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useToggle"
        description="불린 상태를 쉽게 토글할 수 있는 훅입니다. 모달, 드롭다운, 아코디언 등 열기/닫기 상태 관리에 유용합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="modal">모달 제어</Tabs.Trigger>
          <Tabs.Trigger value="accordion">아코디언</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="modal">
            <DemoModal />
          </Tabs.Content>
          <Tabs.Content value="accordion">
            <DemoAccordion />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
