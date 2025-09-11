import { NavigationChangeEvent } from "../core/HistoryManager.type";
import { HistoryNode } from "../types/HistoryNode";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState } from "../types/HistoryState";

/**
 * 노드 관리자 인터페이스
 */
export interface NodeManager {
  /** 현재 노드 목록 (읽기 전용) */
  readonly nodes: readonly Readonly<HistoryNode>[];

  /** 현재 위치 */
  readonly position: number;

  /** 현재 노드 */
  readonly currentNode: Readonly<HistoryNode>;

  /** 초기화 */
  initialize(state: unknown): HistoryState<unknown>;

  getNodeByPosition(position: number): Readonly<HistoryNode> | undefined;

  /** 노드 찾기 */
  find(finder: PredicateHistoryNode): Readonly<HistoryNode> | undefined;

  findNodeById(id: string): Readonly<HistoryNode> | undefined;

  /** push 요청 처리 */
  requestPush<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /** replace 요청 처리 */
  requestReplace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /** pop 이벤트 처리 */
  onPopState(state: HistoryState): void;

  seal(id: string): void;

  unseal(id: string): void;

  sealAffinity(affinityId: string): void;

  unsealAffinity(affinityId: string): void;

  /** 네비게이션 동작 수행 필요 콜백 설정 */
  setOnNavigate(onNavigate: OnNavigate): void;

  /** 네비게이션 리스너 추가 */
  addNavigationListener(listener: NavigationEventListener): void;

  /** 네비게이션 리스너 제거 */
  removeNavigationListener(listener: NavigationEventListener): void;
}

/**
 * 노드 찾기 조건
 */
export type PredicateHistoryNode = (
  value: HistoryNode,
  index: number,
  obj: readonly HistoryNode[]
) => boolean;

/**
 * 네비게이션 이벤트 리스너
 */
export type NavigationEventListener = (event: NavigationChangeEvent) => void;

// 네비게이션 동작 수행 필요 콜백
export type OnNavigate = (delta: number) => void;

/**
 * 스토리지 인터페이스
 */
export interface Storage<T> {
  save(data: T): void;
  restore(defaultValue: T): T;
  clear(): void;
}
