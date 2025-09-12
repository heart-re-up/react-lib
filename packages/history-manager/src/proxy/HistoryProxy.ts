import { HistoryProxy, OnChangeState } from "./HistoryProxy.type";

/**
 * window.history 의 pushState/replaceState 호출을 감지하는 클래스
 * 관리되는 히스토리 외부에서 발생하는 pushState/replaceState 를 감지하여 리스너에게 알리기 위함.
 */
export class HistoryProxyImpl implements HistoryProxy {
  /** 백업 메소드 */
  private readonly history: History;
  private initialized: boolean = false;

  private pushStateOriginal: History["pushState"];
  private replaceStateOriginal: History["replaceState"];

  private onChangeStatePush: OnChangeState | null = null;
  private onChangeStateReplace: OnChangeState | null = null;

  constructor(history: History = window.history) {
    this.history = history;

    // 전역 히스토리 관리자에서 원본 메서드 백업
    this.pushStateOriginal = history.pushState.bind(history);
    this.replaceStateOriginal = history.replaceState.bind(history);

    // 첫 번째 인스턴스에서만 전역 인터셉터 설정
    this.setupGlobalInterceptors(history);
  }

  /**
   * 전역 인터셉터 설정 (첫 번째 인스턴스에서만 실행)
   */
  private setupGlobalInterceptors(history: History): void {
    // original 함수와 history 함수가 같으면 아직 교체되지 않음.
    if (this.initialized) {
      console.warn("Global interceptors already set up");
      return;
    }
    // 아직 프록시가 설정되지 않음, 설정 필요
    // pushState 인터셉터 설정
    history.pushState = (
      state: unknown,
      _unused: string,
      url?: string | URL | null
    ) => {
      // 모든 HistoryProxy 인스턴스의 리스너들에게 알림
      // TODO: 여기서 리스너들을 호출해야 하는데, 어떻게 접근할까?

      // 원본 메서드 호출
      this.onChangeStatePush?.(state, url);
    };
    // replaceState 인터셉터 설정
    history.replaceState = (
      state: unknown,
      _unused: string,
      url?: string | URL | null
    ) => {
      this.onChangeStateReplace?.(state, url);
    };

    this.initialized = true;
  }

  /**
   * 외부 pushState 감지 시 리스너 설정
   */
  setPushListener(listener: OnChangeState | null): void {
    this.onChangeStatePush = listener;
  }

  /**
   * 외부 replaceState 감지 시 리스너 설정
   */
  setReplaceListener(listener: OnChangeState | null): void {
    this.onChangeStateReplace = listener;
  }

  get length(): number {
    return this.history.length;
  }

  get scrollRestoration(): ScrollRestoration {
    return this.history.scrollRestoration;
  }

  get state(): unknown {
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

  /**
   * 원본 pushState 호출
   */
  pushState(data: unknown, unused: string, url?: string | URL | null): void {
    this.pushStateOriginal(data, unused, url);
  }

  /**
   * 원본 replaceState 호출
   */
  replaceState(data: unknown, unused: string, url?: string | URL | null): void {
    this.replaceStateOriginal(data, unused, url);
  }
}

let historyProxy: HistoryProxy | null = null;

export const getHistoryProxy = (): HistoryProxy => {
  if (!historyProxy) {
    historyProxy = new HistoryProxyImpl();
  }
  return historyProxy;
};
