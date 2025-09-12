import { HistoryNode } from "../types/HistoryNode";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState } from "../types/HistoryState";
import { HistoryNodeChangeEventHandler } from "../types/HistoryNodeChangeEvent";

/**
 * 노드 관리자 인터페이스
 */
export interface NodeManager extends HistoryNodeChangeEventHandler {
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

  /** push 요청 처리 */
  onPush<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /** replace 요청 처리 */
  onReplace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>>;

  /**
   * pop 이벤트 처리
   * @param state pop 이벤트 발생 후 현재 상태
   * @returns 이동할 히스토리 델타(이동거리)로써, 해당 상태에 의해서 추가 이동이 필요한 경우 0이 아님.
   */
  onPopState(state: unknown): number | undefined;

  seal(id: string): void;

  unseal(id: string): void;

  sealAffinity(affinityId: string): void;

  unsealAffinity(affinityId: string): void;
}

/**
 * 노드 찾기 조건
 */
export type PredicateHistoryNode = (
  value: HistoryNode,
  index: number,
  obj: readonly HistoryNode[]
) => boolean;
