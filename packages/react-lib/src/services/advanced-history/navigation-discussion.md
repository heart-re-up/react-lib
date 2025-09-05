# 모달 네비게이션 상태 관리 방안

_Exported on 2025. 8. 11. at 22시 29분 41초 GMT+9 from Cursor (1.4.3)_

---

**User**

만약 모달들이 가상 히스토리로 관리되는 경우, 네비게이션 콜백을 통해서 history 변경을 감지하고 open: true/false 관리되고 있어.

이때 @HistoryNodeManager.ts onPopState 에서 delta 가 1 또는 -1 이 아닌 경우에, 중간 노드들의 정보는 없는데... 중간에 스킵된 노드들에게 어떻게 하면 각각의 모달 컴포넌트 콜백에 정확하게 네비게이션 이동 상태를 전달할 수 있을까? 현재는 delta 의 절대값이 1보다 큰 경우 중간 노드 정보는 전달하지 못하거든...

@AdvancedHistory.ts 에 node id 마다 listener 를 설정할 수 있도록 해야할까?

전체 구조를 보고, 어떤 방향이 구조적으로 유리한지 분석해봐.

---

**Cursor**

간단히 살펴보고 필요한 타입/유틸 파일들을 동시에 열어 구조를 파악하겠습니다. 이어서 구조적으로 어떤 접근이 유리한지 제안드릴게요.

방금 `AdvancedHistory`/`HistoryNodeManager` 흐름을 빠르게 훑어 구조를 파악했습니다. 핵심은 실제 popstate가 한번만 발생해도 `onPopState`에서는 이전/현재 노드와 delta만 가지고 있고, 중간 노드에 대한 콜백은 따로 발생시키지 않는다는 점입니다.

```167:185:app-imap/react-lib/src/services/advanced-history/node/HistoryNodeManager.ts
  onPopState(state: AdvancedHistoryState): void {
    const previousPosition = this.position;
    const previousNode = this.nodes[previousPosition];
    const currentPosition = this.nodes.findIndex((n) => n.id === state.node.id);
    if (currentPosition === -1) {
      throw new Error("current node not found");
    }
    const currentNode = this.nodes[currentPosition];
    this._position = currentPosition;
    const delta = currentPosition - previousPosition;

    this.onNavigated({
      previous: previousNode,
      current: currentNode,
      delta,
      type: "pop",
    });
  }
```

또한, `onNavigated`에서는 봉인(sealed) 전략을 적용할 수 있어 추가적인 history.go가 트리거될 수 있습니다.

```58:75:app-imap/react-lib/src/services/advanced-history/node/HistoryNodeManager.ts
    if (event.current.affinity?.sealed) {
      const forward = 0 < event.delta;
      switch (event.current.affinity?.strategy) {
        case "snapback":
          window.history.go(forward ? -1 : 1);
          break;
        case "passthrough":
          window.history.go(forward ? 1 : -1);
          break;
        default:
          break;
      }
      return;
    }
```

### 무엇이 문제인가?

- delta의 절대값이 1보다 크면 브라우저는 실제로 중간 노드들을 “한 번에” 건너뛰어 최종 상태만 알려줍니다.
- 현재 이벤트 모델은 이전/현재 노드와 delta만 제공하므로 “중간 노드 각각에 대한 콜백”을 직접적으로 전달하지 못합니다.

### 선택지 비교

- node id별 listener(AdvancedHistory.ts에서 등록)

  - 장점: 대상 노드에 직접 브로드캐스트 가능.
  - 단점: 등록/해제 수명주기 관리, 누수 위험, 복잡도↑. 그리고 무엇보다 “어떤 노드들이 스킵되었는지”를 계산하는 책임은 여전히 필요합니다. 구조적으로 이 이슈의 본질(경로 계산)을 해결하지 못하고, 관리 포인트만 늘립니다. 비추천.

- 기존 글로벌 이벤트 유지 + 소비자에서 경로 계산

  - 이미 `nodeManager.nodes` 전체와 `event.previous/current`를 받습니다. 소비자 측에서 인덱스를 찾아 “방향(step)”에 따라 경로를 계산해 각 모달 콜백에 전달할 수 있습니다.
  - 변경이 전혀 필요 없고 가장 단순합니다. 실무적으로 바로 적용 가능.
  - 단, 여러 소비자가 같은 계산을 복제할 수 있어 중복 로직이 생길 수 있습니다.

