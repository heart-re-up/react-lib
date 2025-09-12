/**
 * 히스토리 노드
 */

export type HistoryNode = {
  /** 고유 식별자 */
  id: string;
  /** 생성 시간 */
  timestamp: number;
  /** 초기 노드 여부 */
  initial?: true;
  /** URL 경로 */
  pathname: string;
  /** 포지션 */
  position: number;
  /** Affinity 정보 */
  affinity?: string;
  /** 히스토리 봉인 정보 */
  sealed?: boolean;
  /** 사용자 정의 메타데이터. HistoryManager 스코프에서 참조하지 않는다. */
  metadata?: Record<string, unknown>;
  /**
   * 노드 생성 소스(기원)
   * - managed: 의도적으로 생성된 관리 노드
   * - intercepted: 누군가가 window.history 에 수행한 작업을 인터셉트한 노드
   */
  source: "managed" | "intercepted";
};

/**
 * HistoryNode 타입 가드
 */
export function isHistoryNode(node: unknown): node is HistoryNode {
  return (
    node !== null &&
    node !== undefined &&
    typeof node === "object" &&
    "id" in node &&
    "timestamp" in node &&
    !!node.id &&
    !!node.timestamp
  );
}
