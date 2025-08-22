const lazy = (path: string) => async () =>
  import(path).then((module) => module.default);

export type MenuRoute = {
  id: string;
  path: string;
  title: string;
  description?: string;
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
    component: async () =>
      import("@/pages/use-event-listener-demo/UseEventListenerDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "click-outside",
    path: "/click-outside",
    title: "useClickOutside",
    description: "요소 외부 클릭을 감지하여 모달, 드롭다운 등을 제어하는 훅",
    component: async () =>
      import("@/pages/use-click-outside-demo/UseClickOutsideDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "interval",
    path: "/interval",
    title: "useInterval",
    description: "React에서 setInterval을 안전하게 사용하는 훅",
    component: async () =>
      import("@/pages/use-interval-demo/UseIntervalDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "intersection-observer",
    path: "/intersection-observer",
    title: "useIntersectionObserver",
    description: "요소의 뷰포트 교차를 감지하여 무한 스크롤, lazy loading 등을 구현하는 훅",
    component: async () =>
      import("@/pages/use-intersection-observer-demo/UseIntersectionObserverDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "fetch",
    path: "/fetch",
    title: "useFetch",
    description: "간단한 데이터 페칭을 위한 훅",
    component: async () =>
      import("@/pages/use-fetch-demo/UseFetchDemoPage").then(
        (module) => module.default
      ),
  },
] as const;
