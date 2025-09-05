import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box } from "@radix-ui/themes";
import DemoParent from "./DemoParent";
import { relations } from "./relations";

export default function IframeParentDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="Iframe Parent"
        description="iframe을 생성하여 자식 페이지를 로드하고 useWindowMessageEvent를 통해 통신하는 부모 페이지입니다."
      />

      <DemoRelationList relations={relations} />

      <Box mt="2">
        <DemoParent />
      </Box>
    </Box>
  );
}
