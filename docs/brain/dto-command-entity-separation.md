---
status: 직접 다뤄봄
first-seen: 2026-08-05
---

# DTO · Command · Entity 분리

같은 필드를 든 세 클래스가 계층마다 따로 존재하는 이유는 중복이 아니라 **변경 이유가 다르기 때문**이다.

## 핵심 (재구성 단서)

- 판별식: **"이 파일의 import 목록에 프레임워크가 있는가."** DTO는 `class-validator`(presentation),
  Command는 import 0개(application), Entity는 도메인만(domain).
- 바뀌는 이유: DTO는 API 스펙이 바뀔 때, Command는 유스케이스가 바뀔 때, Entity는 비즈니스가 바뀔 때.
  DTO를 그대로 핸들러에 넘기면 application이 HTTP를 알게 되어, 같은 유스케이스를 CLI·큐에서 재사용할 때
  HTTP용 클래스가 딸려온다.
- 검증이 두 겹인 이유(중복 아님): DTO 검증 = 문지기(쓰레기를 빨리 400으로 튕김), VO/Entity 검증 =
  불변식 보증(HTTP를 안 거치는 경로에서도 성립). **없애도 되는 쪽이 DTO 검증**이라는 게 우선순위를 말해준다.
- 워크드 예제: `create-product.dto.ts`의 `@Matches(/^[A-Za-z0-9-]+$/)`와 `sku.vo.ts`의 `SKU_PATTERN`이 같은
  정규식이다. 앞을 지우면 잘못된 SKU가 500을 내고, 뒤를 지우면 잘못된 SKU가 DB에 저장된다.
- DTO가 `interface`가 아니라 `class`인 이유: 데코레이터는 런타임 메타데이터인데 interface는 컴파일 후
  사라진다([[di-token-for-interface]]와 같은 뿌리).
- 함정: 기본값을 여러 계층에 흩뿌리면 조용히 어긋난다. 이 레포의 `currency` 기본값은 DTO 초기화식 ·
  컨트롤러 `|| 'USD'` · `Money.create` 기본 파라미터 · DB 컬럼 default 네 곳에 있다.
- 함정: 계층을 나눴다고 상태 코드가 저절로 맞진 않는다. 도메인이 던지는 평범한 `Error`는 Nest에서 500이
  되므로 번역 계층(도메인 예외 + 예외 필터)이 따로 필요하다.

## 등장 이력

- 2026-08-05 · Product 생성 파이프라인 · DTO/Command/Entity 세 벌을 직접 작성
- 2026-08-05 · `GET /products` 목록 조회 · 판별식("import에 프레임워크가 있는가")으로 쿼리 DTO 위치를 스스로 판단 — 정답

## 인출 기록

- (없음)

## 관련 개념

- [[cqrs-command-bus]] — Command가 버스를 타고 핸들러에 도달하는 경로
- [[always-valid-value-object]] — 두 겹 검증 중 안쪽(불변식)을 담당하는 규칙
- [[dependency-rule]] — 세 클래스가 각각 어느 원에 놓이는가
