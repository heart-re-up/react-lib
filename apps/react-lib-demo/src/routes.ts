import { RouteObject } from "react-router";
import Layout from "./components/layouts/Layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: {
          Component: async () =>
            import("@/pages/Home").then((module) => module.default),
        },
      },
      {
        id: "progress-counter",
        path: "progress-counter",
        lazy: {
          Component: async () =>
            import(
              "@/pages/use-progress-counter-demo/UseProgressCounterDemo"
            ).then((module) => module.default),
        },
      },
      {
        id: "debounce",
        path: "debounce",
        lazy: {
          Component: async () =>
            import("@/pages/UseDebounceDemo").then((module) => module.default),
        },
      },
      {
        id: "toggle",
        path: "toggle",
        lazy: {
          Component: async () =>
            import("@/pages/UseToggleDemo").then((module) => module.default),
        },
      },
      {
        id: "localStorage",
        path: "localStorage",
        lazy: {
          Component: async () =>
            import("@/pages/UseLocalStorageDemo").then(
              (module) => module.default
            ),
        },
      },
    ],
  },
];
