import DemoHeader from "@/components/components/DemoHeader";
import DemoRelationList from "@/components/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoBasic } from "./DemoBasic";
import { DemoFormPersistence } from "./DemoFormPersistence";
import { relations } from "./relations";
import { DemoUserPreferences } from "./DemoUserPreferences";

export default function UseLocalStorageDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useLocalStorage"
        description="localStorage와 동기화되는 상태를 관리하는 훅입니다. 페이지 새로고침 후에도 데이터가 유지되며, 다중 탭 동기화를 지원합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="preferences">사용자 설정</Tabs.Trigger>
          <Tabs.Trigger value="form">폼 데이터 보존</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="preferences">
            <DemoUserPreferences />
          </Tabs.Content>
          <Tabs.Content value="form">
            <DemoFormPersistence />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
