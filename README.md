# React Hooks Monorepo

React Hooks 라이브러리와 데모 애플리케이션을 위한 모노레포입니다.

## 📦 패키지 구조

```
react-hooks/
├── packages/
│   └── react-lib/              # React Hooks 라이브러리
├── apps/
│   └── react-lib-demo/         # 데모 애플리케이션
└── config/                     # 공통 설정 패키지들
    ├── eslint-config/          # ESLint 설정
    ├── typescript-config/      # TypeScript 설정
    └── prettier-config/        # Prettier 설정
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
# 모든 패키지 개발 모드 실행
pnpm dev

# 특정 앱만 실행(package.json 의 name 으로 필터)
pnpm dev --filter=@heart-re-up/react-lib-demo
```

### 3. 라이브러리 빌드

```bash
# 모든 패키지 빌드
pnpm build

# hooks 라이브러리만 빌드
pnpm build --filter=@heart-re-up/react-lib
```

## 📚 패키지 상세

### @heart-re-up/react-lib

React Hooks 라이브러리 패키지입니다.

### @heart-re-up/react-lib-demo

훅 라이브러리의 데모 애플리케이션입니다.

**기술 스택:**

- React 19
- Vite
- Tailwind CSS
- Radix UI
- TypeScript

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트 실행
pnpm test

# 테스트 UI
pnpm test --filter=@heart-re-up/react-lib-demo -- --ui

# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 포맷팅 검사
pnpm format

# 포맷팅 자동 수정
pnpm format:fix

# 타입 검사
pnpm typecheck

# 캐시 정리
pnpm clean
```

## 🧪 테스트

각 훅에 대한 단위 테스트가 포함되어 있습니다.

```bash
# 모든 테스트 실행
pnpm test

# 커버리지 확인
pnpm test:coverage

# 테스트 UI (Vitest)
pnpm test:ui
```

## 📖 문서

- [packages/react-lib/README.md](./packages/react-lib/README.md) - 훅 라이브러리 상세 문서
- 데모 애플리케이션: http://localhost:3000 (개발 서버 실행 후)

## 🔧 설정

### TypeScript

공통 TypeScript 설정은 `config/typescript-config`에서 관리됩니다:

- `base.json`: 기본 설정
- `app.json`: 애플리케이션용 설정
- `lib.json`: 라이브러리용 설정

### ESLint

공통 ESLint 설정은 `config/eslint-config`에서 관리됩니다:

- `base.mjs`: 기본 설정
- `react.mjs`: React용 설정
- `lib.mjs`: 라이브러리용 설정

### Prettier

공통 Prettier 설정은 `config/prettier-config`에서 관리됩니다.

## 🚀 배포

### 라이브러리 배포

```bash
# 라이브러리 빌드
pnpm build --filter=@heart-re-up/react-lib

# NPM 배포 (package.json의 private: false 설정 필요)
pnpm publish --filter=@heart-re-up/react-lib
```

### 데모 앱 배포

```bash
# 데모 앱 빌드
pnpm build --filter=@heart-re-up/react-lib-demo

# 빌드된 파일은 apps/hooks/dist에 생성됩니다
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-hook`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing hook'`)
4. 브랜치를 푸시합니다 (`git push origin feature/amazing-hook`)
5. Pull Request를 생성합니다

## 📄 라이센스

MIT License
