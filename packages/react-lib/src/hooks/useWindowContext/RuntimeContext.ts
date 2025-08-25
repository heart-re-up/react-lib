export type RuntimeContext =
  | "unknown" // 감지 불가능한 상황
  | "window" // 일반 윈도우 (독립적인 브라우저 탭/창)
  | "child" // 자식 윈도우 (window.opener가 존재하는 팝업/새탭)
  | "iframe" // iframe 내부에서 실행
  | "worker" // Worker 환경 (Web Worker, Service Worker 등)
  | "server"; // 서버 환경 (Node.js, Deno, Bun 등)
