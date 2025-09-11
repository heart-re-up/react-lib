import { NavigationChangeEvent } from "../core/HistoryManager.type";
import { HistoryNode } from "../types/HistoryNode";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState, isHistoryState } from "../types/HistoryState";
import {
  NavigationEventListener,
  NodeManager,
  OnNavigate,
  PredicateHistoryNode,
  Storage,
} from "./NodeManager.type";
import { getNodeFromState, satisfiesManagedState } from "./NodeManager.utils";
import { SessionStorageAdapter } from "./SessionStorageAdapter";

/**
 * 노드 관리자 구현체
 */
class NodeManagerImpl implements NodeManager {
  private readonly storage: Storage<HistoryNode[]>;
  private readonly listeners: Set<NavigationEventListener> = new Set();
  private onNavigate: OnNavigate | undefined;
  private _nodes: HistoryNode[] = [];
  private _position: number = 0;

  constructor(storageKey = "history-manager-nodes") {
    this.storage = new SessionStorageAdapter(storageKey);
    // popstate 이벤트 리스닝
    window.addEventListener("popstate", (event) => {
      this.onPopState(event.state);
    });
  }

  private get pathname(): string {
    return (
      window.location.pathname + window.location.search + window.location.hash
    );
  }

  private flush(): void {
    console.debug("flush");
    this.storage.save(this._nodes);
  }

  /**
   * 매니저를 초기 상태로 리셋하고 초기 HistoryState를 반환
   * - position을 0으로 설정
   * - nodes 배열을 초기 노드 하나만 포함하도록 설정
   * - 스토리지에 변경사항 저장
   */
  private resetToInitialState(state: unknown): HistoryState<unknown> {
    this.setPosition(0);
    const initialState = satisfiesManagedState<unknown>(
      state,
      this._position,
      this.pathname,
      undefined, // affinity
      true // initial
    );
    this._nodes = [getNodeFromState(initialState)];
    this.flush(); // 저장

    // 초기화된 상태 반환
    return initialState;
  }

  /**
   * 초기화
   * 노드 상태를 초기화 해야하는 경우 초기화 하고, 복구가 가능한 경우 복구합니다.
   *
   * @param state 초기화할 상태
   * @returns 관리되는 상태로 변환된 초기화된 상태
   */
  initialize(state: unknown): HistoryState<unknown> {
    const nodes = this.storage
      .restore([])
      .sort((a, b) => a.position - b.position);
    // 현재 상태가 관리중이 아니거나, 노드 자체가 존재하지 않음.
    // 초기화를 수행한다.
    if (!isHistoryState(state) || nodes.length === 0) {
      console.debug(
        "초기화 하려는 상태가 관리중인 히스토리가 아니거나 관리중인 노드 목록이 없습니다. 초기화를 수행합니다."
      );
      return this.resetToInitialState(state);
    }

    // 현재 상태가 관리중이고 노드도 존재한다.
    // 현재 상태가 저장된 nodes에 있는지 확인하고 있다면 복구한다.
    // 아직 노드 목록이 복구된 상태가 아니기 때문에 요소의 id 로 찾는다.
    const position = nodes.findIndex(
      (n) => n.id === getNodeFromState(state).id
    );

    // 찾지 못했다. 노드 목록을 사용할 수 없다. 초기화를 수행.
    if (position === -1) {
      console.debug(
        "관리중인 노드 목록에서 초기화 하려는 상태의 노드를 찾을 수 없습니다. 초기화를 수행합니다."
      );
      return this.resetToInitialState(state);
    }
    // 찾았다. 복구한다.
    else {
      this.setPosition(position);
      this._nodes = [...nodes];
      console.debug(
        [
          `관리중인 노드를 복구했습니다.`,
          `현재 상태: ${JSON.stringify(state, null, 2)}`,
          `전체 노드: ${JSON.stringify(this._nodes, null, 2)}`,
          `현재 노드: ${JSON.stringify(this.currentNode, null, 2)}`,
          `현재 position: ${this._position}`,
        ].join("\n")
      );
      return state;
    }
  }

