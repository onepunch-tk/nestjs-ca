---
status: 직접 다뤄봄
first-seen: 2026-08-13
---

# Typestate

상태 기계의 전이 규칙을 타입 시스템에 인코딩해서, 잘못된 상태에서의 연산 호출을 컴파일 타임에 거부하는 패턴.

## 핵심 (재구성 단서)

- 유도: 상태를 제네릭 파라미터에 복제한다(`OrderStatus<'pending'>`) → factory가 상태별로 좁힌
  타입을 반환 → 전이 메서드에 `this: OrderStatus<'pending'>` 파라미터(TS 전용, 컴파일 후 소멸)로
  수신자를 제약 → 잘못된 체인은 TS2684로 저장 전에 빨간 줄.
- 워크드 예제: `src/order/domain/value-objects/order-status-tk.vo.ts` — 직접 작성.
  `OrderStatusTk.pending().confirm()`은 통과, shipped 인스턴스의 `confirm()`은
  `The 'this' context of type 'OrderStatusTk<"shipped">' is not assignable ...` (TS2684).
- 한계의 유도: 컴파일러는 코드에 적힌 것만 안다 → DB 재수화(`fromString`)의 결과는 union
  (`OrderStatus<OrderStatusValue>`) → 전이 호출 불가 → `this is OrderStatus<K>` 타입 가드(런타임
  검사를 타입 좁히기로 변환하는 다리)로 좁혀야 함 → **런타임 검증은 대체 불가, 용도가 다른 도구**.
- 함정: 타입은 컴파일 시 전부 소거(type erasure) → `as any`, JS 호출자, DB 유입은 못 막는다.
- 확장: canXxx 질의를 `this is VO<'상태'>` predicate로 선언(대응 전이의 this 타입과 동일하게)하면
  질의의 긍정 답변이 후속 전이 호출까지 정당화한다 — 단 predicate와 this 타입은 수동 동기화.
- 열린 실험: S를 실제로 쓰는 멤버(`value: T`)를 빼면 방어가 유지되는가 — 인출 기록 참조.

## 등장 이력

- 2026-08-13 · typestate 실험 · 강의 밖에서 스스로 발견해 order-status-tk.vo.ts를 직접 작성,
  private ctor + static factory + this 파라미터까지 자력 수렴 (남은 것: 33행 옛 이름 호출)
- 2026-08-13 · tk 파일에 전이 4종(cancel union 포함)과 is()까지 자력 완성, 프로젝트 컴파일 통과.
  vo와의 남은 갭(fromString·런타임 검증·canXxx)을 스스로 질문
- 2026-08-13 · "canXxx가 굳이 필요한가"를 스스로 제기 → canXxx를 타입 가드로 구현(멘토 적용)하며
  "정적으로 아는 값엔 불필요, union 값에선 가드로 강해짐"을 확인

## 인출 기록

- 2026-08-13 · "S를 쓰는 멤버가 없는 no-phantom 변형도 TS2684가 날까?" 예측 실험 (대기)

## 관련 개념

- [[finite-state-machine]] — 같은 전이 표를 런타임 데이터 대신 메서드 시그니처로 옮긴 것
- [[typescript-structural-typing]] — 열린 실험의 힌트가 있는 곳
- [[named-constructor]] — 상태별 factory가 좁힌 타입을 반환하는 입구
