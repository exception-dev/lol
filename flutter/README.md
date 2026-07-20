# LOL Champion

Riot Data Dragon의 한국어 데이터를 사용해 League of Legends 챔피언 목록과
상세 정보를 보여주는 Flutter 앱입니다. Android, iOS, Web을 지원합니다.

## 주요 기능

- 최신 Data Dragon 패치 버전 조회 및 보안 저장
- 챔피언 2열 그리드와 200ms 디바운스 검색
- 로딩, 오류, 재시도 상태 처리
- 챔피언 설명, 역할 태그, 패시브, Q/W/E/R, 스킨 페이지 표시
- URL 기반 상세 화면 라우팅

## 기술 구성

- 상태 관리 및 DI: Riverpod
- 라우팅: go_router
- 네트워크: Dio
- JSON 변환: json_serializable
- 로컬 저장: flutter_secure_storage
- 이미지: cached_network_image
- 다국어 리소스: Flutter gen_l10n + ARB

## 구조

기능 중심 클린 아키텍처를 사용합니다.

```text
lib/
├─ app/                 # 앱, 테마, 라우터
├─ core/                # 공통 상수, 오류, 다국어 접근, 네트워크, 저장소
├─ l10n/                # ARB 문구와 Flutter 생성 다국어 코드
└─ features/champion/
   ├─ data/             # DTO, 데이터소스, Repository 구현
   ├─ domain/           # Entity, Repository 계약, UseCase
   └─ presentation/     # Riverpod Controller, Page, Widget
```

## 실행

```sh
flutter pub get
flutter gen-l10n
dart run build_runner build
flutter run
```

## 문구와 앱 아이콘

사용자에게 표시하는 문구는 `lib/l10n/app_ko.arb`에서 관리합니다. 언어를
추가할 때 같은 키를 가진 `app_en.arb` 같은 파일을 추가한 뒤
`flutter gen-l10n`을 실행합니다. iOS의 `CFBundleLocalizations`에도 새 언어를
추가해야 합니다.

런처 아이콘 원본은 `assets/icon/app_icon.png`입니다. 현재 Android, iOS,
Web 아이콘은 참고 Android 프로젝트의 아이콘을 사용합니다.

검증 명령은 다음과 같습니다.

```sh
dart format --set-exit-if-changed lib test
flutter analyze
flutter test
flutter build apk --debug
flutter build web
```

Web에서 `flutter_secure_storage`를 사용하려면 localhost 또는 HTTPS 환경이
필요합니다. 운영 배포 시에는 HSTS 등 적절한 보안 헤더를 설정해야 합니다.
go_router 경로로 직접 접근할 수 있도록 호스팅 서버에 SPA fallback도
설정해야 합니다.