  getNodeByPosition(position: number): HistoryNode | undefined {
    return this.nodes[position];
  }

  find(finder: PredicateHistoryNode): HistoryNode | undefined {
    return this.nodes.find(finder);
  }

  get nodes(): readonly Readonly<HistoryNode>[] {
    return [...this._nodes];
  }

  get position(): number {
    console.debug("getPosition", this._position);
    return this._position;
  }

  setPosition(position: number): void {
    console.debug("setPosition", position);
    this._position = position;
  }

  get currentNode(): HistoryNode {
    return this._nodes[this.position];
  }

  requestPush<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): HistoryState<T> {
    const currentNode = this.nodes[this.position];
    const nextPosition = this.position + 1;

    const pathname =
      (typeof url === "string" ? url : url?.pathname) ?? this.pathname;

    // HistoryState 생성 (올바른 position 포함)
    const state = satisfiesManagedState(
      data,
      nextPosition,
      pathname,
      options?.affinity,
      undefined, // initial
      options?.metadata
    );

    const nextNode = getNodeFromState(state);

    // 현재 위치 이후의 노드들 제거하고 새 노드 추가
    this._nodes.splice(
      nextPosition,
      this._nodes.length - nextPosition,
      nextNode
    );
    this.setPosition(nextPosition);
    this.flush();

    // 이벤트 알림을 비동기로 처리하여 useHistory의 stateRef 설정이 완료된 후 실행되도록 함
    this.notifyListeners({
      type: "push",
      delta: 1,
      previous: currentNode,
      current: nextNode,
      traversal: [currentNode, nextNode],
    });
    return state;
  }

  requestReplace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): HistoryState<T> {
    const currentNode = this.currentNode;
    const nextPosition = this.position;
    const pathname =
      (typeof url === "string" ? url : url?.pathname) ?? this.pathname;

    // HistoryState 생성 (현재 position 유지)
    const state = satisfiesManagedState(
      data,
      nextPosition,
      pathname,
      options?.affinity,
      undefined, // initial
      options?.metadata
    );
    const replacedNode = getNodeFromState(state);
    this._nodes[this._position] = replacedNode;
    this.flush();

    // 이벤트 알림을 비동기로 처리하여 useHistory의 stateRef 설정이 완료된 후 실행되도록 함
    this.notifyListeners({
      type: "replace",
      delta: 0,
      previous: currentNode,
      current: replacedNode,
      traversal: [replacedNode],
    });
    return state;
  }

  onPopState(state: unknown): void {
    console.debug("onPopState", "state", state);
    // 이미 history 의 position 이 변경되었다.
    // 이 manager 의 position 은 preavious 가 되었다.
    const previousPosition = this.position;
    const previousNode = this.currentNode;

    // 노드로 관리중인 아닌 상태는 진입 이벤트를 발생 시킬수가 없다.
    if (!isHistoryState(state)) {
      console.error("onPopState", "state is not history state", state);
      this.notifyListeners({
        type: "pop",
        delta: 0,
        previous: previousNode,
      });
      return;
    }

    const currentNode = this.findNodeById(getNodeFromState(state).id);
    if (currentNode === undefined) {
      console.error(
        "onPopState",
        "current node not found",
        getNodeFromState(state).id
      );
      return;
    }
    const currentPosition = currentNode.position;
    const delta = currentPosition - previousPosition;

    console.debug(
      "onPopState",
      "node position changed",
      "prev:",
      previousPosition,
      "current:",
      currentPosition
    );

    // 현재 노드가 봉인되 노드가 아니면 도착 상태로 마무리한다.
    if (!currentNode.sealed) {
      console.debug("onPopState", "current node is not sealed", currentNode);
      this.setPosition(currentPosition);
      // Traversal 계산 (중간 노드 포함)
      const traversal = this.calculateTraversal(
        previousPosition,
        currentPosition
      );

      this.notifyListeners({
        type: "pop",
        delta,
        previous: previousNode,
        current: currentNode,
        traversal,
      });
    }
    // 현재 노드가 봉인된 노드인 경우 지금 이벤트를 발행하지 않고, 진행방향의 히스토리 중 sealed 되지 않은 노드를 찾는다.
    // 그리고 그 히스토리까지 go 함수로 이동시킨다.
    else {
      console.debug("onPopState", "current node is sealed", currentNode);
      const forward = delta > 0;
      console.debug("onPopState", "forward", forward);

      // sealed되지 않은 노드를 찾아서 그 위치로 이동
      const targetPosition = this.findNearestUnsealedNode(
        currentPosition,
        forward
      );

      if (targetPosition !== -1) {
        const delta = targetPosition - currentPosition;
        console.debug(
          "onPopState",
          "found unsealed node at position",
          targetPosition
        );
        console.debug("onPopState", "skipCount to unsealed node", delta);
        this.onNavigate?.(delta);
      } else {
        console.debug(
          "onPopState",
          "no unsealed node found in direction",
          forward
        );
        // unsealed 노드가 없으면 원래 위치로 되돌아감
        const skipCount = Math.abs(previousPosition - currentPosition);
        this.onNavigate?.(forward ? -skipCount : skipCount);
      }
    }
  }

  /**
   * 지정된 방향으로 sealed되지 않은 가장 가까운 노드의 위치를 찾습니다.
   * @param startPosition 시작 위치
   * @param forward 검색 방향 (true: 앞으로, false: 뒤로)
   * @returns unsealed 노드의 위치, 없으면 -1
   */
  private findNearestUnsealedNode(
    startPosition: number,
    forward: boolean
  ): number {
    const step = forward ? 1 : -1;
    const endPosition = forward ? this._nodes.length : -1;

    for (
      let i = startPosition + step;
      forward ? i < endPosition : i > endPosition;
      i += step
    ) {
      const node = this._nodes[i];
      if (node && !node.sealed) {
        console.debug(
          "findNearestUnsealedNode",
          "found unsealed node at position",
          i
        );
        return i;
      }
    }

    return -1; // unsealed 노드를 찾지 못함
  }

  private calculateTraversal(from: number, to: number): HistoryNode[] {
    const step = Math.sign(to - from);
    const traversal: HistoryNode[] = [];

    for (let i = from; i !== to + step; i += step) {
      if (i >= 0 && i < this._nodes.length) {
        traversal.push(this._nodes[i]);
      }
    }

    return traversal;
  }

  private notifyListeners(event: NavigationChangeEvent): void {
    // 일반 이벤트 전달
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in navigation listener:", error);
      }
    });
  }

  findNodeById(id: string): HistoryNode | undefined {
    return this._nodes.find((node) => node.id === id);
  }

  seal(id: string): void {
    console.debug("seal", id);
    const targetNode = this.findNodeById(id);
    if (targetNode) {
      console.debug("seal", "target node found", targetNode);
      targetNode.sealed = true;
      this.flush();
    } else {
      console.debug("seal", "target node not found", id);
    }
  }

  unseal(id: string): void {
    console.debug("unseal", id);
    const targetNode = this.findNodeById(id);
    if (targetNode) {
      targetNode.sealed = false;
      this.flush();
    }
  }

  sealAffinity(affinity: string): void {
    this._nodes
      .filter((node) => node.affinity === affinity)
      .forEach((node) => (node.sealed = true));
    this.flush();
  }

  unsealAffinity(affinity: string): void {
    this._nodes
      .filter((node) => node.affinity === affinity)
      .forEach((node) => (node.sealed = false));
    this.flush();
  }

  affect(action: (node: HistoryNode) => void): void {
    this._nodes.forEach(action);
    this.flush();
  }

  setOnNavigate(onNavigate: OnNavigate): void {
    this.onNavigate = onNavigate;
  }

  addNavigationListener(listener: NavigationEventListener): void {
    this.listeners.add(listener);
  }

  removeNavigationListener(listener: NavigationEventListener): void {
    this.listeners.delete(listener);
  }
}

let instance: NodeManager | null = null;

// 싱글톤 인스턴스를 반환하는 함수
export const getNodeManager = (): NodeManager => {
  if (instance === null) {
    instance = new NodeManagerImpl();
  }
  return instance;
};
