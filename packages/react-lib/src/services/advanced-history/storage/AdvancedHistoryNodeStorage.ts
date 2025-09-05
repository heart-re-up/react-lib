import { AdvancedHistoryNode } from "../AdvancedHistory.type";

/**
 * 히스토리 저장소 인터페이스
 */
export interface AdvancedHistoryNodeStroage {
  saveNodes(nodes: readonly AdvancedHistoryNode[]): void;
  restoreNodes(): AdvancedHistoryNode[];
  removeNodes(): void;
}

/**
 * SessionStorage 구현체
 */
export class AdvancedHistoryNodeStroageImpl implements AdvancedHistoryNodeStroage {
  constructor(private readonly storageKey: string = "advanced-history-state") {}

  saveNodes(nodes: readonly AdvancedHistoryNode[]): void {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(nodes));
    } catch (error) {
      console.warn("SessionStorage setItem failed:", error);
    }
  }

  restoreNodes(): AdvancedHistoryNode[] {
    try {
      const serialized = sessionStorage.getItem(this.storageKey);
      if (!serialized) {
        return [];
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.warn("SessionStorage getItem failed:", error);
      return [];
    }
  }

  removeNodes(): void {
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn("SessionStorage removeItem failed:", error);
    }
  }
}
