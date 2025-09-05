import { AdvancedHistory, AdvancedHistoryNode, AffinityState } from "../AdvancedHistory.type";
import { AdvancedHistoryAffinity } from "./AdvancedHistoryAffinity.type";

export class AdvancedHistoryAffinityImpl implements AdvancedHistoryAffinity {
  private readonly history: AdvancedHistory;

  constructor(history: AdvancedHistory) {
    this.history = history;
  }

  private findAffinityNodes(affinityId: string): AdvancedHistoryNode[] {
    return this.history.nodeManager.nodes.filter(
      (node) => node.affinity?.affinityId === affinityId
    );
  }

  private findFirstAffinityNodeIndex(affinityId: string): number {
    return this.history.nodeManager.nodes.findIndex(
      (node) => node.affinity?.affinityId === affinityId
    );
  }

  private computeAffinityBaseDelta(affinityId: string): number {
    // 관련 히스토리 노드를 찾는다.
    const affinities = this.findAffinityNodes(affinityId);
    if (affinities.length === 0) {
      console.warn("backAffinity", affinityId, "not found");
      return -1;
    }

    // 되돌아 가기 위한 첫번째 노드의 위치를 찾는다.
    const firstAffinityNodeIndex = this.findFirstAffinityNodeIndex(affinityId);
    if (firstAffinityNodeIndex === -1) {
      console.warn("backAffinity", affinityId, "not found");
      return -1;
    }
    return firstAffinityNodeIndex - this.history.nodeManager.position;
  }

  updateAffinityState(affinityId: string, state: Partial<AffinityState>): void {
    this.history.nodeManager.affect((node) => {
      if (node.affinity?.affinityId === affinityId) {
        node.affinity = { ...node.affinity, ...state };
      }
    });
    this.history.nodeManager.flush();
  }

  backAffinity(state?: Partial<AffinityState>): void {
    const currentNode = this.history.nodeManager.currentNode;
    const affinityId = currentNode.affinity?.affinityId;
    if (!affinityId) {
      console.warn("backAffinity", affinityId, "not found");
      return;
    }
    // 관련 히스토리 노드의 상태들을 변경한다.
    if (state) {
      this.updateAffinityState(affinityId, state);
    }
    const delta = this.computeAffinityBaseDelta(affinityId);
    history.go(delta); // affinity 베이스까지 뒤로가기
  }

  exitAffinity(state?: Partial<AffinityState>): void {
    const currentNode = this.history.nodeManager.currentNode;
    const affinityId = currentNode.affinity?.affinityId;
    if (!affinityId) {
      console.warn("exitAffinity", affinityId, "not found");
      return;
    }
    // 관련 히스토리 노드의 상태들을 변경한다.
    if (state) {
      this.updateAffinityState(affinityId, state);
    }
    const delta = this.computeAffinityBaseDelta(affinityId);
    history.go(delta - 1); // affinity 베이스도 탈출해야 하니 1만큼 더 뒤로가기
  }
}
