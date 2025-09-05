/**
 * 웹 워커 환경 감지를 위한 타입
 * 워커 환경 판별에 필요한 최소한의 속성만 정의합니다
 */
export interface WorkerLike {
  importScripts?: unknown;
}

/**
 * 현재 환경이 웹 워커인지 확인하는 함수
 * @param value - 확인할 값
 * @returns 웹 워커 환경 여부
 */
export const isWorkerLike = (value: unknown): value is WorkerLike => {
  return !!value && typeof value === "object" && "importScripts" in value;
};

/**
 * importScripts 존재 여부 확인
 *
 * @param value - 확인할 값
 * @returns importScripts 존재 여부
 */
export const hasImportScripts = (value: unknown): boolean => {
  try {
    // 안전하게 importScripts 존재 여부 확인
    return isWorkerLike(value) && typeof value.importScripts === "function";
  } catch {
    // 접근 오류 시 false
    return false;
  }
};
/**
 * 현재 환경이 웹 워커인지 확인하는 함수
 *
 * @returns 웹 워커 환경 여부
 */
export const isWorker = (): boolean => {
  const hasWindow = typeof window !== "undefined";
  const hasSelf = typeof self !== "undefined";
  // window가 없고, self가 있으며, importScripts가 함수인 경우 웹 워커
  return !hasWindow && hasSelf && hasImportScripts(self);
};

// 기본 내보내기
export default isWorker;
