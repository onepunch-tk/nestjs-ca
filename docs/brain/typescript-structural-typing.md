---
status: 설명만 들음
first-seen: 2026-08-04
---

# TypeScript Structural Typing

TypeScript는 타입 이름이 아니라 구조(모양)가 같으면 호환으로 본다.

## 핵심 (재구성 단서)

- 유도: 이름이 아니라 모양으로 비교 → 필드가 전부 `public`이면 서로 무관한 두 클래스가 호환됨 →
  `const uid: UserId = new OrderId('x')`가 통과 → VO로 타입을 갈라놓은 의미가 사라진다.
- 탈출구: **private/protected 멤버가 하나라도 있으면** TS는 "같은 선언에서 나왔는가"까지 따진다
  (nominal-like). 그래서 서로 다른 VO 간 대입이 막힌다.
- 워크드 예제: tsc 5.9.3 실제 출력 —
  `error TS2322: Type 'OrderId' is not assignable to type 'UserId'.` 아래 들여쓰기로
  `Types have separate declarations of a private property 'value'.` (하위 설명은 TS2442 문구)
- 그래서 `src/shared/domain/value-objects/unique-id.vo.ts`의 `private readonly value: string`은
  결과적으로 옳은 선택. 앞으로 만들 VO 전부 동일하게.
- 함정: 이 보호는 상속 관계에는 안 통한다. `User extends Entity`와 `Order extends Entity`는
  `protected id`의 선언 출처가 같은 `Entity`라 서로 호환된다 → `equals`가 타입을 못 가른다.

## 등장 이력

- 2026-08-04 · shared `UniqueId` 리뷰 · `private` 선택이 왜 옳았는지 설명받음

## 인출 기록

- (없음)

## 관련 개념

- [[always-valid-value-object]] — VO 정의 시 함께 지켜야 할 규칙
- [[entity-vs-value-object]] — 상속 예외가 `Entity.equals` 함정으로 이어지는 지점
