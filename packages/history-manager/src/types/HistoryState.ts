import { HistoryNode } from "./HistoryNode";

/** 히스토리 노드 키 상수 */
export const HISTORY_SEALED_KEY = "__sealed__" as const;
export const HISTORY_NODE_KEY = "__node__" as const;

/** 추가 관리 데이터인 노드를 포함한 객체 */
export type HavingHistoryNode = {
  [HISTORY_NODE_KEY]: HistoryNode;
  [HISTORY_SEALED_KEY]?: boolean;
};

/** 객체 값 타입 데이터에 노드를 포함한 객체 */
export type ObjectState<T = unknown> = T & HavingHistoryNode;

/** 단일 값 타입 데이터에 노드를 포함한 객체 */
export type ValueState<T = unknown> = { value: T } & HavingHistoryNode;

/** 관리되는 History State */
export type HistoryState<T = unknown> = T extends object
  ? ObjectState<T>
  : ValueState<T>;

/** 추가 관리 데이터인 노드를 포함한 객체 타입 가드 */
export const isHavingHistoryNode = (
  state: unknown
): state is HavingHistoryNode => {
  return (
    typeof state === "object" && state !== null && HISTORY_NODE_KEY in state
  );
};

/** 객체 값 타입 데이터에 노드를 포함한 객체 타입 가드 */
export const isObjectState = <T = unknown>(
  state: unknown
): state is ObjectState<T> => {
  return (
    isHavingHistoryNode(state) && typeof state === "object" && state !== null
  );
};

/** 단일 값 타입 데이터에 노드를 포함한 객체 타입 가드 */
export const isValueState = <T = unknown>(
  state: unknown
): state is ValueState<T> => {
  return (
    isHavingHistoryNode(state) &&
    typeof state === "object" &&
    state !== null &&
    "value" in state
  );
};

/** HistoryState 타입 가드 */
export const isHistoryState = <T = unknown>(
  state: unknown
): state is HistoryState<T> => {
  return isObjectState(state) || isValueState(state);
};
