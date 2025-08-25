import { RouteObject } from "react-router";
import HydrateFallback from "./components/HydrateFallback";
import Layout from "./layouts/Layout";
import { menuRoutes } from "./menu";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    HydrateFallback: HydrateFallback,
    children: [
      {
        index: true,
        lazy: {
          Component: async () =>
            import("@/pages/Home").then((module) => module.default),
        },
      },
      ...menuRoutes.map((menuRoute) => ({
        id: menuRoute.id,
        path: menuRoute.path.replace("/", ""), // Remove leading slash for child routes
        lazy: {
          Component: menuRoute.component,
        },
      })),
    ],
  },
];
