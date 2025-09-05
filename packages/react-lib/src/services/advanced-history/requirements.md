# Advanced History

## TODO 리스트

### Phase 1: 핵심 기능 구현 ✅ 완료

- [x] AdvancedHistoryNode 타입 정의 (AdvancedHistory.type.ts)
- [x] AdvancedHistoryState 타입 정의 (AdvancedHistory.type.ts)
- [x] AdvancedHistory 인터페이스 정의 (AdvancedHistory.ts)
- [x] AdvancedHistoryImpl 클래스 구현 (AdvancedHistory.ts)
- [x] 이벤트 시스템 구현 (커스텀 리스너 기반)
- [x] 상태 검증 유틸리티 함수들 (AdvancedHistory.util.ts)
- [x] 기본 AdvancedHistoryTracking 클래스 구현

### Phase 2: Composition 기반 확장 ✅ 완료

- [x] AdvancedHistoryTracking 완전 구현 (AdvancedHistoryTracking.ts)
- [x] HistoryStateTracker 구현 (HistoryStateTracker.ts) - 개별 노드 상태 추적
- [x] HistoryStorageManager 구현 (HistoryStorageManager.ts) - SessionStorage 연동
- [ ] HistoryBoundaryManager 구현 (향후 필요시)
- [ ] HistoryAnalyticsManager 구현 (향후 필요시)
- [ ] 에러 처리 매니저 구현 (향후 필요시)

### Phase 3: 고급 기능 (필요시 구현)

- [ ] 브라우저 호환성 체크 유틸리티
- [ ] 중복 ID 검증 로직 (HistoryStateTracker에서)
- [ ] 동시성 처리 (디바운싱 매니저)

### Phase 4: 테스트 및 문서화

- [ ] 단위 테스트 작성
- [ ] Composition 매니저들 테스트
- [ ] 사용 가이드 작성
- [ ] 예제 코드 작성

---

## 개요

**AdvancedHistory**는 `window.history`와의 연동에만 집중하는 저수준 히스토리 관리 라이브러리입니다. 기존 VirtualHistory의 복잡한 기능들을 관심사 분리 원칙에 따라 분리하여, 순수한 window.history 래핑 기능만 제공합니다.

### AdvancedHistory 핵심 책임

- `window.history.pushState/replaceState` 래핑 및 UUID 추가
- `popstate` 이벤트 감지 및 처리
- 기본적인 push/pop/replace 이벤트 발행

### 확장 매니저들의 책임

- **HistoryStateTracker**: 전체 노드 리스트와 현재 위치 추적
- **HistoryStorageManager**: SessionStorage 연동으로 상태 영속화
- **AdvancedHistoryTracking**: 위 매니저들을 조합하여 통합 기능 제공

### 제외된 책임 (향후 확장 고려)

- 바운더리 관리 및 계층화 (HistoryBoundaryManager)
- React 컴포넌트 통합 (useAdvancedHistory 훅)
- 네비게이션 이벤트 세분화 (enter/leave)
- UI 상태 관리
- 생명주기 관리 (destroy)

---

## 데이터 구조

### AdvancedHistoryNode (관리 메타데이터)

관리 객체가 추적하는 히스토리 노드의 메타데이터입니다. 히스토리 그래프의 각 지점을 나타냅니다.

```typescript
export type AdvancedHistoryNode = {
  /** 유일한 식별자 (UUID) */
  id: string;
  /** 생성 시간 */
  timestamp: number;
};
```

### AdvancedHistoryState (실제 저장 데이터)

`window.history.state`에 저장되는 실제 데이터 구조입니다. 사용자 데이터와 관리 메타데이터를 분리하여 관리합니다.

```typescript
export type AdvancedHistoryState<T = unknown> = {
  /** 히스토리 노드 */
  node: AdvancedHistoryNode;
  /** state 원본 데이터 */
  data: T;
};
```

---

## 핵심 인터페이스

### AdvancedHistory 인터페이스

```typescript
export interface AdvancedHistory extends Omit<History, "pushState" | "replaceState"> {
  /** 상태 이벤트 리스너 추가 */
  addStateEventListener: (listener: AdvancedHistoryStateEventListener) => void;
  /** 상태 이벤트 리스너 제거 */
  removeStateEventListener: (listener: AdvancedHistoryStateEventListener) => void;
  /** 히스토리 추가 */
  pushState: <T extends object>(data: T, unused: string, url?: string | URL | null) => void;
  /** 히스토리 교체 */
  replaceState: <T extends object>(data: T, unused: string, url?: string | URL | null) => void;

  // === 기본 History API 메서드들은 상속됨 ===
  // back(): void;
  // forward(): void;
  // go(delta?: number): void;
  // readonly length: number;
  // readonly scrollRestoration: ScrollRestoration;
  // readonly state: any;
}
```

### 구현 클래스와 이벤트 시스템

`AdvancedHistoryImpl` 클래스는 커스텀 리스너 시스템을 사용하여 이벤트 기능을 제공합니다.

