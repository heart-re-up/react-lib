import { AdvancedHistoryNode, AdvancedHistoryState } from "../AdvancedHistory.type";

export type HistoryNavigationEvent = {
  type: "push" | "replace" | "pop";
  delta: number;
  current: AdvancedHistoryNode;
  previous: AdvancedHistoryNode;
};

export type HistoryNavigationEventListener = (event: HistoryNavigationEvent) => void;

export interface HistoryNavigationEventEmitter {
  addHistoryNavigationListener(listener: HistoryNavigationEventListener): void;
  removeHistoryNavigationListener(listener: HistoryNavigationEventListener): void;
}

export interface AdvancedHistoryNodeManager extends HistoryNavigationEventEmitter {
  readonly nodes: readonly AdvancedHistoryNode[];
  readonly currentNode: AdvancedHistoryNode;
  readonly position: number;
  /** 노드 목록 저장 */
  flush(): void;
  /** 노드 목록에 대해 작업을 수행합니다. */
  affect(action: (node: AdvancedHistoryNode) => void): void;
  /** 히스토리 상태가 삽입되었을 때 호출됩니다. */
  onPushState(state: AdvancedHistoryState): void;
  /** 히스토리 상태가 교체되었을 때 호출됩니다. */
  onReplaceState(state: AdvancedHistoryState): void;
  /** 히스토리 상태가 제거되었을 때 호출됩니다. */
  onPopState(state: AdvancedHistoryState): void;
}
