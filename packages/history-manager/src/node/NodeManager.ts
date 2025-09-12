import { HistoryNode } from "../types/HistoryNode";
import {
  HistoryNodeChangeEvent,
  HistoryNodeChangeEventListener,
} from "../types/HistoryNodeChangeEvent";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState, isHistoryState } from "../types/HistoryState";
import { sliceWithDirection } from "../utils/sliceWithDirection";
import { findNodeById } from "./FindNode";
import { NodeManager, PredicateHistoryNode } from "./NodeManager.type";
import {
  findNearestIndex,
  getNodeFromState,
  satisfiesManagedState,
} from "./NodeManager.utils";
import { SessionStorageAdapter, Storage } from "./Storage";

/**
 * 노드 관리자 구현체
 */
class NodeManagerImpl implements NodeManager {
  private readonly storage: Storage<HistoryNode[]>;
  private readonly listeners: Set<HistoryNodeChangeEventListener> = new Set();
  private _nodes: HistoryNode[] = [];
  private _position: number = 0;

  constructor(storageKey = "history-manager-nodes") {
    this.storage = new SessionStorageAdapter(storageKey);
    // popstate 이벤트 리스닝
    window.addEventListener("popstate", (event) => {
      // popstate 이벤트를 처리하고, 이동이 필요한 경우 즉시 이동합니다.
      // 이 이동은 node 작업이 필요없는 단순 이동이기 때문에 여기서 즉시 이동합니다.
      const delta: number | undefined = this.onPopState(event.state);
      // 조심!!! delta 가 0 이면 페이지가 새로고침됩니다.
      if (delta === undefined || delta === 0) {
        return;
      }
      window.history.go(delta);
    });
  }

  private get pathname(): string {
    return (
      window.location.pathname + window.location.search + window.location.hash
    );
  }

  private flush(): void {
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
      "managed",
      undefined, // affinity
      true, // initial
      undefined // metadata
    );
    this._nodes = [getNodeFromState(initialState)];
    this.flush(); // 저장

    // 초기화된 상태 반환
    return initialState;
  }

  addHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void {
    this.listeners.add(listener);
  }

  removeHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void {
    this.listeners.delete(listener);
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
      console.debug("관리중인 노드를 복구했습니다.");
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
    return this._position;
  }

  private setPosition(position: number): void {
    this._position = position;
  }

  get currentNode(): HistoryNode {
    return this._nodes[this.position];
  }

  private setCurrentNode(node: HistoryNode): void {
    this._nodes[this.position] = node;
  }

  /**
   * pushState 를 수행하기 전에 node 작업을 처리합니다.
   * @param data
   * @param url
   * @param options
   * @returns
   */
  onPush<T = unknown>(
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
      options?.intercepted ? "intercepted" : "managed",
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
      traversal: [currentNode, nextNode],
    });
    return state;
  }

  onReplace<T = unknown>(
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
      options?.intercepted ? "intercepted" : "managed",
      options?.affinity,
      undefined, // initial
      options?.metadata
    );
    const replacedNode = getNodeFromState(state);
    this.setCurrentNode(replacedNode);
    this.flush();

    // 이벤트 알림을 비동기로 처리하여 useHistory의 stateRef 설정이 완료된 후 실행되도록 함
    this.notifyListeners({
      type: "replace",
      delta: 0,
      traversal: [replacedNode],
    });
    return state;
  }

  /**
   * popstate 이벤트에서 현재 노드를 찾아서 이벤트를 발생시킵니다.
   *
   * @param state history 에서 획득한 state
   * @returns 이동할 히스토리 델타(이동거리). 추가 이동이 필요한 경우에는 0이 아님.
   */
  onPopState(state: unknown): number | undefined {
    // 관리중이 아닌 노드가 발견되면 안된다.
    if (!isHistoryState(state)) {
      throw new Error(
        "NodeManager:onPopState - state is not managed history state"
      );
    }

    const popNodeId = getNodeFromState(state).id;
    const prevNode = this.currentNode;
    const currNode = findNodeById(this._nodes, popNodeId);

    // state 를 통해 획득한 데이터는 history 으로부터 획득한 데이터이다.
    // session storage 에 동기화 중인 데이터와 맞지 않는다면 현재 노드가 발견되지 않을 수 있다.
    if (currNode === undefined) {
      console.error(
        "NodeManager:onPopState",
        "state 의 노드 아이디로 현재 노드를 찾을 수 없습니다."
      );
      return;
    }

    // 이전 노드로부터 현재 노드까지 이동한 거리
    const delta = currNode.position - prevNode.position;

    // 봉인되지 않은 노드라면, 정상적으로 포지션을 변경시키고, 이벤트를 발생시킵니다.
    if (!currNode.sealed) {
      this.setPosition(currNode.position);
      this.notifyListeners({
        type: "pop",
        delta,
        // traversal(가로지른) 노드 계산 (시작 및 종료 노드 포함)
        traversal: sliceWithDirection(
          this._nodes,
          prevNode.position,
          currNode.position
        ),
      });
      return;
    }

    // 현재 노드는 봉인된 노드입니다.
    // 봉인된 노드에 머물지 않기 위해서 봉인되지 않은 노드를 찾고, 해당 노드까지의 delta 를 반환합니다.
    // 또한 지금 popstate 이벤트에 대응하여 네비게이션 이벤트를 발생시키지 않습니다.

    // 봉인되지 않은 노드의 위치를 찾습니다.
    // passthrough 방향으로 탐색해야 하기 때문에 delta 가 양수면 forward 방향을 계속 탐색한다.
    const nearestUnsealedPosition = findNearestIndex(
      this._nodes, // 노드 목록
      (node) => !node.sealed, // 봉인되지 않은 노드 찾기
      currNode.position, // 탐색 시작위치(exclusive)
      Math.sign(delta) // delta to signum step
    );

    // 봉인되지 않은 노드를 찾았다면 그 위치로 이동
    // 봉인되지 않은 노드를 찾지 못했다면 원래 위치로 되돌아감
    return nearestUnsealedPosition !== -1
      ? nearestUnsealedPosition - currNode.position // 봉인되지 않은 노드까지의 delta
      : prevNode.position - currNode.position; // 원래 위치로 되돌아갈 delta
  }

  private notifyListeners(event: HistoryNodeChangeEvent): void {
    // 일반 이벤트 전달
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in navigation listener:", error);
      }
    });
  }

  seal(id: string): void {
    const found = findNodeById(this._nodes, id);
    if (found === undefined) {
      console.warn("seal", "node not found", id);
      return;
    }
    found.sealed = true;
    this.flush();
  }

  unseal(id: string): void {
    const found = findNodeById(this._nodes, id);
    if (found === undefined) {
      console.warn("unseal", "node not found", id);
      return;
    }
    found.sealed = false;
    this.flush();
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
}

let instance: NodeManager | null = null;

// 싱글톤 인스턴스를 반환하는 함수
export const getNodeManager = (): NodeManager => {
  if (instance === null) {
    instance = new NodeManagerImpl();
  }
  return instance;
};