```typescript
export class AdvancedHistoryImpl implements AdvancedHistory {
  private readonly listeners: Set<AdvancedHistoryStateEventListener> = new Set();

  // 이벤트 리스너 관리
  addStateEventListener(listener: AdvancedHistoryStateEventListener): void;
  removeStateEventListener(listener: AdvancedHistoryStateEventListener): void;
}

// 이벤트 타입 정의
export type AdvancedHistoryStateEvent = {
  type: "push" | "pop" | "replace";
  isAdvancedHistoryState: boolean;
  state: unknown;
};

export type AdvancedHistoryStateEventListener = (event: AdvancedHistoryStateEvent) => void;
```

### 이벤트 사용법

```typescript
const history = new AdvancedHistoryImpl(window.history);

// 이벤트 구독
history.addStateEventListener((event) => {
  switch (event.type) {
    case "push":
      console.log("새 히스토리 추가:", event.state);
      break;
    case "pop":
      console.log("브라우저 네비게이션:", event.state);
      break;
    case "replace":
      console.log("히스토리 교체:", event.state);
      break;
  }
  console.log("AdvancedHistoryState 여부:", event.isAdvancedHistoryState);
});
```

---

## Composition 기반 확장

AdvancedHistory는 순수한 History API 래퍼이므로, 추가 기능들은 composition 패턴으로 구현합니다.

### 바운더리 매니저 예시

```typescript
class HistoryBoundaryManager {
  constructor(private history: AdvancedHistoryImpl) {
    this.history.addStateEventListener(this.handleStateEvent.bind(this));
  }

  private handleStateEvent(event: AdvancedHistoryStateEvent) {
    switch (event.type) {
      case "push":
        this.handlePush(event.state);
        break;
      case "pop":
        this.handlePop(event.state);
        break;
    }
  }

  private handlePush(state: unknown) {
    // 바운더리 관리 로직
    console.log("Boundary check on push:", state);
  }

  private handlePop(state: unknown) {
    // 네비게이션 제한 로직
    console.log("Boundary check on pop:", state);
  }
}
```

### 상태 추적 매니저 예시 (현재 AdvancedHistoryTracking 클래스 기반)

```typescript
export class AdvancedHistoryTracking {
  private readonly history: AdvancedHistory;

  constructor(history: AdvancedHistory) {
    this.history = history;
    this.history.addStateEventListener((event) => {
      console.log("Tracking event:", event);
      // 여기에 상태 추적 로직 추가 예정
    });
  }
}

// 향후 확장 예시
class HistoryStateTracker extends AdvancedHistoryTracking {
  private position: number = 0;
  private nodes: AdvancedHistoryNode[] = [];

  constructor(history: AdvancedHistoryImpl) {
    super(history);
    this.history.addStateEventListener(this.trackStateEvent.bind(this));
  }

  private trackStateEvent(event: AdvancedHistoryStateEvent) {
    if (event.isAdvancedHistoryState && isAdvancedHistoryState(event.state)) {
      switch (event.type) {
        case "push":
          this.trackPush(event.state);
          break;
        case "pop":
          this.trackPop(event.state);
          break;
      }
    }
  }

  private trackPush(state: AdvancedHistoryState) {
    this.nodes.push(state.node);
    this.position = this.nodes.length - 1;
  }

  private trackPop(state: AdvancedHistoryState) {
    const nodeIndex = this.nodes.findIndex((n) => n.id === state.node.id);
    if (nodeIndex !== -1) {
      this.position = nodeIndex;
    }
  }

  get currentPosition() {
    return this.position;
  }
  get allNodes() {
    return this.nodes;
  }
}
```

---

## 상태 검증 유틸리티

### 타입 가드 함수들

현재 구현된 유틸리티 함수들입니다 (AdvancedHistory.util.ts):

```typescript
// AdvancedHistoryState 타입 가드
export const isAdvancedHistoryState = <T = unknown>(
  state: unknown
): state is AdvancedHistoryState<T> => {
  return (
    state !== undefined &&
    state !== null &&
    typeof state === "object" &&
    "data" in state &&
    state.data !== undefined &&
    state.data !== null &&
    "node" in state &&
    state.node !== undefined &&
    state.node !== null
  );
};

// AdvancedHistoryState 생성 유틸리티
export const toAdvancedHistoryState = <T = unknown>(data: T): AdvancedHistoryState<T> => {
  if (isAdvancedHistoryState<T>(data)) {
    return data;
  }
  return {
    data,
    node: {
      id: uuid(),
      timestamp: Date.now(),
    },
  };
};
```

---

## 구현 설계 원칙

### 단일 책임 원칙 (SRP)

- AdvancedHistory는 오직 window.history 연동에만 집중
- 바운더리 관리, React 통합 등은 별도 계층에서 처리

### 의존성 역전 원칙 (DIP)

- `AdvancedHistoryStorage` 인터페이스로 저장소 추상화
- 테스트 시 MockStorage, 운영 시 SessionStorage 등 교체 가능

