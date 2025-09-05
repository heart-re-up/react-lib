import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DemoOpener } from "./DemoOpener";
import { DemoPopup } from "./DemoPopup";
import { relations } from "./relations";

export default function UseWindowMessageEventDemoPage() {
  const [activeTab, setActiveTab] = useState("opener");

  useEffect(() => {
    // URL query string에서 tab 값 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam === "opener" || tabParam === "popup") {
      setActiveTab(tabParam);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // URL에 tab 파라미터 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <Box>
      <DemoHeader
        title="useWindowMessageEvent"
        description="윈도우 간 메시지 통신을 위한 훅입니다. 같은 origin의 다른 윈도우와 안전하게 메시지를 주고받을 수 있으며, 발신자 식별 및 신뢰할 수 있는 출처 검증 기능을 제공합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root value={activeTab} onValueChange={handleTabChange} mt="2">
        <Tabs.List>
          <Tabs.Trigger value="opener">Opener (메인 창)</Tabs.Trigger>
          <Tabs.Trigger value="popup">Popup (팝업 창)</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="opener">
            <DemoOpener />
          </Tabs.Content>
          <Tabs.Content value="popup">
            <DemoPopup />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
