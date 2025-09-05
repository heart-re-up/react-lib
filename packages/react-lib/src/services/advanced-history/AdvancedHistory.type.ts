import { AdvancedHistoryNodeManager, HistoryNavigationEventEmitter } from "./node";

/**
 * 추가 기능이 확장된 어플리케이션 히스토리 인터페이스
 */
export interface AdvancedHistory
  extends Omit<History, "pushState" | "replaceState">,
    HistoryNavigationEventEmitter {
  /** 히스토리 노드 관리자 */
  readonly nodeManager: AdvancedHistoryNodeManager;
  /** 히스토리 추가 */
  pushState: <T extends object>(
    data: T,
    affinity?: AffinityOptions,
    url?: string | URL | null
  ) => void;

  /** 히스토리 교체 */
  replaceState: <T extends object>(
    data: T,
    affinity?: AffinityOptions,
    url?: string | URL | null
  ) => void;
}

/**
 * 히스토리 차단 전략
 * - passthrough: 진입된 방향 그대로 통과시킴
 * - snapback: 진입된 방향으로 다시 되돌려보냄
 */
export type SealedStrategy = "passthrough" | "snapback";

/**
 * 관련 히스토리 상태
 * 히스토리 차단 여부와 전략을 관리하는 상태
 */
export type AffinityState = {
  /**
   * 히스토리 차단 여부
   */
  sealed?: boolean;
  /**
   * 히스토리 차단 전략
   */
  strategy?: SealedStrategy;
};

/**
 * 관련 히스토리 차단 옵션
 * 여러 히스토리를 일종의 그룹으로 묶어 관리하는 옵션
 */
export type AffinityOptions = AffinityState & {
  /**
   * 관련 히스토리 아이디. 히스토리 차단 여부와 전략을 결정하는 키
   */
  affinityId: string;
};

/**
 * 브라우저 히스토리 노드
 *
 * 일반적인 `state` 외 히스토리 노드 관리를 위한 추가적인 데이터
 */
export type AdvancedHistoryNode = {
  /** 유일한 식별자 (UUID) */
  id: string;
  /** 생성 시간 */
  timestamp: number;
  /** affinity 데이터 */
  affinity?: AffinityOptions;
};

/**
 * 추가 기능이 확장된 어플리케이션 히스토리 상태
 *
 * 일반적인 `state` 외 히스토리 노드 관리를 위한 추가적인 데이터를 가지고 있습니다.
 */
export type AdvancedHistoryState<T = unknown> = {
  /** state 원본 데이터 */
  data: T;
  /** 히스토리 노드 */
  node: AdvancedHistoryNode;
};

export type AdvancedHistoryStateEvent<T = unknown> = {
  /**
   * 히스토리 변경 이벤트 타입
   */
  type: "push" | "pop" | "replace";
  state: AdvancedHistoryState<T>;
};

export type AdvancedHistoryStateEventHandler<T = unknown> = (
  event: AdvancedHistoryStateEvent<T>
) => void;

export interface AdvancedHistoryStateEventListener<T = unknown> {
  onAdvancedHistoryStateChange: AdvancedHistoryStateEventHandler<T>;
}
