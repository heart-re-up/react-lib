import { v4 as uuid } from "uuid";
import { HistoryNode } from "../types/HistoryNode";
import {
  HISTORY_NODE_KEY,
  HistoryState,
  isHistoryState,
} from "../types/HistoryState";
/**
 * ManagedState 생성
 */
export const satisfiesManagedState = <T = unknown>(
  state: T,
  position: number,
  pathname: string,
  affinity?: string,
  initial?: true | undefined,
  metadata?: Record<string, unknown>
): HistoryState<T> => {
  // 이미 ManagedState인 경우 그대로 반환
  if (isHistoryState<T>(state)) {
    return state;
  }

  // 노드 생성
  const node: HistoryNode = {
    id: uuid(),
    timestamp: Date.now(),
    affinity,
    pathname,
    position,
    initial,
    metadata,
  };

  // 객체인 경우 spread, 아닌 경우 value로 래핑
  if (state !== null && typeof state === "object") {
    return {
      ...state,
      __node__: node,
    } as HistoryState<T>;
  } else {
    return {
      value: state,
      __node__: node,
    } as HistoryState<T>;
  }
};

/**
 * HistoryState에서 노드를 추출합니다.
 * @param state HistoryState
 * @returns HistoryNode
 */
export const getNodeFromState = <T = unknown>(
  state: HistoryState<T>
): HistoryNode => {
  return state[HISTORY_NODE_KEY];
};
