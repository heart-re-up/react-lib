import { AdvancedHistory, AdvancedHistoryState, AffinityOptions } from "./AdvancedHistory.type";
import { isAdvancedHistoryState, satisfiesAdvancedHistoryState } from "./AdvancedHistory.util";
import { AdvancedHistoryNodeManagerImpl } from "./node/HistoryNodeManager";
import {
  AdvancedHistoryNodeManager,
  HistoryNavigationEventListener,
} from "./node/HistoryNodeManager.type";

export class AdvancedHistoryImpl implements AdvancedHistory {
  readonly nodeManager: AdvancedHistoryNodeManager;

  constructor(private readonly history: History) {
    this.nodeManager = new AdvancedHistoryNodeManagerImpl();
    window.addEventListener("popstate", (event) => this.onPopState(event.state));
  }

  get length() {
    return this.history.length;
  }
  get scrollRestoration() {
    return this.history.scrollRestoration;
  }
  get state() {
    return this.history.state;
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  go(delta: number): void {
    this.history.go(delta);
  }

  removeHistoryNavigationListener(listener: HistoryNavigationEventListener): void {
    this.nodeManager.removeHistoryNavigationListener(listener);
  }

  addHistoryNavigationListener(listener: HistoryNavigationEventListener): void {
    this.nodeManager.addHistoryNavigationListener(listener);
  }

  pushState<T extends object = object>(
    data: T,
    affinity?: AffinityOptions,
    url?: string | URL | null
  ): void {
    const state: AdvancedHistoryState<T> = satisfiesAdvancedHistoryState(data, affinity);
    this.history.pushState(state, "", url);
    this.nodeManager.onPushState(state);
  }

  replaceState<T extends object = object>(
    data: T,
    affinity?: AffinityOptions,
    url?: string | URL | null
  ): void {
    const state: AdvancedHistoryState<T> = satisfiesAdvancedHistoryState(data, affinity);
    this.history.replaceState(state, "", url);
    this.nodeManager.onReplaceState(state);
  }

  /**
   * window.history 에서 발생하는 popstate 이벤트를 처리합니다.
   *
   * @param state 히스토리 상태
   */
  private onPopState(state: unknown): void {
    console.log("onPopState", state);
    // window.history 에서 발생하는 이벤트는 항상 AdvancedHistoryState 형식이 아닐수도 있기에 필터됩니다.
    // 관리되지 않는 상태는 처리할 수 없습니다.
    if (!isAdvancedHistoryState(state)) {
      console.warn("onPopState", state, "is not AdvancedHistoryState");
      return;
    }
    this.nodeManager.onPopState(state);
  }
}
