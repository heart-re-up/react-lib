import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
        ...createEntry(["core", "hooks", "node", "proxy", "types"]),
      },
      formats: ["es", "cjs"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
