import { AdvancedHistoryNode, AdvancedHistoryState } from "../AdvancedHistory.type";
import { isAdvancedHistoryState, satisfiesAdvancedHistoryState } from "../AdvancedHistory.util";
import { SessionStorageAdapter, Storage } from "../storage/HistoryStorage";
import {
  AdvancedHistoryNodeManager,
  HistoryNavigationEvent,
  HistoryNavigationEventListener,
} from "./HistoryNodeManager.type";

/**
 * 히스토리 상태 추적 매니저
 *
 * push/replace/pop 이벤트를 감지하고 개별 노드 상태를 관리합니다.
 * 전체 노드 리스트와 현재 위치를 추적합니다.
 */
export class AdvancedHistoryNodeManagerImpl implements AdvancedHistoryNodeManager {
  private readonly storage: Storage<AdvancedHistoryNode[]>;
  private readonly listeners: Set<HistoryNavigationEventListener> = new Set();
  private _nodes: AdvancedHistoryNode[] = [];
  private _position: number | null = null;

  constructor(storageKey = "advanced-history-nodes") {
    this.storage = new SessionStorageAdapter(storageKey);
    // 자체 초기화
    const nodes = this.storage.restore();
    // 저장된 노드가 없으면 초기화
    if (!nodes || nodes.length === 0) {
      this.init(history.state);
    }
    // 저장된 노드가 있으면 복원
    else {
      this.restore(nodes, history.state);
    }
  }

  private init(state: unknown) {
    this._position = 0;
    this.onReplaceState(satisfiesAdvancedHistoryState(state));
  }

  private restore(nodes: AdvancedHistoryNode[], state: unknown): void {
    // 노드 교체 저장
    this._nodes.splice(0, this._nodes.length - 1, ...nodes);
    // 현재 state 가 관리되었던 state 라면 그 노드의 인덱스를 이용해서 position 찾기
    if (isAdvancedHistoryState(state)) {
      this._position = this._nodes.findIndex((n) => n.id === state.node.id);
      console.log("restored position", this._position);
    }
    // position 복구 불가능.
    else {
      throw new Error("current state is not AdvancedHistoryState");
    }
  }

  private onNavigated(event: HistoryNavigationEvent): void {
    console.debug("onNavigated", event);

    // affinity 봉인 상태면, strategy 에 따라 이동한다.
    // 봉인 상태라서 진입 된 것을 리스너에 알리지 않는다.
    if (event.current.affinity?.sealed) {
      // TODO:  window.history 직접 참조하는게 맞는가?
      const forward = 0 < event.delta;
      switch (event.current.affinity?.strategy) {
        // 되돌려야 하면 delta 의 반대 방향으로 이동
        case "snapback":
          window.history.go(forward ? -1 : 1);
          break;
        // 통과해야 하면 delta 방향으로 이동
        case "passthrough":
          window.history.go(forward ? 1 : -1);
          break;
        default:
          break;
      }
      return;
    }

    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * 현재 노드 리스트 반환 (읽기 전용)
   */
  get nodes(): readonly AdvancedHistoryNode[] {
    return [...this._nodes];
  }

  get currentNode(): AdvancedHistoryNode {
    return this.nodes[this.position];
  }

  /**
   * 현재 위치 반환
   */
  get position(): number {
    if (this._position === null) {
      throw new Error("position is not initialized");
    }
    return this._position;
  }

  removeHistoryNavigationListener(listener: HistoryNavigationEventListener): void {
    this.listeners.delete(listener);
  }

  addHistoryNavigationListener(listener: HistoryNavigationEventListener): void {
    this.listeners.add(listener);
  }

  flush(): void {
    this.storage.save(this._nodes); // 노드 목록 저장
  }

  affect(action: (node: AdvancedHistoryNode) => void): void {
    this._nodes.forEach(action);
  }

  /**
   * push 이벤트 처리 - 새 노드 추가
   */
  onPushState(state: AdvancedHistoryState): void {
    // 현재 위치 이후 모든 노드를 제거하고, 현재 위치에 새 노드 추가
    const previousPosition = this.position;
    const previousNode = this.nodes[previousPosition];
    const currentNode = state.node;
    const currentPosition = this.position + 1;
    // 현재 위치 다음에 이미 존재하는 노드는 모두 제거되어야 함.
    this._nodes.splice(currentPosition, this._nodes.length - currentPosition, currentNode);
    this._position = currentPosition; // 포지션 업데이트

    // notify node changed
    this.onNavigated({
      previous: previousNode,
      current: currentNode,
      delta: currentPosition - previousPosition, // 노드 이동 벡터(방향과 거리)
      type: "push",
    });
  }

  /**
   * replace 이벤트 처리 - 현재 노드 교체
   */
  onReplaceState(state: AdvancedHistoryState): void {
    const previousPosition = this.position;
    const previousNode = this.nodes[previousPosition];
    const currentNode = state.node;
    this._nodes.splice(this.position, 1, currentNode);

    // notify node changed
    this.onNavigated({
      previous: previousNode,
      current: currentNode,
      delta: 0,
      type: "replace",
    });
  }

  /**
   * pop 이벤트 처리 - 기존 노드로 이동
   */
  onPopState(state: AdvancedHistoryState): void {
    const previousPosition = this.position;
    const previousNode = this.nodes[previousPosition];
    const currentPosition = this.nodes.findIndex((n) => n.id === state.node.id);
    // 현재 노드는 항상 찾을 수 있어야 합니다.
    if (currentPosition === -1) {
      throw new Error("current node not found");
    }
    const currentNode = this.nodes[currentPosition];
    this._position = currentPosition; // 포지션 업데이트
    const delta = currentPosition - previousPosition; // 노드 이동 벡터(방향과 거리)

    // notify node changed
    this.onNavigated({
      previous: previousNode,
      current: currentNode,
      delta,
      type: "pop",
    });
  }
}
