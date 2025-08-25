import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DemoOpener } from "./DemoOpener";
import { DemoPopup } from "./DemoPopup";
import { relations } from "./relations";

export default function UseBroadcastChannelDemoPage() {
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
        title="useBroadcastChannel"
        description="같은 origin의 다른 탭/창과 통신할 수 있는 BroadcastChannel API를 React에서 쉽게 사용할 수 있는 훅입니다. 채널명만으로 자동 연결되며, 모든 연결된 창에 메시지를 브로드캐스트할 수 있습니다."
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
