---
status: 직접 다뤄봄
first-seen: 2026-08-05
---

# CQRS와 CommandBus

상태를 바꾸는 요청(Command)과 읽는 요청(Query)의 코드 경로를 분리하고, 호출을 메서드가 아니라 "값(요청서 객체)"으로 표현한다.

## 핵심 (재구성 단서)

- 유도: `service.create(dto)`는 호출부가 수신자를 컴파일타임에 안다 → 요청을 **객체**로 만들면 호출부는
  "무엇을 원하는지"만 말한다 → 라우팅은 버스가 맡는다 → 유스케이스 1개 = 폴더 1개가 되어 디렉토리가
  곧 앱의 기능 목록이 된다.
- 라우팅 메커니즘(호출부↔핸들러 직접 참조 0): `@CommandHandler(Cmd)`가 Cmd 클래스에 랜덤 UUID를,
  핸들러 클래스에 "담당 커맨드"를 메타데이터로 심음 → 부팅 시 `ExplorerService`가 전 모듈을 스캔해
  `CommandBus`에 등록 → `execute(cmd)`가 그 UUID로 핸들러를 조회.
- 핸들러는 **조율만** 한다: "도메인 객체 생성 → 포트에 저장" 몇 줄. 핸들러에 `if`가 쌓이면 그건 도메인으로
  내려가야 할 규칙이다(= 빈혈 도메인 모델 회피).
- 워크드 예제: `src/product/application/use-cases/create-product/` — command(import 0개) + handler(11줄).
  등록은 `application/index.ts`의 `CommandHandlers` 배열 → `product.module.ts`의 `...CommandHandlers`.
- 함정: `CqrsModule.forRoot()`는 이미 `global: true`. 하위 모듈에서 정적 `imports: [CqrsModule]`을 또 하면
  Nest가 정적/동적 모듈에 다른 토큰을 주므로 버스 인스턴스가 두 벌 생긴다.
- 함정: Command의 `void` 반환은 기술 제약이 아니라 선택 — `CommandBus.execute<R>()`가 반환 타입을 지원한다.
- 함정: 파일 수 증가가 실제 비용. 단순 CRUD 앱에는 과설계.

## 등장 이력

- 2026-08-05 · Product 생성 파이프라인 · Command/Handler/Bus 배선을 직접 작성
- 2026-08-05 · `GET /products` 목록 조회 · Query 쪽 첫 등장 — 핸들러 미구현이라 `QueryHandlerNotFoundException`(500) 상태

## 인출 기록

- 2026-08-05 · `GET /products/:id`의 Query 핸들러가 `ProductRepository` 포트를 그대로 써야 하는지 (대기)

## 관련 개념

- [[dto-command-entity-separation]] — 버스에 실어 보내는 Command가 왜 DTO와 별개인가
- [[dependency-inversion-principle]] — 핸들러가 리포지토리를 포트로 주입받는 이유
- [[dependency-rule]] — 핸들러가 application 계층에 놓이는 근거
