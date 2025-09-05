const lazy = (path: string) => async () =>
  import(path).then((module) => module.default);

export type MenuCategory =
  | "temporal"
  | "state"
  | "helper"
  | "event"
  | "focus"
  | "window"
  | "communication";

export type MenuRoute = {
  id: string;
  path: string;
  title: string;
  description?: string;
  category: MenuCategory[];
  /** 메뉴에서 숨겨지는지 여부 */
  hidden?: boolean;
  component: () => Promise<
    | React.ComponentClass<object, unknown>
    | React.FunctionComponent<object>
    | (() => React.ReactNode)
    | null
    | undefined
  >;
};

export const menuRoutes: MenuRoute[] = [
  {
    id: "debounce",
    path: "/debounce",
    title: "useDebounce",
    description: "함수 호출을 지연시켜 성능을 최적화하는 훅",
    category: ["temporal"],
    component: async () =>
      import("@/pages/use-debounce-demo/UseDebounceDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "toggle",
    path: "/toggle",
    title: "useToggle",
    description: "불린 상태를 쉽게 토글하는 훅",
    category: ["state"],
    component: async () =>
      import("@/pages/use-toggle-demo/UseToggleDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "localStorage",
    path: "/localStorage",
    title: "useLocalStorage",
    description: "localStorage와 동기화되는 상태 관리 훅",
    category: ["helper"],
    component: async () =>
      import("@/pages/use-local-storage-demo/UseLocalStorageDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "progress-counter",
    path: "/progress-counter",
    title: "useProgressCounter",
    description: "비동기 작업 진행 상태를 관리하는 훅",
    category: ["state"],
    component: async () =>
      import(
        "@/pages/use-progress-counter-demo/UseProgressCounterDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "countdown",
    path: "/countdown",
    title: "useCountdown",
    description: "정확한 카운트다운 기능을 제공하는 훅",
    category: ["temporal"],
    component: async () =>
      import("@/pages/use-countdown-demo/UseCountdownDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "copy-to-clipboard",
    path: "/copy-to-clipboard",
    title: "useCopyToClipboard",
    description: "클립보드에 다양한 데이터를 복사하는 훅",
    category: ["helper"],
    component: async () =>
      import(
        "@/pages/use-copy-to-clipboard-demo/UseCopyToClipboardDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "download",
    path: "/download",
    title: "useDownload",
    description: "파일 다운로드 기능을 제공하는 훅",
    category: ["helper"],
    component: async () =>
      import("@/pages/use-download-demo/UseDownloadDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "event-listener",
    path: "/event-listener",
    title: "useEventListener",
    description: "DOM 이벤트를 쉽게 처리하는 훅",
    category: ["event", "helper"],
    component: async () =>
      import("@/pages/use-event-listener-demo/UseEventListenerDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "focus",
    path: "/focus",
    title: "useFocus",
    description: "포커스 가능한 요소들 사이를 프로그래밍적으로 이동하는 훅",
    category: ["event", "focus"],
    component: async () =>
      import("@/pages/use-focus-demo/UseFocusDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "focusable-elements",
    path: "/focusable-elements",
    title: "useFocusableElements",
    description:
      "컨테이너 내의 포커스 가능한 요소들을 자동으로 찾고 추적하는 훅",
    category: ["event", "focus"],
    component: async () =>
      import(
        "@/pages/use-focusable-elements-demo/UseFocusableElementsDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "focus-trap",
    path: "/focus-trap",
    title: "useFocusTrap",
    description: "특정 컨테이너 내에서 포커스를 가두어 접근성을 향상시키는 훅",
    category: ["event", "focus"],
    component: async () =>
      import("@/pages/use-focus-trap-demo/UseFocusTrapDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "mutation-observer",
    path: "/mutation-observer",
    title: "useMutationObserver",
    description: "DOM 요소의 변화를 실시간으로 감지하는 훅",
    category: ["event", "helper"],
    component: async () =>
      import(
        "@/pages/use-mutation-observer-demo/UseMutationObserverDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "open-window",
    path: "/open-window",
    title: "useOpenWindow",
    description: "새 창이나 탭을 안전하고 효율적으로 열 수 있는 훅",
    category: ["window"],
    component: async () =>
      import("@/pages/use-open-window-demo/UseOpenWindowDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "controlled-state",
    path: "/controlled-state",
    title: "useControlledState",
    description: "제어/비제어 컴포넌트에서 자동으로 값을 관리해주는 훅",
    category: ["state"],
    component: async () =>
      import(
        "@/pages/use-controlled-state-demo/UseControlledStateDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "window-message-event",
    path: "/window-message-event",
    title: "useWindowMessageEvent",
    description: "윈도우 간 메시지 통신을 위한 훅",
    category: ["window", "communication"],
    component: async () =>
      import(
        "@/pages/use-window-message-event-demo/UseWindowMessageEventDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "broadcast-channel",
    path: "/broadcast-channel",
    title: "useBroadcastChannel",
    description: "같은 origin의 다른 탭/창과 브로드캐스트 통신하는 훅",
    category: ["window", "communication"],
    component: async () =>
      import(
        "@/pages/use-broadcast-channel-demo/UseBroadcastChannelDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "iframe",
    path: "/iframe-parent",
    title: "Iframe Parent",
    description: "iframe을 생성하여 자식과 통신하는 부모 페이지",
    category: ["window", "communication"],
    component: async () =>
      import("@/pages/iframe-demo/IframeParentDemoPage").then(
        (module) => module.default
      ),
  },
] as const;
