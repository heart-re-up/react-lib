import { HistoryNode } from ".";

/**
 * 네비게이션 변경 이벤트
 */

export interface HistoryNodeChangeEvent {
  type: "push" | "replace" | "pop";
  delta: number;
  traversal: HistoryNode[]; // 경로상의 모든 노드
} /**
 * 네비게이션 이벤트 리스너
 */

export type HistoryNodeChangeEventListener = (
  event: HistoryNodeChangeEvent
) => void;

export type HistoryNodeChangeEventHandler = {
  addHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void;
  removeHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void;
};
