# @heart-re-up/react-lib

React 라이브러리입니다. 재사용 가능한 커스텀 훅 및 컨텍스트/프로바이더들을 제공합니다.

## 훅 목록

### 상태 관리
- `useToggle` - 불린 상태를 쉽게 토글하는 훅
- `useLocalStorage` - localStorage와 동기화되는 상태 관리 훅
- `usePrevious` - 이전 값을 기억하는 훅

### 타이밍 & 디바운싱
- `useDebounce` - 함수 호출을 지연시켜 성능을 최적화하는 훅
- `useThrottle` - 함수 호출 빈도를 제한하는 훅
- `useTimeout` - setTimeout을 React에서 안전하게 사용하는 훅
- `useInterval` - setInterval을 React에서 안전하게 사용하는 훅 ✨
- `useCountdown` - 정확한 카운트다운 기능을 제공하는 훅

### UI 인터랙션
- `useClickOutside` - 요소 외부 클릭을 감지하는 훅 ✨
- `useEventListener` - DOM 이벤트를 쉽게 처리하는 훅
- `useKeyDown` - 키보드 이벤트를 처리하는 훅
- `useMediaQuery` - CSS 미디어 쿼리를 감지하는 훅

### 스크롤 & 관찰
- `useIntersectionObserver` - 요소의 뷰포트 교차를 감지하는 훅 ✨
- `useOnScreen` - 요소가 화면에 보이는지 감지하는 간단한 훅 ✨
- `useResizeObserver` - 요소 크기 변화를 감지하는 훅
- `useMutationObserver` - DOM 변화를 감지하는 훅

### 포커스 관리
- `useFocus` - 포커스 상태를 관리하는 훅
- `useFocusTrap` - 포커스를 특정 영역에 가두는 훅
- `useFocusableElements` - 포커스 가능한 요소들을 찾는 훅

### 데이터 & 네트워킹
- `useFetch` - 간단한 데이터 페칭을 위한 훅 ✨
- `useCopyToClipboard` - 클립보드에 데이터를 복사하는 훅
- `useDownload` - 파일 다운로드 기능을 제공하는 훅

### 진행 상태
- `useProgressCounter` - 비동기 작업 진행 상태를 관리하는 훅
- `useProgressCounterAsync` - 비동기 작업 진행 상태를 관리하는 비동기 버전 훅

### 유틸리티
- `useForkRef` - 여러 ref를 하나로 합치는 훅
- `useForkEvent` - 여러 이벤트 핸들러를 하나로 합치는 훅
- `useParentElement` - 부모 요소를 찾는 훅
- `usePreventScroll` - 스크롤을 방지하는 훅
- `useIsomorphicLayoutEffect` - SSR 안전한 useLayoutEffect 훅

✨ = 새로 추가된 훅

## 설치

````bash
npm install @heart-re-up/react-lib
# 또는
yarn add @heart-re-up/react-lib
# 또는
pnpm add @heart-re-up/react-lib
```Ø

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
````

## 라이센스

MIT
