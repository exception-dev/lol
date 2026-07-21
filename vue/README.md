# LoL 챔피언 모바일 웹

기존 Android/Flutter 앱의 챔피언 목록, 검색, 상세, 스킬, 스킨 기능을 모바일 웹으로 구현한 Vue 3 프로젝트입니다. Riot Data Dragon 공개 데이터를 사용하며 Android, Flutter 프로젝트에는 변경을 가하지 않습니다.

## 기술 구성

- Vue 3 + TypeScript + Vite
- Vue Router: 화면 이동과 직접 URL 접근
- Pinia: 검색어 같은 화면 상태
- TanStack Vue Query: 서버 데이터 캐시와 로딩·오류 상태
- Axios: Data Dragon HTTP 통신
- Zod: 외부 JSON의 런타임 구조 검증
- Vue I18n: 화면 문구 리소스 관리
- Vitest + Vue Test Utils: 단위 및 컴포넌트 테스트

## 구조

기능 중심 클린 아키텍처를 사용합니다.

```text
src/
├─ app/                       앱 조립, 라우팅, Query 설정
├─ core/                      HTTP, 설정, 오류, 다국어, 저장소
└─ features/
   └─ champion/
      ├─ presentation/        Vue 페이지, 컴포넌트, Pinia, Query
      ├─ domain/              엔티티, 저장소 인터페이스, 유스케이스
      └─ data/                Axios 데이터소스, Zod DTO, 매퍼, 저장소 구현
```

Android에 비유하면 `presentation`은 Activity/Fragment/Compose UI와 ViewModel, `domain`은 UseCase와 순수 모델, `data`는 Retrofit API·DTO·Repository 구현에 해당합니다. `src/app/di/container.ts`는 Hilt/Dagger 모듈처럼 실제 구현체를 조립합니다.

## 실행과 검증

Node.js와 pnpm이 필요합니다.

```sh
pnpm install
pnpm dev
```

품질 검사는 다음 명령으로 실행합니다.

```sh
pnpm type-check
pnpm lint
pnpm test:unit
pnpm build
```

배포 빌드를 로컬에서 확인하려면 다음을 사용합니다.

```sh
pnpm preview
```

## API와 배포 참고사항

- Data Dragon은 브라우저의 교차 출처 GET 요청을 허용하므로 현재 기능에는 별도 프록시 서버가 필요하지 않습니다.
- 인증 정보는 전송하지 않으며 Axios의 `withCredentials`도 끈 상태입니다.
- 패치 버전은 공개 정보이므로 `localStorage`에 마지막 정상 값을 보관합니다. 토큰이나 비밀번호를 여기에 저장하면 안 됩니다. 인증 기능이 추가되면 백엔드의 Secure/HttpOnly/SameSite 쿠키 방식을 권장합니다.
- Vue Router의 직접 URL(`/champions/Ahri`)이 동작하도록 운영 서버에서 찾을 수 없는 경로를 `index.html`로 돌려주는 SPA fallback 설정이 필요합니다.
- manifest와 앱 아이콘은 포함하지만 서비스 워커와 오프라인 캐시는 적용하지 않은 일반 모바일 웹입니다.

## 다국어 추가

화면 문구는 `src/core/i18n/locales/ko.json`에 모여 있습니다. 새 언어를 추가할 때는 같은 키 구조의 JSON 파일을 만들고 `src/core/i18n/index.ts`와 `locale.ts`에 언어 및 Data Dragon 로케일 매핑을 추가하면 됩니다.

앱 아이콘은 참고용 Android 프로젝트의 `mipmap-xxxhdpi/ic_launcher.png`를 원본으로 웹용 크기를 생성했습니다.
