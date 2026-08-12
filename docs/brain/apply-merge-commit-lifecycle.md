---
status: 직접 다뤄봄
first-seen: 2026-08-12
---

# apply-merge-commit-lifecycle

한 줄 정의: NestJS CQRS에서 aggregate의 도메인 이벤트는 기록(apply) → 배선(mergeObjectContext) → 방출(commit)의 3단계를 모두 거쳐야 실제 발행된다.

## 핵심 (재구성 단서)

- AggregateRoot의 `publish`/`publishAll`은 **빈 메서드(no-op)** — 상속만으로는 아무것도 발행되지 않는다 (@nestjs/cqrs v11 `dist/aggregate-root.js`).
- `apply(event)` = autoCommit이 꺼진 기본값에선 내부 Symbol 배열(INTERNAL_EVENTS)에 push + 엔티티에 `on{이벤트명}` 메서드가 있으면 호출(이벤트 소싱 훅). 외부 발행은 없다.
- `mergeObjectContext(obj)` = 새 wrapper가 아니라 **그 인스턴스의 publish/publishAll을 EventBus 호출 함수로 교체**해 같은 객체를 반환 (`dist/event-publisher.js`).
- `commit()` = `publishAll(쌓인 배열)` 호출 후 배열 비움 — 두 줄이 전부.
- 왜 3단 분리: 엔티티는 static 팩토리로 생성돼 DI를 못 받으므로 EventBus를 알 수 없다 → 도메인은 기록까지, 배선과 방출 시점 결정은 application이 맡는다.
- 워크드 예제: `register-customer.handler.ts:37-48` — `mergeObjectContext(Customer.register(...))` → `save` → `commit()`. apply가 merge보다 먼저 실행돼도 되는 이유: 발행은 commit 시점이고 그때는 배선이 끝나 있다.
- save 성공 후에만 commit = DB 트랜잭션과 같은 사고방식 — save가 throw하면 commit 미도달, 존재하지 않는 고객에게 알림이 나가지 않는다.

## 등장 이력

- 2026-08-12 · customer 가입 알림 이벤트 배선 · 직접 다뤄봄

## 인출 기록

- 2026-08-12 · "merge 없이 save+commit만 하면 어떻게 되나" 예측 과제 · 성공 — (b) 예측·실험 일치, 근거로 no-op publish 미교체를 정확히 지목
- 2026-08-12 · apply(장부 push)/merge(메서드 교체)/commit(publishAll 후 배열 비움) 3단계를 자기 말로 재구성 · 성공
- 2026-08-12 · "CustomerDeletedEvent라면 apply·commit은 각각 어디서?" · (대기)

## 관련 개념

- [[domain-event]] — 이 생애주기가 나르는 메시지
- [[cqrs-command-bus]] — command/query와 같은 계열인 event bus로의 배선
- [[di-token-for-interface]] — 방출된 이벤트를 받는 핸들러가 NOTIFICATION_SERVICE를 주입받는 방식
