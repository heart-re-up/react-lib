import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoBasic } from "./DemoBasic";
import { relations } from "./relations";

export default function UseControlledStateDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useControlledState"
        description="제어/비제어 컴포넌트에서 자동으로 값을 관리해주는 훅입니다. 동일한 API로 두 가지 패턴을 모두 지원하여 컴포넌트의 재사용성과 유연성을 높일 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
