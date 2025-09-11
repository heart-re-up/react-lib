# History Manager

히스토리 기반 모달 및 네비게이션 상태 관리 라이브러리입니다.

## 특징

- **단방향 데이터 흐름**: 히스토리가 Single Source of Truth
- **자동 상태 복구**: 브라우저 네비게이션 시 자동으로 상태 복구
- **Affinity 그룹 관리**: 관련된 히스토리들을 그룹으로 관리
- **Sealed 전략**: 특정 히스토리 그룹 자동 스킵

## 기본 사용법

### React Hook 사용

```typescript
import { useHistoryManager } from '@/services/history-manager';

function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { push, replace, seal } = useHistoryManager({
    affinity: 'page-modals',
    onNavigated: (event) => {
      if (event.type === 'enter' && !event.sealed) {
        setIsOpen(true);
      } else if (event.type === 'exit') {
        setIsOpen(false);
      }
    }
  });

  const handleOpen = () => {
    push({ modal: 'settings' });
  };

  const handleUpdate = (data: any) => {
    replace({ modal: 'settings', ...data });
  };

  return (
    <>
      <button onClick={handleOpen}>Open Settings</button>
      {isOpen && (
        <Modal onClose={() => history.back()}>
          Settings Content
        </Modal>
      )}
    </>
  );
}
```

### 페이지 전환 시 모달 봉인

```typescript
function PageA() {
  const { seal } = useHistoryManager({
    affinity: 'page-a-modals'
  });

  // 페이지를 떠날 때 모든 모달 봉인
  useEffect(() => {
    return () => seal();
  }, [seal]);

  return <PageContent />;
}
```

## API

### useHistoryManager

```typescript
interface UseHistoryManagerOptions {
  affinity?: string | AffinityOptions;
  onNavigated?: (event: NavigationEvent) => void;
}

interface NavigationEvent {
  type: "enter" | "exit";
  direction: "forward" | "backward";
  node: HistoryNode;
  sealed?: boolean;
}

interface UseHistoryManagerReturn {
  push: (data: any, url?: string) => void;
  replace: (data: any, url?: string) => void;
  seal: (strategy?: SealedStrategy) => void;
  unseal: () => void;
}
```

### Sealed 전략

- `passthrough`: 진입 방향으로 계속 이동
- `snapback`: 진입 방향의 반대로 되돌아감

## 고급 사용법

### 중첩 모달 관리

```typescript
function ModalFlow() {
  const modal1 = useHistoryManager({
    affinity: "checkout-flow",
    onNavigated: (event) => {
      setModal1Open(event.type === "enter");
    },
  });

  const modal2 = useHistoryManager({
    affinity: "checkout-flow",
    onNavigated: (event) => {
      setModal2Open(event.type === "enter");
    },
  });

  const handleOpenModal1 = () => {
    modal1.push({ step: "shipping" });
  };

  const handleOpenModal2 = () => {
    modal2.push({ step: "payment" });
  };

  const handleComplete = () => {
    // 전체 플로우 봉인
    modal1.seal();
    router.push("/success");
  };
}
```

### 조건부 Sealed 처리

```typescript
const { push, seal } = useHistoryManager({
  affinity: "form-modals",
  onNavigated: (event) => {
    if (event.sealed) {
      // 봉인된 상태에서도 특별한 처리 가능
      console.log("This modal was sealed");
    }
    setOpen(event.type === "enter" && !event.sealed);
  },
});
```

## 주의사항

1. **Affinity ID는 고유해야 함**: 같은 affinity ID를 가진 히스토리들은 하나의 그룹으로 관리됩니다.
2. **Seal 후 복구 불가**: 한 번 seal된 히스토리는 unseal하지 않는 한 자동으로 스킵됩니다.
3. **서버 사이드 렌더링**: SSR 환경에서는 window.history가 없으므로 클라이언트 사이드에서만 사용하세요.

## 예제: 전체 플로우

```typescript
// 1. 페이지 A
const pageA = useHistoryManager({ affinity: "page-a-modals" });

// 2. 모달 1 열기
pageA.push({ modal: "user-info" });

// 3. 모달 2 열기 (중첩)
pageA.push({ modal: "phone-verify" });

// 4. 모달 3 열기 (중첩)
pageA.push({ modal: "confirm" });

// 5. 페이지 B로 이동 전 seal
pageA.seal();
router.push("/page-b");

// 6. 페이지 B에서 back
history.back();
// → 페이지 A로 돌아감 (모달들은 sealed 상태라 스킵됨)
```
