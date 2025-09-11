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
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@heart-re-up/history-manager"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
