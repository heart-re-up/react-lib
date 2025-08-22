import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// entry 객체 생성을 위한 헬퍼 함수
const createEntry = (entries: string[]) => {
  return entries.reduce(
    (acc, entry) => {
      acc[entry] = resolve(__dirname, `src/${entry}/index.ts`);
      return acc;
    },
    {} as Record<string, string>
  );
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.*", "src/**/*.stories.*"],
    }),
  ],
  build: {
    lib: {
      entry: {
        // dist/useLocalStorage.js 와 같이 간단하게 처리
        // packages.json 의 exports 는 dist/*.js 와 같이 패턴 매칭한다.
        ...createEntry([
          // Contexts
          "contexts/progress-counter-async",
          // Hooks
          "hooks/useLocalStorage",
          "hooks/useDebounce",
          "hooks/useToggle",
          "hooks/useCountdown",
          "hooks/useDownload",
          "hooks/useEventListener",
          "hooks/useFocus",
          "hooks/useFocusableElements",
          "hooks/useFocusTrap",
          "hooks/useForkEvent",
          "hooks/useForkRef",
          "hooks/useIsomorphicLayoutEffect",
          "hooks/useKeyDown",
          "hooks/useMediaQuery",
          "hooks/useMutationObserver",
          "hooks/useParentElement",
          "hooks/usePreventScroll",
          "hooks/usePrevious",
          "hooks/useResizeObserver",
          "hooks/useThrottle",
          "hooks/useTimeout",
          "hooks/useCopyToClipboard",
          "hooks/useProgressCounter",
          "hooks/useProgressCounterAsync",
          "hooks/useClickOutside",
          "hooks/useInterval",
          "hooks/useIntersectionObserver",
          "hooks/useFetch",
          "hooks/useOnScreen",
        ]),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