- 글로벌 이벤트 확장(권장)
  - `HistoryNavigationEvent`에 “traversal/path” 정보를 추가(예: steps, direction, indices, nodes 등). delta의 절대값이 1보다 큰 경우 NodeManager가 경로를 계산해 이벤트에 함께 제공.
  - 소비자는 그 “경로”를 그대로 순회하며 각 모달 콜백을 안전하게 호출.
  - 봉인(sealed) 처리와의 충돌을 막기 위해 “실제 네비게이션 이벤트”와 “파생된(virtual) 경로 데이터”를 구분만 해두면 됩니다. 즉, onNavigated는 1회만 발생(현재처럼)하고, 이벤트 페이로드에 path를 동봉해 주는 형태면 봉인 로직에 영향 없음.

### 왜 이벤트 확장이 구조적으로 유리한가?

- 경로 계산 책임을 한 곳(NodeManager)으로 모아 일관성/테스트 용이성↑.
- 소비자(모달 컨트롤러)는 “경로 데이터”만 받아 내 로직(Open/Close, enter/leave 등)을 실행하면 됨. 복잡도가 내려가고, 재사용성이 올라갑니다.
- 봉인(sealed) 전략은 “실제 네비게이션”에만 적용되고, 경로 데이터는 그저 UI 동기화를 위한 보조 정보로 취급하면 충돌이 없습니다.

### 소비자 측 처리 예시(경로가 이벤트로 제공된다고 가정)

```ts
function onHistoryChange(event: HistoryNavigationEvent) {
  if (event.type !== "pop") return;

  const direction = event.delta > 0 ? 1 : -1;
  const path = event.path?.nodes ?? []; // 중간 + 최종 포함 순서대로

  // 예: 모달 맵이 있다고 가정 (nodeId -> modalController)
  for (const node of path) {
    const controller = modalControllers.get(node.id);
    if (!controller) continue;
    if (direction === -1)
      controller.onBack(); // 닫힘 등
    else controller.onForward(); // 다시 열림 등
  }
}
```

중요: 위 로직은 “파생 경로”만을 사용하므로, sealed 로직이 추가로 수행되지 않습니다(실제 네비게이션은 이미 한번 발생했고, 봉인 처리는 onNavigated 단계에서 끝났기 때문).

### 결론

- AdvancedHistory.ts에 node id별 listener를 두는 방식은 구조적으로 비추천입니다. 등록 해제/메모리/복잡도 문제가 커지고, 핵심인 “경로 계산” 문제를 해결하지 못합니다.
- 가장 단순한 시작점: 현 구조 유지, 소비자에서 `nodeManager.nodes`와 `event.previous/current`로 경로 계산해 모달 콜백을 호출.
- 장기적으로 권장: `HistoryNavigationEvent`를 확장해 `path`(방향/스텝/중간 노드 목록)를 포함시키는 방식. NodeManager 한 곳에서 경로를 계산해 일관성 있게 전달하되, 봉인 로직은 “실제 네비게이션”에만 적용되도록 유지.

원하시면, 이벤트 페이로드에 `path`를 추가하는 형태로 최소 변경 설계를 잡아드릴게요. 타입과 계산 로직만 간단히 보강하면 됩니다.

- 관련 코드 참고:

```60:69:app-imap/react-lib/src/services/advanced-history/AdvancedHistory.ts
  private onPopState(state: unknown): void {
    // AdvancedHistoryState가 아니면 필터
    if (!isAdvancedHistoryState(state)) {
      console.warn("onPopState", state, "is not AdvancedHistoryState");
      return;
    }
    this.nodeManager.onPopState(state);
  }
```

- 봉인 처리 위치:

```58:75:app-imap/react-lib/src/services/advanced-history/node/HistoryNodeManager.ts
// sealed 상태이면 strategy에 따라 즉시 go() 호출 후 리스너에 알리지 않음
```

- delta 계산 위치:

