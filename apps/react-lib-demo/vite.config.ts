import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// tsconfig.json에서 paths를 읽어서 Vite alias로 변환하는 함수
function getTsconfigPaths() {
  try {
    const tsconfigPath = resolve(__dirname, "tsconfig.json");
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
    const paths = tsconfig.compilerOptions?.paths || {};

    const alias: Record<string, string> = {};

    for (const [aliasName, aliasPaths] of Object.entries(paths)) {
      if (Array.isArray(aliasPaths) && aliasPaths.length > 0) {
        // tsconfig의 baseUrl 기준 경로를 절대 경로로 변환
        const aliasPath = aliasPaths[0].replace(/\/\*$/, ""); // /* 제거
        alias[aliasName.replace(/\/\*$/, "")] = resolve(__dirname, aliasPath);
      }
    }

    return alias;
  } catch (error) {
    console.warn("Failed to load tsconfig paths:", error);
    return {};
  }
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router"],
            radix: ["@radix-ui/themes"],
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 4173,
      host: true,
    },
    resolve: {
      alias: getTsconfigPaths(),
    },
  };
});
