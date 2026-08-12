---
status: 직접 다뤄봄
first-seen: 2026-08-12
---

# domain-event

한 줄 정의: 도메인에서 이미 일어난 사실(과거형)의 불변 기록 — 발생 지점인 도메인이 클래스를 소유하고, 반응(핸들러)은 바깥 레이어가 맡는다.

## 핵심 (재구성 단서)

- command는 "해줘"(요청·미래형·application 소유), event는 "됐다"(사실·과거형·domain 소유) — 시제가 소유 레이어를 가른다.
- 기계적 근거: 이벤트를 emit하는 코드가 도메인 안에 있으므로(엔티티의 `apply` 호출) 이벤트 클래스가 바깥 레이어에 있으면 안쪽→바깥 import가 생겨 [[dependency-rule]] 위반.
- 워크드 예제: `src/customer/domain/entities/customer.entity.ts:89`의 `apply(new CustomerRegisteredEvent(id.getValue(), email.getValue(), firstName))` — 클래스는 `domain/events/customer-registered.even.ts`(파일명 `.even` 오타), 구독자는 `application/events/customer-registered.handler.ts`의 `@EventsHandler`.
- 도메인은 누가 듣는지 모른다 — 데이터 shape 정의와 emit까지만 책임.
- 함정: 핸들러가 `event.email`처럼 특정 provider에만 맞는 필드를 꺼내 쓰면 application이 하위 디테일에 결합 — `recipientId`만 넘기고 상세 조회는 어댑터 책임으로.

## 등장 이력

- 2026-08-12 · customer 가입 알림(notification port/adapter + CQRS event) · 직접 다뤄봄

## 인출 기록

- (없음)

## 관련 개념

- [[apply-merge-commit-lifecycle]] — 이 이벤트가 실제 발행되기까지의 3단 메커니즘
- [[dependency-rule]] — 이벤트 클래스를 domain에 두는 기계적 근거
- [[cqrs-command-bus]] — command(요청)와의 시제·소유 대비