```167:185:app-imap/react-lib/src/services/advanced-history/node/HistoryNodeManager.ts
// currentPosition - previousPosition 으로 delta 산출
```

- 추가: affinity 유틸은 관련 노드 묶음 이동에만 관여하며, 본 이슈(스킵된 경로 알림)와는 별개입니다.

- 제가 바로 적용한다면: 이벤트 타입에 `path` 필드(steps/direction/nodes/indices)를 추가하고, `onPopState`에서 delta가 |delta|>1일 때만 경로를 산출해 넣어주는 쪽으로 제안드립니다. 소비자는 그 정보를 바탕으로 각 모달 콜백을 순회 호출하면 됩니다.

- 필요 시, 소비자 편의를 위해 동일 로직을 util로도 제공 가능(중복 방지). 하지만 우선은 이벤트 확장만으로 충분합니다.

- 마지막으로, 성능/안정성 측면에서 경로 생성은 O(|delta|)이고, `nodes`는 이미 메모리에 있으므로 오버헤드는 매우 작습니다.

- 어떻게 진행할지 선택해 주세요. 이벤트 확장으로 진행이면, 변경 범위와 타입 정의를 간결하게 정리해 바로 적용하겠습니다.

- 요약
  - node id별 listener 추가: 비추천. 복잡도/누수 위험↑, 핵심 해결 X.
  - 소비자 경로 계산: 즉시 가능, 변경 불필요. 중복 로직 우려.
  - 이벤트 확장(권장): `HistoryNavigationEvent`에 `path` 추가. NodeManager가 경로 계산 → 소비자는 간단히 순회 호출. 봉인 로직과 충돌 없음.

```typescript
  onPopState(state: AdvancedHistoryState): void {
    const previousPosition = this.position;
    const previousNode = this.nodes[previousPosition];
    const currentPosition = this.nodes.findIndex((n) => n.id === state.node.id);
    if (currentPosition === -1) {
      throw new Error("current node not found");
    }
    const currentNode = this.nodes[currentPosition];
    this._position = currentPosition;
    const delta = currentPosition - previousPosition;

    this.onNavigated({
      previous: previousNode,
      current: currentNode,
      delta,
      type: "pop",
    });
  }
```

```typescript
if (event.current.affinity?.sealed) {
  const forward = 0 < event.delta;
  switch (event.current.affinity?.strategy) {
    case "snapback":
      window.history.go(forward ? -1 : 1);
      break;
    case "passthrough":
      window.history.go(forward ? 1 : -1);
      break;
    default:
      break;
  }
  return;
}
```

```typescript
function onHistoryChange(event: HistoryNavigationEvent) {
  if (event.type !== "pop") return;

  const direction = event.delta > 0 ? 1 : -1;
  const path = event.path?.nodes ?? []; // 중간 + 최종 포함 순서대로

  // 예: 모달 맵이 있다고 가정 (nodeId -> modalController)
  for (const node of path) {
    const controller = modalControllers.get(node.id);
    if (!controller) continue;
    if (direction === -1)
      controller.onBack(); // 닫힘 등
    else controller.onForward(); // 다시 열림 등
  }
}
```

```typescript
  private onPopState(state: unknown): void {
    // AdvancedHistoryState가 아니면 필터
    if (!isAdvancedHistoryState(state)) {
      console.warn("onPopState", state, "is not AdvancedHistoryState");
      return;
    }
    this.nodeManager.onPopState(state);
  }
```

```typescript
// sealed 상태이면 strategy에 따라 즉시 go() 호출 후 리스너에 알리지 않음
```

```typescript
// currentPosition - previousPosition 으로 delta 산출
```

---

**User**

흠... 그렇다면 현재 current previous 구조가 아닌 이동 범위를 뚝 잘라서 traversal array 형태로 전달하는게 좋겠네?
배열의 앞쪽은 무조건 back 방향 뒤쪽은 forward 방향을 유지하고?

만약 delta 가 1 이면 traversal[0] 이 previous 가 되는거지.

---

**Cursor**

### 결론 먼저

