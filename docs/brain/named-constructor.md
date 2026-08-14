---
status: 설명만 들음
first-seen: 2026-08-13
---

# Named Constructor (Static Factory Method)

생성자를 private으로 감추고, 의미 있는 이름의 static 메서드로만 객체 생성을 허용하는 패턴.

## 핵심 (재구성 단서)

- 유도: 생성 입구를 좁힌다 → 모든 인스턴스가 검증·정규화를 거친 경로로만 태어난다 → always-valid가
  보장됨 + 호출부가 도메인 어휘로 읽힌다(`OrderStatus.pending()` vs `new OrderStatus('pending')`).
- 워크드 예제: `src/order/domain/value-objects/order-status.vo.ts` — 값이 5개로 유한해서
  `create(value)` 하나 대신 상태별 메서드 5개(`pending()`…`cancelled()`) + 외부 문자열용
  `fromString`(검문소). 반면 `Email`/`Money`는 값이 무한해서 `create` 하나.
- 함정: TS의 private constructor는 컴파일타임 방어일 뿐 — 목적은 정상 경로에서 생성 지점을 좁히는 것.
- 함정: factory가 매번 새 인스턴스를 반환해도 VO는 `equals`(값 비교)로 동등성을 판단하므로 문제없다.

## 등장 이력

- 2026-08-13 · OrderStatus VO 강의 분석 · Email/Money의 create와 비교하며 리뷰

## 인출 기록

- (없음)

## 관련 개념

- [[always-valid-value-object]] — 이 패턴이 지탱하는 성질
- [[typescript-structural-typing]] — private 멤버가 구조적 타이핑 우회도 막는 이유
