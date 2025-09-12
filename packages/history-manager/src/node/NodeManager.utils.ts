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
  source: "managed" | "intercepted",
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
    source,
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

/**
 * 지정된 방향으로 조건을 만족하는 가장 가까운 요소의 위치를 찾습니다.
 *
 * @param arr 대상 배열
 * @param predicate 조건 함수
 * @param start 시작 위치 (exclusive)
 * @param step 검색 방향과 거리 (양수: 앞으로(to tail), 음수: 뒤로(to head), 0: 검색 안함)
 * @returns 조건을 만족하는 요소의 위치, 없으면 -1
 */
export const findNearestIndex = <T>(
  arr: T[],
  predicate: (e: T) => boolean,
  start: number,
  step: number
): number => {
  if (step === 0) return -1; // 방향이 없으면 -1
  if (start < 0 || start >= arr.length) return -1; // 시작 위치가 배열 범위를 벗어나면 -1

  // traverse until found or out of range
  let index = start + step;
  while (index >= 0 && index < arr.length) {
    if (predicate(arr[index])) return index; // found and return index
    index += step; // next index
  }
  return -1; // not found
};