- 제안하신 “이동 범위를 단일 배열(traversal)로 제공” 방식이 구조적으로 가장 깔끔합니다.
- 이벤트 페이로드에 `traversal: AdvancedHistoryNode[]`를 추가해, 항상 `[previous, ...중간노드들, current]` 순서로 전달하는 것을 권장합니다.
- 이렇게 하면 소비자는 이 배열만 순회하며 각 모달의 콜백을 정확히 호출할 수 있고, delta의 절대값이 1보다 큰 경우에도 중간 노드들에 대한 처리 누락이 없어집니다.

### 이벤트 스펙 제안

- 유지: `type`, `delta`, `previous`, `current` (기존 구조 호환)
- 추가: `traversal: AdvancedHistoryNode[]`
  - 규칙
    - 항상 `traversal[0] === previous`, `traversal[traversal.length - 1] === current`
    - pop에서 |delta| = N이면 길이는 N + 1
    - push/replace도 일관성을 위해 `[previous, current]` 권장
  - 해석
    - “앞쪽(back), 뒤쪽(forward)” 관점 충족: 배열은 실제 이동 순서 그대로 주어지므로, 앞쪽 구간은 뒤로 가며 벗어나는 노드들, 뒤쪽 구간은 앞으로 가며 진입하는 노드들로 자연스럽게 해석됩니다.
    - 질문하신 대로 delta=1이면 `traversal[0]`이 previous가 됩니다.

### 왜 이 방식이 유리한가

- 핵심 원인: 현재 모델은 previous/current/delta만 전달하여 중간 노드의 정보를 잃습니다.
- 해결: 경로 계산을 이벤트 발행 지점(NodeManager) 한 곳으로 모아 일관성 있게 계산 → 소비자는 단순 순회만 수행
- 장점
  - 중복/누락 없는 정확한 전달
  - 소비자(모달 컨트롤러) 로직 단순화
  - 기존 리스너와의 호환성 유지(기존 필드 유지)
- 대안(노드 id별 리스너)은 생명주기/누수/복잡도만 증가시키고, 경로 계산 문제의 본질을 해결하지 못하므로 비추천

### NodeManager에서의 계산 방식(개념)

- pop 처리 시:
  - `previousPosition = position`, `currentPosition = findIndex(state.node.id)`
  - `step = Math.sign(currentPosition - previousPosition)`
  - `indices = [previousPosition, previousPosition + step, ..., currentPosition]`
  - `traversal = indices.map(i => nodes[i])`
- push/replace에서도 동일 규칙으로 `[previous, current]` 설정

### 소비자 사용 예(개념)

- 뒤로가기(delta < 0): `traversal.slice(0, -1)`를 순회하며 이전 노드들에 “leave/close” 콜백, 마지막 요소(current)에 “enter/open” 콜백
- 앞으로가기(delta > 0): `traversal.slice(1)`을 순회하며 “enter/open” 콜백, 필요시 첫 요소(previous)에 “deactivate” 등 처리
- replace(delta = 0): `[previous, current]` 기반으로 교체 처리만 수행

### sealed 처리와의 관계

- 현재 sealed 전략은 onNavigated에서 “리스너 통지 없이” `history.go()`로 재조정합니다. 이 설계를 유지해도 됩니다.
- 최종적으로 실제 진입이 허용되는 노드에서 한 번의 이벤트가 발행되고, 그 이벤트의 `traversal`이 최종 경로를 정확히 담습니다.

### 권장 적용 범위

- 타입 정의 파일에 `traversal` 필드 추가
- `HistoryNodeManager`에서 `onPushState/onReplaceState/onPopState`가 이벤트 생성 시 `traversal`을 계산해 포함
- 기존 리스너는 영향 없이 동작하고, 필요 시 `traversal`을 사용하도록 점진 이행 가능

원하시면 이 스펙으로 최소 변경(타입 1곳 + Manager 1곳)만 적용하는 간단한 에디트를 준비해 드릴게요. 진행할까요?

- 요약
  - 문제의 원인: 이벤트 모델이 중간 노드 정보를 전달하지 않음.
  - 해결: 이벤트에 `traversal: AdvancedHistoryNode[]` 추가, 항상 `[previous, ... , current]` 규칙.
  - 장점: 구조 단순, 소비자 편의성↑, sealed 전략과 충돌 없음.
  - id별 리스너 추가는 비추천.
