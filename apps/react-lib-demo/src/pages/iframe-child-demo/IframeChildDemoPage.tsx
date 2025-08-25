import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box } from "@radix-ui/themes";
import DemoChild from "./DemoChild";
import { relations } from "./relations";

export default function IframeChildDemoPage() {
  // referrer 상태 확인
  const referrer = document.referrer;
  const hasReferrer = referrer && referrer !== "";

  console.log("document.referrer", referrer);
  console.log("referrer 상태:", {
    hasReferrer,
    origin: hasReferrer ? new URL(referrer).origin : "unknown",
    protocol: hasReferrer ? new URL(referrer).protocol : "unknown",
  });

  return (
    <Box>
      <DemoHeader
        title="Iframe Child"
        description="부모 창에서 iframe으로 로드되어 useWindowEventMessage를 통해 통신하는 자식 페이지입니다."
      />

      <DemoRelationList relations={relations} />

      <Box mt="2">
        <DemoChild />
      </Box>
    </Box>
  );
}
