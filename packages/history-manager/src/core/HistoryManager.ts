import { getNodeManager, NodeManager, satisfiesManagedState } from "../node";
import { HistoryProxy } from "../proxy";
import { getHistoryProxy } from "../proxy/HistoryProxy";
import { HistoryNode } from "../types/HistoryNode";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState, isHistoryState } from "../types/HistoryState";
import { HistoryManager, NavigationListener } from "./HistoryManager.type";

/**
 * 히스토리 관리자 구현체
 */
export class HistoryManagerImpl implements HistoryManager {
  private readonly nodeManager: NodeManager = getNodeManager();
  private readonly history = getHistoryProxy();

  constructor(history: History = window.history) {
    console.debug("HistoryManagerImpl constructor", history);
    // 노드 매니저를 초기화
    this.nodeManager.setOnNavigate((delta) => this.history.go(delta));
    const state = this.nodeManager.initialize(history.state);
    this.history.replaceState(state, "");
    this.history.setPushListener(this.handleExternalPush.bind(this));
    this.history.setReplaceListener(this.handleExternalReplace.bind(this));
  }

  private handleExternalPush(state: unknown, url?: string | URL | null): void {
    console.debug("외부 pushState 감지됨", state);
    this.push(state, url, { intercepted: true });
  }

  private handleExternalReplace(
    state: unknown,
    url?: string | URL | null
  ): void {
    console.debug("외부 replaceState 감지됨", state);
    this.replace(state, url, { intercepted: true });
  }

  getNodeManager(): NodeManager {
    return this.nodeManager;
  }
  getHistoryProxy(): HistoryProxy {
    return this.history;
  }

  push<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>> {
    console.debug("HistoryManager push", data, url, options);
    // NodeManager에서 HistoryState 생성 및 노드 관리
    const state = this.nodeManager.requestPush(data, url, options);
    // 프록시를 통해 원본 메서드 호출
    this.history.pushState(state, "", url);
    return state;
  }

  replace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>> {
    console.debug("HistoryManager replace", data, url, options);
    // NodeManager에서 HistoryState 생성 및 노드 관리
    const state = this.nodeManager.requestReplace(data, url, options);
    // 프록시를 통해 원본 메서드 호출
    this.history.replaceState(state, "", url);
    return state;
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

  addNavigationListener(listener: NavigationListener): void {
    this.nodeManager.addNavigationListener(listener);
  }

  removeNavigationListener(listener: NavigationListener): void {
    this.nodeManager.removeNavigationListener(listener);
  }

  /**
   * 현재 노드 목록 조회 (디버깅용)
   */
  getNodes(): readonly HistoryNode[] {
    return this.nodeManager.nodes;
  }

  /**
   * 현재 위치 조회 (디버깅용)
   */
  getPosition(): number {
    return this.nodeManager.position;
  }
}
