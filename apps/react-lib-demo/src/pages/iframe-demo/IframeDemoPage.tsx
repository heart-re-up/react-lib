import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box } from "@radix-ui/themes";
import DemoBasic from "./DemoBasic";
import { relations } from "./relations";

export default function IframeDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="Iframe & WindowTarget"
        description="WindowTarget.ts의 findTargetWindow 함수를 사용하여 iframe과 다양한 윈도우 타겟을 찾고 통신하는 방법을 학습할 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Box mt="2">
        <DemoBasic />
      </Box>
    </Box>
  );
}
