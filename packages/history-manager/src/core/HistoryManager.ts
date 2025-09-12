import { getNodeManager, NodeManager } from "../node";
import { HistoryProxy } from "../proxy";
import { getHistoryProxy } from "../proxy/HistoryProxy";
import { HistoryNodeChangeEventListener } from "../types/HistoryNodeChangeEvent";
import { HistoryOptions } from "../types/HistoryOptions";
import { HistoryState } from "../types/HistoryState";
import { OnBeforePushEventListener } from "../types/OnBeforePushEventListener";
import { HistoryManager } from "./HistoryManager.type";

/**
 * 히스토리 관리자 구현체
 */
export class HistoryManagerImpl implements HistoryManager {
  private readonly nodeManager: NodeManager = getNodeManager();
  private readonly history = getHistoryProxy();

  private onBeforePushEventListeners: Set<OnBeforePushEventListener> =
    new Set();

  constructor(history: History = window.history) {
    // 노드 매니저를 초기화
    this.history.replaceState(this.nodeManager.initialize(history.state), "");

    // 오리지널 history 에 직접 호출된 pushState/replaceState 를 처리하는 리스너 설정
    this.history.setPushListener(this.handleOriginalPush.bind(this));
    this.history.setReplaceListener(this.handleOriginalReplace.bind(this));
  }

  /** 히스토리 노드 변경 이벤트 리스너 추가 */
  addHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void {
    this.nodeManager.addHistoryNodeChangeEventListener(listener);
  }

  /** 히스토리 노드 변경 이벤트 리스너 제거 */
  removeHistoryNodeChangeEventListener(
    listener: HistoryNodeChangeEventListener
  ): void {
    this.nodeManager.removeHistoryNodeChangeEventListener(listener);
  }

  /** window.history.pushState 요청 전처리 리스너 추가 */
  addOnBeforePushEventListener(listener: OnBeforePushEventListener): void {
    this.onBeforePushEventListeners.add(listener);
  }

  /** window.history.pushState 요청 전처리 리스너 제거 */
  removeOnBeforePushEventListener(listener: OnBeforePushEventListener): void {
    this.onBeforePushEventListeners.delete(listener);
  }

  /**
   * window.history 에 직접 호출된 pushState 를 처리합니다.
   *
   * @param state 히스토리 상태(데이터)
   * @param url 히스토리 경로
   */
  private handleOriginalPush(state: unknown, url?: string | URL | null): void {
    // HistoryManager 가 아닌 방식으로 push 되면 원본 히스토리 관리자에 의해서 히스토리 노드가 변경되었을 것이다.
    // 따라서 원본 히스토리 관리자에 의해서 히스토리 노드가 변경되었을 것이다.
    this.onBeforePushEventListeners.forEach((listener) => listener(state, url));
    this.push(state, url, { intercepted: true });
  }

  /**
   * window.history 에 직접 호출된 replaceState 를 처리합니다.
   *
   * @param state 히스토리 상태(데이터)
   * @param url 히스토리 경로
   */
  private handleOriginalReplace(
    state: unknown,
    url?: string | URL | null
  ): void {
    this.replace(state, url, { intercepted: true });
  }

  getNodeManager(): NodeManager {
    return this.nodeManager;
  }
  getHistoryProxy(): HistoryProxy {
    return this.history;
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

  push<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>> {
    // NodeManager에서 HistoryState 생성 및 노드 관리
    const state = this.nodeManager.onPush(
      data,
      url, // ?? location.pathname,
      options
    );
    // 프록시를 통해 원본 메서드 호출
    this.history.pushState(state, "", url);
    return state;
  }

  replace<T = unknown>(
    data: T,
    url?: string | URL | null,
    options?: HistoryOptions
  ): Readonly<HistoryState<T>> {
    // NodeManager에서 HistoryState 생성 및 노드 관리
    const state = this.nodeManager.onReplace(data, url, options);
    // 프록시를 통해 원본 메서드 호출
    this.history.replaceState(state, "", url);
    return state;
  }
}
