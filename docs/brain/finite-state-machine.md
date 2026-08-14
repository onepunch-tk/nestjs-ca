---
status: 설명만 들음
first-seen: 2026-08-13
---

# Finite State Machine (유한 상태 기계)

가능한 상태의 유한한 집합과 상태 간 허용된 전이 경로를 표로 정의하는 모델.

## 핵심 (재구성 단서)

- 유도: 상태가 유한하다 → "어디서 어디로 갈 수 있나"를 전부 나열할 수 있다 → `Record<상태, 상태[]>`
  표 하나로 규칙이 **데이터**가 된다 → 전이 검사는 `표[현재].includes(목표)` 한 줄 → 규칙 변경 = 표의 한 줄 수정.
- 워크드 예제: `src/order/domain/value-objects/order-status.vo.ts`의 `VALID_TRANSITIONS`.
  `confirmed: ['shipped','cancelled']`, `delivered: []`(빈 배열 = 종착 상태). 모든 public 전이
  메서드(confirm/ship/deliver/cancel)가 private `transitionTo` 관문 하나로 모인다.
- `Record<Union, T>`는 union의 모든 key를 강제 → 타입에 상태를 추가하고 표에 행을 빠뜨리면 컴파일 에러.
- 함정: 표 밖에 같은 지식을 중복하면(예: fromString의 valid 배열) 상태 추가 시 런타임에야 터지는 곳이 생긴다.
- 함정: 종착 상태는 "규칙 생략"이 아니라 "빈 배열"로 명시해야 표가 완전해진다.

## 등장 이력

- 2026-08-13 · OrderStatus VO 강의 분석 · 강의 따라 친 코드를 리뷰받음(설계는 강의 것)
- 2026-08-13 · typestate 실험 · 전이 표의 각 행이 this-파라미터 시그니처로 옮겨지는 대응을 확인

## 인출 기록

- 2026-08-13 · "refunded 상태 추가 시 몇 군데 수정? 컴파일러가 잡는 곳 vs 런타임에 터지는 곳은?" (대기)

## 관련 개념

- [[invariant]] — 이 표가 지키는 것의 일반 개념
- [[always-valid-value-object]] — 전이 검증도 결국 같은 원리(입구에서 막기)의 확장
- [[entity-vs-value-object]] — 전이가 새 인스턴스 반환인 이유
