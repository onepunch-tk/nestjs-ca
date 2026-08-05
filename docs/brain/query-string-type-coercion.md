---
status: 직접 다뤄봄
first-seen: 2026-08-05
---

# 쿼리스트링 타입 강제 변환

HTTP 쿼리스트링에는 문자열만 담기므로, 숫자·불리언으로 쓰려면 경계에서 반드시 명시적으로 변환해야 한다.

## 핵심 (재구성 단서)

- 유도: `?minPrice=100`은 파서를 거쳐 `'100'`(문자열) → 검증기는 타입을 있는 그대로 봄 → `@IsNumber()`가
  실패 → **검증 전에** 변환이 끝나 있어야 한다. 그래서 순서가 `plainToInstance` → `validate`다.
- 변환을 언제 하느냐는 옵션이 정한다: class-transformer는 `@Type(() => Number)`처럼 **명시된** 타입이 있으면
  변환하고, 명시가 없으면 `enableImplicitConversion`이 켜져 있을 때만 `design:type` 메타데이터를 읽어 변환한다
  (`TransformOperationExecutor.js:250-258`). 꺼져 있으면 문자열 그대로 통과한다.
- `@Type`(기본 변환)과 `@Transform`(커스텀 함수)이 둘 다 있으면 **plain→class 방향에서는 `@Type`이 먼저**,
  그 결과가 `@Transform`에 들어간다 (`TransformOperationExecutor.js:299-300`). 반대 방향(class→plain)은 순서가 뒤집힌다.
- 워크드 예제: `isActive`에 `@Type(() => Boolean)`을 쓰면 안 된다 — 내부가 `Boolean(value)`이고
  (`TransformOperationExecutor.js:91-95`) `Boolean('false') === true`라 `?isActive=false`가 `true`로 뒤집힌다.
  `'true'/'false'`를 손으로 매핑하는 `@Transform`을 쓰고, 매칭 안 되는 값은 원본 그대로 넘겨 `@IsBoolean()`이 400을 내게 한다.
- 함정: `Number('abc')`는 예외가 아니라 `NaN`이다. 걸러지는 건 class-validator의 `isNumber`가 `allowNaN` 없이는
  `NaN`을 거부하기 때문(`IsNumber.js:16-18`) — 변환 자체는 조용히 성공한다.
- 함정: 변환 지점이 presentation 밖으로 새면 application이 "문자열이 올 수도 있다"를 떠안는다([[dto-command-entity-separation]]).

## 등장 이력

- 2026-08-05 · `GET /products` 목록 조회 · `list-products-query.dto.ts`를 직접 작성하고 QueryHandler까지 배선

## 인출 기록

- 2026-08-05 · DTO에 없는 쿼리 파라미터(`?page=2`)는 무시인가 400인가 — 시드 검증 중 실행 결과로 먼저 공개됨(400). 본인 답변 없음 → 같은 취지를 다른 각도로 다시 물을 것

## 관련 개념

- [[dto-command-entity-separation]] — 이 변환 코드가 왜 presentation 계층에만 있어야 하는가
- [[always-valid-value-object]] — 변환·검증을 통과한 값이 그다음 만나는 안쪽 검증
- [[dependency-rule]] — 프로토콜 사정이 안쪽 원으로 새면 안 되는 이유
