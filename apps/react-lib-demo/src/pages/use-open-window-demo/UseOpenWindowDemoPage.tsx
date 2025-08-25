import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import DemoBasic from "./DemoBasic";
import DemoAdvanced from "./DemoAdvanced";
import DemoFeatures from "./DemoFeatures";
import { relations } from "./relations";

export default function UseOpenWindowDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useOpenWindow"
        description="새 창이나 탭을 안전하고 효율적으로 열 수 있는 훅입니다. WindowFeatures를 통해 창의 크기, 위치, 기능을 세밀하게 제어할 수 있으며, 보안 설정을 통해 Reverse Tabnabbing 공격을 방지합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="advanced">고급 설정</Tabs.Trigger>
          <Tabs.Trigger value="features">실제 사용 사례</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="advanced">
            <DemoAdvanced />
          </Tabs.Content>
          <Tabs.Content value="features">
            <DemoFeatures />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
