/**
 * 전역 히스토리 관리자
 * 원본 히스토리 메서드를 백업하고 접근 방법을 제공합니다.
 * 리스너들은 컴포넌트 생명주기에 따라 동적으로 관리됩니다.
 */
class BackupStateChangeFunctions {
  private pushState?: History["pushState"];
  private replaceState?: History["replaceState"];
  private initialized: boolean = false;

  /**
   * 원본 히스토리 메서드를 백업합니다.
   * 여러 번 호출되어도 안전하게 처리됩니다.
   */
  backupOriginalMethods(history: History = window.history): void {
    if (this.initialized) {
      console.debug("BackupHistory backupOriginalMethods already initialized");
      return;
    }
    // 원본 메서드 백업
    this.pushState = history.pushState.bind(history);
    this.replaceState = history.replaceState.bind(history);
    this.initialized = true;
    console.debug("BackupHistory backupOriginalMethods initialized");
  }

  /**
   * 원본 pushState 메서드를 반환합니다.
   */
  getOriginalPushState(): History["pushState"] {
    if (!this.pushState) {
      throw new Error("History methods not backed up");
    }
    return this.pushState;
  }

  /**
   * 원본 replaceState 메서드를 반환합니다.
   */
  getOriginalReplaceState(): History["replaceState"] {
    if (!this.replaceState) {
      throw new Error("History methods not backed up");
    }
    return this.replaceState;
  }
}

// 전역 싱글톤 인스턴스
let originalHistory: BackupStateChangeFunctions | null = null;

/**
 * 전역 히스토리 관리자 인스턴스를 가져옵니다.
 */
export function getBackupHistory(): BackupStateChangeFunctions {
  if (!originalHistory) {
    if (typeof window === "undefined") {
      throw new Error(
        "GlobalHistoryManager can only be used in browser environment"
      );
    }
    originalHistory = new BackupStateChangeFunctions();
  }
  return originalHistory;
}
