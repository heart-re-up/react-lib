/**
 * 히스토리 옵션
 */

export interface HistoryOptions {
  /** intercepted 된 이벤트인지 여부 */
  intercepted?: boolean;

  /** Affinity 정보 */
  affinity?: string;

  /** 사용자 정의 메타데이터. HistoryManager 스코프에서 참조하지 않는다. */
  metadata?: Record<string, unknown>;
}
