# LOL Champion Next.js

기존 Android, Flutter, Vue, React Native 앱과 동일한 기능을 Next.js App Router로 구현한 모바일 웹입니다.

## 기술 구성

- Next.js App Router + React + TypeScript
- TanStack React Query: 서버 상태, 캐시, 재시도 및 SSR hydration
- Zustand: 검색어와 같은 화면 상태
- Axios: Data Dragon HTTP 통신
- Zod: 외부 JSON DTO 런타임 검증
- i18next/react-i18next: UI 문구 리소스
- 수동 DI Composition Root
- CSS Modules
- Vitest

## 실행

```powershell
cd C:\workspace\lol\react
corepack pnpm install
corepack pnpm dev
```

PC 브라우저에서 `http://localhost:3000`으로 접속합니다.

같은 Wi-Fi의 휴대폰에서 확인하려면:

```powershell
corepack pnpm dev:mobile
```

출력되는 PC 주소 또는 `http://PC_IP:3000`으로 휴대폰에서 접속합니다. Windows 방화벽에서 Node.js의 사설 네트워크 접근 허용이 필요할 수 있습니다.

## 프로덕션 실행

```powershell
corepack pnpm build
corepack pnpm start
```

## 화면 경로

```text
src/app/page.tsx                           → /
src/app/champions/page.tsx                 → /champions
src/app/champions/[championId]/page.tsx    → /champions/:championId
```

`src/app`의 라우트는 서버에서 초기 데이터를 준비하고 React Query 상태를 브라우저에 전달합니다. 검색, 클릭, 스킨 스크롤처럼 상호작용이 필요한 화면은 Client Component입니다.

## Android 구조와 비교

```text
src/app                         Navigation Graph + Activity 진입점
src/app/providers               Application 범위 Provider
src/app/di/container.ts         Hilt Module/Component 역할
features/champion/presentation  Compose UI + ViewModel
features/champion/domain        Entity + Repository interface + UseCase
features/champion/data          Retrofit DTO + DataSource + Repository 구현
core/i18n/locales/ko.json       strings.xml
core/storage                    SharedPreferences 성격의 localStorage adapter
```

웹의 `localStorage`는 보안 저장소가 아닙니다. 현재는 공개 정보인 패치 버전만 저장합니다. 추후 인증 토큰은 백엔드가 발급하는 `HttpOnly + Secure + SameSite` 쿠키를 사용해야 합니다.

## 검증

```powershell
corepack pnpm type-check
corepack pnpm lint
corepack pnpm test
corepack pnpm format:check
corepack pnpm build
```
