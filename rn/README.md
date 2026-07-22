# LoL 챔피언 React Native

기존 Android, Flutter, Vue 구현과 동일한 챔피언 목록·검색·상세·스킬·스킨 기능을 Expo 기반 React Native로 구현한 Android/iOS 앱입니다.

## 기술 구성

- Expo SDK 57 + React Native 0.86 + TypeScript
- Expo Router: 파일 기반 네이티브 화면 이동
- TanStack React Query: Data Dragon 서버 상태와 캐시
- Zustand: 검색어 같은 화면 상태
- Axios: HTTP 통신
- Zod 4: 외부 JSON 런타임 검증
- Expo SecureStore: 패치 버전 보안 저장
- i18next + react-i18next + Expo Localization: 다국어 문구
- Expo Image: 메모리·디스크 이미지 캐시
- React Native Reanimated: 스킨 캐러셀 변환
- Jest + React Native Testing Library: 테스트

## 앱 식별자

- Android applicationId: `com.rn.lol`
- iOS bundle identifier: `com.rn.lol`

## 구조

```text
src/
├─ app/                         Expo Router 경로 파일
├─ bootstrap/
│  ├─ di/                       수동 DI 조립
│  ├─ providers/                앱 전역 Provider
│  └─ query/                    React Query 설정
├─ core/                        통신, 오류, 저장, 다국어, 테마
└─ features/champion/
   ├─ presentation/             화면, 컴포넌트, Query, Zustand
   ├─ domain/                   엔티티, Repository 계약, UseCase
   └─ data/                     Axios, Zod DTO, Mapper, Repository 구현
```

Android에 비유하면 `presentation`은 Activity/Fragment/Compose와 ViewModel, `domain`은 UseCase와 순수 모델, `data`는 Retrofit DTO와 Repository 구현입니다. `src/bootstrap/di/container.ts`는 Hilt Module의 객체 조립 역할을 합니다.

## 실행

Node.js 22.13 이상과 pnpm이 필요합니다.

```powershell
cd C:\workspace\lol\rn
corepack pnpm install
corepack pnpm start
```

Expo 개발 서버에서 `a`를 누르면 Android 에뮬레이터에서 Expo Go로 빠르게 확인할 수 있습니다. 실제 `com.rn.lol` 네이티브 프로젝트를 생성하고 실행하려면 Android Studio와 SDK를 준비한 후 실행합니다.

```powershell
corepack pnpm android
```

iOS 로컬 빌드는 macOS와 Xcode가 필요합니다.

```bash
corepack pnpm ios
```

## 검증

```powershell
corepack pnpm type-check
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
```

Data Dragon 호출은 네이티브 HTTP 통신이므로 웹 브라우저의 CORS 제한을 받지 않습니다. 패치 버전은 공개 정보지만 기존 앱과 동일하게 추후 민감 정보 저장에 대비해 SecureStore를 사용합니다.
