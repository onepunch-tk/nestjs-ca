---
status: 직접 다뤄봄
first-seen: 2026-08-04
---

# Always-valid Value Object

VO는 생성자에서 검증해서, 유효하지 않은 인스턴스가 애초에 존재할 수 없게 만든다.

## 핵심 (재구성 단서)

- 유도: 생성자가 유일한 입구다 → 거기서 막으면 잘못된 값을 가진 인스턴스가 세상에 없다 →
  그 타입을 파라미터로 받는 모든 코드가 **"검증은 이미 끝났다"를 가정**할 수 있다 → 방어 코드가
  쓰는 쪽마다 중복되지 않는다.
- 워크드 예제(구멍): `src/shared/domain/value-objects/unique-id.vo.ts`는 검증이 없어
  `new UniqueId('').getValue()`가 `''`를 돌려준다. 생성자에 UUID 패턴 검사 + `throw`를 넣으면 닫힌다.
- 짝 규칙: VO의 "변경"은 `this`를 고치지 말고 새 인스턴스를 반환한다 —
  `add(n)` → `new Money(this.amount + n)`.
- 짝 규칙: 원시 타입 강박(primitive obsession) 탈출 도구. `string email` → `Email` VO로 바꾸면
  형식 검증이 한 곳에 모이고 파라미터 순서 실수를 컴파일러가 잡는다.
- 함정: TS의 `readonly`/`private`는 컴파일타임 전용. `(vo as any).value = 'x'`로 뚫린다.
  진짜 런타임 불변은 `Object.freeze(this)`(대입하는 쪽이 strict mode여야 TypeError), 또는 `#value`.
  다만 대부분은 private + getter로 충분 — 정상 경로에 대입 통로가 없으므로.

## 등장 이력

- 2026-08-04 · shared `UniqueId` 리뷰 · 현재 코드에 검증이 없다는 지적을 받음(수정은 미적용)
- 2026-08-05 · `Sku.SKU_PATTERN`에 하이픈 허용을 직접 추가 + `Product.create`가 원시값을 받아
  내부에서 `Money.create`/`Sku.create`를 호출하도록 변경 · VO 생성 지점을 팩토리 한 곳으로 모은 셈.
  대가는 `(price: number, currency: string)`이 나란히 서서 순서 실수를 컴파일러가 못 잡는 것
- 2026-08-13 · OrderStatus VO 강의 분석 · `fromString`이 생성 검문소, `transitionTo`가 전이 검문소로
  같은 원리가 상태 전이까지 확장되는 것을 확인

## 인출 기록

- (없음)

## 관련 개념

- [[entity-vs-value-object]] — 왜 VO여야 하는지, VO의 불변성이 무엇을 지탱하는지
- [[typescript-structural-typing]] — VO 내부 값을 private로 둬야 하는 또 다른 이유
