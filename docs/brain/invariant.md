---
status: 설명만 들음
first-seen: 2026-08-13
---

# Invariant (불변식)

객체(또는 시스템)를 언제 관찰해도 항상 참이어야 하는 조건.

## 핵심 (재구성 단서)

- 유도: "항상 참"을 보장하려면 → 조건이 깨질 수 있는 모든 통로(생성, 변경)에서 검사해야 한다 →
  통로가 적을수록 보장이 쉽다 → 그래서 private constructor(생성 통로 축소)와 불변성(변경 통로
  제거)이 불변식의 도구가 된다.
- 워크드 예제: `src/order/domain/value-objects/order-status.vo.ts`의 불변식 = "value는 5개 상태 중
  하나, 전이는 VALID_TRANSITIONS 경로로만". 생성 통로는 `fromString`의 검사가, 전이 통로는
  `transitionTo`의 검사가 지킨다.
- 용어 주의: 강의류에서 "state variance/invariance"로 부르기도 하지만 표준 용어는 invariant.

## 등장 이력

- 2026-08-13 · OrderStatus VO 강의 분석 · 용어 교정과 함께 정리

## 인출 기록

- (없음)

## 관련 개념

- [[always-valid-value-object]] — 생성 시점 불변식 강제의 구체 패턴
- [[finite-state-machine]] — 전이 불변식을 데이터로 표현하는 방법
