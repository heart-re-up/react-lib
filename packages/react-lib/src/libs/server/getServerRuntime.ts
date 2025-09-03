import { isServer } from "./isServer";

export type ServerEnvironment = "node" | "deno" | "bun" | "unknown" | "client";

/**
 * 서버 환경인지 확인하는 함수
 *
 * @returns 서버 환경 여부와 런타임 정보
 */
export const getServerEnvironment = (): ServerEnvironment => {
  // 확실하게 클라이언트
  if (!isServer()) {
    return "client";
  }
  // Node.js 환경 체크
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }

  // Deno 환경 체크
  if (typeof globalThis !== "undefined" && "Deno" in globalThis) {
    return "deno";
  }

  // Bun 환경 체크
  if (typeof globalThis !== "undefined" && "Bun" in globalThis) {
    return "bun";
  }

  // 모르겠음
  return "unknown";
};
