import { getServerEnvironment } from "../../libs/server/getServerRuntime";
import { isWorker } from "../../libs/worker/isWorker";
import { RuntimeContext } from "./RuntimeContext";

/**
 * 현재 런타임의 컨텍스트를 감지하는 훅
 *
 * - "window": 일반 윈도우 (독립적인 브라우저 탭/창)
 * - "child": 자식 윈도우 (window.opener가 존재하는 팝업/새탭)
 * - "iframe": iframe 내부에서 실행
 * - "worker": Worker 환경 (Web Worker, Service Worker 등)
 * - "server": 서버 환경 (Node.js, Deno, Bun 등)
 * - "unknown": 감지 불가능한 상황
 *
 * @param props 훅 옵션
 * @returns 현재 런타임 컨텍스트
 */
export const useRuntimeContext = (): RuntimeContext => {
  // 브라우저가 아닌 환경 체크
  if (typeof window === "undefined") {
    // Worker 환경 체크 (Web Worker, Service Worker 등)
    if (isWorker()) {
      return "worker";
    }

    // 서버 환경 체크 (Node.js, Deno, Bun 등)
    if (getServerEnvironment() !== "client") {
      return "server";
    }

    return "unknown";
  }

  try {
    // iframe 내부에서 실행 중인지 확인
    // window.self !== window.parent 또는 window.self !== window.top으로 감지
    if (window.self !== window.parent || window.self !== window.top) {
      return "iframe";
    }

    // 자식 윈도우인지 확인 (window.opener가 존재)
    // 팝업이든 새탭이든 부모 윈도우가 있다면 자식 윈도우
    if (window.opener && window.opener !== window) {
      return "child";
    }

    // 일반 윈도우 (독립적인 브라우저 탭/창)
    return "window";
  } catch {
    return "unknown";
  }
};