### 이벤트 기반 설계

- 모든 상태 변경은 이벤트로 통지
- 느슨한 결합으로 확장성과 테스트 용이성 확보

### 불변성 원칙

- nodes 배열은 readonly로 외부 노출
- 내부 상태 변경은 메서드를 통해서만 가능

---

## 사용 예시

### 기본 사용법

```typescript
// 히스토리 인스턴스 생성
const history = new AdvancedHistoryImpl(window.history);

// 이벤트 리스너 등록
history.addStateEventListener((event) => {
  console.log(`이벤트 타입: ${event.type}`);
  console.log(`상태:`, event.state);
  console.log(`AdvancedHistoryState 여부: ${event.isAdvancedHistoryState}`);
});

// 상태 추가 (UUID와 timestamp 자동 생성)
history.pushState({ pageData: "some data" }, "", "/page1");

// 상태 교체
history.replaceState({ updatedData: "new data" }, "", "/page1");
```

### Composition 활용

```typescript
// 기본 히스토리
const history = new AdvancedHistoryImpl(window.history);

// 통합 트래킹 (자동으로 저장소 연동)
const tracking = new AdvancedHistoryTracking(history);

// 상태 변경 감지
tracking.addStateChangeListener((nodes, position) => {
  console.log(`전체 노드 개수: ${nodes.length}`);
  console.log(`현재 위치: ${position}`);
  console.log(`현재 노드:`, tracking.currentNode);
});

// 히스토리 조작
history.pushState({ data: "page1" }, "", "/page1");
history.pushState({ data: "page2" }, "", "/page2");

// 유틸리티 활용
console.log("뒤로 갈 수 있나?", tracking.canGoBack());
console.log("앞으로 갈 수 있나?", tracking.canGoForward());

// 새로고침 후에도 상태가 복구됨
```

### 개별 매니저 사용 (고급 사용법)

```typescript
// 기본 히스토리
const history = new AdvancedHistoryImpl(window.history);

// 개별 매니저들 직접 사용
const stateTracker = new HistoryStateTracker(history);
const storageManager = new HistoryStorageManager("custom-key");

// 상태 변경 감지
stateTracker.addStateChangeListener((nodes, position) => {
  // 커스텀 저장 로직
  storageManager.saveState(nodes, position);
});

// 커스텀 복구 로직
const restored = storageManager.restoreState();
if (restored) {
  stateTracker.restoreState(restored.nodes, restored.position);
}
```

---

## 현재 파일 구조

```
app-imap/react-lib/src/services/advanced-history/
├── AdvancedHistory.ts           # 핵심 인터페이스와 구현체
├── AdvancedHistory.type.ts      # 타입 정의
├── AdvancedHistory.util.ts      # 유틸리티 함수들
├── AdvancedHistoryTracking.ts   # 통합 트래킹 관리자
├── HistoryStateTracker.ts       # 노드 상태 추적 매니저
├── HistoryStorageManager.ts     # 저장소 관리 매니저
├── index.ts                     # 모듈 export
└── requirements.md              # 이 파일
```

### 각 파일의 역할

- **AdvancedHistory.type.ts**: `AdvancedHistoryNode`, `AdvancedHistoryState`, 이벤트 관련 타입들
- **AdvancedHistory.util.ts**: `isAdvancedHistoryState`, `toAdvancedHistoryState` 유틸리티 함수
- **AdvancedHistory.ts**: `AdvancedHistory` 인터페이스와 `AdvancedHistoryImpl` 구현체
- **HistoryStateTracker.ts**: push/pop/replace 이벤트 감지 및 개별 노드 상태 추적
- **HistoryStorageManager.ts**: SessionStorage 연동으로 전체 노드 리스트 저장/복구
- **AdvancedHistoryTracking.ts**: 위 두 매니저를 조합한 통합 관리자, 새로고침 복구 기능 포함
- **index.ts**: 외부로 노출할 API들의 export

---

## 추가 고려사항

### 설계 원칙

- **단일 책임**: AdvancedHistory는 오직 History API 래핑에만 집중
- **관심사 분리**: 바운더리 관리, 상태 추적 등은 별도 매니저에서 처리
- **Composition over Inheritance**: 기능 확장은 상속이 아닌 조합으로 처리

### 에러 처리

- `pushState` 실패 시 이벤트를 통한 에러 통지
- 상위 매니저에서 에러 복구 로직 구현

### 브라우저 호환성

- History API 미지원 환경에서 fallback 전략 필요
- 상위 계층에서 호환성 체크 구현

### 확장성

- EventEmitter 기반으로 무제한 기능 확장 가능
- 각 매니저는 독립적으로 개발/테스트 가능
- 런타임에 매니저 추가/제거 가능

---

## 관련 참고 자료

- [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [PopStateEvent Documentation](https://developer.mozilla.org/en-US/docs/Web/API/PopStateEvent)
- [SessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
