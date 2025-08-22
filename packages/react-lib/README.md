# @heart-re-up/hooks

React Hooks 라이브러리입니다. 재사용 가능한 커스텀 훅들을 제공합니다.

## 설치

```bash
npm install @heart-re-up/hooks
# 또는
yarn add @heart-re-up/hooks
# 또는
pnpm add @heart-re-up/hooks
```

## 사용법

### useLocalStorage

localStorage와 동기화되는 상태를 관리합니다.

```typescript
import { useLocalStorage } from '@heart-re-up/hooks';

function App() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="이름을 입력하세요"
    />
  );
}
```

### useDebounce

값의 변경을 지연시켜 성능을 최적화합니다.

```typescript
import { useDebounce } from '@heart-re-up/hooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="검색어를 입력하세요"
    />
  );
}
```

### useToggle

boolean 상태를 쉽게 토글할 수 있습니다.

```typescript
import { useToggle } from '@heart-re-up/hooks';

function ToggleComponent() {
  const [isVisible, toggle, setToggle] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? '숨기기' : '보이기'}
      </button>
      <button onClick={() => setToggle(true)}>
        강제로 보이기
      </button>
      {isVisible && <div>토글된 콘텐츠</div>}
    </div>
  );
}
```

## API 문서

### useLocalStorage<T>(key: string, initialValue: T)

**Parameters:**
- `key`: localStorage 키
- `initialValue`: 초기값

**Returns:**
- `[value, setValue]`: 현재 값과 설정 함수

### useDebounce<T>(value: T, delay: number)

**Parameters:**
- `value`: 디바운스할 값
- `delay`: 지연 시간 (밀리초)

**Returns:**
- `debouncedValue`: 디바운스된 값

### useToggle(initialValue?: boolean)

**Parameters:**
- `initialValue`: 초기값 (기본값: false)

**Returns:**
- `[value, toggle, setValue]`: 현재 값, 토글 함수, 설정 함수

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 모드로 빌드 (watch)
pnpm build:watch

# 테스트 실행
pnpm test

# 테스트 UI
pnpm test:ui

# 커버리지 확인
pnpm test:coverage

# 린트 검사
pnpm lint

# 포맷팅
pnpm format
```

## 라이센스

MIT
